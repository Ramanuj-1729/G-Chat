const socket = io()
let username;
const textarea = document.querySelector('#textarea');
console.log();
const chatArea = document.querySelector('.chat_area');
const volumeBtn = document.querySelector('.volumeBtn');
const messageArea = document.querySelector('.message_area');
const emoji = document.querySelector('.emoji');
const emojiPicker = document.querySelector('.emojiPicker');
const sendBtn = document.querySelector('.sendBtn');
let mute = false;
let emojiPickerOn = false;

function muteUnmute() {
    if (mute === false) {
        volumeBtn.src = 'images/mute.svg';
        mute = true;
    }
    else if (mute === true) {
        volumeBtn.src = 'images/unmute.svg';
        mute = false;
    }
}

do {
    username = prompt('Enter Your Name')
} while (!username)

emoji.addEventListener('click', (e)=>{
    if(emojiPickerOn === true){
        emojiPickerOn = false;
        emojiPicker.style.display = 'none';
    }
    else if(emojiPickerOn === false){
        emojiPickerOn = true;
        emojiPicker.style.display = 'block';
    }
});

emojiPicker.addEventListener('emoji-click', (e)=>{
    textarea.value += e.detail.emoji.unicode;
});

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(textarea.value);
    }
});

sendBtn.addEventListener('click', (e) =>{
    sendMessage(textarea.value);
});

function sendMessage(message) {
    if(message === ''){
        return;
    }
    let msg = {
        user: username,
        message: message.trim()
    }
    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // send to server
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');
    let currTime = new Date();
    let hours = currTime.getHours();
    let minutes = currTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    let markup = `
        <h4>${type === 'outgoing' ? 'Me' : msg.user}</h4>
        <p>${msg.message}</p>
        <span>${hours}:${minutes} ${ampm}</span>
    `
    mainDiv.innerHTML = markup;
    chatArea.appendChild(mainDiv);
}

// Recieve messages
socket.on('message', (msg) => {
    let recieveSound = document.createElement('audio');
    recieveSound.setAttribute('src', 'sounds/recieveSound.wav');
    recieveSound.setAttribute('muted', 'true');
    if (mute === false) {
        recieveSound.play();
    }
    appendMessage(msg, 'incoming');
    scrollToBottom();
})

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}
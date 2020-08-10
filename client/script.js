// getting some neccessary elements
const body = document.getElementById('body');
const formInput = document.getElementById('formInput');
const message = document.getElementById('message');
const chatArea = document.getElementById('chatArea');
const sendButton = document.getElementById('sendButton');
const moon = document.getElementById('moon');
const sun = document.getElementById('sun');
const alerts = document.getElementById('alerts');
const modal = document.getElementById('modal');
const nameForm = document.getElementById('nameForm');
const name = document.getElementById('name');

// getting the total number of messages in the chat
const windowHeight = window.screen.height;
const validText = /^[0-9a-zA-Z]+$/;

let messageNumber = 0;

// getting the name
let userName = localStorage.getItem('name');
// get mode preference
let mode = localStorage.getItem('mode') || 'light';


if (!userName)
	promptUser();

if (mode === 'dark')
	toggleDarkMode();


const socket = io("/");

if (userName)
	socket.emit('user_connected', userName);

// adding the message in UI if got one
socket.on('message_received', (data) => {
	addChild(data);
})

// intimates if a user had left the chat
socket.on('user_disconnected', userName => {
	addAlert(`${userName} disconnected`, 'danger');
});

// intimates if a user joins
socket.on('new_user', userName => {
	addAlert(`${userName} connected`, 'success');
});


// submit listener
formInput.addEventListener('submit', e => {
	e.preventDefault();
	const newMessage = message.value;
	// check for empty input and input with only white spaces
	if (newMessage && /\S/.test(newMessage)){
		socket.emit('new_message', newMessage);
		addChild({user: 'You', message: newMessage});
	}
	message.value = '';
});

function promptUser() {
	userName = localStorage.getItem("name");
	sendButton.disabled = true;
	modal.style.display = "block";
	nameForm.addEventListener('submit', () => {
		if (name.value){
			userName = name.value;
			localStorage.setItem('name', userName);
			modal.style.display = "none";
		}
		else
			promptUser();
	});
}

// adding message in UI function
const addChild = (data) => {
	const messageContainer = document.createElement('li');
	const userNameContainer = document.createElement('small');
	const userMessageContainer = document.createElement('p');
	messageContainer.classList.add('chat-list-item');
	userNameContainer.innerText = data.user === 'You'? '' : data.user + ': ';
	messageContainer.append(userNameContainer);
	// neglecting username for our text
	userMessageContainer.innerText = data.message;
	messageContainer.append(userMessageContainer);
	// append our message to right side
	if (data.user === 'You')
		messageContainer.classList.add("our-message");
	chatArea.append(messageContainer);
	messageNumber++;
	if (messageNumber >= parseInt(windowHeight / 80))
		chatArea.firstChild.remove();
}

// adding Alert in UI
const addAlert = (data, type, permanent=false) => {
	alerts.className = '';
	alerts.classList.add('alert');
	alerts.classList.add(`alert-${type}`);
	alerts.innerHTML = data;
	setTimeout(() => {
		alerts.innerHTML = '';
		alerts.className = '';
	}, 5000);
}


function toggleDarkMode(e) {
	console.log('in toggleDarkMode')
	localStorage.setItem('mode', 'dark');
	body.classList.add('dark');
}

function toggleLightMode(e) {
	localStorage.setItem('mode', 'light');
	body.classList.remove('dark');
}
// getting some neccessary elements
const body = document.getElementById('body');
const formInput = document.getElementById('formInput');
const message = document.getElementById('message');
const chatArea = document.getElementById('chatArea');
const sendButton = document.getElementById('sendButton');
const moon = document.getElementById('moon');
const sun = document.getElementById('sun');
const alerts = document.getElementById('alerts');

// getting the total number of messages in the chat
let messageNumber = 0;
const windowheight = window.screen.height;

// getting the name
const userName = prompt('Your Name:');

const validText = /^[0-9a-zA-Z]+$/;

if (!userName || userName.length <= 3 || !userName.match(validText)){
	addAlert('Not a valid Username', 'danger');
	sendButton.disabled = true;
}

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


const socket = io("/");

socket.emit('user_connected', userName);

socket.on('already_exists', userName => {
	addAlert('Username Already Exists', 'danger');
	sendButton.disabled = true;
})

// adding the message in UI if got one
socket.on('message_received', (data) => {
	addChild(data);
})

// intimates if a user had left the chat
socket.on('user_disconnected', userName => {
	console.log(`${userName} disconnected`);
	addAlert(`${userName} disconnected`, 'danger');
});

// intimates if a user joins
socket.on('new_user', userName => {
	console.log(`${userName} connected`);
	addAlert(`${userName} connected`, 'success');
});

// adding message in UI function
const addChild = (data) => {
	const messageContainer = document.createElement('li');
	const userNameContainer = document.createElement('small');
	const userMessageContainer = document.createElement('p');
	messageContainer.classList.add('message');
	messageContainer.classList.add('bg-primary');
	userNameContainer.innerText = data.user === 'You'? '' : data.user + ': ';
	messageContainer.append(userNameContainer);
	// neglecting username for our text
	userMessageContainer.innerText = data.message;
	messageContainer.append(userMessageContainer);
	// append our message to right side
	if (data.user === 'You')
		messageContainer.classList.add("ourMessage");
	chatArea.append(messageContainer);
	messageNumber++;
	if (messageNumber >= parseInt(windowheight / 80))
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

// toggle light mode
sun.onclick = e => {
	body.classList.add('dark');
}

// toggle dark mode
moon.onclick = e => {
	body.classList.remove('dark');
}
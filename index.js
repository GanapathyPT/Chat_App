// required modules
const express = require('express');
const app = express();
const http = require("http").createServer(app);

const port = 3000;

const io = require("socket.io")(http);

// local variable to store our users 
// database is not yet implemented
// will implemente db soon
users = {};

// executes when a user connects
io.on("connection", socket => {
	// sending alerts to othe users about the joining of a new user
	socket.on('user_connected', userName => {
		if (Object.values(users).includes(userName)){
			socket.emit('already_exists', userName);
		}
		else{
			users[socket.id] = userName;
			socket.broadcast.emit('new_user', userName);
		}
	});

	// sends the message to other users from the current user
	socket.on('new_message', newMessage => {
		socket.broadcast.emit('message_received', {message:newMessage, user:users[socket.id]})
	});

	// sending alerts to others about the disconnection of the user
	socket.on('disconnect', () => {
		socket.broadcast.emit('user_disconnected', users[socket.id])
	});

});

// serving client folder static files
app.use(express.static('client'));

http.listen(port, () => {
	console.log('Server started at port: ' + port);
});
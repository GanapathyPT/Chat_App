const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const io = require("socket.io")(http);

const {
	createRoom,
	joinRoom,
	removeUser,
} = require("./socketHandlers");

const port = process.env.PORT || 8000;

app.use(cors());
app.options("*", cors());

io.on("connection", socket => {

	socket.on("createRoom", ({ userName, roomName, roomPassword }) => {
		createRoom(userName, roomName, roomPassword, socket);
	});

	socket.on("joinRoom", ({ userName, roomName, roomPassword }) => {
		joinRoom(userName, roomName, roomPassword, socket);
	});

	socket.on("sendNewMessage", ({ userName, roomName, newMessage }) => {
		socket
			.broadcast
			.to(rooms[roomName].id)
			.emit("receiveMessage", 
				{ userName, newMessage }
			);
	});

	socket.on("leaveRoom", ({ userName, roomName }) => {
		removeUser(userName, roomName, socket);
		socket.emit("left");
	});

	socket.on("disconnect", () => {
		removeUser(socket.username, socket.room, socket);
	});

});


app.use(express.static('frontend/build'));

http.listen(port, () => {
	console.log('Server started at port: ' + port);
});

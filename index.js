const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const io = require("socket.io")(http);

const port = process.env.PORT || 8000;

app.use(cors());
app.options("*", cors());

rooms = {};

io.on("connection", socket => {

	socket.on("createRoom", ({ userName, roomName }) => {

		if (!userName || !roomName){
			socket.emit("alert", { msg: "invalid input", badge: "error" });
			return;
		}

		if (!!rooms[roomName])
			socket.emit("alert", { msg: "room already exists", badge: "error" });
		else {
			rooms[roomName] = { id: socket.id, users:[userName] };
			socket.join(socket.id);
			socket.emit("joined", [userName]);
			socket.emit("alert", { msg: `created room:- ${roomName}`, badge: "success" })

			socket.username = userName;
			socket.room = roomName;
		}
	});

	socket.on("joinRoom", ({ userName, roomName }) => {

		if (!userName || !roomName){
			socket.emit("alert", { msg: "invalid input", badge: "error" });
			return;
		}

		if (!!rooms[roomName]){
			socket.join(rooms[roomName].id);
			rooms[roomName].users.push(userName);
			socket.emit("joined", rooms[roomName].users);
			socket
				.broadcast
				.to(rooms[roomName].id)
				.emit("alert", 
					{ msg: `${userName} joined`, badge: "success" }
				);
			socket
				.broadcast
				.to(rooms[roomName].id)
				.emit("userJoined", userName);
			socket.emit("alert", { msg: `joined to ${roomName}`, badge: "success" })

			socket.username = userName;
			socket.room = roomName;
		}
		else 
			socket.emit("alert", { msg: "room doesn't exists", badge: "error" });
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
		removeUser(userName, roomName);
		socket.emit("left");
	});

	socket.on("disconnect", () => {
		removeUser(socket.username, socket.room);
	});

	const removeUser = (userName, roomName) => {
		const room = rooms[roomName]
		if (!!room){

			socket.leave(room.id);
			// const index = room.users.indexOf(userName);
			rooms[roomName].users = room.users.filter(user => user !== userName);

			socket
				.broadcast
				.to(room.id)
				.emit("alert", 
					{ msg: `${userName} left`, badge: "error" }
				);
			socket
				.broadcast
				.to(room.id)
				.emit("userLeft", userName);

			if (!room.users.length){
				delete rooms[roomName];
			}
		}
	}

});


app.use(express.static('frontend/build'));

http.listen(port, () => {
	console.log('Server started at port: ' + port);
});

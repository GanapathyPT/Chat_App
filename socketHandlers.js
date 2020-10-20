
rooms = {};

const createRoom = (userName, roomName, roomPassword, socket) => {
	if (!userName || !roomName || !roomPassword){
		socket.emit("alert", { msg: "invalid input", badge: "error" });
		return false;
	}

	if (!!rooms[roomName]){
		socket.emit("alert", { msg: "room already exists", badge: "error" });
		return false;
	}

	rooms[roomName] = { id: socket.id, users:[userName], password: roomPassword };
	socket.join(socket.id);
	socket.emit("joined", [userName]);
	socket.emit("alert", { msg: `created room:- ${roomName}`, badge: "success" })

	socket.username = userName;
	socket.room = roomName;
	return true;
}

const joinRoom = (userName, roomName, roomPassword, socket) => {
	if (!userName || !roomName || !roomPassword){
		socket.emit("alert", { msg: "invalid input", badge: "error" });
		return false;
	}

	if (!rooms[roomName]){
		socket.emit("alert", { msg: "room doesn't exists", badge: "error" });
		return false;
	}

	if (rooms[roomName].password !== roomPassword){
		socket.emit("alert", { msg: "wrong password", badge: "error" });
		return false;
	}

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

	return true;
}

const removeUser = (userName, roomName, socket) => {
	const room = rooms[roomName]
	if (!!room){

		socket.leave(room.id);
		rooms[roomName].users = room.users.filter(user => user !== userName);

		socket
			.broadcast
			.to(room.id)
			.emit("alert", 
				{ msg: `${userName} left`, badge: "danger" }
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

module.exports = {
	createRoom,
	joinRoom,
	removeUser,
}
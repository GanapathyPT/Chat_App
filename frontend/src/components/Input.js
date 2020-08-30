import React, { useState, useContext, useEffect } from 'react';

import { UserNameContext } from "../contexts/UserNameContext";
import { ChatContext } from "../contexts/ChatContext";
import { SocketContext } from "../contexts/SocketContext";

export default function Input() {

	const [nameModalIsOpen, setNameModalIsOpen] = useState('display-none');
	const [name, setName] = useState('');
	const [newMessage, setNewMessage] = useState('');

	const { UserName, setUserName } = useContext(UserNameContext);
	const { refreshMessage } = useContext(ChatContext);
	const socket = useContext(SocketContext);

	useEffect(() => {

		setNameModalIsOpen(UserName ? 'display-none' : "modal");

		socket.emit("user_connected", UserName);

		socket.on("message_received", message => {
			const oldMessages = JSON.parse(localStorage.getItem("g-chatting-messages") || '[]')
			localStorage.setItem("g-chatting-messages", JSON.stringify([...oldMessages,message]))
			refreshMessage()
		})

	}, [])

	const addName = e => {
		e.preventDefault();
		setUserName(name);
		socket.emit("user_connected", name);
		setNameModalIsOpen("display-none");
	}

	const addMessage = e => {
		e.preventDefault();
		socket.emit('new_message', newMessage);
		const oldMessages = JSON.parse(localStorage.getItem("g-chatting-messages") || '[]')
		localStorage.setItem("g-chatting-messages", JSON.stringify([...oldMessages, {user:'You',message:newMessage}]))
		setNewMessage('');
		refreshMessage()
	}

	return (
		<>
		<form className="form-container">
			<input 
				value={newMessage} 
				onChange={e => setNewMessage(e.target.value)} 
				type="text" 
				className="input-field" autoFocus 
			/>
			<button onClick={addMessage} type="submit" className="btn">Send</button>
		</form>
		<div className={nameModalIsOpen} >
			<div className="modal-container">
				<h2>Your Name:</h2>
				<form>
					<input 
						value={name} 
						onChange={e => setName(e.target.value)} 
						className="input-field" 
						type="text" autoFocus 
					/>
					<button type="submit" onClick={addName} className="btn">OK</button>
				</form>
			</div>
		</div>
		</>
	)
}
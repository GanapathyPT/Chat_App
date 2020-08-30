import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {

	const [Messages, setMessages] = useState([])

	const refreshMessage = () => {
		setMessages(JSON.parse(localStorage.getItem("g-chatting-messages")))
	}

	useEffect(() => {
		localStorage.setItem("g-chatting-messages", [])
	}, [])

	return (
			<ChatContext.Provider value={{Messages, refreshMessage}}>
				{ children }
			</ChatContext.Provider>
		)
}
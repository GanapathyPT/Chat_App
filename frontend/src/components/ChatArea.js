import React, { useContext, useRef, useEffect } from 'react';

import { ChatContext } from "../contexts/ChatContext";


export default function ChatArea() {

	const { Messages } = useContext(ChatContext);

	const msgRef = useRef()

	useEffect(() => {
		if(msgRef.current){
			msgRef.current.scrollIntoView(true);
		}
	}, [Messages])


	return (
		<div className="chat-container">
			<ul>
				{
					Messages.map((msg,index) => {
						if(index === Messages.length - 1)
							return (<li 
										ref={msgRef}
										key={msg.message} 
										className={`chat-list-item ${msg.user === 'You'?'our-message': ''}`}
										autoFocus
									>
										<small>{msg.user === "You" ? '' : msg.user}</small>
										<p>{msg.message}</p>
									</li>)
						return (<li 
									key={msg.message} 
									className={`chat-list-item ${msg.user === 'You'?'our-message': ''}`}
									autoFocus
								>
									<small>{msg.user === "You" ? '' : msg.user}</small>
									<p>{msg.message}</p>
								</li>)
					})
				}
			</ul>
		</div>
	)
}
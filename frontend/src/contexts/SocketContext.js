import React, { createContext, useState } from "react";
import io from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketProvider({ children }) {

	const [socket] = useState(io('http://127.0.0.1:8000/'));

	return (
			<SocketContext.Provider value={socket}>
				{ children }
			</SocketContext.Provider>
		)
}
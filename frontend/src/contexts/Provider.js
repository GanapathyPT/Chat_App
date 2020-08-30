import React from 'react';
import ThemeProvider from "./ThemeContext";
import UserNameProvider from "./UserNameContext";
import ChatProvider from "./ChatContext";
import SocketProvider from "./SocketContext";

export default function Provider({ children }) {
	return (
		<SocketProvider>
			<ThemeProvider>
				<UserNameProvider>
					<ChatProvider>
						{ children }
					</ChatProvider>
				</UserNameProvider>
			</ThemeProvider>
		</SocketProvider>
		)
}
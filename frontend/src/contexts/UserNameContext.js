import React, { useState, createContext, useEffect } from 'react';

export const UserNameContext = createContext();

export default function UserNameProvider({ children }) {


	const [UserName, setUserName] = useState(localStorage.getItem("g-chatting-user-name"));

	useEffect(() => {

		localStorage.setItem("g-chatting-user-name", UserName)

	}, [UserName]);

	return (
			<UserNameContext.Provider value={{UserName, setUserName}}>
				{children}
			</UserNameContext.Provider>
		)
}
import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {

	const [Theme, setTheme] = useState(localStorage.getItem('g-chatting-theme'));

	useEffect(() => {

		localStorage.setItem("g-chatting-theme", Theme)

	}, [Theme])

	return (

			<ThemeContext.Provider value={{Theme, setTheme}}>
				{children}
			</ThemeContext.Provider>

		)

}
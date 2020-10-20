import React, { useState, useEffect } from 'react';

import {
	createMuiTheme,
	ThemeProvider,
} from "@material-ui/core";

import ChatApp from "./components";
import Provider from "./contexts/SocketContext";

const lightTheme = {
	width: "100vw",
	height: "100vh",
	backgroundColor: "whitesmoke",
	color: "black",
}

const darkTheme = {
	width: "100vw",
	height: "100vh",
	backgroundColor: "#333",
	color: "whitesmoke",
}

function App() {

	const [themeColor, setThemeColor] = useState("light");

	useEffect(() => {
		const theme = localStorage.getItem("theme");
		if (!!theme)
			setThemeColor(theme);
		else
			localStorage.setItem("theme","light");
	}, [])

	useEffect(() => {
		localStorage.setItem("theme", themeColor);
	}, [themeColor])

	const theme = createMuiTheme({
		palette: {
	        primary: {
	            main: themeColor === "light" ? "#007bff" : "#444",
	        },
	        secondary: {
	        	main: themeColor === "light" ? "#222" : "#fff"
	        }
	    }
	})

  return (
  	<ThemeProvider theme={theme}>
	    <Provider>
	    	<div style={themeColor === "light" ? lightTheme : darkTheme}>
	    		<ChatApp themeColor={themeColor} setThemeColor={setThemeColor} />
	    	</div>
	    </Provider>
    </ThemeProvider>
  );
  
}

export default App;

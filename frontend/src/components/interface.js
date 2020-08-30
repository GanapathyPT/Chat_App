import React, { useContext } from 'react';

import { ThemeContext } from "../contexts/ThemeContext";

import Header from './Header';
import ChatArea from "./ChatArea";
import Input from "./Input";

export default function Interface() {

	const { Theme } = useContext(ThemeContext);

	return (
		<div className={`container ${Theme}`}>
			<Header />
			<ChatArea />
			<Input />
		</div>
	)
}
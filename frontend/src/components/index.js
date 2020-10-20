import React, {
	useState, 
	useEffect, 
	useContext, 
	useRef, 
	Fragment,
} from 'react';
import {
	makeStyles,
	Grid,
	Container,
	IconButton,
	Paper,
	TextField,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
	SwipeableDrawer,
} from "@material-ui/core";

import Alert from '@material-ui/lab/Alert';

import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import MenuIcon from '@material-ui/icons/Menu';

import { SocketContext } from "../contexts/SocketContext";

export default function({ themeColor, setThemeColor }) {

	const [joinCreateRoomModal, setJoinCreateRoomModal] = useState(false);
	const [joinCreateRoomTitle, setJoinCreateRoomTitle] = useState("");
	const [userNameModal, setUserNameModal] = useState(false);
	const [inRoom, setInRoom] = useState(false);
	const [alertMessage, setAlertMessage] = useState({});
	const [sideBarOpen, setSideBarOpen] = useState(false);

	const [userName, setUserName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	const socket = useContext(SocketContext);

	const lastMessage = useRef();

	const useStyle = makeStyles({
		message: {
			position: "relative",
			maxWidth: "50%",
			padding: "7px 10px",
			margin: "5px 0",
			marginLeft: "auto",
			textAlign: "center",
			backgroundColor: themeColor === "light" ? "#007bff" : "#444",
			color: "whitesmoke",
		},
		othersMessage: {
			position: "relative",
			maxWidth: "50%",
			padding: "7px 10px",
			margin: "5px 0",
			marginRight: "auto",
			textAlign: "center",
			backgroundColor: themeColor === "light" ? "#007bff" : "#444",
			color: "whitesmoke",
		},
		msgUser: {
			position: "absolute",
			top: -5,
			left: 5,
			fontSize: 12,
			backgroundColor: themeColor === "light" ? "#007bff" : "#444",
		},
		icon: {
			color: themeColor === "light" ? "black" : "white",
		},
		textWhite: {
			color: themeColor === "light" ? "black" : "whitesmoke",
		},
		backgroundChange: {
			backgroundColor: themeColor === "light" ? "whitesmoke" : "#333",
			color: themeColor === "light" ? "black" : "whitesmoke",
		}
	});

	const classes = useStyle();

	useEffect(() => {
		const username = localStorage.getItem("username");
		if (!!username){
			setUserName(username);
			setUserNameModal(false);
		} 
		else 
			setUserNameModal(true);

		socket.on("alert", alert => {
			setAlertMessage(alert);
			setTimeout(() => {
				setAlertMessage({});
			}, 3000);
		});

		socket.on("joined", users => {
			setUsers(users);
			setInRoom(true);
		});

		socket.on("left", () => {
			setInRoom(false);
			setRoomName("");
			setUsers([]);
			setJoinCreateRoomModal(false);
			setMessages([]);
		})

		socket.on("receiveMessage", ({ userName, newMessage }) => {
			setMessages(m => [ ...m, { msg: newMessage, user: userName } ]);
		});

		socket.on("userJoined", userName => setUsers(u => [ ...u, userName ]));

		socket.on("userLeft", userName => 
			setUsers(u => 
				u.filter(user => user !== userName))
			);
	}, [socket])

	const setUserNameToLocalStorage = () => {
		localStorage.setItem("username", userName);
		setUserNameModal(false);
	}

	const createRoom = () => {
		socket.emit("createRoom", { userName, roomName });
	}

	const joinRoom = () => {
		socket.emit("joinRoom", { userName, roomName });
	}

	const leaveRoom = () => {
		socket.emit("leaveRoom", { userName, roomName });
	}

	const sendNewMessage = () => {
		if (!!newMessage){
			socket.emit("sendNewMessage", { userName, roomName, newMessage });
			setMessages([ ...messages, { msg: newMessage, user: "You" } ]);
			setNewMessage("");
		}
	}

	const changeTheme = () => {
		if (themeColor === "light")
			setThemeColor("dark");
		else
			setThemeColor("light");
	}
	
	useEffect(() => {
		if (!!lastMessage.current){
			lastMessage.current.scrollIntoView();
			// console.log(lastMessage.current.innerText);
		}
	}, [messages])

	const Theme = () => (
		<div className="theme-button-container">
			<IconButton onClick={changeTheme}>
				{
					themeColor === "light" ?
					<Brightness3Icon className={classes.icon} />
						:
					<WbSunnyIcon className={classes.icon} />
				}
			</IconButton>
		</div>
	)

	const DrawerButton = () => (
		<div className="drawer-button-container">
			<IconButton onClick={() => setSideBarOpen(true)}>
				<MenuIcon className={classes.icon} />
			</IconButton>
		</div>
	)

	const SideBar = () => (
		<SwipeableDrawer 
			open={sideBarOpen} 
			onOpen={() => setSideBarOpen(true)} 
			onClose={() => setSideBarOpen(false)}
		>
			<Grid 
				item 
				xs={0} 
				md={3} 
				container 
				justify="center"
				style={{ textAlign: "center", height:"100%" }}
				className={classes.backgroundChange} 
			>
				<Grid item xs={12}>
					<Typography variant="h4" component="h1">
						Chat App
					</Typography>
				</Grid>
				<Grid item xs={12} style={{marginTop:50}}>
					<Typography variant="p" component="p">
						Users: 
						<List className="users-container">
						{
							users.map((user,index) => (
								<ListItem key={index} button>
									<ListItemAvatar>
										<Avatar
											alt={user.charAt(0)}
											src=""
										/>
									</ListItemAvatar>
									<ListItemText primary={user} />
								</ListItem>
							))
						}
						</List>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Button 
						onClick={() => {
							setSideBarOpen(false);
							leaveRoom();
						}}
						variant="contained" 
						color="secondary"
					>
						Leave Room
					</Button>
				</Grid>
			</Grid>
		</SwipeableDrawer>
	)

	const Room = () => (
		<Grid 
			container 
			justify="center"
			className="total-width"
		>
			<div className="vis">
				<Grid item xs={0} md={6} container justify="center">
					<Grid item xs={12}>
						<Typography variant="h4" component="h1">
							Chat App
						</Typography>
					</Grid>
					<Grid item xs={12} style={{marginTop:50}}>
						{
							!!alertMessage.msg ?
							<Alert severity={setAlertMessage.bagde}>
								{ alertMessage.msg }
							</Alert> : null
						}
						<Typography variant="p" component="p">
							Users: 
							<List className="users-container">
							{
								users.map((user,index) => (
									<ListItem key={index} button>
										<ListItemAvatar>
											<Avatar
												alt={user.charAt(0)}
												src=""
											/>
										</ListItemAvatar>
										<ListItemText primary={user} />
									</ListItem>
								))
							}
							</List>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Button 
							onClick={leaveRoom}
							variant="contained" 
							color="secondary"
						>
							Leave Room
						</Button>
					</Grid>
				</Grid>
			</div>
			<Grid item xs={12} md={4} style={{ position:"relative" }}>
				<Typography variant="h5" component="p">
					{ roomName.toUpperCase() }
				</Typography>
				<div className="siv">
					{
						!!alertMessage.msg ?
						<Alert severity={setAlertMessage.bagde}>
							{ alertMessage.msg }
						</Alert> : null
					}
				</div>
				<div className="full-height">
					{
						messages.map((msg,i) => {
							if (i === messages.length - 1)
								return (
									<Paper 
										ref={lastMessage}
										className={
											msg.user === "You" ? 
											classes.message : 
											classes.othersMessage
										} 
										key={i}
									>
									{
										i - 1 >= 0 &&
										msg.user !== messages[i - 1].user ?
										<small className={classes.msgUser}>
											{msg.user}
										</small> : null
									}
										{msg.msg}
									</Paper>
								)
							return (
								<Paper 
									className={
										msg.user === "You" ? 
										classes.message : 
										classes.othersMessage
									} 
									key={i}
								>
								{
									i - 1 >= 0 &&
									msg.user !== messages[i - 1].user ?
									<small className={classes.msgUser}>
										{msg.user}
									</small> : null
								}
									{msg.msg}
								</Paper>
							)
						})
					}
				</div>
				<div className="input-container">
					<TextInput />
				</div>
			</Grid>
		</Grid>
	)

	const TextInput = () => (
		<Fragment>
			<TextField
				autoFocus
				type="text"
				variant="outlined"
				value={newMessage}
				onChange={e => setNewMessage(e.target.value)}
				style={{ flex:1 }}
				InputProps={{ className: classes.textWhite }}
				onKeyPress={e => {
					if (e.key === "Enter")
						sendNewMessage();
				}}
			/>
			<Button
				variant="contained"
				onClick={sendNewMessage}
				color="primary"
			>
				Send
			</Button>
		</Fragment>
	)

	const HomePage = () => (
		<Grid container justify="center" alignItems="center" className="total-width">
			<Grid item xs={12} md={4} container>
				<Grid item xs={12}>
					<Typography variant="h4" component="h1" style={{margin:20}}>
						Chat App
					</Typography>
					<Divider style={{ marginTop:15,marginBottom:7 }} />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="p" component="p">
						a normal chatting app
					</Typography>
				</Grid>
				<Grid item xs={12} style={{ margin:20 }}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Button 
								onClick={() => {
									setJoinCreateRoomTitle("Create Room");
									setJoinCreateRoomModal(true);
								}}
								variant="contained"
								color="primary"
							>
								Create Room
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button 
								onClick={() => {
									setJoinCreateRoomTitle("Join Room");
									setJoinCreateRoomModal(true);
								}}
								variant="contained"
								color="secondary"
							>
								Join Room
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);

	return (
		<Fragment>
		
			<Theme />

			{

				inRoom ?
				<Fragment>
					<DrawerButton />
					<SideBar />
					<Room />
				</Fragment>
				:
				<Fragment>
					<HomePage />
					
					{/*JoinCreateRoomModal*/}
					<Dialog 
						onClose={() => setJoinCreateRoomModal(false)} 
						open={joinCreateRoomModal}
					>
						<DialogTitle className={classes.backgroundChange}>
							{ joinCreateRoomTitle }
						</DialogTitle>
						<DialogContent className={classes.backgroundChange}>
							{
								!!alertMessage.msg ?
								<Alert severity={setAlertMessage.bagde}>
									{ alertMessage.msg }
								</Alert> : null
							}
							<TextField 
								autoFocus
								value={roomName}
								onChange={e => setRoomName(e.target.value)}
								type="text"
								variant="outlined"
								InputProps={{
							        className: classes.textWhite
								}}
							/>
							<Divider />
						</DialogContent>
						<DialogActions className={classes.backgroundChange}>
							<Button onClick={() => {
								setRoomName("");
								setJoinCreateRoomModal(false);
							}}>
								Cancel
							</Button>
							<Button 
								onClick={
									joinCreateRoomTitle === "Join Room" ? 
									joinRoom : createRoom
								} 
								variant="contained"
								color="primary"
							>
								{ joinCreateRoomTitle }
							</Button>
						</DialogActions>
					</Dialog>

					{/*UserNameModal*/}
					<Dialog 
						open={userNameModal}
					>
						<DialogTitle>
							User Name
						</DialogTitle>
						<DialogContentText>
							<Container>
								To subscribe to this website, 
								please enter your user name here.
								We will ask this only one time.
							</Container>
						</DialogContentText>
						<DialogContent>
							<TextField
								autoFocus
								fullWidth
								value={userName}
								onChange={e => setUserName(e.target.value)}
								type="text"
								variant="outlined"
							/>
						</DialogContent>
						<DialogActions>
							<Button
								disabled={!userName && userName.length < 3}
								onClick={setUserNameToLocalStorage}
								variant="outlined"
								color="primary"
							>
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				</Fragment>

			}

		</Fragment>
	)
}
import React, {useContext, useCallback, useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";

import {SocketContext, socket} from '../context/socket';

import Logo from './Menu/Logo';

import SetName from './Room/SetName';
import LeaveGame from './Room/LeaveGame';
import UserList from './Room/UserList';
import ChatRoom from './Room/ChatRoom';

import GameInterface from './Room/GameInterface';

import '../css/base.css';
import '../css/menu.css';
import '../css/room.css';
import '../css/sidebar.css';

const Room = () => {
    let { roomId } = useParams();
    const history = useHistory();

    const [joined, setJoined] = useState(false);

    // request
    const setNameAndJoin = useCallback((data) => {
        console.log("Setting name to " + data.name);
        socket.emit("setUsername", data.name);

        console.log("requesting to join game " + roomId + "...");
        socket.emit("requestJoinRoom", roomId);
    }, []);

    // confirmed
    const joinGameConfirmed = useCallback((id) => {
        console.log("server confirmed I join room " + id + "!");
        setJoined(true);
    }, []);

    const joinGameDenied = useCallback((msg) => {
        console.log("I could not joined: " + msg);
    
        history.push({pathname: "/", state:{error:msg}});
    }, []);

    const [sidebarActive, setsidebarActive] = useState(true);

    const toggleSidebar = () => setsidebarActive(!sidebarActive);
    
    // Set up
    useEffect(() => {
        // subscribe to socket events
        socket.on("confirmedJoinRoom", (id) => joinGameConfirmed(id));
        socket.on("error", (msg) => joinGameDenied(msg));
    
        // Ask if allowed into the game
        socket.emit("checkIfAllowed", roomId);

        // Mobile has sidebar default hidden
        if (window.innerWidth < 450) {
            setsidebarActive(false);
        }
        
        return () => {
          // before the component is destroyed
          // unbind all event handlers used in this component
            socket.off("confirmedJoinRoom", (id) => joinGameConfirmed(id));
            socket.off("error", (msg) => joinGameDenied(msg));
        };
    }, [socket, joinGameConfirmed, joinGameDenied]);


    return (
        <SocketContext.Provider value={socket}>
        <link rel="stylesheet" href="https://use.typekit.net/njp2ius.css"></link>
            {joined ? (
                <div>
                    <div className="show" onClick={toggleSidebar}> Chat {">"} </div>

                    <div className={sidebarActive ? "sideBar active" : "sideBar"}>
                        <p className="hide" onClick={toggleSidebar}> {"<"} Collapse </p>
                        <div className="roomNameDiv"> <h1 className="roomName"> Lobby {roomId} </h1> </div>
                        <div className="linkDiv"> <h1 className="link"> https://fundaguesser.nl/{roomId} </h1> </div>
                        <ChatRoom />
                        <UserList />
                        <LeaveGame />
                    </div>

                    <GameInterface sidebar={sidebarActive}/>
                </div>
                ) : (
                <div>
                    <Logo/>

                    <div className="menu">
                        <div className="roomNameDiv"> <h1 className="roomName"> Lobby {roomId} </h1> </div>
                        <SetName onNameSubmission={setNameAndJoin}/>
                    </div>
                </div>)
            }
        </SocketContext.Provider>
    );
}

export default Room;
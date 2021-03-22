import React, {useState, useContext, useCallback, useEffect} from 'react';
import {SocketContext} from '../../context/socket';

import { useHistory } from "react-router-dom";

function LeaveGame() {
    const socket = useContext(SocketContext);
    const history = useHistory();

    // confirmed
    const leaveGame = useCallback(() => {
        socket.emit("leaveRoom")
        history.push("/");
    }, []);

    return (
        <div className="leaveDiv">
            <button className="blueButton leaveButton" onClick={leaveGame}>
                Leave Game
            </button>
        </div>
    )
}

export default LeaveGame
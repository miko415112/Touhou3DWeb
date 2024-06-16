import { initWebSocket, joinRoom } from "../services/webSocketService";
import {
  addNotifyMessage,
  addInvitationMessage,
} from "../redux/slices/messageSlice";
import { setFriends, setFriendRequests } from "../redux/slices/accountSlice";
import {
  setPlayers,
  setRoomInfo,
  setBossHealthPoints,
} from "../redux/slices/gameSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const WebSocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.account.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }
    if (token) {
      const socket = initWebSocket(token);
      addListeners(socket);
      setSocket(socket);
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token]);

  function handleMessage(msg) {
    const { text, type } = msg;
    dispatch(addNotifyMessage({ text, type }));
  }

  function handlePlayersChange(playerList) {
    dispatch(setPlayers(playerList));
  }

  function handleRoomInfoChange(roomInfo) {
    dispatch(setRoomInfo(roomInfo));
  }

  function handleInvitation(invitation) {
    dispatch(
      addInvitationMessage(invitation, () => {
        joinRoom(invitation.roomID);
      })
    );
  }

  function handleFriends({ friends }) {
    dispatch(setFriends(friends));
  }

  function handleRequests({ requests }) {
    dispatch(setFriendRequests(requests));
  }

  function handleBossHealthPoints({ bossHealthPoints }) {
    dispatch(setBossHealthPoints(bossHealthPoints));
  }

  function addListeners(socket) {
    socket.on("notifyMessages", handleMessage);
    socket.on("invitation", handleInvitation);
    socket.on("roomPlayers", handlePlayersChange);
    socket.on("roomInfo", handleRoomInfoChange);
    socket.on("friends", handleFriends);
    socket.on("requests", handleRequests);
    socket.on("updateBossHealthPoints", handleBossHealthPoints);
  }

  return <></>;
};

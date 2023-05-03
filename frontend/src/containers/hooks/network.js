import { io } from "socket.io-client";
import axios from "axios";
import { useState, useEffect } from "react";

/* global settings */

const ROOT =
  process.env.NODE_ENV == "production"
    ? window.location.origin
    : "http://localhost:4000";

const instance = axios.create({ baseURL: ROOT });
const socket = io(ROOT, {
  autoConnect: false,
  path: "/api/socket",
});

/* utils */
export const network = {
  /* express endpoint */

  getOauthURL: () => {
    return ROOT + "/auth/oauth";
  },

  signInGame: async (code) => {
    const { data } = await instance.get("/auth/token", {
      params: {
        code,
      },
    });
    const { mikoToken, profile } = data;
    /* setCredentials */
    instance.defaults.headers.common.Authorization = mikoToken;
    socket.auth = {
      token: mikoToken,
    };

    socket.connect();
    return profile;
  },

  logOutGame: () => {
    socket.disconnect();
  },

  openFriendSystem: async (email) => {
    const { data } = await instance.get("/api/friend", {
      params: {
        email,
      },
    });
    return data;
  },

  addFriend: async (email_from, email_to) => {
    const { data } = await instance.post("/api/friend", {
      action: "add",
      email_from,
      email_to,
    });
    return data;
  },

  acceptFriend: async (email_from, email_to) => {
    const { data } = await instance.post("/api/friend", {
      action: "accept",
      email_from,
      email_to,
    });
    return data;
  },

  deleteFriend: async (email_from, email_to) => {
    const { data } = await instance.post("/api/friend", {
      action: "delete",
      email_from,
      email_to,
    });
    return data;
  },

  deleteRequest: async (email_from, email_to) => {
    const { data } = await instance.post("/api/friend", {
      action: "reject",
      email_from,
      email_to,
    });
    return data;
  },

  /* socket event */

  inviteFriend: (email_from, email_to, roomID) => {
    const data = {
      email_from,
      email_to,
      roomID,
    };
    socket.emit("Invite_Friend", data);
  },

  createRoom: (email, name, picture) => {
    const data = {
      email,
      name,
      picture,
    };
    socket.emit("Create_Room", data);
  },

  joinRoom: (email, name, picture, roomID) => {
    const data = {
      email,
      name,
      picture,
      roomID,
    };
    socket.emit("Join_Room", data);
  },

  leaveRoom: (roomID, email) => {
    const data = {
      roomID,
      email,
    };
    socket.emit("Leave_Room", data);
  },

  startGame: (roomID) => {
    const data = {
      roomID: roomID,
    };
    socket.emit("Start_Game", data);
  },

  updatePlayer: (roomID, email, props) => {
    const data = {
      roomID,
      email,
      props,
    };
    socket.emit("Update_Player", data);
  },

  useNetwork: () => {
    const [playerList, setPlayerList] = useState();
    const [netLocation, setNetLocation] = useState();
    const [roomID, setRoomID] = useState();
    const [invitation, setInvitation] = useState();
    const [message, setMessage] = useState({});

    useEffect(() => {
      function handleMessage(msg) {
        setMessage(msg);
      }

      function handleNetLocation(NetLocation) {
        setNetLocation(NetLocation);
      }

      function handleRoomInfo(room) {
        setPlayerList(room.playerList);
        setRoomID(room.roomID);
      }

      function handleInvitation(invitation) {
        setInvitation(invitation);
      }
      socket.on("Message", handleMessage);
      socket.on("NetLocation", handleNetLocation);
      socket.on("RoomInfo", handleRoomInfo);
      socket.on("Invitation", handleInvitation);
      return () => {
        socket.off(handleMessage);
        socket.off(handleRoomInfo);
        socket.off(handleInvitation);
      };
    }, []);

    return {
      playerList,
      netLocation,
      roomID,
      invitation,
      message,
    };
  },
};

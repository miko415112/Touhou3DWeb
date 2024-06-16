import axios from "axios";
import {
  setChatMessages,
  addNotifyMessage,
} from "../redux/slices/messageSlice";
import { setRoomInfo, setPlayers } from "../redux/slices/gameSlice";
import {
  setToken,
  setProfile,
  setFriends,
  setFriendRequests,
} from "../redux/slices/accountSlice";

const ROOT =
  process.env.NODE_ENV == "production"
    ? window.location.origin
    : process.env.REACT_APP_LOCAL_BACKEND_URL;

const instance = axios.create({ baseURL: ROOT });

export const signInGame = (code) => async (dispatch, getState) => {
  try {
    const response = await instance.get("/auth/token", {
      params: {
        code,
      },
    });
    const { token, profile } = response.data;

    instance.defaults.headers.common.Authorization = token;

    dispatch(setProfile(profile));
    dispatch(setToken(token));
    dispatch(
      addNotifyMessage({ text: "Successfully logged in", type: "success" })
    );
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const logOutGame = () => async (dispatch, getState) => {
  try {
    dispatch(
      addNotifyMessage({ text: "Successfully logged out", type: "success" })
    );

    const response = await instance.get("/auth/logout");

    dispatch(setToken(null));
    dispatch(setProfile({}));
    dispatch(setRoomInfo({}));
    dispatch(setPlayers([]));

    instance.defaults.headers.common.Authorization = undefined;
  } catch (error) {
    console.log(error.message);
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const fetchChatMessages = () => async (dispatch, getState) => {
  try {
    const response = await instance.get("/api/messages");
    const { messages } = response.data;

    dispatch(setChatMessages(messages));
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const fetchFriends = () => async (dispatch, getState) => {
  try {
    const response = await instance.get("/api/friends");
    const { friends } = response.data;

    dispatch(setFriends(friends));
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const fetchFriendRequests = () => async (dispatch, getState) => {
  try {
    const response = await instance.get("/api/friend/requests");
    const { requests } = response.data;

    dispatch(setFriendRequests(requests));
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const addFriendRequest = (email) => async (dispatch, getState) => {
  try {
    const response = await instance.post("/api/friend/request", {
      email,
    });

    dispatch(
      addNotifyMessage({
        text: "Successfully sent friend request",
        type: "success",
      })
    );
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const acceptFriendRequest = (email) => async (dispatch, getState) => {
  try {
    const response = await instance.post("/api/friend/accept", {
      email,
    });

    dispatch(
      addNotifyMessage({
        text: "Successfully accepted friend request",
        type: "success",
      })
    );
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const rejectFriendRequest = (email) => async (dispatch, getState) => {
  try {
    const response = await instance.post("/api/friend/reject", {
      email,
    });

    dispatch(
      addNotifyMessage({
        text: "Successfully rejected friend request",
        type: "success",
      })
    );
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

export const removeFriend = (email) => async (dispatch, getState) => {
  try {
    const response = await instance.post("/api/friend/remove", {
      email,
    });

    dispatch(
      addNotifyMessage({
        text: "Successfully deleted friend",
        type: "success",
      })
    );
  } catch (error) {
    dispatch(addNotifyMessage({ text: error.message, type: "error" }));
  }
};

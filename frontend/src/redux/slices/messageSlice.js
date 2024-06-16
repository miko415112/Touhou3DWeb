import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    chatroomMessages: [],
    notifyMessages: [],
    invitationMessages: [],
  },
  reducers: {
    setChatMessages: (state, action) => {
      state.chatroomMessages = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatroomMessages.push(action.payload);
    },
    readChatMessages: (state, action) => {
      state.chatroomMessages = state.chatroomMessages.map((message) => ({
        ...message,
        read: true,
      }));
    },

    addNotifyMessage: (state, action) => {
      state.notifyMessages.push(action.payload);
    },
    clearNotifyMessages: (state, action) => {
      state.notifyMessages = [];
    },
    addInvitationMessage: (state, action) => {
      state.invitationMessages.push(action.payload);
    },
    clearInvitationMessages: (state, action) => {
      state.invitationMessages = [];
    },
  },
});

export const {
  setChatMessages,
  addChatMessage,
  readChatMessages,
  addNotifyMessage,
  clearNotifyMessages,
  addInvitationMessage,
  clearInvitationMessages,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;

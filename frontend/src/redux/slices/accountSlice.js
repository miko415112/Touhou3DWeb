import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    token: null,
    profile: {},
    friends: [],
    requests: [],
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    deleteFriend: (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend.email !== action.payload
      );
    },
    setFriendRequests: (state, action) => {
      state.requests = action.payload;
    },
    addFriendRequest: (state, action) => {
      state.requests.push(action.payload);
    },
    deleteFriendRequest: (state, action) => {
      state.requests = state.requests.filter(
        (request) => request.email !== action.payload
      );
    },
  },
});

export const {
  setToken,
  setProfile,
  setFriends,
  addFriend,
  deleteFriend,
  setFriendRequests,
  addFriendRequest,
  deleteFriendRequest,
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;

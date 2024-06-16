import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    bossHealthPoints: 60,
    bossBullets: [],
    players: [],
    roomInfo: {},
  },
  reducers: {
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    updatePlayer: (state, action) => {
      const updatedPlayer = action.payload;
      state.players = state.players.map((player) => {
        if (updatedPlayer.email == player.email) return updatedPlayer;
        return player;
      });
    },
    setBossHealthPoints: (state, action) => {
      state.bossHealthPoints = action.payload;
    },
    setBossBullets: (state, action) => {
      state.bossBullets = action.payload;
    },
  },
});

export const {
  setRoomInfo,
  setPlayers,
  updatePlayer,
  setBossHealthPoints,
  setBossBullets,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;

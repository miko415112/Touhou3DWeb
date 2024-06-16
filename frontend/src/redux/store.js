import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./slices/gameSlice";
import { accountReducer } from "./slices/accountSlice";
import { messageReducer } from "./slices/messageSlice";

const store = configureStore({
  reducer: {
    game: gameReducer,
    message: messageReducer,
    account: accountReducer,
  },
});

export default store;

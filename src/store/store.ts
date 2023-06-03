/*
Store setup for the Redux store
*/

import { configureStore } from "@reduxjs/toolkit";

import gameReducer from "../features/game/gameSlice"

const store = configureStore({
    reducer: {
        game: gameReducer,
    },
})

export default store;
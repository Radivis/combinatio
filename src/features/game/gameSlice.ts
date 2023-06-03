/*
Redux reducer for the game
*/

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
}

// createSlice uses the package Immer, which allows to write reducers in the "mutable style"
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        start: (state, action) => {
            
        },
        restart: (state) => {
            
        },
        win: (state) => {

        },
        lose: (state) => {

        },
    }
})

export const {
    restart,
} = gameSlice.actions

export default gameSlice.reducer
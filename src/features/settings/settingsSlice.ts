/*
Redux reducer for the game settings
*/

import { createSlice } from "@reduxjs/toolkit";

import { settings } from "../../interfaces/interfaces";
import {
	defaultNumColors,
	defaultNumRows,
	paletteNames,
	defaultNumColumns,
 } from '../../constants';

const initialState: settings = {
    numRows: defaultNumRows,
    numColumns: defaultNumColumns,
    numColors: defaultNumColors,
    maxIdenticalColorsInSolution: defaultNumColumns,
    paletteName: paletteNames[0],
    areColorAmountHintsActive: true,
    areSlotHintsActive: true,
}

// createSlice uses the package Immer, which allows to write reducers in the "mutable style"
export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        update: (state, action) => {

        },
    }
})

export const {
    update,
} = settingsSlice.actions

export default settingsSlice.reducer
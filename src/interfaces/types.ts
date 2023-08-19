import Color from "../util/Color";
import ColorIcon from "../util/ColorIcon";
import ColorIcons from "../util/ColorIcons";
import Colors from "../util/Colors";
import { game, hints, modal, gameSettings, displaySettings } from "./interfaces";

// ZUSTAND TYPES
// Defining types from Zustand, because they are not exported! 

declare type PrimitiveType = number | string | boolean;

/** Object types that should never be mapped */
declare type AtomicObject = Function | Promise<any> | Date | RegExp;

/**
 * If the lib "ES2015.Collection" is not included in tsconfig.json,
 * types like ReadonlyArray, WeakMap etc. fall back to `any` (specified nowhere)
 * or `{}` (from the node types), in both cases entering an infinite recursion in
 * pattern matching type mappings
 * This type can be used to cast these types to `void` in these cases.
 */
export declare type IfAvailable<T, Fallback = void> = true | false extends (T extends never ? true : false) ? Fallback : keyof T extends never ? Fallback : T;

/**
 * These should also never be mapped but must be tested after regular Map and
 * Set
 */
declare type WeakReferences = IfAvailable<WeakMap<any, any>> | IfAvailable<WeakSet<any>>;
export declare type WritableDraft<T> = {
    -readonly [K in keyof T]: Draft<T[K]>;
};

/** Convert a readonly type into a mutable type, if possible */
export declare type Draft<T> = T extends PrimitiveType ? T : T extends AtomicObject ? T : T extends IfAvailable<ReadonlyMap<infer K, infer V>> ? Map<Draft<K>, Draft<V>> : T extends IfAvailable<ReadonlySet<infer V>> ? Set<Draft<V>> : T extends WeakReferences ? T : T extends object ? WritableDraft<T> : T;

// ZUSTAND TYPES END

export type colorDataString = string;
export type colorsDataString = string;
export type colorIconDataString = string;
export type colorIconsDataString = string;

export type gameState = {
    displaySettings: displaySettings,
    gameSettings: gameSettings,
    game: game,
    hints: hints,
    modal: modal,
}

export type gameActions = {
    changeGameSettings: (newSettings: gameSettings) => void,
    setAreColorAmountHintsActive: (value: boolean) => void,
    setAreIconAmountHintsActive: (value: boolean) => void,
    setAreSlotHintsActive: (value: boolean) => void,
    setAreCombinationNotesActive: (value: boolean) => void,
    setAreTranspositionsActive: (value: boolean) => void,
    setChangeMaxOccurrencesOnChangingMinOccurrences: (value: boolean) => void,
    setIsLegendDisplayed: (value: boolean) => void,
    setIsRandomGuessButtonDisplayed: (value: boolean) => void,
    placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => void,
    placeIcon: ({iconName, row, column}: {iconName: string, row: number, column: number}) => void,
    start: () => void,
    win: () => void,
    lose: () => void,
    reset: () => void,
    randomGuess: () => void,
    guess: () => void,
    resetHints: () => void,
    toggleDisableColor: (color: Color) => void,
    toggleDisableIcon: (iconName: string) => void,
    setPossibleColors: (colors: Colors, columnIndex: number) => void,
    setPossibleIcons: (iconNames: string[], columnIndex: number) => void,
    setColorMinMax: ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => void,
    setIconMinMax: ({iconIndex, min, max}: {iconIndex: number, min?: number, max?: number}) => void,
    placeTupleColor: ({color, rowIndex, columnIndex}: {color: Color, rowIndex: number, columnIndex: number}) => void,
    placeTupleIcon: ({iconName, rowIndex, columnIndex}: {iconName: string, rowIndex: number, columnIndex: number}) => void,
    addColorTuple: () => void,
    addColorTupleSlot: (rowIndex: number) => void,
    deleteColorTupleRow: (rowIndex: number) => void,
    changeCombinationNote: (rowIndex: number, newNote: string) => void,
    setModal: (modal: modal) => void,
}

export type gameStore = gameState & gameActions;

export type uiState = {
    isLongPressSuppressed: boolean;
}

export type uiActions = {
    setIsLongPressSuppressed: (value: boolean) => void,
}

export type uiStore = uiState & uiActions;

export type zustandGetter = () => gameStore;
export type zustandSetter = (
    nextStateOrUpdater: gameStore | Partial<gameStore> | ((state: Draft<gameStore>) => void),
    shouldReplace?: boolean | undefined,
    action?: string | { type: unknown } | undefined ) => void;

export type Piece = Color | ColorIcon;
export type Pieces = Colors | ColorIcons;

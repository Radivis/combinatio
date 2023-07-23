import { gameActions, gameState } from "../store/gameStore";

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
export type gameStore = gameState & gameActions;
export type zustandGetter = () => gameStore;
export type zustandSetter = (
    nextStateOrUpdater: gameStore | Partial<gameStore> | ((state: Draft<gameStore>) => void),
    shouldReplace?: boolean | undefined,
    action?: string | { type: unknown } | undefined ) => void;

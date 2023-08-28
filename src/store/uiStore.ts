import { create } from "zustand";
import { selectionStatusType, uiState, uiStore } from "../interfaces/types";
import { immer } from "zustand/middleware/immer";


const useUiStore = create<uiStore>()(
    immer((set, get) => ({
        isGlobalClickSuppressed: false,
        isLongPressInProgress: false,
        isLongPressSuppressed: false,
        selection: {},
        selectionStatus: selectionStatusType.EMPTY,
        setIsGlobalClickSuppressed: (value: boolean) => {
            console.log('setIsGlobalClickSuppressed', value);
            set((state: uiState) => {
                state.isGlobalClickSuppressed = value;
            });
        },
        setIsLongPressInProgress: (value: boolean) => {
            set((state: uiState) => {
                state.isLongPressInProgress = value;
            });
        },
        setIsLongPressSuppressed: (value: boolean) => {
            set((state: uiState) => {
                state.isLongPressSuppressed = value;
            });
        },
        setSelection: (newSelection: object | undefined) => {
            const { selectionStatus } = get();
            set((state: uiState) => {
                if (selectionStatus !== selectionStatusType.DISCARDING) {
                    state.selection = newSelection;
                    if (newSelection !== undefined) {
                        state.selectionStatus = selectionStatusType.ACTIVE;
                    } else {
                        state.selectionStatus = selectionStatusType.EMPTY;
                    }
                }
            })
        },
        /*
        * Empties the selection with a delay
        */
        discardSelection: () => {
            console.log('discardSelection');
            const { selectionStatus } = get();
            if (selectionStatus !== selectionStatusType.DISCARDING) {
                setTimeout(() => {
                    set((state: uiState) => {
                        state.selection = undefined;
                        state.selectionStatus = selectionStatusType.EMPTY;
                    })
                }, 500)
            }
        },
        setSelectionStatus: (newSelectionStatus: selectionStatusType): void => {
            set((state: uiState) => {
                state.selectionStatus = newSelectionStatus;
            })
        },
    }))
);

export default useUiStore;
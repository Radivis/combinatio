import { create } from "zustand";
import { uiState, uiStore } from "../interfaces/types";
import { immer } from "zustand/middleware/immer";


const useUiStore = create<uiStore>()(
    immer((set, get) => ({
        isLongPressSuppressed: false,
        setIsLongPressSuppressed: (value: boolean) => {
            set((state: uiState) => {
                state.isLongPressSuppressed = value;
            });
        }
    }))
);

export default useUiStore;
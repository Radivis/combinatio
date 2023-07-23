import { useEffect, useState } from "react";

import IntegerSelect from "./IntegerSelect";
import { paletteNames } from "../../constants";
import useGameStore from "../../store/gameStore";

import './Settings.css';
import BooleanSetting from "./BooleanSetting";

interface settingsProps {
    setActivePage: Function,
}

const Settings = (props: settingsProps) => {
    const { setActivePage } = props;

    const [settings, changeSettings] = useGameStore((state) => [state.gameSettings, state.changeGameSettings]);
    const [areColorAmountHintsActive, setAreColorAmountHintsActive] = useGameStore((state) => {
        return [state.displaySettings.areColorAmountHintsActive, state.setAreColorAmountHintsActive];
    })
    const [areSlotHintsActive, setAreSlotHintsActive] = useGameStore((state) => {
        return [state.displaySettings.areSlotHintsActive, state.setAreSlotHintsActive];
    })
    const [areCombinationNotesActive, setAreCombinationNotesActive] = useGameStore((state) => {
        return [state.displaySettings.areCombinationNotesActive, state.setAreCombinationNotesActive];
    })
    const [isRandomGuessButtonDisplayed, setIsRandomGuessButtonDisplayed] = useGameStore((state) => {
        return [state.displaySettings.isRandomGuessButtonDisplayed, state.setIsRandomGuessButtonDisplayed];
    })

    const [numRows, setNumRows] = useState<number>(settings.numRows);
    const [numColumns, setNumColumns] = useState<number>(settings.numColumns);
    const [numPrefilledRows, setNumPrefilledRows] = useState<number>(settings.numPrefilledRows);
    const [numColors, setNumColors] = useState<number>(settings.numColors);
    const [maxIdenticalColorsInSolution, setMaxIdenticalColorsInSolution] = useState<number>(settings.maxIdenticalColorsInSolution);
    const [_paletteName, setPaletteName] = useState<string>(settings.paletteName);

    const validPaletteNames = paletteNames.filter(paletteName => {
        switch (paletteName) {
            case 'regular': return true;
            case 'zanthia': return numColors === 6;      
            default: return false;
        }
    });

    const onChangeNumRows = (ev: any) => {
        setNumRows(+ev.target.value!);
    }

    const onChangeNumColumns = (ev: any) => {
        setNumColumns(+ev.target.value!);
    }

    const onChangeNumPrefilledRows = (ev: any) => {
        setNumPrefilledRows(+ev.target.value!);
    }

    const onChangeNumColors = (ev: any) => {
        setNumColors(+ev.target.value!);
    }

    const onChangeMaxIdenticalColorsInSolution = (ev: any) => {
        let newMaxIdenticalColorsInSolution = +ev.target.value!;
        // Clamp the value between 0 and numColumns
        if (newMaxIdenticalColorsInSolution <= 0) {
            newMaxIdenticalColorsInSolution = 1;
        } else if (newMaxIdenticalColorsInSolution > numColumns) {
            newMaxIdenticalColorsInSolution = numColumns;
        }
        setMaxIdenticalColorsInSolution(newMaxIdenticalColorsInSolution);
    }

    const onChangePaletteName = (ev: any) => {
        setPaletteName(ev.target.value);
    }

    const onChangeAreColorAmountHintsActive = (ev: any) => {
        setAreColorAmountHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreSlotHintsActive = (ev: any) => {
        setAreSlotHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreCombinationNotesActive = (ev: any) => {
        setAreCombinationNotesActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeIsRandomGuessButtonDisplayed = (ev: any) => {
        setIsRandomGuessButtonDisplayed(ev.target.value === 'true' ? true : false);
    }

    const onSubmit = (ev: any) => {
        ev.preventDefault();
        // explicitly choose the currently selected palette value to prevent setting an invalid palette
        const formEntriesArray: any[] = Array.from(ev.target);
        const selectedPaletteName = formEntriesArray.find((inputElement: any) => inputElement.name === 'paletteName').value;

        changeSettings({
            numRows,
            numColumns,
            numPrefilledRows,
            numColors,
            maxIdenticalColorsInSolution,
            paletteName: selectedPaletteName,
        })
        setActivePage('game');
    }

    /**
     * Check whether given the current setting a complete setting can be made,
     * and if not, increases maxIdenticalColorsInSolution to the minimum required value
     */
    useEffect(() => {
        if (numColors * maxIdenticalColorsInSolution < numColumns) {
            setMaxIdenticalColorsInSolution(Math.ceil(numColumns / numColors));
        }
    }, [numColumns, numColors, maxIdenticalColorsInSolution]);

    return (
        <form onSubmit={onSubmit}>
            <div className="settings-table">
                <h2>Game Settings</h2>
                <div className="settings-row">
                    <label htmlFor="numRows">Number of rows: </label>
                    <IntegerSelect 
                        name={'numRows'} 
                        min={2}
                        max={20}
                        defaultValue={numRows}
                        onChange={onChangeNumRows}
                    />
                </div>
                <div className="settings-row">
                    <label htmlFor="numColumns">Number of columns: </label>
                    <IntegerSelect
                        name={'numColumns'} 
                        min={2}
                        max={20}
                        defaultValue={numColumns}
                        onChange={onChangeNumColumns}
                    />
                </div>
                <div className="settings-row">
                    <label htmlFor="numPrefilledRow">Number of already filled rows: </label>
                    <IntegerSelect
                        name={'numColumns'} 
                        min={0}
                        max={19}
                        defaultValue={numPrefilledRows}
                        onChange={onChangeNumPrefilledRows}
                    />
                </div>
                <div className="settings-row">
                    <label htmlFor="numColors">Number of colors: </label>
                    <IntegerSelect
                        name={'numColors'}  
                        min={2}
                        max={20}
                        defaultValue={numColors}
                        onChange={onChangeNumColors}
                    />
                </div>
                <div className="settings-row">
                    <label htmlFor="maxIdenticalColorsInSolutions">Max. number of same colors: </label>
                    <IntegerSelect
                        name={'maxIdenticalColorsInSolutions'}   
                        min={Math.ceil(numColumns / numColors) /** Any less is not possible! */}
                        max={numColumns}
                        defaultValue={maxIdenticalColorsInSolution}
                        onChange={onChangeMaxIdenticalColorsInSolution}
                    />
                </div>
                <div className="settings-row">
                    <label htmlFor="paletteName">Color Palette: </label>
                    <select name='paletteName' onChange={onChangePaletteName}>
                        {validPaletteNames.map((paletteName: string) => <option
                            key={paletteName}
                            value={paletteName}
                            selected={settings.paletteName === paletteName}
                            >
                                {paletteName}
                            </option>
                        )}
                    </select>
                </div>
                <button type="submit">Save settings and start new game</button>
                <h2>Display Settings</h2>
                <BooleanSetting
                    setting={areColorAmountHintsActive}
                    settingName={"areColorAmountHintsActive"}
                    settingLabel="Use color amount hints"
                    onChangeHandler={onChangeAreColorAmountHintsActive}
                />
                <BooleanSetting
                    setting={areSlotHintsActive}
                    settingName={"areSlotHintsActive"}
                    settingLabel="Use slot hints"
                    onChangeHandler={onChangeAreSlotHintsActive}
                />
                <BooleanSetting
                    setting={areCombinationNotesActive}
                    settingName={"areCombinationNotesActive"}
                    settingLabel="Show combination notes"
                    onChangeHandler={onChangeAreCombinationNotesActive}
                />
                <BooleanSetting
                    setting={isRandomGuessButtonDisplayed}
                    settingName={"isRandomGuessButtonDisplayed"}
                    settingLabel="Show random guess button"
                    onChangeHandler={onChangeIsRandomGuessButtonDisplayed}
                />
            </div>
            
        </form>
    )
}

export default Settings;
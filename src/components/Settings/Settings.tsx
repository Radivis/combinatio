import { useEffect, useState } from "react";

import IntegerSelect from "./IntegerSelect";
import { paletteNames, pieceTypes } from "../../constants";
import useGameStore from "../../store/gameStore";

import './Settings.css';
import BooleanSetting from "./BooleanSetting";

interface settingsProps {
    setActivePage: Function,
}

const Settings = (props: settingsProps) => {
    const { setActivePage } = props;

    // TODO: Combine these hook usages into a single usage of the useGameStore hook
    const [settings, changeSettings] = useGameStore((state) => [state.gameSettings, state.changeGameSettings]);
    const [areColorAmountHintsActive, setAreColorAmountHintsActive] = useGameStore((state) => {
        return [state.displaySettings.areColorAmountHintsActive, state.setAreColorAmountHintsActive];
    })
    const [areIconAmountHintsActive, setAreIconAmountHintsActive] = useGameStore((state) => {
        return [state.displaySettings.areIconAmountHintsActive, state.setAreIconAmountHintsActive];
    });
    const [areSlotHintsActive, setAreSlotHintsActive] = useGameStore((state) => {
        return [state.displaySettings.areSlotHintsActive, state.setAreSlotHintsActive];
    })
    
    const [areCombinationNotesActive, setAreCombinationNotesActive] = useGameStore((state) => {
        return [state.displaySettings.areCombinationNotesActive, state.setAreCombinationNotesActive];
    })

    const [areTranspositionsActive, setAreTranspositionsActive] = useGameStore((state) => {
        return [state.displaySettings.areTranspositionsActive, state.setAreTranspositionsActive];
    })

    const [canPickUpPiecesFromSlotHints, setCanPickUpPiecesFromSlotHints] = useGameStore((state) => {
        return [state.displaySettings.canPickUpPiecesFromSlotHints, state.setCanPickUpPiecesFromSlotHints];
    })

    const [
        changeOccurrencesOnChangingPossibleSlots,
        setChangeOccurrencesOnChangingPossibleSlots,
    ] = useGameStore((state) => {
        return [
            state.displaySettings.changeOccurrencesOnChangingPossibleSlots,
            state.setChangeOccurrencesOnChangingPossibleSlots,
        ];
    })

    const [
        changeMaxOccurrencesOnChangingMinOccurrences,
        setChangeMaxOccurrencesOnChangingMinOccurrences,
    ] = useGameStore((state) => {
        return [
            state.displaySettings.changeMaxOccurrencesOnChangingMinOccurrences,
            state.setChangeMaxOccurrencesOnChangingMinOccurrences,
        ];
    })
    const [isLegendDisplayed, setIsLegendDisplayed] = useGameStore((state) => {
        return [state.displaySettings.isLegendDisplayed, state.setIsLegendDisplayed];
    })
    const [isRandomGuessButtonDisplayed, setIsRandomGuessButtonDisplayed] = useGameStore((state) => {
        return [state.displaySettings.isRandomGuessButtonDisplayed, state.setIsRandomGuessButtonDisplayed];
    })

    const [numRows, setNumRows] = useState<number>(settings.numRows);
    const [numColumns, setNumColumns] = useState<number>(settings.numColumns);
    const [numPrefilledRows, setNumPrefilledRows] = useState<number>(settings.numPrefilledRows);
    const [numColors, setNumColors] = useState<number>(settings.numColors);
    const [numIcons, setNumIcons] = useState<number>(settings.numIcons);
    const [maxIdenticalColorsInSolution, setMaxIdenticalColorsInSolution] = useState<number>(settings.maxIdenticalColorsInSolution);
    const [maxIdenticalIconsInSolution, setMaxIdenticalIconsInSolution] = useState<number>(settings.maxIdenticalIconsInSolution);
    const [pieceType, setPieceType] = useState<string>(settings.pieceType);
    const [_paletteName, setPaletteName] = useState<string>(settings.paletteName);

    const validPaletteNames = paletteNames.filter(paletteName => {
        switch (paletteName) {
            case 'regular': return true;
            case 'zanthia': return numColors === 6;      
            default: return false;
        }
    });

    const validPieceTypes = [
        pieceTypes.color,
        pieceTypes.colorIcon,
        pieceTypes.icon,
    ]

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

    const onChangeNumIcons = (ev: any) => {
        setNumIcons(+ev.target.value!);
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

    const onChangeMaxIdenticalIconsInSolution = (ev: any) => {
        let newMaxIdenticalIconsInSolution = +ev.target.value!;
        // Clamp the value between 0 and numColumns
        if (newMaxIdenticalIconsInSolution <= 0) {
            newMaxIdenticalIconsInSolution = 1;
        } else if (newMaxIdenticalIconsInSolution > numColumns) {
            newMaxIdenticalIconsInSolution = numColumns;
        }
        setMaxIdenticalIconsInSolution(newMaxIdenticalIconsInSolution);
    }

    const onChangePieceType = (ev: any) => {
        setPieceType(ev.target.value);
    }

    const onChangePaletteName = (ev: any) => {
        setPaletteName(ev.target.value);
    }

    const onChangeAreColorAmountHintsActive = (ev: any) => {
        setAreColorAmountHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreIconAmountHintsActive = (ev: any) => {
        setAreIconAmountHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreSlotHintsActive = (ev: any) => {
        setAreSlotHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreCombinationNotesActive = (ev: any) => {
        setAreCombinationNotesActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeCanPickUpPiecesFromSlotHints = (ev: any) => {
        setCanPickUpPiecesFromSlotHints(ev.target.value === 'true' ? true : false);
    }

    const onChangeAreTranspositionsActive = (ev: any) => {
        setAreTranspositionsActive(ev.target.value === 'true' ? true : false);
    }

    const onChangeChangeOccurrencesOnChangingPossibleSlots = (ev: any) => {
        setChangeOccurrencesOnChangingPossibleSlots(ev.target.value === 'true' ? true : false);
    }

    const onChangeChangeMaxOccurrencesOnChangingMinOccurrences = (ev: any) => {
        setChangeMaxOccurrencesOnChangingMinOccurrences(ev.target.value === 'true' ? true : false);
    }

    const onChangeIsLegendDisplayed = (ev: any) => {
        setIsLegendDisplayed(ev.target.value === 'true' ? true : false);
    }

    const onChangeIsRandomGuessButtonDisplayed = (ev: any) => {
        setIsRandomGuessButtonDisplayed(ev.target.value === 'true' ? true : false);
    }

    const onSubmit = (ev: any) => {
        ev.preventDefault();
        // explicitly choose the currently selected palette value to prevent setting an invalid palette
        let selectedPaletteName = _paletteName;
        if (pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon) {
            const formEntriesArray: any[] = Array.from(ev.target);
            selectedPaletteName = formEntriesArray.find((inputElement: any) => inputElement.name === 'paletteName').value;
        }
        changeSettings({
            numRows,
            numColumns,
            numPrefilledRows,
            numColors,
            numIcons,
            maxIdenticalColorsInSolution,
            maxIdenticalIconsInSolution,
            paletteName: selectedPaletteName,
            pieceType,
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
                <h2 className="settings-title">Game Settings</h2>
                <div className="settings-row">
                    <label htmlFor="pieceType">Piece type: </label>
                    <select name='pieceType' onChange={onChangePieceType}>
                        {validPieceTypes.map((pieceType: string) => <option
                            key={pieceType}
                            value={pieceType}
                            selected={settings.pieceType === pieceType}
                            >
                                {pieceType}
                            </option>
                        )}
                    </select>
                </div>
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
                {(pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon) &&
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
                }
                {(pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon) &&
                    <div className="settings-row">
                    <label htmlFor="numIcons">Number of icons: </label>
                    <IntegerSelect
                        name={'numIcons'}  
                        min={2}
                        max={20}
                        defaultValue={numIcons}
                        onChange={onChangeNumIcons}
                    />
                </div>}
                {(pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon) &&
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
                }
                {(pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon) &&
                    <div className="settings-row">
                    <label htmlFor="maxIdenticalIconsInSolutions">Max. number of same icons: </label>
                    <IntegerSelect
                        name={'maxIdenticalIconsInSolutions'}   
                        min={Math.ceil(numColumns / numIcons) /** Any less is not possible! */}
                        max={numColumns}
                        defaultValue={maxIdenticalIconsInSolution}
                        onChange={onChangeMaxIdenticalIconsInSolution}
                    />
                </div>}
                {(pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon) &&
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
                }
                <button type="submit">Save settings and start new game</button>
                <h3 className="settings-title">Display Settings</h3>
                <p className="settings-paragraph">Changing these settings has an immediate effect and doesn't require restarting the game.</p>
                <BooleanSetting
                    setting={areColorAmountHintsActive}
                    settingName={"areColorAmountHintsActive"}
                    settingLabel="Use color amount hints"
                    onChangeHandler={onChangeAreColorAmountHintsActive}
                />
                <BooleanSetting
                    setting={areIconAmountHintsActive}
                    settingName={"areIconAmountHintsActive"}
                    settingLabel="Use icon amount hints"
                    onChangeHandler={onChangeAreIconAmountHintsActive}
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
                    setting={areTranspositionsActive}
                    settingName={"areTranspositionsActive"}
                    settingLabel="Enable switching of pieces within the same row"
                    onChangeHandler={onChangeAreTranspositionsActive}
                />
                <BooleanSetting
                    setting={canPickUpPiecesFromSlotHints}
                    settingName={"canPickUpPiecesFromSlotHints"}
                    settingLabel="Pick up pieces from possible pieces per slot"
                    onChangeHandler={onChangeCanPickUpPiecesFromSlotHints}
                />
                <BooleanSetting
                    setting={isLegendDisplayed}
                    settingName={"isLegendDisplayed"}
                    settingLabel="Show legend"
                    onChangeHandler={onChangeIsLegendDisplayed}
                />
                <BooleanSetting
                    setting={isRandomGuessButtonDisplayed}
                    settingName={"isRandomGuessButtonDisplayed"}
                    settingLabel="Show random guess button"
                    onChangeHandler={onChangeIsRandomGuessButtonDisplayed}
                />
                <h4 className="settings-title">Hint Interaction Settings</h4>
                <BooleanSetting
                    setting={changeOccurrencesOnChangingPossibleSlots}
                    settingName={"changeOccurrencesOnChangingPossibleSlots"}
                    settingLabel="Change min or max occurrences on changing possible slots for pieces"
                    onChangeHandler={onChangeChangeOccurrencesOnChangingPossibleSlots}
                />
                <BooleanSetting
                    setting={changeMaxOccurrencesOnChangingMinOccurrences}
                    settingName={"changeMaxOccurrencesOnChangingMinOccurrences"}
                    settingLabel="Change max occurrences on changing min occurrences (experimental)"
                    onChangeHandler={onChangeChangeMaxOccurrencesOnChangingMinOccurrences}
                />
            </div>
            
        </form>
    )
}

export default Settings;
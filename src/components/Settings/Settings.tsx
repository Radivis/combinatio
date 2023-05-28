import { useState } from "react";

import { paletteNames } from "../../constants";
import { settings } from "../../interfaces/interfaces";

import './Settings.css';

interface settingsProps {
    currentSettings: settings,
    setSettings: Function,
    setActivePage: Function,
}

const Settings = (props: settingsProps) => {
    const { currentSettings, setSettings, setActivePage } = props;

    const [numRows, setNumRows] = useState<number>(currentSettings.numRows);
    const [numColors, setNumColors] = useState<number>(currentSettings.numColors);
    const [paletteName, setPaletteName] = useState<string>(currentSettings.paletteName);
    const [areColorAmountHintsActive, setAreColorAmountHintsActive] = useState<boolean>(currentSettings.areColorAmountHintsActive);

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

    const onChangeNumColors = (ev: any) => {
        setNumColors(+ev.target.value!);
    }

    const onChangePaletteName = (ev: any) => {
        setPaletteName(ev.target.value);
    }

    const onChangeAreColorAmountHintsActive = (ev: any) => {
        setAreColorAmountHintsActive(ev.target.value === 'true' ? true : false);
    }

    const onSubmit = (ev: any) => {
        ev.preventDefault();
        // explicitly choose the currently selected palette value to prevent setting an invalid palette
        const formEntriesArray: any[] = Array.from(ev.target);
        const selectedPaletteName = formEntriesArray.find((inputElement: any) => inputElement.name === 'paletteName').value;

        setSettings(() => {
            return {
            numRows,
            numColors,
            paletteName: selectedPaletteName,
            areColorAmountHintsActive,
        }});
        setActivePage('game');
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="settings-table">
                <div className="settings-row">
                    <label htmlFor="rumRows">Number of rows: </label>
                    <input name='numRows' value={numRows} onChange={onChangeNumRows} />
                </div>
                <div className="settings-row">
                    <label htmlFor="numColors">Number of colors: </label>
                    <input name='numColors' value={numColors} onChange={onChangeNumColors}/>
                </div>
                <div className="settings-row">
                    <label htmlFor="paletteName">Color Palette: </label>
                    <select name='paletteName' onChange={onChangePaletteName}>
                        {validPaletteNames.map((paletteName: string) => <option
                            key={paletteName}
                            value={paletteName}
                            selected={currentSettings.paletteName === paletteName}
                            >
                                {paletteName}
                            </option>
                        )}
                    </select>
                </div>
                <div className="settings-row">
                    <label htmlFor="areColorAmountHintsActive">Use color amount hints: </label>
                    Yes: <input
                        name='areColorAmountHintsActive'
                        type="radio"
                        value="true"
                        checked={areColorAmountHintsActive === true}
                        onChange={onChangeAreColorAmountHintsActive}
                    />
                    No: <input
                        name='areColorAmountHintsActive'
                        type="radio"
                        value="false"
                        checked={areColorAmountHintsActive === false}
                        onChange={onChangeAreColorAmountHintsActive}
                    />
                </div>
            </div>
            <button type="submit">Save settings and start new game</button>
        </form>
    )
}

export default Settings;
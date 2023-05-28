import { useState } from "react";

import { paletteNames } from "../../constants";
import { settings } from "../../interfaces/interfaces";

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

    const onSubmit = () => {
        setSettings(() => {
            return {
            numRows,
            numColors,
            paletteName
        }});
        setActivePage('game');
    }

    return <form onSubmit={onSubmit}>
        <label htmlFor="rumRows">Number of rows: </label><input name='numRows' value={numRows} onChange={onChangeNumRows} />
        <label htmlFor="rumColors">Number of colors: </label><input name='numColors' value={numColors} onChange={onChangeNumColors}/>
        <label htmlFor="paletteName">Color Palette: </label><select name='paletteName' onChange={onChangePaletteName}>
            {validPaletteNames.map((paletteName: string) => <option
                key={paletteName}
                value={paletteName}
                selected={currentSettings.paletteName === paletteName}
                >
                    {paletteName}
                </option>
            )}
        </select>
        <button type="button" onClick={onSubmit}>Save settings and start new game</button>
    </form>
}

export default Settings;
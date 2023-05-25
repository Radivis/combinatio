import { ChangeEvent, useState } from "react";

import { defaultBaseLightness, defaultBaseSaturation } from "../../constants";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { settings } from "../../interfaces";


interface settingsProps {
    currentSettings: settings,
    setSettings: Function,
    setActivePage: Function,
}

const Settings = (props: settingsProps) => {
    const { currentSettings, setSettings, setActivePage } = props;

    const [numRows, setNumRows] = useState(currentSettings.numRows);
    const [numColors, setNumColors] = useState(currentSettings.numColors);
    const [palette, setPalette] = useState(currentSettings.palette);


    const regularPalette: Colors = new Colors([...Array(numColors).keys()].map(i => {
		return Color.makeHsl(i * 360/numColors, defaultBaseSaturation, defaultBaseLightness);
	}));
    const zanthiaPalette: Colors = new Colors([
        Color.makeHsl(202, 78, 87),
        Color.makeHsl(52, 94, 97),
        Color.makeHsl(131, 85, 67),
        Color.makeHsl(343, 93, 77),
        Color.makeHsl(264, 57, 88),
        Color.makeHsl(32, 74, 76)
    ]);
    const palettes: Colors[] = [regularPalette];
    if (numColors === 6) palettes.push(zanthiaPalette);

    const onChangeNumRows = (ev: any) => {
        setNumRows(+ev.target.value!);
    }

    const onChangeNumColors = (ev: any) => {
        setNumColors(+ev.target.value!);
    }

    const onChangePalette = (ev: any) => {
        setPalette(() => Colors.deserialize(ev.target.value))
    }

    const onSubmit = () => {
        setSettings(() => {
            return {
            numRows,
            numColors,
            palette
        }});
        setActivePage('game');
    }

    return <form onSubmit={onSubmit}>
        <label htmlFor="rumRows">Number of rows: </label><input name='numRows' value={numRows} onChange={onChangeNumRows} />
        <label htmlFor="rumColors">Number of colors: </label><input name='numColors' value={numColors} onChange={onChangeNumColors}/>
        <select onChange={onChangePalette}>
            {palettes.map((palette: Colors) => <option value={palette.serialize()}>{palette.serialize()}</option>)}
        </select>
        <button type="button" onClick={onSubmit}>Save settings and start new game</button>
    </form>
}

export default Settings;
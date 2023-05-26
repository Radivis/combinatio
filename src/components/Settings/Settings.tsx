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
        Color.makeHsl(204, 72, 53),
        Color.makeHsl(52, 94, 51),
        Color.makeHsl(131, 74, 38),
        Color.makeHsl(343, 88, 41),
        Color.makeHsl(264, 67, 63),
        Color.makeHsl(32, 59, 48)
    ]);
    const palettes: Colors[] = [regularPalette];
    if (numColors === 6) palettes.push(zanthiaPalette);

    const paletteLabels: string[] = [
        'regular',
        'zanthia',
    ]

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
            {palettes.map((palette: Colors, index: number) => <option value={palette.serialize()}>{paletteLabels[index]}</option>)}
        </select>
        <button type="button" onClick={onSubmit}>Save settings and start new game</button>
    </form>
}

export default Settings;
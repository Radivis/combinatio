import React, {useState} from 'react';

import Game from './components/Game/Game';
import Color from './util/Color';
import Colors from './util/Colors';
import Settings from './components/Settings/Settings';
import { settings } from './interfaces/interfaces';
import { defaultBaseSaturation, defaultBaseLightness, defaultNumColors, defaultNumRows, paletteNames } from './constants';

import './App.css';
import { colorsDataString } from './interfaces/types';

const generateRegularPalette = (numColors: number): Colors => {
    return new Colors([...Array(numColors).keys()].map(i => {
		return Color.makeHsl(i * 360/numColors, defaultBaseSaturation, defaultBaseLightness);
    }))
};

const App = () => {
	const initialSettings: settings = {
		numColors: defaultNumColors,
		numRows: defaultNumRows,
		paletteName: paletteNames[0],
		areColorAmountHintsActive: true,
	}

	let [activePage, setActivePage] = useState('game');
	let [settings, setSettings] = useState(initialSettings);

	const { numColors, paletteName, areColorAmountHintsActive } = settings;

	const regularPalette: Colors = generateRegularPalette(numColors)
    const zanthiaPalette: Colors = new Colors([
        Color.makeHsl(204, 72, 53),
        Color.makeHsl(52, 94, 51),
        Color.makeHsl(131, 74, 38),
        Color.makeHsl(343, 88, 41),
        Color.makeHsl(264, 67, 63),
        Color.makeHsl(32, 59, 48)
    ]);
    const palettes: {[paletteName: string]: Colors} = {'regular': regularPalette};
    if (numColors === 6) palettes['zanthia'] = zanthiaPalette;

	const currentPaletteDataString: colorsDataString = Colors.serialize(palettes[paletteName]);

 	return (
		<div className="App">
	  		<header className="App-header">
				Combinatio
				<nav>
					<button onClick={() => {setActivePage('settings')}}>Settings</button>
					<button onClick={() => {setActivePage('game')}}>Game</button>
				</nav>
	  		</header>
			<main>
				{activePage === 'settings' ?
					<Settings
						currentSettings={settings}
						setSettings={setSettings}
						setActivePage={setActivePage}
					/>
				:
					<Game
						numColors={settings.numColors}
						numRows={settings.numRows}
						baseColorsDataString={currentPaletteDataString}
						areColorAmountHintsActive={areColorAmountHintsActive}
					/>
				}
			</main>
		</div>
  	);
}

export default App;

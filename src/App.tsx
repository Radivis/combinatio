import React, {useState} from 'react';

import Game from './components/Game/Game';
import Color from './util/Color';
import Colors from './util/Colors';
import Settings from './components/Settings/Settings';
import { settings } from './interfaces';
import { defaultBaseSaturation, defaultBaseLightness, defaultNumColors, defaultNumRows } from './constants';

import './App.css';

const App = () => {
	const initialSettings: settings = {
		numColors: defaultNumColors,
		numRows: defaultNumRows,
		palette: new Colors([...Array(defaultNumColors).keys()].map(i => {
			return Color.makeHsl(i * 360/defaultNumColors, defaultBaseSaturation, defaultBaseLightness);
		}))
	}

	let [activePage, setActivePage] = useState('game');
	let [settings, setSettings] = useState(initialSettings);

	const baseColors = [...Array(settings.numColors).keys()].map(i => {
		return Color.makeHsl(i * 360/settings.numColors, defaultBaseSaturation, defaultBaseLightness);
	})

 	return (
		<div className="App">
	  		<header className="App-header">
				Variablo
				<nav>
					<button onClick={() => {setActivePage('settings')}}>Settings</button>
					<button onClick={() => {setActivePage('game')}}>Game</button>
				</nav>
	  		</header>
			<main>
				{activePage === 'settings' ? <Settings
					currentSettings={settings}
					setSettings={setSettings}
					setActivePage={setActivePage}
					/>
				:
				<Game
					numColors={settings.numColors}
					numRows={settings.numRows}
					baseColors={baseColors}
					/>
				}
			</main>
		</div>
  	);
}

export default App;

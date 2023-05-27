import React, {useState} from 'react';

import Game from './components/Game/Game';
import Color from './util/Color';
import Colors from './util/Colors';
import Settings from './components/Settings/Settings';
import { settings } from './interfaces/interfaces';
import { defaultBaseSaturation, defaultBaseLightness, defaultNumColors, defaultNumRows } from './constants';

import './App.css';

const App = () => {
	const initialSettings: settings = {
		numColors: defaultNumColors,
		numRows: defaultNumRows,
		palette: Colors.serialize(new Colors([...Array(defaultNumColors).keys()].map(i => {
			return Color.makeHsl(i * 360/defaultNumColors, defaultBaseSaturation, defaultBaseLightness);
		})))
	}

	let [activePage, setActivePage] = useState('game');
	let [settings, setSettings] = useState(initialSettings);

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
						baseColorsDataString={settings.palette}
					/>
				}
			</main>
		</div>
  	);
}

export default App;

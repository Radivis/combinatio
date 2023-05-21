import React, {useState} from 'react';

import Game from './components/Game/Game';
import Color from './util/Color';
import { defaultBaseSaturation, defaultBaseLightness, defaultNumColors, defaultNumRows } from './constants';

import './App.css';

const App = () => {
	const initialSettings = {
		numColors: defaultNumColors,
		numRows: defaultNumRows,
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
				{activePage === 'settings' ? 'Settings' :
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

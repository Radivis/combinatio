import { Dispatch, SetStateAction } from "react";

interface AppHeaderProps {
    setActivePage: Dispatch<SetStateAction<string>>,
}

const AppHeader = ({setActivePage}: AppHeaderProps) => {
    return (
        <header className="App-header">
        Combinatio V0.5
        <nav>
            <button onClick={() => {setActivePage('settings')}}>Settings</button>
            <button onClick={() => {setActivePage('game')}}>Game</button>
        </nav>
        </header>
    );
}

export default AppHeader;

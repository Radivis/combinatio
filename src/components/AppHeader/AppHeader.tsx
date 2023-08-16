import { Dispatch, SetStateAction } from "react";
import { gameVersionNumber } from "../../constants";

interface AppHeaderProps {
    setActivePage: Dispatch<SetStateAction<string>>,
}

const AppHeader = ({setActivePage}: AppHeaderProps) => {
    return (
        <header className="App-header">
        Combinatio V{gameVersionNumber}
        <nav>
            <button onClick={() => {setActivePage('settings')}}>Settings</button>
            <button onClick={() => {setActivePage('game')}}>Game</button>
            <button onClick={() => {setActivePage('version-history')}}>Version History</button>
        </nav>
        </header>
    );
}

export default AppHeader;

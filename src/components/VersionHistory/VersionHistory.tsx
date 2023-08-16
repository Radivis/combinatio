import './VersionHistory.css';

const VersionHistory = () => {
    return (
        <div>
            <h2>V0.6.1</h2>
            <ul className='version-history-list'>
                <li>Added long-press functionality for game slots and combination hint slots</li>
                <li>Added indicators for hints for the case that they violate basic boundary conditions</li>
                <li>Minor CSS fixes</li>
            </ul>
            <h2>V0.6.0</h2>
            <ul className='version-history-list'>
                <li>First online release</li>
            </ul>
        </div>
    )
}

export default VersionHistory;
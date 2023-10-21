import './VersionHistory.css';

const VersionHistory = () => {
    return (
        <div>
            <h2>V0.6.5</h2>
            <ul className='version-history-list'>
                <li>Fixed a bug in "colorIcon" pieceType mode that lead to wrong row evaluations</li>
            </ul>
            <h2>V0.6.4</h2>
            <ul className='version-history-list'>
                <li>Added option "Change min or max occurrences on changing possible slots for pieces" (deactivated by default)</li>
                <li>Added option "Pick up pieces from possible pieces per slot" (deactivated by default)</li>
                <li>The check for touch device ability should be more reliable now</li>
                <li>icon and color can now be added separately to the currently selected piece</li>
                <li>Long press now suppresses click events</li>
                <li>Prevented the discarding on the selection on touch devices, after it was changed</li>
                <li>Prevented infoPins from getting squashed in very low resolutions</li>
                <li>Fixed icon transparency for the currently selected piece in "colorIcon" pieceType mode</li>
                <li>Added discard animation for the selected piece for touch devices</li>
                <li>Improved behavior of color and icon selector popups</li>
            </ul>
            <h2>V0.6.3</h2>
            <ul className='version-history-list'>
                <li><strong>Disabling and re-enabling a piece works with long press instead of click now</strong></li>
                <li>Clicking a piece now puts it into the current selection</li>
                <li>The currently active row of the game is now highlighted</li>
            </ul>
            <h2>V0.6.2</h2>
            <ul className='version-history-list'>
                <li>The "zanthia" color palette works again</li>
                <li>The settings page now works as intended for the "icon" pieceType</li>
                <li>Already filled rows in "icon" pieceType mode aren't colored</li>
                <li>Icons within the combination notes are semi-transparent in "colorIcon" pieceType mode</li>
                <li>Fixed the broken behavior of long press on mobile devices</li>
                <li className="failed">Dragged pieces should not drag their background with them</li>
                <li>Dragging a piece prevents its long press event from firing as long as it is dragged</li>
                <li>Long press on a slot hint piece now selects the piece as the only one</li>
                <li>Pieces can now also be dragged from the game board or the combination notes</li>
                <li>When dragging pieces within the same row of the game board or the combination notes they switch position, if that option is enabled</li>
            </ul>
            <h2>V0.6.1</h2>
            <ul className='version-history-list'>
                <li>Added long-press functionality for game slots and combination hint slots</li>
                <li>Added indicators for hints for the case that they violate basic boundary conditions</li>
                <li>Added Version History</li>
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
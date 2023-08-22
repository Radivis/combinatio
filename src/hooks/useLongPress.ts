import { useState, useRef, useEffect } from 'react';
import { longPressDefaultDuration } from '../constants';
import useUiStore from '../store/uiStore';

type useLongPressParams = {
  onClickHandler: (ev?: any) => void,
  onLongPressHandler: () => void,
  longPressDuration?: number};

export default function useLongPress({
    onClickHandler,
    onLongPressHandler,
    longPressDuration
}: useLongPressParams) {
    longPressDuration = longPressDuration || longPressDefaultDuration;
    const [actionType, setActionType] = useState<string>();
    const [isSuppressingMouseEvents, setIsSuppressingMouseEvents] = useState<boolean>(false);

    const { isLongPressSuppressed } = useUiStore(state => {
      const { isLongPressSuppressed } = state;
      return { isLongPressSuppressed }
    })
  
    const timerRef = useRef<NodeJS.Timeout>();
    const isLongPress = useRef<boolean>();

    // Stop the long press timeout, if long press is suppressed!
    useEffect(() => {
        clearTimeout(timerRef.current);
    }, [isLongPressSuppressed])
  
    const startPressTimer = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPressHandler();
            setActionType('longpress');
        }, longPressDuration)
    }
  
    const handleOnClick = (ev: any) => {
        if ( isLongPress.current === true ) {
            return;
        }
        onClickHandler(ev);
        setActionType('click')
    }
  
    const handleOnMouseDown = () => {
        if (isSuppressingMouseEvents === false) {
            startPressTimer();
        }
    }
  
    const handleOnMouseUp = () => {
        if (isSuppressingMouseEvents === false) {
            clearTimeout(timerRef.current);
        }
    }
  
    const handleOnTouchStart = () => {
        startPressTimer();
        setIsSuppressingMouseEvents(true);
    }
  
    const handleOnTouchEnd = () => {
        if ( isLongPress.current === true ) {
            return;
        }
        clearTimeout(timerRef.current);
    }
  
    return {
        actionType,
        handlers: {
            onClick: handleOnClick,
            onMouseDown: handleOnMouseDown,
            onMouseUp: handleOnMouseUp,
            onTouchStart: handleOnTouchStart,
            onTouchEnd: handleOnTouchEnd
        }
    }
}
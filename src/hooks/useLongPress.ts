import { useState, useRef } from 'react';
import { longPressDuration } from '../constants';

type useLongPressParams = {onClickHandler: Function, onLongPressHandler: Function};

export default function useLongPress({onClickHandler, onLongPressHandler}: useLongPressParams) {
    const [actionType, setActionType] = useState<string>();
    const [isSuppressingMouseEvents, setIsSuppressingMouseEvents] = useState<boolean>(false);
  
    const timerRef = useRef<NodeJS.Timeout>();
    const isLongPress = useRef<boolean>();
  
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
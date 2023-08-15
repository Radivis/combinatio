import { useState, useRef } from 'react';
import { longPressDuration } from '../constants';

type useLongPressParams = {onClickHandler: Function, onLongPressHandler: Function};

export default function useLongPress({onClickHandler, onLongPressHandler}: useLongPressParams) {
    const [actionType, setActionType] = useState<string>();
  
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
      console.log('handleOnClick');
      if ( isLongPress.current === true ) {
        return;
      }
      onClickHandler(ev);
      setActionType('click')
    }
  
    const handleOnMouseDown = () => {
      startPressTimer();
    }
  
    const handleOnMouseUp = () => {
      clearTimeout(timerRef.current);
    }
  
    const handleOnTouchStart = () => {
      startPressTimer();
    }
  
    const handleOnTouchEnd = () => {
      if ( actionType === 'longpress' ) return;
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
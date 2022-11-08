import { useState, useEffect } from 'react';

export const useKeyboard = (keyMap) => {
  const [movement, setMovement] = useState(() => {
    const initialMovement = {};
    for (const value in Object.values(keyMap)) {
      initialMovement[value] = false;
    }
    return initialMovement;
  });

  const handleKeyDown = (e) => {
    setMovement((movement) => ({ ...movement, [keyMap[e.code]]: true }));
  };

  const handleKeyUp = (e) => {
    setMovement((movement) => ({ ...movement, [keyMap[e.code]]: false }));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};

export const useMouse = (mouseMap) => {
  const [movement, setMovement] = useState(() => {
    const initialMovement = {};
    for (const value in Object.values(mouseMap)) {
      initialMovement[value] = false;
    }
    return initialMovement;
  });

  const handleMouseDown = (e) => {
    setMovement((movement) => ({ ...movement, [mouseMap[e.button]]: true }));
    if (e.button !== 1) e.preventDefault();
  };

  const handleMouseUp = (e) => {
    setMovement((movement) => ({ ...movement, [mouseMap[e.button]]: false }));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return movement;
};

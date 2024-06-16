import { useState, useEffect, useRef } from "react";

export const useKeyboard = (keyMap) => {
  const [movement, setMovement] = useState(() => {
    const initialMovement = {};
    for (const value of Object.values(keyMap)) {
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
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};

export const useMouse = () => {
  const [movement, setMovement] = useState({ movementX: 0, movementY: 0 });
  const [leftButton, setLeftButton] = useState(false);
  const [rightButton, setRightButton] = useState(false);

  const timeout = useRef();

  useEffect(() => {
    const onMouseMove = (event) => {
      const { movementX, movementY } = event;

      setMovement((movement) => ({
        movementX,
        movementY,
      }));

      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setMovement((movement) => ({
          movementX: 0,
          movementY: 0,
        }));
      }, 60);
    };

    const handleMouseUp = (e) => {
      setLeftButton(false);
      setRightButton(false);
    };

    const handleMouseDown = (e) => {
      setLeftButton(e.buttons == 1);
      setRightButton(e.buttons == 2);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return { movement, leftButton, rightButton };
};

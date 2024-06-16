import { Canvas } from "@react-three/fiber";
import { Column, Skybox, Ground } from "../components/environment";
import { Physics } from "@react-three/cannon";
import { Players } from "./players";
import { Bullets } from "./bullets";
import { Boss } from "./boss";
import { useState, useEffect, memo, useRef } from "react";
import { useKeyboard } from "../hooks/input";
import { useDispatch, useSelector } from "react-redux";

export const Content = memo(() => {
  return (
    <>
      <Skybox />
      <Column />
      <Physics>
        <Ground />
        <Boss />
        <Players />
        <Bullets />
      </Physics>
    </>
  );
});

export const Scene = memo(() => {
  const canvasRef = useRef(null);
  const movement = useKeyboard({
    CapsLock: "switch_lock",
  });
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    try {
      if (isPointerLocked) {
        canvas.requestPointerLock();
      } else {
        document.exitPointerLock();
      }
    } catch (error) {
      console.error("An error occurred while handling pointer lock:", error);
    }
  }, [isPointerLocked]);

  useEffect(() => {
    if (movement.switch_lock) setIsPointerLocked((prev) => !prev);
  }, [movement]);

  return (
    <Canvas ref={canvasRef}>
      <Content />
    </Canvas>
  );
});

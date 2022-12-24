import { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Character } from '../components/character';
import { Euler, Quaternion, Vector3 } from 'three';
import { View } from '@react-three/drei';
import styled from 'styled-components';

import roomBackgroundImage from '../resource/roomBackground.jpg';
import { PlayerCard } from '../components/playerCard';
import { useKeyboard } from './hooks/input';
import { useNavigate } from 'react-router-dom';

const keymap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyZ: 'select',
};

const RoomPageWrapper = styled.div`
  background-image: url(${roomBackgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
  position: relative;

  .canvas {
    position: fixed !important;
    top: -30px;
    left: 0px;
  }
`;

const SectionWrapper = styled.div`
  width: 80%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
`;

const RotationCharacter = ({ spin }) => {
  const [rotation, setRotation] = useState(new Euler(0, 0, 0));

  useEffect(() => {
    if (!spin) return;
    const id = setInterval(() => {
      setRotation((prev) => {
        const pre_q = new Quaternion().setFromEuler(prev);
        const delta_q = new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          0.1
        );
        const new_q = pre_q.multiply(delta_q);
        return new Euler().setFromQuaternion(new_q);
      });
    }, 60);
    return () => {
      clearInterval(id);
    };
  }, [rotation]);
  return <Character modelName={'Remilia'} rotation={rotation} scale={0.23} />;
};

export const RoomPage = () => {
  const { roomID, id, name } = useParams();
  const [selection, setSelection] = useState(1);
  const navigate = useNavigate();
  const optionNumber = 3;
  const movement = useKeyboard(keymap);

  const canvasRef = useRef();
  const localPlayerRef = useRef();
  const player1Ref = useRef();
  const player2Ref = useRef();
  const player3Ref = useRef();

  useEffect(() => {
    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection > optionNumber) newSelection = newSelection % optionNumber;
    if (newSelection <= 0) newSelection = newSelection + optionNumber;
    setSelection(newSelection);
    if (movement.select) {
      switch (selection) {
        case 1:
          break;
        case 2:
          break;
      }
    }
  }, [movement]);

  return (
    <>
      <RoomPageWrapper ref={canvasRef}>
        <SectionWrapper>
          <PlayerCard ref={localPlayerRef} name={'miko'} state={'ready'} />
        </SectionWrapper>
        <SectionWrapper>
          <PlayerCard ref={player1Ref} name={'miko'} state={'waiting'} />
          <PlayerCard ref={player2Ref} name={'miko'} state={'choosing'} />
          <PlayerCard ref={player3Ref} name={'miko'} state={'choosing'} />
        </SectionWrapper>
        <Canvas eventSource={canvasRef} className='canvas'>
          <View track={localPlayerRef}>
            <RotationCharacter spin={true} />
          </View>
          <View track={player1Ref}>
            <RotationCharacter spin={true} />
          </View>
          <View track={player2Ref}>
            <RotationCharacter spin={true} />
          </View>
          <View track={player3Ref}>
            <RotationCharacter spin={true} />
          </View>
        </Canvas>
      </RoomPageWrapper>
    </>
  );
};

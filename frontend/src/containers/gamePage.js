import styled from "styled-components";
import { OptionPanel } from "../components/optionPanel";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useKeyboard } from "../hooks/input";
import { GamePageProfile, StagePanel } from "../components/panel";
import { changeAudio, selectAudio } from "../components/resource";
import { leaveRoom } from "../services/webSocketService";
import { Scene } from "./scene";
import {
  loadingGif,
  stage1Audio,
  stage2Audio,
  stage3Audio,
} from "../components/resource";

const GamePageWrapper = styled.div`
  background-size: 100% 100%;
  width: 1440px;
  height: 700px;
  position: relative;
  cursor: none;
  .optionPanel {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 85%;
    left: 78%;
    width: 50%;
    height: 50%;
  }

  .profile {
    position: absolute;
    top: 0%;
    left: 0%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .resultPanel {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 10%;
    left: 50%;
  }
`;

const ResultWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  font-family: DFPOPコン W12;
  font-size: 60pt;
  font-weight: bold;
  color: #05fae7;
`;

const keymap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowLeft: "left",
  KeyZ: "select",
  Escape: "switch",
  Space: "start",
};

const GamePage = () => {
  /* global data */
  const profile = useSelector((state) => state.account.profile);
  const players = useSelector((state) => state.game.players);
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const dispatch = useDispatch();

  /* switch pages */
  const navigate = useNavigate();

  /* optionPanel */
  const [selection, setSelection] = useState(0);
  const [showOption, setShowOption] = useState(false);
  const optionNumber = 2;
  const options = ["Quit Game"];
  const movement = useKeyboard(keymap);

  /* container data */
  const [loading, setLoading] = useState(true);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  /* check if the user is already signed in */
  useEffect(() => {
    if (Object.keys(profile).length == 0) navigate("/login");
    if (Object.keys(roomInfo).length == 0) navigate("/");
    if (roomInfo.roomState == "choosing") navigate("/room");
  }, [profile, roomInfo]);

  /* stage control */
  useEffect(() => {
    return () => {
      stage1Audio.pause();
      stage2Audio.pause();
      stage3Audio.pause();

      stage1Audio.currentTime = 0;
      stage2Audio.currentTime = 0;
      stage3Audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const { stage, startStage } = roomInfo;

    stage1Audio.pause();
    stage2Audio.pause();
    stage3Audio.pause();

    if (!stage || !startStage) return;

    if (stage == 1) {
      stage1Audio.play();
    }
    if (stage == 2) {
      stage2Audio.play();
    }
    if (stage == 3) {
      stage3Audio.play();
    }
  }, [roomInfo]);

  useEffect(() => {
    const AllPlayersDead = !players.some((player) =>
      player.healthPoints ? player.healthPoints > 0 : true
    );
    if (roomInfo.stage == 4) setWin(true);
    if (AllPlayersDead) setLose(true);
  }, [roomInfo, players]);

  /* execute option */
  useEffect(() => {
    if (movement.switch) {
      setShowOption((prev) => !prev);
    }
    if (!showOption) return;

    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection >= optionNumber) newSelection = 0;
    if (newSelection <= -1) newSelection = newSelection + optionNumber;
    setSelection(newSelection);

    if (movement.select) {
      switch (selection) {
        case 0:
          leaveRoom(roomInfo.roomID);
          break;
        case 1:
      }
      selectAudio.play();
    } else {
      changeAudio.play();
    }
  }, [movement]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <img src={loadingGif} alt="Loading..." />;
  }
  return (
    <GamePageWrapper>
      <Scene />
      {showOption ? (
        <OptionPanel options={options} selection={selection} />
      ) : null}
      {win || lose ? (
        <ResultWrapper className="resultPanel">
          {win ? "YOU WIN" : "YOU LOSE"}
        </ResultWrapper>
      ) : null}
      <GamePageProfile />
      <StagePanel />
    </GamePageWrapper>
  );
};

export default GamePage;

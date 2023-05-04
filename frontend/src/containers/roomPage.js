import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { View } from "@react-three/drei";
import styled from "styled-components";
import { Physics } from "@react-three/cannon";

import { roomBackgroundImage } from "../components/resource";
import { RotationCharacter, characterList } from "../components/character";
import { PlayerCard } from "../components/playerCard";
import { useKeyboard } from "./hooks/input";
import { OptionPanel } from "../components/optionPanel";
import { useUser } from "./hooks/context";
import { displayRoomID, displayStatus } from "../components/info";
import { network } from "./hooks/network";
import { InviteModal } from "../components/modal";
import { changeAudio, selectAudio } from "../components/resource";

const keymap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
  ArrowLeft: "left",
  KeyZ: "select",
};

const RoomPageWrapper = styled.div`
  background-image: url(${roomBackgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .canvas {
    position: fixed !important;
    top: 0px;
    left: 0px;
  }
`;

const OptionSectionWrapper = styled.div`
  width: 25%;
  height: 60%;
  display: flex;
`;

const PlayerSectionWrapper = styled.div`
  width: 75%;
  height: 100%;
`;

const SectionWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
`;

const RoomPage = () => {
  /* optionPanel */
  const [selection, setSelection] = useState(4);
  const optionNumber = 5;
  const textOptions = ["Start", "Quit", "Invite", "RoomID"];
  const movement = useKeyboard(keymap);
  /* control modal */
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  /* temp data */
  const [modelIndex, setModelIndex] = useState(0);
  const [state, setState] = useState("choosing");
  const [me, setMe] = useState();
  const [others, setOthers] = useState();
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  /* user-defined hook */
  const { signIn, setSignIn, profile, setModelName, setIsLeader } = useUser();
  const { playerList, redirect, roomID, message } = network.useNetwork();
  /* switch pages */
  const navigate = useNavigate();

  /* check if the user is already signed in */
  useEffect(() => {
    if (!signIn) navigate("/login");
    if (signIn && Object.keys(profile).length === 0) {
      displayStatus({
        type: "error",
        msg: "Sign in failed",
      });
      setSignIn(false);
    }
  }, [signIn]);

  /* handle netLocation change */
  useEffect(() => {
    if (redirect === "game") navigate("/game");
    else if (redirect === "home") navigate("/");
  }, [redirect]);

  /* update player state(waiting,choosing,read) and modelname */
  useEffect(() => {
    network.updatePlayer(roomID, profile.email, {
      modelName: characterList[modelIndex],
      state: state,
    });
  }, [modelIndex, state]);

  /* obtain player states */

  useEffect(() => {
    if (!playerList) return;
    const newMe = playerList?.filter(
      (player) => player.email === profile.email
    )[0];

    const newOthers = playerList?.filter(
      (player) => player.email !== profile.email
    );

    if (newOthers?.length < 3) {
      const emptyNum = 3 - newOthers.length;
      for (let i = 1; i <= emptyNum; i++) {
        newOthers.push({ state: "waiting" });
      }
    }

    setMe(newMe);
    setOthers(newOthers);
    setModelName(newMe?.modelName);
    setIsLeader(newMe.isLeader === true);
  }, [playerList]);

  /* keep fetchDataing when inviteModalOpen is true */

  useEffect(() => {
    function fetchData() {
      network
        .openFriendSystem(profile.email)
        .then(({ onlineFriends, friends }) => {
          setOnlineFriends(onlineFriends);
          setFriends(friends);
        });
    }
    if (inviteModalOpen) {
      fetchData();
      setInterval(fetchData, 2000);
    } else {
      clearInterval(fetchData);
    }
  }, [inviteModalOpen]);

  /* execute options */

  useEffect(() => {
    async function callback() {
      let newSelection = selection;
      if (movement.up) newSelection = selection - 1;
      if (movement.down) newSelection = selection + 1;
      if (newSelection >= optionNumber) newSelection = 0;
      if (newSelection <= -1) newSelection = newSelection + optionNumber;
      setSelection(newSelection);

      if (newSelection === optionNumber - 1) {
        let newModelIndex = modelIndex;
        if (movement.right) newModelIndex++;
        if (movement.left) newModelIndex--;
        if (newModelIndex >= characterList.length) newModelIndex = 0;
        if (newModelIndex <= -1) newModelIndex = characterList.length - 1;
        setModelIndex(newModelIndex);
        setState("choosing");
      }

      if (movement.select) {
        switch (selection) {
          case 0:
            network.startGame(roomID);
            break;
          case 1:
            network.leaveRoom(roomID, profile.email);
            break;
          case 2:
            setInviteModalOpen(true);
            break;
          case 3:
            displayRoomID(roomID);
            break;
          case 4:
            setState("ready");
            setSelection(0);
            break;
        }
        selectAudio.play();
      } else {
        changeAudio.play();
      }
    }
    callback();
  }, [movement]);

  /* modal callback */

  const OnInviteFriend = (email_to) => {
    network.inviteFriend(profile.email, email_to, roomID);
  };

  /* socket messages */

  useEffect(() => {
    displayStatus(message);
  }, [message]);

  /* bind 3D model  to div */
  const canvasRef = useRef();
  const player0Ref = useRef();
  const player1Ref = useRef();
  const player2Ref = useRef();
  const player3Ref = useRef();
  const playerRefArray = useRef([player1Ref, player2Ref, player3Ref]);

  return (
    <>
      <InviteModal
        open={inviteModalOpen}
        friends={friends}
        onInvite={OnInviteFriend}
        onlineFriends={onlineFriends}
        onCancel={() => setInviteModalOpen(false)}
      ></InviteModal>
      <RoomPageWrapper ref={canvasRef}>
        <PlayerSectionWrapper>
          <SectionWrapper>
            <PlayerCard
              ref={player0Ref}
              name={me?.name}
              state={me?.state}
              isLeader={me?.isLeader}
              showArrow={selection === optionNumber - 1}
            />
          </SectionWrapper>
          <SectionWrapper>
            {others?.map((other, index) => (
              <PlayerCard
                key={index}
                ref={playerRefArray.current[index]}
                name={other.name}
                state={other.state}
                modelName={other.modelName}
                isLeader={other.isLeader}
              />
            ))}
          </SectionWrapper>
        </PlayerSectionWrapper>
        <Canvas eventSource={canvasRef} className="canvas">
          <Physics>
            {
              <View track={player0Ref}>
                <RotationCharacter
                  spin={me?.state === "choosing"}
                  modelName={me?.modelName}
                  scale={0.23}
                />
              </View>
            }
            {others?.map((other, index) =>
              other.state !== "waiting" ? (
                <View track={playerRefArray.current[index]} key={index}>
                  <RotationCharacter
                    spin={other.state === "choosing"}
                    modelName={other.modelName}
                    scale={0.23}
                  />
                </View>
              ) : null
            )}
          </Physics>
        </Canvas>
        <OptionSectionWrapper>
          <OptionPanel options={textOptions} selection={selection} />
        </OptionSectionWrapper>
      </RoomPageWrapper>
    </>
  );
};

export default RoomPage;

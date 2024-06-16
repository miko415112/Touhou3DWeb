import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { View } from "@react-three/drei";
import styled from "styled-components";
import { Physics } from "@react-three/cannon";
import { useDispatch, useSelector } from "react-redux";
import { roomBackgroundImage } from "../components/resource";
import { RotationCharacter, characterList } from "../components/character";
import { PlayerCard } from "../components/playerCard";
import { useKeyboard } from "../hooks/input";
import { OptionPanel } from "../components/optionPanel";
import { displayRoomID } from "../components/info";
import { InviteModal } from "../components/modal";
import { changeAudio, selectAudio } from "../components/resource";
import { fetchFriends } from "../services/httpService";
import {
  updatePlayer,
  startGame,
  leaveRoom,
  inviteFriend,
} from "../services/webSocketService";
import { addNotifyMessage } from "../redux/slices/messageSlice";
import { loadingGif } from "../components/resource";

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
  background-size: 100% 100%;
  width: 1440px;
  height: 700px;
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
  width: 20%;
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
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [modelIndex, setModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* user data */
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.account.profile);
  const players = useSelector((state) => state.game.players);
  const me = players?.find((player) => player.email == profile.email);
  const others = players?.filter((player) => player.email != profile.email);
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const roomID = roomInfo?.roomID;
  const friends = useSelector((state) => state.account.friends);

  /* switch pages */
  const navigate = useNavigate();

  /* check if the user is already signed in */
  useEffect(() => {
    console.log(roomInfo);
    if (Object.keys(profile).length == 0) navigate("/login");
    if (Object.keys(roomInfo).length == 0) navigate("/");
    if (roomInfo.roomState == "fighting") navigate("/game");
  }, [profile, roomInfo]);

  useEffect(() => {
    if (inviteModalOpen) {
      dispatch(fetchFriends());
    }
  }, [inviteModalOpen]);

  /* execute options */

  useEffect(() => {
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

      updatePlayer(roomID, {
        ...me,
        modelName: characterList[newModelIndex],
        state: "choosing",
      });

      setModelIndex(newModelIndex);
    }

    if (movement.select) {
      switch (selection) {
        case 0:
          startGame(roomID);
          break;
        case 1:
          leaveRoom(roomID);
          break;
        case 2:
          setInviteModalOpen(true);
          break;
        case 3:
          displayRoomID(roomID, () => {
            navigator.clipboard.writeText(roomID).then(() => {
              dispatch(
                addNotifyMessage({
                  type: "success",
                  text: "RoomID copied",
                })
              );
            });
          });
          break;
        case 4:
          updatePlayer(roomID, { ...me, state: "ready" });
          setSelection(0);
          break;
      }
      selectAudio.play();
    } else {
      changeAudio.play();
    }
  }, [movement]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  /* bind 3D model  to div */
  const canvasRef = useRef();
  const player0Ref = useRef();
  const player1Ref = useRef();
  const player2Ref = useRef();
  const player3Ref = useRef();
  const playerRefArray = useRef([player1Ref, player2Ref, player3Ref]);

  if (loading) {
    return <img src={loadingGif} alt="Loading..." />;
  }

  return (
    <>
      <InviteModal
        open={inviteModalOpen}
        friends={friends}
        onInvite={(email) => inviteFriend(email, roomID)}
        onCancel={() => setInviteModalOpen(false)}
      ></InviteModal>
      <RoomPageWrapper ref={canvasRef}>
        <PlayerSectionWrapper>
          <SectionWrapper>
            <PlayerCard
              ref={player0Ref}
              name={me?.name}
              state={me?.state}
              isMe={true}
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
                isMe={false}
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

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { homeBackgroundImage } from "../components/resource";
import { useKeyboard } from "../hooks/input";
import { JoinRoomModal, FriendsModal } from "../components/modal";
import { OptionPanel } from "../components/optionPanel";
import { HomePageProfile } from "../components/panel";
import { changeAudio, selectAudio } from "../components/resource";
import {
  fetchFriends,
  fetchFriendRequests,
  logOutGame,
  addFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from "../services/httpService";
import { createRoom, joinRoom } from "../services/webSocketService";

const keymap = {
  ArrowUp: "up",
  ArrowDown: "down",
  KeyZ: "select",
};

const HomePageWrapper = styled.div`
  background-image: url(${homeBackgroundImage});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 1440px;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;

  .optionPanel {
    width: 50%;
    height: 50%;
  }

  .profile {
    position: absolute;
    top: 20px;
    left: 20px;
  }
`;

const HomePage = () => {
  /* use option panel */
  const movement = useKeyboard(keymap);
  const [selection, setSelection] = useState(0);
  const optionNumber = 4;
  const options = ["Create Game", "Join Game", "Friends", "Log Out"];
  /* manage modals */
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  /* switch pages */
  const navigate = useNavigate();
  /* user data */
  const profile = useSelector((state) => state.account.profile);
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const friends = useSelector((state) => state.account.friends);
  const requests = useSelector((state) => state.account.requests);
  const chatMessages = useSelector((state) => state.message.chatMessages);

  const dispatch = useDispatch();

  /* check if the user is already signed in */
  useEffect(() => {
    if (Object.keys(profile).length == 0) navigate("/login");
  }, [profile]);

  /* handle netLocation change */
  useEffect(() => {
    if (Object.keys(roomInfo).length > 0) navigate("/room");
  }, [roomInfo]);

  /* keep fetching data when friendsModalOpen is true */

  useEffect(() => {
    if (friendsModalOpen) {
      dispatch(fetchFriends());
      dispatch(fetchFriendRequests());
    }
  }, [friendsModalOpen]);

  /* execute option */

  useEffect(() => {
    let newSelection = selection;
    if (movement.up) newSelection = selection - 1;
    if (movement.down) newSelection = selection + 1;
    if (newSelection >= optionNumber) newSelection = 0;
    if (newSelection <= -1) newSelection = newSelection + optionNumber;
    setSelection(newSelection);

    if (movement.select) {
      switch (selection) {
        case 0:
          createRoom();
          break;
        case 1:
          setJoinRoomModalOpen(true);
          break;
        case 2:
          setFriendsModalOpen(true);
          break;
        case 3:
          dispatch(logOutGame());
          break;
      }
      selectAudio.play();
    } else {
      if (movement.up || movement.down) changeAudio.play();
    }
  }, [movement]);

  /* modal callback */

  const OnAddFriend = async (values) => {
    const email_to = values.email;
    dispatch(addFriendRequest(email_to));
  };

  const OnAcceptFriend = async (email_to) => {
    dispatch(acceptFriendRequest(email_to));
  };

  const OnDeleteFriend = async (email_to) => {
    dispatch(removeFriend(email_to));
  };

  const OnDeleteRequest = async (email_to) => {
    dispatch(rejectFriendRequest(email_to));
  };

  const OnJoinRoom = (values) => {
    const roomID = values.roomID;
    joinRoom(roomID);
    setJoinRoomModalOpen(false);
  };

  return (
    <>
      <JoinRoomModal
        open={joinRoomModalOpen}
        onCancel={() => setJoinRoomModalOpen(false)}
        onJoin={OnJoinRoom}
      />
      <FriendsModal
        open={friendsModalOpen}
        onCancel={() => setFriendsModalOpen(false)}
        onAddFriend={OnAddFriend}
        onAcceptFriend={OnAcceptFriend}
        onDeleteFriend={OnDeleteFriend}
        onDeleteRequest={OnDeleteRequest}
        requests={requests}
        friends={friends}
      ></FriendsModal>
      <HomePageWrapper>
        <HomePageProfile src={profile?.picture} name={profile?.name} />
        <OptionPanel options={options} selection={selection} />
      </HomePageWrapper>
    </>
  );
};

export default HomePage;

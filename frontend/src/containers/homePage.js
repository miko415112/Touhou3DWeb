import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { network } from "./hooks/network";
import { homeBackgroundImage } from "../components/resource";
import { useKeyboard } from "./hooks/input";
import { JoinRoomModal, FriendsModal } from "../components/modal";
import { OptionPanel } from "../components/optionPanel";
import { useUser } from "./hooks/context";
import { displayStatus, displayInvitation } from "../components/info";
import { HomePageProfile } from "../components/profile";
import { changeAudio, selectAudio } from "../components/resource";

const keymap = {
  ArrowUp: "up",
  ArrowDown: "down",
  KeyZ: "select",
};

const HomePageWrapper = styled.div`
  background-image: url(${homeBackgroundImage});
  background-repeat: no-repeat;
  width: 1200px;
  height: 675px;
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
  /* user-defined hook */
  const { signIn, profile, setSignIn, setProfile } = useUser();
  const { message, redirect, invitation } = network.useNetwork();
  /* temp data */
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

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
    if (redirect === "room") navigate("/room");
  }, [redirect]);

  /* keep fetching data when friendsModalOpen is true */

  useEffect(() => {
    function fetchData() {
      network.openFriendSystem(profile.email).then(({ requests, friends }) => {
        setRequests(requests);
        setFriends(friends);
      });
    }

    if (friendsModalOpen) {
      fetchData();
      setInterval(fetchData, 2000);
    } else {
      clearInterval(fetchData);
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
          network.createRoom(profile.email, profile.name, profile.picture);
          break;
        case 1:
          setJoinRoomModalOpen(true);
          break;
        case 2:
          setFriendsModalOpen(true);
          break;
        case 3:
          network.logOutGame();
          setSignIn(false);
          setProfile({});
          navigate("/login");
          break;
      }
      selectAudio.play();
    } else {
      changeAudio.play();
    }
  }, [movement]);

  /* socket message */

  useEffect(() => {
    displayStatus(message);
  }, [message]);

  /* socket invitation */

  useEffect(() => {
    if (invitation)
      displayInvitation(invitation.user, () => {
        network.joinRoom(
          profile.email,
          profile.name,
          profile.picture,
          invitation.roomID
        );
      });
  }, [invitation]);

  /* modal callback */

  const OnAddFriend = async (values) => {
    const email_to = values.email;
    const email_from = profile.email;
    const data = await network.addFriend(email_from, email_to);
    displayStatus({ type: "success", msg: data.msg });
  };

  const OnAcceptFriend = async (email_from) => {
    const email_to = profile.email;
    const data = await network.acceptFriend(email_from, email_to);
    setRequests(data.requests);
    setFriends(data.friends);
    displayStatus({ type: "success", msg: data.msg });
  };

  const OnDeleteFriend = async (email_to) => {
    const email_from = profile.email;
    const data = await network.deleteFriend(email_from, email_to);
    setFriends(data.friends);
    displayStatus({ type: "success", msg: data.msg });
  };

  const OnDeleteRequest = async (email_to) => {
    const email_from = profile.email;
    const data = await network.deleteRequest(email_from, email_to);
    setRequests(data.requests);
    displayStatus({ type: "success", msg: data.msg });
  };

  const OnJoinRoom = (values) => {
    const roomID = values.roomID;
    network.joinRoom(profile.email, profile.name, profile.picture, roomID);
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

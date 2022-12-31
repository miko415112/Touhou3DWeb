import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  signIn: false,
  google: '',
  name: '',
  friends: [],
  onlineFriends: [],
  requests: [],
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  showBox: false,
  setSignIn: () => {},
  setGoogle: () => {},
  setFriends: () => {},
  setOnlineFriends: () => {},
  setRequests: () => {},
  setName: () => {},
  setRoomID: () => {},
  setPlayerID: () => {},
  setLocation: () => {},
  setModelName: () => {},
  setShowBox: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
  const [signIn, setSignIn] = useState(false);
  const [google, setGoogle] = useState('');
  const [name, setName] = useState('');
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [modelName, setModelName] = useState('Remilia');
  const [location, setLocation] = useState('home');
  const [showBox, setShowBox] = useState(false);

  return (
    <UserContext.Provider
      value={{
        signIn,
        google,
        name,
        friends,
        onlineFriends,
        requests,
        roomID,
        playerID,
        location,
        modelName,
        onlineFriends,
        showBox,
        setSignIn,
        setGoogle,
        setName,
        setFriends,
        setOnlineFriends,
        setRequests,
        setRoomID,
        setPlayerID,
        setLocation,
        setModelName,
        setShowBox,
      }}
      {...props}
    />
  );
};

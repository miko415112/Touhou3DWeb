import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  signIn: false,
  google: '',
  name: '',
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  showBox: false,
  setSignIn: () => {},
  setGoogle: () => {},
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
        roomID,
        playerID,
        location,
        modelName,
        showBox,
        setSignIn,
        setGoogle,
        setName,
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

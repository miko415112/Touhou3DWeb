import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  signIn: false,
  google: '',
  name: '',
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  setSignIn: () => {},
  setGoogle: () => {},
  setName: () => {},
  setRoomID: () => {},
  setPlayerID: () => {},
  setLocation: () => {},
  setModelName: () => {},
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
        setSignIn,
        setGoogle,
        setName,
        setRoomID,
        setPlayerID,
        setLocation,
        setModelName,
      }}
      {...props}
    />
  );
};

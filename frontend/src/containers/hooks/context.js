import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  google: '',
  name: '',
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  showBox: false,
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
        google,
        name,
        roomID,
        playerID,
        location,
        modelName,
        showBox,
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

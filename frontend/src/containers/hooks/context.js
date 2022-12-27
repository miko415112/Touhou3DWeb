import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  name: '',
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  setName: () => {},
  setRoomID: () => {},
  setPlayerID: () => {},
  setLocation: () => {},
  setModelName: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [modelName, setModelName] = useState('Remilia');
  const [location, setLocation] = useState('home');

  return (
    <UserContext.Provider
      value={{
        name,
        roomID,
        playerID,
        location,
        modelName,
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

import { useState, useContext, createContext, useEffect } from 'react';
const UserContext = createContext({
  signIn: false,
  email: '',
  name: '',
  roomID: '',
  playerID: '',
  location: '',
  modelName: '',
  setSignIn: () => {},
  setEmail: () => {},
  setName: () => {},
  setRoomID: () => {},
  setPlayerID: () => {},
  setLocation: () => {},
  setModelName: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
  const [signIn, setSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [modelName, setModelName] = useState('Remilia');
  const [location, setLocation] = useState('home');

  return (
    <UserContext.Provider
      value={{
        signIn,
        email,
        name,
        roomID,
        playerID,
        location,
        modelName,
        setSignIn,
        setEmail,
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

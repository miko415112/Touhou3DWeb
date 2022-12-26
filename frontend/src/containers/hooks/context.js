import { useState, useContext, createContext, useEffect } from 'react';
import { message } from 'antd';
const UserContext = createContext({
  name: '',
  roomID: '',
  playerID: '',
  state: 'home',
  setName: () => {},
  setRoomID: () => {},
  setPlayerID: () => {},
  setState: () => {},
  displayStatus: () => {},
});

export const useUser = () => useContext(UserContext);

const displayStatus = (s) => {
  if (s.msg) {
    const { type, msg } = s;
    const content = {
      content: msg,
      duration: s.duration ? s.duration : 2,
    };
    switch (type) {
      case 'success':
        message.success(content);
        break;
      case 'error':
      default:
        message.error(content);
        break;
    }
  }
};
export const UserProvider = (props) => {
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [playerID, setPlayerID] = useState('');
  const [state, setState] = useState('home');

  return (
    <UserContext.Provider
      value={{
        name,
        roomID,
        playerID,
        state,
        setName,
        setRoomID,
        setPlayerID,
        setState,
        displayStatus,
      }}
      {...props}
    />
  );
};

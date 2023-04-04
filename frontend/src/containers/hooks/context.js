import { useState, useContext, createContext, useEffect } from "react";
const UserContext = createContext({
  signIn: false,
  profile: {},
  modelName: "",
  isLeader: false,
  showBox: false,
  setSignIn: () => {},
  setProfile: () => {},
  setIsLeader: () => {},
  setModelName: () => {},
  setShowBox: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => {
  const [signIn, setSignIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [modelName, setModelName] = useState("Remilia");
  const [showBox, setShowBox] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  return (
    <UserContext.Provider
      value={{
        signIn,
        profile,
        isLeader,
        modelName,
        showBox,
        setSignIn,
        setProfile,
        setModelName,
        setIsLeader,
        setShowBox,
      }}
      {...props}
    />
  );
};

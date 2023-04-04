import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { googleLoginImage, introImage } from "../components/resource";
import { network } from "./hooks/network";
import { useUser } from "./hooks/context";
import { useEffect } from "react";
const LoginPageWrapper = styled.div`
  display: flex;
  width: 1200px;
  height: 675px;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  img {
    width: 250px;
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
  font-family: arial;
  gap: 40px;
`;

const GoogleButtonWrapper = styled.button`
  border: none;
  padding: 0px;
  width: fit-content;
  img {
    width: 300px;
  }
  img:hover {
    cursor: pointer;
  }
`;

const LoginPage = () => {
  const { signIn, setSignIn, setProfile } = useUser();
  const navigate = useNavigate();

  /* redirect to home page */

  useEffect(() => {
    if (signIn) navigate("/");
  }, [signIn]);

  const handleLogin = async () => {
    /* get auth code */
    const popup = window.open(
      network.getOauthURL(),
      "Google Oauth2",
      "popup=yes"
    );
    const timer = setInterval(async () => {
      const url = new URL(popup.location.href);
      const code = url.searchParams.get("code");
      /* use code to signIn */
      if (code) {
        const profile = await network.signInGame(code);
        setSignIn(true);
        setProfile(profile);
        popup.close();
        clearInterval(timer);
      }
    }, 500);
  };

  return (
    <>
      <LoginPageWrapper>
        <ContentWrapper>
          <img src={introImage} />
          <LoginWrapper>
            <div>Welcome To Login</div>
            <GoogleButtonWrapper onClick={handleLogin}>
              <img src={googleLoginImage} />
            </GoogleButtonWrapper>
          </LoginWrapper>
        </ContentWrapper>
      </LoginPageWrapper>
    </>
  );
};

export default LoginPage;

import styled from "styled-components";
import { googleLoginImage, introImage } from "../components/resource";
import { useNetwork } from "./hooks/network";
import { useUser } from "./hooks/context";
import { useNavigate } from "react-router-dom";
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
  const { signInGame } = useNetwork();
  const { setMikoToken, setSignIn } = useUser();
  const navigate = useNavigate();
  const handleLogin = async () => {
    const url =
      process.env.NODE_ENV == "production"
        ? window.location.origin + "/api/oauth"
        : "http://localhost:4000/api/oauth";
    const popup = window.open(url, "Google Oauth2", "popup=yes");
    const timer = setInterval(async () => {
      const url = new URL(popup.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const token = await signInGame(code);
        setMikoToken(token);
        setSignIn(true);
        navigate("/", { replace: true });
        popup.close();
      }
      if (popup.closed) clearInterval(timer);
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

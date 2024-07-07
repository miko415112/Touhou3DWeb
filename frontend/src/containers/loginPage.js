import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { googleLoginImage, introImage } from "../components/resource";
import { useEffect } from "react";
import { signInGame } from "../services/httpService";
import { useDispatch, useSelector } from "react-redux";

const LoginPageWrapper = styled.div`
  display: flex;
  background-size: 100% 100%;
  width: 1440px;
  height: 700px;
  padding-left: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  padding: 50px;
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

const GameInfo = () => {
  return (
    <div>
      <h2>Controls</h2>
      <ul>
        <li>
          Menu Operation: Use the up and down arrow keys to change the option,
          press Z to confirm selection.
        </li>
        <li>
          Room Operation: Use the up and down arrow keys to change the option,
          which includes start, quit, invite, room ID, and character. When in
          the "Character" option, arrows will appear on both sides of the
          character frame. Pressing the left and right arrow keys will change
          the selected character. All players must press Z to be ready before
          the game starts.
        </li>
        <li>
          Game Operation: Use W/S to move up and down, A/D to rotate left and
          right, the space bar to move forward, click the left mouse button to
          shoot, press ESC to open the menu, and hold Shift to slow down the
          character's movement (Note : press Capslock button to start orbital
          control)
        </li>
      </ul>
      <h2>Game Rules</h2>
      <ul>
        <li>
          Each player has three lives, and the field is divided into two areas.
          The boss is on one side, and the remaining players are on the other
          side. The movement range is limited, and players cannot move beyond
          the boundary.
        </li>
        <li>
          When hit by a bullet, players will have three seconds of
          invincibility.
        </li>
        <li>Once a player dies, they can no longer shoot bullets.</li>
        <li>
          To end the game, press ESC to open the menu, and then leave the game
          without refreshing.
        </li>
      </ul>
      <h2>Reference</h2>
      <h3>Image</h3>
      <ul>
        <li>
          <a href="https://www.spriters-resource.com/fullview/120461/">
            https://www.spriters-resource.com/fullview/120461/
          </a>
        </li>
        <li>
          <a href="https://www.goodfon.com/wallpaper/moon-cosmos-sci-fi-art.html">
            https://www.goodfon.com/wallpaper/moon-cosmos-sci-fi-art.html
          </a>
        </li>
        <li>
          <a href="https://www.pinterest.com/pin/676877018993327227/">
            https://www.pinterest.com/pin/676877018993327227/
          </a>
        </li>
      </ul>

      <h3>Model</h3>
      <ul>
        <li>
          <a href="https://sketchfab.com/3d-models/remilia-scarlet-fumo-3d-scan-e45fe2f126c84c2d84964468746ce257">
            https://sketchfab.com/3d-models/remilia-scarlet-fumo-3d-scan-e45fe2f126c84c2d84964468746ce257
          </a>
        </li>
        <li>
          <a href="https://sketchfab.com/3d-models/project-suwako-moriya-fumo-2cb48aeeb1d94b27960b416fbb368929">
            https://sketchfab.com/3d-models/project-suwako-moriya-fumo-2cb48aeeb1d94b27960b416fbb368929
          </a>
        </li>
        <li>
          <a href="https://sketchfab.com/3d-models/project-koishi-komeiji-fumo-37a56b489b5c4440bbabb7b7777036f6">
            https://sketchfab.com/3d-models/project-koishi-komeiji-fumo-37a56b489b5c4440bbabb7b7777036f6
          </a>
        </li>
        <li>
          <a href="https://sketchfab.com/3d-models/project-sanae-kochiya-fumo-49518274d9b340d6b689298ba2ecc8a8">
            https://sketchfab.com/3d-models/project-sanae-kochiya-fumo-49518274d9b340d6b689298ba2ecc8a8
          </a>
        </li>
        <li>
          <a href="https://sketchfab.com/3d-models/project-hong-meiling-fumo-8c7a286931164bf693b524679d85db99">
            https://sketchfab.com/3d-models/project-hong-meiling-fumo-8c7a286931164bf693b524679d85db99
          </a>
        </li>
        <li>
          <a href="https://sketchfab.com/3d-models/scuffed-sakuya-fumo-0d83abc11bfa434a96cedeb453e308b0">
            https://sketchfab.com/3d-models/scuffed-sakuya-fumo-0d83abc11bfa434a96cedeb453e308b0
          </a>
        </li>
      </ul>
      <h3>Sound</h3>
      <ul>
        <li>
          <a href="https://www.sounds-resource.com/pc_computer/touhoukoumakyoutheembodimentofscarletdevil/sound/327/">
            https://www.sounds-resource.com/pc_computer/touhoukoumakyoutheembodimentofscarletdevil/sound/327/
          </a>
        </li>
        <li>
          <a href="https://www.sounds-resource.com/pc_computer/touhoukoumakyoutheembodimentofscarletdevil/sound/327/">
            https://www.youtube.com/@katukunazawa5121
          </a>
        </li>
      </ul>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.account.profile);

  useEffect(() => {
    if (Object.keys(profile).length > 0) navigate("/");
  }, [profile]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      dispatch(signInGame(code));
    }
  }, []);

  const handleLogin = async () => {
    console.log(process.env.NODE_ENV);
    /* get auth code */
    const auth_url =
      process.env.NODE_ENV == "production"
        ? window.location.origin + "/auth/code"
        : process.env.REACT_APP_LOCAL_BACKEND_URL + "/auth/code";

    console.log(auth_url);
    window.location.href = auth_url;
  };

  return (
    <>
      <LoginPageWrapper>
        <ContentWrapper>
          <img src={introImage} />
          <LoginWrapper>
            <div>Welcome to login</div>
            <GoogleButtonWrapper onClick={handleLogin}>
              <img src={googleLoginImage} />
            </GoogleButtonWrapper>
          </LoginWrapper>
        </ContentWrapper>
        <GameInfo />
      </LoginPageWrapper>
    </>
  );
};

export default LoginPage;

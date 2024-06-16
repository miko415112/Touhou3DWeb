import styled from "styled-components";
import { AimOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { bossIcon } from "../components/resource";

const HomeRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: White;
  font-weight: bold;
  font-size: 25pt;
  gap: 20px;

  img {
    width: 45px;
    height: 45px;
  }
`;

const GameRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: ${(props) => (props.dead ? "red" : "white")};
  font-size: 18pt;
  gap: 20px;

  img {
    width: 40px;
    height: 40px;
  }
`;

export const HomePageProfile = ({ src, name }) => {
  return (
    <div className="profile">
      <HomeRowWrapper>
        <img src={src} referrerPolicy="no-referrer" />
        <div>{name}</div>
      </HomeRowWrapper>
    </div>
  );
};

export const GamePageProfile = () => {
  const profile = useSelector((state) => state.account.profile);
  const players = useSelector((state) => state.game.players);
  const bossHealthPoints = useSelector((state) => state.game.bossHealthPoints);

  return (
    <div className="profile">
      <GameRowWrapper key="boss" $dead={bossHealthPoints <= 0 ? true : false}>
        <img src={bossIcon} referrerPolicy="no-referrer" />
        <div>Boss</div>
        <div>{bossHealthPoints <= 0 ? "LOSE" : "HP : " + bossHealthPoints}</div>
      </GameRowWrapper>

      {players?.map((player, index) => {
        const { healthPoints, name, picture, email } = player;
        return (
          <GameRowWrapper key={index} $dead={healthPoints <= 0 ? true : false}>
            <img src={picture} referrerPolicy="no-referrer" />
            <div>{name}</div>
            <div>{healthPoints <= 0 ? "LOSE" : "HP : " + healthPoints}</div>
            {email == profile.email ? <AimOutlined /> : null}
          </GameRowWrapper>
        );
      })}
    </div>
  );
};

const StyledPanel = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  background-color: rgba(0, 225, 208, 0.5);
  color: white;
  font-weight: bold;
  font-size: 20px;
  border-radius: 8px;
  z-index: 999;
`;

export const StagePanel = () => {
  const roomInfo = useSelector((state) => state.game.roomInfo);
  const { startStage, stage } = roomInfo;

  if (startStage) return <></>;
  if (stage == 1) {
    return (
      <StyledPanel>
        Stage1 <br /> ~ Fibonacci Sphere ~
      </StyledPanel>
    );
  }
  if (stage == 2) {
    return (
      <StyledPanel>
        Stage2 <br /> ~ Laser Prison ~
      </StyledPanel>
    );
  }

  if (stage == 3) {
    return (
      <StyledPanel>
        Stage3 <br /> ~ Forbidden Time Zone ~
      </StyledPanel>
    );
  }
};

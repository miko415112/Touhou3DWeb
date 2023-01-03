import styled from 'styled-components';
import { AimOutlined } from '@ant-design/icons';

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
  color: ${(props) => (props.dead ? 'red' : 'white')};
  font-size: 18pt;
  gap: 20px;

  img {
    width: 40px;
    height: 40px;
  }
`;

export const HomePageProfile = ({ src, name }) => {
  return (
    <div className='profile'>
      <HomeRowWrapper>
        <img src={src} referrerpolicy='no-referrer' />
        <div>{name}</div>
      </HomeRowWrapper>
    </div>
  );
};

export const GamePageProfile = ({ playerList }) => {
  return (
    <div className='profile'>
      {playerList?.map((player, index) => (
        <GameRowWrapper key={index} dead={player.healthPoints <= 0}>
          <img src={player.picture} referrerpolicy='no-referrer' />
          <div>{player.name}</div>
          <div>
            {player.healthPoints <= 0 ? 'LOSE' : 'HP :' + player.healthPoints}
          </div>
          {player.isLeader ? <AimOutlined /> : null}
        </GameRowWrapper>
      ))}
    </div>
  );
};

import { forwardRef } from 'react';
import styled from 'styled-components';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import nameBorderImage from '../resource/nameBorder.png';
import charaBorderImage from '../resource/charaBorder.png';

const PlayerWrapper = styled.div`
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 20px;
`;

const BoxWrapper = styled.div`
  -webkit-border-image: url(${charaBorderImage}) 30 30 round;
  -moz-border-image: url(${charaBorderImage}) 30 30 round;
  -o-border-image: url(${charaBorderImage}) 30 30 round;
  background-color: rgba(255, 255, 255, 0.35);
  width: 100%;
  height: 80%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .chara {
    width: 100%;
    height: 70%;
  }

  .ant-tag {
    margin: 5px;
    padding: 5px;
    font-size: 15pt;
  }
`;

const NameWrapper = styled.div`
  -webkit-border-image: url(${nameBorderImage}) 30 30 round;
  -moz-border-image: url(${nameBorderImage}) 30 30 round;
  -o-border-image: url(${nameBorderImage}) 30 30 round;
  background-color: rgba(255, 255, 255, 0.35);
  width: 100%;
  height: 20%;

  display: flex;
  justify-content: center;
  align-items: center;
  .name {
    font-size: 18pt;
  }
`;

export const PlayerCard = forwardRef((props, ref) => {
  let color = '';
  let icon = null;
  switch (props.state) {
    case 'choosing':
      color = 'processing';
      icon = <SyncOutlined spin />;
      break;
    case 'ready':
      color = 'green';
      icon = <CheckCircleOutlined />;
      break;
    case 'waiting':
      color = 'purple';
      icon = <LoadingOutlined />;
      break;
  }

  return (
    <PlayerWrapper>
      <NameWrapper>
        <div className='name'>{props.name}</div>
      </NameWrapper>
      <BoxWrapper>
        <div ref={ref} class='chara'></div>
        <Tag color={color} icon={icon}>
          {props.state}
        </Tag>
      </BoxWrapper>
    </PlayerWrapper>
  );
});

import { forwardRef } from "react";
import styled from "styled-components";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  RightSquareTwoTone,
  LeftSquareTwoTone,
  AimOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { nameBorderImage, charaBorderImage } from "./resource";

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

  position: relative;
  .right_arrow {
    position: absolute;
    top: 50%;
    left: 120%;
    transform: translate(-50%, -50%);
  }
  .left_arrow {
    position: absolute;
    top: 50%;
    left: -20%;
    transform: translate(-50%, -50%);
  }
`;

const NameWrapper = styled.div`
  -webkit-border-image: url(${nameBorderImage}) 30 30 round;
  -moz-border-image: url(${nameBorderImage}) 30 30 round;
  -o-border-image: url(${nameBorderImage}) 30 30 round;
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  height: 20%;

  display: flex;
  justify-content: center;
  align-items: center;
  .name {
    font-size: 15pt;
  }
`;

export const PlayerCard = forwardRef((props, ref) => {
  const { name, state, showArrow, isMe } = props;
  let color = "";
  let icon = null;
  switch (state) {
    case "choosing":
      color = "processing";
      icon = <SyncOutlined spin />;
      break;
    case "ready":
      color = "green";
      icon = <CheckCircleOutlined />;
      break;
    case "waiting":
      color = "purple";
      icon = <LoadingOutlined />;
      break;
  }

  return (
    <PlayerWrapper>
      <NameWrapper>
        {isMe ? (
          <AimOutlined style={{ color: "Yellow", fontSize: "25px" }} />
        ) : null}
        <div className="name">{name}</div>
      </NameWrapper>
      <BoxWrapper>
        <div ref={ref} className="chara"></div>
        <Tag color={color} icon={icon}>
          {state}
        </Tag>
        {showArrow == true ? (
          <>
            <LeftSquareTwoTone
              className="left_arrow"
              style={{ fontSize: "40px" }}
            />
            <RightSquareTwoTone
              className="right_arrow"
              style={{ fontSize: "40px" }}
            />
          </>
        ) : null}
      </BoxWrapper>
    </PlayerWrapper>
  );
});

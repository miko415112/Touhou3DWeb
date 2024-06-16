import { message, notification, Button } from "antd";
import {
  CloseCircleFilled,
  CheckCircleFilled,
  CopyFilled,
  SmileOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const TitleFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 20pt;
  color: Black;
  font-weight: bold;
`;

const NameFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 15pt;
  color: Black;
  display: inline;
`;

const EmailFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 12pt;
  color: Blue;
  display: inline;
`;

export const displayInvitation = (user, onAccept) => {
  notification.open({
    placement: "bottom",
    message: <TitleFont>Invitation</TitleFont>,
    description: (
      <>
        <NameFont>{`from ${user.name}  `}</NameFont>
        <EmailFont>{`(${user.email}) `}</EmailFont>
      </>
    ),
    duration: 0,
    style: { width: "fit-content", height: "fit-content" },
    key: user.name,
    btn: (
      <>
        <Button
          type="link"
          size="small"
          onClick={() => notification.destroy(user.name)}
        >
          Reject
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            onAccept();
            notification.destroy(user.name);
          }}
        >
          Accept
        </Button>
      </>
    ),
  });
};

export const displayRoomID = (roomID, onClick) => {
  notification.open({
    placement: "bottom",
    message: (
      <>
        <div style={{ display: "inline", fontSize: "20px" }}>RoomID</div>
        <Button
          onClick={onClick}
          style={{ border: "none" }}
          icon={<CopyFilled style={{ fontSize: "20px" }} />}
        />
      </>
    ),
    description: (
      <div style={{ backgroundColor: "rgba(0,0,0,0.1)", fontSize: "18px" }}>
        {roomID}
      </div>
    ),
    duration: 10,
    style: { width: "35vw", height: "fit-content" },
  });
};

export const displayStatus = (s) => {
  if (s.text) {
    const { type, text, title } = s;
    switch (type) {
      case "success":
        message.success({
          content: text,
          duration: 3,
          icon: <CheckCircleFilled style={{ fontSize: "25px" }} />,
          style: { fontSize: "20px" },
        });
        break;
      case "error":
        message.error({
          content: text,
          duration: 3,
          icon: (
            <CloseCircleFilled
              style={{ fontSize: "25px", marginLeft: "0px" }}
            />
          ),
          style: { fontSize: "20px" },
        });
        break;
      case "tips":
        notification.open({
          placement: "top",
          message: "Tips",
          description: text,
          duration: 10,
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        break;
    }
  }
};

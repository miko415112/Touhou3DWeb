import { Modal, Form, Input, Button } from "antd";
import styled from "styled-components";
import {
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const TouhouFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 1.5vw;
  color: Black;
  font-weight: bold;
`;

const FriendsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: 10px;
  height: 200px;
  overflow: auto;
`;

const RequestsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: 10px;
  height: 150px;
  overflow: auto;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: Black;
  font-size: 12pt;
  gap: 10px;
  img {
    width: 30px;
    height: 30px;
  }
`;

export const JoinRoomModal = ({ open, onJoin, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Join an Existing Room"
      okText="Join"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          form.resetFields();
          onJoin(values);
        });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <TouhouFont>RoomID</TouhouFont>
        <Form.Item
          name="roomID"
          rules={[
            {
              required: true,
              message: "Error: Please enter the RoomID",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const FriendsModal = ({
  open,
  requests,
  friends,
  onCancel,
  onAddFriend,
  onAcceptFriend,
  onDeleteFriend,
  onDeleteRequest,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal open={open} footer={null} onCancel={onCancel}>
      <TouhouFont>friends request</TouhouFont>
      <RequestsWrapper>
        {requests?.map((request, idx) => {
          return (
            <RowWrapper key={idx}>
              <img src={request.picture} />
              <div>{request.name}</div>
              <div>{request.email}</div>
              <Button
                onClick={() => {
                  onDeleteRequest(request.email);
                }}
                size="small"
                icon={<CloseOutlined />}
              />
              <Button
                size="small"
                onClick={() => {
                  onAcceptFriend(request.email);
                }}
                icon={<CheckOutlined />}
              />
            </RowWrapper>
          );
        })}
      </RequestsWrapper>
      <TouhouFont>your friends</TouhouFont>
      <FriendsWrapper>
        {friends?.map((friend, idx) => {
          return (
            <RowWrapper key={idx}>
              <img src={friend.picture} />
              <div>{friend.name}</div>
              <div>{friend.email}</div>
              <Button
                onClick={() => {
                  onDeleteFriend(friend.email);
                }}
                size="small"
                icon={<CloseOutlined />}
              />
            </RowWrapper>
          );
        })}
      </FriendsWrapper>

      <Form form={form} layout="vertical" name="form_in_modal">
        <TouhouFont>Enter user email</TouhouFont>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Error: Please enter user email",
            },
          ]}
        >
          <Input
            placeholder="input user email"
            suffix={
              <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => {
                  form.validateFields().then((values) => {
                    form.resetFields();
                    onAddFriend(values);
                  });
                }}
              />
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const InviteModal = ({
  open,
  friends,
  onlineFriends,
  onInvite,
  onCancel,
}) => {
  const offlineFriends = friends.filter(
    (friend) =>
      !onlineFriends.some((onlineFriend) => onlineFriend.email === friend.email)
  );

  return (
    <Modal open={open} footer={null} onCancel={onCancel}>
      <TouhouFont>Online Friends</TouhouFont>

      <FriendsWrapper>
        {onlineFriends?.map((friend, idx) => {
          return (
            <RowWrapper key={idx}>
              <img src={friend.picture} />
              <div>{friend.name}</div>
              <div>{friend.email}</div>
              <Button
                onClick={() => {
                  onInvite(friend.email);
                }}
                size="small"
                icon={<PlusOutlined />}
              />
            </RowWrapper>
          );
        })}
      </FriendsWrapper>

      <TouhouFont>Offline Friends</TouhouFont>
      <RequestsWrapper>
        {offlineFriends?.map((friend, idx) => {
          return (
            <RowWrapper key={idx}>
              <img src={friend.picture} />
              <div>{friend.name}</div>
              <div>{friend.email}</div>
            </RowWrapper>
          );
        })}
      </RequestsWrapper>
    </Modal>
  );
};

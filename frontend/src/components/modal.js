import { Modal, Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';
import {
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const TouhouFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 1.5vw;
  color: Black;
  font-weight: bold;
`;

const GoogleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FriendsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  gap: 10px;
  overflow: auto;
  height: 200px;
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

export const SignInModal = ({ open, callback }) => {
  return (
    <Modal
      open={open}
      title='You need to sign in first'
      footer={null}
      closable={false}
    >
      <GoogleWrapper>
        <GoogleLogin
          onSuccess={callback}
          onError={() => console.log('login failed')}
        />
      </GoogleWrapper>
    </Modal>
  );
};

export const JoinRoomModal = ({ open, onJoin, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title='Join an Existing Room'
      okText='Join'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          form.resetFields();
          onJoin(values);
        });
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal'>
        <TouhouFont>RoomID</TouhouFont>
        <Form.Item
          name='roomID'
          rules={[
            {
              required: true,
              message: 'Error: Please enter the RoomID',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const ChangeNameModal = ({ open, onSave, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      okText='Save'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          form.resetFields();
          onSave(values);
        });
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal'>
        <TouhouFont>Enter your new name</TouhouFont>
        <Form.Item
          name='name'
          rules={[
            {
              required: true,
              message: 'Error: Please enter your name',
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
  console.log(requests);
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
                size='small'
                icon={<CloseOutlined />}
              />
              <Button
                size='small'
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

              <Button
                onClick={() => {
                  onDeleteFriend(friend.email);
                }}
                size='small'
                icon={<CloseOutlined />}
              />
            </RowWrapper>
          );
        })}
      </FriendsWrapper>

      <Form form={form} layout='vertical' name='form_in_modal'>
        <TouhouFont>Enter user email</TouhouFont>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Error: Please enter user email',
            },
          ]}
        >
          <Input
            placeholder='input user email'
            suffix={
              <Button
                size='large'
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

import { Modal, Form, Input } from 'antd';
import styled from 'styled-components';
import { GoogleLogin } from '@react-oauth/google';

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
        <TouhouFont>Name</TouhouFont>
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

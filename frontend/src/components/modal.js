import { Modal, Form, Input } from 'antd';
import styled from 'styled-components';

const TouhouFont = styled.div`
  font-family: Alfa Slab One;
  font-size: 1.5vw;
  color: Black;
  font-weight: bold;
`;

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
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onJoin(values);
          })
          .catch((e) => {
            window.alert(e);
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

export const CreateRoomModal = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title='Create a new room'
      okText='Create'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((e) => {
            window.alert(e);
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
              message: 'Error: Please enter your Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

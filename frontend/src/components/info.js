import { message, notification, Button } from 'antd';
import {
  CloseCircleFilled,
  CheckCircleFilled,
  CopyFilled,
} from '@ant-design/icons';

export const displayRoomID = (roomID) => {
  notification.open({
    placement: 'bottom',
    message: (
      <>
        <div style={{ display: 'inline', fontSize: '20px' }}>RoomID</div>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(roomID).then(() => {
              const msg = {
                type: 'success',
                msg: 'RoomID copied',
              };
              displayStatus(msg);
            });
          }}
          style={{ border: 'none' }}
          icon={<CopyFilled style={{ fontSize: '20px' }} />}
        />
      </>
    ),
    description: (
      <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', fontSize: '18px' }}>
        {roomID}
      </div>
    ),
    duration: 0,
    style: { width: 'fit-content', height: 'fit-content' },
  });
};

export const displayStatus = (s) => {
  if (s.msg) {
    const { type, msg } = s;
    switch (type) {
      case 'success':
        message.success({
          content: msg,
          duration: 3,
          icon: <CheckCircleFilled style={{ fontSize: '25px' }} />,
          style: { fontSize: '20px' },
        });
        break;
      case 'error':
        message.error({
          content: msg,
          duration: 3,
          icon: <CloseCircleFilled style={{ fontSize: '25px' }} />,
          style: { fontSize: '20px' },
        });
        break;
    }
  }
};

import { displayStatus, displayInvitation } from "../components/info";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  clearInvitationMessages,
  clearNotifyMessages,
} from "../redux/slices/messageSlice";
import { joinRoom } from "../services/webSocketService";

export const NotifyComponent = () => {
  const notifyMessages = useSelector((state) => state.message.notifyMessages);
  const invitationMessages = useSelector(
    (state) => state.message.invitationMessages
  );
  const dispatch = useDispatch();

  useEffect(() => {
    notifyMessages.forEach((message) => {
      displayStatus(message);
    });
    if (notifyMessages.length > 0) dispatch(clearNotifyMessages());
  }, [notifyMessages]);

  useEffect(() => {
    invitationMessages.forEach((invitation) => {
      displayInvitation(invitation.profile, () => {
        joinRoom(invitation.roomID);
      });
    });
    if (invitationMessages.length > 0) dispatch(clearInvitationMessages());
  }, [invitationMessages]);

  return <></>;
};

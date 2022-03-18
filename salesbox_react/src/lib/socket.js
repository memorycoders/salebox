/* eslint-disable indent */
/* eslint-disable no-case-declarations */
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { addInfoFlashMessage, removeAllFlashMessages } from '../components/FlashMessages/flashMessage.action';
import { requestFetch } from '../components/Notification/notification.actions';
import AppConfig from '../../config/app.config';
import wonOpp from '../../public/wonOpp.mp3';
import normal from '../../public/normal.mp3';
import { notificationMsTeamsMessage } from '../components/Common/common.actions';

export default function SocketMiddleware() {
  let saleBoxSocket = null;
  const wonOppAudio = new Audio(wonOpp);
  const normalAudio = new Audio(normal);

  const _processMessage = (msgBody) => {
    try {
      return JSON.parse(msgBody)
    } catch (e) {
      return msgBody;
    }
  };

  return (store) => (next) => (action) => {

    switch (action.type) {
      case 'SOCKETS_CONNECT':
        const auth = store.getState().auth;
        if (saleBoxSocket !== null) {
          saleBoxSocket.disconnect();
        }
        const socket = new SockJS(AppConfig.notificationServerUrl);
        saleBoxSocket = Stomp.over(socket);
        saleBoxSocket.connect(
          {
            Authorization: auth.token,
            'x-enterprise-id': auth.enterpriseID,
          },
          (frame) => {
            saleBoxSocket.subscribe('/user/topic/web', (payload) => {
              store.dispatch(removeAllFlashMessages());
              const msg = _processMessage(payload.body);
              console.log("SocketMiddleware -> msg", msg)
              if(msg.keyCode === 'NOTIFICATION_MSTEAM_CHANNEL_MESSAGE' && auth.userId === msg.userId) {
                store.dispatch(notificationMsTeamsMessage(msg))
                return;
              }
              if (msg.keyCode === 'NOTIFICATION_WON_PROSPECT') {
                wonOppAudio.play();
              } else {
                normalAudio.play();
              }
              store.dispatch(addInfoFlashMessage(msg));
              store.dispatch(requestFetch());
            });
          }
        );
        break;
      case 'DISCONNECT_SOCKET':
        if (saleBoxSocket !== null) {
          saleBoxSocket.disconnect();
          saleBoxSocket = null;
        }
        break;
      default:
        return next(action);
    }
  };
}

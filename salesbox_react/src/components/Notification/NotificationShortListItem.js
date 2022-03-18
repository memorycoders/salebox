//@flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Icon, Popup, Image } from 'semantic-ui-react';
import * as NotificationActions from './notification.actions';
import { getSystemNotifications } from './notification.selector';
import { Clickable } from 'components';
import _l from 'lib/i18n';
import css from './Notifications.css';
import lead from '../../../public/Unqualified_deals_active.svg';
import taskAdd from '../../../public/Tasks_active.svg';
import contact from '../../../public/Contacts_Active.svg';
import pipeline from '../../../public/Qualified_deals_active.svg';
import notification_icon from '../../../public/notification.svg';
import appointmentAdd from '../../../public/Appointments.svg';
import email from '../../../public/email_noti.svg';
import moment from 'moment';
import account from '../../../public/Accounts_Active.svg';
import call from '../../../public/Calllists_Active.svg';
import insight from '../../../public/Insights_Active.svg';

type PropsType = {
  notification: {},
  markRead: () => void,
  markUnRead: () => void,
  gotoNotificationItem: () => void,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
  },
});

const createMarkup = (content) => ({
  __html: content,
});

const icons = {
  DISTRIBUTE_TASK: taskAdd,
  OPPORTUNITY: pipeline,
  LEAD: lead,
  APPOINTMENT: appointmentAdd,
  CONTACT: contact,
  EMAIL_TRACKING: email,
  ACCOUNT: account,
  DISTRIBUTE_LEAD: lead,
  TASK_INVITED: taskAdd,
  INVITE_LEAD: lead,
  // ADD_USER_REACH_NUMBER_LICENSE:
  NEW_CALL_RECORD: call,
  NEW_DIAL_RECORD: call,
  CALL_BACK_LATER: call,
  LIST_LEAD: lead,
  DISTRIBUTE_LEAD_TAB: lead,
  INSIGHT_ACTIVITY_TAB: insight,
  CONTACT_ALPHABETICAL_TAB: contact,
  WON_OPP: pipeline,
  TASK: taskAdd,
};
const color = {
  DISTRIBUTE_TASK: 'activities',
  OPPORTUNITY: 'pipeline',
  LEAD: 'lead',
  APPOINTMENT: 'appointment',
  CONTACT: 'contacts',
  EMAIL_TRACKING: 'contacts',
  ACCOUNT: 'account',
  DISTRIBUTE_LEAD: 'lead',
  TASK_INVITED: 'activities',
  INVITE_LEAD: 'lead',
  // ADD_USER_REACH_NUMBER_LICENSE:
  NEW_CALL_RECORD: 'call',
  NEW_DIAL_RECORD: 'call',
  CALL_BACK_LATER: 'call',
  LIST_LEAD: 'lead',
  DISTRIBUTE_LEAD_TAB: 'lead',
  INSIGHT_ACTIVITY_TAB: 'insight',
  CONTACT_ALPHABETICAL_TAB: 'contact',
  WON_OPP: 'pipeline',
  TASK: 'activities',
};
const objectRoutes = {
  DISTRIBUTE_TASK: '/activities/task',
  CONTACT: '/contacts',
  OPPORTUNITY: '/pipeline/overview',
  LEAD: '/pipeline/leads',
  APPOINTMENT: '/activities/appointments',
  TASK_INVITED: '/activities/tasks',
  ACCOUNT: '/accounts',
  INSIGHT_ACTIVITY_TAB: '/insights/activities'
};

const NotificationsShortList = ({ notification, markRead, gotoNotificaitonItem, markUnRead }: PropsType) => {
  return (
    <Clickable className={css.listItem} onNavigate={gotoNotificaitonItem}>
      <div className={`${css.listIcon} ${css[color[notification.objectType]]}`}>
        <img className={css.icon} src={icons[notification.objectType] || notification_icon} />
      </div>
      <div className={css.content}>
        <p dangerouslySetInnerHTML={createMarkup(notification.content)} />
        {/* <div className={css.date}>{_l`${new Date(notification.notificationDate)}:t(G)`}</div> */}
        <div className={css.date}>{`${moment(notification.notificationDate).format('DD MMM YYYY,  HH:mm')}`}</div>
      </div>
      <div className={css.action}>
        <Popup
          trigger={
            <Button
              basic
              size="mini"
              icon={
                notification.read ? (
                  'envelope open outline'
                ) : (
                  <Image style={{ width: 13, height: 11 }} src={email}></Image>
                )
              }
              onMouseDown={notification.read ? markUnRead : markRead}
            />
          }
          hoverable
          flowing
          style={{ fontSize: 11, maxWidth: 110, minWidth: 110, maxHeight: 20 }}
          size="mini"
          position="bottom center"
        >
          <Popup.Content>
            <p className={css.tooltip}>{notification.read ? 'Mark as unread' : 'Mark as read'}</p>
          </Popup.Content>
        </Popup>
      </div>
    </Clickable>
  );
};

export default compose(
  connect(
    (state) => ({
      notifications: getSystemNotifications(state),
    }),
    {
      markRead: NotificationActions.markRead,
      markUnRead: NotificationActions.markUnRead,
    }
  ),
  withRouter,
  withHandlers({
    markRead: ({ notification, markRead }) => (event: Event) => {
      event.stopPropagation();
      markRead(notification.uuid);
    },
    markUnRead: ({ notification, markUnRead }) => (event: Event) => {
      event.stopPropagation();
      markUnRead(notification.uuid);
    },
    gotoNotificaitonItem: ({ notification, history }) => () => {
      const { objectType, objectId } = notification;
      console.log('notification', notification);
      console.log('objectRoutes', objectRoutes);
      if (objectType) {
        history.push(`${objectRoutes[objectType]}/${objectId}`);
      }
    },
  })
)(NotificationsShortList);

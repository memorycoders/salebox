//@flow
import * as React from 'react';
import { compose, branch, renderNothing, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Label, Menu, Popup, Icon } from 'semantic-ui-react';
import NotificationShortListItem from './NotificationShortListItem';
import * as NotificationActions from './notification.actions';
import { getSystemNotifications, getUnreadNotificationCount } from './notification.selector';
import css from './Notifications.css';
import { IconButton } from '../Common/IconButton';
import notification_icon from '../../../public/notification.svg';

type PropsType = {
  notifications: Array<{}>,
  count: string,
  markRead: () => void,
  markReadAll: () => void,
};

const labelStyle = {
  left: 48,
  top: 6,
};

const popupStyle = {
  padding: 0,
};

const NotificationsShortList = ({ notifications, count, markReadAll }: PropsType) => {
  const notificationsMenuItem = (
    <IconButton src={notification_icon} btnClass={css.notificationButton} size={36} onClick={markReadAll}>
      {count > 0 && (
        <Label style={{ fontSize: '8px !important' }} size="tiny" floating className={css.badge}>
          {count > 100 ? '100+' : count}
        </Label>
      )}
    </IconButton>
    // <Menu.Item name="notification">
    //   {/* disabled={length < 1} */}

    //   <Icon name="bell" size="large" />
    // </Menu.Item>
  );

  return (
    <Popup
      trigger={notificationsMenuItem}
      style={popupStyle}
      flowing
      hoverable
      position="bottom right"
      disabled
      // on='click'
      // on='hover'
    >
      <div className={css.list}>
        {notifications.map((notification) => {
          return <NotificationShortListItem notification={notification} key={notification.uuid} />;
        })}
      </div>
    </Popup>
  );
};

export default compose(
  connect(
    (state) => ({
      notifications: getSystemNotifications(state),
      count: getUnreadNotificationCount(state),
    }),
    {
      markRead: NotificationActions.markRead,
      markAllRead: NotificationActions.markAllRead,
    }
  ),
  withHandlers({
    markReadAll: ({ markAllRead }) => (event: Event) => {
      event.stopPropagation();
      markAllRead();
    },
  }),
  branch(({ notifications }) => notifications.length < 0, renderNothing)
)(NotificationsShortList);

// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Transition, Modal, Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { makeGetNotification } from './notification.selector';
import _l from 'lib/i18n';
import css from '../ModalCommon/ModalCommon.css';
import localCss from './NotificationItem.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import { KEY_ERROR } from '../../Constants';

type PropsT = {
  notification: {
    message: string,
    type: string,
    title: string,
  },
  requestRemove: () => void,
};

addTranslations({
  'en-US': {
    'Incorrect password': 'Incorrect password',
    'Username does not exist': 'Username does not exist',
    'Signed out successfully': 'Signed out successfully',
    'Signed in successfully': 'Signed in successfully',
    'An advanced search with this name already exists': 'An advanced search with this name already exists',
    'Advanced search saved successfully': 'Advanced search saved successfully',
    'Advanced search shared successfully': 'Advanced search shared successfully',
    'Advanced search removed successfully': 'Advanced search removed successfully',
    'Advanced search not found': 'Advanced search not found',
    'The username already exists': 'The username already exists',
    'Password is incorrect': 'Password is incorrect',
    'Cannot find an user associated with this email': 'Cannot find an user associated with this email',
    'An email has been sent to your email address. Please follow instruction to update the password.':
      'An email has been sent to your email address. Please follow instruction to update the password.',
    OK: 'OK',
    'Cannot delete opportunity because of existing active reminder or active meeting':
      'Cannot delete opportunity because of existing active reminder or active meeting',
    'You can only create 250 in one batch': 'You can only create 250 in one batch',
    'You can only create 200 in one batch': 'You can only create 200 in one batch',
    'You can only create 100 in one batch': 'You can only create 100 in one batch',
    'Account has been deleted': 'Account has been deleted',
    'Contact has been deleted': 'Contact has been deleted',
  },
});

const NotificationItem = ({ notification, requestRemove }: PropsT) => {
  const getNotificationTranslations = () => KEY_ERROR;

  const translate = (message) => getNotificationTranslations()[message] || message;
  if (!notification) return null;

  // if (
  //   notification.type === 'error' &&
  //   (getNotificationTranslations()[notification.message] == null ||
  //     getNotificationTranslations()[notification.message] == undefined)
  // ) {
  //   return null;
  // }
  if (
    notification &&
    notification.message == 'Unexpected input given to normalize. Expected type to be "object", found "undefined".'
  )
    return null;

  if (notification && notification.message == "Cannot read property 'message' of undefined") return null;
    if(notification?.message === '' || notification?.message === undefined || notification?.message === null) return null;
  if (notification.duration) {
    return (
      <div className={cx(localCss.item, localCss[notification.type])} onClick={requestRemove}>
        {/* {notification.title && <div className={localCss.title}>
        {translate(notification.title)}
          </div>} */}
        <div className={localCss.description}>
          {/* <Icon name='check' size='small' /> */}
          {_l.call(this, [translate(notification.message)])}
        </div>
      </div>
    );
  }
  return (
    <Modal className={cx(css.modalContainer, localCss.notificationModal)} open>
      <Modal.Header className={css.commonModalHeader}>
        {notification.title ? (
          <div className={css.title}>{_l.call(this, [translate(notification.title)])}</div>
        ) : (
          <div className={css.title}>{notification.type === 'error' ? _l`Error` : _l`Success`}</div>
        )}
      </Modal.Header>

      <Modal.Content className={localCss.body}>
        <Modal.Description className={css.paddingAsHeader} style={{ fontSize: 11 }}>
          {notification.noTrans ? notification.message : _l.call(this, [translate(notification.message)])}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className={css.commonActionModal}>
        <Button onClick={requestRemove} className={cx(css.commonDoneButton, css.commonButton)}>
          {_l`OK`}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification();
  const mapStateToProps = (state, { id }) => ({
    notification: getNotification(state, id),
  });
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    requestRemove: NotificationActions.requestRemove,
  }),
  withHandlers({
    requestRemove: ({ requestRemove, id }) => () => {
      requestRemove(id);
    },
  })
)(NotificationItem);

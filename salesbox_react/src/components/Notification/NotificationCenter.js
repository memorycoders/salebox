// @flow
import React, { useState } from 'react';
import { compose } from 'recompose';
// import { Portal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { CSSTransition } from 'react-transition-group';
import { getAppNotifications } from './notification.selector';
import { Portal } from 'react-portal';
import NotificationItem from './NotificationItem';
import css from './NotificationCenter.css';
import fade from './Fade.css';
type PropsT = {
  notifications: Array<{
    message: string,
    id: string,
  }>,
};

const NotificationCenter = ({ notifications }: PropsT) => {
 
  return (
    <Portal>
      <TransitionGroup className={css.top}>
        {notifications.length > 0 && <CSSTransition timeout={260} classNames={fade} >
          <NotificationItem key={notifications[notifications.length - 1]} id={notifications[notifications.length - 1]} />
            </CSSTransition> }
      </TransitionGroup>
    </Portal>
  );
};

export default compose(
  connect((state) => ({
    notifications: getAppNotifications(state),
  }))
)(NotificationCenter);

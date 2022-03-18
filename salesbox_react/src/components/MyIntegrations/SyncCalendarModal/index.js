/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';

const SyncCalendarModal = (props) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={false}
      size={'mini'}
      onClose={props.onClose}
      onDone={props.onDone}
      paddingAsHeader
    >
      <p>{props.title}</p>
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(SyncCalendarModal);

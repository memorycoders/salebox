/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

const DeleteModal = (props) => {
  const onSave = async () => {
    try {
      const res = await api.get({
        resource: `administration-v3.0/workData/activity/delete/${props.data.uuid}`,
      });
      if (res) {
        props.onClose();
        props.onAddSuccess(props.data);
        props.putSuccess(_l`Deleted`, '', 2000);
      }
    } catch (error) {
      props.putError(error.message);
    }
  };

  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={false}
      size={'tiny'}
      onClose={props.onClose}
      onDone={onSave}
      paddingAsHeader
    >
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(DeleteModal);

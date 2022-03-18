/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';
import { deleteSalesMethod } from '../../../../SalesMethod/sales-method.actions';

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

const DeleteSaleModal = (props) => {
  const onSave = async () => {
    try {
      const res = await api.get({
        resource: `administration-v3.0/salesMethod/delete/${props.data.uuid}`,
      });
      if (res) {
        props.onClose();
        props.onAddSucces(props.data);
        props.putSuccess(`Deleted`, '', 2000);
        props.deleteSalesMethod(props.data.uuid);
      }
    } catch (error) {
      if (error.message === 'REQUIRE_AT_LEAST_ONE_SALES_METHOD_IN_USING') {
        props.putError('Required at least one sales method in using.');
      } else if (error.message === 'ERROR_REMOVE_SALES_METHOD_USING_BY_PROSPECT') {
        props.putError('Sales method is in using');
      } else {
        props.putError(error.message);
      }
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
  deleteSalesMethod,
})(DeleteSaleModal);

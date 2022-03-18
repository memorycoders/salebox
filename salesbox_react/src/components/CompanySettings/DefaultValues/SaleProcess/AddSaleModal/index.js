/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';
import AddSaleForm from '../SaleForm/index';

addTranslations({
  'en-US': {
    'Add Sales Process': 'Add Sales Process',
    'Hours/contract is required': 'Hours/contract is required',
    'Hours/quote is required': 'Hours/quote is required',
    'Name is required': 'Name is required',
  },
});

const AddSaleModal = (props) => {
  const [obj, setObj] = useState({
    hoursPerContract: 0,
    hoursPerQuote: 0,
  });
  const [errors, setErrors] = useState({});
  const onSave = async () => {
    const errors = {};
    if (!obj.name) errors.name = _l`Name is required`;
    if (!obj.hoursPerContract) errors.hoursPerContract = _l`Hours/contract is required`;
    if (!obj.hoursPerQuote) errors.hoursPerQuote = _l`Hours/quote is required`;
    setErrors(errors);
    console.log('obj', obj);
    if (obj.name) {
      try {
        const res = await api.post({
          resource: 'administration-v3.0/salesMethod/add',
          data: {
            ...obj,
          },
        });
        if (res) {
          props.onClose();
          props.onAddSucces(res);
          props.putSuccess(_l`Added`, '', 2000);
        }
      } catch (error) {
        if (error.message === 'SALES_METHOD_NAME_UNIQUE') {
          props.putError('Sale method name is unique');
        } else {
          props.putError(error.message);
        }
      }
    }
  };

  const onChange = (key, value) => {
    const newObj = { ...obj, [key]: value };
    const newErrors = { ...errors, [key]: null };
    setObj(newObj);
    setErrors(newErrors);
  };

  return (
    <ModalCommon
      title={_l`Add Pipeline`}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={false}
      size={'tiny'}
      onClose={props.onClose}
      onDone={onSave}
    >
      <AddSaleForm errors={errors} onChange={onChange} data={obj} />
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(AddSaleModal);

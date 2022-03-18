/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';
import AddSaleForm from '../SaleForm/index';

addTranslations({
  'en-US': {
    'Edit Sales Process': 'Add Sales Process',
    'Hours/contract is required': 'Hours/contract is required',
    'Hours/quote is required': 'Hours/quote is required',
    'Name is required': 'Name is required',
  },
});

const EditSaleModal = (props) => {
  const [obj, setObj] = useState({});
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (props.data) {
      setTimeout(() => {
        setObj(props.data);
      }, 100);
    }
  }, [props.data]);
  const onSave = async () => {
    const errors = {};
    if (!obj.name) errors.name = _l`Name is required`;
    // if (!obj.hoursPerContract) errors.hoursPerContract = _l`Hours/contract is required`;
    // if (!obj.hoursPerQuote) errors.hoursPerQuote = _l`Hours/quote is required`;
    setErrors(errors);

    if (obj.name) {
      try {
        const res = await api.post({
          resource: 'administration-v3.0/salesMethod/update',
          data: {
            ...obj,
          },
        });
        if (res) {
          props.onClose();
          props.onAddSucces(res);
          props.putSuccess(`Added`, '', 2000);
          errors.name = '';
        }
      } catch (error) {
        props.putError(error.message);
      }
    }
  };

  const onChange = (key, value) => {
    const newObj = { ...obj, [key]: value };
    const newErrors = { ...errors, [key]: null };
    setObj(newObj);
    setErrors(newErrors);
  };
  console.log('obj', obj);
  console.log('props.visible', props.visible);
  return (
    <ModalCommon
      title={_l`Edit sales process`}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={false}
      size={'tiny'}
      onClose={() => {
        props.onClose();
        errors.name = '';
      }}
      onDone={onSave}
    >
      <AddSaleForm errors={errors} onChange={onChange} data={obj} />
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(EditSaleModal);

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';
import AddForm from '../../AccountAndContactType/AddForm/index';
import {objectType as TYPE} from '../index'

const AddModal = (props) => {
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
    setErrors(errors);
    console.log('obj', obj);
    if (obj.name) {
      try {
        const res = await api.post({
          resource: 'administration-v3.0/multiRelation/addOrEdit',
          data: {
            ...obj,
            name: obj.name.trim(),
            objectType: props.type,
          },
        });
        if (res) {
          props.onClose();
          props.onAddSuccess(res);
          props.putSuccess(_l`Added`, '', 2000);
        }
      } catch (error) {
        if (error.message === 'DUPLICATED_MULTI_RELATION') {
          props.putError('Name is unique');
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

  let title=_l`Add multi relation - Company`;
  switch (props.type) {
    case TYPE.ACCOUNT:
      title = _l`Add multi relation - Company`;
      break;
    case TYPE.CONTACT:
      title = _l`Add multi relation - Contact`;
      break;
  }
  return (
    <ModalCommon
      title={title}
      visible={props.visible}
      okLabel={_l`Save`}
      scrolling={false}
      size={'tiny'}
      onClose={props.onClose}
      onDone={onSave}
    >
      <AddForm errors={errors} onChange={onChange} data={obj} />
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(AddModal);

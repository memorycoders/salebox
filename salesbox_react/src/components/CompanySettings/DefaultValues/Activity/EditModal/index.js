/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import ModalCommon from '../../../../ModalCommon/ModalCommon';
import AddForm from '../../AccountAndContactType/AddForm/index';
import {TYPE} from '../index'

const EditModal = (props) => {
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
          resource: 'administration-v3.0/workData/activity/update',
          data: {
            ...obj,
            name: obj.name.trim(),
            // type: props.type,
          },
        });
        if (res) {
          props.onClose();
          props.onSuccess( {
            ...obj,
            name: obj.name.trim(),
          });
          props.putSuccess(_l`Updated`, '', 2000);
        }
      } catch (error) {
        if (error.message === 'WORK_DATA_ACTIVITY_NAME_UNIQUE') {
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
  let title=_l`Edit calendar - Category`;
  switch (props.type) {
    case TYPE.FOCUS:
      title = _l`Edit calendar - Focus`;
      break;
    case TYPE.CATEGORY:
      title = _l`Edit calendar - Category`;
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
      <AddForm errors={errors} onChange={onChange} data={obj}  isFocus={props.type==TYPE.FOCUS}/>
    </ModalCommon>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(EditModal);

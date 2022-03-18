//@flow
import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import moment, { isMoment } from 'moment';
import DatePickerInput from '../../../DatePicker/DatePickerInput';
import type { CustomFieldType } from '../../custom-field.types';
import { getValueForText } from '../../custom-field.helpers';
import { updateValue, connectSagaUpdate, updateValueMutilObject } from '../../custom-field.actions';
import _l from 'lib/i18n';
import css from '../../CustomField.css';

type PropsType = {
  customField: CustomFieldType,
  // updateText: EventHandlerType,
};

addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});

const CustomFieldDate = ({
  customField,
  onDateChange,
  error,
  handelEventBlur
}: PropsType) => {
  let value = getValueForText(customField);
  value = value == 'Invalid date' ? null : value;
  return (
    <div style={{ width: '100%', height: '28px', position: 'relative', minWidth: 150 }}>
      <DatePickerInput
        handlePropsEvent={handelEventBlur}
        value={value ? (isMoment(moment(value, 'DD MMM YYYY')) ? value : null) : null}
        onChange={onDateChange}
        fluid
      />
      {error && <div className={css.error}>{error}</div>}
    </div>
  );
};

const mapDispatchToProps = {
  updateValue,
  onDateChangeCustomField: connectSagaUpdate,
  updateValueMutilObject,
};

export default compose(
  connect(null, mapDispatchToProps),
  withState('error', 'setError', ''),
  withHandlers({
    handelEventBlur: ({isCustomFieldModel, customField, setError, updateValue, onDateChangeCustomField, object, isUpdateAll}) => (valueDateCheck) => {

      if(!isCustomFieldModel) {

        // (valueDateCheck) => {
          if (customField.required && (!valueDateCheck || valueDateCheck == 'Invalid Date')) {
            return setError(`${customField.title} ${_l`is required`}`);
          } else {
            setError(``);
          }
          updateValue(
            customField.uuid,
            {
              value: valueDateCheck ? moment(valueDateCheck).format('DD MMM YYYY') : null,
              dateValue: valueDateCheck ? moment(valueDateCheck).valueOf() : null,
            },
            object.uuid
          );
          let disableToast = false;
          onDateChangeCustomField(customField.uuid, object.uuid, isUpdateAll, disableToast);
        // }
      }
    },
    onDateChange: ({ onDateChangeCustomField, object, setError, updateValue, customField, isCustomFieldModel, updateValueMutilObject, isUpdateAll }) => (
      value
    ) => {
      console.log('===onDateChange',value)
      if (value) {
        setError('');
      }
      if (isCustomFieldModel) {
        return updateValueMutilObject(customField.uuid, {
          value: moment(value).format('DD MMM YYYY'),
          dateValue: moment(value).valueOf(),
        });
      }
      updateValue(
        customField.uuid,
        {
          value: value ? moment(value).format('DD MMM YYYY') : null,
          dateValue: value ? moment(value).valueOf() : null,
        },
        object.uuid
      );
      let disableToast = true;
      onDateChangeCustomField(customField.uuid, object.uuid, isUpdateAll, disableToast);
    },
  })
)(CustomFieldDate);

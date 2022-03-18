//@flow
import * as React from 'react';
import { Input, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { updateValue, connectSagaUpdate, updateValueMutilObject } from '../../custom-field.actions';
import type { EventHandlerType } from 'types/semantic-ui.types';
import type { CustomFieldType } from '../../custom-field.types';
import _l from 'lib/i18n';
import { getValueForText } from '../../custom-field.helpers';
import css from './CusomFieldText.css';

type PropsType = {
  customField: CustomFieldType,
  handleUpdate: EventHandlerType,
};

const INPUT_STYLES = {
  flex: 1,
  height: 28,
  maxHeight: 28,
  fontSize: 11,
  width: 170,
};

addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});

const CustomFieldText = ({
  isUpdateAll,
  setError,
  customField,
  handleUpdate,
  onChangeCustomField,
  object,
  type,
  error,
  isCustomFieldModel,
  type0,
}: PropsType) => {
  const value = getValueForText(customField);
  const { customFieldOptionDTO } = customField;
  let maxLength = null;
  if (customFieldOptionDTO) {
    maxLength = customFieldOptionDTO.maxLength;
  }
  return (
    <div className={css.textContainer}>
      <Input
        style={{ width: '100%' }}
        maxLength={maxLength}
        onBlur={
          isCustomFieldModel
            ? () => { }
            : () => {
              if (customField.required && !value) {
                setError(`${customField.title} ${_l`is required`}`);
              } else {
                setError('');
              }

              !error && onChangeCustomField(customField.uuid, object.uuid, isUpdateAll);
            }
        }
        type={'text'}
        style={INPUT_STYLES}
        fluid
        value={value || ''}
        className={ type0 == 'task' ? css.inputCustomTask : css.inputCustomizeText}
        onChange={handleUpdate}
      />
      <div className={css.error}>{error}</div>
    </div>
  );
};

const mapDispatchToProps = {
  updateValue: updateValue,
  onChangeCustomField: connectSagaUpdate,
  updateValueMutilObject,
};

export default compose(
  connect(null, mapDispatchToProps),
  withState('error', 'setError', ''),
  withHandlers({
    handleUpdate: ({
      updateValue,
      customField,
      setError,
      type,
      isCustomFieldModel,
      updateValueMutilObject,
      object,
    }) => (event, { value }): EventHandlerType => {
      let maxLength = null;
      const { customFieldOptionDTO, title, required } = customField;
      if (customFieldOptionDTO) {
        maxLength = customFieldOptionDTO.maxLength;
      }

      if (type === 'NUMBER') {
        // if (isNaN(value)) {
        //   return;
        // }
        const { numberOfIntegers, numberOfDecimals } = customFieldOptionDTO;
        const pattern = new RegExp(
          '(^-?\\d{1,' + numberOfIntegers + '}\\,\\d{' + numberOfDecimals + '}$)|(^\\d{1,' + numberOfIntegers + '}$)'
        );
        const shortenValue = (value) => {
          if (value && value.length > 37) {
            return value.slice(0, 37);
          }
          return value;
        };
        if (customField.required && !value) {
          setError(`${customField.title} ${_l`is required`}`);
        } else if ((numberOfIntegers || numberOfIntegers) && value && !pattern.test(value)) {
          let error_message = `${title} wrong format ${numberOfIntegers} integers and ${numberOfDecimals} decimal`;
          setError(
            <Popup
              trigger={<div>{`${shortenValue(error_message)}...`}</div>}
              style={{ fontSize: 11 }}
              content={error_message}
            />
          );
        } else if (maxLength && value.length > maxLength) {
          setError(`${title} > ${maxLength}`);
        } else {
          setError('');
        }
      } else {
        if (maxLength && value.length > maxLength) {
          setError(`${title} > ${maxLength}`);
        } else if (customField.required && !value) {
          setError(`${customField.title} ${_l`is required`}`);
        } else {
          setError('');
        }
      }

      if (isCustomFieldModel) {
        return updateValueMutilObject(customField.uuid, { value });
      }
      updateValue(customField.uuid, { value }, object.uuid);
    },
  })
)(CustomFieldText);

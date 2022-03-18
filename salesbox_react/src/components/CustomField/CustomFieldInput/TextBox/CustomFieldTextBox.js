//@flow
import * as React from 'react';
import { TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { updateValue, connectSagaUpdate, updateValueMutilObject } from '../../custom-field.actions';
import type { EventHandlerType } from 'types/semantic-ui.types';
import _l from 'lib/i18n';
import type { CustomFieldType } from '../../custom-field.types';
import { getValueForText } from '../../custom-field.helpers';
import css from '../../CustomField.css'

type PropsType = {
  customField: CustomFieldType,
  handleUpdate: EventHandlerType,
};


addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});

const CustomFieldTextBox = ({ isUpdateAll, error, customField, handleUpdate, object, onChangeCustomField, isCustomFieldModel }: PropsType) => {
  let maxLength = null;
  if (customField?.customFieldOptionDTO) {
    maxLength = customField?.customFieldOptionDTO?.maxLength;
  }
  const value = getValueForText(customField);
  return <div style={{ width: '100%', position: 'relative' }}>
    <TextArea
    maxLength={maxLength}
    onBlur={isCustomFieldModel ? () => { } : () => {
        if (error){
          return;
        }
        onChangeCustomField(customField.uuid, object.uuid, isUpdateAll)}}
    style={{ fontSize: 11 }} value={value || ''} onChange={handleUpdate} />

    {error && <div className={css.error}>{error}</div>}
  </div>

};

const mapDispatchToProps = {
  updateValue: updateValue,
  onChangeCustomField: connectSagaUpdate,
  updateValueMutilObject
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withState('error', 'setError', ''),
  withHandlers({
    handleUpdate: ({ setError, object, updateValue, customField, isCustomFieldModel, updateValueMutilObject }) => (event, { value }): EventHandlerType => {
      if (isCustomFieldModel) {
        return updateValueMutilObject(customField.uuid, { value })
      }
      if (customField.required && !value) {
        setError(`${customField.title} ${_l`is required`}`)
      } else {
        setError('')
      }
      updateValue(customField.uuid, { value }, object.uuid);
    },
  })
)(CustomFieldTextBox);

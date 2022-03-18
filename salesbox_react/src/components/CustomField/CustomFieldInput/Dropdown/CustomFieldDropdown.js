//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import * as CustomFieldActions from 'components/CustomField/custom-field.actions';
import type { CustomFieldType } from '../../custom-field.types';
import css from './dropdown-custom-field.css';
import commonCss from '../../CustomField.css';
import { calculatingPositionMenuDropdown } from '../../../../Constants';

addTranslations({
  'en-US': {
    'is required': 'is required',
  },
});

type PropsType = {
  customField: CustomFieldType,
};

const getOptionsAndValue = (customField) => {
  const { customFieldOptionDTO, customFieldValueDTOList } = customField;
  const { customFieldOptionValueDTOList, multiChoice } = customFieldOptionDTO;
  const options = customFieldOptionValueDTOList.map((option) => ({
    value: option.uuid,
    text: option.value,
  }));
  const value = customFieldValueDTOList
    .filter((value) => value.isChecked)
    .map((value) => value.customFieldOptionValueUuid);
  if (multiChoice) {
    return { options, value: value, multiple: true };
  }
  return { options: [{ value: null, text: _l`None`}, ...options], value: value[0], multiple: false };
};

const CustomFieldDropdown = ({
  isUpdateAll,
  error,
  handleUpdate,
  customField,
  onChangeCustomField,
  object,
  isCustomFieldModel,
  className,
  uuid,
  formID 

}: PropsType) => {
  const { options, value, multiple } = getOptionsAndValue(customField);
  let id = formID ? `${formID}-custom-field-dropdown-${uuid}` : `custom-field-dropdown-${uuid}`
  return (
    <div style={{ width: '100%', display: "flex", flexDirection: "column"}}>
      <Dropdown
        onBlur={
          isCustomFieldModel
            ? () => {}
            : () => {
                onChangeCustomField(customField.uuid, object.uuid, isUpdateAll);
              }
        }
        id={id}
        onClick={() => { calculatingPositionMenuDropdown && formID && calculatingPositionMenuDropdown(id)}}
        className={`${css.customFieldDropdown} ${formID ? className: ''} ${multiple ? 'custom-field-dropdown-multiple' : '' }`}
        style={{ height: 28, fontSize: 11 }}
        fluid
        search
        closeOnChange
        selection
        multiple={multiple}
        options={options}
        value={value}
        onChange={handleUpdate}
      />
      {error && <div className={commonCss.error}>{error}</div>}
    </div>
  );
};

const mapDispatchToProps = {
  updateDropdown: CustomFieldActions.updateDropdown,
  onChangeCustomField: CustomFieldActions.connectSagaUpdate,
  updateDropdownMutilObject: CustomFieldActions.updateDropdownMutilObject,
};

export default compose(
  connect(null, mapDispatchToProps),
  withState('error', 'setError', ''),
  withHandlers({
    handleUpdate: ({
      isUpdateAll,
      setError,
      updateDropdown,
      customField,
      isCustomFieldModel,
      updateDropdownMutilObject,
      object,
      onChangeCustomField,
    }) => (event, { value }): EventHandlerType => {
      if (isCustomFieldModel) {
        return updateDropdownMutilObject(customField.uuid, value);
      }
      const { required, title } = customField;
      if (required) {
        if (value.length === 0) {
          setError(`${title} ${_l`is required`}`);
        } else {
          setError(``);
        }
      }
      const { multiple } = getOptionsAndValue(customField);
      updateDropdown(customField.uuid, value, object.uuid, isUpdateAll);
      if (!multiple) {
        setTimeout(() => {
          onChangeCustomField(customField.uuid, object.uuid, isUpdateAll);
        }, 1000);
      }
    },
  })
)(CustomFieldDropdown);

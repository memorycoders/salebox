//@flow
import * as React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import * as CustomFieldActions from 'components/CustomField/custom-field.actions';
import CustomFieldCheckbox from './CustomFieldCheckbox';
import type { CustomFieldType } from '../../custom-field.types';
import css from './Checkboxes.css';

type PropsType = {
  customField: CustomFieldType,
};

const CustomFieldCheckboxes = ({ handleUpdate, customField, isCustomFieldModel }: PropsType) => {

  const {
    customFieldOptionDTO: { multiChoice, customFieldOptionValueDTOList },
    customFieldValueDTOList: options,
  } = customField;

  return (
    <div className={css.wrapper}>
      {(isCustomFieldModel ? (options && options.length > 0 ? options : customFieldOptionValueDTOList) : options).map((option, index) => {
        const { isChecked } = option;
      
        return (
          <Form.Field key={index}>
            <CustomFieldCheckbox
              checked={isChecked}
              optionId={isCustomFieldModel ? (options && options.length > 0 ? option.customFieldOptionValueUuid : option.uuid) : option.customFieldOptionValueUuid}
              radio={!multiChoice}
              name={customField.uuid}
              value={option.value}
              onChange={handleUpdate}
            />
          </Form.Field>
        );
      })}
    </div>
  );
};

const mapDispatchToProps = {
  updateCheckbox: CustomFieldActions.updateCheckbox,
  updateCheckboxMutilObject: CustomFieldActions.updateCheckboxMutilObject
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withHandlers({
    handleUpdate: ({ isUpdateAll, updateCheckbox, customField, object, updateCheckboxMutilObject }) => (optionId, checked) => {
      if(!object){
        return updateCheckboxMutilObject(customField.uuid, optionId, checked);
      }
      updateCheckbox(customField.uuid, optionId, checked, object.uuid, isUpdateAll);
    },
  })
)(CustomFieldCheckboxes);

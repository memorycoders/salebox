// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { makeGetCustomFieldForUpdate } from 'components/CustomField/custom-field.selectors';
import { FormPair } from 'components';
import type { CustomFieldType } from '../custom-field.types';
import CustomFieldDropdown from './Dropdown/CustomFieldDropdown';
import CustomFieldUrl from './Url/CustomFieldUrl';
import CustomFieldText from './Text/CustomFieldText';
import CustomFieldTextBox from './TextBox/CustomFieldTextBox';
import CustomFieldDate from './Date/CustomFieldDate';
import CustomFieldCheckboxes from './Checkboxes/CustomFieldCheckboxes';
import CustomFieldTagDetail from './Tag/CustomFieldTagDetail';
import cssForm from '../../Task/TaskForm/TaskForm.css';

type PropsT = {
  customField: CustomFieldType,
  object: {
    name?: string,
  },
};

const types = {
  DROPDOWN: CustomFieldDropdown,
  URL: CustomFieldUrl,
  TEXT: CustomFieldText,
  TEXT_BOX: CustomFieldTextBox,
  DATE: CustomFieldDate,
  CHECK_BOXES: CustomFieldCheckboxes,
  PRODUCT_TAG: CustomFieldTagDetail,
  NUMBER: CustomFieldText,
};

const CustomFieldInput = ({ type0, noHeader, customField, object, customFieldObject, objectType, formID }: PropsT) => {
  if (!object) {
    const CustomInput = types[customFieldObject.fieldType] || CustomFieldText;
    //customFieldObject

    return (
      <Form.Group required={customField.required} className={cssForm.formField}>
        <div className={cssForm.label} width={6}>
          {customFieldObject.title}
          {customFieldObject.required && <span style={{ color: 'red' }}>*</span>}
        </div> 
        <CustomInput formID={formID} className='position-clear' uuid={customFieldObject.uuid} type0={type0} isCustomFieldModel type={customFieldObject.fieldType} customField={customFieldObject} />
      </Form.Group>
    );
  }

  if (noHeader && object) {
    const CustomInput = types[customFieldObject.fieldType] || CustomFieldText;
    //customFieldObject

    return (
      <Form.Group required={customField.required} className={cssForm.formField}>
        <div className={cssForm.label} width={6}>
          {customFieldObject.title}
          {customFieldObject.required && <span style={{ color: 'red' }}>*</span>}
        </div>
        <CustomInput
          className='position-clear'
          formID={formID} 
          type0={type0}
          uuid={customFieldObject.uuid}
          isUpdateAll={noHeader}
          isFromDetail
          type={customField.fieldType}
          customField={customField}
          object={object}
        />
      </Form.Group>
    );
  }
  const CustomInput = types[customField.fieldType] || CustomFieldText;
  return (
    <FormPair required={customField.required} isCustomFieldPair left label={customField.title}>
      <CustomInput
      formID={formID} 
        className='position-clear'
        uuid={customFieldObject.uuid}
        type0={type0}
        isFromDetail
        objectType={objectType}
        type={customField.fieldType}
        customField={customField}
        object={object}
      />
    </FormPair>
  );
};

const makeMapStateToProps = () => {
  const getCustomField = makeGetCustomFieldForUpdate();
  return (state, { customFieldId, object }) => ({
    customField: object ? getCustomField(state, customFieldId, object.uuid) : {},
  });
};

export default compose(connect(makeMapStateToProps))(CustomFieldInput);

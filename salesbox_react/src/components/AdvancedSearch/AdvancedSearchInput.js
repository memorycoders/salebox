// @flow
import * as React from 'react';
import { Input } from 'semantic-ui-react';
import IndustryDropdown from 'components/Industry/IndustryDropdown';
import TypeDropdown from 'components/Type/TypeDropdown';
import SizeDropdown from 'components/Size/SizeDropdown';
import CategoryDropdown from 'components/Category/CategoryDropdown';
import TagDropdown from 'components/Tag/TagDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import { compose, withHandlers } from 'recompose';
import FocusActivityDropdown from 'components/Focus/FocusActivityDropdown';
import CustomFieldDropdownAS from '../CustomField/CustomFieldInput/Dropdown/CustomFieldDropdownAS';
import CustomFieldTag from '../CustomField/CustomFieldInput/Tag/CustomFieldTag';
// import ProductGroupDropdown from '../ProductGroup/dropDown'
import AdvancedValuesDropdown from './AdvancedValuesDropdown'
import _l from 'lib/i18n';
import { RowType } from './advanced-search.types';
import { EventHandlerType } from 'types/semantic-ui.types';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import { CUSTOM_FIELD, AdSearchFieldTypeHaveDropdownValue } from '../../Constants';
import ProfileLevelDropdown from '../Resources/ResourceDropdown/ProfileLevelDropdown';
import YearDropdown from '../Resources/ResourceDropdown/YearDropdown';
import CompetenceLevelDropdown from '../Resources/ResourceDropdown/CompetenceLevelDropdown';

type PropsType = {
  fieldType: string,
  row: RowType,
  disabled: boolean,
  onValueChange: EventHandlerType,
  onValueIdChange: EventHandlerType,
  onDateChange: EventHandlerType,
  isCustomField: Boolean,
  customFieldId: string,
  field: string
};

const objecTypeDropdowns = {
  INDUSTRY: IndustryDropdown,
  CONTACT_INDUSTRY: IndustryDropdown,
  ACCOUNT_INDUSTRY: IndustryDropdown,
  CATEGORY: CategoryDropdown,
  TAG: TagDropdown,
  CONTACT_RELATION: TypeDropdown,
  RELATION: TypeDropdown,
  TYPE: TypeDropdown,
  ACCOUNT_TYPE: TypeDropdown,
  CONTACT_TYPE: TypeDropdown,
  SIZE: SizeDropdown,
  ACCOUNT_SIZE: SizeDropdown,
  FOCUS_WORKDATA: FocusDropdown,
  FOCUS_ACTIVITY: FocusActivityDropdown,
  // PRODUCT_GROUP: ProductGroupDropdown,
  PRODUCT: AdvancedValuesDropdown,
  PRODUCT_TYPE: AdvancedValuesDropdown,
  SOURCE: AdvancedValuesDropdown,
  PRIORITY: AdvancedValuesDropdown,
  BEHAVIOR_COLOR: AdvancedValuesDropdown,
  SEQUENTIAL_ACTIVITY: AdvancedValuesDropdown,
  WON: AdvancedValuesDropdown,
  LOST: AdvancedValuesDropdown,
  CALL_LIST: AdvancedValuesDropdown,
  GOT_PRODUCT: AdvancedValuesDropdown,
  COMING_PRODUCT: AdvancedValuesDropdown,
  COMING_PRODUCT_GROUP: AdvancedValuesDropdown,
  PRODUCT_GROUP: AdvancedValuesDropdown,
  GOT_PRODUCT_GROUP: AdvancedValuesDropdown,
  COMING_PRODUCT_TYPE: AdvancedValuesDropdown,
  GOT_PRODUCT_TYPE: AdvancedValuesDropdown,
  UNIT: AdvancedValuesDropdown,
  USER: AdvancedValuesDropdown,
  STATUS: AdvancedValuesDropdown,
  LEVEL: ProfileLevelDropdown,
  LAST_USED: YearDropdown,
  COMPETENCE_LEVEL: CompetenceLevelDropdown
};

const FieldTypeUsingValueText = [
  AdSearchFieldTypeHaveDropdownValue.BEHAVIOR_COLOR,
  AdSearchFieldTypeHaveDropdownValue.level,
  AdSearchFieldTypeHaveDropdownValue.last_used
]

const types = {
  CONTACT_RELATION: 'CONTACT_RELATIONSHIP',
  RELATION: 'CONTACT_RELATIONSHIP',
  ACCOUNT_TYPE: 'TYPE',
  CONTACT_TYPE: 'TYPE',
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
  },
});

const FIELD_TYPE = {
  DATE: 'DATE',
  OBJECT: 'OBJECT',
  PRODUCT_TAG: 'PRODUCT_TAG',
  NUMBER: 'NUMBER'
}
const FIELD_NUMBER_TYPE_INT = ['APPOINTMENTS', 'DIALS', 'CALLS', 'NO_OF_ACCOUNTS', 'NO_OF_CONTACTS', 'OPPORTUNITIES']
const REGEX_NUMBER = /^[0-9.,\b]+$/;
const REGEX_INT = /^[0-9\b]+$/
const AdvancedSearchInput = ({ onValueChange, onDateChange, onValueIdChange, fieldType, row, disabled, isCustomField, field, customFieldId, onProductIdChange, calculatingPositionMenuDropdown, colId, _class }: PropsType) => {
  if (fieldType === FIELD_TYPE.DATE) {

    const date = row.valueDate ? new Date(row.valueDate) : '';
    return <DatePickerInput label={_l`${date ? date : ''}:t(G)`} disabled={disabled} value={date} onChange={onDateChange} fluid />;
  }
  if (fieldType === FIELD_TYPE.OBJECT && (objecTypeDropdowns[row.field] || isCustomField || field && field.includes(CUSTOM_FIELD))) {
    const SpecializedDropdown = objecTypeDropdowns[row.field] ? objecTypeDropdowns[row.field] : CustomFieldDropdownAS;
    const _type = types[row.field] || 'TYPE';
    return <SpecializedDropdown rowId={row.id} field={row.field} _class={_class} colId={colId} calculatingPositionMenuDropdown={calculatingPositionMenuDropdown} typeCustomField={fieldType}  isCustomField={isCustomField} customFieldId={customFieldId} type={_type} disabled={disabled} onChange={onValueIdChange} value={row.valueId} />;
  }
  if(fieldType === FIELD_TYPE.PRODUCT_TAG) {
    return <CustomFieldTag _class={_class} colId={colId} calculatingPositionMenuDropdown={calculatingPositionMenuDropdown} typeCustomField={fieldType} isCustomField={isCustomField} customFieldId={customFieldId} disabled={disabled} onChange={onProductIdChange} />;
  }
  return <Input style={{ height: 28}} disabled={disabled} placeholder={_l`Value`} value={row.value} onChange={onValueChange} fluid />;
};

export default compose(
  withHandlers({
    onValueChange: ({ onChange, fieldType, field }) => (event, { value }) => {
      if(fieldType === FIELD_TYPE.NUMBER && value && value.length > 0 && (FIELD_NUMBER_TYPE_INT.indexOf(field) === -1 ? !REGEX_NUMBER.test(value) : !REGEX_INT.test(value) ) )
       return;
      onChange({ value });
    },
    onDateChange: ({ onChange }) => (valueDate) => {
      let _dateString = valueDate.toString();
      let _subString = _dateString.match(new RegExp(/ \w{3} \d{2} \d{4} +/g));
      let _splitDate = _subString && _subString[0] ? _subString[0].split(" ") : null;
      onChange({ valueDate: valueDate.getTime(), value: _splitDate ? `${_splitDate[2]} ${_splitDate[1]} ${_splitDate[3]}` : '' });
    },
    onValueIdChange: ({ onChange, row }) => (event, { value: valueId }) => {
      if(FieldTypeUsingValueText.indexOf(row.field) > -1) {
        onChange({ valueId, value: valueId });
      } else {
        onChange({ valueId});
      }
    },
    onProductIdChange: ({ onChange }) => (data) => {
      onChange({ productId: data.value, value: data.title });
    }
  }),
  // lifecycle({
  //   componentWillReceiveProps(nextProps) {
  //     const {row, fieldType, onChange} = this.props
  //     if(fieldType !== FIELD_TYPE.DATE && nextProps.fieldType === FIELD_TYPE.DATE) {
  //       onChange({ valueDate: row.valueDate ? new Date(row.valueDate).getTime() : new Date().getTime() })
  //     }
  //   }
  // })
)(AdvancedSearchInput);

import * as React from 'react';
import { compose, withHandlers, pure, withState } from 'recompose';
import { Dropdown, Button, Icon, Grid, Input } from 'semantic-ui-react';
import { makeGetRow, makeGetOperators, getFields, makeGetType } from './advanced-search.selectors';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { DropdownType, EventHandlerType, CallbackType } from 'types/semantic-ui.types';
import { RowType } from './advanced-search.types';
import AdvancedSearchInput from './AdvancedSearchInput';
import css from './AdvancedSearch.css';
import DatePickerInput from '../DatePicker/DatePickerInput';
import { CUSTOM_FIELD, ListAdSearchFieldTypeHaveDropdownValue, ObjectTypes } from '../../Constants';
// import { AdvanceSearchDropdown } from './dropdown/AdvanceSearchDropdown';

type PropsType = {
  row: RowType,
  fields: Array<{
    key: string,
    value: string,
    text: string,
    operators: Array<DropdownType>,
  }>,
  operators: Array<DropdownType>,
  removeRow: CallbackType,
  handleValueChange: EventHandlerType,
  handleOperatorChange: EventHandlerType,
  handleFieldChange: EventHandlerType,
  addRow: CallbackType,
  type: string,
  canAdd: boolean,
  canRemove: boolean,
  size?: string,
  last?: Number,
  indexRow?: Number
};

addTranslations({
  'en-US': {},
});

const NO_VALUE = 'NO_VALUE';

const SPECIAL = 'SPECIAL';

const removeIcon = <Icon name="remove" color="red" />;

const InputRow = ({
  handleValueChange,
  handleOperatorChange,
  handleFieldChange,
  removeRow,
  row,
  fields,
  operators,
  addRow,
  type,
  size,
  index,
  handleAddGroup,
  isShowInputValue,
  isAdd,
  isCustomField,
  _customFieldId,
  domIdWrapAD,
  rowId,
  objectType,
  handleSpecialField,
}: PropsType) => {
  const { field, operator, customFieldId, startDate, endDate, occupied, fieldType } = row;
  const operatorEnabled = !!field;
  const inputEnabled = operatorEnabled && operator;
  const calculatingPositionMenuDropdown = (id, classDialog) => {
    let dropdown = document.getElementById(id);
    if (dropdown) {
      let _widthDropdown = dropdown.offsetWidth;
      let _menu = dropdown.getElementsByClassName(`${classDialog ? classDialog : 'menu'}`)[0];
      if (_menu) {
        _menu.style.width = _widthDropdown;
        _menu.style.minWidth = _widthDropdown;
        _menu.style.top = dropdown.offsetTop + 28 - document.getElementById(domIdWrapAD).scrollTop;
        _menu.style.left = dropdown.offsetLeft;
        _menu = null;
      }
    }
    dropdown = null;
  };
  //translate
  let fieldsTranslate = [];
  if (fields != null && fields.length > 0) {
    fields.forEach((f) => {
      if (f.customFieldId == null) {
        fieldsTranslate.push({
          ...f,
          text:
            objectType === 'PIPELINE_ORDER' && f.text === 'Contract Date'
              ? f.text.replace('Contract Date', 'Closure date') && _l.call(this, ['Closure date']) //old value is Next action date
              : _l.call(this, [f.text]),
        });
      } else {
        fieldsTranslate.push(f);
      }
    });
  }
  let operatorsTranslate = [];
  if (operators != null && operators.length > 0) {
    operators.forEach((f) => {
      operatorsTranslate.push({ ...f, text: _l.call(this, [f.text]) });
    });
  }

  return (
    <Grid className={index === 0 ? css._paddingtop5 : ''}>
      <Grid.Column width="13" className={`${css._padding0}  ${css.positionNone}`}>
        <Grid className={css._margin0}>
          <Grid.Column width="1" className={`${css._paddingBottom5} ${css._textCenter}`}>
            <Button
              className={css.btnRemoveRow}
              size={size}
              // disabled={!canRemove}
              basic
              icon={removeIcon}
              onClick={removeRow}
            />
          </Grid.Column>
          <Grid.Column width="4" className={`${css._paddingBottom5} ${css.positionNone}`}>
            {/* <AdvanceSearchDropdown options={fields}/> */}
            <Dropdown
              className={`${css._wrapInputText} ${css.positionNone}`}
              id={`dropdowField-${rowId}-${index}`}
              value={field}
              placeholder={_l`Fields`}
              search
              fluid
              basic
              selection
              onClick={() => {
                calculatingPositionMenuDropdown(`dropdowField-${rowId}-${index}`);
              }}
              options={fieldsTranslate}
              onChange={handleFieldChange}
            />
          </Grid.Column>
          <Grid.Column width={fieldType === SPECIAL ? '7' : '4'} className={`${css._paddingBottom5} ${css.positionNone}`}>
            {fieldType === SPECIAL ? (
              <div className={css.mutiDate}>
                <div className={css.specialDate}>
                  <DatePickerInput
                    placeholder={_l`After`}
                    value={startDate}
                    onChange={(data) => {
                      handleSpecialField('startDate', data);
                    }}
                  />
                </div>
                <div className={css.specialDate} width="5">
                  <DatePickerInput
                    placeholder={_l`Before`}
                    value={endDate}
                    onChange={(data) => {
                      handleSpecialField('endDate', data);
                    }}
                  />
                </div>
              </div>
            ) : (
              <Dropdown
                className={`${css._wrapInputText} ${css.positionNone}`}
                button
                id={`dropdowOperator-${rowId}-${index}`}
                disabled={!operatorEnabled}
                value={operator}
                placeholder={_l`Operator`}
                search
                basic
                selection
                onClick={() => {
                  calculatingPositionMenuDropdown(`dropdowOperator-${rowId}-${index}`);
                }}
                options={operatorsTranslate}
                fluid
                onChange={handleOperatorChange}
              />
            )}
          </Grid.Column>
          <Grid.Column
            width={fieldType === SPECIAL ? '4' : '7'}
            className={`${css._paddingBottom5} ${css.positionNone} ${isShowInputValue ? '' : css.hide}`}
          >
            {fieldType === SPECIAL ? (
              <Input
                type="number"
                placeholder={_l`Occupied` + ' (%)'}
                value={occupied >= 0 ? occupied : ''}
                onChange={(e) => {
                  handleSpecialField('occupied', e.target.value);
                }}
              />
            ) : (
              <AdvancedSearchInput
                _class={`${css._wrapInputText} ${css.positionNone}`}
                colId={`value-${rowId}-${index}`}
                calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                isCustomField={isCustomField}
                field={field}
                customFieldId={customFieldId ? customFieldId : _customFieldId}
                disabled={!inputEnabled}
                fieldType={type}
                row={row}
                onChange={handleValueChange}
              />
            )}
          </Grid.Column>
        </Grid>
      </Grid.Column>
      <Grid.Column width="3" className={css._paddingBottom5}>
        <div className={css.listAction}>
          <Button
            size={size}
            className={`${css.btn} ${isAdd ? css.activeAndOr : css.disableAndOr}`}
            onClick={addRow}
          >{_l`And`}</Button>
          <Button
            className={`${css.btn} ${isAdd === false ? css.activeAndOr : css.disableAndOr}`}
            size={size}
            onClick={handleAddGroup}
          >{_l`Or`}</Button>
        </div>
      </Grid.Column>
    </Grid>
  );
};

const makeMapStateToProps = () => {
  const getRow = makeGetRow();
  const getOperators = makeGetOperators();
  const getType = makeGetType();
  const mapStateToProps = (state, { objectType, rowId }) => {
    const row = state.search[objectType].entities.row[rowId];
    const type = getType(state, objectType, row.field);
    const operators = getOperators(state, objectType, row.field);
    const fields = getFields(state, objectType);
    return {
      row,
      operators,
      fields,
      type,
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps),
  pure,
  withState('isAdd', 'setAdd', null),
  withState('isShowInputValue', 'showInputValue', true),
  withState('isCustomField', 'setCustomField', false),
  withState('_customFieldId', 'setCustomFieldId', null),
  withHandlers({
    handleValueChange: ({ onChange, rowId }) => (values) => {
      if (onChange) {
        onChange(rowId, values);
      }
    },
    handleSpecialField: ({ onChange, rowId }) => (field, data) => {
      if (field === 'occupied') {
        data = data < 0 ? 0 : data > 100 ? 100 : data;
      }

      onChange(rowId, { [field]: data });
      // updateSpecialField(objectType, field, data);
    },
    handleFieldChange: ({
      onChange,
      rowId,
      setCustomField,
      setCustomFieldId,
      fetchFieldValueDropdown,
      objectType,
      row,
      indexRow
    }) => (event, { value: field, options: options }) => {
      if (onChange) {
        let isCustomField = false;
        let customFieldId = null;
        let type = '';
        options.forEach((element) => {
          if (element.value === field) {
            if (field.includes(CUSTOM_FIELD)) {
              customFieldId = element.customFieldId;
              isCustomField = true;
            }
            type = element.type;
          }
        });

        if (objectType === ObjectTypes.Resource && type !== SPECIAL && customFieldId === null) {
          customFieldId = field;
        }
        setCustomField(isCustomField);
        setCustomFieldId(customFieldId);
        if (objectType === ObjectTypes.Resource && row?.fieldType === 'PRODUCT_TAG') {
          onChange(rowId, {
            field: '',
            customFieldId: '',
            fieldType: 'TEXT',
            valueId: null,
            operator: null,
            valueDate: null,
            valueText: null,
            productId: null,
            value: '',
          });
          setTimeout(() => {
            onChange(rowId, {
              field,
              customFieldId,
              fieldType: type,
              valueId: null,
              operator: null,
              valueDate: null,
              valueText: null,
              productId: null,
              value: '',
            });
          }, 200);
        } else {
          onChange(rowId, {
            field,
            customFieldId,
            fieldType: type,
            valueId: null,
            operator: 'EQUALS',
            valueDate: null,
            valueText: null,
            productId: null,
            value: '',
            startDate: null,
            endDate: null,
            occupied: '',
            availableIndex: indexRow
          });
        }
        if (ListAdSearchFieldTypeHaveDropdownValue.indexOf(field) > -1) {
          fetchFieldValueDropdown(rowId, objectType, field);
        }
      }
    },
    handleOperatorChange: ({ onChange, rowId, showInputValue, isShowInputValue, row }) => (
      event,
      { value: operator }
    ) => {
      if (onChange) {
        if (operator === NO_VALUE) {
          if (isShowInputValue) showInputValue(false);
        } else {
          if (!isShowInputValue) showInputValue(true);
        }

        onChange(rowId, { operator, valueDate: row.valueDate ? row.valueDate : null });
      }
    },
    addRow: ({ onAddRow, setAdd, isAdd }) => () => {
      if (isAdd === false) return;
      if (onAddRow) {
        setAdd(true);
        onAddRow();
      }
    },
    handleAddGroup: ({ addGroup, setAdd, isAdd }) => () => {
      if (isAdd) return;
      setAdd(false);
      addGroup();
    },
    removeRow: ({ onRemove, rowId }) => () => {
      if (onRemove) {
        onRemove(rowId);
      }
    },
  })
)(InputRow);

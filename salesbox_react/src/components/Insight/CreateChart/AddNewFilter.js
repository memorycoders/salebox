//@flow
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { Button, Dropdown, Input, Form } from 'semantic-ui-react';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Types, calculatingPositionMenuDropdown } from 'Constants';
import css from './CreateChart.css';

//recall for localization
const initOptionsField = ()=>{
  return [
    {
      text: _l`Company Type`,
      value: 'ACCOUNT_TYPE',
      key: 'ACCOUNT_TYPE',
      type: 'OBJECT',
      operatorList: [
        {
          text: _l`Equals`,
          value: 'EQUALS',
          key: 'EQUALS',
        },
        {
          text: _l`Not Equals`,
          value: 'NOT_EQUALS',
          key: 'NOT_EQUALS',
        },
      ],
    },
    {
      text: _l`Contact Type`,
      value: 'CONTACT_TYPE',
      key: 'CONTACT_TYPE',
      type: 'OBJECT',
      operatorList: [
        {
          text: _l`Equals`,
          value: 'EQUALS',
          key: 'EQUALS',
        },
        {
          text: _l`Not Equals`,
          value: 'NOT_EQUALS',
          key: 'NOT_EQUALS',
        },
      ],
    },
    {
      text: _l`Contact Industry`,
      value: 'CONTACT_INDUSTRY',
      key: 'CONTACT_INDUSTRY',
      type: 'OBJECT',
      operatorList: [
        {
          text: _l`Equals`,
          value: 'EQUALS',
          key: 'EQUALS',
        },
        {
          text: _l`Not Equals`,
          value: 'NOT_EQUALS',
          key: 'NOT_EQUALS',
        },
      ],
    },
    {
      text: _l`Company Industry`,
      value: 'ACCOUNT_INDUSTRY',
      key: 'ACCOUNT_INDUSTRY',
      type: 'OBJECT',
      operatorList: [
        {
          text: _l`Equals`,
          value: 'EQUALS',
          key: 'EQUALS',
        },
        {
          text: _l`Not Equals`,
          value: 'NOT_EQUALS',
          key: 'NOT_EQUALS',
        },
      ],
    },
    {
      text: _l`Sales step`,
      value: 'FOCUS_ACTIVITY',
      key: 'FOCUS_ACTIVITY',
      type: 'OBJECT',
      operatorList: [
        {
          text: _l`Equals`,
          value: 'EQUALS',
          key: 'EQUALS',
        },
        {
          text: _l`Not Equals`,
          value: 'NOT_EQUALS',
          key: 'NOT_EQUALS',
        },
      ],
    },
  ]

}

const optionsFeild = initOptionsField();
export {optionsFeild, initOptionsField};

const AddNewFilter = ({ visible, setVisiableAddFilterModal, setFilters, filters }) => {
  const [field, setField] = useState(null);
  const [operator, set0perator] = useState(null);
  const [operatorOptions, set0peratorOptions] = useState([]);
  const [errors, setErrors] = useState({});
  let optionsFeildLocal = initOptionsField();
  console.log('filters',filters);
  return (
    <ModalCommon
      title={_l`Add new filter`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      size="small"
      visible={visible}
      onDone={() => {
        if (!field) {
          let newErrors = { ...errors };
          newErrors.field = _l`Field is required`;
          console.log('newErrors: ', newErrors);
          setErrors(newErrors);
          return;
        }
        if (!operator) {
          let newErrors = { ...errors };
          newErrors.operator = _l`Operator is required`;
          setErrors(newErrors);
          return;
        }
        const filedObject = optionsFeildLocal.find((fieldO) => fieldO.value === field);
        const newFilters = filters && filters.concat({
          field,
          operator,
          name: filedObject.text,
        });
        setFilters(newFilters);
        setField(null);
        set0perator(null);
        setVisiableAddFilterModal(false);
      }}
      onClose={() => {
        setField(null);
        set0perator(null);
        set0peratorOptions(null);
        setVisiableAddFilterModal(false);
      }}
      paddingAsHeader={true}
    >
      <div style={{ display: 'flex' }} className="qualified-add-form">
        <Form className="position-unset" style={{ width: '100%' }}>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Fields`} <span className={css.required}>*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <Dropdown
                fluid
                search
                value={field}
                className="position-clear"
                selection
                size="small"
                placeholder={_l`Required`}
                onChange={(e, { value }) => {
                  setField(value);
                  if (value) {
                    let newErrors = { ...errors };
                    newErrors.field = '';
                    setErrors(newErrors);
                  }
                  const filedObject = optionsFeildLocal.find((fieldO) => fieldO.value === value);
                  set0peratorOptions(filedObject.operatorList);
                }}
                id={`addNewFilter`}
                onClick={() => calculatingPositionMenuDropdown(`addNewFilter`)}
                options={optionsFeildLocal}
              />
              <span className="form-errors">{errors.field}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Operator`} <span className={css.required}>*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <Dropdown
                fluid
                search
                value={operator}
                className="position-clear"
                selection
                size="small"
                placeholder={_l`Required`}
                onChange={(e, { value }) => {
                  if (value) {
                    let newErrors = { ...errors };
                    newErrors.operator = '';
                    setErrors(newErrors);
                  }
                  set0perator(value);
                }}
                id={`addNewFilterOperator`}
                onClick={() => calculatingPositionMenuDropdown(`addNewFilterOperator`)}
                options={operatorOptions}
              />
              <span className="form-errors">{errors.operator}</span>
            </div>
          </Form.Group>
        </Form>
      </div>
    </ModalCommon>
  );
};

export default compose()(AddNewFilter);

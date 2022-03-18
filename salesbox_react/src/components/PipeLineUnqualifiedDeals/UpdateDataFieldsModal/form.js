/* eslint-disable react/prop-types */
import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ProductGroupDropdown from '../../ProductGroup/dropDown';
import ProductDropdown from '../../Product/ProductDropdown';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import UnQualifiedStatus from '../CreatePipelineForm/status';
import UserDropdown from '../../User/UserDropdown';
import UnQualifiedPriority from '../CreatePipelineForm/priority';
import { getEntityErros } from '../unqualifiedDeal.selector';
import { createEntity, createErros } from '../unqualifiedDeal.actions';
import _l from 'lib/i18n';
import '../CreatePipelineForm/createPipelineForm.less';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { ObjectTypes } from '../../../Constants';

addTranslations({
  'en-US': {
    Manual: 'Manual',
    Import: 'Import',
    Account: 'Account',
    Contact: 'Contact',
    'Product group': 'Product group',
    Products: 'Products',
    Priority: 'Priority',
    Deadline: 'Deadline',
    Status: 'Status',
    Responsible: 'Responsible',
    Note: 'Note',
    'Add new contact': 'Add new contact',
    'You must select Product group first': 'You must select Product group first',
  },
});
let charLeft = 2000;
const maxChar = 2000;

class DataFieldsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unqualified: {},
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { unqualified } = this.state;
    if (prevState.unqualified !== unqualified) {
      let params = {};
      const keys = Object.keys(unqualified);
      keys.forEach((key) => {
        if (unqualified[key]) {
          if (key === 'lineOfBusiness') {
            params = {
              ...params,
              lineOfBusinessId: unqualified[key].uuid,
            };
          } else if (key === 'productList') {
            params = {
              ...params,
              productIdList: unqualified[key].map((value) => value.uuid),
            };
          } else {
            params = {
              ...params,
              [key]: unqualified[key],
            };
          }
        }
      });
      onChange(params);
    }
  }

  _handleProductGroup = (e, { value }) => {
    const { unqualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...unqualified, lineOfBusiness: null, productList: null };
    } else {
      newObj = { ...unqualified, lineOfBusiness: { uuid: value } };
    }
    this.props.createErros({ lineOfBusiness: null });
    this.setState({ unqualified: newObj });
  };

  _handleProduct = (e, { value }) => {
    const { unqualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...unqualified, productList: null };
    } else {
      const productIds = this.state.productList || [];
      if (value && value.length > 0) {
        value.forEach((v) => {
          productIds.push({ uuid: v });
        });
      }
      newObj = { ...unqualified, productList: productIds };
    }
    this.setState({ unqualified: newObj });
  };

  _handlePriority = (e, { value }) => {
    this._createUpdateHandler('priority', value, true);
  };

  _handleDateChange = (value) => {
    this._createUpdateHandler('deadlineDate', value);
  };

  _handleNoteChange = (e, { value }) => {
    const { unqualified } = this.state;
    const newObj = { ...unqualified, note: value };
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.setState({ unqualified: newObj });
  };

  _handleStatusChangle = (e, { value }) => {
    this._createUpdateHandler('status', value);
  };

  _handleUserChange = (e, { value }) => {
    this._createUpdateHandler('ownerId', value);
  };

  _createUpdateHandler = (key, value, clearError = false) => {
    const { unqualified } = this.state;
    const newObj = { ...unqualified, [key]: value };
    if (clearError) this.props.createErros({ [key]: null });
    this.setState({ unqualified: newObj });
  };

  _handleCheckGroup = (e, data) => {
    const { unqualified } = this.state;
    let { lineOfBusiness } = unqualified;
    if (!lineOfBusiness || lineOfBusiness.uuid === null) {
      this.props.createErros({ lineOfBusiness: _l`You must select product group first` });
    } else {
      this.props.createErros({ lineOfBusiness: null });
    }
  };

  render() {
    const { userId, errors } = this.props;
    const { unqualified } = this.state;
    const { lineOfBusiness, priority, productList, note, status, ownerId } = unqualified;
    const deadlineDate = unqualified.deadlineDate ? new Date(unqualified.deadlineDate) : '';
    charLeft = unqualified.note ? maxChar - unqualified.note.length : 2000;
    const products = productList
      ? productList.map((p) => {
          return p.uuid;
        })
      : [];
    return (
      <div className="unqualified-add-form">
        <Form>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Product group`}</div>
            <div className="dropdown-wrapper">
              <ProductGroupDropdown
                className="user-dropdown"
                width={8}
                onChange={this._handleProductGroup}
                value={lineOfBusiness && lineOfBusiness.uuid}
                error={errors && errors.lineOfBusiness ? true : false}
              />
              <span className="form-errors">{errors && errors.lineOfBusiness ? errors.lineOfBusiness : null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Products`}</div>
            <div className="dropdown-wrapper">
              <ProductDropdown
                className="user-dropdown product-dropdown-wrapper"
                width={8}
                lineOfBusinessId={lineOfBusiness && lineOfBusiness.uuid}
                onChange={this._handleProduct}
                value={products}
                onClick={this._handleCheckGroup}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Priority`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <UnQualifiedPriority
                className="user-dropdown"
                width={8}
                error={errors && errors.priority ? true : false}
                value={priority}
                onChange={this._handlePriority}
              />
              <span className="form-errors">{errors && errors.priority ? errors.priority : null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Deadline`}</div>
            <div className="dropdown-wrapper">
              <div style={{ width: '100%', height: '28px' }}>
                <DatePickerInput value={deadlineDate} width={8} onChange={this._handleDateChange} isValidate />
              </div>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Status`}</div>
            <div className="dropdown-wrapper">
              <UnQualifiedStatus width={8} value={status} onChange={this._handleStatusChangle} />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Note`}</div>
            <div className="dropdown-wrapper">
              <TextArea
                size="small"
                rows={5}
                maxLength={maxChar + 1}
                onChange={this._handleNoteChange}
                className="unqualified-area"
                value={note}
              />
              <span className="span-charLeft">{charLeft}</span>
            </div>
          </Form.Group>
          <CustomFieldPane type0='task' objectType={ObjectTypes.Lead} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    errors: getEntityErros(state),
  };
};

export default connect(mapStateToProps, { getEntityErros, createEntity, createErros })(DataFieldsForm);

/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ProductGroupDropdown from '../../../ProductGroup/dropDown';
import ProductDropdown from '../../../Product/ProductDropdown';
import DatePickerInput from '../../../DatePicker/DatePickerInput';
import UnQualifiedStatus from '../../../PipeLineUnqualifiedDeals/CreatePipelineForm/status';
import UserDropdown from './UserDropdown';
import UnQualifiedPriority from '../../../PipeLineUnqualifiedDeals/CreatePipelineForm/priority';
import _l from 'lib/i18n';
import _ from 'lodash';
import '../../../PipeLineUnqualifiedDeals/CreatePipelineForm/createPipelineForm.less';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import cssForm from '../../../Task/TaskForm/TaskForm.css';
import cx from 'classnames';

let charLeft = 2000;
const maxChar = 2000;

class CreatePipelineForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unqualified: {
        ...props.form,
        user: props.form.user || props.user,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ unqualified: this.props.form });
    }
  }

  _handleProductGroup = (e, { value, options }) => {
    const obj = _.find(options, (o) => {
      return o.value === value;
    });
    const { unqualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...unqualified, lineOfBusiness: null, productList: null };
    } else {
      newObj = { ...unqualified, lineOfBusiness: { uuid: value }, productGroup: obj };
    }
    this.props.onErrors({ lineOfBusiness: null });
    this.setState({ unqualified: newObj }, () => {
      this.props.onChange(newObj);
    });
  };

  _handleProduct = (e, { value, options }) => {
    const { unqualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...unqualified, productList: null };
    } else {
      const productIds = this.state.productList || [];
      const p = this.state.products || []
      if (value && value.length > 0) {
        value.forEach((v) => {
          productIds.push({ uuid: v });
          const obj = _.find(options, (o) => {
            return o.value === v;
          });
          p.push(obj);
        });
      }
      newObj = { ...unqualified, productList: productIds, products: p };
    }
    this.setState({ unqualified: newObj }, () => {
      this.props.onChange(newObj);
    });
  };

  _handlePriority = (e, { value }) => {
    this._createUpdateHandler('priority', value, true);
  };

  _handleDateChange = (value) => {
    this._createUpdateHandler('deadlineDate', value);
  };

  _handleStatusChangle = (e, { value }) => {
    let v = value;
    if (value === 'none') v = null;
    this._createUpdateHandler('status', v);
  };

  _handleUserChange = (e, { value, text }) => {
    const { unqualified } = this.state;
    let newObj = {};
    if (value !== null) {
      newObj = { ...unqualified, ownerId: value, user: { uuid: value, name: text } };
    } else {
      newObj = { ...unqualified, ownerId: value, user: null };
    }
    this.setState({ unqualified: newObj }, () => {
      this.props.onChange(newObj);
    });
  };

  _createUpdateHandler = (key, value, clearError = false) => {
    const { unqualified } = this.state;
    const newObj = { ...unqualified, [key]: value };
    if (clearError) this.props.onErrors({ [key]: null });
    this.setState({ unqualified: newObj }, () => {
      this.props.onChange(newObj);
    });
  };

  _handleCheckGroup = (e, data) => {
    const { unqualified } = this.state;
    const { lineOfBusiness } = unqualified;
    if (!lineOfBusiness || lineOfBusiness.uuid === null) {
      this.props.onErrors({ lineOfBusiness: _l`You must select product group first` });
    } else {
      this.props.onErrors({ lineOfBusiness: null });
    }
  };

  render() {
    const { userId, errors } = this.props;
    const { unqualified } = this.state;
    const { lineOfBusiness, productList, ownerId } = unqualified;
    const deadlineDate = unqualified.deadlineDate ? new Date(unqualified.deadlineDate) : '';
    charLeft = unqualified.note ? maxChar - unqualified.note.length : 2000;
    const products = productList
      ? productList.map((p) => {
          return p.uuid;
        })
      : [];
    const priority = (unqualified.priority && Math.ceil(unqualified.priority / 20) * 20) || unqualified.priority;
    const status = unqualified.status === 'none' || unqualified.status === null ? 'none' : unqualified.status;
    return (
      <div style={{ display: 'flex' }} className="unqualified-add-form">
        <Form className={`position-unset ${cssForm.normalForm}`}>
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
            <div className="unqualified-label">{_l`Next action`}</div>
            <div className="dropdown-wrapper">
              <div style={{ width: '100%', height: '28px' }}>
                <DatePickerInput value={deadlineDate} width={8} onChange={this._handleDateChange} isValidate />
              </div>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Status`}</div>
            <div className="dropdown-wrapper">
              <UnQualifiedStatus
                className={cx('position-clear')}
                width={8}
                value={status}
                onChange={this._handleStatusChangle}
                id="UnqualifiedStatusDropdownCreateUnqualifiedDeal"
                upward={false}
                onClick={() => calculatingPositionMenuDropdown('UnqualifiedStatusDropdownCreateUnqualifiedDeal')}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Responsible`}</div>
            <div className="dropdown-wrapper">
              <UserDropdown
                className={cx('user-dropdown', 'position-clear')}
                value={ownerId || userId}
                onChange={this._handleUserChange}
                id="UserDropdownCreateUnqualifiedDeal"
                upward={false}
                onClick={() => calculatingPositionMenuDropdown('UserDropdownCreateUnqualifiedDeal')}
              />
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, { form, errors }) => {
  return {
    form,
    userId: state.auth.userId,
    user: state.auth.user,
    errors,
  };
};

export default connect(mapStateToProps, {})(CreatePipelineForm);

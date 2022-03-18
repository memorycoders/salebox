/* eslint-disable react/prop-types */
import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import ContactDropdown from '../../Contact/ContactDropdown';
import ProductGroupDropdown from '../../ProductGroup/dropDown';
import ProductDropdown from '../../Product/ProductDropdown';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import UnQualifiedStatus from './status';
import UserDropdown from '../../User/UserDropdown';
import UnQualifiedPriority from './priority';
import { getEntityErros } from '../unqualifiedDeal.selector';
import { createEntity, createErros } from '../unqualifiedDeal.actions';
import _l from 'lib/i18n';
import './createPipelineForm.less';
import { OverviewTypes, ObjectTypes } from '../../../Constants';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import cx from 'classnames';
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

class CreatePipelineForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unqualified: props.form || {},
      hiddenAccount: this.isHiddenAccount(),
      hiddenContact: this.isHiddenContact(),
    };
  }
  isHiddenAccount = () => {
    return (
      this.props.overviewType == OverviewTypes.Account_Unqualified_Multi ||
      this.props.overviewType == OverviewTypes.Contact_Unqualified_Multi
    );
  };

  isHiddenContact = () => {
    return (
      this.isHiddenAccount() &&
      (this.props.form == null || (this.props.form != null && this.props.form.organisationId == null))
    );
  };

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ unqualified: this.props.form });
    }
  }

  _handleOrganisationChange = (e, { value }) => {
    this._createUpdateHandler('organisationId', value);
    this.props.createErros({ organisationId: null, contactId: null });
  };

  _handleContactChange = (e, { value }) => {
    this._createUpdateHandler('contactId', value);
    this.props.createErros({ organisationId: null, contactId: null });
  };

  _handleProductGroup = (e, { value }) => {
    const { unqualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...unqualified, lineOfBusiness: null, productList: null };
    } else {
      newObj = { ...unqualified, lineOfBusiness: { uuid: value } };
    }
    this.props.createErros({ lineOfBusiness: null });
    this.setState({ unqualified: newObj }, () => {
      this.props.createEntity(this.props.formKey, newObj);
    });
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
    this.setState({ unqualified: newObj }, () => {
      this.props.createEntity(this.props.formKey, newObj);
    });
  };

  _handlePriority = (e, { value }) => {
    this._createUpdateHandler('priority', value, true);
  };

  _handleDateChange = (value) => {
    // console.log('deadlineDate', value)
    this._createUpdateHandler('deadlineDate', value);
  };

  _handleNoteChange = (e, { value }) => {
    const { unqualified } = this.state;
    const newObj = { ...unqualified, note: value };
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.setState({ unqualified: newObj }, () => {
      this.props.createEntity(this.props.formKey, newObj);
    });
  };

  _handleStatusChangle = (e, { value }) => {
    let v = value;
    if (value === 'none') v = null;
    this._createUpdateHandler('status', v);
  };

  _handleUserChange = (e, { value }) => {
    this._createUpdateHandler('ownerId', value);
  };

  _createUpdateHandler = (key, value, clearError = false) => {
    const { unqualified } = this.state;
    const newObj = { ...unqualified, [key]: value };
    if (clearError) this.props.createErros({ [key]: null });
    this.setState({ unqualified: newObj }, () => {
      this.props.createEntity(this.props.formKey, newObj);
    });
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
    const { userId, errors, formKey } = this.props;
    const { unqualified } = this.state;
    const {
      organisationId,
      contactId,
      lineOfBusiness,
      productList,
      note,
      ownerId,
      organisation,
      contact,
    } = unqualified;
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
          {!this.state.hiddenAccount && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">
                {_l`Company`}
                <span className="required">*</span>
              </div>
              <div className="dropdown-wrapper" width={8}>
                <OrganisationDropdown
                  colId="unqualified-form-organisation"
                  width={8}
                  addLabel='Add company'
                  onChange={this._handleOrganisationChange}
                  error={errors && errors.organisationId ? true : false}
                  value={organisationId}
                  text={organisation && organisation.name}
                />
                <span className="form-errors">{errors && errors.organisationId ? errors.organisationId : null}</span>
              </div>
            </Form.Group>
          )}
          {!this.state.hiddenContact && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">
                {_l`Contact`}
                <span className="required">*</span>
              </div>
              <div className="dropdown-wrapper">
                <ContactDropdown
                  colId="unqualified-form-contact"
                  width={8}
                  addLabel='Add contact'
                  error={errors && errors.contactId ? true : false}
                  organisationId={organisationId}
                  onChange={this._handleContactChange}
                  value={contactId}
                  text={contact && contact.name}
                />
                <span className="form-errors">{errors && errors.contactId ? errors.contactId : null}</span>
              </div>
            </Form.Group>
          )}
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
          {!this.props.hideOwner && !(ownerId == null && formKey == '__EDIT') && (
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
          )}
          <Form.Group className="unqualified-fields position-relative">
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
              <span className={cssForm.spanNote}>{charLeft}</span>
            </div>
          </Form.Group>
        </Form>
        <div className={cssForm.customFieldForm}>
          <div className={cssForm.customFieldContent}>
            <CustomFieldPane type0='task' noHeader object={unqualified} objectId={unqualified.uuid} objectType={ObjectTypes.Lead} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { formKey }) => {
  return {
    form: state.entities.unqualifiedDeal[formKey] || {},
    userId: state.auth.userId,
    errors: getEntityErros(state),
  };
};

export default connect(mapStateToProps, { getEntityErros, createEntity, createErros })(CreatePipelineForm);

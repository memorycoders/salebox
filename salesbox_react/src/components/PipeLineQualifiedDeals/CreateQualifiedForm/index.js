/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, TextArea, Input, Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import ContactDropdown from '../../Contact/ContactDropdown';
import UserDropdown from './UserDropdown';
import SalesMethodDropdown from '../../SalesMethod/SalesMethodDropdown/SalesMethodDropdown';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import { createEntity, createErros } from '../qualifiedDeal.actions';
import { remove } from '../../OrderRow/order-row.actions';
import { setActionForHighlight } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import './styles.less';
import { getListOrderRows } from '../../OrderRow/order-row.selectors';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import editBtn from '../../../../public/Edit.svg';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import cx from 'classnames';
import api from '../../../lib/apiClient';
import { Endpoints } from '../../../Constants';
import { editEntity as orderRoWEditEntity } from '../../OrderRow/order-row.actions';
import generateUuid from 'uuid/v4';
import { fetchListProductByResource } from '../../Resources/resources.actions';

addTranslations({
  'en-US': {
    Account: 'Account',
    Contact: 'Contact',
    Responsible: 'Responsible',
    Note: 'Note',
    'Add new contact': 'Add new contact',
    Description: 'Description',
    'Sales process': 'Sales process',
    Products: 'Products',
    'Progress (%)': 'Progress (%)',
    Edit: 'Edit',
    Delete: 'Delete',
  },
});

let charLeft = 100;
const maxChar = 100;
class CreateQualifiedForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qualified: {
        ...props.form,
        participantList:
          props.form.participantList && props.form.participantList.length > 0
            ? props.form.participantList
            : [{ uuid: props.userId, sharedPercent: 100 }],
      },
      visible: false,
    };
  }

  componentDidMount() {
    const { qualified } = this.state;
    const { participantList } = qualified;
    const newObj = { ...qualified, participantList, uuid: this.props.qualifiedId };
    if (this.props.highlightAction === 'create' || this.props.highlightAction === 'edit') {
      setTimeout(() => {
        this.props.createEntity(this.props.formKey, newObj);
      }, 1);
    } else {
      this.props.createEntity(this.props.formKey, newObj);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ qualified: this.props.form });
    }
  }

  _initParticipantList = () => {
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return { uuid: p.uuid, sharedPercent: p.sharedPercent };
      });
    }
    return [];
  };

  _initUsersValue = () => {
    const { qualified } = this.state;
    const { participantList } = qualified;
    // console.log("qualified ",qualified);
    // console.log("participantList ",participantList);
    if (participantList && participantList.length > 0) {
      return participantList.map((p) => {
        return p.uuid;
      });
    }
    return [];
  };

  sumPercent = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseInt(arr[i].sharedPercent);
    }
    return sum;
  };

  _handleUserChange = (e, { value }) => {
    let newObj;
    const { qualified } = this.state;
    const { participantList = [] } = qualified;
    const ids = [];
    value.map((id) => {
      const right = participantList.find((x) => x.uuid === id);
      if (right) {
        ids.push(right);
      } else {
        ids.push({ uuid: id, sharedPercent: 0 });
      }
    });
    const sum = this.sumPercent(ids);
    if (sum !== 100) {
      for (let i = 0; i < ids.length; i++) {
        // ids[i].sharedPercent = i === 0 ? 100 - sum : 0;
        ids[i].sharedPercent = i === 0 ? Number(100 - sum) + Number(ids[i].sharedPercent) : ids[i].sharedPercent;
      }
    }
    newObj = { ...qualified, participantList: ids };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ participantList: null });
  };

  _handleLabelClick = (e, data) => {
    this.props.onOpen(this.state.qualified.participantList);
  };

  onClosePercentage = () => {
    this.props.onClosePercentage();
  };

  _handleOrganisationChange = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, organisation: { uuid: value }, sponsorList: null };
    this.props.createEntity(this.props.formKey, newObj);
  };

  _handleContactChange = (e, { value }) => {
    const { qualified } = this.state;
    const index = value.indexOf(null);
    if (index >= 0) value.splice(index, 1);
    const newObj = { ...qualified, sponsorList: value.map((value) => ({ uuid: value })) };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ sponsorList: null });
  };

  _handleNoteChange = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, description: value };
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ description: null });
  };

  _handleSaleMethod = (e, { value }) => {
    const { qualified } = this.state;
    let newObj;
    if (value === null) {
      newObj = { ...qualified, salesMethod: null };
    } else {
      newObj = { ...qualified, salesMethod: { uuid: value } };
    }
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ salesMethod: null });
  };

  _handleProgress = (e, { value }) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, manualProgress: value <= 100 ? value : 100 };
    this.props.createEntity(this.props.formKey, newObj);
    this.props.createErros({ manualProgress: null });
  };

  _handleDateChange = (value) => {
    const { qualified } = this.state;
    const newObj = { ...qualified, contractDate: value };
    this.props.createEntity(this.props.formKey, newObj);
  };

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  clickAddProduct = async () => {
    try {
      this.props.setActionForHighlight('ORDER_ROW', 'create');
      if (this.props.isAddDealMultiResource && this.props.itemsSelected) {
        this.props.fetchListProductByResource();
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { errors, rows, products, types } = this.props;
    const {
      manualProgress,
      organisation,
      sponsorList,
      salesMethod,
      orderRowCustomFieldDTOList = [],
      description,
    } = this.state.qualified;

    const users = this._initUsersValue();
    const participantOpts = this._initParticipantList();
    const contractDate = this.state.qualified.contractDate ? new Date(this.state.qualified.contractDate) : new Date();
    // console.log('Create qualified users',users);
    return (
      <div style={{ display: 'flex' }} className="qualified-add-form">
        <Form className={`position-unset ${cssForm.normalForm}`}>
          {this.props.overviewType !== 'CONTACT_QUALIFIED_MULTI' && (
            <>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Company`}</div>
                <div className="dropdown-wrapper" width={8}>
                  <OrganisationDropdown
                    colId="qualified-form-organisation"
                    width={8}
                    addLabel="Add company"
                    onChange={this._handleOrganisationChange}
                    value={organisation && organisation.uuid}
                  />
                  <span className="form-errors" />
                </div>
              </Form.Group>
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Contact`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper">
                  <ContactDropdown
                    colId="qualified-form-contact"
                    width={8}
                    multiple={true}
                    addLabel="Add contact"
                    organisationId={organisation && organisation.uuid}
                    onChange={this._handleContactChange}
                    error={errors && errors.sponsorList ? true : false}
                    value={sponsorList && sponsorList.length > 0 ? sponsorList.map((value) => value.uuid) : []}
                  />
                  <span className="form-errors">{errors && errors.sponsorList ? errors.sponsorList : null}</span>
                </div>
              </Form.Group>
            </>
          )}
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Responsible`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <UserDropdown
                colId="user-dropdown-deal"
                className="user-dropdown product-dropdown-wrapper"
                onChange={this._handleUserChange}
                value={users}
                participantOpts={participantOpts}
                error={errors && errors.participantList && participantOpts.length <= 0 ? true : false}
                onLabelClick={this._handleLabelClick}
              />
              <span className="form-errors">
                {errors && errors.participantList && participantOpts.length <= 0 ? errors.participantList : null}
              </span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Description`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper area-wrapper">
              <TextArea
                size="small"
                rows={5}
                maxLength={maxChar + 1}
                onChange={this._handleNoteChange}
                value={this.props.form.description}
                className={errors && errors.description ? 'unqualified-area error' : 'unqualified-area'}
              />
              <span className={errors && errors.description ? 'span-charLeft-error' : 'span-charLeft'}>{charLeft}</span>
              <span className="form-errors">{errors && errors.description ? errors.description : null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Pipeline`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <SalesMethodDropdown
                className={cx('user-dropdown', 'position-clear')}
                error={errors && errors.salesMethod ? true : false}
                value={salesMethod && salesMethod.uuid}
                onChange={this._handleSaleMethod}
                upward={false}
                id="SaleProcessDropdownGlobalAddQualified"
                onClick={() => calculatingPositionMenuDropdown('SaleProcessDropdownGlobalAddQualified')}
              />
              <span className="form-errors">{errors && errors.salesMethod ? errors.salesMethod : null}</span>
            </div>
          </Form.Group>
          {salesMethod &&
            salesMethod.uuid &&
            types[salesMethod.uuid] &&
            types[salesMethod.uuid].manualProgress === 'ON' && (
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Progress (%)`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper">
                  <Input
                    value={manualProgress || ''}
                    error={errors && errors.manualProgress ? true : false}
                    type="number"
                    min={0}
                    onChange={this._handleProgress}
                  />
                  <span className="form-errors">{errors && errors.manualProgress ? errors.manualProgress : null}</span>
                </div>
              </Form.Group>
            )}
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Next action`}</div>
            <div className="dropdown-wrapper">
              <div style={{ width: '100%', height: '28px' }}>
                <DatePickerInput value={contractDate} width={8} isValidate onChange={this._handleDateChange} />
              </div>
            </div>
          </Form.Group>
          {this.props.formKey !== '__EDIT' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Products`}</div>
              <div className="dropdown-wrapper">
                <Input readOnly={true} icon="add" onClick={this.clickAddProduct} />
              </div>
            </Form.Group>
          )}
          {this.props.formKey !== '__EDIT' && rows && rows.length > 0 && orderRowCustomFieldDTOList && (
            <Form.Group className="unqualified-fields">
              <ul>
                {rows.map((r) => {
                  if (!r.product) return null;
                  return (
                    <li key={r.id}>
                      <div className="product-name">
                        {(products[r.product] && products[r.product].name) || (r.productDTO && r.productDTO.name)}
                      </div>
                      <div className="product-action">
                        {this.numberWithCommas(r.value)}
                        <span>
                          <MoreMenu className="bgMore" color="task">
                            <Menu.Item onClick={() => this.props.setActionForHighlight('ORDER_ROW', 'create')}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="actionIcon">
                                {_l`Update`}
                                <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                              </div>
                            </Menu.Item>
                            <Menu.Item onClick={() => this.props.remove(r.id)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="actionIcon">
                                {_l`Delete`}
                                <Icon name="trash alternate" color="grey" />
                              </div>
                            </Menu.Item>
                          </MoreMenu>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Form.Group>
          )}
        </Form>
        <div className={cssForm.customFieldForm}>
          <div className={cssForm.customFieldContent}>
            <CustomFieldPane
              noHeader
              type0="task"
              object={this.state.qualified}
              objectId={this.state.qualified.uuid}
              objectType={ObjectTypes.Opportunity}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, { formKey }) => {
  return {
    form: state.entities.qualifiedDeal[formKey] || {},
    userId: state.auth.userId,
    errors: state.entities.qualifiedDeal.__ERRORS,
    rows: getListOrderRows(state),
    products: state.entities.product,
    types: state.entities.salesMethod,
    isAddDealMultiResource: state.entities?.resources?.isAddDealMultiResource,
    itemsSelected: state.overview?.RESOURCE?.selected,
  };
};

export default connect(mapStateToProps, {
  createEntity,
  createErros,
  setActionForHighlight,
  remove,
  orderRoWEditEntity,
  fetchListProductByResource,
})(CreateQualifiedForm);

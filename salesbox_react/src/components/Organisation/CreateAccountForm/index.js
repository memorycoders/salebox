/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import UserResponsibleDD from 'components/User/DropDown/UserResponsibleDD';
import CountryDropdown from './CountryDropdown';
import TypeDropdown from './TypeDropdown';
import IndustryDropdown from './IndustryDropdown';
import SizeDropdown from './SizeDropdown';
import EmailPane from './EmailPane';
import PhonePane from './PhonePane';
import { imageOnCropEnabled, update, uploadErrors } from '../organisation.actions';
import './styles.less';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cx from 'classnames';

addTranslations({
  'en-US': {
    Name: 'Name',
    'Formal name': 'Formal name',
    VAT: 'VAT',
    Type: 'Type',
    Industry: 'Industry',
    Size: 'Size',
    Web: 'Web',
    'Visiting address': 'Visiting address',
    'Billing address': 'Billing address',
    'Shipping address': 'Shipping address',
    Street: 'Street',
    City: 'City',
    Region: 'Region',
    Country: 'Country',
    Email: 'Email',
    Phone: 'Phone',
    Default: 'Default',
    Responsible: 'Responsible',
    Budget: 'Budget',
  },
});

class CreateAccountForm extends React.PureComponent {
  _handleAvatar = () => {
    const _this = this;
    document.getElementById('account-field-photo').click();
    document.getElementById('account-field-photo').onchange = function() {
      if (this.files && this.files.length) {
        _this.props.imageOnCropEnabled(this.value, this.files[0]);
      }
    };
  };

  createUpdateHandler = (key, value) => {
    const { formKey } = this.props;
    if (key === 'name') {
      this.props.uploadErrors({ name: null });
    }
    this.props.update(formKey, { [key]: value });
  };

  handleNameChange = (event, { value }) => {
    this.createUpdateHandler('name', value);
  };

  handleFormalNameChange = (event, { value }) => {
    this.createUpdateHandler('formalName', value);
  };

  handleVatChange = (event, { value }) => {
    this.createUpdateHandler('vatNumber', value);
  };

  handleTypeChange = (event, { value }) => {
    this.createUpdateHandler('type', value);
  };

  handleIndustryChange = (event, { value }) => {
    this.createUpdateHandler('industry', value);
  };

  handleSizeChange = (event, { value }) => {
    this.createUpdateAddress('size', value);
  };

  handleStreetChange = (event, { value }) => {
    this.createUpdateAddress('street', value);
  };

  handleZipCodeChange = (event, { value }) => {
    this.createUpdateAddress('zipCode', value);
  };

  handleCityChange = (event, { value }) => {
    this.createUpdateAddress('city', value);
  };

  handleRegionChange = (event, { value }) => {
    this.createUpdateAddress('state', value);
  };

  handleCountryChange = (event, { value }) => {
    this.createUpdateAddress('country', value);
  };

  handleWebChange = (event, { value }) => {
    this.createUpdateHandler('web', value);
  };

  handleAddressType = (type) => {
    this.createUpdateHandler('addressType', type);
  };

  handleBudgetChange = (event, { value }) => {
    this.createUpdateHandler('budget', value);
  };

  handleNumberGoalsMeetingChange = (event, { value }) => {
    this.createUpdateHandler('numberGoalsMeeting', value);
  };

  handleResponsibleChange = (event, { value }) => {
    this.createUpdateHandler('participants', value);
  };

  getAddress = () => {
    const { form } = this.props;
    const { billingAddress = {}, shippingAddress = {}, addressType } = form;
    let street = '';
    let zipCode = '';
    let city = '';
    let state = '';
    let country = '';
    if (!addressType || addressType === 'visitingAddress') {
      street = form.street;
      zipCode = form.zipCode;
      city = form.city;
      state = form.state;
      country = form.country;
    } else if (addressType === 'billingAddress') {
      street = (billingAddress && billingAddress.street) || '';
      zipCode = (billingAddress && billingAddress.zipCode) || '';
      city = (billingAddress && billingAddress.city) || '';
      state = (billingAddress && billingAddress.state) || '';
      country = (billingAddress && billingAddress.country) || '';
    } else if (addressType === 'shippingAddress') {
      street = (shippingAddress && shippingAddress.street) || '';
      zipCode = (shippingAddress && shippingAddress.zipCode) || '';
      city = (shippingAddress && shippingAddress.city) || '';
      state = (shippingAddress && shippingAddress.state) || '';
      country = (shippingAddress && shippingAddress.country) || '';
    }
    return { street, zipCode, city, state, country };
  };

  createUpdateAddress = (key, value) => {
    const { form } = this.props;
    const { addressType } = form;
    const { billingAddress = {}, shippingAddress = {} } = form;
    if (!addressType || addressType === 'visitingAddress') {
      this.createUpdateHandler(key, value);
    } else if (addressType === 'billingAddress') {
      const obj = { ...billingAddress, [key]: value };
      this.createUpdateHandler('billingAddress', obj);
    } else if (addressType === 'shippingAddress') {
      const obj = { ...shippingAddress, [key]: value };
      this.createUpdateHandler('shippingAddress', obj);
    }
  };

  render() {
    const { imageData, errors, form } = this.props;
    const { addressType = 'visitingAddress', avatar } = form;
    const marginTopStyle = this.props.formKey === '__EDIT' ? '0px' : '50px';
    const avatarUrl = avatar
      ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`
      : null;
    const { street, zipCode, city, state, country } = this.getAddress();
    return (
      <div className={cssForm.containerTaskForm}>
        <div className={`position-unset account-form ${cssForm.normalForm}`}>
          <div className="account-fields-group">
            <div className="fields-group-left">
              <Form>
                <Form.Group className="account-fields">
                  <div className="account-field-label __account">{_l`Company photo`}</div>
                  <div className="account-field" width={8}>
                    <Image
                      src={imageData ? imageData : avatarUrl ? avatarUrl : '/square-image.png'}
                      size="tiny"
                      circular
                      onClick={() => this._handleAvatar()}
                    />
                    <input type="file" id="account-field-photo" style={{ display: 'none' }} />
                  </div>
                </Form.Group>
                {/*{this.props.formKey === '__EDIT' && (*/}
                  <Form.Group className="account-fields">
                    <div className="account-field-label">
                      {_l`Responsible`}
                      <span className="required">*</span>
                    </div>
                    <div className="account-field" width={8}>
                      <UserResponsibleDD
                        id="user-dropdown-account"
                        value={form.participants}
                        _onChange={this.handleResponsibleChange}
                        className="user-dropdown-multi"
                      />
                      <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
                    </div>
                  </Form.Group>
                {/*)}*/}
                <Form.Group className="account-fields">
                  <div className="account-field-label">
                    {_l`Name`}
                    <span className="required">*</span>
                  </div>
                  <div className="account-field" width={8}>
                    <Input
                      error={errors && errors.name ? true : false}
                      value={form.name || ''}
                      onChange={this.handleNameChange}
                    />
                    <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`ERP name`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.formalName || ''} onChange={this.handleFormalNameChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Company VAT`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.vatNumber || ''} onChange={this.handleVatChange} />
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form style={{ marginTop: marginTopStyle }}>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Type`}</div>
                  <div className="account-field" width={8}>
                    <TypeDropdown className="type-dropdown" value={form.type} onChange={this.handleTypeChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Industry`}</div>
                  <div className="account-field" width={8}>
                    <IndustryDropdown
                      changeCloseOnDimmerClickParent={this.props.changeCloseOnDimmerClickParent}
                      overviewType={'ACCOUNT_INDUSTRY'}
                      onChange={this.handleIndustryChange}
                      value={form.industry}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Size`}</div>
                  <div className="account-field" width={8}>
                    <SizeDropdown className="type-dropdown" value={form.size} onChange={this.handleSizeChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Web`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.web || ''} onChange={this.handleWebChange} />
                  </div>
                </Form.Group>
                {this.props.formKey === '__EDIT' && (
                  <>
                    <Form.Group className="account-fields">
                      <div className="account-field-label">{_l`Budget`}</div>
                      <div className="account-field" width={8}>
                        <Input value={form.budget || ''} onChange={this.handleBudgetChange} />
                      </div>
                    </Form.Group>
                    <Form.Group className="account-fields">
                      <div className="account-field-label">{_l`Meeting goal per week`}</div>
                      <div className="account-field" width={8}>
                        <Input value={form.numberGoalsMeeting || ''} onChange={this.handleNumberGoalsMeetingChange} />
                      </div>
                    </Form.Group>
                  </>
                )}
              </Form>
            </div>
          </div>
          <div className="account-address-type">
            <div className="fields-group-left">
              <div
                className={`address-type-item ${addressType === 'visitingAddress' ? 'active' : ''}`}
                onClick={() => this.handleAddressType('visitingAddress')}
              >
                <span>{_l`Visiting address`}</span>
              </div>
              <div
                className={`address-type-item ${addressType === 'billingAddress' ? 'active' : ''}`}
                onClick={() => this.handleAddressType('billingAddress')}
              >
                <span>{_l`Billing address`}</span>
              </div>
              <div
                className={`address-type-item ${addressType === 'shippingAddress' ? 'active' : ''}`}
                onClick={() => this.handleAddressType('shippingAddress')}
              >
                <span>{_l`Shipping address`}</span>
              </div>
            </div>
          </div>
          <div className="account-fields-group" style={{ marginTop: '20px' }}>
            <div className="fields-group-left">
              <Form>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Street`}</div>
                  <div className="account-field" width={8}>
                    <Input value={street} onChange={this.handleStreetChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Zip code`}</div>
                  <div className="account-field" width={8}>
                    <Input value={zipCode} onChange={this.handleZipCodeChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`City`}</div>
                  <div className="account-field" width={8}>
                    <Input value={city} onChange={this.handleCityChange} />
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form className="position-clear">
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Region`}</div>
                  <div className="account-field" width={8}>
                    <Input id="inputRegionCompany" value={state} onChange={this.handleRegionChange} />
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Country`}</div>
                  <div className="account-field" width={8}>
                    <CountryDropdown
                      id="AccountCountryDropdown"
                      className={cx('position-clear', 'type-dropdown')}
                      onClick={() => {
                        calculatingPositionMenuDropdown('AccountCountryDropdown');
                      }}
                      fluid
                      value={country}
                      onChange={this.handleCountryChange}
                    />
                  </div>
                </Form.Group>
              </Form>
            </div>
          </div>

          <div className="account-form-header">
            <div className="fields-group-left">
              <div className="header-item">
                <span>{_l`Email`}</span>
              </div>
            </div>
          </div>

          <EmailPane formKey={this.props.formKey} emails={form.additionalEmailList || []} />

          <div className="account-form-header">
            <div className="fields-group-left">
              <div className="header-item">
                <span>{_l`Phone`}</span>
              </div>
            </div>
          </div>

          <PhonePane formKey={this.props.formKey} phones={form.additionalPhoneList || []} />
        </div>
        <div className={cssForm.customFieldForm}>
          <div className={cssForm.customFieldContent}>
            <CustomFieldPane
              noHeader
              object={form.uuid ? form : null}
              objectId={form.uuid}
              objectType={ObjectTypes.Account} />
          </div>

        </div>
      </div>
    );
  }
}

const mapStateProps = (state, { formKey }) => {
  const formCurrent = state.entities.organisation[formKey] || {};
  let participantsInit = formCurrent.participants;
  //init for create
  if (formKey != '__EDIT' && participantsInit==null) {
    participantsInit = [state.auth.userId];
  }
  return ({
    form: {...formCurrent, participants: participantsInit},
    imageData:
      state.entities.organisation.__UPLOAD && state.entities.organisation.__UPLOAD.dataURL
        ? state.entities.organisation.__UPLOAD.dataURL
        : null,
    errors: state.entities.organisation.__ERRORS,
  });
            };
export default connect(mapStateProps, { imageOnCropEnabled, update, uploadErrors })(CreateAccountForm);

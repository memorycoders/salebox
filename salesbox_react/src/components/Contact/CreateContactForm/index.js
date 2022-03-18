/* eslint-disable no-eval */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UserResponsibleDD from 'components/User/DropDown/UserResponsibleDD';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import CountryDropdown from '../../Organisation/CreateAccountForm/CountryDropdown';
import TypeDropdown from '../../Organisation/CreateAccountForm/TypeDropdown';
import IndustryDropdown from '../../Organisation/CreateAccountForm/IndustryDropdown';
import DiscProfileDropdown from './DiscProfileDropdown';
import RelationshipDropdown from './RelationshipDropdown';
import EmailPane from './EmailPane';
import PhonePane from './PhonePane';
import { update, imageOnCropEnabled, uploadErrors } from '../contact.actions';
import _l from 'lib/i18n';
import './styles.less';
import { Types } from 'Constants';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { calculatingPositionMenuDropdown, ObjectTypes } from '../../../Constants';
import cx from 'classnames';

addTranslations({
  'en-US': {
    'Contact photo': 'Contact photo',
    'First name': 'First name',
    'Last Name': 'Last Name',
    Behavior: 'Behavior',
    Phone: 'Phone',
    Email: 'Email',
    Street: 'Street',
    'Zip code': 'Zip code',
    City: 'City',
    Region: 'Region',
    Country: 'Country',
    Title: 'Title',
    Type: 'Type',
    Industry: 'Industry',
    Relation: 'Relation',
    Relationship: 'Relationship',
    Account: 'Account',
    General: 'General',
    Responsible: 'Responsible',
  },
});

class CreateContactForm extends React.PureComponent {
  createUpdateHandler = (key, value) => {
    const { formKey } = this.props;
    if (key === 'firstName' || key === 'lastName') {
      this.props.uploadErrors({ [key]: null });
    }
    this.props.update(formKey, { [key]: value });
  };

  handleOrganisationChange = (event, { value }) => {
    this.createUpdateHandler('organisationId', value);
    const organisation = this.props.organisations[value] || {};
    const { street, state, zipCode, city, country } = organisation;
    ['street', 'state', 'zipCode', 'city', 'country'].forEach((e) => {
      if (e === 'state' && eval(e)) {
        this.createUpdateHandler('region', eval(e));
      }
      if (eval(e)) {
        this.createUpdateHandler(e, eval(e));
      }
    });
  };

  handleStreetChange = (event, { value }) => {
    this.createUpdateHandler('street', value);
  };

  handleZipCodeChange = (event, { value }) => {
    this.createUpdateHandler('zipCode', value);
  };

  handleCityChange = (event, { value }) => {
    this.createUpdateHandler('city', value);
  };

  handleRegionChange = (event, { value }) => {
    this.createUpdateHandler('region', value);
  };

  handleCountryChange = (event, { value }) => {
    this.createUpdateHandler('country', value);
  };

  handleFirstNameChange = (event, { value }) => {
    this.createUpdateHandler('firstName', value);
  };

  handleLastNameChange = (event, { value }) => {
    this.createUpdateHandler('lastName', value);
  };

  handleTitleChange = (event, { value }) => {
    this.createUpdateHandler('title', value);
  };

  handleDiscProfileChange = (event, { value }) => {
    this.createUpdateHandler('discProfile', value);
  };

  handleTypeChange = (event, { value }) => {
    this.createUpdateHandler('type', value);
  };

  handleIndustryChange = (event, { value }) => {
    this.createUpdateHandler('industry', value);
  };

  handleRelationChange = (event, { value }) => {
    this.createUpdateHandler('relation', value);
  };

  handleRelationShipChange = (event, { value }) => {
    this.createUpdateHandler('relationship', value);
  };

  _handleAvatar = () => {
    const _this = this;
    document.getElementById('contact-field-photo').click();
    document.getElementById('contact-field-photo').onchange = function() {
      if (this.files && this.files.length) {
        _this.props.imageOnCropEnabled(this.value, this.files[0]);
      }
    };
  };


  handleResponsibleChange = (event, { value }) => {
    this.createUpdateHandler('participants', value);
  };

  render() {
    const marginTopStyle = this.props.formKey === '__EDIT' ? '0px' : '10px';
    const { form, imageData, errors } = this.props;
    const { avatar } = form;
    const avatarUrl = avatar
      ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`
      : null;
    return (
      <div className={cssForm.containerTaskForm}>
        <div className={`position-unset account-form ${cssForm.normalForm}`}>
          <div className="account-fields-group">
            <div className="fields-group-left">
              <Form className="position-unset">
                <Form.Group className="account-fields">
                  <div className="account-field-label __account">{_l`Contact photo`}</div>
                  <div className="account-field" width={8}>
                    <Image
                      src={imageData ? imageData : avatarUrl ? avatarUrl : '/square-image.png'}
                      size="tiny"
                      circular
                      onClick={() => this._handleAvatar()}
                    />
                    <input type="file" id="contact-field-photo" style={{ display: 'none' }} />
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
                        id="user-dropdown-contact"
                        value={form.participants}
                        _onChange={this.handleResponsibleChange}
                        className="user-dropdown-multi"
                      />
                      <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
                    </div>
                  </Form.Group>
                {/*)}*/}
                {this.props.overview !== 'CONTACT_ADD_COLLEAGUE' && (
                  <Form.Group className="account-fields">
                    <div className="account-field-label">{_l`Company`}</div>
                    <div className="account-field" width={8}>
                      <OrganisationDropdown
                        colId="contact-form-organisation"
                        value={form.organisationId || null}
                        onChange={this.handleOrganisationChange}
                      />
                      <span className="form-errors">{null}</span>
                    </div>
                  </Form.Group>
                )}
                <Form.Group className="account-fields">
                  <div className="account-field-label">
                    {_l`First name`}
                    <span className="required">*</span>
                  </div>
                  <div className="account-field" width={8}>
                    <Input value={form.firstName || ''} onChange={this.handleFirstNameChange} />
                    <span className="form-errors">{(errors && errors.firstName) || null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">
                    {_l`Last Name`}
                    <span className="required">*</span>
                  </div>
                  <div className="account-field" width={8}>
                    <Input value={form.lastName || ''} onChange={this.handleLastNameChange} />
                    <span className="form-errors">{(errors && errors.lastName) || null}</span>
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form style={{ marginTop: marginTopStyle }}>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Street`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.street || ''} onChange={this.handleStreetChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Zip code`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.zipCode || ''} onChange={this.handleZipCodeChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`City`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.city || ''} onChange={this.handleCityChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Region`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.region || ''} onChange={this.handleRegionChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Country`}</div>
                  <div className="account-field" width={8}>
                    <CountryDropdown
                      value={form.country}
                      onChange={this.handleCountryChange}
                      className="type-dropdown"
                    />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
              </Form>
            </div>
          </div>

          <div className="account-form-header">
            <div className="fields-group-left">
              <div className="header-item">
                <span>{_l`General`}</span>
              </div>
            </div>
          </div>

          <div className="account-fields-group">
            <div className="fields-group-left">
              <Form className="position-unset" style={{ marginTop: '20px' }}>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Title`}</div>
                  <div className="account-field" width={8}>
                    <Input value={form.title || ''} onChange={this.handleTitleChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Behavior`}</div>
                  <div className="account-field" width={8}>
                    <DiscProfileDropdown value={form.discProfile} onChange={this.handleDiscProfileChange} />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Type`}</div>
                  <div className="account-field" width={8}>
                    <TypeDropdown
                      upward={false}
                      className={cx('position-clear', 'type-dropdown')}
                      id="CreateContactTypeDropdown"
                      onClick={() => calculatingPositionMenuDropdown('CreateContactTypeDropdown')}
                      value={form.type}
                      onChange={this.handleTypeChange}
                    />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
              </Form>
            </div>
            <div className="fields-group-right">
              <Form className="position-unset" style={{ marginTop: '20px' }}>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Industry`}</div>
                  <div className="account-field" width={8}>
                    <IndustryDropdown
                      changeCloseOnDimmerClickParent={this.props.changeCloseOnDimmerClickParent}
                      upward={false}
                      className="position-clear"
                      id="CreateContactIndustryDropdown"
                      onClick={() => calculatingPositionMenuDropdown('CreateContactIndustryDropdown')}
                      onChange={this.handleIndustryChange}
                      type="TYPE"
                      value={form.industry}
                    />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Position`}</div>
                  <div className="account-field" width={8}>
                    <TypeDropdown
                      upward={false}
                      className={cx('type-dropdown', 'position-clear')}
                      id="CreateContactRelationDropdown"
                      onClick={() => calculatingPositionMenuDropdown('CreateContactRelationDropdown')}
                      type={Types.Contact}
                      value={form.relation}
                      onChange={this.handleRelationChange}
                    />
                    <span className="form-errors">{null}</span>
                  </div>
                </Form.Group>
                <Form.Group className="account-fields">
                  <div className="account-field-label">{_l`Relationship`}</div>
                  <div className="account-field" width={8}>
                    <RelationshipDropdown onChange={this.handleRelationShipChange} value={form.relationship} />
                    <span className="form-errors">{null}</span>
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
              objectType={ObjectTypes.Contact}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateProps = (state, { formKey, isGlobal}) => {
  const formCurrent = state.entities.contact[formKey] || {};
  let participantsInit = formCurrent.participants;
  //init for create
  if (formKey != '__EDIT' && participantsInit==null) {
    participantsInit = [state.auth.userId];
  }
  return ({
    form: {...formCurrent, participants: participantsInit},
    imageData: state.entities.contact.__UPLOAD ? state.entities.contact.__UPLOAD.dataURL : null,
    errors: state.entities.contact.__ERRORS,
    organisations: state.entities.organisationDropdown,

  });
              };
export default connect(mapStateProps, { update, imageOnCropEnabled, uploadErrors })(CreateContactForm);

import React, { Component } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import css from './FormAddNewMailchimpList.css';
import * as OverviewActions from '../../Overview/overview.actions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { Form } from 'semantic-ui-react';
import CountryDropdown from '../../Country/CountryDropdown';
import api from '../../../lib/apiClient';
import { Endpoints, OverviewTypes, calculatingPositionMenuDropdown } from '../../../Constants';
import isEmail from 'lib/isEmail';
import isValidPhone from 'lib/isValidPhone';
import * as TaskActions from '../../Task/task.actions';
import cx from 'classnames';
import { cachingCommonDataStorage } from '../../Common/common.actions';

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Done: 'Done',
    'List name': 'List name',
    'From email': 'From email',
    'From name': 'From name',
    Reminder: 'Reminder',
    Company: 'Company',
    Address: 'Address',
    City: 'City',
    State: 'State',
    Country: 'Country',
    Phone: 'Phone',
    'List name is required': 'List name is required',
    'From email is required': 'From email is required',
    'From name is required': 'From name is required',
    'From email is invalid': 'From email is invalid',
    'Reminder is required': 'Reminder is required',
    'Address is required': 'Address is required',
    'City is required': 'City is required',
    'State is required': 'State is required',
    'Country is required': 'Country is required',
    'Postal code is required': 'Postal code is required',
  },
});

class FormAddNewMailchimpList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      apikey: '',
      errors: {
        listName: false,
        email: false,
        fromName: false,
        reminder: false,
        company: false,
        address: false,
        city: false,
        state: false,
        country: false,
        zip: false,
        phone: false,
        invalidEmail: false,
      },
      values: {
        listName: '',
        email: '',
        fromName: '',
        reminder: '',
        company: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
      },
    };
  }

  async componentDidMount() {}

  async componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      try {
        const { commonDataStorage, defaultListContact } = this.props;
        let apikey = '';
        if (Object.keys(commonDataStorage).length === 0) {
          await this.setState({ isLoading: true });
          const res = await api.get({
            resource: `${Endpoints.Enterprise}/storage/list`,
          });
          await this.setState({ isLoading: false });
          const { storageDTOList } = res;
          const mailchimpWebTokenIndex = storageDTOList.findIndex((value) => value.type === 'MAIL_CHIMP_WEB_TOKEN');
          if (mailchimpWebTokenIndex !== -1) {
            apikey = storageDTOList[mailchimpWebTokenIndex].value;
            this.setState({ apikey: apikey });
          }
          if (Object.keys(defaultListContact).length === 0) {
            const dataDefaultContact = await api.get({
              resource: `${Endpoints.Campaign}/mailChimp/getDefaultListContact`,
              query: {
                apikey: apikey,
              },
            });
            if (dataDefaultContact) {
              this.setState({
                values: {
                  listName: '',
                  email: dataDefaultContact.result.email || '',
                  fromName: dataDefaultContact.result.lastName || '',
                  reminder: '',
                  company: dataDefaultContact.result.contact.company || '',
                  address: dataDefaultContact.result.contact.address1 || '',
                  city: dataDefaultContact.result.contact.city || '',
                  state: dataDefaultContact.result.contact.state || '',
                  country: dataDefaultContact.result.contact.country || '',
                  zip: dataDefaultContact.result.contact.zip || '',
                  phone: dataDefaultContact.result.contact.phone || '',
                },
              });
            }

            this.props.cachingCommonDataStorage({ storageList: res, defaultListContact: dataDefaultContact });
          }
        } else {
          const { storageDTOList } = commonDataStorage;
          const mailchimpWebTokenIndex = storageDTOList.findIndex((value) => value.type === 'MAIL_CHIMP_WEB_TOKEN');
          if (mailchimpWebTokenIndex !== -1) {
            apikey = storageDTOList[mailchimpWebTokenIndex].value;
            this.setState({ apikey: apikey });
          }
          if (defaultListContact) {
            this.setState({
              values: {
                listName: '',
                email: defaultListContact.result.email || '',
                fromName: defaultListContact.result.lastName || '',
                reminder: '',
                company: defaultListContact.result.contact.company || '',
                address: defaultListContact.result.contact.address1 || '',
                city: defaultListContact.result.contact.city || '',
                state: defaultListContact.result.contact.state || '',
                country: defaultListContact.result.contact.country || '',
                zip: defaultListContact.result.contact.zip || '',
                phone: defaultListContact.result.contact.phone || '',
              },
            });
          }
        }
      } catch (e) {}
    }
  }
  handleChangeValue = (e) => {
    let target = e.target;
    let targetName = e.target.name;
    this.setState({
      errors: { ...this.state.errors, [targetName]: false, invalidEmail: false },
      values: { ...this.state.values, [targetName]: target.value },
    });
  };

  hanldeChangeCountry = (e, { value }) => {
    this.setState({
      errors: { ...this.state.errors, country: false },
      values: { ...this.state.values, country: value },
    });
  };
  hideFormAddFocus = () => {
    const { clearHighlight, overviewType } = this.props;
    clearHighlight(overviewType);
    this.setState({
      values: {
        listName: '',
        email: '',
        fromName: '',
        reminder: '',
        company: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
      },
      errors: {
        listName: false,
        email: false,
        fromName: false,
        reminder: false,
        company: false,
        address: false,
        city: false,
        state: false,
        country: false,
        zip: false,
        phone: false,
      },
    });
  };

  validateInput = () => {
    let arrayValues = Object.keys(this.state.values);

    for (let i = 0; i < arrayValues.length; i++) {
      if (arrayValues[i] !== 'phone' && this.state.values[arrayValues[i]].trim().length <= 0) {
        this.setState({ errors: { ...this.state.errors, [arrayValues[i]]: true } });
        return false;
      }
    }
    // arrayValues.forEach((element) => {
    //   if (element !== 'phone' && this.state.values[element].trim().length <= 0) {
    //     // this.setState({ errors: { ...this.state.errors, [element]: true } });
    //     return false;
    //   }
    // });

    if (!isEmail(this.state.values.email)) {
      this.setState({ errors: { ...this.state.errors, invalidEmail: true } });
      return false;
    }

    return true;
  };

  onSave = () => {
    const { addMailchimp } = this.props;
    let { values } = this.state;
    if (this.validateInput()) {
      let dataMailchimp = {
        apikey: this.state.apikey,
        params: {
          campaignDefaults: {
            fromEmail: values.email,
            fromName: values.fromName,
            language: localStorage.getItem('language') || 'en',
            subject: '',
          },
          contact: {
            address1: values.address,
            city: values.city,
            company: values.company,
            country: values.country,
            phone: values.phone,
            state: values.state,
            zip: values.zip,
          },
          emailTypeOption: true,
          name: values.listName,
          permissionReminder: values.reminder,
          useArchiveBar: true,
        },
      };

      addMailchimp(dataMailchimp);
    } else {
    }
  };

  render() {
    const { visible } = this.props;
    let { errors, values, isLoading } = this.state;
    return (
      <ModalCommon
        title={_l`Add list`}
        visible={visible}
        cancelLabel={_l`Cancel`}
        okLabel={_l`Done`}
        onDone={this.onSave}
        onClose={this.hideFormAddFocus}
        scrolling={true}
        className={css.addMailchimpModal}
      >
        <Form className="position-unset">
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`List name`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.listName}
                onChange={this.handleChangeValue}
                name="listName"
                value={values.listName}
                loading={isLoading}
                className={css.inputField}
              />
              <span className="form-errors">{errors.listName && _l`List name is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`From email`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                type="email"
                error={errors.email || errors.invalidEmail}
                onChange={this.handleChangeValue}
                name="email"
                value={values.email}
                loading={isLoading}
              />
              <span className="form-errors">{errors.email && _l`From email is required`}</span>
              <span className="form-errors">{errors.invalidEmail && _l`From email is invalid`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`From name`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.fromName}
                onChange={this.handleChangeValue}
                name="fromName"
                value={values.fromName}
                loading={isLoading}
              />
              <span className="form-errors">{errors.fromName && _l`From name is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Reminder`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.reminder}
                onChange={this.handleChangeValue}
                name="reminder"
                value={values.reminder}
                loading={isLoading}
              />
              <span className="form-errors">{errors.reminder && _l`Reminder is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Company`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.company}
                onChange={this.handleChangeValue}
                name="company"
                value={values.company}
                loading={isLoading}
              />
              <span className="form-errors">{errors.company && _l`Company is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Address`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.address}
                onChange={this.handleChangeValue}
                name="address"
                value={values.address}
                loading={isLoading}
              />
              <span className="form-errors">{errors.address && _l`Address is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`City`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.city}
                onChange={this.handleChangeValue}
                name="city"
                value={values.city}
                loading={isLoading}
              />
              <span className="form-errors">{errors.city && _l`City is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`State`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.state}
                onChange={this.handleChangeValue}
                name="state"
                value={values.state}
                loading={isLoading}
              />
              <span className="form-errors">{errors.state && _l`State is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Country`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <CountryDropdown
                className={cx('position-clear', 'type-dropdown')}
                id="countryDropdownAddMailchimp"
                onClick={() => {
                  calculatingPositionMenuDropdown('countryDropdownAddMailchimp');
                }}
                error={errors.country}
                loading={isLoading}
                onChange={this.hanldeChangeCountry}
              />
              <span className="form-errors">{errors.country && _l`Country is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Postal code`}
              <span className={cssForm.required}>*</span>
            </div>
            <div className={css.inputWraper}>
              <Form.Input
                error={errors.zip}
                onChange={this.handleChangeValue}
                name="zip"
                value={values.zip}
                loading={isLoading}
              />
              <span className="form-errors">{errors.zip && _l`Postal code is required`}</span>
            </div>
          </Form.Group>
          <Form.Group>
            <div className={cx(cssForm.label, css.label)} width={6}>
              {_l`Phone`}
            </div>
            <div className={css.inputWraper}>
              <Form.Input onChange={this.handleChangeValue} name="phone" value={values.phone} loading={isLoading} />
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
    );
  }
}

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'addNewMailchimp');
  return {
    visible,
    commonDataStorage: state.common.__DATA_STORAGE,
    defaultListContact: state.common.__DEFAULT_LIST_CONTACT,
  };
};
export default connect(mapStateToProps, {
  clearHighlight: OverviewActions.clearHighlightAction,
  addMailchimp: TaskActions.addMailchimp,
  cachingCommonDataStorage,
  // saveMailchimp: FocusActions.saveFocus,
})(FormAddNewMailchimpList);

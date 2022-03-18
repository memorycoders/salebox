/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import React, { Component } from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import UserDropdown from 'components/User/UserDropdown';

import '../Appointment/AppointmentForm/appointmentForm.less';
import RecruitmentCaseDropdown from '../Recruitment/RecruitmentClosed/RecruitmentCaseDropDown';
import { connect } from 'react-redux';
import ContactDropdown from 'components/Contact/ContactDropdown';
import * as OverviewActions from '../Overview/overview.actions.js';
import AddRecruitmentModal from './RecruitmentClosed/AddRecruitmentModal';
import { getFormValues } from 'redux-form';
import { diff } from 'date-arithmetic';

// import './campaign.less';

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Campaign name': 'Campaign name',
    Units: 'Units',
    Users: 'Users',
    Start: 'Start',
    End: 'End',
    'Sales target': 'Sales target',
    'Product group': 'Product group',
    Products: 'Products',
  },
});

export class CandidateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overviewType: props.overviewType,
      contactId: [],
      recruitmentCaseId: '',
      userList: [props.userId],
      errors: {},
      visibleAddRecruitment: false,
    };

    props.setParams(this.state);
  }

  componentDidMount() {
    if (this.props.hightlightAction === 'copy' || this.props.hightlightAction === 'update') {
      this.setState({
        recruitmentCaseId: this.props.currentRC,
        contactId: [this.props.candidate.contactId],
        userList: this.props.responsibles,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('???', nextProps, this.props)
    if (nextProps.errors !== this.props.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.listRC !== this.props.listRC) {
      var arrayOne = nextProps.listRC;

      var arrayTwo = this.props.listRC;

      var difference = arrayOne?.filter((e) => !arrayTwo?.some((element) => e?.uuid === element?.uuid));
      if (this.props.hightlightAction !== 'copy') {
        this.setState({ ...this.state, recruitmentCaseId: difference[0]?.uuid });
      } else {
      }
    }
    if (nextProps.responsibles !== this.props.responsibles) {
      this.setState({
        userList: nextProps.responsibles,
      });
    }
    // if (nextProps.listContact !== this.props.listContact) {
    //   var arrayOne = nextProps.listContact;

    //   var arrayTwo = this.props.listContact;

    //   console.log('listCC', newObj, arrayOne, arrayTwo);
    //   // this.setState({ ...this.state, contactId: difference[0]?.uuid });
    // }
    if(nextProps.__CREATE !== this.props.__CREATE) {
      this.setState({
        contactId: [...this.state.contactId, nextProps.__CREATE.contactId]
      })
    }
  }

  onChange = (field, value, callBack) => {
    this.setState({ [field]: value }, () => {
      callBack && callBack();
    });
  };

  _handeUnitChange = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ unitList: value, errors: { ...errors, unitList: null } });
  };
  handleContactChange = ({ update, formKey }) => (event: Event, { value: contacts }) => {
    update('__ERRORS', { contact: null });
    if (contacts)
      update(formKey, {
        contacts: contacts.filter((e) => e !== null),
      });
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState !== this.state) {
      this.props.setParams(this.state);
    }
  }

  _handleChangeUser = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ userList: value, errors: { ...errors, userList: null } });
  };

  _handleChangeContact = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ contactId: value, errors: { ...errors, contactId: [] } });
  };

  handleChangeCurrentRC = (e, { value }) => {
    const { errors } = this.setState;
    this.setState({ recruitmentCaseId: value, errors: { ...errors, recruitmentCaseId: null } });
  };
  addRecruitment = () => {
    // this.props.setActionForHighlight(OverviewTypes.RecruitmentClosed, 'createRecruitment');
    this.setState({ ...this.state, visibleAddRecruitment: true });
  };
  closeAddRecruitment = () => {
    this.setState({ ...this.state, visibleAddRecruitment: false });
  };

  render() {
    const { errors, userList, overviewType, contactId, recruitmentCaseId, listRC } = this.state;

    return (
      <div className="appointment-add-form">
        <Form className="position-unset">
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Responsible`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <UserDropdown
                className="user-dropdown product-dropdown-wrapper"
                onChange={this._handleChangeUser}
                value={userList}
                multiple
                // participantOpts={participantOpts}
                // error={errors && errors.participantList && participantOpts.length <= 0 ? true : false}
                onLabelClick={this._handleLabelClick}
              />
              <span className="form-errors">{errors && errors.userList}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Case`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <RecruitmentCaseDropdown
                addLabel={`Add recruitment case`}
                overview={overviewType}
                onClickAdd={this.addRecruitment}
                fluid
                onChange={this.handleChangeCurrentRC}
                value={recruitmentCaseId}
              />
              <span className="form-errors">{errors && errors.recruitmentCaseId}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Candidate`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <ContactDropdown
                colId="appointment-form-contact"
                width={8}
                multiple
                addLabel={`Add new contact`}
                organisationId={null}
                onChange={this._handleChangeContact}
                error={errors.contact || false}
                // option={this.props.form_contacts || []}
                value={contactId}
              />
              <span className="form-errors">{errors && errors.contactId}</span>
            </div>
          </Form.Group>
        </Form>
        <AddRecruitmentModal onClose={this.closeAddRecruitment} visible={this.state.visibleAddRecruitment} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
  form_organisation: state.entities.recruitment[formKey].organisation || {},
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CandidateForm);

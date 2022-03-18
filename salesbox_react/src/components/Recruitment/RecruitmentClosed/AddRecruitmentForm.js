/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import React, { Component } from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import UserDropdown from 'components/User/UserDropdown';
import '../../Appointment/AppointmentForm/appointmentForm.less';
import RecruitmentCaseDropdown from '../../Recruitment/RecruitmentClosed/RecruitmentCaseDropDown';
import { connect } from 'react-redux';
import ContactDropdown from 'components/Contact/ContactDropdown';
import SaleProcessDropdown from './SaleProcessDropdown';

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

export class AddRecruitmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactId: '',
      recruitmentCaseId: '',
      userList: [],
      errors: {},
      values: {
        name: '',
        processId: '',
      },
    };

    props.setParams(this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.props.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  componentDidMount() {
    console.log('phong1', this.props)
    if (this.props.hightlightAction === 'copy' || this.props.hightlightAction === 'update') {
      this.setState({
        ...this.state,
        values: {
          name: this.props.currentRCName,
          processId: this.props.currentRCProcess,
        },
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState !== this.state) {
      this.props.setParams(this.state);
    }
  }

  handleChangeName = (e) => {
    this.setState({
      ...this.state,
      values: {
        ...this.state.values,
        name: e.target.value,
      },
    });
  };
  handleChangeProcess = (e, { value }) => {
    this.setState({
      ...this.state,
      values: {
        ...this.state.values,
        processId: value,
      },
    });
  };
  render() {
    const { errors } = this.state;
    return (
      <div className="appointment-add-form">
        <Form className="position-unset">
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Name`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={this.state.values.name} onChange={this.handleChangeName} />
              <span className="form-errors">{errors && errors.name ? errors.name : null}</span>
            </div>
          </Form.Group>

          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Process`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper" width={8}>
              <SaleProcessDropdown value={this.state.values.processId} onChange={this.handleChangeProcess} />
              <span className="form-errors">{errors && errors.processId ? errors.processId : null}</span>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(AddRecruitmentForm);

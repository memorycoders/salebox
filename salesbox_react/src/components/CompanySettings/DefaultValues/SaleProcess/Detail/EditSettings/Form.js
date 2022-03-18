/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import _ from 'lodash';
import '../../../../../PipeLineUnqualifiedDeals/CreatePipelineForm/createPipelineForm.less';
import cssForm from '../../../../../Task/TaskForm/TaskForm.css';

class EditSettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: props.form || {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      this.setState({ form: this.props.form });
    }
  }

  _handleChange = (key, value) => {
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, [key]: value } }, () => {
      this.props.onChange(this.state.form);
    });
  };

  render() {
    const { form } = this.state;
    const { active } = this.props;
    return (
      <div style={{ display: 'flex' }} className="unqualified-add-form">
        <Form className={`position-unset ${cssForm.normalForm}`}>
          {active === 'hoursPerQuote' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Hours/quote`}</div>
              <div className="dropdown-wrapper">
                <Input
                  value={form.hoursPerQuote}
                  type={'number'}
                  onChange={(e, { value }) => this._handleChange('hoursPerQuote', value)}
                />
                <span className="form-errors">{null}</span>
              </div>
            </Form.Group>
          )}
          {active === 'hoursPerContract' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Hours/contract`}</div>
              <div className="dropdown-wrapper">
                <Input
                  value={form.hoursPerContract}
                  type={'number'}
                  onChange={(e, { value }) => this._handleChange('hoursPerContract', value)}
                />
                <span className="form-errors">{null}</span>
              </div>
            </Form.Group>
          )}
          {active === 'travellingHoursPerAppointment' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Travelling hours/appointment`}</div>
              <div className="dropdown-wrapper">
                <Input
                  value={form.travellingHoursPerAppointment}
                  type={'number'}
                  onChange={(e, { value }) => this._handleChange('travellingHoursPerAppointment', value)}
                />
                <span className="form-errors">{null}</span>
              </div>
            </Form.Group>
          )}
          {active === 'loseMeetingRatio' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Progress reduction`}</div>
              <div className="dropdown-wrapper">
                <Input
                  value={form.loseMeetingRatio}
                  type={'number'}
                  onChange={(e, { value }) => this._handleChange('loseMeetingRatio', value)}
                />
                <span className="form-errors">{null}</span>
              </div>
            </Form.Group>
          )}
          {active === 'notificationTime' && (
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Notification time`}</div>
              <div className="dropdown-wrapper">
                <Input
                  value={form.notificationTime}
                  type={'number'}
                  onChange={(e, { value }) => this._handleChange('notificationTime', value)}
                />
                <span className="form-errors">{null}</span>
              </div>
            </Form.Group>
          )}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, { form, errors }) => {
  return {
    form,
    userId: state.auth.userId,
    errors,
  };
};

export default connect(mapStateToProps, {})(EditSettingForm);

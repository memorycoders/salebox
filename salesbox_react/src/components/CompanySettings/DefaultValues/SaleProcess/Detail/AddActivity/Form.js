/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import _ from 'lodash';
import '../../../../../PipeLineUnqualifiedDeals/CreatePipelineForm/createPipelineForm.less';
import { calculatingPositionMenuDropdown } from '../../../../../../Constants';
import cssForm from '../../../../../Task/TaskForm/TaskForm.css';
import cx from 'classnames';
import DiscProfileDropdown from '../../../../../Contact/CreateContactForm/DiscProfileDropdown';

const charLeft = 140;
const maxChar = 140;

class CreateActivityForm extends React.Component {
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

  _handlename = (e, { value }) => {
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, name: value } }, () => {
      this.props.onChange(this.state.form);
      this.props.onErrors({ ...this.props.errors, name: null });
    });
  };

  _handleProgress = (e, { value }) => {
    if (value > 100) {
      return;
    }
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, progress: value } }, () => {
      this.props.onChange(this.state.form);
      this.props.onErrors({ ...this.props.errors, progress: null });
    });
  };

  _handleMeeting = (e, { value }) => {
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, meeting: value } }, () => {
      this.props.onChange(this.state.form);
    });
  };

  handleDiscProfileChange = (e, { value }) => {
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, discProfile: value } }, () => {
      this.props.onChange(this.state.form);
    });
  };

  _handleNoteChange = (e, { value }) => {
    if (value.length > 140) {
      return;
    }
    const obj = { ...this.state.form };
    this.setState({ form: { ...obj, description: value } }, () => {
      this.props.onChange(this.state.form);
    });
  };

  render() {
    const { form } = this.state;
    const { errors } = this.props;
    console.log('errors', errors);
    return (
      <div style={{ display: 'flex' }} className="unqualified-add-form">
        <Form className={`position-unset ${cssForm.normalForm}`}>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Name`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={form.name || ''} onChange={this._handlename} error={!!errors.name} style={{ fontSize: '11' }}/>
              <span className="form-errors">{errors.name || null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">
              {_l`Progress`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={form.progress || ''} type={'number'} min="1" max="100" onChange={this._handleProgress} style={{ fontSize: '11' }} />
              <span className="form-errors">{errors.progress || null}</span>
            </div>
          </Form.Group>
          {/* <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Meeting`}</div>
            <div className="dropdown-wrapper">
              <Input value={form.meeting || ''} type={'number'} onChange={this._handleMeeting} />
              <span className="form-errors">{null}</span>
            </div>
          </Form.Group> */}
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Behavior`}</div>
            <div className="dropdown-wrapper">
              <DiscProfileDropdown value={form.discProfile} onChange={this.handleDiscProfileChange}/>
              <span className="form-errors">{null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields position-relative">
            <div className="unqualified-label">{_l`Description`}</div>
            <div className="dropdown-wrapper">
              <TextArea
                size="small"
                rows={5}
                maxLength={maxChar + 1}
                onChange={this._handleNoteChange}
                className="unqualified-area"
                value={form.description || ''}
              />
              <span className={cssForm.spanNote}>{140 - ((form.description && form.description.length) || 0)}</span>
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
    errors,
  };
};

export default connect(mapStateToProps, {})(CreateActivityForm);

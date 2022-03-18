/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import css from '../../../Task/EditTaskModal/EditTaskModal.css';
import CreatePipelineForm from './LeadForm';

class CreatePipelineModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: props.form,
      errors: {},
    };
  }

  hideEditForm = () => {
    this.props.onClose();
  };

  onSave = async () => {
    const { form } = this.state;
    const { priority } = form;
    if (!priority) {
      this.setState({ errors: { priority: _l`Priority is required` } });
    }
    if (priority) {
      this.props.onDone({ ...form, user: form.user });
    }
  };

  onChange = (obj) => {
    this.setState({ form: obj });
  };

  onErrors = (obj) => {
    this.setState({ errors: obj });
  };

  render() {
    const { visible } = this.props;
    console.log('this.state', this.state);
    return (
      <React.Fragment>
        <ModalCommon
          title={_l`Add prospect`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          className={css.editTaskModal}
          okLabel={_l`Save`}
          scrolling={true}
        >
          <CreatePipelineForm
            onChange={this.onChange}
            errors={this.state.errors}
            form={this.state.form}
            onErrors={this.onErrors}
          />
        </ModalCommon>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state, { visible, form }) => {
  return {
    form,
    user: state.auth.user,
    visible,
  };
};

export default connect(mapStateToProps, {})(CreatePipelineModal);

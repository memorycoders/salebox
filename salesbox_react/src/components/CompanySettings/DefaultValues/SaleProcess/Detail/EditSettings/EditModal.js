/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import ModalCommon from '../../../../../ModalCommon/ModalCommon';
import CreateActivityForm from './Form';

class EditSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: props.form,
      errors: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.form !== this.props.form) {
      setTimeout(() => {
        this.setState({ form: this.props.form });
      }, 100);
    }
  }

  hideEditForm = () => {
    this.props.onClose();
  };

  onSave = async () => {
    const { form } = this.state;
    this.props.onDone({ ...form });
  };

  onChange = (obj) => {
    this.setState({ form: obj });
  };

  onErrors = (obj) => {
    this.setState({ errors: obj });
  };

  render() {
    const { visible, active } = this.props;
    const { form } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={this.props.label}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          // className={css.editTaskModal}
          size="small"
          okLabel={_l`Save`}
          scrolling={false}
          description={false}
        >
          <CreateActivityForm form={form} onChange={this.onChange} active={active} />
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

export default connect(mapStateToProps, {})(EditSettingsModal);

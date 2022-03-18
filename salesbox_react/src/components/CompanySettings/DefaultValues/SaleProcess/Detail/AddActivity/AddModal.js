/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import ModalCommon from '../../../../../ModalCommon/ModalCommon';
import css from '../../../../../Task/EditTaskModal/EditTaskModal.css';
import CreateActivityForm from './Form';

class AddActivityModal extends React.Component {
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
    const { name, progress } = form;
    const { errors } = this.state;
    const newErros = { ...errors };
    if (!name) {
      newErros.name = _l`Name is required`;
    }
    if (!progress) {
      newErros.progress = _l`Progress is required`;
    }
    this.setState({ errors: newErros });
    if (name && progress) {
      if (this.props.modeAdd) {
        this.props.onDone({ ...form, saleMethodId: this.props.uuid });
      } else {
        this.props.onDone({ ...form });
      }
    }
  };

  onChange = (obj) => {
    this.setState({ form: obj });
  };

  onErrors = (obj) => {
    this.setState({ errors: obj });
  };

  render() {
    const { visible, modeAdd } = this.props;
    const { form, errors } = this.state;
    return (
      <React.Fragment>
        <ModalCommon
          title={modeAdd ? _l`Add activity` : _l`Edit activity`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.hideEditForm}
          // className={css.editTaskModal}
          size="small"
          okLabel={_l`Save`}
          scrolling={false}
          description={false}
        >
          <CreateActivityForm form={form} onChange={this.onChange} errors={errors} onErrors={this.onErrors} />
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

export default connect(mapStateToProps, {})(AddActivityModal);

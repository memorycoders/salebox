/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import TaskForm from 'components/Task/TaskForm/TaskForm';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { clearHighlight } from 'components/Overview/overview.actions';
import { updateEntityFetch, clearErrors, createError } from 'components/Task/task.actions';
import { Message } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { getTaskErros } from '../task.selector';
import css from './EditTaskModal.css';
import FormAddCategory from '../../Category/FormAddCategory';

addTranslations({
  'en-US': {
    'Edit reminder': 'Edit reminder',
    Cancel: 'Cancel',
    Save: 'Save',
    'Focus is required': 'Focus is required',
  },
});

class EditTaskModal extends React.Component {
  constructor(props) {
    super(props);
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
    this.props.clearErrors();
  };

  onSave = () => {
    const { form, overviewType } = this.props;
    if (form && (!form.focusWorkData || (form.focusWorkData && form.focusWorkData.uuid === null))) {
      return this.props.createError({ focusWorkData: _l`Focus is required` });
    }
    this.props.updateEntityFetch(overviewType);
  };

  render() {
    const { visible, task, overviewType } = this.props;
    return (
      <ModalCommon
        title={_l`Update reminder`}
        visible={visible}
        className={css.editTaskModal}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        okLabel={_l`Save`}
        scrolling={true}
      >
        <TaskForm form={task} formKey="__EDIT" overviewType={overviewType} />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'edit');
  return {
    visible,
    form: state.entities.task.__EDIT || {},
    errors: getTaskErros(state),
  };
};

export default connect(mapStateToProps, { clearHighlight, createError, updateEntityFetch, clearErrors })(EditTaskModal);

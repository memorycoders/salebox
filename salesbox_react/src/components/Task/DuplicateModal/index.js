/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { createEntityFetch, clearCreateEntity, createError } from '../../Task/task.actions';
import { error } from '../../Notification/notification.actions';
import { getTaskErros } from '../task.selector';
import { OverviewTypes } from 'Constants';
import TaskForm from '../../Task/TaskForm/TaskForm';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../EditTaskModal/EditTaskModal.css';

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Focus is required': 'Focus is required',
    'Copy reminder': 'Copy reminder',
  },
});

class DuplicateModal extends React.Component {
  constructor(props) {
    super(props);
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
    this.props.clearCreateEntity();
  };

  onSave = () => {
    const { form, overviewType } = this.props;
    if (form && (!form.focusWorkData || (form.focusWorkData && form.focusWorkData.uuid === null))) {
      return this.props.createError({ focusWorkData: _l`Focus is required` });
    }
    this.props.createEntityFetch(overviewType);
  };

  render() {
    const { visible, hideAccount } = this.props;
    return (
      <ModalCommon
        title={_l`Copy reminder`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        className={css.editTaskModal}
        okLabel={_l`Save`}
        scrolling={true}
      >
        {/* {errors && errors.response && (
          <Message negative>
            <p>{errors.response}</p>
          </Message>
        )} */}
        <TaskForm formKey="__CREATE" overviewType={hideAccount} />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'duplicate');
  return {
    form: state.entities.task.__CREATE || {},
    visible,
    errors: getTaskErros(state),
  };
};

export default connect(mapStateToProps, { clearHighlight, createEntityFetch, error, clearCreateEntity, createError })(
  DuplicateModal
);

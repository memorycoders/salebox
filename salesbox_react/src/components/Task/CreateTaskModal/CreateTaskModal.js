/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { clearHighlight } from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { createEntityFetch, clearCreateEntity, createError, clearErrors } from 'components/Task/task.actions';
import { Message } from 'semantic-ui-react';
import { error } from '../../Notification/notification.actions';
import { getTaskErros } from '../task.selector';
import { OverviewTypes, OverviewColors } from 'Constants';
import TaskForm from 'components/Task/TaskForm/TaskForm';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from '../EditTaskModal/EditTaskModal.css';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Add reminder': 'Add reminder',
    'Focus is required': 'Focus is required',
  },
});

class CreateTaskModal extends React.Component {
  constructor(props) {
    super(props);
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
    this.props.clearCreateEntity();
    this.props.clearErrors();
  };

  onSave = () => {
    const { form, overviewType } = this.props;
    if (form && (!form.focusWorkData || (form.focusWorkData && form.focusWorkData.uuid === null))) {
      return this.props.createError({ focusWorkData: _l`Focus is required` });
    }
    this.props.createEntityFetch(overviewType);
  };

  render() {
    const { visible, hideLead, isGlobal, customField } = this.props;
    return (
      <ModalCommon
        title={_l`Add reminder`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        className={customField.length > 0 ? css.modalCustomField : css.editTaskModal}
        okLabel={_l`Save`}
        scrolling={true}
        rightCustomfield
      >
        {/* {errors && errors.response && (
          <Message negative>
            <p>{errors.response}</p>
          </Message>
        )} */}
        <TaskForm formKey="__CREATE" hideLead={hideLead} isGlobal={isGlobal} />
      </ModalCommon>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const customField = getCustomFieldsObject(state);
  return {
    customField,
    color: OverviewColors[state.ui.app.activeOverview],
    form: state.entities.task.__CREATE || {},
    visible,
    errors: getTaskErros(state),
  };
};

export default connect(mapStateToProps, {
  clearHighlight,
  createEntityFetch,
  clearCreateEntity,
  createError,
  clearErrors,
  error,
})(CreateTaskModal);

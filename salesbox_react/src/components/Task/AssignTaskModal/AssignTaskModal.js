/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import AssignTaskForm from 'components/Task/AssignTaskForm/AssignTaskForm';
import ModalCommon from '../../ModalCommon/ModalCommon';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import * as TaskActions from 'components/Task/task.actions';
import { makeGetTask } from '../task.selector';
import css from '../Delegation.css';

type PropsT = {
  task: {},
  visible: boolean,
  hideAssignForm: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Delegate: 'Delegate',
    Cancel: 'Cancel',
    Done: 'Done',
  },
});

const AssignTaskModal = ({ task, visible, hideAssignForm, onSave, onChange }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Delegate`}
      visible={visible}
      onDone={onSave}
      onClose={hideAssignForm}
      size="small"
      scrolling={false}
      description={false}
    >
      <AssignTaskForm task={task} onChange={onChange} />
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assign');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      task: getTask(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    delegateTask: TaskActions.delegateTask,
  }),
  withState('owner', 'setOnwer', null),
  withHandlers({
    hideAssignForm: ({ clearHighlight, task, overviewType }) => () => {
      clearHighlight(overviewType, task.uuid);
    },
    onSave: ({ task, delegateTask, overviewType, owner }) => () => {
      delegateTask(owner, task.uuid, overviewType);
    },
    onChange: (props) => (data) => {
      props.setOnwer(data);
    },
  })
)(AssignTaskModal);

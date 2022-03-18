//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ConfirmationDialog from 'components/ConfirmationDialog/ConfirmationDialog';
import { makeGetTask } from '../task.selector';
import ModalCommon from "../../ModalCommon/ModalCommon";
import * as TaskActions from 'components/Task/task.actions';

type PropsT = {
  task: {},
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
  },
});

const AssignTaskToMeModal = ({ task, visible, onClose, onSave }: PropsT) => {
  return (
    <>
{/*    <ConfirmationDialog
      title={_l`Assign task?`}
      yesLabel={_l`Yes, assign to me`}
      noLabel={_l`No, don't assign to me`}
      visible={visible}
      onClose={onClose}
      onSave={onSave}
    >
      <Container text>{_l`Are you sure you want to assign this task to yourself?`}</Container>
    </ConfirmationDialog>
    */}
  <ModalCommon title={_l`Confirm`} visible={visible} onDone={onSave} onClose={onClose} size="tiny" paddingAsHeader={true}>
    <p>{_l`Are you sure you want to assign this reminder?`}</p>
  </ModalCommon>
    </>

);
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignToMe');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      task: getTask(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default compose(
  connect(
    makeMapStateToProps,
    {
      clearHighlight: OverviewActions.clearHighlightAction,
      assignToMe: TaskActions.assignToMe
    }
  ),
  withHandlers({
    onClose: ({ task, clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ task, overviewType, assignToMe }) => () => {
      assignToMe( task.uuid, overviewType,);
    },
  })
)(AssignTaskToMeModal);

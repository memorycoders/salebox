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
import ModalCommon from '../../ModalCommon/ModalCommon';
import * as TaskActions from 'components/Task/task.actions';
import { changeOnMutilTaskMenu } from '../task.actions';

type PropsT = {
  task: {},
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
  },
});

const AssignMultiTaskToMeModal = ({ task, visible, onClose, onSave }: PropsT) => {
  return (
    <>
      <ModalCommon
        title={_l`Confirm`}
        visible={visible}
        onDone={onSave}
        onClose={onClose}
        size="tiny"
        paddingAsHeader={true}
      >
        <p>{_l`Are you sure you want to assign?`}</p>
      </ModalCommon>
    </>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignMultiTaskToMe');
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
      assignToMe: TaskActions.assignToMe,
      changeOnMutilTaskMenu: changeOnMutilTaskMenu,
    }
  ),
  withHandlers({
    onClose: ({ clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ overviewType, changeOnMutilTaskMenu }) => () => {
      changeOnMutilTaskMenu('assign_multi_task_to_me', null, overviewType);
    },
  })
)(AssignMultiTaskToMeModal);

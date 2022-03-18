//@flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import * as TaskActions from 'components/Task/task.actions';
import ModalCommon from 'components/ModalCommon/ModalCommon';
import { makeGetTask } from '../task.selector';

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

const AcceptedDelegateModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon title={_l`Confirm`} visible={visible} onClose={onClose} size="mini" onDone={onSave}>
      <p>{_l`Are you sure want to accept?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'acceptedDelegate');
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
    clearHighlightAction: OverviewActions.clearHighlightAction,
    delegateAccept: TaskActions.delegateAccept,
  }),
  withHandlers({
    onClose: ({ clearHighlightAction, task, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ delegateAccept, task, overviewType }) => () => {
      delegateAccept(task.owner, task.uuid, overviewType, true);
    },
  })
)(AcceptedDelegateModal);

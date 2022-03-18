//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { makeGetTask } from '../task.selector';
import { withRouter } from 'react-router';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Do you really want to delete?': 'Do you really want to delete?',
  },
});

const AssignTaskToMeModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      task: getTask(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(
    makeMapStateToProps,
    {
      clearHighlightAction: OverviewActions.clearHighlightAction,
      deleteTask: OverviewActions.deleteRow,
    }
  ),
  withHandlers({
    onClose: ({ clearHighlightAction, overviewType, task }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ task, overviewType, deleteTask, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/activities/tasks'.length + 1);
      deleteTask(overviewType, task.uuid);
      if (uuid === task.uuid) {
        history.push(`/activities/tasks`);
      }
    },
  })
)(AssignTaskToMeModal);

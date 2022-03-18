// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from '../../components/Overview/overview.actions';
import { updateEdit, fetchLead, clearErrors } from 'components/Task/task.actions';
import editBtn from '../../../public/Edit.svg';
import delegation from '../../../public/Delegation.svg';
import css from './TaskActionMenu.css';
import user from '../../../public/user.svg';

type PropsT = {
  editTask: () => void,
  assignTask: () => void,
  assignTaskToMe: () => void,
  deleteTask: () => void,
  assignTagToTask: () => void,
  className: tring,
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delegate: 'Delegate',
    Tag: 'Tag',
    Edit: 'Edit',
    Delete: 'Delete',
    'Edit tags': 'Edit tags',
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
  },
});

const TaskActionMenu = ({
  editTask,
  deleteTask,
  assignTask,
  assignTaskToMe,
  assignTagToTask,
  assignDelegationTask,
  className,
  task,
}: PropsT) => {
  if (task.type === 'DISTRIBUTE') {
    return (
      <MoreMenu className={className} color={CssNames.Task}>
        {/* FIXME: Add Delegate Here */}
        {!task.ownerId && (
          <Menu.Item icon onClick={assignDelegationTask}>
            <div className={css.actionIcon}>
              {_l`Assign`}
              <img style={{ height: '13px', width: '20px' }} src={user} />
            </div>
          </Menu.Item>
        )}
        {!task.ownerId && (
          <Menu.Item icon onClick={assignTaskToMe}>
            <div className={css.actionIcon}>
              {_l`Assign to me`}
              <img style={{ height: '13px', width: '20px' }} src={user} />
            </div>
          </Menu.Item>
        )}
        <Menu.Item icon onClick={assignTagToTask}>
          <div className={css.actionIcon}>
            {_l`Tag`}
            <Icon name="tag" />
          </div>
        </Menu.Item>
        <Menu.Item icon onClick={editTask}>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>
        <Menu.Item icon onClick={deleteTask}>
          <div className={css.actionIcon}>
            {_l`Delete`}
            <Icon name="trash alternate" />
          </div>
        </Menu.Item>
      </MoreMenu>
    );
  }
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      {/* FIXME: Add Delegate Here */}
      <Menu.Item icon onClick={assignTask}>
        <div className={css.actionIcon}>
          {_l`Delegate`}
          <img style={{ height: '13px', width: '20px' }} src={delegation} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={assignTagToTask}>
        <div className={css.actionIcon}>
          {_l`Tag`}
          <Icon name="tag" />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={editTask}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteTask}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(null, {
    highlight: OverviewActions.highlight,
    updateEdit,
    fetchLead,
    clearErrors,
  }),
  withHandlers({
    editTask: ({ overviewType, highlight, task, updateEdit, fetchLead, clearErrors }) => () => {
      fetchLead(task.uuid);
      highlight(overviewType, task.uuid, 'edit');
      console.log('task:',task);
      const org =task.organisationDTO ? task.organisationDTO : task.organisation;
      updateEdit({ ...task, organisationDTO: (org==null || org.uuid==null )? null : org});
      clearErrors();
    },
    assignTask: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'assign');
    },
    assignTaskToMe: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'assignToMe');
    },
    assignTagToTask: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'tag');
    },
    deleteTask: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'delete');
    },
    assignDelegationTask: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'assignDelegation');
    },
  })
)(TaskActionMenu);

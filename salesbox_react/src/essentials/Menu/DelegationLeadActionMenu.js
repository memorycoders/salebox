// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from '../../components/Overview/overview.actions';
import { updateEdit, clearErrors } from '../../components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import editBtn from '../../../public/Edit.svg';
import delegation from '../../../public/Delegation.svg';
import css from './TaskActionMenu.css';
import user from '../../../public/user.svg';

type PropsT = {
  editLead: () => void,
  assignLead: () => void,
  assignTaskToMe: () => void,
  deleteLead: () => void,
  assignTagToTask: () => void,
  updateStatus: () => void,
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
    'Update status': 'Update status',
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
  },
});

const DelegationLeadActionMenu = ({ editLead, className, deleteLead, assignLead, assignTaskToMe }: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={editLead}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>

      <Menu.Item icon onClick={deleteLead}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" />
        </div>
      </Menu.Item>

      <Menu.Item icon onClick={assignLead}>
        <div className={css.actionIcon}>
          {_l`Assign`}
          <img style={{ height: '13px', width: '20px' }} src={delegation} />
        </div>
      </Menu.Item>

      <Menu.Item icon onClick={assignTaskToMe}>
        <div className={css.actionIcon}>
          {_l`Assign to me`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(null, {
    highlight: OverviewActions.highlight,
    updateEdit,
    clearErrors,
  }),
  withHandlers({
    editLead: ({ overviewType, highlight, unqualifiedDeal, updateEdit, clearErrors }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'edit');
      updateEdit(unqualifiedDeal);
      clearErrors();
    },
    assignLead: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assign');
    },
    assignTaskToMe: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assignToMe');
    },
    deleteLead: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'delete');
    },
    updateStatus: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'updateStatus');
    },
  })
)(DelegationLeadActionMenu);

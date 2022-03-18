// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { highlight, setActionForHighlight, editEntity } from 'components/Overview/overview.actions';
import { isItemSelected, isItemHighlighted, getHighlighted } from 'components/Overview/overview.selectors';
import callAdd from '../../../../public/Call lists.svg';
import accountAdd from '../../../../public/Accounts.svg';
import editBtn from '../../../../public/Edit.svg';
import { FORM_ACTION, OverviewTypes } from '../../../Constants';

// import excel from '../../../public/excel.png';
import css from './MutilActionMenu.css';

addTranslations({
  'en-US': {
    Edit: 'Edit',
    Delete: 'Delete',
    Done: 'Done',
  },
});

const OneRowMenu = ({
  className,
  openReponsibleModal,
  openDeleteTasksModal,
  editCallListForm,
  deleteAccountCalllist,
  showCallListForm,
  setAccountDone,
  addAccountToCalllistAccount,
}) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={editCallListForm}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '11px', width: '15px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => deleteAccountCalllist()}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={addAccountToCalllistAccount}>
        <div className={css.actionIcon}>
          {_l`Add company`}
          <img style={{ height: '11px', width: '20px' }} src={accountAdd} />
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => showCallListForm()}>
        <div className={css.actionIcon}>
          {_l`Add contact call list`}
          <div style={{ marginLeft: '10px' }}>
            <img style={{ height: '13px', width: '20px' }} src={callAdd} />
          </div>
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => setAccountDone()}>
        <div className={css.actionIcon}>
          {_l`Done`}
          <div className={css.notSetasDone} />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};
export default compose(
  connect(null, {
    highlight: highlight,
    setActionForHighlight: setActionForHighlight,
    editEntity: editEntity,
  }),

  withHandlers({
    openReponsibleModal: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, null, 'change_reponsible');
    },

    openMailchimpModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'add_to_mailchimp_list');
    },

    setAccountDone: ({ overviewType, callListAccount, highlight }) => () => {
      highlight(overviewType, callListAccount.uuid, 'set');
    },

    openSetDoneTasksModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'set_done_tasks');
    },

    openAddCallListModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'add_to_call_list');
    },
    showCallListForm: ({ setActionForHighlight, highlight, callListAccount }) => () => {
      highlight(OverviewTypes.CallList.List, callListAccount.uuid, 'create');

      // setActionForHighlight(OverviewTypes.CallList.List, 'create');
    },
    openUpdateDataFields: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'update_data_fields');
    },
    editCallListForm: ({ setActionForHighlight, editEntity, item, overviewType }) => () => {
      setActionForHighlight(overviewType, FORM_ACTION.EDIT);
      editEntity(overviewType, item.uuid);
    },
    openAssignModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'assignDelegation');
    },
    openAssignToMeModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'assignMultiTaskToMe');
    },
    deleteAccountCalllist: ({ overviewType, callListAccount, highlight }) => () => {
      highlight(overviewType, callListAccount.uuid, 'deleteAccountCallList');
    },
    addAccountToCalllistAccount: ({ highlight, callListAccount }) => () => {
      let overviewT = OverviewTypes.CallList.Account;
      highlight(overviewT, callListAccount.uuid, 'add_account_to_calllist_account');
    },
  })
)(OneRowMenu);

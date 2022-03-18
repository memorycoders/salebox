// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { highlight, setActionForHighlight, editEntity } from 'components/Overview/overview.actions';
import contactAdd from '../../../../public/Contacts.svg';
import editBtn from '../../../../public/Edit.svg';
import css from './MutilActionMenu.css';
import { FORM_ACTION } from '../../../Constants';

addTranslations({
  'en-US': {
    Edit: 'Edit',
    Delete: 'Delete',
    Done: 'Done',
  },
});

const OneRowMenu = ({
  className,
  deleteContactCallList,
  openDeleteTasksModal,
  editCallListForm,
  addContactToCalllist,
  setAccountDone,
}) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={editCallListForm}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '11px', width: '15px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => deleteContactCallList()}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => addContactToCalllist()}>
        <div className={css.actionIcon}>
          {_l`Add contact`}
          <div style={{ marginLeft: '10px' }}>
            <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
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
    deleteContactCallList: ({ overviewType, callListContact, highlight }) => () => {
      highlight(overviewType, callListContact.uuid, 'deleteContactCallList');
    },
    addContactToCalllist: ({ highlight, overviewType, callListContact }) => () => {
      highlight(overviewType, callListContact.uuid, 'add_contact_to_calllist_contact');
    },
    editCallListForm: ({ setActionForHighlight, editEntity, item, overviewType }) => () => {
      setActionForHighlight(overviewType, FORM_ACTION.EDIT);
      editEntity(overviewType, item.uuid);
    },
    setAccountDone: ({ overviewType, callListContact, highlight }) => () => {
      highlight(overviewType, callListContact.uuid, 'set');
    },
  })
)(OneRowMenu);

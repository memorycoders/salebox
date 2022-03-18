// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from 'components/Overview/overview.actions';
import css from './ActionNote.css';
import editBtn from '../../../public/Edit.svg';
addTranslations({
  'en-US': {
    Edit: 'Edit',
    Delete: 'Delete',
  },
});

const ActionNote = ({ editNote, deleteNote }) => {
  return (
    <MoreMenu imageClass={css.threeDots}>
      <Menu.Item icon onClick={() => editNote()}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => deleteNote()}>
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
  }),

  withHandlers({
    editNote: ({ overviewType, highlight, note, objectId }) => () => {
      highlight(overviewType, objectId, 'edit_note', note);
    },

    deleteNote: ({ overviewType, highlight, note, objectId }) => () => {
      highlight(overviewType, objectId, 'delete_note', note);
    },
  })
)(ActionNote);

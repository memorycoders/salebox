// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from '../../../components/Overview/overview.actions';
import { updateEdit, fetchLead, clearErrors } from 'components/Task/task.actions';
import editBtn from '../../../../public/Edit.svg';
import css from '../../../essentials/Menu/TaskActionMenu.css';

addTranslations({
  'en-US': {
    Edit: 'Edit',
    Delete: 'Delete',
  },
});

const ProductActionMenu = ({ editProduct, deleteProduct, className }) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={editProduct}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteProduct}>
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
    editProduct: ({ overviewType, highlight, task, updateEdit, fetchLead, clearErrors }) => () => {
      fetchLead(task.uuid);
      highlight(overviewType, task.uuid, 'edit');
      updateEdit(task);
      clearErrors();
    },
    deleteProduct: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'delete');
    },
  })
)(ProductActionMenu);

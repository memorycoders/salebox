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
import { setDataEdit } from '../../Dashboard/dashboard.actions'
import editBtn from '../../../../public/Edit.svg';
import css from '../../../essentials/Menu/TaskActionMenu.css';

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
    Edit: 'Edit',
    Delete: 'Delete',
    Copy: 'Copy',
  },
});

const DashBoardActionMenu = ({ deleteChart, className, duplicateChart, editChart }: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={editChart}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={duplicateChart}>
        <Icon name="copy outline" />
        {_l`Copy`}
      </Menu.Item>
      <Menu.Item icon onClick={deleteChart}>
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
    setDataEdit
  }),
  withHandlers({
    deleteChart: ({ highlight, chartData }) => () => {
      //INSIGHT_DELETE_CHART
      highlight('INSIGHT_DELETE_CHART', chartData.uuid, 'delete')
    },
    editChart: ({ highlight, chartData, setDataEdit })=> ()=>{
      // setDataEdit(chartData)
      highlight('INSIGHT_CREATE_MODAL', null, 'edit', chartData)
    },
    duplicateChart: ({ highlight, chartData, setDataEdit }) => () => {
      // setDataEdit(chartData)
      highlight('INSIGHT_CREATE_MODAL', null, 'copy', chartData)
    },

  })
)(DashBoardActionMenu);

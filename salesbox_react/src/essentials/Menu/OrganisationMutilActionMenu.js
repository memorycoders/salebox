// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import { getFileFromURL } from '../../lib/getFileFromUrl';
import callList from '../../../public/Call lists.svg';
import unqualifiedAdd from '../../../public/Unqualified_deals.svg';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import orderAdd from '../../../public/Notes.svg';
import setTaskasDone from '../../../public/Checkbox1.svg';
import mailchimp from '../../../public/mailchimp.png';
import massmail from '../../../public/massmail.png';
import user from '../../../public/user.svg';
import delegation from '../../../public/Delegation.svg';
import listUpdate from '../../../public/list.svg';
import { changeOnMultiMenu } from '../../components/Organisation/organisation.actions';
import { updateCreateEntityUnqualified } from '../../components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { getOverview } from 'components/Overview/overview.selectors';

// import excel from '../../../public/excel.png';
import css from './TaskActionMenu.css';
import { showHideMassPersonalMail } from '../../components/Common/common.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import NotificationItem from '../../components/Notification/NotificationItem';
import { over } from 'lodash';

addTranslations({
  'en-US': {
    'Personal mass email': 'Personal mass email',
    'Export to Mailchimp': 'Export to Mailchimp',
    'Update data fields': 'Update data fields',
    'Add to call list': 'Add to call list',
    'Add unqualified': 'Add unqualified',
    'Add qualified': 'Add qualified',
    'Add order': 'Add order',
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
  },
});

const MutilActionMenu = ({
  className,
  changeOnMultiMenu,
  openReponsibleModal,
  openMailchimpModal,
  openDeleteTasksModal,
  openAddCallListModal,
  openSetDoneTasksModal,
  openUpdateDataFields,
  overviewType,
  openAssignModal,
  openAssignToMeModal,
  handlerOpenMassPersonalEmail,
  openAddUnqualifiedDealsModal,
}) => {
  return (
    <MoreMenu id="mutil_action" className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={handlerOpenMassPersonalEmail}>
        <div className={css.actionIcon}>
          {_l`Personal mass email`}
          <img style={{ height: '11px', width: '15px' }} src={massmail} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => changeOnMultiMenu('export_to_excel', {}, overviewType)}>
        <div className={css.actionIcon}>
          {_l`Export to MS Excel`}
          <Icon name="file excel" />
          {/* <img style={{ height: '13px', width: '17px'}} src={excel} /> */}
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openMailchimpModal()}>
        <div className={css.actionIcon}>
          {_l`Export to Mailchimp`}
          <img style={{ height: '15px', width: '20px' }} src={mailchimp} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openUpdateDataFields()}>
        <div className={css.actionIcon}>
          {_l`Update data fields`}
          <img style={{ height: '13px', width: '20px' }} src={listUpdate} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openAddCallListModal()}>
        <div className={css.actionIcon}>
          {_l`Add to call list`}
          <img style={{ height: '13px', width: '20px' }} src={callList} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openAddUnqualifiedDealsModal()}>
        <div className={css.actionIcon}>
          {_l`Add prospect`}
          <img style={{ height: '13px', width: '20px' }} src={unqualifiedAdd} />
        </div>
      </Menu.Item>

      {overviewType == OverviewTypes.Contact && (
        <Menu.Item>
          <div className={css.actionIcon}>
            {_l`Add deal`}
            <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
          </div>
        </Menu.Item>
      )}
      {overviewType == OverviewTypes.Contact && (
        <Menu.Item>
          <div className={css.actionIcon}>
            {_l`Add order`}
            <img style={{ height: '11px', width: '20px' }} src={orderAdd} />
          </div>
        </Menu.Item>
      )}
      <Menu.Item icon onClick={() => openReponsibleModal()}>
        <div className={css.actionIcon}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openDeleteTasksModal()}>
        <div className={css.actionIcon}>
          {overviewType == OverviewTypes.Pipeline.Order ? _l`Delete orders` : _l`Delete company`}
          <Icon name="trash alternate" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(
    (state) => {
      const overview = getOverview(state, OverviewTypes.Account);
      const { selected, selectAll, itemCount } = overview;
      const keys = Object.keys(selected);
      let selectIds = [];
      let unSelectedIds = [];
      let selectedSize = 0;
      if (selectAll) {
        unSelectedIds = keys.filter((key) => selected[key] === false);
        selectedSize = itemCount - unSelectedIds.length;
      } else {
        selectIds = keys.filter((key) => selected[key] === true);
        selectedSize = selectIds.length;
      }

      let organisationId = null;
      if (selectIds.length == 1) {
        organisationId = selectIds[0];
        // const organisation = selected[organisationId];
      }
      return {
        accountAllowedSendEmail: state.common.accountAllowedSendEmail,
        organisationId,
        selectedSize,
      };
    },
    {
      highlight: OverviewActions.highlight,
      changeOnMultiMenu: changeOnMultiMenu,
      showHideMassPersonalMail: showHideMassPersonalMail,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      notificationError: NotificationActions.error,
    }
  ),

  withHandlers({
    openReponsibleModal: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, null, 'change_reponsible');
    },

    openMailchimpModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'add_to_mailchimp_list');
    },

    openDeleteTasksModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'delete_multi');
    },

    openSetDoneTasksModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'set_done_multi');
    },

    openAddCallListModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'add_to_call_list');
    },

    openUpdateDataFields: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'update_data_fields');
    },
    openAssignModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'assign');
    },
    openAssignToMeModal: ({ overviewType, highlight }) => () => {
      highlight(overviewType, null, 'assignMultiUnqualifiedToMe');
    },
    handlerOpenMassPersonalEmail: ({ showHideMassPersonalMail }) => () => {
      showHideMassPersonalMail(true);
    },
    openAddUnqualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityUnqualified,
      organisationId,
      notificationError,
      selectedSize,
    }) => () => {
      // if(overviewType == OverviewTypes.Account_Unqualified_Multi){
      if (selectedSize > 200) {
        notificationError('CANNOT_ADD_FOR_MORE_THAN_200_OBJECT');
        return;
      }
      updateCreateEntityUnqualified({ organisationId }, OverviewTypes.Account_Unqualified_Multi);

      highlight(OverviewTypes.Account_Unqualified_Multi, null, 'create');
    },
  })
)(MutilActionMenu);

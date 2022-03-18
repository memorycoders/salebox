// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { highlight } from 'components/Overview/overview.actions';
import { showHideMassPersonalMail } from 'components/Common/common.actions';
import { getFileFromURL } from '../../../lib/getFileFromUrl';
import callList from '../../../../public/Call lists.svg';
import setTaskasDone from '../../../../public/Checkbox1.svg';
import mailchimp from '../../../../public/mailchimp.png';
import massmail from '../../../../public/massmail.png';
import user from '../../../../public/user.svg';
import delegation from '../../../../public/Delegation.svg';
import listUpdate from '../../../../public/list.svg';
import { OverviewTypes } from '../../../Constants';

// import excel from '../../../public/excel.png';
import css from './MutilActionMenu.css';

addTranslations({
  'en-US': {
    'Personal mass email': 'Personal mass email',
    'Export to Mailchimp': 'Export to Mailchimp',
    'Update data fields': 'Update data fields',
    'Add to call list': 'Add to call list',
    'Set reminders as done': 'Set reminders as done',
    'Delete reminders': 'Delete reminders',
  },
});

const MutilActionMenu = ({
  className,
  openReponsibleModal,
  openMailchimpModal,
  openDeleteTasksModal,
  handlerOpenMassPersonalEmail,
  overviewType,
}) => {
  return (
    <MoreMenu id="mutil_action" className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={handlerOpenMassPersonalEmail}>
        <div className={css.actionIcon}>
          {_l`Personal mass email`}
          <img style={{ height: '11px', width: '15px' }} src={massmail} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openMailchimpModal()}>
        <div className={css.actionIcon}>
          {_l`Export to Mailchimp`}
          <img style={{ height: '15px', width: '18px' }} src={mailchimp} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openReponsibleModal()}>
        <div className={css.actionIcon}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openDeleteTasksModal()}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(
    (state) => {
      return {
        accountAllowedSendEmail: state.common.accountAllowedSendEmail,
      };
    },
    {
      highlight: highlight,
      showHideMassPersonalMail: showHideMassPersonalMail,
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
    handlerOpenMassPersonalEmail: ({ showHideMassPersonalMail }) => () => {
      showHideMassPersonalMail(true);
    },
  })
)(MutilActionMenu);

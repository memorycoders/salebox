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
import massmail from '../../../../public/massmail.png';
import user from '../../../../public/user.svg';
import { OverviewTypes } from '../../../Constants';
import { changeOnMultiMenu } from '../resources.actions';
import css from 'essentials/Menu/TaskActionMenu.css';
import qualifiedAdd from '../../../../public/Qualified_deals.svg';
import { setAddMultiDealResource } from '../resources.actions';
import { setActionForHighlight } from '../../Overview/overview.actions';

const ResourceMutilActionMenu = ({
  className,
  changeOnMultiMenu,
  openReponsibleModal,
  handlerOpenMassPersonalEmail,
  overviewType,
  handeAddDeal,
}) => {
  return (
    <MoreMenu id="mutil_action" className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={handlerOpenMassPersonalEmail}>
        <div className={css.actionIcon}>
          {_l`Personal mass email`}
          <img style={{ height: '11px', width: '15px' }} src={massmail} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => changeOnMultiMenu('export_to_excel', null, overviewType)}>
        <div className={css.actionIcon}>
          {_l`Export to MS Excel`}
          <Icon name="file excel" />
          {/* <img style={{ height: '13px', width: '17px'}} src={excel} /> */}
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => openReponsibleModal()}>
        <div className={css.actionIcon}>
          {_l`Update manager`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={() => handeAddDeal()}>
        <div className={css.actionIcon}>
          {_l`Add deal`}
          <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
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
      changeOnMultiMenu: changeOnMultiMenu,
      setAddMultiDealResource,
      setActionForHighlight,
    }
  ),

  withHandlers({
    openReponsibleModal: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, null, 'update_manager');
    },
    handlerOpenMassPersonalEmail: ({ showHideMassPersonalMail }) => () => {
      showHideMassPersonalMail(true);
    },
    handeAddDeal: ({ setAddMultiDealResource, setActionForHighlight }) => () => {
      setAddMultiDealResource(true);
      setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
    },
  })
)(ResourceMutilActionMenu);

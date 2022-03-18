// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { Menu, Popup, Icon, Button } from 'semantic-ui-react';
import * as AppActions from 'components/App/app.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { Colors, OverviewTypes } from 'Constants';
import { getAvatar } from 'components/Auth/auth.selector';
import add from '../../../public/Add.svg';
import css from './CreateMenu.css';
import { IconButton } from '../Common/IconButton';
import taskAdd from '../../../public/Tasks.svg';
import unqualifiedAdd from '../../../public/Unqualified_deals.svg';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import unqualifiedAddActive from '../../../public/Unqualified_deals_active.svg';
import qualifiedAddActive from '../../../public/Qualified_deals_active.svg';
import accountAdd from '../../../public/Accounts.svg';
import contactAdd from '../../../public/Contacts.svg';
import appointmentAdd from '../../../public/Appointments.svg';
import orderAdd from '../../../public/Notes.svg';
import campaignAdd from '../../../public/Campaigns.svg';
import callAdd from '../../../public/Call lists.svg';
import candidateAdd from '../../../public/Recruitment-1.png';

type PropsT = {
  showPipeForm: () => void,
  showAccountForm: () => void,
  showContactForm: () => void,
  showCallListAccountForm: () => void,
  showCallListContactForm: () => void,
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
  addTask: () => void,
};

addTranslations({
  'en-US': {
    'Add reminder': 'Add reminder',
    'Add order': 'Add order',
  },
});

const popupStyle = {
  padding: 0,
  minWidth: 200,
};

const CreateMenu = ({
  open,
  onOpen,
  onClose,
  showAccountForm,
  showContactForm,
  showCallListForm,
  showCallListContactForm,
  showPipeForm,
  addTask,
  addUnqualified,
  addQualified,
  addOrder,
  showAppointment,
  addCampaigns,
  addCandidate
}: PropsT) => {
  const profileMenuItem = (
    <IconButton name="profile" size={36} src={add} />
  );
  return (
    <Popup
      hoverable
      trigger={profileMenuItem}
      onOpen={onOpen}
      onClose={onClose}
      onClick={onClose}
      open={open}
      flowing
      position="bottom right"
      size="huge"
      style={popupStyle}
      on="click"
    >
      <Menu vertical fluid>
        <Menu.Item onClick={addTask}>
          <div className={css.actionIcon}>
            {_l`Add reminder`}
            <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={showAppointment}>
          <div className={css.actionIcon}>
            {_l`Add meeting`}
            <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addUnqualified}>
          <div className={css.actionIcon}>
            {_l`Add prospect`}
            <img style={{ height: '15px', width: '20px' }} src={unqualifiedAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addQualified}>
          <div className={css.actionIcon}>
            {_l`Add deal`}
            <img style={{ height: '15px', width: '20px' }} src={qualifiedAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addOrder}>
          <div className={css.actionIcon}>
            {_l`Add order`}
            <img style={{ height: '15px', width: '20px' }} src={orderAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={showAccountForm}>
          <div className={css.actionIcon}>
            {_l`Add company`}
            <img style={{ height: '11px', width: '20px' }} src={accountAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={showContactForm}>
          <div className={css.actionIcon}>
            {_l`Add contact`}
            <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={showCallListForm}>
          <div className={css.actionIcon}>
            {_l`Add call list`}
            <img style={{ height: '13px', width: '20px' }} src={callAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addCampaigns}>
          <div className={css.actionIcon}>
            {_l`Add campaign`}
            <img style={{ height: '10px', width: '20px' }} src={campaignAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addCandidate}>
          <div className={css.actionIcon}>
            {_l`Add candidate`}
            <img style={{ height: '15px', width: '15px', marginRight: '4px' }} src={candidateAdd} />
          </div>
        </Menu.Item>
      </Menu>
    </Popup>
  );
};

export default compose(
  connect(
    (state) => ({
      activeTab: state.ui.app.roleTab,
      avatar: getAvatar(state),
    }),
    {
      setActiveTab: AppActions.setRoleTab,
      setActionForHighlight: OverviewActions.setActionForHighlight,
    }
  ),
  withState('open', 'setOpen', false),
  withHandlers({
    onOpen: ({ setOpen }) => () => {
      setOpen(true);
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
    showAccountForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Account, 'create');
    },
    showContactForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Contact, 'create');
    },
    showPipeForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Pipeline.Lead, 'create');
    },
    showCallListForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.CallList.List, 'create');
    },
    showCallListContactForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.CallList.Account, 'create');
    },
    addTask: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Activity.Task, 'create');
    },
    addUnqualified: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Pipeline.Lead, 'create');
    },
    addQualified: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
    },
    addOrder: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Order, 'create');
    },
    showAppointment: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Activity.Appointment, 'create');
    },
    addCampaigns: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.Campaigns, 'create');
    },
    addCandidate: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.RecruitmentClosed, 'create');
    },
  })
)(CreateMenu);

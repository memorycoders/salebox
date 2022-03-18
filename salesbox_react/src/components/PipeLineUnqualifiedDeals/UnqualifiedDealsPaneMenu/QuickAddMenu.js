// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { Menu, Popup } from 'semantic-ui-react';
import * as AppActions from 'components/App/app.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { OverviewTypes } from 'Constants';
import { getAvatar } from 'components/Auth/auth.selector';
import { updateCreateEntity } from '../../Task/task.actions';
import add from '../../../../public/Add.svg';
import css from '../../CreateMenu/CreateMenu.css';
import taskAdd from '../../../../public/Tasks.svg';
import cssDeals from './UnqualifiedDealsPaneMenu.css';
import appointmentAdd from '../../../../public/Appointments.svg';
import NotesMenu from '../../../../public/Notes-Menu.svg';
import { contactItem } from '../../Contact/contact.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import { prospectConcatItem } from '../../Prospect/prospect.action';
import { getUser } from '../../Auth/auth.selector';

type PropsT = {
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
  addTask: () => void,
};

addTranslations({
  'en-US': {
    'Add reminder': 'Add reminder',
    'Quick add': 'Quick add',
    'Add note': 'Add note',
  },
});

const popupStyle = {
  padding: 0,
};

const menuStyle = {
  width: '25% !important',
};

const iconStyle = {
  height: 18,
  width: 18,
};

const CreateMenu = ({ open, onOpen, onClose, addTask, addNote, addAppointment }: PropsT) => {
  const profileMenuItem = (
    <Menu.Item style={menuStyle}>
      <img style={iconStyle} src={add} />
      <span className={cssDeals.text}>{_l`Quick add`}</span>
    </Menu.Item>
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
      style={popupStyle}
      keepInViewPort
      hideOnScroll
      on="click"
    >
      <Menu vertical color="teal">
        <Menu.Item onClick={addNote}>
          <div className={css.actionIcon}>
            {_l`Add note`}
            <img style={{ height: '13px', width: '20px' }} src={NotesMenu} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addTask}>
          <div className={css.actionIcon}>
            {_l`Add reminder`}
            <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
          </div>
        </Menu.Item>
        <Menu.Item onClick={addAppointment}>
          <div className={css.actionIcon}>
            {_l`Add meeting`}
            <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
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
      userAccount: getUser(state),
    }),
    {
      setActiveTab: AppActions.setRoleTab,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntity,
      highlight: OverviewActions.highlight,
      contactItem,
      organisationItem,
      prospectConcatItem,
      createEntityOverview: OverviewActions.createEntity,
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
    addTask: ({
      setActionForHighlight,
      unqualifiedDeal,
      updateCreateEntity,
      contactItem,
      organisationItem,
      prospectConcatItem,
    }) => () => {
      console.log('addTask unqualifiedDeal', unqualifiedDeal);

      contactItem([
        unqualifiedDeal.contactDTO || {
          uuid: unqualifiedDeal.contactId,
          firstName: unqualifiedDeal.contactFirstName,
          lastName: unqualifiedDeal.contactLastName,
        },
      ]);
      organisationItem({ uuid: unqualifiedDeal.organisationId, name: unqualifiedDeal.organisationName });

      prospectConcatItem(unqualifiedDeal);

      updateCreateEntity(unqualifiedDeal, OverviewTypes.Pipeline.Lead_Task);
      setActionForHighlight(OverviewTypes.Pipeline.Lead_Task, 'create');
    },

    addNote: ({ highlight, unqualifiedDeal }) => () => {
      if (unqualifiedDeal.uuid) {
        highlight(OverviewTypes.Pipeline.Lead_Note, unqualifiedDeal.uuid, 'add_note');
      }
    },
    addAppointment: ({
      overviewType,
      createEntityOverview,
      userAccount,
      organisationItem,
      highlight,
      contactItem,
      unqualifiedDeal,
      prospectConcatItem,
    }) => () => {
      // console.log("addAppointment overviewType",overviewType);
      // console.log("addAppointment unqualifiedDeal",unqualifiedDeal);
      contactItem([
        unqualifiedDeal.contactDTO || {
          uuid: unqualifiedDeal.contactId,
          firstName: unqualifiedDeal.contactFirstName,
          lastName: unqualifiedDeal.contactLastName,
        },
      ]);
      organisationItem({ uuid: unqualifiedDeal.organisationId, name: unqualifiedDeal.organisationName });

      prospectConcatItem(unqualifiedDeal);

      // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Pipeline.Lead_Appointment;
      switch (overviewType) {
        case OverviewTypes.Account_Unqualified:
        case OverviewTypes.Account_Qualified:
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Appointment;
          break;
        // case OverviewTypes.Contact_Qualified:
        //   overviewT = OverviewTypes.Contact_Qualified_Task;
        //   break;
        // case OverviewTypes.Contact_Order:
        //   overviewT = OverviewTypes.Contact_Order_Task;
        //   break;
      }
      let contactId = unqualifiedDeal.contactDTO != null ? unqualifiedDeal.contactDTO.uuid : unqualifiedDeal.contactId;
      createEntityOverview(overviewT, {
        // contactList: unqualifiedDeal.sponsorList != null ? unqualifiedDeal.sponsorList.map(value => value.uuid) : [],
        contacts:
          unqualifiedDeal.sponsorList != null ? unqualifiedDeal.sponsorList.map((value) => value.uuid) : [contactId],
        responsible: userAccount.uuid,
        organisation:
          unqualifiedDeal.organisation != null ? unqualifiedDeal.organisation.uuid : unqualifiedDeal.organisationId,
        prospect: { leadId: unqualifiedDeal.uuid },
      });
      highlight(overviewT, null, 'create');
    },
  })
)(CreateMenu);

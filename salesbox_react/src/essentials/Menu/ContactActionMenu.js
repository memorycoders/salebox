// @flow
import * as React from 'react';

import { compose, withHandlers, defaultProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import { getUserProfile } from 'components/Profile/profile.selector';

import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';

import * as ContactActions from 'components/Contact/contact.actions';
import * as OverviewActions from 'components/Overview/overview.actions';

import editBtn from '../../../public/Edit.svg';
import taskAdd from '../../../public/Tasks.svg';
import unqualifiedAdd from '../../../public/Unqualified_deals.svg';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import appointmentAdd from '../../../public/Appointments.svg';
import callAdd from '../../../public/Call lists.svg';
import NotesMenu from '../../../public/Notes-Menu.svg';
import user from '../../../public/user.svg';
import css from './TaskActionMenu.css';
import ColleaguesSVG from '../../../public/Colleagues.svg';
type PropsT = {
  editContact: () => void,
  addTask: () => void,
  addAppointment: () => void,
  deleteContact: () => void,
  addContactToCallList: () => void,
  addQualifiedDeal: () => void,
  addColleague: () => void,
  openReponsibleModal: () => void,
  addNote: () => void,
};

import _l from 'lib/i18n';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem } from '../../components/Organisation/organisation.actions';
import { updateCreateEntity } from '../../components/Task/task.actions';
import { updateCreateEntityUnqualified } from '../../components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { updateCreateEntityQualified } from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import { getUser } from '../../components/Auth/auth.selector';
import accountAdd from '../../../public/Accounts.svg';
import { concatType } from '../../components/Type/type.actions';
addTranslations({
  'en-US': {
    Actions: 'Actions',
    'Add reminder': 'Add reminder',
    'Add to call list': 'Add to call list',
    Delete: 'Delete',
    Deactivate: 'Deactivate',
    Edit: 'Edit',
  },
});

const ContactActionMenu = ({
  editContact,
  deleteContact,
  addQualifiedDeal,
  addAppointment,
  addContactToCallList,
  addTask,
  addColleague,
  openReponsibleModal,
  addNote,
  className,
  overviewType,
  openAddUnqualifiedDealsModal,
  openAddQualifiedDealsModal,
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Contact}>
      {overviewType == OverviewTypes.Contact && (
        <Menu.Item icon onClick={editContact}>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>
      )}
      {overviewType != OverviewTypes.Contact && (
        <>
          <Menu.Item icon>
            <div className={css.actionIcon} onClick={addNote}>
              {_l`Add note`}
              <img style={{ height: '13px', width: '20px' }} src={NotesMenu} />
            </div>
          </Menu.Item>
          <Menu.Item icon onClick={addTask}>
            <div className={css.actionIcon}>
              {_l`Add reminder`}
              <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
            </div>
          </Menu.Item>
          <Menu.Item icon onClick={addAppointment}>
            <div className={css.actionIcon}>
              {_l`Add meeting`}
              <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
            </div>
          </Menu.Item>
          <Menu.Item icon onClick={openAddUnqualifiedDealsModal}>
            <div className={css.actionIcon}>
              {_l`Add prospect`}
              <img style={{ height: '15px', width: '20px' }} src={unqualifiedAdd} />
            </div>
          </Menu.Item>
          <Menu.Item icon onClick={openAddQualifiedDealsModal}>
            <div className={css.actionIcon}>
              {_l`Add deal`}
              <img style={{ height: '15px', width: '20px' }} src={qualifiedAdd} />
            </div>
          </Menu.Item>
        </>
      )}
      <Menu.Item icon onClick={addContactToCallList}>
        <div className={css.actionIcon}>
          {_l`Add to call list`}
          <img style={{ height: '13px', width: '20px' }} src={callAdd} />
        </div>
      </Menu.Item>
      {overviewType != OverviewTypes.Contact && (
        <>
          <Menu.Item icon onClick={addColleague}>
            <div className={css.actionIcon}>
              {_l`Add colleague`}
              <img style={{ height: '13px', width: '20px' }} src={ColleaguesSVG} />
            </div>
          </Menu.Item>
        </>
      )}

      <Menu.Item icon>
        <div className={css.actionIcon} onClick={() => openReponsibleModal()}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteContact}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate outline" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  defaultProps({
    overviewType: OverviewTypes.Contact,
  }),
  connect(
    (state) => ({
      user: getUserProfile(state),
      userAccount: getUser(state),
      contactDetailToEdit: state.entities.contact.__DETAIL_TO_EDIT,
    }),
    {
      highlight: OverviewActions.highlight,
      editEntity: ContactActions.editEntity,
      createEntity: OverviewActions.createEntity,
      createColleague: ContactActions.createColleague,
      editContact: ContactActions.editContact,
      contactItem,
      organisationItem,
      updateCreateEntity,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      updateCreateEntityQualified: updateCreateEntityQualified,
      concatType,
      requestFetchContact: ContactActions.requestFetchContact,
      requestFetchContactDetailToEdit: ContactActions.requestFetchContactDetailToEdit,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { editEntity, overviewType } = this.props;
      if (nextProps.contactDetailToEdit !== this.props.contactDetailToEdit) {
        editEntity(overviewType, nextProps.contactDetailToEdit);
      }
    },
  }),
  withHandlers({
    // editContact: ({ editContact, contact }) => () => {
    //   editContact(contact.uuid);
    // },
    editContact: ({
      editEntity,
      overviewType,
      contact,
      highlight,
      contactDetail,
      organisationItem,
      concatType,
      requestFetchContactDetailToEdit,
      contactDetailToEdit,
    }) => () => {
      requestFetchContactDetailToEdit(contact.uuid);

      // const contactShow = contactDetail ? contactDetail : contact;
      const contactShow = contactDetailToEdit ? contactDetailToEdit : contact;

      if (contactShow.organisationId) {
        organisationItem({ uuid: contactShow.organisationId, name: contactShow.organisationName });
      }
      if (contactShow.relation) {
        concatType(contactShow.relation);
      }
      highlight(overviewType, contact.uuid, 'edit');
      editEntity(overviewType, contactShow);
    },
    addQualifiedDeal: ({ createEntity, contact }) => () => {
      createEntity(OverviewTypes.Prospect, {
        organisation: contact.organisation.uuid,
        contact: contact.uuid,
      });
    },
    addNote: ({ highlight, contact, overviewType }) => () => {
      highlight(OverviewTypes.Contact_Note, contact.uuid, 'add_note');
    },
    addTask: ({
      createEntity,
      contact,
      user,
      contactItem,
      organisationItem,
      updateCreateEntity,
      setActionForHighlight,
      overviewType,
    }) => () => {
      contactItem([contact]);
      organisationItem(contact.organisation);

      let overviewT = overviewType;
      switch (overviewType) {
        // case OverviewTypes.Account_Task:
        case OverviewTypes.Account:
        case OverviewTypes.Account_Contact:
          overviewT = OverviewTypes.Account_Task;
          break;
        case OverviewTypes.Contact:
        case OverviewTypes.Contact_Contact:
          overviewT = OverviewTypes.Contact_Task;
          break;
        default:
          break;
      }
      updateCreateEntity(
        { organisationId: contact.organisationId, contactDTO: contact, organisation: contact.organisation },
        overviewT
      );
      setActionForHighlight(overviewT, 'create');
      /*

      createEntity(OverviewTypes.Activity.Task, {
        contactId: contact.uuid,
        owner: user.uuid,
        organisationId: contact.organisationId,
        contactDTO: contact
      });
*/
    },
    addColleague: ({ createColleague, contact, highlight, overviewType }) => () => {
      createColleague(contact.organisationId);
      highlight(OverviewTypes.Contact_Add_Colleague, contact.uuid, 'create');
    },
    assignContact: ({ overviewType, highlight, contact }) => () => {
      highlight(overviewType, contact.uuid, 'assign');
    },
    addAppointment: ({ createEntity, contact, userAccount, organisationItem, contactItem, highlight }) => () => {
      contactItem([contact]);
      organisationItem(contact.organisation || { uuid: contact.organisationId, name: contact.organisationName });
      createEntity(OverviewTypes.Contact_Appointment, {
        contacts: [contact.uuid],
        responsible: userAccount.uuid,
        organisation: contact.organisation != null ? contact.organisation.uuid : contact.organisationId,
        // contactList: [contact.uuid],
        // responsible: user.uuid,
      });
      highlight(OverviewTypes.Contact_Appointment, null, 'create');
    },
    addContactToCallList: ({ overviewType, highlight, contact }) => () => {
      highlight(overviewType, contact.uuid, 'add_to_call_list');
    },
    deleteContact: ({ overviewType, highlight, contact }) => () => {
      highlight(overviewType, contact.uuid, 'delete', contact);
    },
    openReponsibleModal: ({ overviewType, highlight, contact }) => () => {
      // let overviewT = overviewType;
      // switch (overviewType) {
      //   case OverviewTypes.Account_Task:
      //   case OverviewTypes.Account:
      //     overviewT = OverviewTypes.Account_Contact;
      //     break;
      //   default:
      //     break;
      // }
      highlight(overviewType, contact.uuid, 'change_reponsible', contact);
    },
    openAddUnqualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityUnqualified,
      contact,
      organisationItem,
      contactItem,
    }) => () => {
      // if(overviewType == OverviewTypes.Account_Unqualified_Multi){
      contactItem([contact]);
      organisationItem(contact.organisation);
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Account_Task:
        case OverviewTypes.Account:
        case OverviewTypes.Account_Contact:
          overviewT = OverviewTypes.Account_Unqualified;
          break;
        case OverviewTypes.Contact:
          overviewT = OverviewTypes.Contact_Unqualified;
          break;
        case OverviewTypes.Contact_Contact:
          overviewT = OverviewTypes.Contact_Contact_Unqualified;
          break;
        default:
          break;
      }

      updateCreateEntityUnqualified({ organisationId: contact.organisation.uuid, contactId: contact.uuid }, overviewT);
      highlight(overviewT, null, 'create');
    },
    openAddQualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityQualified,
      contact,
      organisationItem,
      contactItem,
    }) => () => {
      contactItem([contact]);
      organisationItem(contact.organisation);
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Account_Task:
        case OverviewTypes.Account:
        case OverviewTypes.Account_Contact:
          overviewT = OverviewTypes.Account_Qualified;
          break;
        case OverviewTypes.Contact:
          overviewT = OverviewTypes.Contact_Qualified;
          break;
        case OverviewTypes.Contact_Contact:
          overviewT = OverviewTypes.Contact_Contact_Qualified;
        default:
          break;
      }

      updateCreateEntityQualified(
        { organisation: { uuid: contact.organisation.uuid }, contacts: [{ uuid: contact.uuid }] },
        overviewT
      );
      highlight(overviewT, null, 'create');
    },
  })
)(ContactActionMenu);

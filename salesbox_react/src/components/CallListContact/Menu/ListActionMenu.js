// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';

import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './ListActionMenu.css';

import * as OverviewActions from 'components/Overview/overview.actions';
import { updateCreateEntity } from '../../Task/task.actions';
import appointmentAdd from './../../../../public/Appointments.svg';
import taskAdd from './../../../../public/Tasks.svg';
import unqualifiedAdd from './../../../../public/Unqualified_deals.svg';
import qualifiedAdd from './../../../../public/Qualified_deals.svg';
import contactAdd from './../../../../public/Contacts.svg';
import callAdd from './../../../../public/Call lists.svg';
import NotesMenu from './../../../../public/Notes-Menu.svg';
import user from './../../../../public/user.svg';
import photoSvg from './../../../../public/Photos.svg';
// import { changeOnMultiMenu } from '../../components/Organisation/organisation.actions';
// import { showHideMassPersonalMail } from '../../components/Common/common.actions';
import { requestFetchContactDetailToEdit, editEntity } from '../../Contact/contact.actions';

type PropsT = {
  editOrganisation: () => void,
  assignOrganisation: () => void,
  assignOrganisationToMe: () => void,
  deleteOrganisation: () => void,
  assignTagToOrganisation: () => void,
  editOrganisation: () => void,
  addContact: () => void,
  openReponsibleModal: () => void,
};

import _l from 'lib/i18n';
import { contactItem } from '../../Contact/contact.actions';
import { updateCreateEntityUnqualified } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { updateCreateEntityQualified } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { getUser } from '../../Auth/auth.selector';
// import { updateCreateEntityUnqualified } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
// import { updateCreateEntityQualified } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import { createColleague } from '../../Contact/contact.actions';
import editBtn from '../../../../public/Edit.svg';

// import { createEntity } from '../../Contact/contact.actions';
addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delete: 'Delete',
    'Add meeting': 'Add meeting',
    'Add reminder': 'Add reminder',
    'Add to call list': 'Add to call list',
    'Edit account': 'Edit account',
    'Update responsible': 'Update responsible',
    'Remove from list': 'Remove from list',
    Deactivate: 'Deactivate',
    Edit: 'Edit',
  },
});

const ListActionMenu = ({
  deleteOrganisation,
  assignOrganisation,
  assignOrganisationToMe,
  assignTagToOrganisation,
  addContact,
  editOrganisation,
  className,
  updateCreateEntity,
  addNote,
  openAddCallListModal,
  openReponsibleModal,
  addTask,
  openAddUnqualifiedDealsModal,
  openAddQualifiedDealsModal,
  overviewType,
  addAppointment,
  addContactToCallList,
  deleteContact,
  editContact,
  removeContactFromCallList,
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Account}>
      <Menu.Item icon onClick={editContact}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      {false && (
        <>
          <Menu.Item icon onClick={addNote}>
            <div className={css.actionIcon}>
              {_l`Add note`}
              <img style={{ height: '13px', width: '20px' }} src={NotesMenu} />
            </div>
          </Menu.Item>
          {
            <Menu.Item icon onClick={addTask}>
              <div className={css.actionIcon}>
                {_l`Add reminder`}
                <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
              </div>
            </Menu.Item>
          }
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
          <Menu.Item icon onClick={addContact}>
            <div className={css.actionIcon}>
              {_l`Add colleague`}
              <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
            </div>
          </Menu.Item>
          {/* <Menu.Item>
          <div className={css.actionIcon}>
            {_l`Add Photo`}
            <img style={{ height: '11px', width: '20px' }} src={photoSvg} />
          </div>
        </Menu.Item> */}
          <Menu.Item icon onClick={addAppointment}>
            <div className={css.actionIcon}>
              {_l`Add meeting`}
              <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
            </div>
          </Menu.Item>
        </>
      )}
      <Menu.Item icon onClick={addContactToCallList}>
        <div className={css.actionIcon}>
          {_l`Add to call list`}
          <img style={{ height: '15px', width: '20px' }} src={callAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon>
        <div className={css.actionIcon} onClick={() => openReponsibleModal()}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={removeContactFromCallList}>
        <div className={css.actionIcon}>
          {_l`Remove from list`}
          <Icon name="trash alternate outline" color="grey" />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteContact}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(
    (state) => ({
      userAccount: getUser(state),
      contactDetailToEdit: state.entities.contact.__DETAIL_TO_EDIT,
    }),
    {
      /*
    highlight: OverviewActions.highlight,
    // createEntity,
    // editEntity: OverviewActions.editEntity,
    setActionForHighlight: OverviewActions.setActionForHighlight,
    updateCreateEntity,
    updateCreateEntityUnqualified: updateCreateEntityUnqualified,
    // updateCreateEntityQualified: updateCreateEntityQualified,
    organisationItem,
*/
      highlight: OverviewActions.highlight,
      editEntity: OverviewActions.editEntity,
      createEntity: OverviewActions.createEntity,
      createColleague,
      // editContact: ContactActions.editContact,
      contactItem,
      organisationItem,
      updateCreateEntity,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      updateCreateEntityQualified: updateCreateEntityQualified,
      requestFetchContactDetailToEdit,
      editEntityContact: editEntity,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { editEntityContact, overviewType } = this.props;
      if (nextProps.contactDetailToEdit !== this.props.contactDetailToEdit) {
        editEntityContact(overviewType, nextProps.contactDetailToEdit);
      }
    },
  }),
  withHandlers({
    editOrganisation: ({ overviewType, editEntity, setOpen, organisation }) => (event) => {
      editEntity(overviewType, organisation.uuid);
    },
    openAddCallListModal: ({ overviewType, highlight, organisation }) => () => {
      highlight(overviewType, organisation.uuid, 'add_to_call_list', organisation);
    },
    assignOrganisationToMe: ({ overviewType, highlight, setOpen, organisation }) => (event) => {
      highlight(overviewType, organisation.uuid, 'assignToMe');
    },
    addContact: ({ createEntity, contact, highlight, organisationItem }) => (event) => {
      createColleague(contact.organisationId);
      organisationItem({ uuid: contact.organisationId, name: contact.organisationName });
      highlight(OverviewTypes.Contact_Add_Colleague, contact.uuid, 'create');
    },
    deleteOrganisation: ({ overviewType, highlight, setOpen, organisation }) => (event) => {
      highlight(overviewType, organisation.uuid, 'delete');
    },
    addTask: ({ overviewType, setActionForHighlight, contact, updateCreateEntity }) => () => {
      updateCreateEntity({ contact }, overviewType);
      setActionForHighlight(overviewType, 'create');
    },
    addNote: ({ highlight, contact, overviewType }) => () => {
      highlight(overviewType, contact.contactId, 'add_note');
    },
    openReponsibleModal: ({ overviewType, highlight, contact }) => () => {
      // highlight(overviewType, organisation.uuid, 'change_reponsible', organisation);
      highlight(overviewType, contact.contactId, 'change_reponsible', contact);
    },
    openAddUnqualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityUnqualified,
      contact,
      contactItem,
      organisationItem,
    }) => () => {
      contactItem([{ ...contact, uuid: contact.contactId }]);
      organisationItem(contact.organisation || { uuid: contact.organisationId, name: contact.organisationName });
      let overviewT = OverviewTypes.Contact_Unqualified;
      updateCreateEntityUnqualified(
        {
          organisation: contact.organisation || { uuid: contact.organisationId, name: contact.organisationName },
          contacts: [{ uuid: contact.contactId }],
        },
        overviewT
      );

      highlight(overviewT, null, 'create');
    },
    addAppointment: ({ createEntity, contact, userAccount, organisationItem, contactItem, highlight }) => () => {
      contactItem([{ ...contact, uuid: contact.contactId }]);
      organisationItem(contact.organisation || { uuid: contact.organisationId, name: contact.organisationName });
      createEntity(OverviewTypes.Contact_Appointment, {
        contacts: [contact.contactId],
        responsible: userAccount.uuid,
        organisation: contact.organisation != null ? contact.organisation.uuid : contact.organisationId,
        // contactList: [contact],
        // responsible: user.uuid,
      });
      highlight(OverviewTypes.Contact_Appointment, null, 'create');
    },
    openAddQualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityQualified,
      contact,
      organisationItem,
      contactItem,
    }) => () => {
      contactItem([{ ...contact, uuid: contact.contactId }]);
      organisationItem(contact.organisation || { uuid: contact.organisationId, name: contact.organisationName });
      let overviewT = OverviewTypes.Contact_Qualified;

      updateCreateEntityQualified(
        {
          organisation: contact.organisation || { uuid: contact.organisationId, name: contact.organisationName },
          contacts: [{ uuid: contact.contactId }],
        },
        overviewT
      );
      highlight(overviewT, null, 'create');
    },
    addContactToCallList: ({ overviewType, highlight, contact }) => () => {
      // let overviewT =  OverviewTypes.Contact;
      let overviewT = OverviewTypes.CallList.SubContact;
      highlight(overviewT, contact.contactId, 'add_to_call_list');
    },
    deleteContact: ({ overviewType, highlight, contact }) => () => {
      highlight(OverviewTypes.CallList.SubContact, contact.contactId, 'delete', contact);
    },
    editContact: ({
      editEntityContact,
      overviewType,
      contact,
      highlight,
      requestFetchContactDetailToEdit,
      contactDetailToEdit,
    }) => () => {
      requestFetchContactDetailToEdit(contact.contactId);
      editEntityContact(overviewType, contactDetailToEdit);
      highlight(overviewType, contactDetailToEdit.uuid, 'edit');
    },
    removeContactFromCallList: ({ highlight, contact, overviewType }) => () => {
      highlight(overviewType, contact.contactId, 'removeContactFromCallList');
    },
  })
)(ListActionMenu);

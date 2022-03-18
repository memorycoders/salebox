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
import { getDetailAccountToEdit } from '../../Organisation/organisation.selector';
import { requestFetchOrganisationToEdit, editEntity } from '../../Organisation/organisation.actions';
type PropsT = {
  editOrganisation: () => void,
  assignOrganisation: () => void,
  addAppointment: () => void,
  deleteOrganisation: () => void,
  assignTagToOrganisation: () => void,
  editOrganisation: () => void,
  addContact: () => void,
  openReponsibleModal: () => void,
};

import _l from 'lib/i18n';
import { updateCreateEntityUnqualified } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { updateCreateEntityQualified } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import editBtn from '../../../../public/Edit.svg';

// import { createEntity } from '../../Contact/contact.actions';
addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delete: 'Delete',
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
  addAppointment,
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
  organisation,
  removeAccountFromCallList,
  editAccount,
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Account}>
      <Menu.Item icon onClick={editAccount}>
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
              {_l`Add contact`}
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
      <Menu.Item icon onClick={openAddCallListModal}>
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
      <Menu.Item icon onClick={removeAccountFromCallList}>
        <div className={css.actionIcon}>
          {_l`Remove from list`}
          <Icon name="trash alternate outline" color="grey" />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteOrganisation}>
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
      detailAccount: getDetailAccountToEdit(state),
    }),
    {
      highlight: OverviewActions.highlight,
      // createEntity,
      // editEntity: OverviewActions.editEntity,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntity,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      updateCreateEntityQualified: updateCreateEntityQualified,
      organisationItem,
      createEntityOverview: OverviewActions.createEntity,
      requestFetchOrganisationToEdit,
      editEntity: editEntity,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { editEntity, overviewType } = this.props;
      if (nextProps.detailAccount !== this.props.detailAccount) {
        editEntity(overviewType, nextProps.detailAccount);
      }
    },
  }),
  withHandlers({
    editOrganisation: ({ overviewType, editEntity, setOpen, organisation }) => (event) => {
      editEntity(overviewType, organisation.uuid);
    },
    openAddCallListModal: ({ overviewType, highlight, organisation }) => () => {
      let overviewT = OverviewTypes.CallList.SubAccount;
      highlight(overviewT, organisation.organisationId, 'add_to_call_list', organisation);
    },
    addAppointment: ({ overviewType, highlight, setOpen, organisation, createEntityOverview, organisationItem }) => (
      event
    ) => {
      // TODO: fill account & contact to here
      organisationItem({ uuid: organisation.organisationId, name: organisation.name });
      createEntityOverview(OverviewTypes.Account_Appointment, {
        // contactList: [contact.uuid],
        // responsible: userAccount.uuid,
        organisation: organisation.organisationId,
      });
      highlight(OverviewTypes.Account_Appointment, organisation.organisationId, 'create');
    },
    addContact: ({ createEntity, organisation, highlight, organisationItem }) => (event) => {
      organisationItem(organisation);
      highlight(OverviewTypes.Account_Contact, null, 'create');
      const contact = {
        industry: (organisation.industry && organisation.industry.uuid) || null,
        size: (organisation.size && organisation.size.uuid) || null,
        type: (organisation.type && organisation.type.uuid) || null,
        relation: organisation.relation && organisation.relation.uuid,
        street: organisation.street,
        zipCode: organisation.zipCode,
        city: organisation.city,
        region: organisation.state,
        country: organisation.country,
        organisationId: organisation.uuid,
      };
      createEntity(contact);
    },
    deleteOrganisation: ({ overviewType, highlight, setOpen, organisation }) => (event) => {
      highlight(OverviewTypes.CallList.SubAccount, organisation.organisationId, 'delete', organisation);
    },
    addTask: ({ overviewType, setActionForHighlight, organisation, updateCreateEntity }) => () => {
      let overviewT = OverviewTypes.Account_Task;
      updateCreateEntity({ organisation }, overviewType);
      setActionForHighlight(overviewType, 'create');
    },
    addNote: ({ highlight, organisation, overviewType }) => () => {
      highlight(overviewType, organisation.organisationId, 'add_note');
    },
    openReponsibleModal: ({ overviewType, highlight, organisation }) => () => {
      highlight(overviewType, organisation.organisationId, 'change_reponsible', organisation);
    },
    openAddUnqualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityUnqualified,
      organisation,
      organisationItem,
      setActionForHighlight,
    }) => () => {
      organisationItem(organisation);
      updateCreateEntityUnqualified({ organisationId: organisation.organisationId }, overviewType);
      highlight(OverviewTypes.CallList.SubAccount_Unqualified, organisation.organisationId, 'create');
    },
    openAddQualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityQualified,
      organisation,
      organisationItem,
    }) => () => {
      organisationItem(organisation);
      updateCreateEntityQualified(
        {
          organisation: { uuid: organisation.organisationId, name: organisation.name, displayName: organisation.name },
        },
        OverviewTypes.CallList.SubAccount_Qualified
      );

      highlight(OverviewTypes.CallList.SubAccount_Qualified, organisation.organisationId, 'create', organisation);
    },
    removeAccountFromCallList: ({ highlight, organisation, overviewType }) => () => {
      highlight(overviewType, organisation.organisationId, 'removeAccountFromCallList');
    },
    editAccount: ({
      editEntity,
      overviewType,
      organisation,
      highlight,
      requestFetchOrganisationToEdit,
      detailAccount,
    }) => () => {
      requestFetchOrganisationToEdit(organisation.organisationId);
      editEntity(overviewType, detailAccount);
      highlight(overviewType, detailAccount.uuid, 'edit');
    },
  })
)(ListActionMenu);

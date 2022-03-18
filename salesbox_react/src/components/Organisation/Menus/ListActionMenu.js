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
import { getUser } from '../../Auth/auth.selector';
import * as AccountActions from 'components/Organisation/organisation.actions';
import { requestFetchOrganisationToEdit } from '../organisation.actions';
// import { changeOnMultiMenu } from '../../components/Organisation/organisation.actions';
// import { showHideMassPersonalMail } from '../../components/Common/common.actions';
import { getDetailAccountToEdit } from '../organisation.selector';

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
import { updateCreateEntityQualified, updateEntity } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { organisationItem } from '../organisation.actions';

import { createEntity } from '../../Contact/contact.actions';
import editBtn from '../../../../public/Edit.svg';
addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delete: 'Delete',
    'Add reminder': 'Add reminder',
    'Add to call list': 'Add to call list',
    'Edit account': 'Edit account',
    'Update responsible': 'Update responsible',
    Deactivate: 'Deactivate',
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
  editAccount,
  overviewType,
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Account}>
      {/* <Menu.Item icon onClick={editOrganisation}>
        <Icon name="pencil" />
        {_l`Update company`}
      </Menu.Item> */}
      {overviewType == OverviewTypes.Account && (
        <Menu.Item icon onClick={editAccount}>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>
      )}
      {overviewType != OverviewTypes.Account && (
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
          <Menu.Item icon onClick={addContact}>
            <div className={css.actionIcon}>
              {_l`Add contact`}
              <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
            </div>
          </Menu.Item>
        </>
      )}
      {overviewType != OverviewTypes.Account && <>
      <Menu.Item icon onClick={addNote}>
        <div className={css.actionIcon}>
          {_l`Add note`}
          <img style={{ height: '13px', width: '20px' }} src={NotesMenu} />
        </div>
      </Menu.Item>
      {<Menu.Item icon onClick={addTask}>
        <div className={css.actionIcon}>
          {_l`Add reminder`}
          <img style={{ height: '13px', width: '20px'}} src={taskAdd} />
        </div>
      </Menu.Item>}
      <Menu.Item icon onClick={addAppointment}>
        <div className={css.actionIcon}>
          {_l`Add meeting`}
          <img style={{ height: '13px', width: '20px'}} src={appointmentAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={openAddUnqualifiedDealsModal}>
        <div className={css.actionIcon}>
          {_l`Add prospect`}
          <img style={{ height: '15px', width: '20px'}} src={unqualifiedAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={ openAddQualifiedDealsModal}>
        <div className={css.actionIcon}>
          {_l`Add deal`}
          <img style={{ height: '15px', width: '20px'}} src={qualifiedAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={addContact}>
        <div className={css.actionIcon}>
          {_l`Add contact`}
          <img style={{ height: '13px', width: '20px'}} src={contactAdd} />
        </div>
      </Menu.Item>
      </>}
      {<Menu.Item icon onClick={openAddCallListModal}>
        <div className={css.actionIcon}>
          {_l`Add to call list`}
          <img style={{ height: '15px', width: '20px'}} src={callAdd} />
        </div>
      </Menu.Item>}
      <Menu.Item icon>
        <div className={css.actionIcon} onClick={() => openReponsibleModal()}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
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
      userAccount: getUser(state),
      detailAccount: getDetailAccountToEdit(state),
    }),
    {
      highlight: OverviewActions.highlight,
      createEntity,
      // editEntity: OverviewActions.editEntity,
      editEntity: AccountActions.editEntity,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntity,
      updateCreateEntityUnqualified: updateCreateEntityUnqualified,
      updateCreateEntityQualified: updateCreateEntityQualified,
      organisationItem,
      createEntityOverview: OverviewActions.createEntity,
      requestFetchOrganisationToEdit,
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
    editAccount: ({
      editEntity,
      overviewType,
      organisation,
      _DETAIL_ACCOUNT,
      highlight,
      requestFetchOrganisationToEdit,
      detailAccount,
    }) => () => {
      requestFetchOrganisationToEdit(organisation.uuid);
      // const getAccount = makeGetOrganisation();

      // const detailAccount = getAccount(this.state, organisation.uuid);
      // const account = _DETAIL_ACCOUNT ? _DETAIL_ACCOUNT : organisation;
      editEntity(overviewType, detailAccount);
      highlight(overviewType, detailAccount.uuid, 'edit');
    },
    openAddCallListModal: ({ overviewType, highlight, organisation }) => () => {
      highlight(overviewType, organisation.uuid, 'add_to_call_list', organisation);
    },
    assignOrganisationToMe: ({ overviewType, highlight, setOpen, organisation }) => (event) => {
      highlight(overviewType, organisation.uuid, 'assignToMe');
    },
    addAppointment: ({ createEntityOverview, organisation, userAccount, organisationItem, highlight }) => () => {
      organisationItem(organisation);
      createEntityOverview(OverviewTypes.Account_Appointment, {
        // contactList: [contact.uuid],
        responsible: userAccount.uuid,
        organisation: organisation.uuid,
      });
      highlight(OverviewTypes.Account_Appointment, null, 'create');
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
      highlight(overviewType, organisation.uuid, 'delete');
    },
    addTask: ({ overviewType, setActionForHighlight, organisation, updateCreateEntity }) => () => {
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Account_Task;
      updateCreateEntity({ organisation }, overviewT);
      setActionForHighlight(overviewT, 'create');
    },
    addNote: ({ highlight, organisation }) => () => {
      highlight(OverviewTypes.Account_Note, organisation.uuid, 'add_note');
    },
    openReponsibleModal: ({ overviewType, highlight, organisation }) => () => {
      highlight(overviewType, organisation.uuid, 'change_reponsible', organisation);
    },
    openAddUnqualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityUnqualified,
      organisation,
      organisationItem,
    }) => () => {
      // if(overviewType == OverviewTypes.Account_Unqualified_Multi){
      organisationItem(organisation);
      updateCreateEntityUnqualified({ organisationId: organisation.uuid }, OverviewTypes.Account_Unqualified);
      highlight(OverviewTypes.Account_Unqualified, null, 'create');
    },
    openAddQualifiedDealsModal: ({
      overviewType,
      highlight,
      updateCreateEntityQualified,
      organisation,
      organisationItem,
    }) => () => {
      organisationItem(organisation);
      updateCreateEntityQualified({ organisation: { uuid: organisation.uuid } }, OverviewTypes.Account_Qualified);
      highlight(OverviewTypes.Account_Qualified, null, 'create');
    },
  })
)(ListActionMenu);

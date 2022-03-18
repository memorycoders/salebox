// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from '../../components/Overview/overview.actions';
import { updateEdit, clearErrors } from '../../components/PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import editBtn from '../../../public/Edit.svg';
import delegation from '../../../public/Delegation.svg';
import css from './TaskActionMenu.css';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import orderAdd from '../../../public/Notes.svg';
import noteMenu from '../../../public/Notes-Menu.svg';
import contactAdd from '../../../public/Contacts.svg';
import taskAdd from '../../../public/Tasks.svg';
import appointmentAdd from '../../../public/Appointments.svg';
import starCWon from '../../../public/star_circle_won.svg';
import starLost from '../../../public/star_circle_lost.svg';
import user from '../../../public/user.svg';
import {
  fetchNumberOrderRow,
  initDeleteRow,
  fetchProspectLite,
  updateEntity,
  fetchQualifiedDetailToEdit,
} from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import { fetchListByProspect } from '../../components/OrderRow/order-row.actions';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem, createContactEntity } from '../../components/Organisation/organisation.actions';
import { prospectConcatItem } from '../../components/Prospect/prospect.action';
import { MyContext } from '../../client';

import { updateCreateEntity } from '../../components/Task/task.actions';
import { getUser } from '../../components/Auth/auth.selector';
import { select } from 'redux-saga/effects';

type PropsT = {
  editTask: () => void,
  assignTask: () => void,
  assignTaskToMe: () => void,
  deleteObject: () => void,
  assignTagToTask: () => void,
  updateStatus: () => void,
  addNote: () => void,
  openReponsibleModal: () => void,
  className: tring,
  hideWonLost: boolean,
  setLostDeal: () => void,
  setWonDeal: () => void,
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
    Delegate: 'Delegate',
    Tag: 'Tag',
    Edit: 'Edit',
    Delete: 'Delete',
    'Edit tags': 'Edit tags',
    'Update status': 'Update status',
    'Check activities': 'Check activities',
    'Add reminder': 'Add reminder',
    'Update products': 'Update products',
    'Update responsible': 'Update responsible',
    'Add note': 'Add note',
    'Ask for help': 'Ask for help',
    'Set as won': 'Set as won',
    'Set as lost': 'Set as lost',
    Copy: 'Copy',
  },
});

const QualifiedDealActionMenu = ({
  className,
  addNote,
  qualifiedDeal,
  openReponsibleModal,
  overviewType,
  hideWonLost = false,
  setWonDeal,
  setLostDeal,
  deleteObject,
  addTask,
  onCopy,
  updateProducts,
  addContact,
  addAppointment,
  onEdit,
  ...props
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      {(overviewType == OverviewTypes.Pipeline.Qualified || overviewType == OverviewTypes.Pipeline.Order) && (
        <Menu.Item icon onClick={onEdit}>
          <div className={css.actionIcon}>
            {_l`Update`}
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </div>
        </Menu.Item>
      )}
      {overviewType !== OverviewTypes.Pipeline.Qualified && overviewType !== OverviewTypes.Pipeline.Order && (
        <>
          <Menu.Item icon onClick={addAppointment}>
            <div className={css.actionIcon}>
              {_l`Add meeting`}
              <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
            </div>
          </Menu.Item>
          {overviewType !== OverviewTypes.Account_Qualified && overviewType !== OverviewTypes.Contact_Qualified && (
            <Menu.Item icon>
              <div className={css.actionIcon} onClick={addNote}>
                {_l`Add note`}
                <img style={{ height: '13px', width: '20px' }} src={noteMenu} />
              </div>
            </Menu.Item>
          )}
          <Menu.Item icon onClick={addTask}>
            <div className={css.actionIcon}>
              {_l`Add reminder`}
              <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
            </div>
          </Menu.Item>
          {/* {overviewType === OverviewTypes.Pipeline.Order && (
        <Menu.Item icon>
          <div className={css.actionIcon}>
            {_l`Check activities`}
            <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
          </div>
        </Menu.Item>
      )} */}
          <Menu.Item icon onClick={addContact}>
            <div className={css.actionIcon}>
              {_l`Add contact`}
              <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
            </div>
          </Menu.Item>
        </>
      )}
      <Menu.Item icon onClick={updateProducts}>
        <div className={css.actionIcon}>
          {_l`Update products`}
          <img style={{ height: '13px', width: '20px' }} src={orderAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon>
        <div className={css.actionIcon} onClick={() => openReponsibleModal()}>
          {_l`Update responsible`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      {/* {overviewType === OverviewTypes.Pipeline.Order && (
        <Menu.Item icon>
          <div className={css.actionIcon}>
            {_l`Add for help`}
            <Icon name="help" />
          </div>
        </Menu.Item>
      )} */}
      {(overviewType === OverviewTypes.Account_Qualified || overviewType === OverviewTypes.Contact_Qualified) && (
        <Menu.Item icon>
          <div className={css.actionIcon} onClick={setWonDeal}>
            {_l`Set as won`}
            <img style={{ height: '13px', width: '20px' }} src={starCWon} />
          </div>
        </Menu.Item>
      )}
      {(overviewType === OverviewTypes.Account_Qualified || overviewType === OverviewTypes.Contact_Qualified) && (
        <Menu.Item icon>
          <div className={css.actionIcon} onClick={setLostDeal}>
            {_l`Set as lost`}
            <img style={{ height: '13px', width: '20px' }} src={starLost} />
          </div>
        </Menu.Item>
      )}
      <Menu.Item icon onClick={onCopy}>
        <div className={css.actionIcon}>
          {_l`Copy`}
          <Icon name="copy" color="grey" />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteObject}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" color="grey" />
        </div>
      </Menu.Item>
      {qualifiedDeal && className === 'bg-more circle' && (
        <Menu.Item icon>
          <div className={css.actionIcon} onClick={setWonDeal}>
            {_l`Set as won`}
            <img style={{ height: '13px', width: '20px' }} src={starCWon} />
          </div>
        </Menu.Item>
      )}
      {qualifiedDeal && className === 'bg-more circle' && (
        <Menu.Item icon>
          <div className={css.actionIcon} onClick={setLostDeal}>
            {_l`Set as lost`}
            <img style={{ height: '13px', width: '20px' }} src={starLost} />
          </div>
        </Menu.Item>
      )}
    </MoreMenu>
  );
};

export default compose(
  connect(
    (state) => ({
      userAccount: getUser(state),
      detailEdit: state.entities.qualifiedDeal.__DETAIL_TO_EDIT,
    }),
    {
      highlight: OverviewActions.highlight,
      select: OverviewActions.select,
      updateEdit,
      clearErrors,
      fetchNumberOrderRow,
      initDeleteRow,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      updateCreateEntity,
      fetchProspectLite,
      fetchListByProspect,
      contactItem,
      organisationItem,
      prospectConcatItem,
      createContactEntity,
      createEntityOverview: OverviewActions.createEntity,
      updateEntity,
      fetchQualifiedDetailToEdit,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.detailEdit !== this.props.detailEdit) {
        if (nextProps.detailEdit.sponsorList) {
          this.props.contactItem(nextProps.detailEdit.sponsorList);
        }
        if (nextProps.detailEdit.organisationId) {
          this.props.organisationItem({
            uuid: nextProps.detailEdit.organisationId,
            name: nextProps.detailEdit.organisationName,
          });
        }
        this.props.updateEntity();
      }
    },
  }),
  withHandlers({
    addAppointment: ({
      overviewType,
      createEntityOverview,
      userAccount,
      organisationItem,
      highlight,
      contactItem,
      qualifiedDeal,
      prospectConcatItem,
    }) => () => {
      contactItem(qualifiedDeal.sponsorList);
      organisationItem(qualifiedDeal.organisation);
      prospectConcatItem(qualifiedDeal);
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Appointment;
          break;
        case OverviewTypes.Pipeline.Order:
          overviewT = OverviewTypes.Pipeline.Qualified_Appointment;
          break;
        case OverviewTypes.Contact_Qualified:
        case OverviewTypes.Contact_Order:
          overviewT = OverviewTypes.Contact_Appointment;
          break;
        // case OverviewTypes.Contact_Order:
        //   overviewT = OverviewTypes.Contact_Order_Task;
        //   break;
      }
      createEntityOverview(overviewT, {
        // contactList: qualifiedDeal.sponsorList != null ? qualifiedDeal.sponsorList.map(value => value.uuid) : [],
        contacts: qualifiedDeal.sponsorList != null ? qualifiedDeal.sponsorList.map((value) => value.uuid) : [],
        responsible: userAccount.uuid,
        organisation: qualifiedDeal.organisation != null ? qualifiedDeal.organisation.uuid : null,
        prospect: { prospectId: qualifiedDeal.uuid },
      });
      highlight(overviewT, null, 'create');
    },
    addNote: ({ highlight, qualifiedDeal, overviewType }) => () => {
      highlight(overviewType, qualifiedDeal.uuid, 'add_note');
    },
    openReponsibleModal: ({ overviewType, highlight, qualifiedDeal }) => () => {
      highlight(overviewType, qualifiedDeal.uuid, 'change_reponsible', qualifiedDeal);
    },
    setLostDeal: ({ highlight, overviewType, qualifiedDeal }) => () => {
      highlight(overviewType, qualifiedDeal.uuid, 'set_lost_qualified_deal');
    },
    setWonDeal: ({ fetchNumberOrderRow, overviewType, qualifiedDeal }) => () => {
      fetchNumberOrderRow(qualifiedDeal.uuid, overviewType);
    },

    // editContact: ({ editContact, contact }) => () => {
    //   editContact(contact.uuid);
    // },
    // addQualifiedDeal: ({ createEntity, contact }) => () => {
    //   createEntity(OverviewTypes.Prospect, {
    //     organisation: contact.organisation.uuid,
    //     contact: contact.uuid,
    //   });
    // },

    // assignContact: ({ overviewType, highlight, contact }) => () => {
    //   highlight(overviewType, contact.uuid, 'assign');
    // },
    // addAppointment: ({ createEntity, contact, user }) => () => {
    //   createEntity(OverviewTypes.Activity.Appointment, {
    //     contactList: [contact.uuid],
    //     responsible: user.uuid,
    //   });
    // },
    // assignTagToContact: ({ overviewType, highlight, contact }) => () => {
    //   highlight(overviewType, contact.uuid, 'tag');
    // },

    // editTask: ({ overviewType, highlight, unqualifiedDeal, updateEdit, clearErrors }) => () => {
    //   highlight(overviewType, unqualifiedDeal.uuid, 'edit');
    //   updateEdit(unqualifiedDeal);
    //   clearErrors();
    // },
    // assignTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
    //   highlight(overviewType, unqualifiedDeal.uuid, 'assign');
    // },
    // assignTaskToMe: ({ overviewType, highlight, unqualifiedDeal }) => () => {
    //   highlight(overviewType, unqualifiedDeal.uuid, 'assignToMe');
    // },
    // assignTagToTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
    //   highlight(overviewType, unqualifiedDeal.uuid, 'tag');
    // },
    deleteObject: ({ overviewType, initDeleteRow, qualifiedDeal }) => () => {
      // highlight(overviewType, qualifiedDeal.uuid, 'delete');
      initDeleteRow(overviewType, qualifiedDeal.uuid);
    },
    // updateStatus: ({ overviewType, highlight, unqualifiedDeal }) => () => {
    //   highlight(overviewType, unqualifiedDeal.uuid, 'updateStatus');
    // },
    addTask: ({
      overviewType,
      setActionForHighlight,
      qualifiedDeal,
      updateCreateEntity,
      contactItem,
      organisationItem,
      prospectConcatItem,
    }) => () => {
      contactItem(qualifiedDeal.sponsorList);
      organisationItem(qualifiedDeal.organisation);
      prospectConcatItem(qualifiedDeal);
      // let overviewT = overviewType == OverviewTypes.Pipeline.Order ? OverviewTypes.Pipeline.Order_Task : OverviewTypes.Pipeline.Qualified_Task;
      let overviewT = OverviewTypes.Pipeline.Qualified_Task;
      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
          overviewT = OverviewTypes.Account_Qualified_Task;
          break;
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Order_Task;
          break;
        case OverviewTypes.Contact_Qualified:
          overviewT = OverviewTypes.Contact_Qualified_Task;
          break;
        case OverviewTypes.Contact_Order:
          overviewT = OverviewTypes.Contact_Order_Task;
          break;
      }

      updateCreateEntity(qualifiedDeal, overviewT);
      setActionForHighlight(overviewT, 'create');
    },
    onCopy: ({ fetchProspectLite, qualifiedDeal, overviewType }) => () => {
      // let overviewT = OverviewTypes.Pipeline.Qualified;
      let overviewT = overviewType;
      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
          overviewT = OverviewTypes.Account_Qualified;
          break;
        case OverviewTypes.Contact_Qualified:
          overviewT = OverviewTypes.Contact_Qualified_Copy;
          break;
        case OverviewTypes.Contact_Order:
          overviewT = OverviewTypes.Contact_Order_Copy;
          break;
        case OverviewTypes.Pipeline.Order:
          overviewT = OverviewTypes.Pipeline.Order;
          break;
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Order;
          break;
      }
      fetchProspectLite(qualifiedDeal.uuid, overviewT);
    },
    updateProducts: ({ qualifiedDeal, fetchListByProspect, highlight, overviewType, select }) => () => {
      fetchListByProspect(qualifiedDeal.uuid);
      let overviewT = qualifiedDeal.won !== null ? OverviewTypes.Pipeline.Order : OverviewTypes.Pipeline.Qualified;
      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
          overviewT = OverviewTypes.Account_Qualified;
          break;
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Order;
          break;
        case OverviewTypes.Contact_Qualified:
          overviewT = OverviewTypes.Contact_Qualified_Product;
          break;
        case OverviewTypes.Contact_Order:
          overviewT = OverviewTypes.Contact_Order_Product;
          break;
      }

      // create overview de quan ly an hien cac cot cua bang OrderRow
      select(OverviewTypes.CommonOrderRow, null);
      highlight(overviewT, qualifiedDeal.uuid, 'editProducts');
    },
    addContact: ({ qualifiedDeal, highlight, overviewType, createContactEntity, contactItem }) => () => {
      let overviewT = qualifiedDeal.won !== null ? OverviewTypes.Pipeline.Order : OverviewTypes.Pipeline.Qualified;

      switch (overviewType) {
        case OverviewTypes.Account_Qualified:
          overviewT = OverviewTypes.Account_Qualified_Contact;
          break;
        case OverviewTypes.Account_Order:
          overviewT = OverviewTypes.Account_Order_Contact;
          break;
        case OverviewTypes.Contact_Order:
          overviewT = OverviewTypes.Contact_Order_Contact;
          break;
        case OverviewTypes.Contact_Qualified:
          overviewT = OverviewTypes.Contact_Qualified_Contact;
          break;
      }
      contactItem(qualifiedDeal.sponsorList);
      const { sponsorList = [] } = qualifiedDeal;
      createContactEntity({
        contactDTOList: sponsorList,
        organisationId: qualifiedDeal.organisation.uuid,
        uuid: qualifiedDeal.uuid,
      });
      highlight(overviewT, qualifiedDeal.uuid, 'create');
    },
    onEdit: ({
      route,
      overviewType,
      qualifiedDeal,
      highlight,
      updateEntity,
      contactItem,
      organisationItem,
      fetchQualifiedDetailToEdit,
      detailEdit,
    }) => (e) => {
      let path = window.location.pathname;
      if (path.includes('pipeline/order') || path.includes(`${route}/order`)) {
        e.stopPropagation();
        fetchQualifiedDetailToEdit(qualifiedDeal.uuid);
        updateEntity();
        highlight(OverviewTypes.Pipeline.Order, qualifiedDeal.uuid, 'editOrder');
      } else if (path.includes('pipeline/overview') || path.includes(`${route}/qualified`)) {
        fetchQualifiedDetailToEdit(qualifiedDeal.uuid);
        e.stopPropagation();
        // contactItem(qualifiedDeal.sponsorList);
        // organisationItem({ uuid: qualifiedDeal.organisationId, name: qualifiedDeal.organisationName });
        updateEntity();
        highlight(overviewType, qualifiedDeal.uuid, 'edit');
      }
    },
  })
)(QualifiedDealActionMenu);

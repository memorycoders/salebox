// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
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
import accountAdd from '../../../public/Accounts.svg';
import contactAdd from '../../../public/Contacts.svg';
import * as QualifidedActions from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as OrderRowActions from '../../components/OrderRow/order-row.actions';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem } from '../../components/Organisation/organisation.actions';

type PropsT = {
  editTask: () => void,
  assignTask: () => void,
  assignTaskToMe: () => void,
  deleteTask: () => void,
  assignTagToTask: () => void,
  updateStatus: () => void,
  className: tring,
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
  },
});

const UnqualifiedDealActionMenu = ({
  editTask,
  deleteTask,
  assignTask,
  assignTaskToMe,
  assignTagToTask,
  updateStatus,
  className,
  unqualifiedDeal,
  editContact,
  deleteContact,
  addQualifiedDeal,
  addAppointment,
  convertToOrder,
  overviewType,
}: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      {/*FIXME: Add Delegate Here*/}
      {(unqualifiedDeal.type === 'MANUAL' ||
        (unqualifiedDeal.type === 'INVITED' && unqualifiedDeal.accepted) ||
        unqualifiedDeal.type === 'PRIORITISED') && (
        <>
          {!unqualifiedDeal.finished && (
            <Menu.Item icon onClick={editTask}>
              <div className={css.actionIcon}>
                {_l`Update`}
                <img style={{ height: '13px', width: '20px' }} src={editBtn} />
              </div>
            </Menu.Item>
          )}
          {unqualifiedDeal.ownerId && (
            <Menu.Item icon onClick={updateStatus}>
              <div className={css.actionIcon}>
                {_l`Update status`}
                <Icon name="tag" color="grey" />
              </div>
            </Menu.Item>
          )}
          {unqualifiedDeal.ownerId &&
            (unqualifiedDeal.lineOfBusiness == null ||
              unqualifiedDeal.lineOfBusiness.salesMethodDTO == null ||
              unqualifiedDeal.lineOfBusiness.salesMethodDTO.keyCode !== 'REGISTER_ORDER') && (
              <Menu.Item icon onClick={addQualifiedDeal}>
                <div className={css.actionIcon}>
                  {_l`Convert to deal`}
                  <img style={{ height: '15px', width: '20px' }} src={qualifiedAdd} />
                </div>
              </Menu.Item>
            )}
          {unqualifiedDeal.ownerId && (
            <Menu.Item icon onClick={convertToOrder}>
              <div className={css.actionIcon}>
                {_l`Convert to order`}
                <img style={{ height: '15px', width: '20px' }} src={orderAdd} />
              </div>
            </Menu.Item>
          )}

          {false && !unqualifiedDeal.finished && unqualifiedDeal.organisationId && unqualifiedDeal.ownerId && (
            <Menu.Item icon onClick={editContact}>
              <div className={css.actionIcon}>
                {_l`Update company`}
                <img style={{ height: '13px', width: '20px' }} src={accountAdd} />
              </div>
            </Menu.Item>
          )}
          {false && !unqualifiedDeal.finished && unqualifiedDeal.contactId && unqualifiedDeal.ownerId && (
            <Menu.Item icon onClick={editContact}>
              <div className={css.actionIcon}>
                {_l`Update contact`}
                <img style={{ height: '13px', width: '20px' }} src={contactAdd} />
              </div>
            </Menu.Item>
          )}

          {unqualifiedDeal.ownerId && !unqualifiedDeal.finished && (
            <Menu.Item icon onClick={assignTask}>
              <div className={css.actionIcon}>
                {_l`Delegate`}
                <img style={{ height: '13px', width: '20px' }} src={delegation} />
              </div>
            </Menu.Item>
          )}
          {!unqualifiedDeal.finished && (
            <Menu.Item icon onClick={deleteTask}>
              <div className={css.actionIcon}>
                {_l`Delete`}
                <Icon name="trash alternate outline" />
              </div>
            </Menu.Item>
          )}
        </>
      )}
      {unqualifiedDeal.type === 'DISTRIBUTE' && (
        <>
          {!unqualifiedDeal.finished && (
            <Menu.Item icon onClick={editTask}>
              <div className={css.actionIcon}>
                {_l`Update`}
                <img style={{ height: '13px', width: '20px' }} src={editBtn} />
              </div>
            </Menu.Item>
          )}
          {!unqualifiedDeal.finished && (
            <Menu.Item icon onClick={deleteTask}>
              <div className={css.actionIcon}>
                {_l`Delete`}
                <Icon name="trash alternate outline" />
              </div>
            </Menu.Item>
          )}
        </>
      )}
    </MoreMenu>
  );
};

export default compose(
  connect(null, {
    highlight: OverviewActions.highlight,
    updateEdit,
    clearErrors,
    copyEntityQualified: QualifidedActions.copyEntityQualified,
    copyEntityOrderRow: OrderRowActions.copyEntity,
    copyEntityOrder: QualifidedActions.copyEntityOrder,
    contactItem,
    organisationItem,
  }),
  withHandlers({
    editContact: ({ editContact, contact }) => () => {
      editContact(contact.uuid);
    },
    addQualifiedDeal: ({
      overviewType,
      copyEntityOrderRow,
      unqualifiedDeal,
      highlight,
      copyEntityQualified,
      contactItem,
      organisationItem,
    }) => () => {
      if(unqualifiedDeal.contact!=null && unqualifiedDeal.contact.uuid!=null)
        contactItem([unqualifiedDeal.contact]);
      if(unqualifiedDeal.organisation!=null && unqualifiedDeal.organisation.uuid!=null)
        organisationItem(unqualifiedDeal.organisation);
      highlight(OverviewTypes.Pipeline.Qualified, unqualifiedDeal.uuid, 'create', unqualifiedDeal);
      let orderRowCustomFieldDTOList = [];
      if (unqualifiedDeal && unqualifiedDeal.productList) {
        unqualifiedDeal.productList.map((e) => {
          orderRowCustomFieldDTOList.push({
            listCustomFieldDTOs: null,
            orderRowDTO: {
              costUnit: 0,
              customFieldListDTO: null,
              deliveryEndDate: new Date(),
              deliveryStartDate: new Date(),
              description: e.description,
              discountPercent: 0,
              discountedPrice: e.price,
              lineOfBusinessId: e.lineOfBusinessId,
              lineOfBusinessName: e.lineOfBusinessName,
              margin: e.margin,
              measurementTypeId: e.measurementTypeId,
              measurementTypeName: e.measurementTypeName,
              numberOfUnit: e.quantity,
              periodNumber: e.periodNumber ? e.periodNumber : 0,
              periodType: e.periodType ? e.periodType: '',
              price: e.price,
              productDTO: e,
              productList: null,
              type: e.type ? e.type : 'NORMAL',
            },
          });
        });
      }
      const data = {
        contractDate: new Date().getTime(),
        organisation: unqualifiedDeal.organisation!=null && unqualifiedDeal.organisation.uuid!=null ? {
          uuid: unqualifiedDeal.organisation.uuid,
        }: null,
        sponsorList: unqualifiedDeal.contact!=null && unqualifiedDeal.contact.uuid!=null? [
          {
            uuid: unqualifiedDeal.contact.uuid,
          },
        ]:[],
        leadId: unqualifiedDeal.uuid,
        orderRowCustomFieldDTOList: orderRowCustomFieldDTOList,
      };
      copyEntityQualified(data);
      copyEntityOrderRow(orderRowCustomFieldDTOList);

      // copyEntityQualified()
    },
    convertToOrder: ({
      overviewType,
      highlight,
      unqualifiedDeal,
      copyEntityOrder,
      copyEntityOrderRow,
      contactItem,
      organisationItem,
    }) => () => {
      if(unqualifiedDeal.contact!=null && unqualifiedDeal.contact.uuid!=null)
        contactItem([unqualifiedDeal.contact]);
      unqualifiedDeal.organisation!=null && unqualifiedDeal.organisation.uuid!=null
        organisationItem(unqualifiedDeal.organisation);
      highlight(OverviewTypes.Order, unqualifiedDeal.uuid, 'create', unqualifiedDeal);
      let orderRowCustomFieldDTOList = [];
      if (unqualifiedDeal && unqualifiedDeal.productList) {
        unqualifiedDeal.productList.map((e) => {
          orderRowCustomFieldDTOList.push({
            listCustomFieldDTOs: null,
            orderRowDTO: {
              costUnit: 0,
              customFieldListDTO: null,
              deliveryEndDate: new Date(),
              deliveryStartDate: new Date(),
              description: e.description,
              discountPercent: 0,
              discountedPrice: e.price,
              lineOfBusinessId: e.lineOfBusinessId,
              lineOfBusinessName: e.lineOfBusinessName,
              margin: e.margin,
              measurementTypeId: e.measurementTypeId,
              measurementTypeName: e.measurementTypeName,
              numberOfUnit: e.quantity,
              periodNumber: e.periodNumber ? e.periodNumber : 0,
              periodType: e.periodType ? e.periodType: '',
              price: e.price,
              productDTO: e,
              productList: null,
              type: e.type ? e.type : 'NORMAL',
            },
          });
        });
      }
      const data = {
        contractDate: new Date().getTime(),
        organisation: unqualifiedDeal.organisation!=null && unqualifiedDeal.organisation.uuid!=null ? {
          uuid: unqualifiedDeal.organisation.uuid,
        }: null,
        sponsorList: unqualifiedDeal.contact!=null && unqualifiedDeal.contact.uuid!=null? [
          {
            uuid: unqualifiedDeal.contact.uuid,
          },
        ]:[],
        leadId: unqualifiedDeal.uuid,
        orderRowCustomFieldDTOList: orderRowCustomFieldDTOList,
      };

      copyEntityOrder(data);
      copyEntityOrderRow(orderRowCustomFieldDTOList);
    },
    // assignContact: ({ overviewType, highlight, contact }) => () => {
    //   highlight(overviewType, contact.uuid, 'assign');
    // },
    addAppointment: ({ createEntity, contact, user }) => () => {
      createEntity(OverviewTypes.Activity.Appointment, {
        contactList: [contact.uuid],
        responsible: user.uuid,
      });
    },

    editTask: ({ overviewType, highlight, unqualifiedDeal, updateEdit, clearErrors }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'edit');
      updateEdit(unqualifiedDeal);
      clearErrors();
    },
    assignTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assignD', unqualifiedDeal);
      // highlight(overviewType, unqualifiedDeal.uuid, 'assignDelegate');
    },
    assignTaskToMe: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assignToMe');
    },
    assignTagToTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'tag');
    },
    deleteTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'delete');
    },
    updateStatus: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'updateStatus');
    },
  })
)(UnqualifiedDealActionMenu);

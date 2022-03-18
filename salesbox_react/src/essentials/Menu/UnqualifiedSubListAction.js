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
import user from '../../../public/user.svg';
import delegation from '../../../public/Delegation.svg';
import css from './TaskActionMenu.css';
import * as QualifidedActions from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as OrderRowActions from '../../components/OrderRow/order-row.actions';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem } from '../../components/Organisation/organisation.actions';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import orderAdd from '../../../public/Notes.svg';
import accountAdd from '../../../public/Accounts.svg';
import contactAdd from '../../../public/Contacts.svg';

type PropsT = {
  editUnqualifiedDeal: () => void,
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
    Assign: 'Assign',
    'Assign to me': 'Assign to me',
  },
});

const UnqualifiedSubListAction = ({
  editUnqualifiedDeal,
  deleteTask,
  assignTask,
  assignDelegation,
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
}: PropsT) => {
  if (unqualifiedDeal.ownerId) {
    return (
      <MoreMenu className={className} color={CssNames.Task}>
        {(unqualifiedDeal.type === 'MANUAL' ||
          (unqualifiedDeal.type === 'INVITED' && unqualifiedDeal.accepted) ||
          unqualifiedDeal.type === 'PRIORITISED') && (
          <>
            {unqualifiedDeal.ownerId &&
              // unqualifiedDeal.lineOfBusiness &&
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

            {!unqualifiedDeal.finished && (
              <Menu.Item icon onClick={editUnqualifiedDeal}>
                <div className={css.actionIcon}>
                  {_l`Update`}
                  <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                </div>
              </Menu.Item>
            )}
            {unqualifiedDeal.ownerId && !unqualifiedDeal.finished && (
              <Menu.Item icon onClick={() => assignDelegation()}>
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
                  <Icon name="trash alternate" />
                </div>
              </Menu.Item>
            )}
          </>
        )}
        {unqualifiedDeal.type === 'DISTRIBUTE' && !unqualifiedDeal.finished && (
          <>
            <Menu.Item icon onClick={editUnqualifiedDeal}>
              <div className={css.actionIcon}>
                {_l`Update`}
                <img style={{ height: '13px', width: '20px' }} src={editBtn} />
              </div>
            </Menu.Item>
            <Menu.Item icon onClick={deleteTask}>
              <div className={css.actionIcon}>
                {_l`Delete`}
                <Icon name="trash alternate" />
              </div>
            </Menu.Item>
          </>
        )}
      </MoreMenu>
    );
  }
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      <Menu.Item icon onClick={() => assignTask()}>
        <div className={css.actionIcon}>
          {_l`Assign`}
          <img style={{ height: '13px', width: '20px' }} src={delegation} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={assignTaskToMe}>
        <div className={css.actionIcon}>
          {_l`Assign to me`}
          <img style={{ height: '13px', width: '20px' }} src={user} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={editUnqualifiedDeal}>
        <div className={css.actionIcon}>
          {_l`Update`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={deleteTask}>
        <div className={css.actionIcon}>
          {_l`Delete`}
          <Icon name="trash alternate" />
        </div>
      </Menu.Item>
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
      /*            contactItem([unqualifiedDeal.contact]);
            organisationItem(unqualifiedDeal.organisation);*/
      contactItem([
        {
          uuid: unqualifiedDeal.contactId,
          firstName: unqualifiedDeal.contactFirstName,
          lastName: unqualifiedDeal.contactLastName,
        },
      ]);
      organisationItem({ uuid: unqualifiedDeal.organisationId, name: unqualifiedDeal.organisationName });

      let overviewT = OverviewTypes.Account_Unqualified_Qualified;
      switch (overviewType) {
        case OverviewTypes.Contact_Unqualified:
          overviewT = OverviewTypes.Contact_Unqualified_Qualified;
          break;
      }
      highlight(overviewT, unqualifiedDeal.uuid, 'create', unqualifiedDeal);
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
        organisation: {
          // uuid: unqualifiedDeal.organisation.uuid,
          uuid: unqualifiedDeal.organisationId,
        },
        sponsorList: [
          {
            // uuid: unqualifiedDeal.contact.uuid,
            uuid: unqualifiedDeal.contactId,
          },
        ],
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
      /*            contactItem([unqualifiedDeal.contact]);
            organisationItem(unqualifiedDeal.organisation);*/

      contactItem([
        {
          uuid: unqualifiedDeal.contactId,
          firstName: unqualifiedDeal.contactFirstName,
          lastName: unqualifiedDeal.contactLastName,
        },
      ]);
      organisationItem({ uuid: unqualifiedDeal.organisationId, name: unqualifiedDeal.organisationName });

      let overviewT = OverviewTypes.Account_Unqualified_Order;
      switch (overviewType) {
        case OverviewTypes.Contact_Unqualified:
          overviewT = OverviewTypes.Contact_Unqualified_Order;
          break;
      }
      highlight(overviewT, unqualifiedDeal.uuid, 'create', unqualifiedDeal);
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
        organisation: {
          // uuid: unqualifiedDeal.organisation.uuid,
          uuid: unqualifiedDeal.organisationId,
        },
        sponsorList: [
          {
            // uuid: unqualifiedDeal.contact.uuid,
            uuid: unqualifiedDeal.contactId,
          },
        ],
        leadId: unqualifiedDeal.uuid,
        orderRowCustomFieldDTOList: orderRowCustomFieldDTOList,
      };

      copyEntityOrder(data);
      copyEntityOrderRow(orderRowCustomFieldDTOList);
    },
    assignContact: ({ overviewType, highlight, contact }) => () => {
      highlight(overviewType, contact.uuid, 'assign');
    },
    addAppointment: ({ createEntity, contact, user }) => () => {
      createEntity(OverviewTypes.Activity.Appointment, {
        contactList: [contact.uuid],
        responsible: user.uuid,
      });
    },

    editUnqualifiedDeal: ({
      overviewType,
      highlight,
      unqualifiedDeal,
      updateEdit,
      clearErrors,
      contactItem,
      organisationItem,
    }) => () => {
      contactItem([
        {
          uuid: unqualifiedDeal.contactId,
          firstName: unqualifiedDeal.contactFirstName,
          lastName: unqualifiedDeal.contactLastName,
        },
      ]);
      organisationItem({ uuid: unqualifiedDeal.organisationId, name: unqualifiedDeal.organisationName });

      highlight(overviewType, unqualifiedDeal.uuid, 'edit');
      updateEdit(unqualifiedDeal);
      clearErrors();
    },
    assignTask: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assign');
    },
    assignDelegation: ({ overviewType, highlight, unqualifiedDeal }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'assignD', unqualifiedDeal);
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
)(UnqualifiedSubListAction);

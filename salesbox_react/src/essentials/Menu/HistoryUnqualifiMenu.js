// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import * as OverviewActions from 'components/Overview/overview.actions';
import { updateCreate } from '../../components/Task/task.actions';
import editBtn from '../../../public/Edit.svg';
import orderAdd from '../../../public/Notes.svg';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import * as QualifidedActions from '../../components/PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as OrderRowActions from '../../components/OrderRow/order-row.actions';
import css from './TaskActionMenu.css';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem } from '../../components/Organisation/organisation.actions';

type PropsT = {
  duplicateTask: () => void,
  className: tring,
  updateStatus: () => void,
  addQualifiedDeal: () => void,
  convertToOrder: () => void,
};

addTranslations({
  'en-US': {
    Actions: 'Action',
    Copy: 'Copy',
    'Update status': 'Update status',
    'Convert to order': 'Convert to order',
  },
});

const HistoryUnqualifiMenu = ({ duplicateTask, className, updateStatus, addQualifiedDeal, convertToOrder }: PropsT) => {
  return (
    <MoreMenu className={className} color={CssNames.Task}>
      {/* FIXME: Add Delegate Here */}
      <Menu.Item icon onClick={updateStatus}>
        <div className={css.actionIcon}>
          {_l`Update status`}
          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={addQualifiedDeal}>
        <div className={css.actionIcon}>
          {_l`Convert to deal`}
          <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
        </div>
      </Menu.Item>
      <Menu.Item icon onClick={convertToOrder}>
        <div className={css.actionIcon}>
          {_l`Convert to order`}
          <img style={{ height: '13px', width: '20px' }} src={orderAdd} />
        </div>
      </Menu.Item>
    </MoreMenu>
  );
};

export default compose(
  connect(null, {
    highlight: OverviewActions.highlight,
    updateCreate,
    copyEntityQualified: QualifidedActions.copyEntityQualified,
    copyEntityOrderRow: OrderRowActions.copyEntity,
    copyEntityOrder: QualifidedActions.copyEntityOrder,
    contactItem,
    organisationItem,
  }),
  withHandlers({
    // duplicateTask: ({ overviewType, highlight, task, updateCreate }) => () => {
    //   updateCreate(task);
    //   highlight(overviewType, task.uuid, 'duplicate');
    // },
    updateStatus: ({ overviewType, highlight, contact }) => () => {
      if (contact) highlight(overviewType, contact.uuid, 'updateStatus');
    },
    addQualifiedDeal: ({
      overviewType,
      copyEntityOrderRow,
      contact,
      highlight,
      copyEntityQualified,
      contactItem,
      organisationItem,
    }) => () => {
      // createEntity(OverviewTypes.Prospect, {
      //   organisation: contact.uuid,
      //   contact: contact.uuid,
      // });
      contactItem([contact.contact]);
      organisationItem(contact.organisation);
      highlight(OverviewTypes.Pipeline.Qualified, contact.uuid, 'create', contact);
      let orderRowCustomFieldDTOList = [];
      if (contact && contact.productList) {
        contact.productList.map((e) => {
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
          uuid: contact.organisation.uuid,
        },
        sponsorList: [
          {
            uuid: contact.contact.uuid,
          },
        ],
        leadId: contact.uuid,
        orderRowCustomFieldDTOList: orderRowCustomFieldDTOList,
      };
      copyEntityQualified(data);
      copyEntityOrderRow(orderRowCustomFieldDTOList);

      // copyEntityQualified()
    },
    convertToOrder: ({
      overviewType,
      highlight,
      contact,
      copyEntityOrder,
      copyEntityOrderRow,
      contactItem,
      organisationItem,
    }) => () => {
      contactItem([contact.contact]);
      organisationItem(contact.organisation);
      highlight(OverviewTypes.Order, contact.uuid, 'create', contact);
      let orderRowCustomFieldDTOList = [];
      if (contact && contact.productList) {
        contact.productList.map((e) => {
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
              periodType: e.periodType ? e.periodType: null,
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
          uuid: contact.organisation.uuid,
        },
        sponsorList: [
          {
            uuid: contact.contact.uuid,
          },
        ],
        leadId: contact.uuid,
        orderRowCustomFieldDTOList: orderRowCustomFieldDTOList,
      };

      copyEntityOrder(data);
      copyEntityOrderRow(orderRowCustomFieldDTOList);
    },
  })
)(HistoryUnqualifiMenu);

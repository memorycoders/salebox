import * as React from 'react';
import createOverview from '../Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { fetchListActivity, fetchListBysale } from './qualifiedDeal.actions';
import AddToMailchimpListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import InfiniteUnqualifiedDealListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteQualifiedDealListRow';
import AddCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';
import DeleteQualifiedDealModal from './DeleteQualifiedDealModal/DeleteQualifiedDealModal';
import DeleteMultiModal from './DeleteMultiModal/DeleteMultiModal';
import DeleteOpportunityWithManyUsersConnectedModal from './DeleteOpportunityWithManyUsersConnectedModal/DeleteOpportunityWithManyUsersConnectedModal';
import DeleteConnectedObjectModal from './DeleteConnectedObjectModal/DeleteConnectedObjectModal';
import EditOrderRowModal from '../OrderRow/EditOrderRowModal';
import DeleteOrderRowModal from '../OrderRow/DeleteModal';
import CreateTaskModal from '../Task/CreateTaskModal/CreateTaskModal';
import CopyQualifiedModal from './CopyQualifiedModal';
import ChangeReponsibleModal from '../PipeLineQualifiedDeals/ChangeReponsible/ChangeReponsible';
import UpdateDataFieldsModal from './UpdateDataFieldsModal/index';
import EditNoteModal from '../NotesChat/ModalEditNote';
import DuplicateModal from '../Task/DuplicateModal';
import SetTaskModal from '../Task/SetTaskModal/SetTaskModal';
import EditTaskModal from '../Task/EditTaskModal/EditTaskModal';
import AssignTagToTaskModal from '../Task/AssignTagToTaskModal/AssignTagToTaskModal';
import AssignTaskModal from '../Task/AssignTaskModal/AssignTaskModal';
import AcceptedDelegateModal from '../Task/AcceptedDelegateModal';
import DeclineDelegateModal from '../Task/DeclineDelegateModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import SetLostDealModal from './SetLostDealModal/SetLostDealModal';
import SetWonDealModal from './SetWonDealModal/SetWonDealModal';
import SelectClousureDateModal from './SelectClosureDateModal/SelectClousureDateModal';
import CopyOrderModal from './CopyOrderModal';
import SuggestedActions from './SuggestedActions';
import DeleteNoteModal from '../NotesChat/DeleteNoteModal';
import EditOrderModal from './EditQualifiedModal/EditOrderModal';
import AddFileModal from '../Common/DocumentsPane/AddFileModal';
import CreateAppointmentModal from "../Appointment/CreateAppointmentModal/CreateAppointmentModal";

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';

const header = (width) => (
  <HeaderComponent objectType={ObjectTypes.PipelineOrder} width={width} overviewType={OverviewTypes.Pipeline.Order} />
);

const Overview = createOverview(
  OverviewTypes.Pipeline.Order,
  ObjectTypes.PipelineOrder,
  Colors.Pipeline,
  header,
  InfiniteUnqualifiedDealListRow,
  PlaceholderComponent
);

export const OrderObjectFeature = ()=> {
  return <>
    <AddToMailchimpListModal overviewType={OverviewTypes.Pipeline.Order} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.Pipeline.Order} />
    <AddCallListModal overviewType={OverviewTypes.Pipeline.Order} />
    <DeleteQualifiedDealModal overviewType={OverviewTypes.Pipeline.Order} currentPath={'/pipeline/orders'} />
    <DeleteMultiModal overviewType={OverviewTypes.Pipeline.Order} />
    <DeleteOpportunityWithManyUsersConnectedModal overviewType={OverviewTypes.Pipeline.Order} />
    <DeleteConnectedObjectModal overviewType={OverviewTypes.Pipeline.Order} />
    <EditOrderRowModal overviewType={OverviewTypes.Pipeline.Order} />
    <DeleteOrderRowModal overviewType={OverviewTypes.OrderRow} />
    <EditOrderModal overviewType={OverviewTypes.Pipeline.Order} />
    <DeleteNoteModal overviewType={OverviewTypes.Pipeline.Qualified_Note} />
    <EditNoteModal overviewType={OverviewTypes.Pipeline.Qualified_Note} />
    <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Pipeline.Qualified_Note} />
    {/*<CreateTaskModal overviewType={OverviewTypes.Pipeline.Order_Task} hideLead isGlobal />*/}
    <CreateTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} hideLead isGlobal />
    <CopyQualifiedModal overviewType={OverviewTypes.Pipeline.Order} />
    <CopyOrderModal overviewType={OverviewTypes.Pipeline.Order} />
    <SuggestedActions overviewType={OverviewTypes.Pipeline.Order} />

    <ChangeReponsibleModal overviewType={OverviewTypes.Pipeline.Order} />
    <UpdateDataFieldsModal objectType={ObjectTypes.PipelineQualified} overviewType={OverviewTypes.Pipeline.Order} />

    <CreateAppointmentModal overviewType={OverviewTypes.Pipeline.Qualified_Appointment} />

    {/* TASK MODAL */}
    <DuplicateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} hideAccount />
    <SetTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <EditTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <DeleteTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AssignTagToTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AssignTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AcceptedDelegateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <DeclineDelegateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />

    <SetLostDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SetWonDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SelectClousureDateModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SuggestedActions overviewType={OverviewTypes.Pipeline.Qualified} />
    <AddFileModal overviewType={OverviewTypes.Pipeline.Order} />
  </>
}

const OrderOverview = () => {
  return (
    <Overview hasPeriodSelector hasQualifiedValue hasSalesMethod route="/pipeline/orders">
      <RoutingObjectFeature/>
    </Overview>
  );
};
export default compose(
  connect(
    (state) => {
      return {
        orderSale: state.entities.qualifiedDeal.__ORDER_SALE ? state.entities.qualifiedDeal.__ORDER_SALE : {},
      };
    },
    {
      fetchListActivity,
      fetchListBysale,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.orderSale !== nextProps.orderSale) {

        this.props.fetchListBysale(nextProps.orderSale.saleId, ObjectTypes.PipelineOrder);
      }
    },
  }),
  withGetData(({ fetchListActivity }) => () => {
    fetchListActivity();
  })
)(OrderOverview);

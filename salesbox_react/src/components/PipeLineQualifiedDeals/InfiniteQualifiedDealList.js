import * as React from 'react';
import createOverview from '../Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { getSearch } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import InfiniteUnqualifiedDealListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteQualifiedDealListRow';
import { getSaleProcessActive } from './qualifiedDeal.selector';
import { fetchListBysale, getOpportunityReportInfo } from './qualifiedDeal.actions';
import { TaskStepsBoard } from './TaskSteps/TaskStepsBoard';
import { fetchQualifiedData } from './qualifiedDeal.actions';
import AddToMailchimpListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import SetLostDealModal from './SetLostDealModal/SetLostDealModal';
import SelectClousureDateModal from './SelectClosureDateModal/SelectClousureDateModal';
import SuggestedActions from './SuggestedActions';
import SetWonDealModal from './SetWonDealModal/SetWonDealModal';
import DeleteQualifiedDealModal from './DeleteQualifiedDealModal/DeleteQualifiedDealModal';
import DeleteMultiModal from './DeleteMultiModal/DeleteMultiModal';
import DeleteConnectedObjectModal from './DeleteConnectedObjectModal/DeleteConnectedObjectModal';
import DeleteOpportunityWithManyUsersConnectedModal from './DeleteOpportunityWithManyUsersConnectedModal/DeleteOpportunityWithManyUsersConnectedModal';
import CopyQualifiedModal from './CopyQualifiedModal';
import EditOrderRowModal from '../OrderRow/EditOrderRowModal';
import DeleteOrderRowModal from '../OrderRow/DeleteModal';
import EditQualifiedModal from './EditQualifiedModal';
import { updateSalesProcessAndMode } from 'components/AdvancedSearch/advanced-search.actions';
//TASK
// import CreateTaskModal from '../Task/CreateTaskModal/CreateTaskModal';
import SetTaskModal from '../Task/SetTaskModal/SetTaskModal';
import DuplicateModal from '../Task/DuplicateModal';
import EditTaskModal from '../Task/EditTaskModal/EditTaskModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import AssignTagToTaskModal from '../Task/AssignTagToTaskModal/AssignTagToTaskModal';
import AssignTaskModal from '../Task/AssignTaskModal/AssignTaskModal';
import AcceptedDelegateModal from '../Task/AcceptedDelegateModal';
import DeclineDelegateModal from '../Task/DeclineDelegateModal';

// NOTE:
import EditNoteModal from '../NotesChat/ModalEditNote';
import DeleteNoteModal from '../NotesChat/DeleteNoteModal';
import AddCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';

import ChangeReponsibleModal from '../PipeLineQualifiedDeals/ChangeReponsible/ChangeReponsible';
import UpdateDataFieldsModal from './UpdateDataFieldsModal/index';

//set sales target
import SetDalesTargetModal from './Insight/SetSalesTargetModal';

// PHOTO
import ModalEditPhoto from '../Common/PhotosPane/ModalEditPhoto';
import DeletePhotoModal from '../Common/PhotosPane/DeletePhotoModal';
import AddPhotoModal from '../Common/PhotosPane/AddPhotoModal';

//Document
import AddFolderModal from '../Common/DocumentsPane/AddFolderModal';
import AddFileModal from '../Common/DocumentsPane/AddFileModal';
// import CreateAppointmentModal from "../Appointment/CreateAppointmentModal/CreateAppointmentModal";

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import AddInviteeModal from "../Appointment/AddInvites/AddInviteeModal";
//Meetings
import EditAppointmentModal from 'components/Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from 'components/Appointment/DeleteAppointmentModal/DeleteAppointmentModal';

const header = (width) => (
  <HeaderComponent
    objectType={ObjectTypes.PipelineQualified}
    width={width}
    overviewType={OverviewTypes.Pipeline.Qualified}
  />
);

const Overview = createOverview(
  OverviewTypes.Pipeline.Qualified,
  ObjectTypes.PipelineQualified,
  Colors.Pipeline,
  header,
  InfiniteUnqualifiedDealListRow,
  PlaceholderComponent,
  TaskStepsBoard
);

export const QualifiedObjectFeature = ({ })=> {
  return <>
    <AddToMailchimpListModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.Pipeline.Qualified} />
    <SetLostDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SetWonDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SelectClousureDateModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <SuggestedActions overviewType={OverviewTypes.Pipeline.Qualified} />

    {/* <CreateAppointmentModal overviewType={OverviewTypes.Pipeline.Qualified_Appointment} /> */}

    {/* MASS UPDATE */}
    <AddCallListModal overviewType={OverviewTypes.Pipeline.Qualified} />
    {/* TASK MODAL */}
    <DuplicateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} hideAccount />
    <SetTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <EditTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <DeleteTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AssignTagToTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AssignTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <AcceptedDelegateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    <DeclineDelegateModal overviewType={OverviewTypes.Pipeline.Qualified_Task} />
    {/* <CreateTaskModal overviewType={OverviewTypes.Pipeline.Qualified_Task} hideLead isGlobal /> */}

    {/* NOTE */}
    <DeleteNoteModal overviewType={OverviewTypes.Pipeline.Qualified_Note} />
    <EditNoteModal overviewType={OverviewTypes.Pipeline.Qualified_Note} />
    {/* <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Pipeline.Qualified_Note} /> */}
    <ChangeReponsibleModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <UpdateDataFieldsModal objectType={ObjectTypes.PipelineQualified} overviewType={OverviewTypes.Pipeline.Qualified} />

    <DeleteQualifiedDealModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <DeleteMultiModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <DeleteOpportunityWithManyUsersConnectedModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <DeleteConnectedObjectModal overviewType={OverviewTypes.Pipeline.Qualified} />

    <CopyQualifiedModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <CopyQualifiedModal overviewType={OverviewTypes.Pipeline.Qualified_Copy} />
    <EditOrderRowModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <DeleteOrderRowModal overviewType={OverviewTypes.OrderRow} />
    <SetDalesTargetModal overviewType={OverviewTypes.Pipeline.Qualified} />
    <EditQualifiedModal overviewType={OverviewTypes.Pipeline.Qualified} />

    {/* PHOTO */}
    <ModalEditPhoto overviewType={OverviewTypes.Pipeline.Qualified_Photo} />
    <DeletePhotoModal overviewType={OverviewTypes.Pipeline.Qualified_Photo} />
    <AddPhotoModal overviewType={OverviewTypes.Pipeline.Qualified_Photo} />

    {/* Document */}
    <AddFolderModal overviewType={OverviewTypes.Pipeline.Qualified_Document} />
    <AddFileModal overviewType={OverviewTypes.Pipeline.Qualified} />

    {/*Meeting appointment*/}
    <AddInviteeModal overviewType={OverviewTypes.Pipeline.Qualified_Appointment} />
    <EditAppointmentModal overviewType={OverviewTypes.Pipeline.Qualified_Appointment} />
    <DeleteAppointmentModal overviewType={OverviewTypes.Pipeline.Qualified_Appointment} />

  </>
}

const TaskStepsOverview = () => {
  return (
    <Overview hasPeriodSelector hasQualifiedValue hasSalesMethod route="/pipeline/overview">
      <RoutingObjectFeature />
    </Overview>
  );
};

export default compose(
  connect(
    (state) => {
      const { qualifiedDeal } = state.entities;
      const saleProcess = getSaleProcessActive(state);
      const salesProcessIds = saleProcess ? saleProcess : null;
      const search = getSearch(state, ObjectTypes.PipelineQualified);
      const period = getPeriod(state, ObjectTypes.PipelineQualified);
      const { roleType } = state.ui.app;
      return {
        term: search.term,
        period,
        roleType,
        salesProcessIds,
        activeRole: state.ui.app.activeRole,
        listShow: qualifiedDeal.__COMMON_DATA ? qualifiedDeal.__COMMON_DATA.listShow : false
      };
    },
    {
      updateSalesProcessAndMode,
      fetchQualifiedData,
      fetchListBysale,
      getOpportunityReportInfo
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.salesProcessIds !== nextProps.salesProcessIds) {
        if (nextProps.listShow) {
          this.props.fetchListBysale(nextProps.salesProcessIds, ObjectTypes.PipelineQualified);
          this.props.updateSalesProcessAndMode(OverviewTypes.Pipeline.Qualified, this.props.salesProcessIds, 'DYNAMIC')
        }
      }
      const { roleType, activeRole, term, period, fetchQualifiedData, getOpportunityReportInfo } = this.props;

      if (term !== nextProps.term  ||
        period !== nextProps.period ||
        roleType !== nextProps.roleType ||
        activeRole !== nextProps.activeRole
      ) {
        fetchQualifiedData();
        getOpportunityReportInfo();
      }
    },
  }),
  withGetData(({ fetchQualifiedData, getOpportunityReportInfo }) => () => {
    fetchQualifiedData();
    getOpportunityReportInfo();
  })
)(TaskStepsOverview);

// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import DeleteUnqualifiedDealModal from 'components/PipeLineUnqualifiedDeals/DeleteUnqualifiedDealModal/DeleteUnqualifiedDealModal';
import EditTaskModal from 'components/Task/EditTaskModal/EditTaskModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import EditPipelineModal from './EditPipelineModal/EditPipelineModal';
import AssignTagToTaskModal from '../Task/AssignTagToTaskModal/AssignTagToTaskModal';
import AssignTaskModal from '../Task/AssignTaskModal/AssignTaskModal';
import AcceptedDelegateModal from '../Task/AcceptedDelegateModal';
import DeclineDelegateModal from '../Task/DeclineDelegateModal';
import SetToDoneModal from '../PipeLineUnqualifiedDeals/SetToDoneModal';

import InfiniteUnqualifiedDealListRow, {
  HeaderComponent,
  PlaceholderComponent,
} from './InfiniteUnqualifiedDealListRow';
import DelegationModal from "./DelegateModal/DelegateModal";
import DeleteAndSetDoneMutilModal from "./DeleteAndSetDoneMutil/DeleteAndSetDoneMutilModal";
import ChangeReponsibleModal from "./ChangeReponsible/ChangeReponsible";
import UpdateStatusModal from './UpdateStatus/UpdateStatusModal';
import AcceptedDelegateUnqualifiedModal from './AcceptedDelegateModal';
import DeclineDelegateUnqualifiedModal from './DeclineDelegateModal';
import AddToMailchimpListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import CreateTaskModal from '../Task/CreateTaskModal/CreateTaskModal';
import SetTaskModal from '../Task/SetTaskModal/SetTaskModal';
import AddToCallListModal from './AddCallListModal/AddCallListModal';
import DuplicateModal from '../Task/DuplicateModal';

// NOTE:
import EditNoteModal from '../NotesChat/ModalEditNote';
import DeleteNoteModal from '../NotesChat/DeleteNoteModal';
import UpdateDataFieldsModal from './UpdateDataFieldsModal/index';

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import CreateAppointmentModal from "../Appointment/CreateAppointmentModal/CreateAppointmentModal";
import AddInviteeModal from "../Appointment/AddInvites/AddInviteeModal";
//Meetings
import EditAppointmentModal from 'components/Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from 'components/Appointment/DeleteAppointmentModal/DeleteAppointmentModal';

const header = (width) => <HeaderComponent
  objectType={ObjectTypes.Lead}
  width={width}
  overviewType={OverviewTypes.Pipeline.Lead} />;

const Overview = createOverview(
  OverviewTypes.Pipeline.Lead,
  ObjectTypes.Lead,
  Colors.Pipeline,
  header,
  InfiniteUnqualifiedDealListRow,
  PlaceholderComponent
);


export const UnqualifiedObjectFeature = () => {
  return (
    <>
      <DeleteUnqualifiedDealModal overviewType={OverviewTypes.Pipeline.Lead} />
      <DelegationModal overviewType={OverviewTypes.Pipeline.Lead} />
      <EditPipelineModal overviewType={OverviewTypes.Pipeline.Lead} />
      <SetToDoneModal overviewType={OverviewTypes.Pipeline.Lead} />
      <UpdateStatusModal overviewType={OverviewTypes.Pipeline.Lead} />
      <AddToMailchimpListModal overviewType={OverviewTypes.Pipeline.Lead} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.Pipeline.Lead} />

      {/* NOTE */}
      <DeleteNoteModal overviewType={OverviewTypes.Pipeline.Lead_Note} />
      <EditNoteModal overviewType={OverviewTypes.Pipeline.Lead_Note} />
      <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Pipeline.Lead_Note} />

      {/* TASK MODAL */}
      <DuplicateModal overviewType={OverviewTypes.Pipeline.Lead_Task} hideAccount />
      <SetTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <EditTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <DeleteTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <AssignTagToTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <AssignTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <AcceptedDelegateModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <DeclineDelegateModal overviewType={OverviewTypes.Pipeline.Lead_Task} />
      <CreateTaskModal overviewType={OverviewTypes.Pipeline.Lead_Task} hideLead isGlobal />

      <DeleteAndSetDoneMutilModal modalType="delete_multi" overviewType={OverviewTypes.Pipeline.Lead} />
      <ChangeReponsibleModal overviewType={OverviewTypes.Pipeline.Lead} />
      <DeleteAndSetDoneMutilModal modalType="set_done_multi" overviewType={OverviewTypes.Pipeline.Lead} />
      <AcceptedDelegateUnqualifiedModal overviewType={OverviewTypes.Pipeline.Lead} />
      <DeclineDelegateUnqualifiedModal overviewType={OverviewTypes.Pipeline.Lead} />
      <AddToCallListModal overviewType={OverviewTypes.Pipeline.Lead} />
      <UpdateDataFieldsModal objectType={ObjectTypes.Lead} overviewType={OverviewTypes.Pipeline.Lead} />
      {/*Meeting appointment*/}
      <CreateAppointmentModal overviewType={OverviewTypes.Pipeline.Lead_Appointment} />
      <AddInviteeModal overviewType={OverviewTypes.Pipeline.Lead_Appointment} />
      <EditAppointmentModal overviewType={OverviewTypes.Pipeline.Lead_Appointment} />
      <DeleteAppointmentModal overviewType={OverviewTypes.Pipeline.Lead_Appointment} />

    </>
  )
}

const InfiniteUnqualifiedDealListOverview = () => {
  return <Overview hasFilter hasHistory hasPeriodSelector hasAdd >
    <RoutingObjectFeature/>
  </Overview>;
};

export default InfiniteUnqualifiedDealListOverview;

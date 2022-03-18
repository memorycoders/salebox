// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';

// import EditContactModal from 'components/Contact/Modals/EditContactModal';
import EditContactModal from '../Contact/EditContactModal';
import DeleteContactModal from 'components/Contact/DeleteContactModal/DeleteContactModal';
import InfiniteContactListRow, { PlaceholderComponent } from './InfiniteContactListRow';
import HeaderComponent from './HeaderContactList/HeaderContactList';

//TASK
import CreateTaskModal from '../Task/CreateTaskModal/CreateTaskModal';
import SetTaskModal from '../Task/SetTaskModal/SetTaskModal';
import DuplicateModal from '../Task/DuplicateModal';
import EditTaskModal from '../Task/EditTaskModal/EditTaskModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import AssignTagToTaskModal from '../Task/AssignTagToTaskModal/AssignTagToTaskModal';
import AssignTaskModal from '../Task/AssignTaskModal/AssignTaskModal';
import AcceptedDelegateModal from '../Task/AcceptedDelegateModal';
import DeclineDelegateModal from '../Task/DeclineDelegateModal';
import ChangeReponsibleModal from '../Contact/ChangeReponsible/ChangeReponsible';
// NOTE:
import EditNoteModal from '../NotesChat/ModalEditNote';
import DeleteNoteModal from '../NotesChat/DeleteNoteModal';

// PHOTO
import ModalEditPhoto from '../Common/PhotosPane/ModalEditPhoto';
import DeletePhotoModal from '../Common/PhotosPane/DeletePhotoModal';
import AddPhotoModal from '../Common/PhotosPane/AddPhotoModal';

//
import DeleteCallListModal from './CallList/DeleteCallListModal';
import AddRelation from '../MultiRelation/AddRelation';
import ChangeReponsible from '../../components/PipeLineQualifiedDeals/ChangeReponsible/ChangeReponsible';

import SetLostDealModal from '../../components/PipeLineQualifiedDeals/SetLostDealModal/SetLostDealModal';
import SetWonDealModal from '../../components/PipeLineQualifiedDeals/SetWonDealModal/SetWonDealModal';
import SelectClousureDateModal from '../../components/PipeLineQualifiedDeals/SelectClosureDateModal/SelectClousureDateModal';
import SuggestedActions from '../../components/PipeLineQualifiedDeals/SuggestedActions';
import CopyQualifiedModal from '../PipeLineQualifiedDeals/CopyQualifiedModal';
import EditOrderRowModal from '../OrderRow/EditOrderRowModal';
import DeleteOrderRowModal from '../OrderRow/DeleteModal';
import SetDalesTargetModal from '../PipeLineQualifiedDeals/Insight/SetSalesTargetModal';
import EditQualifiedModal from '../PipeLineQualifiedDeals/EditQualifiedModal';
import CopyOrderModal from '../PipeLineQualifiedDeals/CopyOrderModal';
import CreatePipelineModal from 'components/PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import AddToMailchimpListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import CreateQualifiedModal from '../PipeLineQualifiedDeals/CreateQualifiedModal';
import DeleteUnqualifiedDealModal from 'components/PipeLineUnqualifiedDeals/DeleteUnqualifiedDealModal/DeleteUnqualifiedDealModal';
import SetToDoneModal from '../PipeLineUnqualifiedDeals/SetToDoneModal';
import AcceptedDelegateUnqualifiedModal from '../PipeLineUnqualifiedDeals/AcceptedDelegateModal';
import DeclineDelegateUnqualifiedModal from '../PipeLineUnqualifiedDeals/DeclineDelegateModal';
import EditPipelineModal from '../PipeLineUnqualifiedDeals/EditPipelineModal/EditPipelineModal';
import AssignTaskToMeModal from '../Lead/AssignLeadModal/AssignToMeModal';
import DeleteQualifiedDealModal from '../PipeLineQualifiedDeals/DeleteQualifiedDealModal/DeleteQualifiedDealModal';
import AssignModal from '../Lead/AssignModal';
import DeleteOpportunityWithManyUsersConnectedModal from '../PipeLineQualifiedDeals/DeleteOpportunityWithManyUsersConnectedModal/DeleteOpportunityWithManyUsersConnectedModal';
import DeleteConnectedObjectModal from '../PipeLineQualifiedDeals/DeleteConnectedObjectModal/DeleteConnectedObjectModal';

//UpdateDataFieldsModal
import UpdateDataFieldsModal from './UpdateDataFieldsModal/index';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
// import CreateQualifiedModal from "../PipeLineQualifiedDeals/CreateQualifiedModal";
// import CreatePipelineModal from 'components/PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import ConfirmAccountDeactivateAllModal from './ConfirmDeactivateAllModal/ConfirmDeactivateAllModal';
import AddCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';
import CreateOrderModal from '../PipeLineQualifiedDeals/CreateOrderModal';
import DelegationModal from '../PipeLineUnqualifiedDeals/DelegateModal/DelegateModal';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import AddFolderModal from '../Common/DocumentsPane/AddFolderModal';
import AddFileModal from '../Common/DocumentsPane/AddFileModal';
import DeleteMultiModal from '../PipeLineQualifiedDeals/DeleteMultiModal/DeleteMultiModal';
import CreateContactModal from './CreateContactModal';

//ComminicationDetailModal
import ComminicationDetailModal from './LatestCommunicationPane/CommunicationDetailModal';
import DeleteCommunicationModal from './LatestCommunicationPane/DeleteCommunicationModal';
import AddContactModal from '../../components/Organisation/AddContactModal';
import CreateAppointmentModal from '../Appointment/CreateAppointmentModal/CreateAppointmentModal';
import AddInviteeModal from '../Appointment/AddInvites/AddInviteeModal';
import EditAppointmentModal from '../Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from '../Appointment/DeleteAppointmentModal/DeleteAppointmentModal';

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import DeleteMultiCallListContactModal from '../Organisation/DeleteMultiModal/DeleteMultiModal';
import InviteToTeamsModal from './InviteToTeamsModal';

// FIXME: Bring me inside Overview component.
const header = (width) => (
  <HeaderComponent width={width} objectType={ObjectTypes.Contact} overviewType={OverviewTypes.Contact} />
);

const Overview = createOverview(
  OverviewTypes.Contact,
  ObjectTypes.Contact,
  Colors.Contact,
  header,
  InfiniteContactListRow,
  PlaceholderComponent
);

export const ContactObjectFeature = () => {
  return (
    <>
      <DeleteContactModal overviewType={OverviewTypes.Contact} />
      <ConfirmAccountDeactivateAllModal overviewType={OverviewTypes.Contact} />
      <EditContactModal overviewType={OverviewTypes.Contact} />
      <AddCallListModal overviewType={OverviewTypes.Contact} />
      <DeleteMultiModal overviewType={OverviewTypes.Contact} />
      <AddCallListModal overviewType={OverviewTypes.Contact_Contact} />
      {/* <CreateAppointmentModal overviewType={OverviewTypes.Contact_Appointment} /> */}
      <CreateOrderModal overviewType={OverviewTypes.Contact_Order} />

      {/* TASK MODAL */}
      <DuplicateModal overviewType={OverviewTypes.Contact_Task} hideAccount />
      <SetTaskModal overviewType={OverviewTypes.Contact_Task} />
      <EditTaskModal overviewType={OverviewTypes.Contact_Task} />
      <DeleteTaskModal overviewType={OverviewTypes.Contact_Task} />
      <AssignTagToTaskModal overviewType={OverviewTypes.Contact_Task} />
      <AssignTaskModal overviewType={OverviewTypes.Contact_Task} />
      <AcceptedDelegateModal overviewType={OverviewTypes.Contact_Task} />
      <DeclineDelegateModal overviewType={OverviewTypes.Contact_Task} />
      <CreateTaskModal overviewType={OverviewTypes.Contact_Task} hideLead isGlobal />
      <ChangeReponsibleModal overviewType={OverviewTypes.Contact} />
      <ChangeReponsibleModal overviewType={OverviewTypes.Contact_Contact} />
      <ChangeReponsible overviewType={OverviewTypes.Contact_Qualified} />
      <ChangeReponsible overviewType={OverviewTypes.Contact_Order} />
      {/* NOTE */}
      <DeleteNoteModal overviewType={OverviewTypes.Contact_Note} />
      <EditNoteModal overviewType={OverviewTypes.Contact_Note} />
      <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Contact_Note} />
      <EditNoteModal overviewType={OverviewTypes.Contact_Order} />
      <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Contact_Order} />

      {/* PHOTO */}
      <ModalEditPhoto overviewType={OverviewTypes.Contact_Photo} />
      <DeletePhotoModal overviewType={OverviewTypes.Contact_Photo} />
      <AddPhotoModal overviewType={OverviewTypes.Contact_Photo} />

      {/*unqualified*/}
      <CreatePipelineModal overviewType={OverviewTypes.Contact_Unqualified_Multi} />
      <CreatePipelineModal overviewType={OverviewTypes.Contact_Unqualified} />
      <AddToMailchimpListModal overviewType={OverviewTypes.Contact} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.Contact} />
      <CreatePipelineModal overviewType={OverviewTypes.Contact_Contact_Unqualified} />
      <CreatePipelineModal overviewType={OverviewTypes.Contact_Quick_Unqualified} />

      {/*qualified*/}
      <CreateQualifiedModal overviewType={OverviewTypes.Contact_Qualified} />
      <CreateQualifiedModal overviewType={OverviewTypes.Contact_Qualified_Multi} />
      <CreateQualifiedModal overviewType={OverviewTypes.Contact_Contact_Qualified} />
      <CreateQualifiedModal overviewType={OverviewTypes.Contact_Quick_Qualified} />

      <CreateOrderModal overviewType={OverviewTypes.Contact_Order_Multi} />
      {/*unqualified sub*/}
      <SetToDoneModal overviewType={OverviewTypes.Contact_Unqualified} />
      <DeleteUnqualifiedDealModal overviewType={OverviewTypes.Contact_Unqualified} />
      <AssignModal overviewType={OverviewTypes.Contact_Unqualified} />
      <AssignTaskToMeModal overviewType={OverviewTypes.Contact_Unqualified} />
      <AcceptedDelegateUnqualifiedModal overviewType={OverviewTypes.Contact_Unqualified} />
      <DeclineDelegateUnqualifiedModal overviewType={OverviewTypes.Contact_Unqualified} />
      <EditPipelineModal overviewType={OverviewTypes.Contact_Unqualified} />

      <CreateQualifiedModal overviewType={OverviewTypes.Contact_Unqualified_Qualified} />
      <CreateOrderModal overviewType={OverviewTypes.Contact_Unqualified_Order} />

      <DelegationModal overviewType={OverviewTypes.Contact_Unqualified} />

      {/*qualified sub*/}
      <SetLostDealModal overviewType={OverviewTypes.Contact_Qualified} />
      <SetWonDealModal overviewType={OverviewTypes.Contact_Qualified} />
      <SelectClousureDateModal overviewType={OverviewTypes.Contact_Qualified} />
      <SuggestedActions overviewType={OverviewTypes.Contact_Qualified} />
      <CreateTaskModal overviewType={OverviewTypes.Contact_Qualified_Task} hideLead isGlobal />
      <DeleteQualifiedDealModal overviewType={OverviewTypes.Contact_Qualified} />
      <DeleteQualifiedDealModal overviewType={OverviewTypes.Contact_Order} />
      <DeleteOpportunityWithManyUsersConnectedModal overviewType={OverviewTypes.Contact_Qualified} />
      <DeleteConnectedObjectModal overviewType={OverviewTypes.Contact_Qualified} />
      <CopyQualifiedModal overviewType={OverviewTypes.Contact_Qualified} />
      <EditOrderRowModal overviewType={OverviewTypes.Contact_Qualified} />
      <SetDalesTargetModal overviewType={OverviewTypes.Contact_Qualified} />
      <EditQualifiedModal overviewType={OverviewTypes.Contact_Qualified} />

      <DeleteCallListModal overviewType={OverviewTypes.Contact} />

      {/*order sub*/}
      <CreateTaskModal overviewType={OverviewTypes.Contact_Order_Task} hideLead isGlobal />

      {/* !!!: RELATION */}
      {/* <AddCallListModal overviewType={OverviewTypes.Account} /> */}
      <AddRelation isContact objectType={ObjectTypes.Contact} overviewType={OverviewTypes.Contact} />

      {/* !!!: UpdateDataFieldsModal */}
      <UpdateDataFieldsModal overviewType={OverviewTypes.Contact} />
      <EditOrderRowModal overviewType={OverviewTypes.Contact_Qualified_Product} />
      <CopyQualifiedModal overviewType={OverviewTypes.Contact_Qualified_Copy} />

      {/* Document */}
      <AddFolderModal overviewType={OverviewTypes.Contact} />
      <AddFileModal overviewType={OverviewTypes.Contact} />

      <EditOrderRowModal overviewType={OverviewTypes.Contact_Order_Product} />
      <CopyOrderModal overviewType={OverviewTypes.Contact_Order_Copy} />

      <CreateContactModal overviewType={OverviewTypes.Contact_Add_Colleague} />
      {/*colleague*/}
      <DeleteContactModal overviewType={OverviewTypes.Contact_Contact} />
      <ConfirmAccountDeactivateAllModal overviewType={OverviewTypes.Contact_Contact} />

      <ComminicationDetailModal overviewType={OverviewTypes.Contact} />
      <DeleteCommunicationModal overviewType={OverviewTypes.Contact} />
      <AddContactModal overviewType={OverviewTypes.Contact_Order_Contact} />
      <AddContactModal overviewType={OverviewTypes.Contact_Qualified_Contact} />

      {/* appoinment */}
      <AddInviteeModal overviewType={OverviewTypes.Contact_Appointment} />
      <EditAppointmentModal overviewType={OverviewTypes.Contact_Appointment} />
      <DeleteAppointmentModal overviewType={OverviewTypes.Contact_Appointment} />

      {/* Mass spinner */}
      <AddToMailchimpListModal overviewType={OverviewTypes.CallList.Contact} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.CallList.Contact} />
      <DeleteMultiCallListContactModal overviewType={OverviewTypes.CallList.Contact} />

      <EditContactModal overviewType={OverviewTypes.CallList.SubContact} />

      <InviteToTeamsModal overviewType={OverviewTypes.Contact} />
    </>
  );
};

const InfiniteContactListOverview = () => {
  return (
    <Overview hasPeriodSelector hasFilter>
      <RoutingObjectFeature />
    </Overview>
  );
};

export default InfiniteContactListOverview;

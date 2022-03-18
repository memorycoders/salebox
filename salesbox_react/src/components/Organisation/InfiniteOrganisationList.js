// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';

import EditAccountModal from 'components/Organisation/EditAccountModal';
import DeleteAccountModal from 'components/Organisation/Modals/DeleteAccountModal';
import InfiniteAccountListRow, { PlaceholderComponent } from './InfiniteAccountListRow';
import HeaderComponent from './HeaderAccountList/HeaderAccountList';

import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
// import CreateTaskModal from "../Task/CreateTaskModal/CreateTaskModal";
import DeleteOrganisationModal from "./DeleteOrganisationModal/DeleteOrganisationModal";
import ConfirmDeactivateAllModal from "./ConfirmDeactivateAllModal/ConfirmDeactivateAllModal";
import ChangeReponsibleModal from '../Organisation/ChangeReponsible/ChangeReponsible';
import ChangeReponsible from '../../components/PipeLineQualifiedDeals/ChangeReponsible/ChangeReponsible'
import ChangeReponsibleDialog from '../../components/Contact/ChangeReponsible/ChangeReponsible'
// NOTE:
import EditNoteModal from '../NotesChat/ModalEditNote';
import DeleteNoteModal from '../NotesChat/DeleteNoteModal';

// PHOTO
import ModalEditPhoto from '../Common/PhotosPane/ModalEditPhoto';
import DeletePhotoModal from '../Common/PhotosPane/DeletePhotoModal';
import AddPhotoModal from '../Common/PhotosPane/AddPhotoModal';

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
import DeleteCallListModal from './CallList/DeleteCallListModal';
import AddRelation from '../MultiRelation/AddRelation';
import EditAppointmentTargetModal from './AccountTargetPane/EditAppointmentModal';
import EditTargetModal  from './AccountTargetPane/EditSaleTargetModal';
import DeleteMultiModal from "../Organisation/DeleteMultiModal/DeleteMultiModal";
import AddCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';

//Unqualified
import CreatePipelineModal from 'components/PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import AddToMailchimpListModal from "../Task/AddToMailchimpListModal/AddToMailchimpListModal";
import CreateQualifiedModal from "../PipeLineQualifiedDeals/CreateQualifiedModal";
import DeleteUnqualifiedDealModal from 'components/PipeLineUnqualifiedDeals/DeleteUnqualifiedDealModal/DeleteUnqualifiedDealModal';

//ComminicationDetailModal
import ComminicationDetailModal from '../Contact/LatestCommunicationPane/CommunicationDetailModal';
import DeleteCommunicationModal from '../Contact/LatestCommunicationPane/DeleteCommunicationModal';
import SetToDoneModal from "../PipeLineUnqualifiedDeals/SetToDoneModal";

//DATA FIELD
import UpdateDataFieldsModal from './UpdateDataFieldsModal/index';
import AssignModal from "../Lead/AssignModal";
import AssignTaskToMeModal from "../Lead/AssignLeadModal/AssignToMeModal";
import AcceptedDelegateUnqualifiedModal from "../PipeLineUnqualifiedDeals/AcceptedDelegateModal";
import DeclineDelegateUnqualifiedModal from "../PipeLineUnqualifiedDeals/DeclineDelegateModal";
import EditPipelineModal from "../PipeLineUnqualifiedDeals/EditPipelineModal/EditPipelineModal";
import DeleteQualifiedDealModal from "../PipeLineQualifiedDeals/DeleteQualifiedDealModal/DeleteQualifiedDealModal";
import DeleteOpportunityWithManyUsersConnectedModal
  from "../PipeLineQualifiedDeals/DeleteOpportunityWithManyUsersConnectedModal/DeleteOpportunityWithManyUsersConnectedModal";
import DeleteConnectedObjectModal
  from "../PipeLineQualifiedDeals/DeleteConnectedObjectModal/DeleteConnectedObjectModal";

import SetLostDealModal from '../../components/PipeLineQualifiedDeals/SetLostDealModal/SetLostDealModal'
import SetWonDealModal from '../../components/PipeLineQualifiedDeals/SetWonDealModal/SetWonDealModal'
import SelectClousureDateModal from '../../components/PipeLineQualifiedDeals/SelectClosureDateModal/SelectClousureDateModal';
import SuggestedActions from '../../components/PipeLineQualifiedDeals/SuggestedActions';
import CopyQualifiedModal from "../PipeLineQualifiedDeals/CopyQualifiedModal";
import EditOrderRowModal from "../OrderRow/EditOrderRowModal";
import DeleteOrderRowModal from "../OrderRow/DeleteModal";
import SetDalesTargetModal from "../PipeLineQualifiedDeals/Insight/SetSalesTargetModal";
import EditQualifiedModal from "../PipeLineQualifiedDeals/EditQualifiedModal";
import CopyOrderModal from "../PipeLineQualifiedDeals/CopyOrderModal";
//contact
import DeleteContactModal from "../Contact/DeleteContactModal/DeleteContactModal";
import ConfirmAccountDeactivateAllModal from "../Contact/ConfirmDeactivateAllModal/ConfirmDeactivateAllModal";
import AddFileModal from '../Common/DocumentsPane/AddFileModal';
import FormAddNewMailchimpList from "../Task/FormAddNewMailchimp/FormAddNewMailchimpList";
import CreateOrderModal from "../PipeLineQualifiedDeals/CreateOrderModal";
import DelegationModal from "../PipeLineUnqualifiedDeals/DelegateModal/DelegateModal";

import CreateContactModal from '../Contact/CreateContactModal';
import { ContactObjectFeature } from '../Contact/InfiniteContactList'
import AddContactModal from './AddContactModal';
import CreateAppointmentModal from '../Appointment/CreateAppointmentModal/CreateAppointmentModal';

import AddInviteeModal from '../Appointment/AddInvites/AddInviteeModal';
import EditAppointmentModal from '../Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from '../Appointment/DeleteAppointmentModal/DeleteAppointmentModal';
import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature'
// FIXME: Bring me inside Overview component.
const header = (width) => <HeaderComponent objectType={ObjectTypes.Account} width={width} overviewType={OverviewTypes.Account} />;

const Overview = createOverview(
  OverviewTypes.Account,
  ObjectTypes.Account,
  Colors.Account,
  header,
  InfiniteAccountListRow,
  PlaceholderComponent
);

export const AccountObjectFeature = ()=> {
  return <>
    <EditAccountModal overviewType={OverviewTypes.Account} />
    <CreateAppointmentModal overviewType={OverviewTypes.Account_Appointment} />
    <CreateAppointmentModal overviewType={OverviewTypes.Contact_Appointment} />
    <CreateOrderModal overviewType={OverviewTypes.Account_Order} />

    {/*<DeleteAccountModal />*/}
    <ChangeReponsibleModal overviewType={OverviewTypes.Account} />
    <ChangeReponsible overviewType={OverviewTypes.Account_Qualified} />
    <ChangeReponsible overviewType={OverviewTypes.Account_Order} />
    <ChangeReponsibleDialog overviewType={OverviewTypes.Account_Contact} />
    <ChangeReponsibleModal overviewType={OverviewTypes.CallList.Account} />
    <ChangeReponsibleModal overviewType={OverviewTypes.CallList.Contact} />

    {/* NOTE */}
    <DeleteNoteModal overviewType={OverviewTypes.Account_Note} />
    <EditNoteModal overviewType={OverviewTypes.Account_Note} />
    <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Account_Note} />
    <EditNoteModal overviewType={OverviewTypes.Account_Order} />
    <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Account_Order} />

    {/* TASK MODAL */}
    <DuplicateModal overviewType={OverviewTypes.Account_Task} hideAccount />
    <SetTaskModal overviewType={OverviewTypes.Account_Task} />
    <EditTaskModal overviewType={OverviewTypes.Account_Task} />
    <DeleteTaskModal overviewType={OverviewTypes.Account_Task} />
    <AssignTagToTaskModal overviewType={OverviewTypes.Account_Task} />
    <AssignTaskModal overviewType={OverviewTypes.Account_Task} />
    <AcceptedDelegateModal overviewType={OverviewTypes.Account_Task} />
    <DeclineDelegateModal overviewType={OverviewTypes.Account_Task} />
    <CreateTaskModal overviewType={OverviewTypes.Account_Task} hideLead isGlobal />

    <DeleteCallListModal overviewType={OverviewTypes.Account} />

    {/* !!!: RELATION */}
    <AddCallListModal overviewType={OverviewTypes.Account} />
    <AddCallListModal overviewType={OverviewTypes.Account_Contact} />
    <AddRelation objectType={ObjectTypes.Account} overviewType={OverviewTypes.Account} />
    <EditAppointmentTargetModal overviewType={OverviewTypes.Account} />
    <EditTargetModal overviewType={OverviewTypes.Account} />

    <DeleteOrganisationModal overviewType={OverviewTypes.Account} />
    <DeleteMultiModal overviewType={OverviewTypes.Account} />
    <ConfirmDeactivateAllModal overviewType={OverviewTypes.Account} />

    <CreatePipelineModal overviewType={OverviewTypes.Account_Unqualified_Multi} />
    <CreatePipelineModal overviewType={OverviewTypes.Account_Unqualified} />

    <AddToMailchimpListModal overviewType={OverviewTypes.Account} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.Account} />

    {/* PHOTO */}
    <ModalEditPhoto overviewType={OverviewTypes.Account_Photo} />
    <DeletePhotoModal overviewType={OverviewTypes.Account_Photo} />
    <AddPhotoModal overviewType={OverviewTypes.Account_Photo} />
    {/*<CreateQualifiedDealModal  overviewType={OverviewTypes.Account_Qualified}/>*/}
    <CreateQualifiedModal overviewType={OverviewTypes.Account_Qualified} />

    <ComminicationDetailModal overviewType={OverviewTypes.Account} />
    <DeleteCommunicationModal overviewType={OverviewTypes.Account} />

    {/*unqualified sub*/}
    <SetToDoneModal overviewType={OverviewTypes.Account_Unqualified} />
    <SetLostDealModal overviewType={OverviewTypes.Account_Qualified} />
    <SetWonDealModal overviewType={OverviewTypes.Account_Qualified} />
    <SelectClousureDateModal overviewType={OverviewTypes.Account_Qualified} />
    <SuggestedActions overviewType={OverviewTypes.Account_Qualified} />
    <UpdateDataFieldsModal overviewType={OverviewTypes.Account} />
    <DeleteUnqualifiedDealModal overviewType={OverviewTypes.Account_Unqualified} />

    <AssignModal overviewType={OverviewTypes.Account_Unqualified} />
    <AssignTaskToMeModal overviewType={OverviewTypes.Account_Unqualified} />
    <AcceptedDelegateUnqualifiedModal overviewType={OverviewTypes.Account_Unqualified} />
    <DeclineDelegateUnqualifiedModal overviewType={OverviewTypes.Account_Unqualified} />
    <EditPipelineModal overviewType={OverviewTypes.Account_Unqualified} />

    <CreateQualifiedModal overviewType={OverviewTypes.Account_Unqualified_Qualified} />
    <CreateOrderModal overviewType={OverviewTypes.Account_Unqualified_Order} />

    <DelegationModal overviewType={OverviewTypes.Account_Unqualified} />

    {/*qualified sub*/}
    <CreateTaskModal overviewType={OverviewTypes.Account_Qualified_Task} hideLead isGlobal />

    <DeleteQualifiedDealModal overviewType={OverviewTypes.Account_Qualified} />
    <DeleteOpportunityWithManyUsersConnectedModal overviewType={OverviewTypes.Account_Qualified} />
    <DeleteConnectedObjectModal overviewType={OverviewTypes.Account_Qualified} />

    <CopyQualifiedModal overviewType={OverviewTypes.Account_Qualified} />
    <CopyQualifiedModal overviewType={OverviewTypes.Account_Qualified_Copy} />
    <EditOrderRowModal overviewType={OverviewTypes.Account_Qualified} />
    <DeleteOrderRowModal overviewType={OverviewTypes.OrderRow} />
    <SetDalesTargetModal overviewType={OverviewTypes.Account_Qualified} />
    <EditQualifiedModal overviewType={OverviewTypes.Account_Qualified} />

    {/*ORDER sub*/}
    <CreateTaskModal overviewType={OverviewTypes.Account_Order_Task} hideLead isGlobal />
    <DeleteQualifiedDealModal overviewType={OverviewTypes.Account_Order} />

    {/*<CopyQualifiedModal overviewType={OverviewTypes.Account_Order} />*/}
    <CopyOrderModal overviewType={OverviewTypes.Account_Order} />

    <EditOrderRowModal overviewType={OverviewTypes.Account_Order} />
    <SetDalesTargetModal overviewType={OverviewTypes.Account_Order} />
    <EditQualifiedModal overviewType={OverviewTypes.Account_Order} />
    {/*contact*/}
    <DeleteContactModal overviewType={OverviewTypes.Account_Contact} />
    <ConfirmAccountDeactivateAllModal overviewType={OverviewTypes.Account_Contact} />
    <AddFileModal overviewType={OverviewTypes.Account} />
    <CreateContactModal overviewType={OverviewTypes.Account_Contact} />
    <AddContactModal overviewType={OverviewTypes.Account_Qualified_Contact} />
    <AddContactModal overviewType={OverviewTypes.Account_Order_Contact} />

    {/* appoinment */}
    <AddInviteeModal overviewType={OverviewTypes.Account_Appointment}/>
    <EditAppointmentModal overviewType={OverviewTypes.Account_Appointment} />
    <DeleteAppointmentModal overviewType={OverviewTypes.Account_Appointment} />
    {/* <EditNoteModal modalType="add_note" overviewType={OverviewTypes.Contact_Note} /> */}
    <CreateContactModal overviewType={OverviewTypes.Contact_Add_Colleague} />
    <ChangeReponsibleModal overviewType={OverviewTypes.CallList.SubAccount} />


  {/* Mass spinner Calllist Account hereeeee */}
    <AddToMailchimpListModal overviewType={OverviewTypes.CallList.Account} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.CallList.Account} />
    <DeleteMultiModal overviewType={OverviewTypes.CallList.Account} />

    <EditAccountModal overviewType={OverviewTypes.CallList.SubAccount} />
  </>
}

const InfiniteOrganisationList = () => {
  return (
    <Overview hasPeriodSelector hasFilter>

      <RoutingObjectFeature/>
    </Overview>
  );
};

export default InfiniteOrganisationList;

// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import CreateAutomaticListModal from 'components/CallListAccount/CreateAutomaticListModal/CreateAutomaticListModal';
import EditNoteModal from '../NotesChat/ModalEditNote';
// import DeleteContactModal from 'components/CallListAccount/DeleteContactModal/DeleteContactModal';
import InfiniteContactListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteCallListAccountListRow';
import CreateQualifiedModal from "../PipeLineQualifiedDeals/CreateQualifiedModal";
import CreateTaskModal from "../Task/CreateTaskModal/CreateTaskModal";
import AddFileModal from "../Common/DocumentsPane/AddFileModal";
import AddCallListModal from "../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal";
import DeleteOrganisationModal from "../Organisation/DeleteOrganisationModal/DeleteOrganisationModal";
import CreatePipelineModal from '../PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import CreateAppointmentModal from '../Appointment/CreateAppointmentModal/CreateAppointmentModal';
import DeleteCallListAccountModal from './DeleteCallListAccountModal/DeleteCallListAccountModal';
import RemoveAccountFromCallList from './RemoveAccountFromCallList/RemoveAccountFromCallList';
import AddAccountToCallListModal from '../CallListAccount/AddAccountToCallListModal/AddAccountToCallListModal';
import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature'
import AddFolderModal from '../Common/DocumentsPane/AddFolderModal';
import SetAccountModal from './SetAccountModal/SetAccountModal';
const header = (width) => <HeaderComponent overviewType={OverviewTypes.CallList.Account} width={width}/>;

const Overview = createOverview(
  OverviewTypes.CallList.Account,
  ObjectTypes.CallListAccount,
  Colors.CallList,
  header,
  InfiniteContactListRow,
  PlaceholderComponent,
);

const InfiniteCallListAccountListOverview = () => {
  return (
    <Overview hasFilter rowHeight={80} hasHistory hasPeriodSelector hideOnlyPeriod hasGenius hasAdd route="/call-lists/account" >
      <CreateAutomaticListModal />
      <EditNoteModal overviewType={OverviewTypes.CallList.SubAccount} />
      <EditNoteModal modalType="add_note" overviewType={OverviewTypes.CallList.SubAccount} />
      <CreateTaskModal overviewType={OverviewTypes.CallList.SubAccount} hideLead isGlobal />
      <DeleteOrganisationModal overviewType={OverviewTypes.CallList.SubAccount} />
      <CreatePipelineModal overviewType={OverviewTypes.CallList.SubAccount_Unqualified} />
      <SetAccountModal overviewType={OverviewTypes.CallList.Account} />

      <RoutingObjectFeature/>
      <CreateAppointmentModal overviewType={OverviewTypes.Account_Appointment}/>
      <CreateQualifiedModal overviewType={OverviewTypes.CallList.SubAccount_Qualified} />
      <AddCallListModal overviewType={OverviewTypes.CallList.SubAccount} />


      {/* Spinner one row */}
      <DeleteCallListAccountModal overviewType={OverviewTypes.CallList.Account}/>
      <RemoveAccountFromCallList overviewType={OverviewTypes.CallList.SubAccount}/>
      <AddAccountToCallListModal overviewType={OverviewTypes.CallList.Account}/>

      <AddFolderModal overviewType={OverviewTypes.CallList.Account} />
      <AddFileModal overviewType={OverviewTypes.CallList.Account} />
    </Overview>
  );
};

export default InfiniteCallListAccountListOverview;

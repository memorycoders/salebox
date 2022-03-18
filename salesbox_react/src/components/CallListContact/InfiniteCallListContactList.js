// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';
import InfiniteContactListRow, { HeaderComponent, PlaceholderComponent } from './InfiniteCallListContactListRow';
import CreateAutomaticListModal from 'components/CallListAccount/CreateAutomaticListModal/CreateAutomaticListModal';
import DeleteContactModal from '../Contact/DeleteContactModal/DeleteContactModal';
import ConfirmContactDeactivateAllModal from '../Contact/ConfirmDeactivateAllModal/ConfirmDeactivateAllModal';
import CreatePipelineModal from '../PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import EditNoteModal from '../NotesChat/ModalEditNote';
import AddCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';
import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import DeletCallListContactModal from '../CallListContact/DeleteCallListContactModal/DeleteCallListContactModal';
import AddContactToCallList from './AddContactToCallList/AddContactToCallList';
import CreateTaskModal from "../Task/CreateTaskModal/CreateTaskModal";
import ChangeReponsibleModal from '../Contact/ChangeReponsible/ChangeReponsible';
import RemoveContactFromCallList from './RemoveContactFromCallList/RemoveContactFromCallList';
import AddFolderModal from '../Common/DocumentsPane/AddFolderModal';
import AddFileModal from '../Common/DocumentsPane/AddFileModal';
import SetContactModal from './SetContactModal/SetContactModal';

const header = (width) => <HeaderComponent overviewType={OverviewTypes.CallList.Contact} width={width} />;

const Overview = createOverview(
  OverviewTypes.CallList.Contact,
  ObjectTypes.CallListContact,
  Colors.CallList,
  header,
  InfiniteContactListRow,
  PlaceholderComponent
);

const InfiniteContactListOverview = () => {
  return (
    <Overview
      hasFilter
      rowHeight={80}
      hasHistory
      hasPeriodSelector
      hideOnlyPeriod
      hasGenius
      route="/call-lists/contact"
    >
      <CreateAutomaticListModal />
      <RoutingObjectFeature />
      <DeleteContactModal overviewType={OverviewTypes.CallList.SubContact} />
      <ConfirmContactDeactivateAllModal overviewType={OverviewTypes.CallList.SubContact} />
      <AddCallListModal overviewType={OverviewTypes.CallList.SubContact} />
      <CreateTaskModal overviewType={OverviewTypes.CallList.SubContact} hideLead isGlobal />
      <ChangeReponsibleModal overviewType={OverviewTypes.CallList.SubContact} />
      <SetContactModal overviewType={OverviewTypes.CallList.Contact} />

      <EditNoteModal overviewType={OverviewTypes.CallList.SubContact} />
      <EditNoteModal modalType="add_note" overviewType={OverviewTypes.CallList.SubContact} />
      <CreatePipelineModal overviewType={OverviewTypes.CallList.SubContact_Qualified} />
      <DeletCallListContactModal overviewType={OverviewTypes.CallList.Contact} />
      <AddContactToCallList overviewType={OverviewTypes.CallList.Contact} />

      <AddFolderModal overviewType={OverviewTypes.CallList.Contact} />
      <AddFileModal overviewType={OverviewTypes.CallList.Contact} />
      <RemoveContactFromCallList overviewType={OverviewTypes.CallList.SubContact}/>

    </Overview>
  );
};

export default InfiniteContactListOverview;

// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';
import InfiniteLeadListRow, { HeaderComponent, PlaceholderComponent } from '../Lead/InfiniteLeadListRow';
import { CssNames, ObjectTypes, OverviewTypes } from 'Constants';

import EditPipelineModal from '../PipeLineUnqualifiedDeals/EditPipelineModal/EditPipelineModal';
import DeleteLeadModal from '../Lead/DeleteLeadModal';
import AssignModal from '../Lead/AssignModal';
import AssignTaskToMeModal from '../Lead/AssignLeadModal/AssignToMeModal';
import DeleteAndSetDoneMutilModal from '../PipeLineUnqualifiedDeals/DeleteAndSetDoneMutil/DeleteAndSetDoneMutilModal';
import AddToCallListModal from '../PipeLineUnqualifiedDeals/AddCallListModal/AddCallListModal';
import AddToMailchimpListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import UpdateDataFieldsModal from '../PipeLineUnqualifiedDeals/UpdateDataFieldsModal';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import AssignMultiLeadToMeModal from '../Lead/AssignLeadModal/AssignMultiLeadToMeModal';

const header = (width) => (
  <HeaderComponent objectType={ObjectTypes.DelegationLead} overviewType={OverviewTypes.Delegation.Lead} width={width} />
);

const Overview = createOverview(
  OverviewTypes.Delegation.Lead,
  ObjectTypes.DelegationLead,
  CssNames.Delegation,
  header,
  InfiniteLeadListRow,
  PlaceholderComponent
);

const InfiniteTaskListOverview = () => {
  return (
    <Overview hasPeriodSelector route="/delegation/leads">
      <EditPipelineModal overviewType={OverviewTypes.Delegation.Lead} hideOwner />
      <DeleteLeadModal overviewType={OverviewTypes.Delegation.Lead} />
      <AssignModal overviewType={OverviewTypes.Delegation.Lead} />
      <AssignTaskToMeModal overviewType={OverviewTypes.Delegation.Lead} />
      <AssignMultiLeadToMeModal overviewType={OverviewTypes.Delegation.Lead} />
      <DeleteAndSetDoneMutilModal modalType="delete_multi" overviewType={OverviewTypes.Delegation.Lead} />
      <AddToCallListModal overviewType={OverviewTypes.Delegation.Lead} />
      <AddToMailchimpListModal overviewType={OverviewTypes.Delegation.Lead} />
      <UpdateDataFieldsModal overviewType={OverviewTypes.Delegation.Lead} objectType={OverviewTypes.DelegationLead} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.Delegation.Lead} />
    </Overview>
  );
};

export default InfiniteTaskListOverview;

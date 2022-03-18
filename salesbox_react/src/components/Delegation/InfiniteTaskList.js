// @flow
import * as React from 'react';
import EditTaskModal from 'components/Task/EditTaskModal/EditTaskModal';
import AssignTaskModal from 'components/Task/AssignTaskModal/AssignTaskModal';
import AssignTaskToMeModal from 'components/Task/AssignTaskModal/AssignTaskToMeModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import AssignTagToTaskModal from 'components/Task/AssignTagToTaskModal/AssignTagToTaskModal';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';
import AssignDelegateTaskModal from './AssignTaskModal';
import ChangeReponsibleModal from '../Task/ChangeReponsible/ChangeReponsible';
import AddToMailchampListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import DeleteAndSetDoneMutilModal from '../Task/DeleteAndSetDoneMutilTask/DeleteAndSetDoneMutilTaskModal';
import AddToCallListModal from '../Task/AddCallListModal/AddCallListModal';
import UpdateDataFieldsModal from '../Task/UpdateDataFieldsModal';
import InfiniteTaskListRow, { HeaderComponent, PlaceholderComponent } from '../Task/InfiniteTaskListRow';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import FormAddCategory from '../Category/FormAddCategory';
import FormAddFocus from '../Focus/FormAddFocus';
import AssignMultiTaskToMe from '../Task/AssignTaskModal/AssignMultiTaskToMe';
import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature'
const header = (width) => (
  <HeaderComponent objectType={ObjectTypes.Delegation} overviewType={OverviewTypes.Delegation.Task} width={width} />
);

const Overview = createOverview(
  OverviewTypes.Delegation.Task,
  // ObjectTypes.Task,
  ObjectTypes.Delegation,
  CssNames.Delegation,
  header,
  InfiniteTaskListRow,
  PlaceholderComponent
);

const InfiniteTaskListOverview = () => {
  return (
    <Overview hasTag hasPeriodSelector route="/delegation/tasks">
      <EditTaskModal overviewType={OverviewTypes.Delegation.Task} />
      <AssignTaskModal overviewType={OverviewTypes.Delegation.Task} />
      <AssignTaskToMeModal overviewType={OverviewTypes.Delegation.Task} />
      <DeleteTaskModal overviewType={OverviewTypes.Delegation.Task} />
      <AssignTagToTaskModal overviewType={OverviewTypes.Delegation.Task} />
      <AssignDelegateTaskModal overviewType={OverviewTypes.Delegation.Task} />
      <AssignMultiTaskToMe overviewType={OverviewTypes.Delegation.Task} />
      {/* <ChangeReponsibleModal overviewType={OverviewTypes.Delegation.Task} /> */}
      <UpdateDataFieldsModal overviewType={OverviewTypes.Delegation.Task} />
      <AddToMailchampListModal overviewType={OverviewTypes.Delegation.Task} />
      <DeleteAndSetDoneMutilModal modalType="delete_tasks" overviewType={OverviewTypes.Delegation.Task} />
      <DeleteAndSetDoneMutilModal modalType="set_done_tasks" overviewType={OverviewTypes.Delegation.Task} />
      <AddToCallListModal overviewType={OverviewTypes.Delegation.Task} />
      <FormAddNewMailchimpList overviewType={OverviewTypes.Delegation.Task} />
      {/* <FormAddCategory />
      <FormAddFocus /> */}

      <RoutingObjectFeature/>
    </Overview>
  );
};

export default InfiniteTaskListOverview;

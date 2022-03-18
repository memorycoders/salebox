// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import EditTaskModal from 'components/Task/EditTaskModal/EditTaskModal';
import AssignTaskModal from 'components/Task/AssignTaskModal/AssignTaskModal';
import AssignTaskToMeModal from 'components/Task/AssignTaskModal/AssignTaskToMeModal';
import DeleteTaskModal from 'components/Task/DeleteTaskModal/DeleteTaskModal';
import SetTaskModal from 'components/Task/SetTaskModal/SetTaskModal';
import AssignTagToTaskModal from 'components/Task/AssignTagToTaskModal/AssignTagToTaskModal';
import AcceptedDelegateModal from 'components/Task/AcceptedDelegateModal';
import DeclineDelegateModal from 'components/Task/DeclineDelegateModal';
import ChangeReponsibleModal from '../Task/ChangeReponsible/ChangeReponsible';
import AddToMailchampListModal from '../Task/AddToMailchimpListModal/AddToMailchimpListModal';
import DeleteAndSetDoneMutilModal from '../Task/DeleteAndSetDoneMutilTask/DeleteAndSetDoneMutilTaskModal';
import AddToCallListModal from '../Task/AddCallListModal/AddCallListModal';
import UpdateDataFieldsModal from '../Task/UpdateDataFieldsModal';
import createOverview from 'components/Overview/createOverview';
import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';
import * as AdvancedSearchActions from 'components/AdvancedSearch/advanced-search.actions';
import InfiniteTaskListRow, { HeaderComponent, PlaceholderComponent } from '../Task/InfiniteTaskListRow';
import DuplicateModal from '../Task/DuplicateModal';
import FormAddCategory from '../Category/FormAddCategory';
import FormAddFocus from '../Focus/FormAddFocus';
import FormAddNewMailchimpList from '../Task/FormAddNewMailchimp/FormAddNewMailchimpList';

//MODAL FOR ROUTING
// import { ContactObjectFeature } from '../Contact/InfiniteContactList';
// import { AccountObjectFeature } from '../Organisation/InfiniteOrganisationList';
// import { UnqualifiedObjectFeature } from '../PipeLineUnqualifiedDeals/InfiniteUnqualifiedDealList';
// import { QualifiedObjectFeature } from '../PipeLineQualifiedDeals/InfiniteQualifiedDealList';
// import { AppointmentObjectFeature } from './InfiniteAppointmentList';
import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import SpecialTaskModal from '../Task/SpecialTask/SpecialTaskModal';

const header = (width) => (
  <HeaderComponent objectType={ObjectTypes.Task} overviewType={OverviewTypes.Activity.Task} width={width} />
);

const Overview = createOverview(
  OverviewTypes.Activity.Task,
  ObjectTypes.Task,
  CssNames.Activity,
  header,
  InfiniteTaskListRow,
  PlaceholderComponent
);

export const TaskObjectFeature = ()=> {
  return <>
    <EditTaskModal overviewType={OverviewTypes.Activity.Task} />
    <AssignTaskModal overviewType={OverviewTypes.Activity.Task} />
    <AssignTaskToMeModal overviewType={OverviewTypes.Activity.Task} />
    <DeleteTaskModal overviewType={OverviewTypes.Activity.Task} />
    <AssignTagToTaskModal overviewType={OverviewTypes.Activity.Task} />
    <SetTaskModal overviewType={OverviewTypes.Activity.Task} />
    <AcceptedDelegateModal overviewType={OverviewTypes.Activity.Task} />
    <DeclineDelegateModal overviewType={OverviewTypes.Activity.Task} />
    <ChangeReponsibleModal overviewType={OverviewTypes.Activity.Task} />
    <AddToMailchampListModal overviewType={OverviewTypes.Activity.Task} />
    <DeleteAndSetDoneMutilModal modalType="delete_tasks" overviewType={OverviewTypes.Activity.Task} />
    <DeleteAndSetDoneMutilModal modalType="set_done_tasks" overviewType={OverviewTypes.Activity.Task} />
    <AddToCallListModal overviewType={OverviewTypes.Activity.Task} />
    <DuplicateModal overviewType={OverviewTypes.Activity.Task} />
    {/* <FormAddCategory />
    <FormAddFocus /> */}
    <UpdateDataFieldsModal overviewType={OverviewTypes.Activity.Task} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.Activity.Task} />
    <SpecialTaskModal></SpecialTaskModal>
  </>
}

const InfiniteTaskListOverview = () => {
  return (
    <Overview hasTag hasPeriodSelector route="/activities/tasks">
      {/* <TaskObjectFeature/>
      <ContactObjectFeature/>
      <AccountObjectFeature/>
      <UnqualifiedObjectFeature/>
      <QualifiedObjectFeature/>
      <AppointmentObjectFeature/> */}
      <RoutingObjectFeature/>
    </Overview>
  );
};

const mapDispatchToProps = {
  setFilter: AdvancedSearchActions.setFilter,
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  lifecycle({
    componentWillMount() {
      const { setFilter } = this.props;
      setFilter(ObjectTypes.Task);
    },
  })
)(InfiniteTaskListOverview);

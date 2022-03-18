// @flow
import * as React from 'react';
import createOverview from 'components/Overview/createOverview';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';
import EditAppointmentModal from 'components/Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from 'components/Appointment/DeleteAppointmentModal/DeleteAppointmentModal';
import * as AdvancedSearchActions from 'components/AdvancedSearch/advanced-search.actions';
import InfiniteTaskListRow, { PlaceholderComponent } from '../Appointment/InfiniteAppointmentListRow';
import HeaderComponent from '../Appointment/HeaderAppointment/HeaderAppointmentList';
import AddToMailchimpListModal from '../../components/Task/AddToMailchimpListModal/AddToMailchimpListModal';
import FormAddNewMailchimpList from '../../components/Task/FormAddNewMailchimp/FormAddNewMailchimpList';
import AddToCallListModal from '../../components/Task/AddCallListModal/AddCallListModal';
import DeleteMultiAppoinmentModal from '../../components/Appointment/DeleteAppointmentModal/DeleteMultiAppoinmentModal';
import ChangeReponsibleModal from '../../components/Task/ChangeReponsible/ChangeReponsible';
import CreateContactModal from "../Contact/CreateContactModal";
import * as PeriodActionTypes from '../PeriodSelector/period-selector.actions';
import AddInviteeModal from '../Appointment/AddInvites/AddInviteeModal';
import UpdateDataFieldsModal from '../Appointment/UpdateDataFieldsModal/index';


// import { ContactObjectFeature } from '../Contact/InfiniteContactList';
// import { AccountObjectFeature } from '../Organisation/InfiniteOrganisationList';
// import { UnqualifiedObjectFeature } from '../PipeLineUnqualifiedDeals/InfiniteUnqualifiedDealList';
// import { QualifiedObjectFeature } from '../PipeLineQualifiedDeals/InfiniteQualifiedDealList'

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';

const header = (width) => (
  <HeaderComponent
    width={width}
    objectType={ObjectTypes.Appointment}
    overviewType={OverviewTypes.Activity.Appointment}
  />
);

const Overview = createOverview(
  OverviewTypes.Activity.Appointment,
  ObjectTypes.Appointment,
  CssNames.Activity,
  header,
  InfiniteTaskListRow,
  PlaceholderComponent
);

export const AppointmentObjectFeature = () => {
  return <>
    <EditAppointmentModal overviewType={OverviewTypes.Activity.Appointment} />
    <DeleteAppointmentModal overviewType={OverviewTypes.Activity.Appointment} />
    <AddInviteeModal overviewType={OverviewTypes.Activity.Appointment} />
    <UpdateDataFieldsModal overviewType={OverviewTypes.Activity.Appointment} />
    {/* Mass spinner */}
    <AddToMailchimpListModal overviewType={OverviewTypes.Activity.Appointment} />
    <FormAddNewMailchimpList overviewType={OverviewTypes.Activity.Appointment} />
    <AddToCallListModal overviewType={OverviewTypes.Activity.Appointment} />
    <DeleteMultiAppoinmentModal overviewType={OverviewTypes.Activity.Appointment} />
    <ChangeReponsibleModal overviewType={OverviewTypes.Activity.Appointment} />

    <CreateContactModal overviewType={OverviewTypes.Activity.Appointment_Add_Contact} />
  </>
}

const InfiniteTaskListOverview = () => {
  return (
    <Overview hasTag hasPeriodSelector route="/activities/appointments">

      {/* <AppointmentObjectFeature/>
      <ContactObjectFeature />
      <AccountObjectFeature />
      <UnqualifiedObjectFeature />
      <QualifiedObjectFeature /> */}
      <RoutingObjectFeature/>
    </Overview>
  );
};

const mapDispatchToProps = {
  setFilter: AdvancedSearchActions.setFilter,
  selectPeriod: PeriodActionTypes.selectPeriod,
};

export default compose(
  connect(null, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      const { setFilter, selectPeriod } = this.props;
      // selectPeriod(ObjectTypes.Appointment, 'all')
      setFilter(ObjectTypes.Appointment, 'listView');
    },
  })
)(InfiniteTaskListOverview);

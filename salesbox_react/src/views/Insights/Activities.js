// @flow
import * as React from 'react';
import PeriodSelector from 'components/PeriodSelector/PeriodSelector';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ObjectTypes, CssNames } from 'Constants';
import { lifecycle, compose } from 'recompose';
import _l from 'lib/i18n';
import * as InsightActions from 'components/Insight/insight.actions';
import DialsPane from 'components/Insight/DialsPane/DialsPane';
import CallsPane from 'components/Insight/CallsPane/CallsPane';
import TasksPane from 'components/Insight/TasksPane/TasksPane';
import AppointmentsPane from 'components/Insight/AppointmentsPane/AppointmentsPane';
import QuoteSentPane from 'components/Insight/QuoteSentPane/QuoteSentPane';
import NegotiatingPane from 'components/Insight/NegotiatingPane/NegotiatingPane';
import WorkloadPerWeekPane from 'components/Insight/WorkloadPerWeekPane/WorkloadPerWeekPane';
import ActivityPerformancePane from 'components/Insight/ActivityPerformancePane/ActivityPerformancePane';
import TimelinePane from 'components/Insight/TimelinePane/TimelinePane';
import ProspectPane  from '../../components/Insight/Activities/ProspectPane'

type PropsT = {
  activities: {},
  workload: {},
  performance: {},
};

addTranslations({
  'en-US': {
    Insights: 'Insights',
  },
});

const objectType = ObjectTypes.Insight.Activity;
const color = CssNames.Insight;

class Activities extends React.Component<PropsT> {
  render() {
    const { activities, workload, performance } = this.props;
    if (!activities.DIAL) {
      return <div/>
    }

    console.log('activities: ', activities)
    return (
      <React.Fragment>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <DialsPane data={activities.DIAL} />
            </Grid.Column>
            <Grid.Column>
              <CallsPane data={activities.CALL} />
            </Grid.Column>
            <Grid.Column>
              <ProspectPane data={activities.PROSPECT} />
              {/* <TasksPane data={activities.TASK} /> */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <AppointmentsPane title={_l`Meetings booked`} data={activities.BOOK_APPOINTMENT} />
            </Grid.Column>
            <Grid.Column>
              <AppointmentsPane title={_l`Meetings done`} data={activities.DONE_APPOINTMENT} />
            </Grid.Column>
            <Grid.Column>
              <AppointmentsPane title={_l`Deals added`} data={activities.DEALS} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <QuoteSentPane data={activities.SEND_QUOTE} />
            </Grid.Column>
            <Grid.Column>
              <TimelinePane />
            </Grid.Column>
            <Grid.Column>
              <NegotiatingPane data={activities.SEND_CONTRACT} />
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  fetchDataRequest: InsightActions.fetchDataRequest,
};

const mapStateToProps = (state) => {
  const { insight } = state.entities;

  return {
    activities: insight.activities || {},
    workload: insight.workload || {},
    performance: insight.performance || {},
    roleType: state.ui.app.roleType,
    activeRole: state.ui.app.activeRole,
    userId: state.auth.userId,
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchDataRequest();
    },

    componentWillReceiveProps(nextProps){
      const { activeRole, roleType, userId } = this.props;
      if (nextProps.activeRole !== activeRole || nextProps.roleType !== roleType || userId !== nextProps.userId){
        if (location.pathname === '/insights/activities'){
          this.props.fetchDataRequest();
        }
      }
    }
  })
)(Activities);

// @flow
import * as React from 'react';
import PeriodSelector from 'components/PeriodSelector/PeriodSelector';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ObjectTypes, CssNames } from 'Constants';
import { lifecycle, compose } from 'recompose';
import * as InsightActions from 'components/Insight/insight.actions';
import RecordsPane from 'components/Insight/Sales/RecordsPane/RecordsPane';
import PipelineSalesPane from 'components/Insight/Sales/PipelineSalesPane/PipelineSalesPane';
import SalesPane from 'components/Insight/Sales/SalesPane/SalesPane';
import OperationsPane from 'components/Insight/Sales/OperationsPane/OperationsPane';
import ForecastPane from 'components/Insight/Sales/ForecastPane/ForecastPane';
import PriorityLevelPane from 'components/Insight/Sales/PriorityLevelPane/PriorityLevelPane';
import PrioQualifiedDealPane from 'components/Insight/Sales/PrioQualifiedDealPane/PrioQualifiedDealPane';
import MissingQualifiedDealPane from 'components/Insight/Sales/MissingQualifiedDealPane/MissingQualifiedDealPane';
import UnqualifiedDealsPane from 'components/Insight/Sales/UnqualifiedDealsPane/UnqualifiedDealsPane';
import CampaignPane from 'components/Insight/Sales/CampaignPane/CampaignPane';
import QualifiedDealsPane from 'components/Insight/Sales/QualifiedDealsPane/QualifiedDealsPane';

type PropsType = {
  records: {},
  pipelineSales: {},
  salesStats: {},
  profitForecast: {},
  piechartList: {},
  forecast: {},
  salesObjectInfo: {},
};

addTranslations({
  'en-US': {
    Insights: 'Insights',
  },
});

const objectType = ObjectTypes.Insight.Sales;
const color = CssNames.Insight;

const Sales = ({
  records,
  salesObjectInfo,
  forecast,
  pipelineSales,
  salesStats,
  profitForecast,
  piechartList,
}: PropsType) => {
  console.log("0000forecast", forecast)

  if (!records) {
    return <PeriodSelector objectType={objectType} color={color} />;
  }
  return (
    <React.Fragment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <UnqualifiedDealsPane data={salesObjectInfo} />
          </Grid.Column>
          <Grid.Column width={4}>
            <CampaignPane data={salesObjectInfo} />
          </Grid.Column>
          <Grid.Column width={8}>
            <QualifiedDealsPane data={salesObjectInfo} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column stretched width={6}>
            <RecordsPane data={records} />
          </Grid.Column>
          <Grid.Column stretched width={6}>
            <PipelineSalesPane salesStats={salesStats} data={pipelineSales} />
          </Grid.Column>
          <Grid.Column stretched width={4}>
            <PriorityLevelPane data={salesStats} />
            <PrioQualifiedDealPane data={salesStats} />
            <MissingQualifiedDealPane data={salesStats} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <SalesPane data={salesStats} forecast={profitForecast} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {piechartList && <OperationsPane data={piechartList} />}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {forecast && <ForecastPane data={forecast} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  fetchSalesDataRequest: InsightActions.fetchSalesDataRequest,
};

const mapStateToProps = (state) => {
  const { insight } = state.entities;
  const sales = insight.sales || {};
  console.log('insight-daaaaa: ', insight)
  return {
    records: sales.records || {},
    pipelineSales: sales.pipelineSales || {},
    salesStats: sales.salesStats || {},
    profitForecast: insight.profitForecast || {},
    piechartList: insight.piechartList || {},
    salesObjectInfo: insight.salesObjectInfo || {},
    forecast: insight.forecast || { column: [], line: [] },
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
      this.props.fetchSalesDataRequest();
    },
    componentWillReceiveProps(nextProps) {
      const { activeRole, roleType, userId } = this.props;
      if (nextProps.activeRole !== activeRole || nextProps.roleType !== roleType || userId !== nextProps.userId) {
        if (location.pathname === '/insights/sales') {
          this.props.fetchSalesDataRequest();
        }
      }
    }
  })
)(Sales);

// @flow
import * as React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { withRouter, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { ObjectTypes, CssNames } from 'Constants';
import _l from 'lib/i18n';
import common from 'style/Common.css';
import { Activities, Sales, TopLists, Dashboard, Downloads } from './insight.routes';
import InsightPeriod from '../../components/Insight/Period/period';
import css from './Insight.css';
import ColdropdownChart from './ColDropdownChart';
import DeleteChartModal from '../../components/Insight/DeleteChart/DeleteChartModal';
import ShareWith from '../../components/Insight/CreateChart/ShareWith';
import ReportSelect from './ReportSelect';
import CreateChartModal from '../../components/Insight/CreateChart/CreateChartModal';
import { FilterTypeReport } from './ResourceReport/FilterTypeReport';
import { downloadReportResource, setParamsReportResource } from '../../components/Insight/insight.actions';
import { connect } from 'react-redux';
import ResourceReport from './ResourceReport/ResourceReport';
import { setOverviewType } from '../../components/Common/common.actions';
import { OverviewTypes } from '../../Constants';

addTranslations({
  'en-US': {
    Insights: 'Insights',
    Activitie: 'Activitie',
    Reminders: 'Reminders',
    Downloads: 'Downloads',
    Dashboard: 'Dashboard',
    Sales: 'Sales',
  },
});

type PropsT = {
  location: {
    pathname: string,
  },
};

const getObjectType = () => {
  switch (location.pathname) {
    case '/insights/activities':
      return ObjectTypes.Insight.Activity;
    case '/insights/toplists':
      return ObjectTypes.Insight.TopLists;
    case '/insights/downloads':
      return ObjectTypes.Insight.Downloads;
    case '/insights/resource':
      return ObjectTypes.Insight.Resource;
    default:
      return ObjectTypes.Insight.Sales;
  }
};

const Delegation = ({
  location,
  resourceReport,
  setParamsReportResource,
  downloadReportResource,
  setOverviewType,
  newIndustry,
}: PropsT) => {
  const objectType = getObjectType();
  const hasPeriod = location.pathname !== '/insights/dashboard';
  const hasCol = location.pathname === '/insights/dashboard';
  const downloadSelected = location.pathname === '/insights/downloads';
  const hasFilterByPeriod = location.pathname === '/insights/resource';
  React.useEffect(() => {
    setOverviewType(OverviewTypes.Insight);
  }, []);
  return (
    <div
      style={{ padding: 0, background: 'rgb(240,240,240)' }}
      className={`${common.container} ${common.positionAbsolute}`}
    >
      <Menu style={styles.sidebar} borderless>
        <Menu.Menu position="left">
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/activities' &&
              css.menuActive}`}
            as={Link}
            to="/insights/activities"
          >
            {_l`Activities`}
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/insights/sales"
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/sales' &&
              css.menuActive}`}
          >
            {_l`Sales`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/toplists' &&
              css.menuActive}`}
            as={Link}
            to="/insights/toplists"
          >
            {_l`Top 5 lists`}
          </Menu.Item>
          <Menu.Item
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/dashboard' &&
              css.menuActive}`}
            as={Link}
            to="/insights/dashboard"
          >
            {_l`Custom`}
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/insights/downloads"
            className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/downloads' &&
              css.menuActive}`}
          >
            {_l`Excel reports`}
          </Menu.Item>
          {(newIndustry === 'IT_CONSULTANCY') && (
            <Menu.Item
              as={Link}
              to="/insights/resource"
              className={`${css.categoryMenu} ${CssNames.Insight} ${location.pathname === '/insights/resource' &&
                css.menuActive}`}
            >
              {_l`Resources`}
            </Menu.Item>
          )}
        </Menu.Menu>
        {downloadSelected && <ReportSelect />}
        {hasFilterByPeriod ? (
          <div className={css.menuCenter}>
            <Menu.Menu>
              <Menu.Item>
                <Button onClick={downloadReportResource} className={`${css.colButton} ${css.buttonActive}`}>
                  {_l`Download`}
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </div>
        ) : null}
        <Menu.Menu position="right" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {hasPeriod && <InsightPeriod objectType={objectType} hasFilterByPeriod={hasFilterByPeriod} />}
          {hasCol && <ColdropdownChart objectType={objectType} />}
          {hasFilterByPeriod ? (
            <FilterTypeReport resourceReport={resourceReport} setParamsReportResource={setParamsReportResource} />
          ) : null}
        </Menu.Menu>
      </Menu>
      <div className={css.charts}>
        <Switch>
          <Route path="/insights/activities" component={Activities} />
          <Route path="/insights/sales" component={Sales} />
          <Route path="/insights/toplists" component={TopLists} />
          <Route path="/insights/Dashboard" component={Dashboard} />
          <Route path="/insights/Downloads" component={Downloads} />
          <Route path="/insights/resource" component={ResourceReport} />
          <Route component={Activities} />
        </Switch>
      </div>
      <DeleteChartModal overviewType={'INSIGHT_DELETE_CHART'} />
      <ShareWith />
      <CreateChartModal modalType={'create'} overviewType={'INSIGHT_CREATE_MODAL'} />
      <CreateChartModal modalType={'edit'} overviewType={'INSIGHT_CREATE_MODAL'} />
      <CreateChartModal modalType={'copy'} overviewType={'INSIGHT_CREATE_MODAL'} />
    </div>
  );
};

export default compose(
  withRouter,
  connect(
    (state) => {
      return {
        resourceReport: state?.entities?.insight?.resourceReport,
        newIndustry: state.auth?.company?.newIndustry,
      };
    },
    {
      setParamsReportResource: setParamsReportResource,
      downloadReportResource: downloadReportResource,
      setOverviewType: setOverviewType,
    }
  ),
  lifecycle({
    componentDidMount() {
      if (location.pathname === '/insights') {
        this.props.history.push('/insights/activities');
      }
    },
  })
)(Delegation);

const styles = {
  sidebar: {
    border: 'none',
    boxShadow: 'none',
    width: '100%',
    borderBottom: '1px solid rgb(241,241, 241)',
    borderRadius: 0,
    height: 50,
    padding: '0px 10px',
    display: 'flex',
    justifyContent: 'space-between',
  },

  charts: {
    padding: '10px 10px',
    height: 'calc(100% - 50px)',
    overflowY: 'ovelay',
    overflowX: 'hidden',
  },
};

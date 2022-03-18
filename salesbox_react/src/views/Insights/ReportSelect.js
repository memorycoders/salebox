import React, { useState, useEffect } from 'react';
import { lifecycle, compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { ObjectTypes, Endpoints } from 'Constants';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { Menu, Popup, Icon, Dropdown, Button } from 'semantic-ui-react';
import * as DashboardActions from 'components/Dashboard/dashboard.actions';
import { highlight } from '../../components/Overview/overview.actions';
import { addDownload } from '../../store/local-download.reducer';
import { excelDataRequest } from '../../components/Insight/insight.actions';
import css from './Insight.css';
import {API_URL} from '../../lib/apiClient'
const style = {
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
};


const ReportSelect = ({
  setReportType,
  reportType,
  selectedReportType,
  addDownload,
  activeRole,
  roleType,
  userId,
  period,
  auth,
}) => {



  let commonOptions = [
    {
      value: 'FORECAST_OVERVIEW-ES',
      key: 'FORECAST_OVERVIEW-ES',
      text: _l`Forecast Overview`,
    },
    {
      value: 'FORECAST_DETAIL/FORECAST_ORDER_INTAKE',
      key: 'FORECAST_DETAIL/FORECAST_ORDER_INTAKE',
      text: _l`Forecast Sales`,
    },
    {
      value: 'FORECAST_DETAIL/FORECAST_REVENUE',
      key: 'FORECAST_DETAIL/FORECAST_REVENUE',
      text: _l`Forecast Revenue`,
    },
    {
      value: 'FORECAST_DETAIL/FORECAST_PROFIT',
      key: 'FORECAST_DETAIL/FORECAST_PROFIT',
      text: _l`Forecast Profit`,
    },
    {
      value: 'FORECAST_DETAIL/FORECAST_MARGIN',
      key: 'FORECAST_DETAIL/FORECAST_MARGIN',
      text: _l`Forecast Margin`,
    },
    {
      value: 'PERFORMANCE/PERFORMANCE_ACCOUNT',
      key: 'PERFORMANCE/PERFORMANCE_ACCOUNT',
      text: _l`Performance companies`,
    },

    {
      value: 'PERFORMANCE/PERFORMANCE_LOB',
      key: 'PERFORMANCE/PERFORMANCE_LOB',
      text: _l`Performance Product Group`,
    },
    {
      value: 'PERFORMANCE/PERFORMANCE_CONTACT',
      key: 'PERFORMANCE/PERFORMANCE_CONTACT',
      text: _l`Performance Contact`,
    },
    {
      value: 'COMING_ACTIVITIES',
      key: 'COMING_ACTIVITIES',
      text: _l`Coming Activities`,
    },
    {
      value: 'PERFORMANCE/PERFORMANCE_PRODUCT',
      key: 'PERFORMANCE/PERFORMANCE_PRODUCT',
      text: _l`Performance Product`,
    },
    {
      value: 'COMING_DEALS',
      key: 'COMING_DEALS',
      text: _l`Coming Deals`,
    },
    // {
    //   value: 'COMING_DEALS_PRODUCT_GROUP',
    //   key: 'COMING_DEALS_PRODUCT_GROUP',
    //   text: 'Coming Deals Product Group',
    // },
    {
      value: 'SALES_PERFORMANCE/SALES_PERFORMANCE_USER',
      key: 'SALES_PERFORMANCE/SALES_PERFORMANCE_USER',
      text: _l`Sales Performance User`,
    },
  ];

  let userOptions = [
    {
      value: 'WORKLOAD_FORECAST/WORKLOAD_FORECAST_PERSON',
      key: 'WORKLOAD_FORECAST/WORKLOAD_FORECAST_PERSON',
      text: _l`Workload Forecast User`,
    },
    {
      value: 'WORKLOAD_HISTORY/WORKLOAD_HISTORY_USER',
      key: 'WORKLOAD_HISTORY/WORKLOAD_HISTORY_USER',
      text: _l`Workload History User`,
    },
    {
      value: 'VALUE_ACTIVITY/VALUE_ACTIVITY_USER',
      key: 'VALUE_ACTIVITY/VALUE_ACTIVITY_USER',
      text: _l`Value Per Activity User`,
    },
  ];

  let unitOptions = [
    {
      value: 'SALES_PERFORMANCE/SALES_PERFORMANCE_UNIT',
      key: 'SALES_PERFORMANCE/SALES_PERFORMANCE_UNIT',
      text: _l`Sales Performance Unit`,
    },
    {
      value: 'WORKLOAD_FORECAST/WORKLOAD_FORECAST_UNIT',
      key: 'WORKLOAD_FORECAST/WORKLOAD_FORECAST_UNIT',
      text: _l`Workload Forecast Unit`,
    },
    {
      value: 'WORKLOAD_HISTORY/WORKLOAD_HISTORY_UNIT',
      key: 'WORKLOAD_HISTORY/WORKLOAD_HISTORY_UNIT',
      text: _l`Workload History Unit`,
    },
    {
      value: 'VALUE_ACTIVITY/VALUE_ACTIVITY_UNIT',
      key: 'VALUE_ACTIVITY/VALUE_ACTIVITY_UNIT',
      text: _l`Value Per Activity Unit`,
    },
  ];


  let options = [];

  console.log('roleType:-roleType ', roleType);

  if (roleType === 'Person') {
    options = commonOptions.concat(userOptions);
  } else {
    options = commonOptions.concat(unitOptions);
  }

  // useEffect(() => {
  //     setReportType('FORECAST_OVERVIEW-ES')

  // }, [userId, activeRole])

  const download = () => {
    let roleValue = activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }

    const isFilterAll = period.period === 'all';
    const data = {
      startDate: isFilterAll
        ? moment()
          .startOf('year')
          .valueOf()
        : new Date(period.startDate).getTime(),
      endDate: isFilterAll
        ? moment()
          .endOf('year')
          .valueOf()
        : new Date(period.endDate).getTime(),
      periodType: isFilterAll ? 'YEAR' : period.period.toUpperCase(), //'YEAR'
    };

    let uri = `${API_URL}/report-v3.0/export/singleReport/excel/${reportType}?token=${auth.token}&periodType=${data.periodType}&startDate=${data.startDate}&endDate=${data.endDate}&enterpriseID=${auth.enterpriseID}`;
    if (roleValue) {
      uri = uri + `&userId=${roleValue}`;
    }
    addDownload(uri);
  };

  console.log('options-options: ', options);

  return (
    <Menu.Menu style={{ flex: 1, justifyContent: 'center' }} size="small">
      <Menu.Item>
        <Dropdown
          fluid
          search
          selection
          className='dropdown-clear'
          // size="small"
          value={reportType}
          placeholder={_l`Select report`}
          onChange={(e, { value }) => {
            setReportType(value);
            selectedReportType(value);
          }}
          // id={`chartFormUnits${idx}`}
          // onClick={() => calculatingPositionMenuDropdown(`chartFormUnits${idx}`)}
          options={options}
        />
      </Menu.Item>
      <Menu.Item style={{ padding: 0 }}>
        <Button onClick={() => download()} className={`${css.colButton} ${css.buttonActive}`}>
          {_l`Download`}
        </Button>
      </Menu.Item>
    </Menu.Menu>
  );
};

const mapDispatchToProps = {
  highlight,
  addDownload,
  excelDataRequest,
};

const mapStateToProps = (state) => {
  const { dashboard } = state;
  const period = getPeriod(state, ObjectTypes.Insight.Downloads);
  return {
    roleType: state.ui.app.roleType,
    activeRole: state.ui.app.activeRole,
    userId: state.auth.userId,
    period,
    auth: state.auth,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  //    const [reportType, setReportType] = useState('FORECAST_OVERVIEW-ES')
  withState('reportType', 'setReportType', 'FORECAST_OVERVIEW-ES'),
  withHandlers({
    selectedReportType: ({ excelDataRequest }) => (reportType) => {
      excelDataRequest(reportType);
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { period, reportType, activeRole, roleType, userId, setReportType } = this.props;
      if (
        roleType !== nextProps.roleType &&
        ((roleType === 'Person' && nextProps.roleType !== 'Person') ||
          (roleType !== 'Person' && nextProps.roleType === 'Person'))
      ) {
        setReportType('FORECAST_OVERVIEW-ES');
        this.props.excelDataRequest('FORECAST_OVERVIEW-ES');
        return;
      }
      if (period !== nextProps.period || nextProps.activeRole !== activeRole || nextProps.userId !== userId) {
        console.log('nextProps.reportType ', nextProps.reportType);
        this.props.excelDataRequest(nextProps.reportType);
      }
    },
  })
)(ReportSelect);

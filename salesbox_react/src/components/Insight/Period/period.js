// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { Button, Menu } from 'semantic-ui-react';
import _l from 'lib/i18n';
import moment from 'moment';
import PeriodButton from '../../PeriodSelector/PeriodButton';
import { getPeriod } from '../../PeriodSelector/period-selector.selectors';
import * as PeriodActionTypes from '../../PeriodSelector/period-selector.actions';
import css from '../../Calendar/Toolbar/Toolbar.css';
import { updatePeriodFilter, requestUpdateDisplaySetting } from '../../Settings/settings.actions';
import { setParamsReportResource } from '../insight.actions';
import { RESOURCE_REPORT } from '../../../Constants';

const checkDetailShow = () => {
  const { pathname } = location;

  const listPath = pathname.split('/');
  return listPath.length > 3;
};

addTranslations({
  'en-US': {
    Day: 'Day',
    Week: 'Week',
    Month: 'Month',
    Quarter: 'Quarter',
    Year: 'Year',
    All: 'All',
    D: 'D',
    W: 'W',
    M: 'M',
    Q: 'Q',
    Y: 'Y',
    A: 'A',
    C: 'C',
    Custom: 'Custom',
    '{0}': '{0}',
    '{0} - {1}': '{0} - {1}',
    Calendar: 'Calendar',
  },
});

const InsightPeriod = ({ objectType, selectPeriod, objectPeriod: { period, startDate, endDate }, previous, next, hasFilterByPeriod, setParamsReportResource, resourceReport }) => {
  const hasDetail = checkDetailShow();
  let periodsDefault = [
    { key: 'day', label: _l`Day` },
    { key: 'week', label: _l`Week` },
    { key: 'month', label: _l`Month` },
    { key: 'quarter', label: _l`Quarter` },
    { key: 'year', label: _l`Year` },
  ];
  let periods = periodsDefault;

  if (hasDetail) {
    periods = [
      { key: 'day', label: _l`D` },
      { key: 'week', label: _l`W` },
      { key: 'month', label: _l`M` },
      { key: 'quarter', label: _l`Q` },
      { key: 'year', label: _l`Y` },
    ];
  } else {
    periods = periodsDefault;
  }
  let day = moment(startDate).format('ddd');
  let month = moment(startDate).format('MMM');
  return (
    <Menu.Menu className={css.centerChild} position="right">
      {period === 'day' && objectType !== 'INSIGHT_CHART_CREATE' && (
        <Menu.Menu className={css.singleLine}>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} icon="chevron left" onClick={previous} />
            </Button.Group>
          </Menu.Item>
          {/*<Menu.Item className={css.period}>{_l`${moment(startDate).format("dddd, DD MMM, YYYY")}`}</Menu.Item>*/}
          <Menu.Item className={css.period}>
            {_l.call(this, [day])}, {_l`${moment(startDate).format('DD')}`} {_l.call(this, [month])},
            {_l`${moment(startDate).format('YYYY')}`}
          </Menu.Item>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} icon="chevron right" onClick={next} />
            </Button.Group>
          </Menu.Item>
        </Menu.Menu>
      )}
      {period !== 'day' && objectType !== 'INSIGHT_CHART_CREATE' && (
        <Menu.Menu className={css.singleLine}>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} icon="chevron left" onClick={previous} />
            </Button.Group>
          </Menu.Item>
          <Menu.Item position="right" className={css.period}>{_l`${moment(startDate).format('DD MMM')}:t(d) - ${moment(
            endDate
          ).format('DD MMM, YYYY')}:t(d)`}</Menu.Item>
          <Menu.Item className={css.classMrB0}>
            <Button.Group size="small">
              <Button className={css.chevron} icon="chevron right" onClick={next} />
            </Button.Group>
          </Menu.Item>
        </Menu.Menu>
      )}
      {hasFilterByPeriod ?
        <Menu.Menu className={css.periods}>
        <Menu.Item fitted>
            <Button.Group>
            <PeriodButton
                  className={ resourceReport?.statusType === RESOURCE_REPORT.BOOKED
                    ? `${css.periodBtnExpandActive} ${css.font11} ${css.active} ${css['INSIGHT']}`
                    : `${css.periodBtnExpand} ${css.font11} ${css.inActive} ${css['INSIGHT']}`
                  }
                  onClick={() => { setParamsReportResource('statusType', RESOURCE_REPORT.BOOKED) }}
                  label={`${_l`Booked`} (%)`}
              ></PeriodButton>
              <PeriodButton
                  className={ resourceReport?.statusType === RESOURCE_REPORT.COMING
                    ? `${css.periodBtnExpandActive} ${css.font11} ${css.active} ${css['INSIGHT']}`
                    : `${css.periodBtnExpand} ${css.font11} ${css.inActive} ${css['INSIGHT']}`
                  }
                  onClick={() => { setParamsReportResource('statusType', RESOURCE_REPORT.COMING) }}
                  label={`${_l`Coming`} (%)`}
              ></PeriodButton>
            </Button.Group>
        </Menu.Item>
        </Menu.Menu>
        :
        <Menu.Menu className={css.periods}>
        <Menu.Item fitted>
          <Button.Group>
            {periods.map(({ key, label }) => {
              const active = period === key;
              return (
                <PeriodButton
                  className={
                    hasDetail
                      ? active
                        ? `${css.activePeriodBtn} ${css.font11} ${css.active} ${css['INSIGHT']}`
                        : `${css.periodBtn} ${css.inActive} ${css.font11}  ${css['INSIGHT']}`
                      : active
                      ? `${css.periodBtnExpandActive} ${css.font11} ${css.active} ${css['INSIGHT']}`
                      : `${css.periodBtnExpand} ${css.font11} ${css.inActive} ${css['INSIGHT']}`
                  }
                  label={label}
                  period={key}
                  active={active}
                  key={key}
                  onClick={selectPeriod}
                />
              );
            })}
          </Button.Group>
        </Menu.Item>
      </Menu.Menu>
      }
    </Menu.Menu>
  );
};

const mapStateTopProps = (state, { objectType }) => {
  return {
    objectPeriod: getPeriod(state, objectType),
    resourceReport: state?.entities?.insight?.resourceReport
  };
};

export default compose(
  defaultProps({
    period: 'day',
    color: 'orange',
    startDate: new Date(),
  }),
  connect(mapStateTopProps, {
    register: PeriodActionTypes.register,
    next: PeriodActionTypes.next,
    previous: PeriodActionTypes.previous,
    selectPeriod: PeriodActionTypes.selectPeriod,
    selectStartDate: PeriodActionTypes.selectStartDate,
    selectEndDate: PeriodActionTypes.selectEndDate,
    updatePeriodFilter,
    requestUpdateDisplaySetting,
    setParamsReportResource: setParamsReportResource
  }),
  withHandlers({
    previous: ({ previous, objectType }) => () => {
      previous(objectType);
    },
    next: ({ next, objectType }) => () => {
      next(objectType);
    },
    // previous: ({ onNavigate }) => () => onNavigate(Navigate.PREVIOUS),
    // next: ({ onNavigate }) => () => onNavigate(Navigate.NEXT),
    // today: ({ onNavigate }) => () => onNavigate(Navigate.TODAY),
    selectPeriod: ({ selectPeriod, objectType, updatePeriodFilter, requestUpdateDisplaySetting }) => (period) => {
      selectPeriod && selectPeriod(objectType, period);
      updatePeriodFilter(objectType, period);
      requestUpdateDisplaySetting();
    },
  }),
  lifecycle({
    componentDidMount() {
      const { register, objectType } = this.props;
      register(objectType);
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.objectType !== this.props.objectType) {
        this.props.register(nextProps.objectType);
      }
    },
  })
)(InsightPeriod);

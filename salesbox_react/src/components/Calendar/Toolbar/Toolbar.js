// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { Button, Menu, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import _l from 'lib/i18n';
import moment from 'moment';
import NamesGroup from './NamesGroup';
import { getOverview } from 'components/Overview/overview.selectors';
import PeriodButton from '../../PeriodSelector/PeriodButton';
import { getPeriod } from '../../PeriodSelector/period-selector.selectors';
import { ROUTERS, ObjectTypes, OverviewTypes } from '../../../Constants';
import * as PeriodActionTypes from '../../PeriodSelector/period-selector.actions';
import { navigate as Navigate } from 'react-big-calendar/lib/utils/constants';
import type { CallbackType } from 'types/semantic-ui.types';
import ChooseWeekType from '../../../essentials/Menu/ChooseWeekType';
import css from './Toolbar.css';
import { updatePeriodFilter, requestUpdateDisplaySetting } from '../../Settings/settings.actions';

const objectType = ObjectTypes.Appointment;
const overviewType = OverviewTypes.Activity.Appointment;

type PropsT = {
  messages: {
    today: string,
    previous: string,
    next: string,
  },
  views: Array<string>,
  onViewChange: (string) => void,
  label: string,
  view: string,
  previous: CallbackType,
  next: CallbackType,
  today: CallbackType,
};

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



const Toolbar = ({
  selectPeriod,
  objectPeriod: { period, startDate, endDate, currentDate },
  itemCount,
  onViewChange,
  previous,
  next,
  today,
}: PropsT) => {
  const hasDetail = checkDetailShow();
  let periods = periodsDefault;
  let periodsDefault = [
    { key: 'day', label: _l`Day` },
    { key: 'week', label: _l`Week` },
    { key: 'month', label: _l`Month` },
    { key: 'quarter', label: _l`Quarter` },
    { key: 'year', label: _l`Year` },
  ];
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
    <Menu id="period" secondary borderless className={css.secondary}>
      <span className={css.title}>
        {_l`Calendar`}
        {/* <span className={css.count}>{itemCount}</span> */}
      </span>

      <Menu.Menu className={css.centerChild} position="right">
        {period === 'day' && (
          <Menu.Menu className={css.singleLine}>
            <Menu.Item className={css.classMrB0}>
              <Button.Group size="small">
                <Button className={css.chevron} icon="chevron left" onClick={previous} />
              </Button.Group>
            </Menu.Item>
            <Menu.Item className={css.period}>
              {_l.call(this, [day])}, {_l`${moment(startDate).format('DD')}`} {_l.call(this, [month])},
              {_l`${moment(startDate).format('YYYY')}`}
            </Menu.Item>
            {/* <Menu.Item className={css.period}>{_l`${moment(startDate).format("dddd, DD MMM, YYYY")}`}</Menu.Item> */}
            <Menu.Item className={css.classMrB0}>
              <Button.Group size="small">
                <Button className={css.chevron} icon="chevron right" onClick={next} />
              </Button.Group>
            </Menu.Item>
          </Menu.Menu>
        )}
        {period !== 'day' && (
          <Menu.Menu className={css.singleLine}>
            <Menu.Item className={css.classMrB0}>
              <Button.Group size="small">
                <Button className={css.chevron} icon="chevron left" onClick={previous} />
              </Button.Group>
            </Menu.Item>
            <Menu.Item position="right" className={css.period}>{_l`${moment(startDate).format(
              'DD MMM'
            )}:t(d) - ${moment(endDate).format('DD MMM, YYYY')}:t(d)`}</Menu.Item>
            <Menu.Item className={css.classMrB0}>
              <Button.Group size="small">
                <Button className={css.chevron} icon="chevron right" onClick={next} />
              </Button.Group>
            </Menu.Item>
          </Menu.Menu>
        )}

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
                          ? `${css.activePeriodBtn} ${css.font11} ${css.active} ${css['TASK']}`
                          : `${css.periodBtn} ${css.inActive} ${css.font11}  ${css['TASK']}`
                        : active
                        ? `${css.periodBtnExpandActive} ${css.font11} ${css.active} ${css['TASK']}`
                        : `${css.periodBtnExpand} ${css.font11} ${css.inActive} ${css['TASK']}`
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
      </Menu.Menu>
      <Menu.Menu position="right" className={css.singleLine}>
        {period === 'week' && (
          <div className={`${css.circleFlex}`}>
            <ChooseWeekType objectType={objectType} weekType={period.weekType ? period.weekType : '7_DAYS'} />
          </div>
        )}
      </Menu.Menu>
    </Menu>
  );
};

const mapStateTopProps = (state) => {
  const overview = getOverview(state, overviewType);
  const period = getPeriod(state, objectType);
  return {
    objectPeriod: period,
    itemCount: overview.itemCount,
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
  }),
  withHandlers({
    previous: ({ previous, onNavigate }) => () => {
      onNavigate && onNavigate(Navigate.PREVIOUS);
      previous(objectType);
    },
    next: ({ next, onNavigate }) => () => {
      next(objectType);
      onNavigate && onNavigate(Navigate.NEXT);
    },
    // previous: ({ onNavigate }) => () => onNavigate(Navigate.PREVIOUS),
    // next: ({ onNavigate }) => () => onNavigate(Navigate.NEXT),
    // today: ({ onNavigate }) => () => onNavigate(Navigate.TODAY),
    selectPeriod: ({ selectPeriod, onViewChange, views, updatePeriodFilter, requestUpdateDisplaySetting }) => (
      period
    ) => {
      selectPeriod && selectPeriod(objectType, period);
      onViewChange && onViewChange(period);
      updatePeriodFilter(objectType, period);
      requestUpdateDisplaySetting();
    },
  }),
  lifecycle({
    componentWillMount() {
      const { register } = this.props;
      register(objectType);
    },
  })
)(Toolbar);

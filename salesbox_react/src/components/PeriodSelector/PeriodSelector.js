// @flow
import * as React from 'react';
import { Menu, Button, Image, Popup, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, defaultProps, withHandlers, pure, withProps, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import PeriodPicker from 'components/DatePicker/PeriodPicker';
import PeriodButton from './PeriodButton';
import * as PeriodActionTypes from './period-selector.actions';
import { enableHistory, blockHistory } from '../AdvancedSearch/advanced-search.actions';
import { getPeriod } from './period-selector.selectors';
import moment from 'moment';
import { getOverview } from 'components/Overview/overview.selectors';
import css from './PeriodSelector.css';
import cx from 'classnames';
import history from '../../../public/History.svg';
import automatic from '../../../public/Settings.svg';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import FilterActionMenu from '../../essentials/Menu/FilterActionMenu';
import { ROUTERS, ObjectTypes, OverviewTypes } from '../../Constants';
import { changeListShow } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { InsightPopup } from '../PipeLineQualifiedDeals/Insight/InsightPopup';
import QualifiedValue from '../QualifiedValue';
import { IconButton } from '../Common/IconButton';
import { updatePeriodFilter, requestUpdateDisplaySetting } from '../Settings/settings.actions';
import RecruitmentCaseDropdown from '../Recruitment/RecruitmentCaseDropdown';
import {
  fetchRCActiveDataByCaseId,
  selectRecruitmentCase,
  fetchListRecruitmentClosedByCaseId,
} from '../Recruitment/recruitment.actions';
import { getCurrentRC } from '../Recruitment/recruitment.selector';
import { updateSelectedCaseInRecruitment } from '../Settings/settings.actions';
import RecruitmentActionDropdownMenu from '../Recruitment/RecruitmentActionDropdownMenu';

const historyTooltip = {
  fontSize: '11px',
};

type PropsT = {
  objectPeriod: {
    period: string,
  },
  startDate: Date,
  endDate: Date,
  color: string,
  selectPeriod: (string) => void,
  previous: () => void,
  next: () => void,
  selectStartDate: (Date) => void,
  selectEndDate: (Date) => void,
  showHistoryTask: (sortValue) => void,
  enableHistory: () => void,
  handleFlag: () => void,
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
    Reminders: 'Reminders',
    Unqualified: 'Unqualified',
    Calendar: 'Calendar',
    Qualified: 'Qualified',
    Orders: 'Orders',
    Account: 'Account',
    Contacts: 'Contacts',
  },
});

const checkDetailShow = () => {
  const { pathname } = location;

  const listPath = pathname.split('/');

  if (pathname.includes(`/${ROUTERS.DELEGATION}`)) {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return hasDetail;
  }
  if (pathname.includes(`/${ROUTERS.ACTIVITIES}`)) {
    return listPath.length > 3;
  }

  if (pathname.includes(`/${ROUTERS.CONTACTS}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.PIPELINE}`)) {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return hasDetail;
  }

  if (pathname.includes(`/${ROUTERS.RECRUITMENT}`)) {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return hasDetail;
  }

  if (pathname.includes(`/${ROUTERS.ACCOUNTS}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.CALL_LIST}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.CAMPAIGNS}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.INSIGHTS}`)) {
    return listPath.length > 2;
  }

  return listPath.length > 2;
};

const qualifiedRightStyle = {
  alignItems: 'center',
  // marginTop: 12,
  marginRight: 12,
};

const PeriodSelector = ({
  color,
  objectPeriod: { period },
  startDate,
  endDate,
  selectPeriod,
  previous,
  next,
  selectStartDate,
  enableHistoryTask,
  blockHistory,
  selectEndDate,
  itemCount,
  width,
  search,
  objectType,
  leftMenu,
  overviewType,
  changeListShow,
  hideOnlyPeriod,
  flagOnClick,
  handleFlag,
  handleChangeCurrentRC,
  currentRC,
}: PropsT) => {
  let periodsDefault = [
    { key: 'day', label: _l`Day` },
    { key: 'week', label: _l`Week` },
    { key: 'month', label: _l`Month` },
    { key: 'quarter', label: _l`Quarter` },
    { key: 'year', label: _l`Year` },
    { key: 'all', label: _l`All` },
  ];

  const customActive = period === 'custom';
  const hasDetail = checkDetailShow();
  const { leftMenuStatus } = leftMenu;
  let periods = periodsDefault;
  if (hasDetail) {
    periods = [
      { key: 'day', label: _l`D` },
      { key: 'week', label: _l`W` },
      { key: 'month', label: _l`M` },
      { key: 'quarter', label: _l`Q` },
      { key: 'year', label: _l`Y` },
      { key: 'all', label: _l`A` },
    ];
  } else {
    periods = periodsDefault;
  }
  /*
    const title = objectType === ObjectTypes.Task ? _l`Reminders` : (
      objectType === ObjectTypes.Lead ? _l`Prospect` : (
        objectType === ObjectTypes.DelegationLead ? _l`Shared prospects` : ''
      )
    )
    */
  let titleName = '';
  switch (overviewType) {
    case OverviewTypes.Activity.Task:
      titleName = _l`Reminders`;
      break;
    case OverviewTypes.Pipeline.Lead:
      titleName = _l`Prospects`;
      break;
    case OverviewTypes.Delegation.Task:
      titleName = _l`Shared reminders`;
      break;
    case OverviewTypes.Delegation.Lead:
      titleName = _l`Shared prospects`;
      break;
    case OverviewTypes.Pipeline.Qualified:
      titleName = _l`Deals`;
      break;
    case OverviewTypes.Account:
      titleName = _l`Companies`;
      break;
    case OverviewTypes.Pipeline.Order:
      titleName = _l`Orders`;
      break;
    case OverviewTypes.Activity.Appointment_Add_Contact:
      titleName = _l`Calendar`;
      break;
    case OverviewTypes.Contact:
      titleName = _l`Contacts`;
      break;
    case OverviewTypes.Activity.Appointment:
      titleName = _l`Meetings`;
      break;
    case OverviewTypes.CallList.Account:
      titleName = _l`Company lists`;
      break;
    case OverviewTypes.CallList.Contact:
      titleName = _l`Contact lists`;
      break;
    case OverviewTypes.Resource:
      titleName = _l`Resources`;
      break;
    case OverviewTypes.RecruitmentActive:
      titleName = _l`Recruitments`;
      break;
    case OverviewTypes.RecruitmentClosed:
      titleName = _l`Closed`;
      break;
    case OverviewTypes.Recruitment:
      titleName = _l`Recruitments`;
      break;
    default:
      break;
  }
  const title = titleName;
  let day = moment(startDate).format('ddd');
  let month = moment(startDate).format('MMM');
  let url = window.location.pathname;
  if (overviewType === OverviewTypes.Account || overviewType === OverviewTypes.Contact) {
    return (
      <Menu
        id="period"
        style={{ width, marginBottom: overviewType === OverviewTypes.Pipeline.Qualified ? 0 : '1rem' }}
        secondary
        borderless
        className={css.secondary}
      >
        <span className={cx(css.title, css.minWithTitle)}>
          {title}
          {overviewType === OverviewTypes.Activity.Appointment_Add_Contact ? (
            ''
          ) : (
            <span className={css.count}>{itemCount}</span>
          )}
        </span>
      </Menu>
    );
  }

  let dayStartTimeStr = moment(startDate).format('DD');
  let dayEndTimeStr = moment(endDate).format('DD');
  let monthStartTimeStr = moment(startDate).format('MMM');
  let monthEndTimeStr = moment(endDate).format('MMM');

  return (
    <Menu
      id="period"
      style={{ width, marginBottom: overviewType === OverviewTypes.Pipeline.Qualified ? 0 : '1rem' }}
      secondary
      borderless
      className={css.secondary}
    >
      <span className={cx(css.title, css.minWithTitle)}>
        {title}
        {overviewType === OverviewTypes.Activity.Appointment_Add_Contact ? (
          ''
        ) : (
          <span className={css.count}>{itemCount}</span>
        )}
        {(overviewType === OverviewTypes.Pipeline.Qualified || overviewType === OverviewTypes.Pipeline.Order) && (
          <QualifiedValue objectType={objectType} overviewType={overviewType} />
        )}
      </span>
      {(overviewType === OverviewTypes.RecruitmentActive || overviewType === OverviewTypes.RecruitmentClosed) && (
        <div
          style={
            overviewType === OverviewTypes.RecruitmentClosed ? { width: 200, marginLeft: '-100px' } : { width: 200 }
          }
        >
          <RecruitmentCaseDropdown
            isDropdownInForm={false}
            overview={overviewType}
            fluid
            onChange={handleChangeCurrentRC}
            value={currentRC}
            overviewType={overviewType}
          />
        </div>
      )}
      {overviewType === OverviewTypes.RecruitmentActive && (
        <div style={{ paddingLeft: '10px', paddingTop: '5px' }} className={css.bgMore}>
          <RecruitmentActionDropdownMenu overviewType={OverviewTypes.RecruitmentActive} />
        </div>
      )}
      {!hideOnlyPeriod && (
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
              {/* <Menu.Item className={css.period}>{_l`${startDate}:t(D)`}</Menu.Item> */}
              <Menu.Item className={css.classMrB0}>
                <Button.Group size="small">
                  <Button className={css.chevron} icon="chevron right" onClick={next} />
                </Button.Group>
              </Menu.Item>
            </Menu.Menu>
          )}
          {period !== 'day' && period !== 'all' && period !== 'custom' && (
            <Menu.Menu className={css.singleLine}>
              <Menu.Item className={css.classMrB0}>
                <Button.Group size="small">
                  <Button className={css.chevron} icon="chevron left" onClick={previous} />
                </Button.Group>
              </Menu.Item>
              {/* <Menu.Item position="right" className={css.period}>{_l`${moment(startDate).format(
                'DD MMM'
              )}:t(d) - ${moment(endDate).format('DD MMM, YYYY')}:t(d)`}</Menu.Item> */}
              <Menu.Item position="right" className={css.period}>{`${dayStartTimeStr} ${_l.call(this, [monthStartTimeStr])}`} - {`${dayEndTimeStr} ${_l.call(this, [monthEndTimeStr])}`},{_l`${moment(endDate).format('YYYY')}`}</Menu.Item>
              <Menu.Item className={css.classMrB0}>
                <Button.Group size="small">
                  <Button className={css.chevron} icon="chevron right" onClick={next} />
                </Button.Group>
              </Menu.Item>
            </Menu.Menu>
          )}{' '}
          {period == 'all' && (
            <Menu.Menu className={css.singleLine}>
              {/* <Menu.Item className={css.classMrB0}>
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
              </Menu.Item> */}
            </Menu.Menu>
          )}
          {period == 'custom' && (
            <Menu.Menu className={css.singleLine}>
              <Menu.Item className={css.classMrB0}>
                <Button.Group size="small">
                  <Button className={css.chevron} icon="chevron left" onClick={previous} />
                </Button.Group>
              </Menu.Item>
              {/* <Menu.Item position="right" className={css.period}>{_l`${moment(startDate).format(
                'DD MMM, YYYY'
              )}:t(d) - ${moment(endDate).format('DD MMM, YYYY')}:t(d)`}</Menu.Item> */}
              <Menu.Item>{`${dayStartTimeStr} ${_l.call(this, [monthStartTimeStr])}`}, {_l`${moment(startDate).format('YYYY')}`} - {`${dayEndTimeStr} ${_l.call(this, [monthEndTimeStr])}`}, {_l`${moment(endDate).format('YYYY')}`}</Menu.Item>
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
                            ? `${css.activePeriodBtn} ${css.font11} ${css.active} ${css[objectType]}`
                            : `${css.periodBtn} ${css.inActive} ${css.font11}  ${css[objectType]}`
                          : active
                          ? `${css.periodBtnExpandActive} ${css.font11} ${css.active} ${css[objectType]}`
                          : `${css.periodBtnExpand} ${css.font11} ${css.inActive} ${css[objectType]}`
                      }
                      label={label}
                      period={key}
                      active={active}
                      key={key}
                      objectType={objectType}
                      onClick={selectPeriod}
                    />
                  );
                })}
                <PeriodPicker
                  startDate={startDate}
                  endDate={endDate}
                  onChangeStart={selectStartDate}
                  onChangeEnd={selectEndDate}
                  trigger={
                    <PeriodButton
                      className={
                        customActive
                          ? `${css.activeCustomPeriodBtn} ${css.active} ${css.font11} ${css[objectType]}`
                          : `${css.customPeriodBtn} ${css.inActive} ${css.font11} ${css[objectType]}`
                      }
                      onClick={selectPeriod}
                      period="custom"
                      active={period === 'custom'}
                      label={hasDetail ? _l`C` : _l`Custom`}
                    />
                  }
                />
              </Button.Group>
            </Menu.Item>
          </Menu.Menu>
        </Menu.Menu>
      )}

      {overviewType !== OverviewTypes.Pipeline.Qualified ? (
        <Menu.Menu
          className={overviewType === OverviewTypes.Activity.Appointment ? css.noFilter : css.haveFilter}
          position="right"
        >
          {overviewType !== OverviewTypes.Delegation.Task &&
            overviewType !== OverviewTypes.Delegation.Lead &&
            overviewType !== OverviewTypes.Pipeline.Order &&
            overviewType !== OverviewTypes.Resource &&
            overviewType !== OverviewTypes.RecruitmentActive &&
            overviewType !== OverviewTypes.RecruitmentClosed && (
              <Menu.Item
                className={
                  overviewType === OverviewTypes.CallList.Account || overviewType === OverviewTypes.CallList.Contact
                    ? cx(css.rightIconOnly, search.history && css.circleAvtive)
                    : cx(css.rightIcon, search.history && css.circleAvtive)
                }
                onClick={() => {
                  if (search.history) {
                    blockHistory(objectType);
                  } else {
                    enableHistoryTask(objectType);
                  }
                }}
              >
                {(overviewType === OverviewTypes.CallList.Contact || overviewType === OverviewTypes.CallList.Account) &&
                url.length > 60 ? (
                  ''
                ) : (
                  <Popup
                    style={historyTooltip}
                    trigger={<Image className={css.historyIcon} src={history} />}
                    content={_l`History`}
                    position="top center"
                  />
                )}
              </Menu.Item>
            )}
          {/* <Image className={css.filterIcon} src={filter} /> */}
          {overviewType === OverviewTypes.Activity.Appointment ? (
            ''
          ) : overviewType === OverviewTypes.CallList.Account ||
            overviewType === OverviewTypes.CallList.Contact ||
            overviewType === OverviewTypes.RecruitmentActive ? (
            ''
          ) : (
            <Menu.Item className={`${css.rightIcon} ${css.mr5}`}>
              <FilterActionMenu objectType={objectType} />
            </Menu.Item>
          )}
        </Menu.Menu>
      ) : (
        <Menu.Menu style={qualifiedRightStyle} position="right">
          <div className={cx(css.circleFlex, flagOnClick && css.circleAvtive)} onClick={handleFlag}>
            <Icon
              onClick={() => changeListShow()}
              name="list ul"
              size="large"
              style={{ color: '#808080', fontSize: 18 }}
            />
          </div>
          <InsightPopup />
        </Menu.Menu>
      )}
    </Menu>
  );
};

export default compose(
  defaultProps({
    period: 'day',
    color: 'orange',
    startDate: new Date(),
  }),
  connect(
    (state, { objectType, overviewType }) => {
      const overview = getOverview(state, overviewType);
      const getStateSearch = getSearch(state, objectType);
      return {
        objectPeriod: getPeriod(state, objectType),
        itemCount: overview.itemCount ? overview.itemCount : '',
        search: getStateSearch,
        leftMenu: state.leftMenu,
        currentRC: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
      };
    },
    {
      register: PeriodActionTypes.register,
      next: PeriodActionTypes.next,
      previous: PeriodActionTypes.previous,
      selectPeriod: PeriodActionTypes.selectPeriod,
      selectStartDate: PeriodActionTypes.selectStartDate,
      selectEndDate: PeriodActionTypes.selectEndDate,
      enableHistoryTask: enableHistory,
      blockHistory: blockHistory,
      changeListShow,
      updatePeriodFilter,
      requestUpdateDisplaySetting,
      fetchRCActiveDataByCaseId,
      selectRecruitmentCase,
      fetchListRecruitmentClosedByCaseId,
      updateSelectedCaseInRecruitment,
    }
  ),
  pure,
  withState('flagOnClick', 'setflagOnClick', false),
  withHandlers({
    selectPeriod: ({ objectType, selectPeriod, updatePeriodFilter, requestUpdateDisplaySetting }) => (period) => {
      selectPeriod(objectType, period);
      updatePeriodFilter(objectType, period);
      requestUpdateDisplaySetting();
    },
    handleFlag: ({ setflagOnClick, flagOnClick }) => () => {
      setflagOnClick(!flagOnClick);
    },
    next: ({ objectType, next }) => () => {
      next(objectType);
    },
    previous: ({ objectType, previous }) => () => {
      previous(objectType);
    },
    selectStartDate: ({ objectType, selectStartDate }) => (startDate) => {
      selectStartDate(objectType, startDate);
    },
    selectEndDate: ({ objectType, selectEndDate }) => (endDate) => {
      selectEndDate(objectType, endDate);
    },
    showHistoryTask: ({ showHistoryTask }) => () => {
      showHistoryTask();
    },
    handleChangeCurrentRC: ({
      fetchRCActiveDataByCaseId,
      selectRecruitmentCase,
      fetchListRecruitmentClosedByCaseId,
      objectType,
      updateSelectedCaseInRecruitment,
      requestUpdateDisplaySetting,
    }) => (e, { value }) => {
      selectRecruitmentCase(value);
      if (objectType === ObjectTypes.RecruitmentClosed) {
        fetchListRecruitmentClosedByCaseId(value);
        // updateSelectedCaseInRecruitment('candidateClose', value);
        // requestUpdateDisplaySetting();
      } else if (objectType === ObjectTypes.RecruitmentActive) {
        fetchRCActiveDataByCaseId(value);
        // updateSelectedCaseInRecruitment('candidateActive', value);
        // requestUpdateDisplaySetting();
      }
    },
  }),
  withProps(({ objectPeriod: { startDate, endDate } }) => ({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })),
  lifecycle({
    componentWillMount() {
      const { objectType, register } = this.props;
      register(objectType);
    },
  })
)(PeriodSelector);

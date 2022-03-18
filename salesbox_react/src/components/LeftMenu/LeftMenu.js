import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';
import css from './LeftMenu.css';
import { clearOrderby, clearTerm } from '../AdvancedSearch/advanced-search.actions';
import { ObjectTypes, OverviewTypes } from '../../Constants';
import { clearSelectedOnChangeMenu } from '../Overview/overview.actions';
import { refreshPeriod, selectPeriod } from '../PeriodSelector/period-selector.actions';
import { getPeriod } from '../PeriodSelector/period-selector.selectors';

addTranslations({
  'en-US': {},
});

let menu = [
  // { color: CssNames.Task, to: 'task', label: _l`Reminder`, icon: 'calendar' },
  {
    display: true,
    color: CssNames.Activity,
    to: 'activities',
    label: 'Calendar',
    icon: 'ic_activities',
    objectType: ObjectTypes.Task,
    overviewType: OverviewTypes.Activity.Task,
    subMenu: [
      { to: 'activities/task', objectType: ObjectTypes.Task, label: 'Reminders' },
      {
        to: 'activities/appointments',
        objectType: ObjectTypes.Appointment,
        label: 'Meetings',
      },
      {
        to: 'activities/calendar',
        objectType: ObjectTypes.Appointment,
        label: 'Calendar',
      },
    ],
  },
  {
    display: true,
    objectType: ObjectTypes.CallListAccount,
    overviewType: OverviewTypes.CallList,
    color: CssNames.CallList,
    to: 'call-lists',
    redirect: 'call-lists/account',
    label: 'Call lists',
    icon: 'ic_call-lists',
    subMenu: [
      { to: 'call-lists/account', label: 'Company lists', icon: 'ic_accounts' },
      { to: 'call-lists/contact', label: 'Contact lists', icon: 'ic_contacts' },
    ],
  },
  {
    display: true,
    color: CssNames.Delegation,
    to: 'delegation',
    redirect: 'delegation/tasks',
    label: 'Unassigned',
    icon: 'ic_delegation',
    objectType: ObjectTypes.Delegation,
    overviewType: OverviewTypes.Delegation,
    subMenu: [
      { to: 'delegation/tasks', label: 'Reminders', icon: 'ic_activities' },
      { to: 'delegation/leads', label: 'Prospects', icon: 'ic_unqualified_deals' },
    ],
  },
  {
    display: true,
    color: CssNames.Pipeline,
    to: 'pipeline',
    label: 'Pipeline',
    icon: 'ic_pipeline',
    redirect: 'pipeline/leads',
    objectType: ObjectTypes.PipelineLead,
    overviewType: OverviewTypes.Pipeline,
    subMenu: [
      { to: 'pipeline/leads', objectType: ObjectTypes.Lead, label: 'Prospects', active: 'lead' },
      {
        to: 'pipeline/overview',
        objectType: ObjectTypes.PipelineQualified,
        label: 'Deals',
        icon: 'ic_qualified_deals',
      },
      {
        to: 'pipeline/orders',
        objectType: ObjectTypes.PipelineOrder,
        overviewType: OverviewTypes.Pipeline.Order,
        label: 'Orders',
        icon: 'ic_orders',
      },
    ],
  },

  {
    display: true,
    objectType: ObjectTypes.Account,
    overviewType: OverviewTypes.Account,
    color: CssNames.Account,
    to: 'accounts',
    label: 'Companies',
    icon: 'ic_accounts',
  },
  {
    display: true,
    objectType: ObjectTypes.Contact,
    color: CssNames.Contact,
    to: 'contacts',
    label: 'Contacts',
    icon: 'ic_contacts',
  },

  // {
  //   objectType: 'Campaigns',
  //   overviewType: OverviewTypes.Campaigns,
  //   color: CssNames.Campaign, to: 'campaigns', label: _l`Campaigns`, icon: 'ic_campaigns'
  // },
  {
    display: true,
    objectType: 'Insight',
    color: CssNames.Insight,
    to: 'insights',
    label: _l`Insights`,
    icon: 'ic_insights',
  },
  {
    display: true,
    objectType: ObjectTypes.Resource,
    color: CssNames.Resource,
    to: 'resources',
    label: 'Resources',
    icon: 'ic_resources',
  },
  {
    display: true,
    color: CssNames.Recruitment,
    to: 'recruitment',
    label: 'Recruitment',
    icon: 'ic_recruitment',
    redirect: 'recruitment/active',
    objectType: ObjectTypes.RecruitmentActive,
    overviewType: OverviewTypes.Recruitment,
    subMenu: [
      {
        to: 'recruitment/active',
        objectType: ObjectTypes.RecruitmentActive,
        label: _l`Active`,
      },
      {
        to: 'recruitment/closed',
        objectType: ObjectTypes.RecruitmentClosed,
        label: _l`Closed`,
      },
    ],
  },
];

let customMenu = menu;

class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: null,
      currentSubMenu: null,
      isShowSubMenu: true,
      currentHover: null,
      objectType: ObjectTypes.Task,
      overviewType: OverviewTypes.Activity.Task,
    };
  }

  componentDidMount() {
    this.props.history.listen((location) => {
      if (location && (location.pathname === '/settings/company-info' || location.pathname === '/my-integrations')) {
        this.setState({ currentMenu: null, currentSubMenu: null });
      }
    });

    this.handleDefaultStateLeftMenu();

    if (this.props.setting.display) {
      customMenu = this.handleCustomMenuFromSetting(menu, this.props.setting.display);
    }

    customMenu.forEach((item) => {
      if (this[item.to]) {
        this[item.to].focus();
      }
    });
  }

  handleDefaultStateLeftMenu = () => {
    const { pathname } = location;
    let currentSubMenu = '';
    let currentMenu = '';
    if (pathname.includes('activities') && !pathname.includes('insights')) {
      if (pathname.includes('activities/appointments')) {
        currentMenu = 'activities';
        currentSubMenu = 'activities/appointments';
      } else if (pathname.includes('activities/calendar')) {
        currentMenu = 'activities';
        currentSubMenu = 'activities/calendar';
      } else {
        currentMenu = 'activities';
        currentSubMenu = 'activities/task';
      }
    } else if (pathname.includes('call-lists')) {
      if (pathname.includes('call-lists/account')) {
        currentMenu = 'call-lists/account';
        currentSubMenu = 'call-lists/account';
      } else if (pathname.includes('call-lists/contact')) {
        currentMenu = 'call-lists/contact';
        currentSubMenu = 'call-lists/contact';
      }
    } else if (pathname.includes('delegation')) {
      if (pathname.includes('delegation/tasks')) {
        currentMenu = 'delegation';
        currentSubMenu = 'delegation/tasks';
      } else if (pathname.includes('delegation/leads')) {
        currentMenu = 'delegation';
        currentSubMenu = 'delegation/leads';
      }
    } else if (pathname.includes('pipeline')) {
      if (pathname.includes('pipeline/leads')) {
        currentMenu = 'pipeline';
        currentSubMenu = 'pipeline/leads';
      } else if (pathname.includes('pipeline/overview')) {
        currentMenu = 'pipeline';
        currentSubMenu = 'pipeline/overview';
      } else {
        currentMenu = 'pipeline';
        currentSubMenu = 'pipeline/orders';
      }
    } else if (pathname.includes('accounts')) {
      currentMenu = 'accounts';
      currentSubMenu = 'accounts';
    } else if (pathname.includes('contacts')) {
      currentMenu = 'contacts';
      currentSubMenu = 'contacts';
    } else if (pathname.includes('resources')) {
      currentMenu = 'resources';
      currentSubMenu = 'resources';
    } else if (pathname.includes('insights')) {
      currentMenu = 'insights';
      currentSubMenu = 'insights';
    }

    this.setState({
      currentMenu: currentMenu,
      currentSubMenu: currentSubMenu,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.setting !== nextProps.setting && nextProps.setting.display) {
      customMenu = this.handleCustomMenuFromSetting(menu, nextProps.setting.display);
    }
  }

  handleCustomMenuFromSetting = (defaultMenu, setting) => {
    // let newMenu = defaultMenu;

    let newMenu = defaultMenu.map((item) => {
      if (item.color == CssNames.Activity) {
        if (setting.tasks && setting.tasks.defaultView === 'Tasks') {
          return {
            ...item,
            redirect: 'activities/task',
            objectType: ObjectTypes.Task,
            label: _l`Calendar`,
            subMenu: [
              { to: 'activities/task', objectType: ObjectTypes.Task, label: _l`Reminders` },
              {
                to: 'activities/appointments',
                objectType: ObjectTypes.Appointment,
                label: _l`Meetings`,
              },
              {
                to: 'activities/calendar',
                objectType: ObjectTypes.Appointment,
                label: _l`Calendar`,
              },
            ],
            display: setting.tasks.display,
          };
        } else if (setting.tasks && setting.tasks.defaultView === 'Appointments') {
          return {
            ...item,
            redirect: 'activities/appointments',
            objectType: ObjectTypes.Appointment,
            label: _l`Calendar`,
            subMenu: [
              { to: 'activities/task', objectType: ObjectTypes.Task, label: _l`Reminders` },
              {
                to: 'activities/appointments',
                objectType: ObjectTypes.Appointment,
                label: _l`Meetings`,
              },
              {
                to: 'activities/calendar',
                objectType: ObjectTypes.Appointment,
                label: _l`Calendar`,
              },
            ],
            display: setting.tasks.display,
          };
        } else if (setting.tasks && setting.tasks.defaultView === 'Calendar') {
          return {
            ...item,
            redirect: 'activities/calendar',
            objectType: ObjectTypes.Appointment,
            label: _l`Calendar`,
            subMenu: [
              { to: 'activities/task', objectType: ObjectTypes.Task, label: _l`Reminders` },
              {
                to: 'activities/appointments',
                objectType: ObjectTypes.Appointment,
                label: _l`Meetings`,
              },
              {
                to: 'activities/calendar',
                objectType: ObjectTypes.Appointment,
                label: _l`Calendar`,
              },
            ],
            display: setting.tasks.display,
          };
        } else
          return {
            ...item,
            redirect: 'activities/task',
            objectType: ObjectTypes.Task,
            label: _l`Calendar`,
            subMenu: [
              { to: 'activities/task', objectType: ObjectTypes.Task, label: _l`Reminders` },
              {
                to: 'activities/appointments',
                objectType: ObjectTypes.Appointment,
                label: _l`Meetings`,
              },
              {
                to: 'activities/calendar',
                objectType: ObjectTypes.Appointment,
                label: _l`Calendar`,
              },
            ],
            display: setting.tasks.display,
          };
      } else if (item.color == CssNames.CallList) {
        if (setting.callLists && setting.callLists.defaultView === 'Account') {
          return {
            ...item,
            label: _l`Call lists`,
            redirect: 'call-lists/account',
            objectType: ObjectTypes.CallListAccount,
            subMenu: [
              { to: 'call-lists/account', label: _l`Company lists`, icon: 'ic_accounts' },
              { to: 'call-lists/contact', label: _l`Contact lists`, icon: 'ic_contacts' },
            ],
            display: setting.callLists.display,
          };
        } else if (setting.callLists && setting.callLists.defaultView === 'Contact') {
          return {
            ...item,
            label: _l`Call lists`,
            redirect: 'call-lists/contact',
            objectType: ObjectTypes.CallListContact,
            subMenu: [
              { to: 'call-lists/account', label: _l`Company lists`, icon: 'ic_accounts' },
              { to: 'call-lists/contact', label: _l`Contact lists`, icon: 'ic_contacts' },
            ],
            display: setting.callLists.display,
          };
        } else
          return {
            ...item,
            label: _l`Call lists`,
            subMenu: [
              { to: 'call-lists/account', label: _l`Company lists`, icon: 'ic_accounts' },
              { to: 'call-lists/contact', label: _l`Contact lists`, icon: 'ic_contacts' },
            ],
            display: setting.callLists.display,
          };
      } else if (item.color == CssNames.Delegation) {
        if (setting.delegation && setting.delegation.defaultView === 'Tasks') {
          return {
            ...item,
            redirect: 'delegation/tasks',
            label: _l`Unassigned`,
            objectType: ObjectTypes.Delegation,
            subMenu: [
              { to: 'delegation/tasks', label: _l`Reminders`, icon: 'ic_activities' },
              { to: 'delegation/leads', label: _l`Prospects`, icon: 'ic_unqualified_deals' },
            ],
            display: setting.delegation.display,
          };
        } else if (setting.delegation && setting.delegation.defaultView === 'Unqualified deals') {
          return {
            ...item,
            redirect: 'delegation/leads',
            label: _l`Unassigned`,
            objectType: ObjectTypes.Delegation,
            subMenu: [
              { to: 'delegation/tasks', label: _l`Reminders`, icon: 'ic_activities' },
              { to: 'delegation/leads', label: _l`Prospects`, icon: 'ic_unqualified_deals' },
            ],
            display: setting.delegation.display,
          };
        } else
          return {
            ...item,
            label: _l`Unassigned`,
            subMenu: [
              { to: 'delegation/tasks', label: _l`Reminders`, icon: 'ic_activities' },
              { to: 'delegation/leads', label: _l`Prospects`, icon: 'ic_unqualified_deals' },
            ],
            display: setting.delegation.display,
          };
      } else if (item.color == CssNames.Pipeline) {
        if (setting.pipeline && setting.pipeline.defaultView === 'Unqualified deals') {
          return {
            ...item,
            redirect: 'pipeline/leads',
            label: _l`Pipeline`,
            objectType: ObjectTypes.PipelineLead,
            subMenu: [
              { to: 'pipeline/leads', objectType: ObjectTypes.Lead, label: _l`Prospects`, active: 'lead' },
              {
                to: 'pipeline/overview',
                objectType: ObjectTypes.PipelineQualified,
                label: _l`Deals`,
                icon: 'ic_qualified_deals',
              },
              {
                to: 'pipeline/orders',
                objectType: ObjectTypes.PipelineOrder,
                overviewType: OverviewTypes.Pipeline.Order,
                label: _l`Orders`,
                icon: 'ic_orders',
              },
            ],
            display: setting.pipeline.display,
          };
        } else if (setting.pipeline && setting.pipeline.defaultView === 'Qualified deals') {
          return {
            ...item,
            redirect: 'pipeline/overview',
            label: _l`Pipeline`,
            objectType: ObjectTypes.PipelineQualified,
            subMenu: [
              { to: 'pipeline/leads', objectType: ObjectTypes.Lead, label: _l`Prospects`, active: 'lead' },
              {
                to: 'pipeline/overview',
                objectType: ObjectTypes.PipelineQualified,
                label: _l`Deals`,
                icon: 'ic_qualified_deals',
              },
              {
                to: 'pipeline/orders',
                objectType: ObjectTypes.PipelineOrder,
                overviewType: OverviewTypes.Pipeline.Order,
                label: _l`Orders`,
                icon: 'ic_orders',
              },
            ],
            display: setting.pipeline.display,
          };
        } else if (setting.pipeline && setting.pipeline.defaultView === 'Orders') {
          return {
            ...item,
            redirect: 'pipeline/orders',
            label: _l`Pipeline`,
            objectType: ObjectTypes.PipelineOrder,
            subMenu: [
              { to: 'pipeline/leads', objectType: ObjectTypes.Lead, label: _l`Prospects`, active: 'lead' },
              {
                to: 'pipeline/overview',
                objectType: ObjectTypes.PipelineQualified,
                label: _l`Deals`,
                icon: 'ic_qualified_deals',
              },
              {
                to: 'pipeline/orders',
                objectType: ObjectTypes.PipelineOrder,
                overviewType: OverviewTypes.Pipeline.Order,
                label: _l`Orders`,
                icon: 'ic_orders',
              },
            ],
            display: setting.pipeline.display,
          };
        } else
          return {
            ...item,
            label: _l`Pipeline`,
            subMenu: [
              { to: 'pipeline/leads', objectType: ObjectTypes.Lead, label: _l`Prospects`, active: 'lead' },
              {
                to: 'pipeline/overview',
                objectType: ObjectTypes.PipelineQualified,
                label: _l`Deals`,
                icon: 'ic_qualified_deals',
              },
              {
                to: 'pipeline/orders',
                objectType: ObjectTypes.PipelineOrder,
                overviewType: OverviewTypes.Pipeline.Order,
                label: _l`Orders`,
                icon: 'ic_orders',
              },
            ],
            display: setting.pipeline.display,
          };
      } else if (item.color == CssNames.Insight) {
        if (setting.insights && setting.insights.defaultView === 'Activities') {
          return {
            ...item,
            redirect: 'insights/activities',
            label: _l`Insights`,
            objectType: ObjectTypes.Insight.Activity,
            display: setting.insights.display,
          };
        } else if (setting.insights && setting.insights.defaultView === 'Sales') {
          return {
            ...item,
            redirect: 'insights/sales',
            label: _l`Insights`,
            objectType: ObjectTypes.Insight.Sales,
            display: setting.insights.display,
          };
        } else if (setting.insights && setting.insights.defaultView === 'Top Lists') {
          return {
            ...item,
            redirect: 'insights/toplists',
            label: _l`Insights`,
            objectType: ObjectTypes.Insight.TopLists,
            display: setting.insights.display,
          };
        } else if (setting.insights && setting.insights.defaultView === 'Dashboard') {
          return {
            ...item,
            redirect: 'insights/dashboard',
            label: _l`Insights`,
            objectType: ObjectTypes.Insight.Activity,
            display: setting.insights.display,
          };
        } else if (setting.insights && setting.insights.defaultView === 'Reports') {
          return {
            ...item,
            redirect: 'insights/downloads',
            label: _l`Insights`,
            objectType: ObjectTypes.Insight.Downloads,
            display: setting.insights.display,
          };
        } else return { ...item, display: setting.insights.display };
      } else if (item.color == CssNames.Account) {
        return { ...item, label: _l`Companies`, display: setting.accounts.display };
      } else if (item.color == CssNames.Contact) {
        return { ...item, label: _l`Contacts`, display: setting.contacts.display };
      } else if (item.color == CssNames.Resource) {
        return {
          ...item,
          label: _l`Resources`,
          display:
            setting.resources?.display &&
            (this.props.newIndustry === 'IT_CONSULTANCY'),
        };
      } else if (item.color == CssNames.Recruitment) {
        if(setting.recruitment && setting.recruitment.defaultView === 'CandidateActive' ) {
          return {
            ...item,
            redirect: 'recruitment/active',
            label: _l`Recruitment`,
            objectType: ObjectTypes.RecruitmentActive,
            subMenu: [
              {
                to: 'recruitment/active',
                objectType: ObjectTypes.RecruitmentActive,
                label: _l`ActiveRC`
              },
              {
                to: 'recruitment/closed',
                objectType: ObjectTypes.RecruitmentClosed,
                label: _l`ClosedRC`
              },
            ],
            display: setting?.recruitment?.display &&
            (this.props.newIndustry === 'IT_CONSULTANCY'),
          }
        } else if(setting.recruitment && setting.recruitment.defaultView === 'CandidateClosed') {
          return {
            ...item,
            redirect: 'recruitment/closed',
            label: _l`Recruitment`,
            objectType: ObjectTypes.RecruitmentActive,
            subMenu: [
              {
                to: 'recruitment/active',
                objectType: ObjectTypes.RecruitmentActive,
                label: _l`Active`
              },
              {
                to: 'recruitment/closed',
                objectType: ObjectTypes.RecruitmentClosed,
                label: _l`Closed`
              },
            ],
            display: setting?.recruitment?.display &&
            (this.props.newIndustry === 'IT_CONSULTANCY'),
          }
        }
        return {
          ...item,
          label: _l`Recruitment`,
          display: setting.pipeline?.display &&
          (this.props.newIndustry === 'IT_CONSULTANCY'),
        };
      }
    });
    return newMenu;
  };

  handleClickMenu(item) {
    const { clearOrderby, clearTerm, clearSelectedOnChangeMenu, refreshPeriod, selectPeriod } = this.props;
    const { objectType, overviewType } = this.state;
    if (item.subMenu) {
      if (this.state.currentMenu === item.to) {
        this.setState({
          isShowSubMenu: !this.state.isShowSubMenu,
          // currentSubMenu: item.subMenu[0].to,
          currentSubMenu: item.redirect,
        });
      } else {
        this.setState({
          isShowSubMenu: true,
          // currentSubMenu: item.subMenu[0].to,
          currentSubMenu: item.redirect,
        });
      }
    } else {
      this.setState({
        isShowSubMenu: false,
      });
    }

    if (this.state.currentMenu !== item.to) {
      const { objectPeriod } = this.props;
      // if (
      //   item.redirect === 'activities/calendar' &&
      //   (objectPeriod.period === 'all' || objectPeriod.period === 'custom')
      // ) {
      //   this.props.selectPeriod(item.objectType, 'day');
      // } else if (
      //   item.redirect === 'activities/calendar' &&
      //   objectPeriod.period !== 'all' &&
      //   objectPeriod.period !== 'custom'
      // ) {
      //   this.props.selectPeriod(item.objectType, objectPeriod.period);
      // }
      clearOrderby(objectType);
      clearTerm(objectType);
      clearSelectedOnChangeMenu(overviewType);
      refreshPeriod(objectType);
    }
    this.setState({
      currentMenu: item.to,
      objectType: item.objectType,
      overviewType: item.overviewType,
    });
  }

  handleClickSubMenu(sub) {
    const { objectPeriod } = this.props;
    if (this.state.currentSubMenu !== sub.to && sub.objectType != null) {
      // if (sub.to.includes('calendar') && sub.objectType === 'APPOINTMENT') {
      //   if (objectPeriod.period === 'all' || objectPeriod.period === 'custom') {
      //     this.props.selectPeriod(sub.objectType, 'day');
      //   } else if (objectPeriod !== 'all' && objectPeriod !== 'custom') {
      //     this.props.selectPeriod(sub.objectType, objectPeriod.period);
      //   }
      // }
      this.props.refreshPeriod(sub.objectType);
    }
    this.setState({
      currentSubMenu: sub.to,
    });
  }

  onHover = (menu) => {
    this.setState({ currentHover: menu });
  };

  onLeaver = () => {
    this.setState({ currentHover: null });
  };

  render() {
    const {
      location: { pathname },
      isShowMenu,
      isHoverMenu,
    } = this.props;

    const { isShowSubMenu, currentMenu, currentSubMenu, currentHover } = this.state;

    if(pathname?.includes('redirectFortnox')) return (<div></div>);
    return (
      <div className={`${css.menu} ${isShowMenu || isHoverMenu ? css.showText : ''}`}>
        {customMenu.map((item, key) => {
          const _active =
            pathname.search(item.to) === 1 ||
            (currentMenu && currentMenu === item.to) ||
            (currentHover && currentHover === item.to);
          const color = _active ? item.to : undefined;
          const _subMenuActive = isShowSubMenu && currentMenu === item.to;
          if (!item.display) return null;
          return (
            <>
              {isHoverMenu &&
                (item.objectType === ObjectTypes.Insight.Activity ||
                  item.objectType === ObjectTypes.Insight.Sales ||
                  item.objectType === ObjectTypes.Insight.TopLists ||
                  item.objectType === ObjectTypes.Insight.Downloads ||
                  item.objectType === ObjectTypes.Account ||
                  item.objectType === ObjectTypes.Resource) && <div className={css.line}></div>}
              <div
                className={`${color === item.to && _subMenuActive && (isShowMenu || isHoverMenu) && css[item.to]} ${
                  css.itemContainer
                }`}
                key={`${item.to}-${key}`}
              >
                <Link to={item.redirect ? `/${item.redirect}` : `/${item.to}`} active={_active}>
                  <div className={`${css[item.to]} ${css.preload}`}>
                    <div className={`${css.icon} ${css[item.icon]}`} />
                  </div>
                  <div
                    onMouseLeave={this.onLeaver}
                    onMouseEnter={() => this.onHover(item.to)}
                    onClick={() => {
                      this.handleClickMenu(item);
                    }}
                    className={`${css.item} ${color === item.to ? `${css.active} ${css[item.to]}` : ''}`}
                  >
                    <div className={`${css.icon} ${css[item.icon]}`} />
                    <div className={css.label}>{_l`${item.label}`}</div>
                    {item.subMenu && (
                      <div
                        className={`${css.iconSubMenu} ${_subMenuActive ? css.iconSubUp : css.iconSubDown} ${
                          !isShowMenu ? css.disableIcon : ''
                        }`}
                      ></div>
                    )}
                  </div>
                </Link>
                {item.subMenu && (
                  <div className={`${css.subMenus} ${_subMenuActive && (isShowMenu || isHoverMenu) ? css.show : ''}`}>
                    {item.subMenu.map((sub, index) => {
                      return (
                        <Link
                          to={`/${sub.to}`}
                          key={`${sub.to}-${index}`}
                          onClick={() => {
                            this.handleClickSubMenu(sub);
                          }}
                        >
                          <div className={`${css.itemSubMenu}`}>
                            <div
                              className={`${css.subMenuLabel} ${
                                currentSubMenu === sub.to ? `${css.subLabelActive}` : ''
                              }`}
                            >
                              {_l`${sub.label}`}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state, objectType) => {
  return {
    objectPeriod: getPeriod(state, objectType),
    setting: state.settings,
    newIndustry: state.auth?.company?.newIndustry,
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps, {
    clearOrderby: clearOrderby,
    clearTerm: clearTerm,
    clearSelectedOnChangeMenu,
    refreshPeriod,
    selectPeriod,
  })
)(LeftMenu);

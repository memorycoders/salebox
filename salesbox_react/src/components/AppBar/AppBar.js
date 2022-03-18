// @flow
import * as React from 'react';
import { Menu, Input, Icon, Image, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { LinePoints } from 'components/Svg';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import NotificationsShortList from 'components/Notification/NotificationsShortList';
import * as authActions from 'components/Auth/auth.actions';
import { getUnreadNotificationCount } from 'components/Notification/notification.selector';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import RoleMenu from 'components/RoleMenu/RoleMenu';
import CreateMenu from '../CreateMenu/CreateMenu';
import ProfileMenu from './ProfileMenu';
import css from './AppBar.css';
import callList from '../../../public/Call lists.svg';
import setTaskasDone from '../../../public/Checkbox1.svg';
import mailchimp from '../../../public/mailchimp.png';
import massmail from '../../../public/massmail.png';
import user from '../../../public/user.svg';
import listUpdate from '../../../public/list.svg';
import unqualifiedAdd from '../../../public/Unqualified_deals.svg';
import qualifiedAdd from '../../../public/Qualified_deals.svg';
import unqualifiedAddActive from '../../../public/Unqualified_deals_active.svg';
import qualifiedAddActive from '../../../public/Qualified_deals_active.svg';
import appointmentAdd from '../../../public/Appointments.svg';
import orderAdd from '../../../public/Notes.svg';
import taskAdd from '../../../public/Tasks.svg';
import editBtn from '../../../public/Edit.svg';
import copy from '../../../public/copy.svg';
import checkInHistory from '../../../public/CheckHistory.svg';
import starWonActive from '../../../public/star_circle_won_active.svg';
import starLostActive from '../../../public/star_circle_lost_active.svg';
import starIcon from '../../../public/myStar.svg';
import starIconActive from '../../../public/myStar_active.png';
import checkInList from '../../../public/Check.svg';
import { ObjectTypes, ROUTERS } from 'Constants';
import * as AdvancedSearchActions from '../AdvancedSearch/advanced-search.actions';
import { OverviewTypes } from '../../Constants';
import { requestFetch } from '../Overview/overview.actions';
import iconClose from '../../../public/Close.svg';

// import {FreshdeskFAQ , initLoadFreshdeskFAQ} from '../FreshdeskFAQ/FreshdeskFAQ';
type PropT = {
  location: {
    pathname: string,
  },
  handleShowHideMenu: () => void,
};

addTranslations({
  'en-US': {
    Pipeline: 'Pipeline',
    Contacts: 'Contacts',
    'Call lists': 'Call lists',
    Campaigns: 'Campaigns',
    Insights: 'Insights',
  },
});

const CustomComponent = ({ customData, ...props }) => (
  <div {...props}>
    <div className={css[customData.class]}></div>
    {/* {customData.name} */}
  </div>
);

const typesSearch = [
  {
    value: 'task',
    as: CustomComponent,
    customData: {
      name: 'Task',
      class: 'iconTask',
    },
  },
  {
    value: 'accounts',
    as: CustomComponent,
    customData: {
      name: 'Accounts',
      class: 'iconAccount',
    },
  },
  {
    value: 'contacts',
    as: CustomComponent,
    customData: {
      name: 'Contacts',
      class: 'iconContact',
    },
  },
];

class AppBar extends React.Component<PropT> {
  constructor(props) {
    super(props);
    this.state = {
      currentIcon: 'ic_activities',
      freeTextSearch: '',
      placeholderSearch: _l`Search for a reminder`,
      pathname: '',
    };
  }

  getObjectType(pathname) {

    if (pathname.includes(`/${ROUTERS.ACTIVITIES}/task`)) {
      this.setState({
        currentIcon: 'ic_activities',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a reminder`,
      });
      return ObjectTypes.Appointment;
    }
    if (pathname.includes(`/${ROUTERS.ACTIVITIES}/appointments`)) {
      this.setState({
        currentIcon: 'ic_activities',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a meeting`,
      });
      return ObjectTypes.Appointment;
    }
    if (pathname.includes(`/${ROUTERS.ACTIVITIES}/calendar`)) {
      this.setState({
        currentIcon: 'ic_activities',
        freeTextSearch: '',
        placeholderSearch: _l`Search the calendar`,
      });
      return ObjectTypes.Appointment;
    }
    if (pathname.includes(`/${ROUTERS.DELEGATION}/tasks`)) {
      this.setState({
        currentIcon: 'ic_delegation',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a reminder`,
      });
      return ObjectTypes.Task;
    }
    if (pathname.includes(`/${ROUTERS.DELEGATION}/leads`)) {
      this.setState({
        currentIcon: 'ic_delegation',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a prospect`,
      });
      return ObjectTypes.Task;
    }
    // if (pathname.includes(`/${ROUTERS.ACTIVITIES}`)) {
    //   this.setState({
    //     currentIcon: 'ic_activities',
    //     freeTextSearch: '',
    //     placeholderSearch: _l`Search for a meeting`
    //   })
    //   return ObjectTypes.Task;
    // }
    if (pathname.includes(`/${ROUTERS.CONTACTS}`)) {
      this.setState({
        currentIcon: 'ic_contacts',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a contact`,
      });
      return ObjectTypes.Contact;
    }

    if (pathname.includes(`/${ROUTERS.PIPELINE}/leads`)) {
      this.setState({
        currentIcon: 'ic_product',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a prospect`,
      });
      return ObjectTypes.Lead;
    }

    if (pathname.includes(`/${ROUTERS.PIPELINE}/overview`)) {
      this.setState({
        currentIcon: 'ic_deal',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a deal`,
      });
      return ObjectTypes.Lead;
    }

    if (pathname.includes(`/${ROUTERS.PIPELINE}/order`)) {
      this.setState({
        currentIcon: 'ic_order',
        freeTextSearch: '',
        placeholderSearch: _l`Search for an order`,
      });
      return ObjectTypes.Lead;
    }

    if (pathname.includes(`/${ROUTERS.LEAD}`) || pathname.includes(`/${ROUTERS.PIPELINE}`)) {
      this.setState({
        currentIcon: 'ic_pipeline',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a prospect`,
      });
      return ObjectTypes.Lead;
    }

    if (pathname.includes(`/${ROUTERS.OPPORTUNITY}`)) {
      this.setState({
        currentIcon: 'ic_pipeline',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a deal`,
      });
      return ObjectTypes.Opportunity;
    }

    if (pathname.includes(`/${ROUTERS.ACCOUNTS}`)) {
      this.setState({
        currentIcon: 'ic_accounts',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a company`,
      });
      return ObjectTypes.Account;
    }

    if (pathname.includes(`/${ROUTERS.CALL_LIST}`)) {
      this.setState({
        currentIcon: 'ic_call-lists',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a call list`,
      });
      return ObjectTypes.CallListAccount;
    }

    // if (pathname.includes(`/${ROUTERS.CAMPAIGNS}`)) {
    //   this.setState({
    //     currentIcon: 'ic_campaigns',
    //     freeTextSearch: '',
    //     placeholderSearch: 'Search for campaign'
    //   })
    //   return null
    // }

    if (pathname.includes(`/${ROUTERS.INSIGHTS}`)) {
      this.setState({
        currentIcon: 'ic_insights',
        freeTextSearch: '',
        placeholderSearch: 'Search',
      });
      return null;
    }
    if (pathname.includes(`/${ROUTERS.RESOURCES}`)) {
      this.setState({
        currentIcon: 'ic_resources',
        freeTextSearch: '',
        placeholderSearch: 'Search for a resource',
      });
      return null;
    }
    if(pathname.includes(`/${ROUTERS.RECRUITMENT}`)) {
      this.setState({
        currentIcon: 'ic_recruitment',
        freeTextSearch: '',
        placeholderSearch: _l`Search for a candidate`,
      });
      return null;
    }
  }
  showAdvancedSearch = () => {
    let { show, hide, location, search, currentObjectType } = this.props;
    // let _type = ''

    if (location.pathname) {
      /*const splitPathName = location.pathname.split('/');
      let pathname = '';

      const splitArray = splitPathName.filter((value, index) => index <= 2);
      splitArray.forEach((path, idx) => {
        pathname += path + (idx === splitArray.length - 1 ? '' : '/');
      })

      this.setState({ pathname: pathname })
      _type = //this.getObjectTypeForSearch(location.pathname)*/
      if (currentObjectType) {
        if ((search[currentObjectType] && search[currentObjectType].shown) || !search[currentObjectType]) {
          hide(currentObjectType);
        } else {
          show(currentObjectType);
        }
      }
    }
  };
  handleChangeInput = (e) => {
    this.setState({
      freeTextSearch: e.target.value,
    });
  };
  handleClickIconClear = () => {
    this.setState(
      {
        freeTextSearch: '',
      },
      () => {
        this.setSearchTerm('');
      }
    );
  };
  setSearchTerm = (value) => {
    this.props.handlesearch(value);
  };

  handleSearch = (e) => {
    if (e.key === 'Enter') {
      this.setSearchTerm(e.target.value);
    }
  };
  componentWillMount() {
    const { location } = this.props;
    const splitPathName = location.pathname.split('/');
    let pathnameNew = '';

    const splitArray = splitPathName.filter((value, index) => index <= 2);
    splitArray.forEach((path, idx) => {
      pathnameNew += path + (idx === splitArray.length - 1 ? '' : '/');
    });
    this.setState({ pathname: pathnameNew });
    this.props.history.listen((location) => {
      const { pathname } = this.state;

      if (location.pathname === '/sign-in') {
        this.setState({ pathname: '' }, () => {});
        return;
      }

      if (location.pathname) {
        if (!location.pathname.includes(pathname)) {
          const splitPathName = location.pathname.split('/');
          let pathname = '';
          const splitArray = splitPathName.filter((value, index) => index <= 2);
          splitArray.forEach((path, idx) => {
            pathname += path + (idx === splitArray.length - 1 ? '' : '/');
          });
          let _typeOld = this.getObjectType(pathname);
          if (_typeOld && pathname !== this.state.pathname && location.pathname !== '/sign-in') {
            this.props.setSearchTerm(_typeOld, '');
          }
          this.setState({ pathname: pathname });
        }
      }
    });
  }

  componentDidMount(){
    this.getObjectType(this.props.location.pathname);
  }
  render() {
    const { handleShowHideMenu, search, leftMenu, currentObjectType, isSignedIn } = this.props;
    // const _type = this.getObjectTypeForSearch(location.pathname);
    if (!isSignedIn) {
      return <div />;
    }
    if(this.props.location?.pathname?.includes('redirectFortnox')) return (<div></div>);
    const { leftMenuStatus } = leftMenu;

    const isNoneSearchBarPage =
      location.pathname.includes(`/${ROUTERS.ACTIVITIES}/calendar`) ||
      location.pathname.includes(`/${ROUTERS.INSIGHTS}`) ||
      location.pathname.includes(`/${ROUTERS.GET_STARTED}`) ||
      location.pathname.includes(`/${ROUTERS.BILLING_INFO}`) ||
      location.pathname.includes(`/${ROUTERS.MY_SETTINGS}`) ||
      location.pathname.includes(`/${ROUTERS.SETTINGS}`) ||
      location.pathname.includes(`/activities/calendar`) ||
      location.pathname.includes(`/importCsv`) ||
      location.pathname.includes(`/my-integrations`) ||
      location.pathname.includes(`/resources/`) ||
      location.pathname.includes(`/${ROUTERS.SALES_ACADEMY}`);

    return (
      <div className={css.root}>
        <div className={css.left}>
          <div className={css.menuLogo}>
            <div className={css.menuContainer}>
              {/* <div className={cx(css.menuButton, leftMenuStatus ? css.menuActive : '')}>
                <div className={css.iconMenu} onClick={handleShowHideMenu}></div>
              </div> */}
            </div>
            <div className={css.preload}>
              <Icon name="envelope open outline" />
              <Icon name="envelope outline" />
              <img src={massmail} />
              <img src={mailchimp} />
              <img src={callList} />
              <img src={user} />
              <img src={listUpdate} />
              <img src={unqualifiedAdd} />
              <img src={qualifiedAdd} />
              <img src={unqualifiedAddActive} />
              <img src={qualifiedAddActive} />
              <img src={orderAdd} />
              <img src={appointmentAdd} />
              <img src={taskAdd} />
              <img src={editBtn} />
              <img src={copy} />
              <img src={checkInHistory} />
              <img src={checkInList} />
              <img src={starLostActive} />
              <img src={starWonActive} />
              <img src={starIcon} />
              <img src={starIconActive} />
            </div>
            <div className={css.logo}></div>
            {/* <div className={css.freshDesk}>
            </div> */}
          </div>
        </div>
        <div className={css.center}>
          {!isNoneSearchBarPage && (
            <div className={css.freeSearchContainer}>
              <div className={css.freeSearch}>
                <div className={css.typesSearch}>
                  <div className={`${css[this.state.currentIcon]} ${css.iconSearch}`}></div>
                </div>
                <Input
                  className={css.inputSearch}
                  fluid
                  focus
                  size="medium"
                  onBlur={() => {
                    if (!this.state.freeTextSearch) {
                      this.setSearchTerm('');
                    }
                  }}
                  value={this.state.freeTextSearch}
                  onChange={this.handleChangeInput}
                  onKeyDown={this.handleSearch}
                  icon={
                    <div>
                      {this.state.freeTextSearch && (
                        <div className={css.iconClearSearch}>
                          {/* <Image src={iconClose} width={10} /> */}

                          <Button
                            className={css.btnRemoveRow}
                            // basic
                            icon={<Icon id="iconClearSearch" name="remove" color="red" className={css.iconClear} />}
                            onClick={this.handleClickIconClear}
                          />
                        </div>
                      )}
                      <div
                        id="iconFreeTextSearch"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon
                          size={18}
                          className={css.searchIcon}
                          onClick={() => this.setSearchTerm(this.state.freeTextSearch)}
                          name="search"
                          link
                        />
                      </div>
                    </div>
                  }
                  placeholder={this.state.placeholderSearch}
                />
              </div>
              <div
                style={{
                  background: search[currentObjectType] && search[currentObjectType].shown ? '#eeeeee' : '#fff',
                }}
                className={css.advancedSearchContainer}
              >
                <div className={css.advancedSearch} onClick={this.showAdvancedSearch}></div>
              </div>
            </div>
          )}
        </div>
        <div className={css.right}>
          {!this.props.isCannotPayment && (
            <>
              <CreateMenu />
              <NotificationsShortList />
            </>
          )}
          {/*<FreshdeskFAQ />*/}
          <ProfileMenu />
          {!this.props.isCannotPayment && (
            <>
              <RoleMenu />
            </>
          )}
          <Menu.Item />
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(
    (state) => {
      return {
        notifications: getUnreadNotificationCount(state),
        search: state.search,
        leftMenu: state.leftMenu,
        currentObjectType: state.common.currentObjectType,
        currentOverviewType: state.common.currentOverviewType,
        isCannotPayment: state.overview.errorFetch == 'YOUR_CARD_CANNOT_PAYMENT_CONTINUE',
        isAllCompany: state.auth.admin == 'ALL_COMPANY',
      };
    },
    {
      requestLogout: authActions.requestLogout,
      requestFetch: requestFetch,
      show: AdvancedSearchActions.show,
      hide: AdvancedSearchActions.hide,
      setSearchTerm: AdvancedSearchActions.setTerm,
    }
  ),
  withHandlers({
    handlesearch: ({ setSearchTerm, requestFetch, currentObjectType, currentOverviewType }) => (value) => {
      setSearchTerm(currentObjectType, value);
      requestFetch(currentOverviewType, true);
    },
  })
)(AppBar);

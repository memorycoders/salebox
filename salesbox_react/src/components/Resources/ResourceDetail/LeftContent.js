import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, Flag, Image, Menu, Select, Tab } from 'semantic-ui-react';
import user from '../../../../public/user.svg';
import css from './LeftContent.css';
import addIcon from '../../../../public/Add.svg';
import ProfilePane from './ProfilePane';
import SpinnerResourceDetail from './SpinnerResourceDetail';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import {
  fetchResourceDetail,
  fetchDetailSuccess,
  setCompetence,
  fetchExperience,
  setLanguageResourceDetail,
  fetchCompetence
} from '../resources.actions';
import ExperiencePane from './ExperiencePane';
import InfoCV from './CV/InfoCV';

const LeftContent = (props) => {
  const {
    profileDetail,
    fetchResourceDetail,
    match,
    setTabIndex,
    tabIndex,
    fetchDetailSuccess,
    setCompetence,
    fetchExperience,
    locale,
    setLanguageResourceDetail,
    fetchCompetence
  } = props;
  const [currentVersion, setCurrentVersion] = useState('');

  useEffect(() => {
    // fetchResourceDetail(match.params.resourceId, locale);

    // CAUTION: PLEASE DO NOT CHANGE THIS BECAUSE USE IN MANY PLACE
    localStorage.setItem('language', locale);
    switch (locale) {
      case 'es':
        setCurrentVersion('Spain');
        break;
      case 'se':
        setCurrentVersion('Sweden');
        break;
      case 'en':
        setCurrentVersion('United Kingdom');
        break;
      case 'de':
        setCurrentVersion('Germany');
        break;
    }
    setLanguageResourceDetail(locale);
  }, [locale]);

  const panes = [
    {
      menuItem: _l`ProfileResourceDetail`,
      render: () => (
        <Tab.Pane attached={false}>
          <ProfilePane match={match} currentVersion={currentVersion} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: _l`Experiences`,
      render: () => (
        <Tab.Pane attached={false}>
          <ExperiencePane tabIndex={tabIndex} currentVersion={currentVersion} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: _l`CV`,
      render: () => (
        <Tab.Pane attached={false}>
          <InfoCV match={match} currentVersion={currentVersion} />
        </Tab.Pane>
      ),
    },
  ];
  const [isShowMenu, showHideMenu] = useState(false);
  const handleItemClick = (e, data) => {
    setCurrentVersion(data.flag);
    showHideMenu(false);

    let langVersion = 'se';
    switch (data.flag) {
      case 'Sweden':
        langVersion = 'se';
        localStorage.setItem('language', 'se');
        break;
      case 'United Kingdom':
        langVersion = 'en';
        localStorage.setItem('language', 'en');
        break;
      case 'Germany':
        langVersion = 'de';
        localStorage.setItem('language', 'de');
        break;
      case 'Spain':
        langVersion = 'es';
        localStorage.setItem('language', 'es');
        break;
      default:
        langVersion = 'se';
        localStorage.setItem('language', 'se');
        break;
    }
    setLanguageResourceDetail(langVersion);
    fetchCompetence(match.params.resourceId);
    if (tabIndex === 0) {
      // fetchResourceDetail(match.params.resourceId, langVersion);
    } else {
      fetchExperience({ resourceId: match.params.resourceId, language: langVersion });
    }
  };
  const handleCloseDetail = () => {
    props.history.goBack();
    setCompetence([]);
    fetchDetailSuccess(null);
  };

  let fullName = '';
  let title = '';

  if (profileDetail?.resourceType === 'CONTRACTOR') {
    fullName = `${profileDetail?.firstName || ''} ${profileDetail?.lastName || ''} - ${profileDetail?.enterpriseName ||
      ''}`;
    title = `${profileDetail?.title || ''} - ` + _l`Contractor`;
  } else {
    fullName = `${profileDetail?.firstName || ''} ${profileDetail?.lastName || ''}`;
    title = `${profileDetail?.title || ''} - ` + _l`Employee`;
  }
  let avatarUrl = profileDetail?.avatar
    ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${profileDetail.avatar.slice(-3)}/${profileDetail.avatar}`
    : user;

  const onTabChange = useCallback((_, data) => {
    setTabIndex(data.activeIndex);
  }, []);

  return (
    <div id="leftContent" className={css.leftContent}>
      <div>
        <div className={css.avatar}>
          <Image src={avatarUrl} size="large" circular />
        </div>
        <div className={css.rightCornerDiv}>
          <img src={addIcon} className={css.closeIcon} onClick={handleCloseDetail} />
          <div style={{ margin: '5 0 10 0' }}>
            <span style={{ marginRight: 5 }}>{_l`Version`}</span>
            <Flag
              className={css.version}
              name={currentVersion}
              onClick={() => {
                showHideMenu(!isShowMenu);
              }}
            />
            <div className={`${css.listFlag} ${isShowMenu ? css.show : css.hide}`}>
              <Menu vertical fluid size="mini">
                <Menu.Item onClick={handleItemClick} flag="Sweden">
                  <Flag name="sweden" />
                </Menu.Item>
                <Menu.Item onClick={handleItemClick} flag="United Kingdom">
                  <Flag name="United Kingdom" />
                </Menu.Item>
                <Menu.Item onClick={handleItemClick} flag="Germany">
                  <Flag name="Germany" />
                </Menu.Item>
                <Menu.Item onClick={handleItemClick} flag="Spain">
                  <Flag name="Spain" />
                </Menu.Item>
              </Menu>
            </div>
          </div>
          <SpinnerResourceDetail currentVersion={currentVersion} />
        </div>
        <div className={css.name}>
          <h3 className={css.fullName}>{fullName ? fullName : ''}</h3>
        </div>
        <div>
          <h4 className={css.title}>{title}</h4>
        </div>
        <Tab className="tabs-resource" onTabChange={onTabChange} menu={{ secondary: true }} panes={panes} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  locale: state.ui?.app?.locale,
});
const mapDispatchToProps = {
  fetchResourceDetail,
  fetchDetailSuccess,
  setCompetence,
  fetchExperience,
  setLanguageResourceDetail,
  fetchCompetence
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftContent));

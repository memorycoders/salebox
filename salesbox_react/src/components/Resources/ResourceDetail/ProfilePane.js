import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Input, GridColumn, GridRow, TextArea, Form, Dropdown, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './ProfilePane.css';
import { TagProfile } from './TagProfile';
import cx from 'classnames';
import api from 'lib/apiClient';
import isEmail from 'lib/isEmail';
import isValidPhone from 'lib/isValidPhone';
import UserDropdown from '../../User/UserDropdown';
import { Endpoints } from '../../../Constants';
import { fetchResourceDetail } from '../resources.actions';
import pick from 'lodash/pick';

const mapLanguage = {
  Sweden: 'se',
  'United Kingdom': 'en',
  Germany: 'de',
  Spain: 'es',
};

export const ProfilePane = (props) => {
  const { profileDetail, match, currentVersion, LANGUAGE_RESOURCE_DETAIL } = props;
  const initError = {
    firstName: false,
    lastName: false,
    title: false,
    occupancy: false,
    email: false,
    phone: false,
    description: false,
    manager: false,
  };
  // const [profileDetail, setProfile] = useState(initProfile);
  const [error, setError] = useState(initError);
  const [profileUpdateInfo, setProfileUpdateInfo] = useState({});

  const [listCertificate, setListCertificate] = useState([]);
  const [listEducation, setlistEducation] = useState([]);
  const [listEmployee, setlistEmployee] = useState([]);
  const [listIndustry, setListIndustry] = useState([]);
  const [listLanguage, setListLanguage] = useState([]);

  useEffect(() => {
    if (
      match &&
      match.params &&
      match.params.resourceId &&
      LANGUAGE_RESOURCE_DETAIL === localStorage.getItem('language')
    ) {
      fetchListIndustry();
      fetchListEmployee();
      fetchListEducation();
      fetchListLanguage();
      fetchListCertificate();
    }
  }, [LANGUAGE_RESOURCE_DETAIL]);

  useEffect(() => {
    props.fetchResourceDetail(match?.params?.resourceId, mapLanguage[currentVersion]);
  }, [currentVersion]);
  let levelOptions = [
    {
      key: 1,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0 }}>{_l`Competence level 1`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`recently completed training in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`shorter work experience or new to the role of consultant`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`requires management`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can independently perform simple tasks`}
                </p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>1</p>}
        />
      ),
      des: 'test 1',
      value: 1,
    },
    {
      key: 2,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0 }}>{_l`Competence level 2`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`has training in the current role, some degree of difficulty`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in the execution of several similar assignments. The level is normally reached after 1-3 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`requires management`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can independently perform limited tasks`}
                </p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>2</p>}
        />
      ),
      des: 'test 2',
      value: 2,
    },
    {
      key: 3,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0 }}>{_l`Competence level 3`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`high competence in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`worked 4-8 years in the current role, is a role model for other Consultants at lower levels`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`takes responsibility for sub-area, can lead and small group`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`can work independently`}
                </p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>3</p>}
        />
      ),
      des: 'test 3',
      value: 3,
    },
    {
      key: 4,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0 }}>{_l`Competence level 4`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`high generalist competence, or very high competence in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in large assignments within the current role and completed Consultancy Services with very high quality. The level is normally reached at the earliest after 9–12 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`takes main responsibility for the management of a larger group`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`very independent`}
                </p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>4</p>}
        />
      ),
      des: 'test 4',
      value: 4,
    },
    {
      key: 5,
      text: (
        <Popup
          hoverable
          content={{
            content: (
              <div>
                <p style={{ margin: 0 }}>{_l`Competence level 5`}</p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Knowledge`}</span> -{' '}
                  {_l`competence of the highest rank in the current role, perceived as an expert in the market`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Experience`}</span> -{' '}
                  {_l`has participated in large assignments within the current role and completed Consultancy Services with very high quality. The level is normally reached at the earliest after 9–12 years in the current role`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Management`}</span> -{' '}
                  {_l`has great experience and experience to work in a leading position`}
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ fontWeight: 600, wordBreak: 'normal' }}>{_l`Independence`}</span> -{' '}
                  {_l`very independent`}
                </p>
              </div>
            ),
          }}
          style={{ fontSize: 11 }}
          trigger={<p>5</p>}
        />
      ),
      des: 'test 5',
      value: 5,
    },
  ];
  const fallbackCallFetchListTag = (type) => {
    switch (type) {
      case 'Industry':
        fetchListIndustry();
        break;
      case 'Employee':
        fetchListEmployee();
        break;
      case 'Education':
        fetchListEducation();
        break;
      case 'Language':
        fetchListLanguage();
        break;
      case 'Certificate':
        fetchListCertificate();
        break;
    }
  };
  const fetchListIndustry = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listIndustry`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: LANGUAGE_RESOURCE_DETAIL,
        },
      });
      if (res) {
        setListIndustry(res?.sort(function(a, b){
          if(a.year < b.year) return 1;
          if(a.year > b.year) return -1;
          return 0;
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListEmployee = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listEmployer`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: LANGUAGE_RESOURCE_DETAIL,
        },
      });
      if (res) {
        setlistEmployee(res?.sort(function(a, b){
          if(a.endYear < b.endYear) return 1;
          if(a.endYear > b.endYear) return -1;
          return 0;
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListEducation = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listEducation`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: LANGUAGE_RESOURCE_DETAIL,
        },
      });
      if (res) {
        setlistEducation(res?.sort(function(a, b){
          if(a.endYear < b.endYear) return 1;
          if(a.endYear > b.endYear) return -1;
          return 0;
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListLanguage = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listLanguage`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: LANGUAGE_RESOURCE_DETAIL,
        },
      });
      if (res) {
        setListLanguage(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListCertificate = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listCertificate`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: LANGUAGE_RESOURCE_DETAIL,
        },
      });
      if (res) {
        setListCertificate(res?.sort(function(a, b){
          if(a.year < b.year) return 1;
          if(a.year > b.year) return -1;
          return 0;
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setProfileUpdateInfo(
      pick(profileDetail, [
        'firstName',
        'lastName',
        'title',
        'occupancy',
        'email',
        'phone',
        'profileDescription',
        'managerId',
        'languageId',
        'resourceVersionId',
        'profileLevel',
      ])
    );
  }, [profileDetail]);

  const makeHandleChangeProfile = (key, value) => {
    setError({ ...error, [key]: false });
    if ((key === 'occupancy' && parseInt(value) >= 0 && parseInt(value) <= 100) || !value) {
      setProfileUpdateInfo({ ...profileUpdateInfo, [key]: value });
    } else if (key !== 'occupancy') {
      setProfileUpdateInfo({ ...profileUpdateInfo, [key]: value });
    }
  };

  const handleRequestUpdateManager = async (type, value) => {
    try {
      const res = await api.put({
        resource: `${Endpoints.Resource}/resource/updateDetailProfile`,
        data: {
          ...profileUpdateInfo,
          resourceId: match.params.resourceId,
          languageVersion: mapLanguage[currentVersion],
          [type]: value,
        },
      });
      if (res) {
        props.fetchResourceDetail(res.resourceId, mapLanguage[currentVersion]);
        setProfileUpdateInfo({ ...profileUpdateInfo, [type]: value });
      }
    } catch (e) {}
  };

  const validateProfile = () => {
    const { firstName, lastName, title, occupancy, email, phone, description } = profileUpdateInfo;
    if (!firstName) {
      setError({ ...error, firstName: true });
      return false;
    }
    if (!lastName) {
      setError({ ...error, lastName: true });
      return false;
    }
    if (email && !isEmail(email)) {
      setError({ ...error, email: true });
      return false;
    }
    if (phone && !isValidPhone(phone)) {
      setError({ ...error, phone: true });
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    if (validateProfile()) {
      try {
        const res = await api.put({
          resource: `${Endpoints.Resource}/resource/updateDetailProfile`,
          data: {
            ...profileUpdateInfo,
            resourceId: match.params.resourceId,
            languageVersion: mapLanguage[currentVersion],
          },
        });
        if (res) {
          props.fetchResourceDetail(res.resourceId, mapLanguage[currentVersion]);
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <Grid columns={2} style={{ margin: 0 }}>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`First name`}</p>
            <span className={css.requiredField}>*</span>
            <div className={css.fieldHasValidate}>
              <Input
                error={error.firstName}
                name="firstName"
                className={css.inputForm}
                value={profileUpdateInfo?.firstName}
                onChange={(e) => makeHandleChangeProfile('firstName', e.target.value)}
                onBlur={handleUpdateProfile}
              />
              {error.firstName && <p className={css.errorMessage}>{_l`First name is required`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Title`}</p>
            <Input
              name="title"
              className={cx(css.inputForm, css.fieldNotHasValidate)}
              value={profileUpdateInfo?.title}
              onChange={(e) => makeHandleChangeProfile('title', e.target.value)}
              onBlur={handleUpdateProfile}
            />
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Last name`}</p>
            <span className={css.requiredField}>*</span>
            <div className={css.fieldHasValidate}>
              <Input
                error={error.lastName}
                name="lastName"
                className={css.inputForm}
                value={profileUpdateInfo?.lastName}
                onChange={(e) => makeHandleChangeProfile('lastName', e.target.value)}
                onBlur={handleUpdateProfile}
              />
              {error.lastName && <p className={css.errorMessage}>{_l`Last name is required`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Occupancy`}</p>
            <Input
              label={{ basic: true, content: '%' }}
              labelPosition="right"
              name="occupancy"
              type="number"
              disabled
              min={0}
              max={100}
              className={cx(css.inputForm, css.fieldNotHasValidate)}
              value={profileUpdateInfo?.occupancy}
              onBlur={handleUpdateProfile}
              onChange={(e) => makeHandleChangeProfile('occupancy', e.target.value)}
            />
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Email`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                error={error.email}
                name="email"
                type="email"
                className={css.inputForm}
                disabled
                onBlur={handleUpdateProfile}
                value={profileUpdateInfo?.email}
                onChange={(e) => makeHandleChangeProfile('email', e.target.value)}
              />
              {error.email && <p className={css.errorMessage}>{_l`Email is invalid`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Manager`}</p>
            <div className={css.fieldHasValidate}>
              <UserDropdown
                id="managerDropdownResource"
                value={profileUpdateInfo?.managerId}
                onChange={(_, { value }) => handleRequestUpdateManager('managerId', value)}
              />
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Phone`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                error={error.phone}
                name="phone"
                className={css.inputForm}
                value={profileUpdateInfo?.phone}
                onBlur={handleUpdateProfile}
                onChange={(e) => makeHandleChangeProfile('phone', e.target.value)}
              />
              {error.phone && <p className={css.errorMessage}>{_l`Phone is invalid`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Profile level`}</p>
            <div className={css.fieldHasValidate}>
              <Dropdown
                placeholder="Select profile level"
                value={profileUpdateInfo?.profileLevel}
                fluid
                selection
                search
                onChange={(_, { value }) => handleRequestUpdateManager('profileLevel', value)}
                options={levelOptions}
              />
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Description`}</p>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row} columns={1} style={{ paddingBottom: 0 }}>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <Form style={{ width: '100%' }}>
              <TextArea
                rows={3}
                onBlur={handleUpdateProfile}
                className={css.description}
                value={profileUpdateInfo?.profileDescription || ''}
                onChange={(e) => makeHandleChangeProfile('profileDescription', e.target.value)}
              />
            </Form>
          </GridColumn>
        </GridRow>
      </Grid>
      <TagProfile
        resourceDetail={profileDetail}
        listTag={listIndustry}
        type="Industry"
        fallbackCallFetchListTag={fallbackCallFetchListTag}
      />
      <TagProfile
        resourceDetail={profileDetail}
        listTag={listEmployee}
        type="Employee"
        fallbackCallFetchListTag={fallbackCallFetchListTag}
      />
      <TagProfile
        resourceDetail={profileDetail}
        listTag={listEducation}
        type="Education"
        fallbackCallFetchListTag={fallbackCallFetchListTag}
      />
      <TagProfile
        resourceDetail={profileDetail}
        listTag={listLanguage}
        type="Language"
        fallbackCallFetchListTag={fallbackCallFetchListTag}
      />
      <TagProfile
        resourceDetail={profileDetail}
        listTag={listCertificate}
        type="Certificate"
        fallbackCallFetchListTag={fallbackCallFetchListTag}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  LANGUAGE_RESOURCE_DETAIL: state.entities?.resources?.LANGUAGE_RESOURCE_DETAIL,
});

const mapDispatchToProps = { fetchResourceDetail };

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePane);

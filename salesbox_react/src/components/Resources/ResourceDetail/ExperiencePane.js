import React, { useState, memo, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Input, GridColumn, GridRow, TextArea, Form, Button, Divider, Icon } from 'semantic-ui-react';
import moment from 'moment';
import _l from 'lib/i18n';
import css from './ProfilePane.css';
import cx from 'classnames';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import CompetenceExperiences from './CompetenceExperiences';
import { compose } from 'recompose';
import * as ResourcesActionsTypes from '../resources.actions';
import { withRouter } from 'react-router-dom';

const ExperiencePane = (props: any) => {
  const {
    match,
    competences,
    competenceDTOList,
    addExperience,
    itemUpdate,
    updateExperience,
    setCompetenceDTOListExperience,
    tabIndex,
    setUpdateExperience,
    currentVersion,
    valueSortedCompetenceList,
  } = props;
  const resourceId = match?.params?.resourceId;

  const initError = {
    company: false,
    title: false,
    occupancy: false,
    description: false,
    startDate: false,
    endDate: false,
    checkDate: false,
    location: false,
  };

  const [profileUpdateInfo, setProfileUpdateInfo] = useState({});

  const [error, setError] = useState(initError);

  useEffect(() => {
    if (itemUpdate) {
      setProfileUpdateInfo(itemUpdate);
      setCompetenceDTOListExperience(itemUpdate.competenceDTOList);
    } else {
      setProfileUpdateInfo({});
      setCompetenceDTOListExperience([]);
    }
  }, [itemUpdate]);

  const makeHandleChangeExperience = (key, value) => {
    setError({ ...error, [key]: false, checkDate: false });

    const newProfile = { ...profileUpdateInfo, [key]: value };

    if ((key === 'occupancy' && parseInt(value) >= 0 && parseInt(value) <= 100) || !value) {
      setProfileUpdateInfo(newProfile);
    } else if (key !== 'occupancy') {
      setProfileUpdateInfo(newProfile);
    }

    const { startDate, endDate } = newProfile;
    if (!!startDate && !!endDate) {
      if (moment(startDate).format('x') < moment(endDate).format('x')) {
        setError({ ...error, checkDate: false, [key]: false });
      } else {
        setError({ ...error, checkDate: true, [key]: false });
      }
    }
  };

  useEffect(() => {
    setProfileUpdateInfo({});
    setUpdateExperience(null);
  }, [tabIndex]);

  const validateProfile = () => {
    const { company, title, occupancy, description, startDate, endDate, location } = profileUpdateInfo;
    if (!company) {
      setError({ ...error, company: true });
      return false;
    }
    if (!title) {
      setError({ ...error, title: true });
      return false;
    }
    if (!startDate) {
      setError({ ...error, startDate: true });
      return false;
    }
    // if (!occupancy) {
    //   setError({ ...error, occupancy: true });
    //   return false;
    // }
    // if (!endDate) {
    //   setError({ ...error, endDate: true });
    //   return false;
    // }
    if (startDate && endDate) {
      if (moment(startDate).format('x') > moment(endDate).format('x')) {
        setError({ ...error, checkDate: true });
        return false;
      }
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    if (validateProfile()) {
      try {
        // call api update profileUpdateInfo here
      } catch (error) {}
    }
  };

  const handlePress = useCallback(() => {
    let lang = 'se';
    switch (currentVersion) {
      case 'Sweden':
        lang = 'se';
        break;
      case 'Germany':
        lang = 'de';
        break;
      case 'United Kingdom':
        lang = 'en';
        break;
      case 'Spain':
        lang = 'es';
        break;
      default:
        lang = 'se';
        break;
    }
    if (validateProfile()) {
      const query = {
        ...profileUpdateInfo,
        competenceDTOList,
        resourceId,
        language: lang,
        startDate: parseInt(moment(profileUpdateInfo.startDate).format('x'), 10),
        endDate: profileUpdateInfo.endDate ? parseInt(moment(profileUpdateInfo.endDate).format('x'), 10) : null,
        occupancy: parseInt(profileUpdateInfo.occupancy, 10),
        description: profileUpdateInfo.description || '',
        ...(itemUpdate && { uuid: itemUpdate.uuid }),
      };

      if (itemUpdate) {
        updateExperience(query);
      } else {
        addExperience(query);
      }

      setProfileUpdateInfo({});
      setCompetenceDTOListExperience([]);
    }
  }, [
    profileUpdateInfo,
    resourceId,
    competenceDTOList,
    itemUpdate,
    updateExperience,
    addExperience,
    setCompetenceDTOListExperience,
  ]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className={css.label} style={{ marginBottom: 0 }}>{_l`General`}</p>
        <Button onClick={handlePress} className={cx(css.commonButton, css.commonDoneButton)}>
          {itemUpdate ? _l`Update experience` : _l`Add experience`}{' '}
        </Button>
      </div>
      <Divider />
      <Grid columns={2} style={{ margin: 0 }}>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Company`}</p>
            <span className={css.requiredField}>*</span>
            <div className={css.fieldHasValidate}>
              <Input
                error={error.company}
                name="company"
                className={css.inputForm}
                value={profileUpdateInfo?.company || ''}
                onChange={(e) => makeHandleChangeExperience('company', e.target.value)}
                onBlur={handleUpdateProfile}
              />
              {error.company && <p className={css.errorMessage}>{_l`Company is required`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Title`}</p>
            <span className={css.requiredField}>*</span>
            <div className={css.fieldHasValidate}>
              <Input
                name="title"
                fluid
                error={error.title}
                className={cx(css.inputForm)}
                value={profileUpdateInfo?.title || ''}
                onChange={(e) => makeHandleChangeExperience('title', e.target.value)}
                onBlur={handleUpdateProfile}
              />
              {error.title && <p className={css.errorMessage}>{_l`Title is required`}</p>}
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Start date`}</p>
            <span className={css.requiredField}>*</span>
            <div className={css.fieldHasValidate}>
              <DatePickerInput
                error={error.startDate}
                value={profileUpdateInfo.startDate}
                onChange={(value) => makeHandleChangeExperience('startDate', value)}
              />
              {error.startDate && <p className={css.errorMessage}>{_l`Start date is required`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Occupancy`}</p>
            {/* <span className={css.requiredField}>*</span> */}
            <div className={css.fieldHasValidate}>
              <Input
                label={{ basic: true, content: '%' }}
                labelPosition="right"
                name="occupancy"
                type="number"
                min={0}
                max={100}
                error={error.occupancy}
                className={cx(css.inputForm)}
                value={profileUpdateInfo?.occupancy || ''}
                onBlur={handleUpdateProfile}
                onChange={(e) => makeHandleChangeExperience('occupancy', e.target.value)}
              />
              {/* {error.occupancy && <p className={css.errorMessage}>{_l`Occupied is required`}</p>} */}
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`End date`}</p>
            {/* <span className={css.requiredField}>*</span> */}
            <div className={css.fieldHasValidate}>
              <DatePickerInput
                error={error.endDate}
                value={profileUpdateInfo.endDate}
                onChange={(value) => makeHandleChangeExperience('endDate', value)}
              />
              {/* {error.endDate && <p className={css.errorMessage}>{_l`End date is required`}</p>} */}
              {error.checkDate && <p className={css.errorMessage}>{_l`End date cannot be before start date`}</p>}
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Location`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                name="location"
                fluid
                error={error.location}
                className={cx(css.inputForm)}
                value={profileUpdateInfo?.location || ''}
                onChange={(e) => makeHandleChangeExperience('location', e.target.value)}
                onBlur={handleUpdateProfile}
              />
              {error.location && <p className={css.errorMessage}>{_l`Location is required`}</p>}
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row} columns={1}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Description`}</p>
            {/* <span className={css.requiredField}>*</span> */}
          </GridColumn>

          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <Form style={{ width: '100%' }}>
              <TextArea
                // error={error.description}
                rows={4}
                onBlur={handleUpdateProfile}
                className={css.description}
                value={profileUpdateInfo?.description || ''}
                onChange={(e) => makeHandleChangeExperience('description', e.target.value)}
              />
            </Form>

          </GridColumn>
        </GridRow>
      </Grid>

      <div className={css.competencesExper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={css.label} style={{ marginBottom: 0 }}>{_l`Competences`}</p>
        </div>
        <Divider />
        <div className="addCompetenceItem">
          <Grid>
            <GridRow>
              <GridColumn width={2} style={{ cursor: 'pointer' }} onClick={() => props.sortCompetenceList('level')}>
                {_l`Level`} {valueSortedCompetenceList === 'level' && <Icon name="angle down" />}
              </GridColumn>
              <GridColumn
                width={8}
                style={{ cursor: 'pointer' }}
                onClick={() => props.sortCompetenceList('competence')}
              >
                {_l`Competence`} {valueSortedCompetenceList === 'competence' && <Icon name="angle down" />}
              </GridColumn>
              <GridColumn width={5} style={{ cursor: 'pointer' }} onClick={() => props.sortCompetenceList('lastUsed')}>
                {_l`Last used`} {valueSortedCompetenceList === 'lastUsed' && <Icon name="angle down" />}
              </GridColumn>
              <GridColumn width={1} />
            </GridRow>
          </Grid>
          {competences.map((item, index) => (
            <CompetenceExperiences
              checked={competenceDTOList?.some((i) => i.uuid === item.uuid)}
              item={item}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  competences: state.entities?.resources?.competences || [],
  competenceDTOList: state.entities?.resources?.experiences?.competenceDTOList || [],
  itemUpdate: state.entities?.resources?.experiences?.itemUpdate,
  valueSortedCompetenceList: state.entities?.resources?.valueSortedCompetenceList,
});

const mapDispatchToProps = {
  setUpdateExperience: ResourcesActionsTypes.setUpdateExperience,
  addExperience: ResourcesActionsTypes.addExperience,
  updateExperience: ResourcesActionsTypes.updateExperience,
  setCompetenceDTOListExperience: ResourcesActionsTypes.setCompetenceDTOListExperience,
  sortCompetenceList: ResourcesActionsTypes.sortCompetenceList,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), memo, withRouter)(ExperiencePane);

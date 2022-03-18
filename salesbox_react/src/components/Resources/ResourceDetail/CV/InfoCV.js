/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Input, Button, GridColumn, GridRow, Divider, Dropdown, Form, Icon, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from '../ProfilePane.css';
import { TagProfile } from '../TagProfile';
import CompetenceExperiences from '../CompetenceExperiences';
import { Endpoints } from '../../../../Constants';
import api from 'lib/apiClient';
import UserDropdown from '../../../User/UserDropdown';
import * as ResourcesActionsTypes from '../../resources.actions';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import styles from './Cv.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import update from 'immer';
import CreateCV from './CreateCV';

export const InfoCV = ({
  profileDetail,
  competences,
  match,
  setxperienceCv,
  experienceList,
  auth,
  putSuccess,
  currentVersion,
  valueSortedCompetenceList,
  sortCompetenceList,
  LANGUAGE_RESOURCE_DETAIL,
}: any) => {
  const resourceId = match?.params?.resourceId;

  const [competenceDTOList, setCompetenceDTOList] = useState([]);
  const [cvLiteDTOList, setCvLiteDTOList] = useState([]);
  const [singleCvDTO, setSingleCvDTO] = useState({
    cvCertificateList: [],
    cvCompetenceList: [],
    cvEducationList: [],
    cvEmployerList: [],
    cvExperienceList: [],
    cvLanguageList: [],
    resourceId: '',
    userId: '',
    language: 'en',
    name: '',
    referenceName: 'Twendee',
    referenceCompany: '',
    referencePhone: '',
    referenceEmail: '',
    header: '',
  });
  const [detail, setDetail] = useState({
    referenceName: '',
    userId: '',
    referencePhone: '',
    referenceCompany: '',
    referenceEmail: '',
    header: '',
  });

  useEffect(() => {
    if (auth) {
      setDetail((state) => ({ ...state, userId: auth.userId }));
      setSingleCvDTO((state) => ({
        ...state,
        userId: auth.userId,
      }));
    }
  }, [auth]);

  useEffect(() => {
    setDetail({ ...detail, title: profileDetail?.title, description: profileDetail?.profileDescription });
  }, [profileDetail]);
  useEffect(() => {
    let competence = competences.map((i) => ({ ...i, resourceCompetenceId: i.uuid, checked: false }));
    setCompetenceDTOList(competence);
    setSingleCvDTO((state) => ({
      ...state,
      cvCompetenceList: competence,
    }));
  }, [competences]);

  const [listCureent, setListCureent] = useState({
    listCertificate: [],
    listEducation: [],
    listEmployee: [],
    listLanguage: [],
  });
  const [listCertificate, setListCertificate] = useState([]);
  const [listEducation, setlistEducation] = useState([]);
  const [listEmployee, setlistEmployee] = useState([]);
  const [listLanguage, setListLanguage] = useState([]);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [cvId, setCvId] = useState('');
  const [visibleCV, setVisibleCV] = useState(false);

  useEffect(() => {
    fetchAllList();
    fetchCvLiteDTOList();
    setxperienceCv([]);
    setSingleCvDTO((state) => ({
      ...state,
      resourceId: resourceId,
    }));
  }, []);

  const fetchCvLiteDTOList = async () => {
    if (resourceId) {
      try {
        const { cvLiteDTOList } = await api.get({
          resource: `${Endpoints.Resource}/resource/cv/getAll`,
          query: {
            resourceId,
            language: localStorage.getItem('language') || 'en',
          },
        });
        setCvLiteDTOList(cvLiteDTOList);
      } catch (error) {}
    }
  };

  const fetchAllList = () => {
    if (match && match.params && match.params.resourceId) {
      fetchListEmployee();
      fetchListEducation();
      fetchListCertificate();
      fetchListLanguage();
    }
  };

  const fetchListEmployee = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/resource/listEmployer`,
        query: {
          resourceId: match.params.resourceId,
          languageVersion: localStorage.getItem('language') || 'en',
        },
      });
      if (res) {
        setlistEmployee(
          res?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          })
        );
        let convertEmployee = res
          ?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          })
          .map((item) => {
            return {
              uuid: '',
              cvId: '',
              resourceEmployerId: item.resourceEmployerId,
              employerId: item.employerId,
              employerName: item.name,
              startYear: item.startYear,
              endYear: item.endYear,
            };
          });
        setSingleCvDTO((state) => ({
          ...state,
          cvEmployerList: convertEmployee,
        }));
        setListCureent((state) => ({
          ...state,
          listEmployee: res?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          }),
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
          languageVersion: localStorage.getItem('language') || 'en',
        },
      });
      if (res) {
        setlistEducation(
          res?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          })
        );
        let convertEducation = res
          ?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          })
          .map((item) => {
            return {
              uuid: '',
              cvId: '',
              resourceEducationId: item.resourceEducationId,
              educationId: item.educationId,
              schoolName: item.name,
              startYear: item.startYear,
              endYear: item.endYear,
            };
          });
        setSingleCvDTO((state) => ({
          ...state,
          cvEducationList: convertEducation,
        }));
        setListCureent((state) => ({
          ...state,
          listEducation: res?.sort(function(a, b) {
            if (a.endYear < b.endYear) return 1;
            if (a.endYear > b.endYear) return -1;
            return 0;
          }),
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
        setListLanguage(
          res?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          })
        );
        setSingleCvDTO((state) => ({
          ...state,
          cvLanguageList: res?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          }),
        }));
        setListCureent((state) => ({
          ...state,
          listLanguage: res?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          }),
        }));
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
          languageVersion: localStorage.getItem('language') || 'en',
        },
      });
      if (res) {
        setListCertificate(
          res?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          })
        );
        let convertCertificate = res
          ?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          })
          ?.map((item) => {
            return {
              uuid: '',
              cvId: '',
              resourceCertificateId: item.resourceCertificateId,
              certificateId: item.certificateId,
              certificateName: item.name,
              year: item.year,
            };
          });
        setSingleCvDTO((state) => ({
          ...state,
          cvCertificateList: convertCertificate,
        }));
        setListCureent((state) => ({
          ...state,
          listCertificate: res?.sort(function(a, b) {
            if (a.year < b.year) return 1;
            if (a.year > b.year) return -1;
            return 0;
          }),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hiddenTagProfileClient = (item, type) => {
    console.log('HIdden this object:', item);

    if (type === 'Employee') {
      const newList = listEmployee.filter((e) => e.resourceEmployerId !== item.resourceEmployerId);
      setlistEmployee(newList);
    } else if (type === 'Education') {
      const newList = listEducation.filter((e) => e.resourceEducationId !== item.resourceEducationId);
      setlistEducation(newList);
    } else if (type === 'Certificate') {
      const newList = listCertificate.filter((e) => e.resourceCertificateId !== item.resourceCertificateId);
      setListCertificate(newList);
    } else if (type === 'Language') {
      const newList = listLanguage.filter((e) => e.resourceLanguageId !== item.resourceLanguageId);
      setListLanguage(newList);
    }
  };

  const handleRequestUpdateManager = async (e, { value }) => {
    setDetail({ ...detail, userId: value });
  };

  const handleChangeCv = useCallback(
    async (_, { value }) => {
      const item = await api.get({
        resource: `${Endpoints.Resource}/resource/cv/getSingleCv`,
        query: { cvId: value },
      });

      if (item) {
        setSingleCvDTO(item);
        setCvId(value);
        setListCertificate(item.cvCertificateList.map((i) => ({ ...i, name: i.certificateName })));
        setlistEducation(item.cvEducationList.map((i) => ({ ...i, name: i.schoolName })));
        setlistEmployee(item.cvEmployerList.map((i) => ({ ...i, name: i.employerName })));
        setListLanguage(item.cvLanguageList);
        setCompetenceDTOList(item.cvCompetenceList);
        setDetail(item);
        setxperienceCv(item.cvExperienceList);
      }
    },
    [setxperienceCv]
  );

  const handleChangeItem = useCallback(
    (item) => {
      const newList = update(competenceDTOList, (darf) => {
        const findIndex = darf.findIndex((i) => i.resourceCompetenceId === item.resourceCompetenceId);
        if (findIndex !== -1) darf[findIndex].checked = !item.checked;
      });
      setCompetenceDTOList(newList);
    },
    [competenceDTOList]
  );

  const saveRequest = async () => {
    if (detail.name) {
      try {
        const data = {
          ...detail,
          resourceId,
          cvEmployerList: listEmployee.map((i) => ({ resourceEmployerId: i.resourceEmployerId })),
          cvEducationList: listEducation.map((i) => ({ resourceEducationId: i.resourceEducationId })),
          cvCertificateList: listCertificate.map((i) => ({ resourceCertificateId: i.resourceCertificateId })),
          cvLanguageList: listLanguage.map((i) => ({ resourceLanguageId: i.resourceLanguageId })),
          cvCompetenceList: competenceDTOList
            .filter((i) => !!i.checked)
            .map((i) => ({ resourceCompetenceId: i.resourceCompetenceId })),
          cvExperienceList: experienceList
            .filter((i) => !!i.checked)
            .map((i) => ({
              uuid: i.uuid,
              reference: !!i.reference,
            })),
          language: localStorage.getItem('language') || 'en',
        };

        const res = await api.put({
          resource: `${Endpoints.Resource}/resource/cv/${cvId ? 'updateCv' : 'addCv'}`,
          data,
        });

        // cvId ? updateItem(res) : addItem(res);

        setVisible(false);
        putSuccess(cvId ? `Updated` : 'Added', '', 2000);
        setDetail({
          referenceName: '',
          userId: auth.userId,
          referencePhone: '',
          referenceCompany: '',
          referenceEmail: '',
          header: '',
        });
        setCvId('');
        setCompetenceDTOList([]);
        setxperienceCv([]);
        setListCertificate(listCureent.listCertificate);
        setlistEducation(listCureent.listEducation);
        setlistEmployee(listCureent.listEmployee);
        setListLanguage(listCureent.listLanguage);
        fetchCvLiteDTOList();
      } catch (error) {}
    } else {
      setError(true);
    }
  };

  const addAndUpdateCv = useCallback(() => {
    setVisible(true);
  }, []);

  const handleCreateCV = () => {
    setVisibleCV(true);
  };

  return (
    <>
      <p className={css.label}>{_l`Sales contact`}</p>
      <Divider />
      <Grid className={css.fieldGroupMargin}>
        <GridRow className={css.row} columns={2}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`User`}</p>
            <div className={css.fieldHasValidate}>
              <UserDropdown
                value={detail?.userId}
                id="managerDropdownResource"
                placeholder="Select user"
                onChange={handleRequestUpdateManager}
              />
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Saved CVs`}</p>
            <div className={css.fieldHasValidate}>
              <Dropdown
                placeholder="Select cv"
                search
                fluid
                selection
                value={cvId}
                onChange={handleChangeCv}
                options={cvLiteDTOList.map((item) => ({
                  key: item.uuid,
                  text: item.name,
                  value: item.uuid,
                }))}
              />
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row} columns={2}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Title`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                name="title"
                className={css.inputForm}
                type="text"
                value={detail?.title}
                onChange={(e) => setDetail({ ...detail, title: e.target.value })}
              />
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label} style={{ opacity: '0' }}>{_l`Saved CVs`}</p>
            <div className={css.fieldHasValidate}>
              <Button onClick={addAndUpdateCv} className={css.commonButton}>{_l`Save CV`}</Button>
              <Button onClick={handleCreateCV} className={css.commonButton}>{_l`Create CV`}</Button>
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
                onChange={(e) => setDetail({ ...detail, description: e.target.value })}
                value={detail?.description}
                rows={4}
                className={css.description}
              />
            </Form>
          </GridColumn>
        </GridRow>
      </Grid>
      <p className={css.label}>{_l`Reference`}</p>
      <Divider />
      <Grid className={css.fieldGroupMargin}>
        <GridRow className={css.row} columns={2}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Name`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                value={detail?.referenceName}
                onChange={(_, { value }) => setDetail({ ...detail, referenceName: value })}
                className={css.inputForm}
                type="text"
                fluid
              />
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Phone`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                value={detail?.referencePhone}
                onChange={(_, { value }) => setDetail({ ...detail, referencePhone: value })}
                className={css.inputForm}
                type="text"
                name="phone"
                fluid
              />
            </div>
          </GridColumn>
        </GridRow>
        <GridRow className={css.row} columns={2}>
          <GridColumn className={css.fieldGroup}>
            <p className={css.label}>{_l`Company`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                value={detail?.referenceCompany}
                onChange={(_, { value }) => setDetail({ ...detail, referenceCompany: value })}
                className={css.inputForm}
                type="text"
                name="company"
                fluid
              />
            </div>
          </GridColumn>
          <GridColumn className={css.fieldGroup} style={{ paddingRight: 0 }}>
            <p className={css.label}>{_l`Email`}</p>
            <div className={css.fieldHasValidate}>
              <Input
                value={detail?.referenceEmail}
                onChange={(_, { value }) => setDetail({ ...detail, referenceEmail: value })}
                className={css.inputForm}
                type="email"
                name="email"
                fluid
              />
            </div>
          </GridColumn>
        </GridRow>
      </Grid>
      <TagProfile
        hiddenTagProfileClient={(item) => hiddenTagProfileClient(item, 'Employee')}
        resourceDetail={profileDetail}
        listTag={listEmployee}
        type="Employee"
        fallbackCallFetchListTag={null}
        hideActionAdd={true}
      />
      <TagProfile
        hiddenTagProfileClient={(item) => hiddenTagProfileClient(item, 'Education')}
        resourceDetail={profileDetail}
        listTag={listEducation}
        type="Education"
        fallbackCallFetchListTag={null}
        hideActionAdd={true}
      />
      <TagProfile
        hiddenTagProfileClient={(item) => hiddenTagProfileClient(item, 'Language')}
        resourceDetail={profileDetail}
        listTag={listLanguage}
        type="Language"
        fallbackCallFetchListTag={null}
        hideActionAdd={true}
      />
      <TagProfile
        hiddenTagProfileClient={(item) => hiddenTagProfileClient(item, 'Certificate')}
        resourceDetail={profileDetail}
        listTag={listCertificate}
        type="Certificate"
        fallbackCallFetchListTag={null}
        hideActionAdd={true}
      />
      <p className={css.label}>{_l`Highlighted competences`}</p>
      <Divider />
      <Grid className={css.competencesExper}>
        <GridRow>
          <GridColumn width="2" verticalAlign="middle">
            {_l`Header`}
          </GridColumn>
          <GridColumn width="6">
            <Input
              value={detail?.header}
              onChange={(_, { value }) => {
                setDetail({ ...detail, header: value });
                setSingleCvDTO((state) => ({
                  ...state,
                  header: value,
                }));
              }}
              fluid
              className={css.inputForm}
              type="text"
            />
          </GridColumn>
        </GridRow>
      </Grid>
      <div className={css.competencesExper}>
        <Grid>
          <GridRow>
            <GridColumn width={2} style={{ cursor: 'pointer' }} onClick={() => sortCompetenceList('level')}>
              {_l`Level`} {valueSortedCompetenceList === 'level' && <Icon name="angle down" />}
            </GridColumn>
            <GridColumn width={8} style={{ cursor: 'pointer' }} onClick={() => sortCompetenceList('competence')}>
              {_l`Competence`} {valueSortedCompetenceList === 'competence' && <Icon name="angle down" />}
            </GridColumn>
            <GridColumn width={5} style={{ cursor: 'pointer' }} onClick={() => sortCompetenceList('lastUsed')}>
              {_l`Last used`} {valueSortedCompetenceList === 'lastUsed' && <Icon name="angle down" />}
            </GridColumn>
            <GridColumn width={1} />
          </GridRow>
        </Grid>
        {competenceDTOList.map((item, index) => (
          <CompetenceExperiences onClick={handleChangeItem} checked={item.checked} item={item} key={index} />
        ))}
      </div>

      <ModalCommon
        title={_l`Save CV`}
        visible={visible}
        onDone={saveRequest}
        onClose={() => setVisible(false)}
        size="small"
        scrolling={false}
        okLabel={_l`Save`}
      >
        <Form className={styles._form}>
          <Form.Group>
            <div width={6} className={styles._label}>
              {' '}
              {_l`Name`}
              <span className={styles.requiredField}>*</span>
            </div>
            <div className={styles.inputWraper100}>
              <Form.Input
                required
                error={error}
                className={styles._input}
                value={detail?.name}
                onChange={(_, { value }) => {
                  setDetail({ ...detail, name: value });
                  setError(false);
                }}
                fluid
              />
              <span className="form-errors">{error && _l`Name is required`}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>
      <CreateCV
        enterpriseID={auth?.enterpriseID}
        header={detail?.header}
        userId={detail?.userId}
        visible={visibleCV}
        title={detail?.title}
        description={detail?.description}
        setVisibleCV={setVisibleCV}
        competenceDTOList={competenceDTOList}
        listEmployee={listEmployee}
        listEducation={listEducation}
        listCertificate={listCertificate}
        listLanguage={listLanguage}
        currentVersion={currentVersion}
        singleCvDTO={singleCvDTO}
        setSingleCvDTO={setSingleCvDTO}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  conpetencesName: state.entities.resources.competencesName,
  competences: state.entities.resources.competences,
  experienceList: state.entities?.resources?.cv?.experienceList || [],
  auth: state.auth,
  valueSortedCompetenceList: state.entities?.resources?.valueSortedCompetenceList,
  LANGUAGE_RESOURCE_DETAIL: state.entities?.resources?.LANGUAGE_RESOURCE_DETAIL,
});

const mapDispatchToProps = {
  setxperienceCv: ResourcesActionsTypes.setxperienceCv,
  sortCompetenceList: ResourcesActionsTypes.sortCompetenceList,
  putSuccess: NotificationActions.success,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCV);

import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import css from './ProfilePane.css';
import addIcon from '../../../../public/Add.svg';
import { Divider, Label, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import AddIndustryModal from '../ResourceModal/AddIndustryModal';
import AddEmployeeModal from '../ResourceModal/AddEmployeeModal';
import AddEducationModal from '../ResourceModal/AddEducationModal';
import AddLanguageModal from '../ResourceModal/AddLanguageModal';
import { AddCertificateModal } from '../ResourceModal/AddCertificateModal';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';

const TYPE = {
  INDUSTRY: 'Industry',
  EMPLOYEE: 'Employee',
  EDUCATION: 'Education',
  LANGUAGE: 'Language',
  CERTIFICATE: 'Certificate',
};
export const TagProfile = (props) => {
  const { type, listTag, resourceDetail, fallbackCallFetchListTag, hideActionAdd } = props;
  const [visibleAddIndustry, setVisibleAddIndustry] = useState(false);
  const [visibleAddEmployee, setVisibleAddEmployee] = useState(false);
  const [visibleAddEducation, setVisibleAddEducation] = useState(false);
  const [visibleAddLanguage, setVisibleAddLanguage] = useState(false);
  const [visibleAddCertificate, setVisibleAddCertificate] = useState(false);
  const [visibleDeleteTag, setvisibleDeleteTag] = useState(false);
  const [objectUpdate, setObjectUpdate] = useState(null);
  const [objectDelete, setObjectDelete] = useState(null);

  let title = '';
  let color = '';

  switch (type) {
    case TYPE.INDUSTRY:
      title = _l`Industries`;
      break;
    case TYPE.EMPLOYEE:
      title = _l`Employers`;
      break;
    case TYPE.EDUCATION:
      title = _l`Education`;
      break;
    case TYPE.LANGUAGE:
      title = _l`Languages`;
      break;
    case TYPE.CERTIFICATE:
      title = _l`Certificates & courses`;
      break;
    default:
      title = _l`Industries`;
      break;
  }

  const handleClickAdd = () => {
    setObjectUpdate(null);
    switch (type) {
      case TYPE.INDUSTRY:
        setVisibleAddIndustry(true);
        break;
      case TYPE.EMPLOYEE:
        setVisibleAddEmployee(true);
        break;
      case TYPE.EDUCATION:
        setVisibleAddEducation(true);
        break;
      case TYPE.LANGUAGE:
        setVisibleAddLanguage(true);
        break;
      case TYPE.CERTIFICATE:
        setVisibleAddCertificate(true);
        break;
      default:
        break;
    }
  };
  const onCloseIndustry = () => {
    setVisibleAddIndustry(false);
    setObjectUpdate(null);
  };
  const onCloseEmployee = () => {
    setVisibleAddEmployee(false);
    setObjectUpdate(null);
  };
  const onCloseEducation = () => {
    setVisibleAddEducation(false);
    setObjectUpdate(null);
  };
  const onCloseLanguage = () => {
    setVisibleAddLanguage(false);
    setObjectUpdate(null);
  };
  const onCloseCertificate = () => {
    setVisibleAddCertificate(false);
    setObjectUpdate(null);
  };

  const onDoneModalAdd = async (data, uuid) => {
    try {
      console.log('------>>', data);

      if (uuid) {
        // update

        let newArray = [];
        let url = '';
        let keySetName = '';
        let index = 0;
        switch (type) {
          case TYPE.INDUSTRY:
            index = listTag.findIndex((e) => e.resourceIndustryId === uuid);
            newArray = [
              ...listTag.slice(0, index),
              { ...listTag[index], ...data },
              ...listTag.slice(index + 1, listTag.length),
            ];
            url = 'resource/updateIndustry';
            keySetName = 'updateResourceIndustrySet';
            break;
          case TYPE.EMPLOYEE:
            index = listTag.findIndex((e) => e.resourceEmployerId === uuid);
            newArray = [
              ...listTag.slice(0, index),
              { ...listTag[index], ...data },
              ...listTag.slice(index + 1, listTag.length),
            ];
            url = 'resource/updateEmployer';
            keySetName = 'updateResourceEmployerSet';
            break;
          case TYPE.EDUCATION:
            index = listTag.findIndex((e) => e.resourceEducationId === uuid);
            newArray = [
              ...listTag.slice(0, index),
              { ...listTag[index], ...data },
              ...listTag.slice(index + 1, listTag.length),
            ];
            url = 'resource/updateEducation';
            keySetName = 'updateResourceEducationSet';
            break;
          case TYPE.LANGUAGE:
            index = listTag.findIndex((e) => e.resourceLanguageId === uuid);
            newArray = [
              ...listTag.slice(0, index),
              { ...listTag[index], ...data },
              ...listTag.slice(index + 1, listTag.length),
            ];
            url = 'resource/updateLanguage';
            keySetName = 'updateResourceLanguageSet';
            break;
          case TYPE.CERTIFICATE:
            index = listTag.findIndex((e) => e.resourceCertificateId === uuid);
            newArray = [
              ...listTag.slice(0, index),
              { ...listTag[index], ...data },
              ...listTag.slice(index + 1, listTag.length),
            ];
            url = 'resource/updateCertificate';
            keySetName = 'updateResourceCertificateSet';
            break;
        }

        console.log('Data update:', listTag, index, newArray);
        const res = await api.put({
          resource: `${Endpoints.Resource}/${url}`,
          data: {
            languageVersion: localStorage.getItem('language') || 'en',
            resourceId: props.resourceDetail?.uuid,
            [keySetName]: newArray,
          },
        });
        if (res) {
          closeAllModal();
          fallbackCallFetchListTag(type);
          index = 0;
          setObjectUpdate(null);
        }
      } else {
        // add
        console.log('Start add ');

        let url = '';
        let bodyArray = [...listTag, data];
        let keySetName = '';
        switch (type) {
          case TYPE.INDUSTRY:
            url = 'resource/updateIndustry';
            keySetName = 'updateResourceIndustrySet';
            break;
          case TYPE.EMPLOYEE:
            url = 'resource/updateEmployer';
            keySetName = 'updateResourceEmployerSet';
            break;
          case TYPE.EDUCATION:
            url = 'resource/updateEducation';
            keySetName = 'updateResourceEducationSet';
            break;
          case TYPE.LANGUAGE:
            url = 'resource/updateLanguage';
            keySetName = 'updateResourceLanguageSet';
            break;
          case TYPE.CERTIFICATE:
            url = 'resource/updateCertificate';
            keySetName = 'updateResourceCertificateSet';
            break;
        }
        const res = await api.put({
          resource: `${Endpoints.Resource}/${url}`,
          data: {
            languageVersion: localStorage.getItem('language') || 'en',
            resourceId: props.resourceDetail?.uuid,
            [keySetName]: bodyArray,
          },
        });
        if (res) {
          closeAllModal();
          fallbackCallFetchListTag(type);
        }
      }
    } catch (error) {
      closeAllModal();
      console.log(error);
    }
  };

  const closeAllModal = () => {
    setVisibleAddCertificate(false);
    setVisibleAddEducation(false);
    setVisibleAddEmployee(false);
    setVisibleAddIndustry(false);
    setVisibleAddLanguage(false);
  };

  const handleUpdateTag = (object) => {
    if (hideActionAdd) {
      return;
    }
    switch (type) {
      case TYPE.INDUSTRY:
        setVisibleAddIndustry(true);
        break;
      case TYPE.EMPLOYEE:
        setVisibleAddEmployee(true);
        break;
      case TYPE.EDUCATION:
        setVisibleAddEducation(true);
        break;
      case TYPE.LANGUAGE:
        setVisibleAddLanguage(true);
        break;
      case TYPE.CERTIFICATE:
        setVisibleAddCertificate(true);
        break;
    }
    setObjectUpdate(object);
  };

  // Remove a tag in list tag by ID

  const handleRemoveTag = (object, event) => {
    if (hideActionAdd) {
      props.hiddenTagProfileClient(object);
    } else {
      console.log('====>>Delete:', object);
      setObjectDelete(object);
      event.stopPropagation();
      setvisibleDeleteTag(true);
    }
  };
  const handleDoneRemoveTag = async () => {
    let newArray = [];
    let url = '';
    let keySetName = '';
    switch (type) {
      case TYPE.INDUSTRY:
        newArray = listTag.filter((e) => e.resourceIndustryId !== objectDelete?.resourceIndustryId);
        url = 'resource/updateIndustry';
        keySetName = 'updateResourceIndustrySet';
        break;
      case TYPE.EMPLOYEE:
        newArray = listTag.filter((e) => e.resourceEmployerId !== objectDelete?.resourceEmployerId);
        url = 'resource/updateEmployer';
        keySetName = 'updateResourceEmployerSet';
        break;
      case TYPE.EDUCATION:
        newArray = listTag.filter((e) => e.resourceEducationId !== objectDelete?.resourceEducationId);
        url = 'resource/updateEducation';
        keySetName = 'updateResourceEducationSet';
        break;
      case TYPE.LANGUAGE:
        newArray = listTag.filter((e) => e.resourceLanguageId !== objectDelete?.resourceLanguageId);
        url = 'resource/updateLanguage';
        keySetName = 'updateResourceLanguageSet';
        break;
      case TYPE.CERTIFICATE:
        newArray = listTag.filter((e) => e.resourceCertificateId !== objectDelete?.resourceCertificateId);
        url = 'resource/updateCertificate';
        keySetName = 'updateResourceCertificateSet';
        break;
    }
    try {
      const res = await api.put({
        resource: `${Endpoints.Resource}/${url}`,
        data: {
          languageVersion: localStorage.getItem('language') || 'en',
          resourceId: props.resourceDetail?.uuid,
          [keySetName]: newArray,
        },
      });
      if (res) {
        setvisibleDeleteTag(false);
        setObjectDelete(null);
        closeAllModal();
        fallbackCallFetchListTag(type);
      }
    } catch (error) {}
  };
  return (
    <>
      <div style={{ marginBottom: 5 }}>
        <div className={css.tagHeader}>
          <p className={css.label}>{title}</p>
          {hideActionAdd ? null : <img src={addIcon} className={css.addTagIcon} onClick={handleClickAdd} />}
        </div>
        <Divider style={{ marginTop: 0, marginBottom: 10 }} />
        {/* <div className={css.listTag}>
          {listTag?.map((e, index) => {
            return (
              <Label onClick={() => handleUpdateTag(e)} as="a" key={index} className={cx(css.tagItem)}>
                {e.name}
                <Icon name="delete" onClick={(event) => handleRemoveTag(e, event)} />
              </Label>
            );
          })}
        </div> */}
        <div className={css.detailTagLabelContainer}>
          {listTag?.map((e, index) => {
            return (
              <div key={index}>
                <Label onClick={() => handleUpdateTag(e)} className={css.detailTagLabel}>
                  {type === TYPE.EDUCATION ? (e.school ? `${e.name} - ${e.school}` : e.name) : e.name}
                  <Icon name="delete" onClick={(event) => handleRemoveTag(e, event)} />
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      <AddIndustryModal
        objectUpdate={objectUpdate}
        listTag={listTag}
        visible={visibleAddIndustry}
        onClose={onCloseIndustry}
        onDone={onDoneModalAdd}
      />
      <AddEmployeeModal
        objectUpdate={objectUpdate}
        listTag={listTag}
        visible={visibleAddEmployee}
        onClose={onCloseEmployee}
        onDone={onDoneModalAdd}
      />
      <AddEducationModal
        objectUpdate={objectUpdate}
        listTag={listTag}
        visible={visibleAddEducation}
        onClose={onCloseEducation}
        onDone={onDoneModalAdd}
      />
      <AddLanguageModal
        objectUpdate={objectUpdate}
        listTag={listTag}
        visible={visibleAddLanguage}
        onClose={onCloseLanguage}
        onDone={onDoneModalAdd}
      />
      <AddCertificateModal
        objectUpdate={objectUpdate}
        listTag={listTag}
        visible={visibleAddCertificate}
        onClose={onCloseCertificate}
        onDone={onDoneModalAdd}
      />
      <ModalCommon
        title={_l`Confirm`}
        size="tiny"
        visible={visibleDeleteTag}
        onClose={() => {
          setvisibleDeleteTag(false);
          setObjectDelete(null);
        }}
        onDone={handleDoneRemoveTag}
      >
        {type === TYPE.INDUSTRY ? (
          <p>{_l`This industry will be removed`}?</p>
        ) : type === TYPE.EMPLOYEE ? (
          <p>{_l`This employer will be removed`}?</p>
        ) : type === TYPE.EDUCATION ? (
          <p>{_l`This education will be removed`}?</p>
        ) : type === TYPE.LANGUAGE ? (
          <p>{_l`This language will be removed`}?</p>
        ) : (
          <p>{_l`This certificate / course will be removed`}?</p>
        )}
      </ModalCommon>
    </>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TagProfile);

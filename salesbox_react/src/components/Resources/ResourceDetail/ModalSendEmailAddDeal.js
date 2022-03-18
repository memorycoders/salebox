/* eslint-disable prefer-const */
/* eslint-disable indent */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/self-closing-comp */
import React, { memo, useEffect, useRef, useState } from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { Checkbox, Dropdown, Form, Icon, Modal, Popup } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import css from './ModalSendEmail.css';
import styles from './CV/Cv.css';
import { Endpoints } from '../../../Constants';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import api from 'lib/apiClient';
import generateUuid from 'uuid/v4';
import { getCurrentTimeZone } from '../../../lib/dateTimeService';
import { connect } from 'react-redux';
import PreviewPDF from './CV/PreviewPDF';
import { pdf } from '@react-pdf/renderer';
import createTranslator from 'oxygen-i18n/lib/createTranslator';
import moment from 'moment';
// import de from 'moment/locale/de';
// import sv from 'moment/locale/sv';
// import es from 'moment/locale/es';
// import en from 'moment/locale/en-ie';
const messages = require('../../../resources/messages.json');
import isValidEmail from 'lib/isEmail';
import * as NotificationActions from '../../Notification/notification.actions';
const i18n = createTranslator({}, (translator) => {
  try {
    translator.addMessages(messages);
  } catch (e) {}
});
const _lCV = i18n.translate;

const TAGS = {
  FNAME: 'Fname',
  LNAME: 'Lname',
  ANAME: 'Aname',
};

const modules = {
  toolbar: [
    ['bold', 'italic', 'link', 'image'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
  ],
};

const CheckboxType = {
  TrackMail: 'TrackMail',
  TrackLink: 'TrackLink',
};

const ModalSendEmailAddDeal = ({
  visible,
  setVisible,
  match,
  isModalSendCV,
  fileAttach,
  profileDetail,
  conpetencesName,
  userId,
  experienceList,
  company,
  users,
  contactIdAfterAddDeal,
  companyId,
  currentVersion,
  resource,
  spinnerInList,
  notiSuccess
}: any) => {
  const resourceId = match?.params?.resourceId;

  const reactQuillRef = useRef();
  const fileInput = useRef();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [heightToolbar, setHeightToolbar] = useState(0);
  const [tags, setTags] = useState([]);
  const [cvId, setCvId] = useState([]);
  const [trackOpenEmail, setTrackOpenEmail] = useState(false);
  const [trackClickLink, setTrackClickLink] = useState(false);
  const [contactId, setContactId] = useState('');

  const [cvLiteDTOList, setCvLiteDTOList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contactDTOList, setContactDTOList] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [isFetchFinish, setFetchFinish] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPage(0);
      setSearchField('');
      setContactId('');
      setContent('');
      setAttachments([]);
      setSubject('');
      setTrackClickLink(false);
      setTrackOpenEmail(false);
      setCvId('');
      setTags([]);
      // heightToolbar(0)
    }
  }, [visible]);

  useEffect(() => {
    setContactId(contactIdAfterAddDeal);
  }, [contactIdAfterAddDeal]);

  const fetchContact = async (pageIndex = 0, searchField = '') => {
    console.log(searchField);

    if (isFetchFinish) return [];
    setLoading(true);
    if (companyId) {
      try {
        const data = await api.get({
          resource: `${Endpoints.Contact}/syncByOrganisation`,
          query: {
            updatedDate: 0,
            pageIndex,
            pageSize: 10,
            searchField,
            organisationId: companyId,
          },
        });
        if (data.contactDTOList?.length < 10) {
          setFetchFinish(true);
        }
        return data.contactDTOList;
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setLoading(false);
        setFetchFinish(false);
      }
    } else {
      const timezone = new Date().getTimezoneOffset() / -60;
      try {
        const data = await api.post({
          resource: `contact-v3.0/ftsES`,
          query: {
            sessionKey: generateUuid(),
            timeZone: timezone,
            pageIndex,
            pageSize: 10,
            updatedDate: 0,
          },
          data: {
            customFilter: 'active',
            orderBy: 'orderIntake',
            roleFilterType: 'Company',
            roleFilterValue: '',
            searchText: searchField,
          },
        });
        if (data.contactDTOList?.length < 10) {
          setFetchFinish(true);
        }
        return data.contactDTOList;
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setLoading(false);
        setFetchFinish(false);
      }
    }
  };

  useEffect(() => {
    !!visible && fetchContact().then(setContactDTOList);
    if (fileAttach) {
      !!visible && setAttachments([...attachments, ...fileAttach]);
    }
  }, [visible]);

  useEffect(() => {
    let langVersion = 'se';
    switch (currentVersion) {
      case 'Sweden':
        langVersion = 'se';
        // moment.locale('sv', sv);
        break;
      case 'United Kingdom':
        langVersion = 'en-US';
        // moment.locale("en-ie", en);
        break;
      case 'Germany':
        langVersion = 'de';
        // moment.locale(langVersion, de);
        break;
      case 'Spain':
        langVersion = 'es';
        // moment.locale(langVersion, es);
        break;
      default:
        langVersion = 'se';
        // moment.locale('sv', sv);
        break;
    }
    i18n.setLocale(langVersion);
  }, [currentVersion]);

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
    } else if (spinnerInList && resource?.uuid) {
      try {
        const { cvLiteDTOList } = await api.get({
          resource: `${Endpoints.Resource}/resource/cv/getAll`,
          query: {
            resourceId: resource.uuid,
            language: localStorage.getItem('language') || 'en',
          },
        });

        setCvLiteDTOList(cvLiteDTOList);
      } catch (error) {}
    }
  };

  useEffect(() => {
    !!visible && !isModalSendCV && fetchCvLiteDTOList();
  }, [visible]);

  // useEffect(() => {
  //   fetchCvLiteDTOList();
  // }, []);

  const handleAddTag = (tag) => {
    const quill = reactQuillRef.current.getEditor();
    quill.focus();
    let range = quill.getSelection();
    let position = range ? range.index : 0;
    quill.insertText(position, tag);
    updateListTag(tag);
  };

  const updateListTag = (tag) => {
    let _fullTagTitle;
    switch (tag) {
      case TAGS.FNAME:
        _fullTagTitle = 'FIRST_NAME';
        break;
      case TAGS.LNAME:
        _fullTagTitle = 'LAST_NAME';
        break;
      case TAGS.ANAME:
        _fullTagTitle = 'ACCOUNT_NAME';
        break;
    }
    let _listTag = tags;
    let index = _listTag.indexOf(_fullTagTitle);
    if (index === -1) {
      _listTag.push(_fullTagTitle);
    }
    setTags(_listTag);
  };

  const handleAttachFile = () => {
    fileInput.current.click();
  };

  const handleChangeFile = (event) => {
    if (event.target.files) {
      setAttachments([...attachments, ...event.target.files]);
    }
  };

  const removeAttachFile = (index) => {
    const newAttachment = attachments.filter((item, i) => i != index);
    setAttachments(newAttachment);
  };

  const handleChangeCheckbox = (type, value) => {
    switch (type) {
      case CheckboxType.TrackMail:
        setTrackOpenEmail(value.checked);
        break;
      case CheckboxType.TrackLink:
        setTrackClickLink(value.checked);
        break;
    }
  };

  useEffect(() => {
    let intervalGetToolbar = null;

    if (heightToolbar === 0) {
      intervalGetToolbar = setInterval(() => {
        let _toolbar = document.getElementsByClassName('ql-toolbar');
        if (_toolbar) {
          clearInterval(intervalGetToolbar);
          let _style = getComputedStyle(_toolbar[0]);
          let _heightToolbar = parseFloat(_style.height.replace('px', ''));
          setHeightToolbar(_heightToolbar);
          let _container = document.getElementsByClassName('ql-container');
          _container[0].style.paddingTop = `${_heightToolbar}px`;
          _container = null;
          _toolbar = null;
        }
      });
    } else {
      intervalGetToolbar = setInterval(() => {
        let _container = document.getElementsByClassName('ql-container');
        if (_container) {
          clearInterval(intervalGetToolbar);
          if (_container[0]) {
            _container[0].style.paddingTop = `${heightToolbar}px`;
          }
          _container = null;
        }
      });
    }

    return () => {
      if (intervalGetToolbar) {
        clearInterval(intervalGetToolbar);
      }
    };
  }, [visible]);

  const onSearchChange = async (_, { searchQuery }) => {
    const res = await fetchContact(0, searchQuery);
    console.log('============res:', res);

    if (res) {
      setContactDTOList(res);
    }
    setPage(0);
    setSearchField(searchQuery);
  };

  const onChangeContact = async (_, { value }) => {
    setContactId(value);
  };

  const handleOnScroll = async () => {
    const menu = document.getElementById('modalSendEmailAddDeal-list').childNodes[3];
    if (menu.offsetHeight + menu.scrollTop >= menu.scrollHeight) {
      setPage(page + 1);
      const res = await fetchContact(page + 1, searchField);
      setContactDTOList((state) => [...state, ...res]);
    }
  };

  const handleDone = async () => {
    setFetchFinish(false);
    let filter = {
      contactIds: spinnerInList ? [] : [contactId],
    };
    if (spinnerInList) {
      filter = {
        isSelectedAll: false,
        filterDTO: {
          roleFilterType: null,
          roleFilterValue: null,
          orderBy: null,
          searchFieldList: [],
        },
        resourceIds: [],
        emailAddList: [searchField],
      };
    }
    let data = {
      subject: subject,
      attachments: attachments,
      tag: tags,
      trackOpenEmail: trackOpenEmail,
      trackClickLink: trackClickLink,
      filterDTO: JSON.stringify(filter),
      content: content,
    };
    let fd = new FormData();
    for (let key in data) {
      if (key === 'attachments' && data['attachments'].length > 0) {
        for (let i = 0; i < data['attachments'].length; i++) {
          fd.append('attachments', data['attachments'][i]);
        }
      } else {
        fd.append(key, data[key]);
      }
    }

    try {
      if (spinnerInList) {
        const rs = await api.post({
          resource: `${Endpoints.Resource}/sendMailInBatch`,
          query: {
            timeZone: getCurrentTimeZone(),
          },
          data: fd,
        });
        setVisible(false);
        if (rs) {
          notiSuccess('Success', null, 2000);
        }
      } else {
        const rs = await api.post({
          resource: `${Endpoints.Contact}/sendMailInBatch`,
          query: {
            timeZone: getCurrentTimeZone(),
          },
          data: fd,
        });
        setVisible(false);
      }
    } catch (ex) {}
    //send email
  };

  const imageUrl = (id) => {
    return `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${id.slice(-3)}/${id}`;
  };

  const LANG = {
    se: 'Sweden',
    en: 'United Kingdom',
    de: 'Germany',
    es: 'Spain',
  };

  const handleChangeCV = async (_, { value }) => {
    setCvId(value);
    const item = await api.get({
      resource: `${Endpoints.Resource}/resource/cv/getSingleCv`,
      query: { cvId: value },
    });

    if (item) {
      let listCertificate = item.cvCertificateList.map((i) => ({ ...i, name: i.certificateName }));
      let listEducation = item.cvEducationList.map((i) => ({ ...i, name: i.schoolName }));
      let listEmployee = item.cvEmployerList.map((i) => ({ ...i, name: i.employerName }));
      let listLanguage = item.cvLanguageList;
      const PdfContainer = (
        <PreviewPDF
          _l={_lCV}
          company={company}
          user={users[userId]}
          profileDetail={profileDetail}
          competenceCheck={null}
          experienceCheck={null}
          header={item.header}
          experienceList={experienceList}
          listEmployee={listEmployee}
          listEducation={listEducation}
          listLanguage={listLanguage}
          listCertificate={listCertificate}
          moment={moment}
        />
      );
      let asPdf = pdf([]);
      asPdf.updateContainer(PdfContainer);
      let blob = await asPdf.toBlob();
      let file = new File(
        [blob],
        `${profileDetail?.firstName} ${profileDetail?.lastName}, ${company?.name} - CV [${LANG[item.language]}].pdf`
      );
      setAttachments([file]);
    }
  };
  const handelClose = () => {
    setFetchFinish(false);
    setVisible(false);
  };

  const [errorEmailSendTo, setErrorEmaiSendTo] = useState(null);
  const handleOnBlurSendTo = () => {
    // if(!contactId && !searchField) {
    //   setErrorEmaiSendTo(_l`Email is required`);
    //   return ;
    // }
    // if(!isValidEmail.test(searchField)) {
    //   setErrorEmaiSendTo(_l`Email is invalid`);
    //   return ;
    // }
    if(!contactDTOList) setContactDTOList([]);
    let uuid = generateUuid();
    if (contactDTOList?.length === 0) {
      setContactDTOList([
        ...contactDTOList,
        {
          uuid: uuid,
          fullName: searchField,
          avatar: null,
        },
      ]);
    }

    setContactId(uuid);
  };
  return (
    <ModalCommon
      size="small"
      title={_l`Send email`}
      yesLabel={_l`Send`}
      noLabel={_l`Cancel`}
      className={'mass_personal_email'}
      yesEnabled={name !== ''}
      visible={visible}
      onClose={handelClose}
      onDone={handleDone}
    >
      <Modal.Content>
        <Form className={styles._form}>
          <Form.Group>
            <div width={6} className={styles._label}>
              {' '}
              {_l`Send to`}
              {/* <span className={styles.requiredField}>*</span> */}
            </div>
            <div className={styles.inputWraper100}>
              {/* <InviteesDropDown
              type="notAdd"
              className={'position-clear dropdown-multi-invitess'}
              multiple
              search
              description={false}
              addLabel={_l`Add email`}
              // value={invitees || []}
              // onChange={handleInviteesChange}
              // onAddItem={handleAddEmail}
              // extra={[]}
              // changeCloseOnDimmerClickParent={changeCloseOnDimmerClickParent}
              calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
              colId="InviteesFormAppointmnet"
            /> */}
              <Dropdown
                placeholder="Select contact"
                search
                fluid
                selection
                loading={loading}
                scrolling
                value={contactId}
                onChange={onChangeContact}
                onBlur={handleOnBlurSendTo}
                id="modalSendEmailAddDeal-list"
                onSearchChange={onSearchChange}
                onScroll={handleOnScroll}
                options={contactDTOList.map((item) => {
                  const { avatar, firstName, lastName, uuid } = item;
                  const image = avatar && {
                    avatar: true,
                    src: `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`,
                    style: {
                      width: '22px',
                    },
                  };
                  const noAvatar = !avatar && {
                    size: 'small',
                    content: `${firstName ? firstName.substring(0, 1).toUpperCase() : ''} ${
                      lastName ? lastName.substring(0, 1).toUpperCase() : ''
                    }`,
                    class: 'label-user',
                  };
                  return {
                    key: uuid,
                    value: uuid,
                    text: item.email
                      ? `${item.fullName ? item.fullName : `${item.firstName} ${item.lastName}`}  (${item.email})`
                      : item.fullName
                      ? `${item.fullName}`
                      : `${item.firstName} ${item.lastName}`,
                    image: avatar ? image : null,
                    label: !avatar ? noAvatar : null,
                  };
                })}
              />
              {/* <span className="form-errors">{errorEmailSendTo !== null && spinnerInList && errorEmailSendTo}</span> */}
            </div>
          </Form.Group>
          {isModalSendCV ? null : (
            <Form.Group>
              <div width={6} className={styles._label}>
                {' '}
                {_l`Saved CVs`}
                {/* <span className={styles.requiredField}>*</span> */}
              </div>
              <div className={styles.inputWraper100}>
                <Dropdown
                  placeholder="Select cv"
                  search
                  fluid
                  selection
                  value={cvId}
                  onChange={handleChangeCV}
                  options={cvLiteDTOList.map((item) => ({
                    key: item.uuid,
                    text: item.name,
                    value: item.uuid,
                  }))}
                />
                {/* <span className="form-errors">{error && _l`Name is required`}</span> */}
              </div>
            </Form.Group>
          )}

          <Form.Group>
            <div width={6} className={styles._label}>
              {' '}
              {_l`Subject`}
              {/* <span className={styles.requiredField}>*</span> */}
            </div>
            <div className={styles.inputWraper100}>
              <Form.Input
                required
                placeholder={_l`Subject`}
                fluid
                style={{ fontSize: 11 }}
                value={subject}
                onChange={(_, { value }) => setSubject(value)}
              />
              {/* <span className="form-errors">{error && _l`Name is required`}</span> */}
            </div>
          </Form.Group>
        </Form>

        <div style={{ position: 'relative', marginTop: '20px' }}>
          <div className={css.tags} style={{ height: heightToolbar }}>
            <div className="bg_contact_color" onClick={() => handleAddTag(TAGS.FNAME)}>{_l`First name`}</div>
            <div className="bg_contact_color" onClick={() => handleAddTag(TAGS.LNAME)}>{_l`Last name`}</div>
            <div className="bg_account_color" onClick={() => handleAddTag(TAGS.ANAME)}>{_l`Company name`}</div>
          </div>
          <ReactQuill
            className={css.mpe_area_content}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            ref={reactQuillRef}
          />
        </div>
        <div>
          <div className={css.attach}>
            <div className={css.labelAttach} onClick={handleAttachFile}>
              <Icon name="paperclip" />
              <span>{_l`Attach document`}</span>
              <input ref={fileInput} type="file" hidden multiple onChange={handleChangeFile} />
            </div>
            <div className={css.listFileAttach}>
              {attachments.map((file, index) => (
                <div key={`${index}`}>
                  <Popup style={{ fontSize: '11' }} content={file.name} trigger={<span>{file.name}</span>} />
                  <span style={{ paddingLeft: 5 }} onClick={() => removeAttachFile(index)}>
                    <Icon name="close" />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Checkbox
              className={css._checkbox}
              checked={trackOpenEmail}
              label={_l`Track open email`}
              onChange={(e, value) => handleChangeCheckbox(CheckboxType.TrackMail, value)}
            />
          </div>
          <div>
            <Checkbox
              className={css._checkbox}
              checked={trackClickLink}
              label={_l`Track click on link`}
              onChange={(e, value) => handleChangeCheckbox(CheckboxType.TrackLink, value)}
            />
          </div>
        </div>
      </Modal.Content>
    </ModalCommon>
  );
};
const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  conpetencesName: state.entities.resources.competencesName,
  competences: state.entities.resources.competences,
  experienceList: state.entities?.resources?.cv?.experienceList || [],
  company: state.auth?.company,
  users: state.entities?.user,
  userId: state.auth?.userId,
});
export default compose(connect(mapStateToProps, { notiSuccess: NotificationActions.success }), memo, withRouter)(ModalSendEmailAddDeal);

import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import _l from 'lib/i18n';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import { Dropdown, Form } from 'semantic-ui-react';
import styles from './CV/Cv.css';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';
import generateUuid from 'uuid/v4';

const ModalShareProfile = ({
  visible,
  setVisible,
  match,
  putSuccess,
  currentVesion,
  notiError,
  spinnerInList,
  resource
}: any) => {
  const [userLiteDTOList, setUserLiteDTOList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSent, setDateSent] = useState({ sharedUserId: '', email: '' });
  const resourceId = match?.params?.resourceId;
  const [error, setError] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [errorEmailInvalid, seterrorEmailInvalid] = useState(false);
  const [showWarning, setShowWaring] = useState(false);
  const [messageWarning, setMessageWaring] = useState('');
  useEffect(() => {
    if (!visible) {
      setPage(0);
      setDateSent({ sharedUserId: '', email: '' });
      setSearchField('');
      setUserLiteDTOList([]);
      setError(false);
      setShowWaring(false);
    }
  }, [visible]);

  const fetchUser = useCallback(async (pageIndex = 0, searchField = '') => {
    setLoading(true);
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/user/getAllUserActive`,
        query: {
          searchField,
          pageIndex,
          pageSize: 20,
        },
      });

      return res.userLiteDTOList;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDefault = useCallback(async () => {
    const res = await fetchUser(0);
    setUserLiteDTOList(res);
  }, [fetchUser]);

  useEffect(() => {
    !!visible && fetchDefault();
  }, [fetchDefault, visible]);

  const handleOnScroll = useCallback(async () => {
    const menu = document.getElementById('modalShareProfile-list').childNodes[3];

    if (menu.offsetHeight + menu.scrollTop >= menu.scrollHeight) {
      setPage(page + 1);
      const res = await fetchUser(page + 1, searchField);
      setUserLiteDTOList((state) => [...state, ...res]);
    }
  }, [fetchUser, page, searchField]);

  const onSearchChange = useCallback(
    async (_, { searchQuery }) => {
      setPage(0);
      setSearchField(searchQuery);
      const res = await fetchUser(0, searchQuery);
      setUserLiteDTOList(res);
    },
    [fetchUser]
  );

  const onChange = useCallback(
    async (_, { value }) => {
      const findItem = userLiteDTOList.find((i) => i.uuid === value);
      if (findItem) {
        setDateSent({ sharedUserId: findItem.uuid, email: findItem.email });
      }
    },
    [userLiteDTOList]
  );

  const onDone = useCallback(async () => {
    try {
      let lang = 'se';
      if (currentVesion === 'Germany') {
        lang = 'de';
      } else if (currentVesion === 'United Kingdom') {
        lang = 'en';
      } else if (currentVesion === 'Spain') {
        lang = 'es';
      }
      if (dataSent.email) {
        setError(false);
        const res = await api.post({
          resource: `${Endpoints.Resource}/resource/shareProfile`,
          data: {
            email: dataSent.email,
            sharedUserId: dataSent.isExternal ? null : dataSent.sharedUserId,
            resourceId: spinnerInList ? resource?.uuid : resourceId,
            language: lang,
          },
        });

        if (res) {
          putSuccess('Updated', '', 2000);
        }
        setVisible(false);
      } else {
        setError(true);
      }
    } catch (error) {
      if (error.message === 'PROFILE_HAS_BEEN_SHARED_TO_USER') {
        setShowWaring(true);
        setMessageWaring(_l`Profile have been shared to user`);
      }
      if (error.message === 'CANNOT_SHARE_PROFILE_TO_USER_SAME_ENTERPRISE') {
        setShowWaring(true);
        setMessageWaring(_l`You cannot share profile to user in same enterprise`);
      }
    }
  }, [spinnerInList, resource, resourceId, dataSent, putSuccess, currentVesion]);

  const handleOnBlur = (e) => {
    console.log(searchField);
    if (userLiteDTOList?.length === 0) {
      let newUuid = generateUuid();
      setUserLiteDTOList([
        ...userLiteDTOList,
        {
          uuid: newUuid,
          email: searchField,
        },
      ]);
      setDateSent({ sharedUserId: newUuid, email: searchField, isExternal: true });
    }
  };
  return (
    <Fragment>
      <ModalCommon
        title={_l`Share profile`}
        visible={visible}
        onDone={onDone}
        onClose={() => setVisible(false)}
        size="small"
        scrolling={false}
        description={false}
        okLabel={_l`Share`}
      >
        <Form className={styles._form}>
          <Form.Group>
            <div width={6} className={styles._label}>
              {' '}
              {_l`Email`}
              <span className={styles.requiredField}>*</span>
            </div>
            <div className={styles.inputWraper100}>
              <Dropdown
                styles={{ maxHeight: 170 }}
                placeholder="Select email"
                error={error}
                id="modalShareProfile-list"
                search
                loading={loading}
                fluid
                selection
                onChange={onChange}
                onSearchChange={onSearchChange}
                value={dataSent?.sharedUserId}
                options={userLiteDTOList.map((item) => ({
                  key: item.uuid,
                  text: item.email,
                  value: item.uuid,
                }))}
                scrolling
                onScroll={handleOnScroll}
                onBlur={handleOnBlur}
              />
              <span className="form-errors">{error && _l`Email is required`}</span>
              <span className="form-errors">{errorEmailInvalid && _l`Email is required`}</span>
            </div>
          </Form.Group>
        </Form>
      </ModalCommon>

      <ModalCommon
        title={_l`Error`}
        visible={showWarning}
        onDone={() => setShowWaring(false)}
        onClose={() => setShowWaring(false)}
        size="mini"
        cancelHidden
        okLabel={_l`OK`}
      >
        <p>{messageWarning}</p>
      </ModalCommon>
    </Fragment>
  );
};

export default compose(
  memo,
  withRouter,
  connect(null, { putSuccess: NotificationActions.success, notiError: NotificationActions.error })
)(ModalShareProfile);

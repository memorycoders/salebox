/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import api from '../../../lib/apiClient';
import { Loader, Segment } from 'semantic-ui-react';
import AppConfig from '../../../../config/app.config';
import Axios from 'axios';
import * as NotificationActions from '../../../components/Notification/notification.actions';
import { connect } from 'react-redux';
import { requestLogout } from '../../../components/Auth/auth.actions';

const RedireactControl = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    setMessage('');
    switch (queryObj.state) {
      case 'google':
        setService('google');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
            },
            'enterprise-v3.0/storage/authGoogle'
          );
        }
        break;
      case 'googleDriver':
        setService('Google Driver');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
              googleDriver: true,
            },
            'enterprise-v3.0/storage/authGoogle'
          );
        }
        break;
      case 'office365':
        setService('Office 365');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
            },
            'enterprise-v3.0/storage/authOffice365'
          );
        }
        break;
      case 'msTeams':
        setService('Microsoft Teams');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
              type: 'ADMIN',
            },
            'enterprise-v3.0/storage/authMSTeam'
          );
        }
        break;
      case 'msTeamsMember':
        setService('Microsoft Teams');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
              type: 'MEMBER',
            },
            'enterprise-v3.0/storage/authMSTeam'
          );
        }
        break;
      case 'mailChimp':
        setService('Mailchimp');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
            },
            'enterprise-v3.0/storage/authenMailChimp'
          );
        }
        break;
      case 'onedriveForBusiness':
        setService('Onedrive for business');
        if (queryObj.code) {
          auth(
            {
              code: queryObj.code,
            },
            'enterprise-v3.0/storage/authOneDriveForBusiness'
          );
        }
        break;
      case 'dropbox':
        setService('Dropbox');
        authDropbox(queryObj.access_token);
        break;
      case 'authFortnox':
        // props.requestLogout(true);
        callApiAutoLoginFortNox(queryObj.sessionId);
        break;
    }
  }, []);

  const selfClose = () => {
    setTimeout(() => {
      window.self.close();
    }, 2000);
  };
  const auth = async (query, url) => {
    try {
      const rs = await api.get({
        resource: url,
        query: {
          ...query,
          redirect: AppConfig.redirect_uri,
        },
      });
      if (rs) {
        setLoading(false);
        setStatus('successfully');
        selfClose();
      }
    } catch (error) {
      setStatus('failed');
      setLoading(false);
      // selfClose();
      props.notiError('This Google account has already connected to another Salesbox account', '', null);
    }
  };

  const authDropbox = async (token) => {
    try {
      const rs = await Axios({
        method: 'post',
        url: 'https://api.dropbox.com/2/users/get_current_account',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (rs.status === 200 && rs.data) {
        try {
          let dto = {
            type: 'DROP_BOX',
            userIdentifier: rs.data.account_id,
            name: rs.data.name.display_name,
            email: rs.data.email,
            accessToken: token,
          };
          const rp = await api.post({
            resource: 'enterprise-v3.0/storage/addPersonalStorageAccount',
            data: dto,
          });
          if (rp) {
            let _dto = {
              displayName: rs.data.name.display_name,
              value: rs.data.account_id,
              type: 'DROP_BOX',
              accessToken: token,
              salesBoxFolderId: '',
              salesBoxFolderUrl: '',
            };
            try {
              await api.post({
                resource: 'enterprise-v3.0/storage/add',
                data: _dto,
              });
              setLoading(false);
              setStatus('successfully');
              try {
                await api.get({
                  resource: `enterprise-v3.0/storage/getSalesboxFolder`,
                });
              } catch (ex) {}
              selfClose();
            } catch (ex) {
              setMessage('This Dropbox account has already connect to another salesbox account');
              setStatus('failed');
              setLoading(false);
            }
          }
        } catch (ex) {
          setMessage('This Dropbox account has already connect to another salesbox account');
          setStatus('failed');
          setLoading(false);
        }
      }
    } catch (ex) {
      setStatus('failed');
      setLoading(false);
    }
  };

  return (
    <Segment style={{ height: '100vh' }}>
      {isLoading ? (
        <Loader active={isLoading} size="medium">
          Loading
        </Loader>
      ) : (
        <>
          <p style={{ fontSize: '13px' }}>
            <span>Connecting</span> <strong>{service}</strong> <span>{status}</span>
          </p>
          <p style={{ fontSize: '13px' }}>{message}</p>
        </>
      )}
    </Segment>
  );
};
export default connect(null, {
  notiError: NotificationActions.error,
  requestLogout: requestLogout,
})(RedireactControl);

/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import api from '../../../lib/apiClient';
import { Loader, Segment } from 'semantic-ui-react';
import AppConfig from '../../../../config/app.config';
import * as NotificationActions from '../../../components/Notification/notification.actions';
import { connect } from 'react-redux';

const GoogleRedirect = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    const { search } = window.location;
    const params = (search || '').match(/[^&?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    switch (queryObj.state) {
      case 'google':
        if (queryObj.code) {
          authGoogle(queryObj.code);
        }
        setService('google');
        break;
    }
  }, []);

  const selfClose = () => {
    setTimeout(() => {
      window.self.close();
    }, 2000);
  };
  const authGoogle = async (code) => {
    try {
      const rs = await api.get({
        resource: `enterprise-v3.0/storage/authGoogle`,
        query: {
          code,
          redirect: AppConfig.redirect_uri,
        },
      });
      if (rs) {
        setLoading(false);
        setStatus('successfully');
        selfClose();
      }
    } catch (error) {
      console.log('authGoogle -> error', error);
      setStatus('failed');
      setLoading(false);
      // selfClose();
      props.notiError('This Google account has already connected to another Salesbox account', '', null);
      // props.history.replace('/my-integrations');
      // window.self.close();
    }
  };

  return (
    <Segment style={{ height: '100vh' }}>
      {isLoading ? (
        <Loader active={isLoading} size="medium">
          Loading
        </Loader>
      ) : (
        <p>
          <span>Connecting</span> <strong>{service}</strong> <span>{status}</span>
        </p>
      )}
    </Segment>
  );
};
export default connect(null, {
  notiError: NotificationActions.error,
})(GoogleRedirect);

/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import api from '../../../lib/apiClient';
import { Loader } from 'semantic-ui-react';
import AppConfig from '../../../../config/app.config';

const OfficeRedirect = (props) => {
  useEffect(() => {
    const { search } = window.location;
    const params = (search || '').match(/[^&?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });

    if (queryObj.code) {
      authGoogle(queryObj.code);
    }
  }, []);

  const authGoogle = async (code) => {
    try {
      const rs = await api.get({
        resource: `enterprise-v3.0/storage/authOffice365`,
        query: {
          code,
          redirect: AppConfig.redirect_uri_office365,
        },
      });
      if (rs) {
        // props.history.replace('/my-integrations');
        window.self.close();
      }
    } catch (error) {
      // props.history.replace('/my-integrations');
      window.self.close();
    }
  };

  return <Loader active inline="centered" />;
};
export default OfficeRedirect;

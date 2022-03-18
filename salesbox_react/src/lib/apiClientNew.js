// @flow
import axios from 'axios';
import { normalize } from 'normalizr';
import qs from 'qs';
import { type StoreT } from 'store';
import config from '../../config';
import { requestLogout } from '../components/Auth/auth.actions';
import { KEY_ERROR } from '../Constants';
const { host, protocol, route } = config.clientConfig.api;
const { auth } = config.clientConfig;
const ipInfoEP = 'https://ipinfo.io/';
const redirectFortnox = 'fortNox/autoLogin';
const apiGeSessionIdFortnox = 'fortNox/redirect';

export const API_URL = route
  ? `${protocol}://production-addonservices.salesbox.com/${route}`
  : `${protocol}://production-addonservices.salesbox.com`;
const AUTH_URL = `${auth.protocol}://${auth.host}${auth.route}`;
const UPLOAD_URL = `${protocol}://${host}`;
type QueryT = {
  token?: string,
  enterpriseID?: string,
};
type RequestT = {
  schema?: {},
  data?: {},
  query?: QueryT,
  resource: string,
};
type MethodT = 'get' | 'put' | 'post' | 'delete';
type DataT = {
  error?: string,
};
type ResponseT = {
  data: DataT,
};
type EndPointT = (resource: string, data: {}, options?: {}) => ResponseT;
type APIT = {
  get: EndPointT,
  post: EndPointT,
  put: EndPointT,
  delete: EndPointT,
};
type ClientMethodT = (RequestT) => DataT;

class NEWAPI {
  store: StoreT;
  axios: APIT;
  auth: APIT;
  uploadEndpoint: APIT;
  sign: EndPointT;
  get: ClientMethodT;
  post: ClientMethodT;
  put: ClientMethodT;
  delete: ClientMethodT;

  constructor() {
    this.axios = axios.create({ baseURL: API_URL });
    this.uploadEndpoint = axios.create({ baseURL: UPLOAD_URL });
    this.auth = axios.create({ baseURL: AUTH_URL });

    this.post = this.createMethod('post', this.axios);
    this.get = this.createMethod('get', this.axios);
    this.delete = this.createMethod('delete', this.axios);
    this.put = this.createMethod('put', this.axios);
  }

  setStore(store: StoreT) {
    this.store = store;
  }

  // For After Login Request
  createMethod(method: MethodT, api: APIT) {
    return async ({ resource, data = {}, query = {}, schema, options = {} }: RequestT) => {
      try {
        const optionsWrap = {
          // headers: {},
          ...options,
        };
        const queryParams = {
          ...query,
        };
        const auth = this.store.getState().auth;

        if (
          resource === ipInfoEP ||
          resource?.includes(redirectFortnox) ||
          resource?.includes(apiGeSessionIdFortnox) ||
          resource?.includes('startSyncFortNox')
        ) {
          // If endpoint doesn't need authen token -> come here
          if (auth.token) {
            queryParams.token = auth.token;
            queryParams.enterpriseID = auth.enterpriseID;
          }
          const queryString = qs.stringify(queryParams);

          const response = await api[method](`${resource}?${queryString}`, data, optionsWrap);

          const result = response.data;

          if (result.error) {
            console.log('------vao day 1');
            throw new Error(result.error);
          }
          if (schema) {
            return normalize(result, schema);
          }

          return result;
        } else if (auth.token) {
          queryParams.token = auth.token;
          queryParams.enterpriseID = auth.enterpriseID;

          const queryString = qs.stringify(queryParams);

          const response = await api[method](`${resource}?${queryString}`, data, optionsWrap);

          const result = response.data;

          if (result.error) {
            console.log('------vao day 2');

            throw new Error(result.error);
          }
          if (schema) {
            return normalize(result, schema);
          }

          return result;
        }
      } catch (error) {
        // if(error.response && error.response.data && error.response.data.errorMessage === 'TOKEN_EXPIRED_OR_DOESNT_EXIST') {
        //   this.store.dispatch(requestLogout(true));
        // }
        if (error.response && error.response.data && KEY_ERROR[error.response.data.errorMessage]) {
          // TODO: Translate NEWAPI Errors
          throw new Error(error.response.data.errorMessage);
        }
        // throw error;
      }
    };
  }

  forgotNewPass = async (data: {}, query: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(
        `enterprise-v3.0/user/requestForgotPasswordNew?${queryString}`,
        data,
        query
      );
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  existedEmail = async (query: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.get(`enterprise-v3.0/user/checkExisting?${queryString}`, query);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  register = async (data: {}, query: {}, schema: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(`enterprise-v3.0/company/requestSetupNew?${queryString}`, data, query);

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (schema) {
        return normalize(response.data, schema);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  login = async (data: {}, query: {}, schema: {}) => {
    try {
      const queryString = qs.stringify(query);
      const response = await this.axios.post(`enterprise-v3.0/user/login?${queryString}`, data, query);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      if (schema) {
        return normalize(response.data, schema);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  logout = async () => {
    try {
      const response = await this.axios.post('enterprise-v3.0/user/logout');
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.errorMessage);
      }
      throw error;
    }
  };

  download = (props) => {
    const auth = this.store.getState().auth;

    const { startDate, endDate, periodType, userId, reportType, isUnit } = props;
    return fetch(
      `${API_URL}/report-v3.0/export/singleReport/excel/${reportType}?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}&token=${
        auth.token
      }&enterpriseID=${auth.enterpriseID}&react=true${
        isUnit ? `&unitId=${userId}` : userId ? `&userId=${userId}` : ''
      }`,
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/xls',
        },
      }
    ).then((response) => {
      return response.blob();
    });
  };
}

const newApi = new NEWAPI();

export default newApi;

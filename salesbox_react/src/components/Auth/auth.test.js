//@flow
import reducer, { initialState } from './auth.reducer';
import { requestStatus, requestLogin } from './auth.saga';
import { put, call } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import api from 'lib/apiClient';
import authSchema from './auth.schema';
import md5 from 'browser-md5';
import AuthActions from './auth.actions';

const userEndPoint = 'enterprise-v3.0/user';

const loginPayload = {
  entities: {
    user: {
      TEST_USER: {
        uuid: 'TEST_USER',
        token: 'USER_TOKEN',
      },
    },
    auth: {
      userDTO: 'TEST_USER',
    },
  },
  result: 'TEST_USER',
};

describe('auth.reducer', () => {
  it('logs in properly', () => {
    expect(reducer(initialState, { type: AuthActions.LOGIN, ...loginPayload })).toEqual({
      userId: 'TEST_USER',
      token: 'USER_TOKEN',
    });
  });

  it('receives correct status', () => {
    expect(reducer(initialState, { type: AuthActions.STATUS, token: 'STATUS_TOKEN' })).toEqual({
      userId: null,
      token: 'STATUS_TOKEN',
    });
  });

  it('logs out properly', () => {
    expect(reducer(initialState, { type: AuthActions.LOGOUT })).toEqual({
      userId: undefined,
      token: undefined,
    });
  });
});

describe('auth.saga/requestStatus', () => {
  const token = 'SOME_TOKEN';
  const enterpriseID = 'SOME_EID';

  beforeEach(() => {
    process.browser = true;
    localStorage.setItem('token', token);
    localStorage.setItem('enterpriseID', enterpriseID);
  });

  const gen = requestStatus();
  it('should handle token and enterpriseID correctly', () => {
    const val = gen.next().value;
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(localStorage.getItem).toHaveBeenCalledWith('enterpriseID');
    expect(localStorage.__STORE__.enterpriseID).toBe(enterpriseID);
    expect(localStorage.__STORE__.token).toBe(token);
    expect(val).toEqual(put({ type: AuthActions.STATUS, enterpriseID, token }));
  });
});

describe('auth.saga/requestLogin', () => {
  const username = 'username';
  const password = 'test';
  const MOCK_REQUEST = {
    data: {
      username,
      hashPassword: md5(password),
      webPlatform: false,
      deviceToken: 'WEB_TOKEN',
      version: '3.0',
    },
    resource: `${userEndPoint}/login`,
    schema: authSchema,
  };
  const MOCK_SUCCESS_RESPONSE = {
    entities: {
      user: {
        USER_ID: {
          token: 'TOKEN',
        },
      },
    },
    result: 'USER_ID',
  };

  const MOCK_FAIL_RESPONSE = {
    errMessage: 'LOGIN_FAILED',
  };

  const resolve = () => {};
  const reject = () => {};
  const iterator = requestLogin({ username, password, resolve, reject });
  it('should login properly', () => {
    const sucessAction = put({ type: AuthActions.LOGIN, ...MOCK_SUCCESS_RESPONSE });
    expect(iterator.next().value).toEqual(call(api.post, MOCK_REQUEST));
    expect(iterator.next(MOCK_SUCCESS_RESPONSE).value).toEqual(sucessAction);
    expect(iterator.next().value).toEqual(call(resolve, MOCK_SUCCESS_RESPONSE));
  });

  const failSaga = requestLogin({ username, password, resolve, reject });
  it('should error out', () => {
    const loginFailAction = { type: AuthActions.LOGIN_FAIL, message: 'LOGIN_FAILED' };
    expect(failSaga.next().value).toEqual(call(api.post, MOCK_REQUEST));
    expect(failSaga.next(MOCK_FAIL_RESPONSE).value).toEqual(put(loginFailAction));
    expect(failSaga.next().value).toEqual(call(reject, new SubmissionError({ _error: 'LOGIN_FAILED' })));
  });
});

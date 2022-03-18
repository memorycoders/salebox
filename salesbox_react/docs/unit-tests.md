# Getting going with unit tests

To accomplish unit testing, we use different packages, but the most important two are Jest and Enzyme.

To get it going, you can simply do this:

  1. `npm run test`
  2. ...
  3. profit?

Once you have started the watching process, all the tests you have written will be automatically run and rerun as you are writing your code. There are a couple ways to mark a file as a test:

  1. Place it in a directory named `__tests__` somewhere in the `src` directory and give your file one of these extensions: `.js`, `.jsx` or `.mjs`
  2. Give it one of these extensions: `.spec.js`, `.spec.jsx`, `.spec.mjs`, `.test.js`, `.test.jsx` or `.test.mjs`.

## Jest

Jest is a zero configuration testing platform by facebook and plays well with React. Some helpful links are

  - [https://facebook.github.io/jest/](Jest)
  - [https://facebook.github.io/jest/docs/en/getting-started.html](Documentation)
  - [https://facebook.github.io/jest/docs/en/api.html](API)

## Enzyme

[Enzyme](https://github.com/airbnb/enzyme) is a JavaScript Testing utility for React by Airbnb that makes it easier to assert, manipulate, and traverse your React Components' output.

Enzyme's API is meant to be intuitive and flexible by mimicking jQuery's API for DOM manipulation and traversal. Some useful links are:

  - [http://airbnb.io/enzyme/](Documentation)

# Example test

```javascript
//@flow
import reducer, { initialState } from './auth.reducer';
import ActionTypes from './auth.actions';

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
    expect(reducer(initialState, { type: ActionTypes.LOGIN, ...loginPayload })).toEqual({
      userId: 'TEST_USER',
      token: 'USER_TOKEN',
    });
  });

  it('receives correct status', () => {
    expect(reducer(initialState, { type: ActionTypes.STATUS, token: 'STATUS_TOKEN' })).toEqual({
      userId: null,
      token: 'STATUS_TOKEN',
    });
  });

  it('logs out properly', () => {
    expect(reducer(initialState, { type: ActionTypes.LOGOUT })).toEqual({
      userId: undefined,
      token: undefined,
    });
  });
});
```

// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

const AccountList = makeAsyncComponent(() => import('./AccountList'));
const AccountDetail = makeAsyncComponent(() => import('./AccountDetail'));

export { AccountDetail, AccountList };

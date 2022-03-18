// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

const Activities = makeAsyncComponent(() => import('./Activities'));
const Sales = makeAsyncComponent(() => import('./Sales'));
const TopLists = makeAsyncComponent(() => import('./TopLists'));
const Dashboard = makeAsyncComponent(() => import('./Dashboard'));
const Downloads = makeAsyncComponent(() => import('./Downloads'));

export { Activities, Sales, TopLists, Dashboard, Downloads };

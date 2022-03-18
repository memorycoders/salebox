// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

const Leads = makeAsyncComponent(() => import('./Leads'));
const Tasks = makeAsyncComponent(() => import('./Tasks'));

export { Tasks, Leads };

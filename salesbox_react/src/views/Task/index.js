// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

export const TaskDetail = makeAsyncComponent(() => import('./TaskDetail'));

export default TaskDetail;

import makeAsyncComponent from 'lib/makeAsyncComponent';

const Lessons = makeAsyncComponent(() => import('./Lessons'));
const LeaderBoard = makeAsyncComponent(() => import('./LeaderBoard'));

export { Lessons, LeaderBoard };

import makeAsyncComponent from 'lib/makeAsyncComponent';

const Subscriptions = makeAsyncComponent(() => import('./subscriptions'));
const Services = makeAsyncComponent(() => import('./services'));
const SalesAcademy = makeAsyncComponent(() => import('./salesAcademy'));
export { Subscriptions, Services, SalesAcademy };

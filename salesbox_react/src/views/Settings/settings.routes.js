import makeAsyncComponent from 'lib/makeAsyncComponent';

const CompanyInfo = makeAsyncComponent(() => import('./CompanyInfo'));
const CustomFields = makeAsyncComponent(() => import('./CustomFields'));
const DefaultValues = makeAsyncComponent(() => import('./DefaultValues'));
const Organisation = makeAsyncComponent(() => import('./Organisation'));
const Targets = makeAsyncComponent(() => import('./Targets'));
const Rights = makeAsyncComponent(() => import('./Rights'));
const Product = makeAsyncComponent(() => import('./Product'));
const ImportExport = makeAsyncComponent(() => import('./ImportExport'));

export { CompanyInfo, CustomFields, DefaultValues, Organisation, Targets, Rights, Product, ImportExport };

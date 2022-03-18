// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

const Activities = makeAsyncComponent(() => import('../Activities/Activities'));
const Accounts = makeAsyncComponent(() => import('../Accounts/Accounts'));
const Contacts = makeAsyncComponent(() => import('../Contacts/Contacts'));
const Pipeline = makeAsyncComponent(() => import('../Pipeline/Pipeline'));
const Delegation = makeAsyncComponent(() => import('../Delegation/Delegation'));
const CallLists = makeAsyncComponent(() => import('../CallLists/CallLists'));
const Campaigns = makeAsyncComponent(() => import('../Campaigns/Campaigns'));
const Insights = makeAsyncComponent(() => import('../Insights/Insights'));
const SignInView = makeAsyncComponent(() => import('../SignIn/SignIn'));
const SettingsView = makeAsyncComponent(() => import('../Settings/Settings'));
const MySettingsView = makeAsyncComponent(() => import('../MySettings/MySettings'));
const ProfileView = makeAsyncComponent(() => import('../Profile/Profile'));
const BillingInfoView = makeAsyncComponent(() => import('../BillingInfo/BillingInfo'));
const TermsOfUseView = makeAsyncComponent(() => import('../TermsOfUse/TermsOfUse'));
const MyIntegrations = makeAsyncComponent(() => import('../MyIntegrations'));
// const GoogleRedirect = makeAsyncComponent(() => import('../MyIntegrations/GoogleRedirect'));
// const OfficeRedirect = makeAsyncComponent(() => import('../MyIntegrations/OfficeRedirect'));
// const MsTeamRedirect = makeAsyncComponent(() => import('../MyIntegrations/msTeamRedirect'));
// const RedirectControl = makeAsyncComponent(() => import('../MyIntegrations/RedirectControl'));
const getStartedView = makeAsyncComponent(() => import('../getStartedView/getStartedView'));
const Resources = makeAsyncComponent(() => import('../Resources/Resources'))
const SalesAcademy = makeAsyncComponent(() => import('../SalesAcademy/SalesAcademy'));
const ImportCsv = makeAsyncComponent(() => import('../ImportCsv/importCsv'));
const Recruitment = makeAsyncComponent(() => import('../Recruitment/Recruitment'));
const RedirectFoxnort = makeAsyncComponent(() => import('./RedirectFoxnort'));
const StartWithFortnoxView = makeAsyncComponent(() => import('./StartWithFortnox'));
export {
  Accounts,
  Contacts,
  Activities,
  Pipeline,
  Delegation,
  CallLists,
  Campaigns,
  Insights,
  SignInView,
  SettingsView,
  MySettingsView,
  ProfileView,
  BillingInfoView,
  getStartedView,
  TermsOfUseView,
  MyIntegrations,
  ImportCsv,
  Resources,
  SalesAcademy,
  Recruitment,
  RedirectFoxnort,
  StartWithFortnoxView
};

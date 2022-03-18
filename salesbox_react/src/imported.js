/* eslint-disable */ 
    import {assignImportedComponents} from 'react-imported-component';
    const applicationImports = {
      0: () => import('./views/Accounts/AccountList'),
1: () => import('./views/Accounts/AccountDetail'),
2: () => import('./views/Activities/Appointments'),
3: () => import('./views/Activities/CalendarView'),
4: () => import('./views/Activities/Tasks'),
5: () => import('./views/Activities/Activities'),
6: () => import('./views/Accounts/Accounts'),
7: () => import('./views/Contacts/Contacts'),
8: () => import('./views/Pipeline/Pipeline'),
9: () => import('./views/Delegation/Delegation'),
10: () => import('./views/CallLists/CallLists'),
11: () => import('./views/Campaigns/Campaigns'),
12: () => import('./views/Insights/Insights'),
13: () => import('./views/SignIn/SignIn'),
14: () => import('./views/Settings/Settings'),
15: () => import('./views/MySettings/MySettings'),
16: () => import('./views/Profile/Profile'),
17: () => import('./views/BillingInfo/BillingInfo'),
18: () => import('./views/TermsOfUse/TermsOfUse'),
19: () => import('./views/Delegation/Leads'),
20: () => import('./views/Delegation/Tasks'),
21: () => import('./views/Task/TaskDetail'),
    };
    assignImportedComponents(applicationImports);
    export default applicationImports;
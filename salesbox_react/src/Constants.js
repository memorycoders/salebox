//@flow
import _l from 'lib/i18n';

export const WIDTH_DEFINE = {
  DETAIL_WIDTH_CONTENT: 308,
};

export const ver = 'v3.0';

export const ObjectTypes = {
  Task: 'TASK',
  Lead: 'LEAD',
  Delegation: 'DELEGATION',
  Contact: 'CONTACT',
  CallListContact: 'CALL_LIST_CONTACT',
  SubCallListContact: 'SUB_CALL_LIST_CONTACT',
  CallListAccount: 'CALL_LIST_ACCOUNT',
  SubCallListAccount: 'SUB_CALL_LIST_ACCOUNT',
  Account: 'ACCOUNT',
  Prospect: 'PROSPECT',
  Appointment: 'APPOINTMENT',
  OrderRow: 'ORDER_ROW',
  MeasurementType: 'MEASUREMENT_TYPE',
  LineOfBusiness: 'LINE_OF_BUSINESS',
  Product: 'PRODUCT',
  // Insight: 'INSIGHT',
  Insight: {
    Activity: 'INSIGHT_ACTIVITIES',
    Sales: 'INSIGHT_SALES',
    TopLists: 'INSIGHT_TOP_LISTS',
    Downloads: 'INSIGHT_DOWNLOADS',
    Resource: 'INSIGHT_RESOURCE',
  },
  PipelineLead: 'LEAD',
  ProductGroup: 'ProductGroup',
  OrganisationDropdown: 'ORGANISATION_DROPDOWN',
  ContactDropdown: 'CONTACT_DROPDOWN',
  Opportunity: 'OPPORTUNITY',
  DelegationLead: 'DELEGATION_LEADS',
  PipelineQualified: 'PIPELINE_QUALIFIED',
  PipelineOrder: 'PIPELINE_ORDER',
  AccountOrder: 'ACCOUNT_ORDER',
  ContactOrder: 'CONTACT_ORDER',
  Resource: 'RESOURCE',
  RecruitmentActive: 'CANDIDATE_ACTIVE',
  RecruitmentClosed: 'CANDIDATE_CLOSE',
};

export const OverviewTypes = {
  Insight: 'INSIGHT',
  Delegation: {
    Lead: 'DELEGATION_LEADS',
    Task: 'DELEGATION_TASKS',
  },
  Activity: {
    Task: 'ACTIVITIES_TASKS',
    Appointment: 'ACTIVITIES_APPOINTMENTS',
    Appointment_Add_Contact: 'Appointment_Add_Contact',
  },
  Contact: 'CONTACTS',
  Contact_Task: 'CONTACTS_TASK',
  Contact_Photo: 'CONTACTS_PHOTO',
  Contact_Note: 'CONTACTS_NOTE',
  Contact_Order: 'CONTACTS_ORDER',
  Contact_Qualified: 'CONTACTS_QUALIFIED',
  Contact_UnQualified: 'CONTACTS_UNQUALIFIED',
  Contact_Qualified_Task: 'CONTACTS_QUALIFIED_TASK',
  Contact_Contact: 'CONTACTS_CONTACTS',
  Contact_Unqualified_Multi: 'CONTACTS_UNQUALIFIED_MULTI',
  Contact_Unqualified: 'CONTACTS_UNQUALIFIED',
  Contact_Qualified_Multi: 'CONTACT_QUALIFIED_MULTI',
  Contact_Order_Multi: 'CONTACT_ORDER_MULTI',
  Contact_Qualified_Product: 'CONTACTS_QUALIFIED_PRODUCT',
  Contact_Qualified_Copy: 'CONTACTS_QUALIFIED_COPY',
  Contact_Unqualified_Qualified: 'CONTACT_UNQUALIFIED_QUALIFIED',
  Contact_Unqualified_Order: 'CONTACT_UNQUALIFIED_ORDER',
  Contact_Order_Product: 'CONTACT_ORDER_PRODUCT',
  Contact_Order_Copy: 'CONTACT_ORDER_COPY',
  Contact_Order_Task: 'CONTACTS_ORDER_TASK',
  Contact_Contact_Qualified: 'CONTACTS_CONTACTS_QUALIFIED',
  Contact_Contact_Unqualified: 'CONTACTS_CONTACTS_UNQUALIFIED',
  Contact_Contact_Task: 'CONTACTS_CONTACTS_TASK',
  Contact_Quick_Unqualified: 'CONTACTS_QUICK_UNQUALIFIED',
  Contact_Quick_Qualified: 'CONTACTS_QUICK_QUALIFIED',
  Contact_Add_Colleague: 'CONTACT_ADD_COLLEAGUE',
  Contact_Order_Contact: 'CONTACT_ORDER_CONTACT',
  Contact_Qualified_Contact: 'CONTACT_QUALIFIED_CONTACT',
  Contact_Appointment: 'CONTACT_APPOINTMENT',

  Campaigns: 'CAMPAIGNS',
  CallList: {
    Contact: 'CALL_LIST_CONTACT',
    SubContact: 'SUB_CALL_LIST_CONTACT',
    Account: 'CALL_LIST_ACCOUNT',
    SubAccount: 'SUB_CALL_LIST_ACCOUNT',
    List: 'CALL_LIST',
    SubAccount_Qualified: 'SUB_CALL_LIST_ACCOUNT_QUALIFIED',
    SubAccount_Unqualified: 'SUB_CALL_LIST_ACCOUNT_UNQUALIFIED',
    SubContact_Qualified: 'SUB_CALL_LIST_CONTACT_QUALIFIED',
  },
  OrderRow: 'ORDER_ROW',

  Account: 'ACCOUNTS',
  Account_Task: 'ACCOUNTS_TASK',
  Account_Unqualified_Multi: 'ACCOUNTS_UNQUALIFIED_MULTI',
  Account_Unqualified: 'ACCOUNTS_UNQUALIFIED',
  Account_Unqualified_Qualified: 'ACCOUNTS_UNQUALIFIED_QUALIFIED',
  Account_Unqualified_Order: 'ACCOUNTS_UNQUALIFIED_ORDER',
  Account_Qualified: 'ACCOUNTS_QUALIFIED',
  Account_Qualified_Copy: 'ACCOUNTS_QUALIFIED_COPY',
  Account_Qualified_Task: 'ACCOUNTS_QUALIFIED_TASK',
  Account_Order: 'ACCOUNTS_ORDER',
  Account_Order_Task: 'ACCOUNTS_ORDER_TASK',
  Account_Note: 'ACCOUNTS_NOTE',
  Account_Photo: 'ACCOUNTS_PHOTO',
  Account_Communication: 'ACCOUNT_COMMUNICATION',
  Account_Contact: 'ACCOUNTS_CONTACT',
  Account_Qualified_Contact: 'ACCOUNTS_QUALIFIED_CONTACT',
  Account_Order_Contact: 'ACCOUNTS_ORDER_CONTACT',
  Account_Appointment: 'ACCOUNTS_APPOINTMENT',

  Prospect: 'PROSPECTS',
  MeasurementType: 'MEASUREMENT_TYPE',
  LineOfBusiness: 'LINE_OF_BUSINESS',
  Product: 'PRODUCT',
  Pipeline: {
    Lead: 'PIPELINE_LEADS',
    Lead_Task: 'LEAD_TASK',
    Lead_Note: 'LEAD_NOTE',
    Lead_Appointment: 'LEAD_APPOINTMENT',
    Qualified: 'PIPELINE_QUALIFIED',
    Qualified_Copy: 'PIPELINE_QUALIFIED_COPY',
    Qualified_Task: 'QUALIFIED_TASK',
    Qualified_Note: 'QUALIFIED_NOTE',
    Qualified_Photo: 'QUALIFIED_PHOTO',
    Order: 'PIPELINE_ORDER',
    Order_Task: 'ORDER_TASK',
    Qualified_Document: 'QUALIFIED_DOCUMENT',
    Qualified_Appointment: 'QUALIFIED_APPOINTMENT',
    Order_Appointment: 'ORDER_APPOINTMENT',
  },
  OPPORTUNITY: 'OPPORTUNITY',
  Order: 'ORDERS',
  CommonOrderRow: 'COMMON_ORDER_ROW',
  Resource: 'RESOURCE',
  LIST_RESOURCE: 'LIST_RESOURCE',
  RecruitmentActive: 'CANDIDATE_ACTIVE',
  RecruitmentClosed: 'CANDIDATE_CLOSE',
  Recruitment: 'RECRUITMENT',
};

export const Colors = {
  Account: 'grey',
  Contact: 'green',
  Delegation: 'purple',
  Activity: 'activity',
  CallList: 'brown',
  Campaign: 'blue',
  Insight: 'black',
  Pipeline: 'green',
  Lead: 'green',
  Appointment: 'yellow',
  Task: 'yellow',
  Resource: 'green',
  Recruitment: 'green',
};

export const OverviewColors = {
  DELEGATION_LEADS: Colors.Delegation,
  DELEGATION_TASKS: Colors.Delegation,
  ACTIVITIES_TASKS: Colors.Activity,
  ACTIVITIES_APPOINTMENTS: Colors.Activity,
  CONTACTS: Colors.Contact,
  ACCOUNTS: Colors.Account,
  PROSPECTS: Colors.Prospect,
  ORDER_ROW: Colors.Prospect,
};

export const CommunicationTypes = {
  Email: {
    Sender: 'EMAIL_SENDER',
    Receiver: 'EMAIL_RECEIVER',
    Unknown: 'EMAIL',
  },
  Call: 'CALL',
  Video: 'VIDEO',
  Dial: 'DIAL',
  FACE_TIME_DIAL: 'FACE_TIME_DIAL',
  FACE_TIME_CALL: 'FACE_TIME_CALL',
  I_MESSAGE: 'I_MESSAGE',
  Chat: 'CHAT',
};

export const Endpoints = {
  Task: 'task-v3.0',
  Contact: 'contact-v3.0',
  CallList: 'call-lists-v3.0',
  Enterprise: 'enterprise-v3.0',
  Lead: 'lead-v3.0',
  Prospect: 'prospect-v3.0',
  Administration: 'administration-v3.0',
  Appointment: 'appointment-v3.0',
  Report: 'report-v3.0',
  AdvancedSearch: 'advance-search-v3.0',
  Campaign: 'campaign-v3.0',
  Document: 'document-v3.0',
  Organisation: 'organisation-v3.0',
  Resource: 'consultant-v3.0',
  Recruitment: 'recruitment-web-v3.0',
};

export const CssNames = {
  Account: 'account',
  Contact: 'contact',
  Delegation: 'delegation',
  Activity: 'activity',
  CallList: 'call-lists',
  Campaign: 'campaign',
  Insight: 'insight',
  Task: 'task',
  Pipeline: 'pipeline',
  OrderRow: 'pipeline',
  Lead: 'lead',
  Opportunity: 'opportunity',
  Resource: 'resource',
  Recruitment: 'recruitment',
};

export const Types = {
  Contact: 'CONTACT_RELATIONSHIP',
  Default: 'TYPE',
};

export const AdSearchFieldTypeHaveDropdownValue = {
  PRODUCT: 'PRODUCT',
  PRODUCT_TYPE: 'PRODUCT_TYPE',
  GOT_PRODUCT_TYPE: 'GOT_PRODUCT_TYPE',
  COMING_PRODUCT_TYPE: 'COMING_PRODUCT_TYPE',
  SOURCE: 'SOURCE',
  PRIORITY: 'PRIORITY',
  BEHAVIOR_COLOR: 'BEHAVIOR_COLOR',
  SEQUENTIAL_ACTIVITY: 'SEQUENTIAL_ACTIVITY',
  WON: 'WON',
  LOST: 'LOST',
  CALL_LIST: 'CALL_LIST',
  GOT_PRODUCT: 'GOT_PRODUCT',
  COMING_PRODUCT: 'COMING_PRODUCT',
  PRODUCT_GROUP: 'PRODUCT_GROUP',
  GOT_PRODUCT_GROUP: 'GOT_PRODUCT_GROUP',
  COMING_PRODUCT_GROUP: 'COMING_PRODUCT_GROUP',
  UNIT: 'UNIT',
  USER: 'USER',
  STATUS: 'STATUS',
  TYPE: 'TYPE',
  level: 'level',
  last_used: 'last_used',
};

export const ListAdSearchFieldTypeHaveDropdownValue = [
  AdSearchFieldTypeHaveDropdownValue.PRODUCT,
  AdSearchFieldTypeHaveDropdownValue.PRODUCT_TYPE,
  AdSearchFieldTypeHaveDropdownValue.SOURCE,
  AdSearchFieldTypeHaveDropdownValue.PRIORITY,
  AdSearchFieldTypeHaveDropdownValue.BEHAVIOR_COLOR,
  AdSearchFieldTypeHaveDropdownValue.SEQUENTIAL_ACTIVITY,
  AdSearchFieldTypeHaveDropdownValue.WON,
  AdSearchFieldTypeHaveDropdownValue.LOST,
  AdSearchFieldTypeHaveDropdownValue.CALL_LIST,
  AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT,
  AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT_GROUP,
  AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT_TYPE,
  AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT_TYPE,
  AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT_GROUP,
  AdSearchFieldTypeHaveDropdownValue.PRODUCT_GROUP,
  AdSearchFieldTypeHaveDropdownValue.UNIT,
  AdSearchFieldTypeHaveDropdownValue.USER,
  AdSearchFieldTypeHaveDropdownValue.STATUS,
  AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT,
  AdSearchFieldTypeHaveDropdownValue.TYPE,
];

export const UIDefaults = {
  DropdownMaxItems: 20,
  AnimationDuration: 350,
  DebounceTime: 450,
};

export const PhoneTypes = {
  Mobile: 'PHONE_MOBILE',
  Main: 'PHONE_MAIN',
  Home: 'PHONE_HOME',
  HomeFax: 'PHONE_HOME_FAX',
  iPhone: 'PHONE_IPHONE',
  Work: 'PHONE_WORK',
  WorkFax: 'PHONE_WORK_FAX',
  Other: 'PHONE_OTHER',
};

export const EmailTypes = {
  Home: 'EMAIL_HOME',
  iCloud: 'EMAIL_ICLOUD',
  Work: 'EMAIL_WORK',
  Other: 'EMAIL_OTHER',
};

export const EmailContactTypes = {
  Headquarter: 'EMAIL_HEAD_QUARTER',
  Subsidiary: 'EMAIL_SUBSIDIARY',
  department: 'EMAIL_DEPARTMENT',
  unit: 'EMAIL_UNIT',
  General: 'EMAIL_GENERAL',
  Support: 'EMAIL_SUPPORT',
  Other: 'EMAIL_OTHER',
};

export const PhoneContactTypes = {
  Headquarter: 'PHONE_HEAD_QUARTER',
  Subsidiary: 'PHONE_SUBSIDIARY',
  department: 'PHONE_DEPARTMENT',
  unit: 'PHONE_UNIT',
  Switchboard: 'PHONE_SWITCHBOARD',
  Mobile: 'PHONE_MOBILE',
  Other: 'PHONE_OTHER',
};

export const ChartStyle = {
  data: { fill: '#173849' },
  labels: { fontSize: 8 },
};

export const DateTimeFormat = {
  DEFAULT: 'DD MMM, YYYY H:mm',
  DATE_ONLY: 'DD MMM, YYYY',
  TIME_ONLY: 'H:mm',
};

export const ErrorMessage = {
  USERNAME_NOT_FOUND: 'USERNAME_NOT_FOUND',
  USER_EMAIL_DUPLICATE: 'USER_EMAIL_DUPLICATE',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  USER_EMAIL_NOT_FOUND: 'USER_EMAIL_NOT_FOUND',
  NETWORK_ERROR: 'Network Error',
  YOUR_ACCOUNT_HAS_BEEN_CANCELLED: 'YOUR_ACCOUNT_HAS_BEEN_CANCELLED',
};
export const Chart = {
  Scatter: {
    data: { fill: '#FF0000' },
  },
  Colors: [
    'rgba(249, 235, 234, 100)',
    'rgba(242, 215, 213, 100)',
    'rgba(230, 176, 170, 100)',
    'rgba(217, 136, 128, 100)',
    'rgba(205, 97, 85, 100)',
    'rgba(192, 57, 43, 100)',
    'rgba(169, 50, 38, 100)',
    'rgba(146, 43, 33, 100)',
    'rgba(123, 36, 28, 100)',
    'rgba(100, 30, 22, 100)',
    'rgba(253, 237, 236, 100)',
    'rgba(250, 219, 216, 100)',
    'rgba(245, 183, 177, 100)',
    'rgba(241, 148, 138, 100)',
    'rgba(236, 112, 99, 100)',
    'rgba(231, 76, 60, 100)',
    'rgba(203, 67, 53, 100)',
    'rgba(176, 58, 46, 100)',
    'rgba(148, 49, 38, 100)',
    'rgba(120, 40, 31, 100)',
    'rgba(245, 238, 248, 100)',
    'rgba(235, 222, 240, 100)',
    'rgba(215, 189, 226, 100)',
    'rgba(195, 155, 211, 100)',
    'rgba(175, 122, 197, 100)',
    'rgba(155, 89, 182, 100)',
    'rgba(136, 78, 160, 100)',
    'rgba(118, 68, 138, 100)',
    'rgba(99, 57, 116, 100)',
    'rgba(81, 46, 95, 100)',
    'rgba(244, 236, 247, 100)',
    'rgba(232, 218, 239, 100)',
    'rgba(210, 180, 222, 100)',
    'rgba(187, 143, 206, 100)',
    'rgba(165, 105, 189, 100)',
    'rgba(142, 68, 173, 100)',
    'rgba(125, 60, 152, 100)',
    'rgba(108, 52, 131, 100)',
    'rgba(91, 44, 111, 100)',
    'rgba(74, 35, 90, 100)',
    'rgba(234, 242, 248, 100)',
    'rgba(212, 230, 241, 100)',
    'rgba(169, 204, 227, 100)',
    'rgba(127, 179, 213, 100)',
    'rgba(84, 153, 199, 100)',
    'rgba(41, 128, 185, 100)',
    'rgba(36, 113, 163, 100)',
    'rgba(31, 97, 141, 100)',
    'rgba(26, 82, 118, 100)',
    'rgba(21, 67, 96, 100)',
    'rgba(235, 245, 251, 100)',
    'rgba(214, 234, 248, 100)',
    'rgba(174, 214, 241, 100)',
    'rgba(133, 193, 233, 100)',
    'rgba(93, 173, 226, 100)',
    'rgba(52, 152, 219, 100)',
    'rgba(46, 134, 193, 100)',
    'rgba(40, 116, 166, 100)',
    'rgba(33, 97, 140, 100)',
    'rgba(27, 79, 114, 100)',
    'rgba(232, 248, 245, 100)',
    'rgba(209, 242, 235, 100)',
    'rgba(163, 228, 215, 100)',
    'rgba(118, 215, 196, 100)',
    'rgba(72, 201, 176, 100)',
    'rgba(26, 188, 156, 100)',
    'rgba(23, 165, 137, 100)',
    'rgba(20, 143, 119, 100)',
    'rgba(17, 120, 100, 100)',
    'rgba(14, 98, 81, 100)',
    'rgba(232, 246, 243, 100)',
    'rgba(208, 236, 231, 100)',
    'rgba(162, 217, 206, 100)',
    'rgba(115, 198, 182, 100)',
    'rgba(69, 179, 157, 100)',
    'rgba(22, 160, 133, 100)',
    'rgba(19, 141, 117, 100)',
    'rgba(17, 122, 101, 100)',
    'rgba(14, 102, 85, 100)',
    'rgba(11, 83, 69, 100)',
    'rgba(233, 247, 239, 100)',
    'rgba(212, 239, 223, 100)',
    'rgba(169, 223, 191, 100)',
    'rgba(125, 206, 160, 100)',
    'rgba(82, 190, 128, 100)',
    'rgba(39, 174, 96, 100)',
    'rgba(34, 153, 84, 100)',
    'rgba(30, 132, 73, 100)',
    'rgba(25, 111, 61, 100)',
    'rgba(20, 90, 50, 100)',
    'rgba(234, 250, 241, 100)',
    'rgba(213, 245, 227, 100)',
    'rgba(171, 235, 198, 100)',
    'rgba(130, 224, 170, 100)',
    'rgba(88, 214, 141, 100)',
    'rgba(46, 204, 113, 100)',
    'rgba(40, 180, 99, 100)',
    'rgba(35, 155, 86, 100)',
    'rgba(29, 131, 72, 100)',
    'rgba(24, 106, 59, 100)',
    'rgba(254, 249, 231, 100)',
    'rgba(252, 243, 207, 100)',
    'rgba(249, 231, 159, 100)',
    'rgba(247, 220, 111, 100)',
    'rgba(244, 208, 63, 100)',
    'rgba(241, 196, 15, 100)',
    'rgba(212, 172, 13, 100)',
    'rgba(183, 149, 11, 100)',
    'rgba(154, 125, 10, 100)',
    'rgba(125, 102, 8, 100)',
    'rgba(254, 245, 231, 100)',
    'rgba(253, 235, 208, 100)',
    'rgba(250, 215, 160, 100)',
    'rgba(248, 196, 113, 100)',
    'rgba(245, 176, 65, 100)',
    'rgba(243, 156, 18, 100)',
    'rgba(214, 137, 16, 100)',
    'rgba(185, 119, 14, 100)',
    'rgba(156, 100, 12, 100)',
    'rgba(126, 81, 9, 100)',
    'rgba(253, 242, 233, 100)',
    'rgba(250, 229, 211, 100)',
    'rgba(245, 203, 167, 100)',
    'rgba(240, 178, 122, 100)',
    'rgba(235, 152, 78, 100)',
    'rgba(230, 126, 34, 100)',
    'rgba(202, 111, 30, 100)',
    'rgba(175, 96, 26, 100)',
    'rgba(147, 81, 22, 100)',
    'rgba(120, 66, 18, 100)',
    'rgba(251, 238, 230, 100)',
    'rgba(246, 221, 204, 100)',
    'rgba(237, 187, 153, 100)',
    'rgba(229, 152, 102, 100)',
    'rgba(220, 118, 51, 100)',
    'rgba(211, 84, 0, 100)',
    'rgba(186, 74, 0, 100)',
    'rgba(160, 64, 0, 100)',
    'rgba(135, 54, 0, 100)',
    'rgba(110, 44, 0, 100)',
  ],
};

export const ROUTERS = {
  SIGN_IN: 'sign-in',
  ACTIVITIES: 'activities',
  PIPELINE: 'pipeline',
  ACCOUNTS: 'accounts',
  CONTACTS: 'contacts',
  DELEGATION: 'delegation',
  CALL_LIST: 'call-lists',
  CAMPAIGNS: 'campaigns',
  INSIGHTS: 'insights',
  SETTINGS: 'settings',
  MY_SETTINGS: 'my-settings',
  PROFILE: 'profile',
  TERMS_OF_USE: 'terms-of-use',
  BILLING_INFO: 'billing-info',
  GET_STARTED: 'get-started',
  LEAD: 'pipeline/leads',
  OPPORTUNITY: 'opportunities',
  DELEGATION_LEADS: 'delegation/leads',
  DELEGATION_TASKS: 'delegation/tasks',
  CALENDER: 'activities/calender',
  RESOURCES: 'resources',
  SALES_ACADEMY: 'sales-academy',
  RECRUITMENT: 'recruitment',
  RECRUITMENT_CLOSED: 'recruitment/closed',
};
export const CALL_LIST_TYPE = {
  ACCOUNT: 'account',
  CONTACT: 'contact',
};
export const CUSTOM_FIELD = 'CUSTOM_FIELD';
export const NO_VALUE = 'NO_VALUE';
export const FORM_KEY = {
  CREATE: '__CREATE',
  EDIT: '__EDIT',
};
export const FORM_ACTION = {
  CREATE: 'create',
  EDIT: 'edit',
};

export const STORAGES = {
  ONE_DRIVE: 'ONE_DRIVE',
  DROP_BOX: 'DROP_BOX',
  ONE_DRIVE_FOR_BUSINESS: 'ONE_DRIVE_FOR_BUSINESS',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
};
export const classCommonModalContent = 'common-modal-content';
let _lastDropdownId = null;
export const calculatingPositionMenuDropdown = (id, classDialog, isGetOffsetByParrent) => {
  if (id) {
    _lastDropdownId = id;
  } else {
    id = _lastDropdownId;
  }
  let dropdown = document.getElementById(id);
  if (dropdown) {
    let _widthDropdown = dropdown.offsetWidth;
    let _menu = dropdown.getElementsByClassName(`${classDialog ? classDialog : 'menu'}`)[0];
    let _commonContent = document.getElementsByClassName(classCommonModalContent);
    if (_menu) {
      _menu.style.width = _widthDropdown;
      _menu.style.minWidth = _widthDropdown;
      let _offsetTop = isGetOffsetByParrent ? dropdown.offsetTop + dropdown.offsetParent.offsetTop : dropdown.offsetTop;
      _menu.style.top =
        _offsetTop +
        27 -
        (_commonContent && _commonContent[_commonContent.length - 1]
          ? _commonContent[_commonContent.length - 1].scrollTop
          : 0);
      _menu.style.left = isGetOffsetByParrent
        ? dropdown.offsetLeft + dropdown.offsetParent.offsetLeft + 2
        : dropdown.offsetLeft + 1;
      _menu = null;
      _commonContent = null;
    }
  }
  dropdown = null;
};

export const APPOINTMENT_SUGGEST_ACTION_NAME = {
  ADD_REMINDER: 'ADD_REMINDER',
  ADD_NOTE: 'ADD_NOTE',
  ADD_MEETING: 'ADD_MEETING',
  ADD_PROSPECT: 'ADD_PROSPECT',
  ADD_DEAL: 'ADD_DEAL',
};

export const OPEN_APPOINTMENT_SUGGEST_FROM = {
  LIST_APPOINTMENT_NOT_HANDLE_TODAY: 'LIST_APPOINTMENT_NOT_HANDLE_TODAY',
};

export const SPECIAL_TASK = {
  IDENTIFY_LEAD_CONTACT: 'IDENTIFY_LEAD_CONTACT',
  FOLLOW_UP_LEAD: 'FOLLOW_UP_LEAD',
  QUALIFY_LEAD: 'QUALIFY_LEAD',
};
export const PAGE_SIZE_SUBLIST = 12;

export const STATUS_MSTEAMS_OF_CONTACT = {
  CONTACT_NOT_CONNECTED_TO_USER_IN_TEAMS: 'CONTACT_NOT_CONNECTED_TO_USER_IN_TEAMS',
  AVAILABLE: 'AVAILABLE',
  DO_NOT_DISTURB: 'DO_NOT_DISTURB',
  BUSY: 'BUSY',
  OFFLINE: 'OFFLINE',
  BE_RIGHT_BACK: 'BE_RIGHT_BACK',
  AWAY: 'AWAY',
  PRESENCE_UNKNOWN: 'PRESENCE_UNKNOWN',
};
export const popupWindow = (url, title, windowWidth, windowHeight) => {
  const documentElement = document.documentElement;
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
  const width = window.innerWidth || documentElement.clientWidth || screen.width;
  const height = window.innerHeight || documentElement.clientHeight || screen.height;
  const left = (width - windowWidth) / 2 + dualScreenLeft;
  const top = (height - windowHeight) / 2 + dualScreenTop;

  return window.open(
    url,
    title,
    'resizeable=true,height=' + windowHeight + ',width=' + windowWidth + ',left=' + left + ',top=' + top
  );
};

export const FORECAST_TYPE = ['REVENUE_FORECAST', 'REVENUE_FORECAST', 'PROFIT_FORECAST', 'MARGIN_FORECAST'];

export const PHONE_TYPES = {
  ANDROID: 'Android',
  IOS: 'iOS',
};

export const PRODUCT_SORT_ITEMS = [
  {
    key: 'name',
    label: _l`Product`,
  },
  {
    key: 'price',
    label: _l`Price`,
  },
  {
    key: 'quantity',
    label: _l`No. of units`,
  },
  {
    key: 'measurementTypeName',
    label: _l`Type`,
  },
  {
    key: 'margin',
    label: _l`Margin`,
  },
  {
    key: 'active',
    label: _l`Active`,
  },
];

export const KEY_ERROR = {
  ORGANISATION_DELETED: `Company has been deleted`,
  CONTACT_DELETED: `Contact has been deleted`,
  UNSPECIFIED_ERROR: `Oh, something went wrong`,
  SIGNEDOUT_OUT_SUCCESSFULLY: `Signed out successfully`,
  SIGNEDIN_SUCCESSFULLY: `Signed in successfully`,
  INCORRECT_PASSWORD: `Password is not correct`,
  USERNAME_NOT_FOUND: `Username does not exist`,
  USER_EMAIL_DUPLICATE: `The username already exists`,
  DUPLICATED_ADVANCE_SEARCH: `A search with this name already exists`,
  ADVANCED_SEARCH_SAVED: `Search was saved`,
  ADVANCED_SEARCH_SHARED: `Search was shared`,
  ADVANCED_SEARCH_DELETE_SUCCESS: `Search was removed`,
  ADVANCED_SEARCH_COPIED: `Advanced search copied`,
  ADVANCE_SEARCH_NOT_FOUND: `Search was not found`,
  USER_EMAIL_NOT_FOUND: `Cannot find a user associated with this email`,
  'CAN NOT GET ANY EMAIL': `Total contacts added to Mailchimp list : 0`,
  CANNOT_DELETE_PROSPECT_BECAUSE_EXISTING_ACTIVE_TASK_OR_ACTIVE_MEETING: _l`Cannot delete opportunity because of existing active reminder or active meeting`,
  CANNOT_ADD_FOR_MORE_THAN_250_OBJECT: `You can only create 250 in one batch`,
  CANNOT_ADD_FOR_MORE_THAN_200_OBJECT: `You can only create 200 in one batch`,
  CANNOT_ADD_FOR_MORE_THAN_100_OBJECT: `You can only create 100 in one batch`,
  CONTACT_MOVED_TO_OTHER_ACCOUNT: `Contact has moved to new account`,
  INCORRECT_OLD_PASSWORD: 'Incorrect old password',
  CARD_NOT_SUPPORTED: 'Card not supported',
  INVALID_COUPON: 'Invalid coupon',
  ERROR_DELETE_BECAUSE_USING: `Cannot delete name that in using`,
  SALES_METHOD_NAME_UNIQUE: 'Another pipeline with this name already exist',
  EXISTING_EMAIL: 'Email already exist',
  WORK_DATA_ORGANISATION_NAME_UNIQUE: 'Industry name already exist',
  NO_EMAIL_TO_SEND: 'No email to send',
  CANNOT_EXPORT_MORE_THAN_2000_PER_EXPORT: 'You can only export 2000 per export',
  YOUR_CARD_CANNOT_PAYMENT_CONTINUE:
    'Your account has expired. Please ask your Salesbox Administrator to renew your account in Billing info.',
  DUPLICATED_LEAD_OF_MINE: 'You already have this lead, do you still want to add?',
  THIS_GOOGLE_ACCOUNT_HAS_ALREADY_CONNECT_TO_ANOTHER_SALESBOX_ACCOUNT:
    'THIS_GOOGLE_ACCOUNT_HAS_ALREADY_CONNECT_TO_ANOTHER_SALESBOX_ACCOUNT',
  CONTACT_DUPLICATE:
    'Oh, a contact with the same information already exist (Same email or same name and account or phone).',
  LOCAL_EMAIL_DUPLICATE:
    'Oh, a contact with the same information already exist (Same email or same name and account or phone).',
  POOL_CONTACT_EMAIL_DUPLICATE:
    'Oh, a contact with the same information already exist (Same email or same name and account or phone).',
  PERMISSION_DENIED: 'Permission denied',
  CAN_NOT_CHANGE_ORGANISATION_BECAUSE_EXISTING_ACTIVE_MEETING: 'Cannot change account has active meeting',
  CAN_NOT_CHANGE_ORGANISATION_BECAUSE_EXISTING_ACTIVE_TASK: 'Cannot change account has active reminder',
  CAN_NOT_CHANGE_ORGANISATION_BECAUSE_EXISTING_ACTIVE_OPPORTUNITY:
    'Cannot change account when the contact has active deal',
  CAN_NOT_CHANGE_ORGANISATION_BECAUSE_EXISTING_ACTIVE_LEAD: 'Cannot change account has active prospect',
  CONTACT_CANNOT_DELETE_POWER_SPONSOR:
    'Oh, the Contact team doesn’t have any members. Please add at least one user before saving.',
  WORK_DATA_ACTIVITY_NAME_UNIQUE: 'WORK_DATA_ACTIVITY_NAME_UNIQUE',
  WORK_DATA_ORGANISATION_NAME_UNIQUE: 'WORK_DATA_ORGANISATION_NAME_UNIQUE',
  DUPLICATED_MULTI_RELATION: 'DUPLICATED_MULTI_RELATION',
  REQUIRE_AT_LEAST_ONE_SALES_METHOD_IN_USING: 'REQUIRE_AT_LEAST_ONE_SALES_METHOD_IN_USING',
  ERROR_REMOVE_SALES_METHOD_USING_BY_PROSPECT: 'ERROR_REMOVE_SALES_METHOD_USING_BY_PROSPECT',
  CAN_NOT_DUPLICATE_A_PROCESS_LESS_THAN_THREE_STAGE: 'CAN_NOT_DUPLICATE_A_PROCESS_LESS_THAN_THREE_STAGE',
  CAN_NOT_CHANGE_SALES_METHOD_MODE_IN_USING: 'CAN_NOT_CHANGE_SALES_METHOD_MODE_IN_USING',
  CONTACT_HAS_NO_EMAIL: 'CONTACT_HAS_NO_EMAIL',
  ALREADY_HAS_A_TASK_WITH_SAME_FOCUS: 'ALREADY_HAS_A_TASK_WITH_SAME_FOCUS',
  COMPETENCE_LEVEL_UNIQUE: 'COMPETENCE_LEVEL_UNIQUE',
  COMPETENCE_LEVEL_NOT_FOUND: 'COMPETENCE_LEVEL_NOT_FOUND',
  CURRENT_SUBSCRIPTION_IS_CANCELLED: 'CURRENT_SUBSCRIPTION_IS_CANCELLED',
  NO_CONNECTED_STRIPE_ACCOUNT: 'No connected Stripe account',
  PROFILE_HAS_BEEN_SHARED_TO_USER: 'Profile have been shared to user',
  CANNOT_SHARE_PROFILE_TO_USER_SAME_ENTERPRISE: 'You cannot share profile to user in same enterprise',
  STRIPE_ERROR: 'STRIPE_ERROR',
  'Your card was declined. Your request was in test mode, but used a non test (live) card. For a list of valid test cards, visit: https://stripe.com/docs/testing.':
    'Your card was declined. Your request was in test mode, but used a non test (live) card. For a list of valid test cards, visit: https://stripe.com/docs/testing.',
  'Your card was declined. Your request was in live mode, but used a known test card.':
    'Your card was declined. Your request was in live mode, but used a known test card.',
  REQUIRE_AT_LEAST_ONE_RECRUITMENT_CASE_IN_USING: 'Require at least one recruitment case in using',
  PIPELINE_CONTAINS_ACTIVE_DEALS: 'Pipeline contains active deals',
  'Candidate has exits!': 'Candidate has exits!',
  NOT_CHANGE_MAIN_CONTACT: 'Cannot deactivate main contact.',
  OVER_MAXIMUM_PER_BATCH: 'OVER_MAXIMUM_PER_BATCH',
  OVER_MAXIMUM_PER_24HOURS: 'OVER_MAXIMUM_PER_24HOURS',
  EMAIL_NOT_MAPPING_WITH_VERIFIED_DOMAIN: 'EMAIL_NOT_MAPPING_WITH_VERIFIED_DOMAIN',
  EXISTED:'EXISTED'
};

export const REVENUETYPE = {
  START_END: 'START/END',
  FIXED_RECURRING: 'FIXED/RECURRING',
};

export const RECURRING = "RECURRING";

export const RESOURCE_TAB = {
  PROFILE: 'PROFILE',
  EXPERIENCES: 'EXPERIENCES',
  CV: 'CV',
};

export const TYPE_EXPORT_CV = {
  PDF: 'PDF',
  WORD: 'WORD',
};

export const RESOURCE_REPORT = {
  BOOKED: 'BOOKED',
  COMING: 'COMING',
};

export const RESOURCE_PERIOD_TYPE = {
  MONTH: 'MONTH',
  WEEK: 'WEEK',
};

export const iconMoney = {
  USD: '$',
  EUR: '€',
  SEK: 'kr',
  DKK: 'kr',
  NOK: 'kr',
  GBP: '£',
  ALL: 'Lek',
  AFN: '؋',
  ARS: '$',
  AWG: "ƒ",
  AUD: "$",
  AZN: '₼',
  BSD: '$',
  BBD: '$',
  BYR: 'p.',
  BZD: 'BZ$',
  BMD: '$',
  BOB: '$b',
  BAM: 'KM',
  BWP: 'P',
  BGN: 'лв',
  BRL: 'R$',
  BND: '$',
  KHR: '៛',
  CAD: '$',
  KYD: '$',
  CLP: '$',
  CNY: '¥',
  COP: '$',
  CRC: '₡',
  HRK: 'kn',
  CUP: '₱',
  CZK: 'Kč',
  DKK: 'kr',
  DOP: 'RD$',
  EGP: '£',
  SVC: '$',
  EEK: 'kr',
  FKP: "£",
  FJD: "$",
  GEL: '₾',
  GHC: '¢',
  GIP: '£',
  GTQ: 'Q',
  GGP: '£',
  GYD: '$',
  HNL: 'L',
  HKD: '$',
  HUF: 'Ft',
  ISK: 'kr',
  INR: '₹',
  IDR: 'Rp',
  IRR: '﷼',
  IMP: '£',
  ILS: '₪',
  JMD: 'J$',
  JPY: '¥',
  JEP: '£',
  KZT: 'лв',

  KPW: '₩',
  KRW: '₩',
  KGS: 'лв',
  LAK: '£',
  LRD: '$',
  LTL: 'Lt',
  MKD: 'ден',
  MYR: 'RM',
  MUR: '₨',
  MXN: '$',
  MNT: '₮',
  MZN: 'MT',
  NAD: '$',
  NPR:	"₨",
  ANG:	"ƒ",
	NZD:	"$",
  NIO: "C$",
  NGN:	"₦",
  NOK:	"kr",
  OMR:	"﷼",
  PKR:	"₨",
  PAB:	"B/.",
  PYG:	"Gs",
  PEN:	"S/.",
  PHP:	"₱",
  PLN:	"zł",
  QAR:	"﷼",
  RON:	"lei",
  RUB:	"₽",
  SHP:	"£",
  SAR:	"﷼",
  RSD:	"Дин.",
  SCR:	"₨",
  SGD:	"$",
  SBD:	"$",
  SOS:	"S",
  ZAR:	"R",
  LKR:	"₨",
  SEK:	"kr",
  CHF:	"CHF",
  SRD: "$",
  SYP:	"£",
  TWD:	"NT$",
  THB:	"฿",
  TTD:	"TT$",
  TRL:	"₺",
  TVD:	"$",
  UAH:	"₴",
  GBP: "£",
  USD:	"$",
  UYU:	"$U",
  UZS:	"лв",
  VEF:	"Bs",
  VND:	"₫",
  YER:	"﷼",
  ZWD:	"Z$"
};

export const ENTERPRISE_CV = '0db5538b-a550-4df6-8b3f-3a6d798c0ab4'

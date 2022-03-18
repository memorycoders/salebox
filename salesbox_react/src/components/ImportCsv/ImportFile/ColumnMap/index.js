/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button, Label, Icon, Menu, Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';
import cx from 'classnames';
import _l from 'lib/i18n';
import _, { stubFalse } from 'lodash';
import moment from 'moment';
import * as NotificationActions from 'components/Notification/notification.actions';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import api from '../../../../lib/apiClient';
import newApi from '../../../../lib/apiClientNew';
import { Endpoints } from '../../../../Constants';
import { getCurrentTimeZone } from '../../../../lib/dateTimeService';
import AddToCallListModal from '../AddCallListModal/AddCallListModal';
import SyncCalendarModal from '../../../MyIntegrations/SyncCalendarModal';
import EditCallListModal from '../EditCallList/EditModal';
import CreatePipelineModal from '../AddLead/LeadModal';
// import Common from './common';
import css from './style.css';
import isEmail from 'lib/isEmail';
import isPhone from 'lib/isValidPhone';

import UserDropDown from '../UserDropDown';
import SelectDropDown, { calculatingPositionMenuDropdown } from '../SelectDropDown';

import editBtn from '../../../../../public/Edit.svg';
import ModalCommon from '../../../ModalCommon/ModalCommon';

const ColumnMap = (props) => {
  let Common = {
    initAccountLabels: [
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Name`,
        fieldLabel: 'Company Name',
        dbColName: 'accountName',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`VAT number`,
        fieldLabel: 'VAT Number',
        dbColName: 'accountVat',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Phone`,
        fieldLabel: 'Company Phone',
        dbColName: 'accountPhone',
        fieldType: 'PHONE',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Email`,
        fieldLabel: 'Company Email',
        dbColName: 'accountEmail',
        fieldType: 'EMAIL',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Street`,
        fieldLabel: 'Company Street',
        dbColName: 'accountStreet',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Zip code`,
        fieldLabel: 'Company Zip Code',
        dbColName: 'accountZipCode',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`City`,
        fieldLabel: 'Company City',
        dbColName: 'accountCity',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Region/State`,
        fieldLabel: 'Company Region/State',
        dbColName: 'accountState',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Country`,
        fieldLabel: 'Company Country',
        dbColName: 'accountCountry',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Type`,
        fieldLabel: 'Company Type',
        dbColName: 'accountType',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Industry`,
        fieldLabel: 'Company Industry',
        dbColName: 'accountIndustry',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Size`,
        fieldLabel: 'Company Size',
        dbColName: 'accountSize',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Web`,
        fieldLabel: 'Company Web',
        dbColName: 'accountWeb',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'account',
        viewLabel: _l`Note`,
        fieldLabel: 'Company Note',
        dbColName: 'accountNote',
        fieldType: 'TEXT',
      },
    ],
    initContactLabels: [
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`First Name`,
        fieldLabel: 'Contact Firstname',
        dbColName: 'contactFirstName',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Last Name`,
        fieldLabel: 'Contact Lastname',
        dbColName: 'contactLastName',
        fieldType: 'TEXT',
      },
      //{
      //    'vis': true,
      //    'inGroup': 'contact',
      //    'viewLabel': 'Behaviour Profile',
      //    'fieldLabel': 'Contact Behaviour Profile',
      //    'dbColName': 'contactBehaviourProfile'
      //},
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Phone`,
        fieldLabel: 'Contact Phone',
        dbColName: 'contactPhone',
        fieldType: 'PHONE',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Email`,
        fieldLabel: 'Contact Email',
        dbColName: 'contactEmail',
        fieldType: 'EMAIL',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Street`,
        fieldLabel: 'Contact Street',
        dbColName: 'contactStreet',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Zip code`,
        fieldLabel: 'Contact Zip code',
        dbColName: 'contactZipCode',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`City`,
        fieldLabel: 'Contact City',
        dbColName: 'contactCity',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Region/State`,
        fieldLabel: 'Contact Region/State',
        dbColName: 'contactState',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Country`,
        fieldLabel: 'Contact Country',
        dbColName: 'contactCountry',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Title`,
        fieldLabel: 'Contact Title',
        dbColName: 'contactTitle',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Type`,
        fieldLabel: 'Contact Type',
        dbColName: 'contactType',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Industry`,
        fieldLabel: 'Contact Industry',
        dbColName: 'contactIndustry',
        fieldType: 'TEXT',
      },
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Relation`,
        fieldLabel: 'Contact Relation',
        dbColName: 'contactRelation',
        fieldType: 'TEXT',
      },
      //{
      //    'vis': true,
      //    'inGroup': 'contact',
      //    'viewLabel': 'Relationship',
      //    'fieldLabel': 'Contact Relationship',
      //    'dbColName': 'contactRelationship'
      //},
      {
        vis: true,
        inGroup: 'contact',
        viewLabel: _l`Note`,
        fieldLabel: 'Contact Note',
        dbColName: 'contactNote',
        fieldType: 'TEXT',
      },
    ],
    initLeadLabels: [
      {
        vis: true,
        inGroup: 'lead',
        viewLabel: _l`Note`,
        fieldLabel: 'Note',
        dbColName: 'leadnote',
        fieldType: 'TEXT',
      },
    ],
  };
  let calculatingPercentInterval;
  const [isImporting, setImporting] = useState(false);
  const [percentImporting, setPercentImporting] = useState(40);
  const [importMode, setIImportMode] = useState('NONE'); //NONE, ACCOUNT_CONTACT, LEAD, CALL_LIST
  const [userList, setUserList] = useState(() => {
    const users = Object.keys(props.users).map((userId) => {
      const user = props.users[userId];
      if (props.user.uuid === userId) {
        return {
          ...user,
          text: user.firstName + ' ' + user.lastName,
          selected: true,
        };
      }
      return {
        ...user,
        text: user.firstName + ' ' + user.lastName,
      };
    });
    return users;
  });
  const [selectedRespUsers, setSelectedRespUsers] = useState([
    { firstName: props.user.firstName, lastName: props.user.lastName, email: props.user.email, uuid: props.user.uuid },
  ]);
  const [selected, setSelected] = useState('');

  const [accountLabels, setAccountLabels] = useState(Common.initAccountLabels);
  const [contactLabels, setContactLabels] = useState(Common.initContactLabels);
  const [leadLabels, setLeadLabels] = useState(Common.initLeadLabels);
  const [colDropDowns, setColDropDowns] = useState([]);

  const [callListBaseData, setCallListBaseData] = useState({});
  const [leadBaseData, setLeadBaseData] = useState({});

  const [confirmModal, setConfirmModal] = useState({ status: false, title: '', fnOk: null, fnCancel: null });
  const [addModal, setAddModal] = useState({ status: false, type: '', fnOk: null, fnCancel: null, form: {} });

  const [visibleSummary, setVisibleSummary] = useState(false);
  const [errorSummary, setErrorSummary] = useState([]);

  useEffect(() => {
    getCustomFieldByObjectType('ACCOUNT');
  }, []);
  useEffect(() => {
    getCustomFieldByObjectType('CONTACT');
  }, []);
  useEffect(() => {
    getCustomFieldByObjectType('LEAD');
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      console.log('scroll');
      let _timeoutScroll;
      clearTimeout(_timeoutScroll);
      _timeoutScroll = setTimeout(() => {
        calculatingPositionMenuDropdown();
      }, 100);
    };
    document.getElementById('common-list-content') &&
      document.getElementById('common-list-content').addEventListener('scroll', handleScroll, { passive: true });
    return () =>
      document.getElementById('common-list-content') &&
      document.getElementById('common-list-content').removeEventListener('scroll', handleScroll);
  });
  const getCustomFieldByObjectType = async (objectType) => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/customField/listByObject`,
        query: {
          objectType,
        },
      });
      if (res) {
        const accountCustomFiledList = [];
        res.customFieldDTOList.forEach((customField) => {
          const obj = {
            vis: true,
            viewLabel: customField.title + ' (Custom Field)',
            fieldLabel: customField.title + ' (Custom Field)',
            fieldType: customField.fieldType,
          };
          switch (objectType) {
            case 'ACCOUNT':
              obj.inGroup = 'account';
              obj.dbColName = 'accCustomField' + customField.uuid + customField.title;
              break;
            case 'CONTACT':
              obj.inGroup = 'contact';
              obj.dbColName = 'conCustomField' + customField.uuid + customField.title;
              break;
            case 'LEAD':
              obj.inGroup = 'lead';
              obj.dbColName = 'leaCustomField' + customField.uuid + customField.title;
              break;
            default:
              break;
          }
          accountCustomFiledList.push(obj);
        });
        let arr = [];
        switch (objectType) {
          case 'ACCOUNT':
            arr = accountLabels.concat(accountCustomFiledList);
            setAccountLabels(arr);
            break;
          case 'CONTACT':
            arr = contactLabels.concat(accountCustomFiledList);
            setContactLabels(arr);
            break;
          case 'LEAD':
            arr = leadLabels.concat(accountCustomFiledList);
            setLeadLabels(arr);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeImportMode = (mode) => {
    if (mode !== 'NONE' && importMode === 'NONE') {
      const cols = [];
      for (let i = 0; i < colDropDowns.length; i++) {
        cols[i] = { sValue: '', sGroup: '' };
      }
      setColDropDowns(cols);
    }
    if (mode !== importMode) {
      setIImportMode(mode);
      if (mode === 'CALL_LIST') {
        const _modal = {
          status: true,
          type: 'ADD_CALL',
          fnOk: (data) => {
            console.log('call list', data);
            setCallListBaseData({ type: data.type, name: data.text, uuid: data.value });
            setAddModal({ status: false });
          },
          fnCancel: () => {
            setAddModal({ status: false });
          },
        };
        setAddModal(_modal);
      }
      if (mode === 'LEAD') {
        const _modal = {
          status: true,
          type: 'ADD_LEAD',
          fnOk: (data) => {
            console.log('lead base data', data);
            setLeadBaseData({ ...data });
            setAddModal({ status: false });
          },
          fnCancel: () => {
            setAddModal({ status: false });
          },
        };
        setAddModal(_modal);
      }
    }
  };

  const selectUser = (e, data) => {
    switch (data.value) {
      case 'All':
        addAllActiveUser();
        break;
      case 'None':
        removeAllSelectedUser();
        break;
      default:
        addOneUser(data.value);
        break;
    }
    setSelected(data.value);
  };

  const addAllUser = () => {
    const users = [];
    let copyUserList = [...userList];
    copyUserList = copyUserList.map((user) => {
      users.push({ firstName: user.firstName, lastName: user.lastName, email: user.email, uuid: user.uuid });
      return Object.assign({}, user, { selected: true });
    });
    setSelectedRespUsers(users);
    setUserList(copyUserList);
  };

  const addAllActiveUser = () => {
    const users = [];
    let copyUserList = [...userList];
    copyUserList = copyUserList
      .filter((value) => {
        return value.active || value.active === null;
      })
      .map((user) => {
        users.push({ firstName: user.firstName, lastName: user.lastName, email: user.email, uuid: user.uuid });
        return Object.assign({}, user, { selected: true });
      });
    setSelectedRespUsers(users);
    setUserList(copyUserList);
  };

  const removeAllSelectedUser = () => {
    const users = [];
    let copyUserList = [...userList];
    copyUserList = copyUserList.map((user) => {
      return Object.assign({}, user, { selected: false });
    });
    setSelectedRespUsers(users);
    setUserList(copyUserList);
  };

  const addOneUser = (value) => {
    let isExisted = false;
    const users = [...selectedRespUsers];
    let copyUserList = [...userList];
    users.forEach((user) => {
      if (user.uuid === value) {
        isExisted = true;
      }
    });
    if (!isExisted) {
      copyUserList = copyUserList.map((user) => {
        if (user.uuid === value) {
          users.push({ firstName: user.firstName, lastName: user.lastName, email: user.email, uuid: user.uuid });
          return Object.assign({}, user, { selected: true });
        }
        return user;
      });
    }
    setSelectedRespUsers(users);
    setUserList(copyUserList);
  };

  const removeUser = (uuid) => {
    const users = [...selectedRespUsers];
    const index = _.findIndex(selectedRespUsers, (o) => {
      return o.uuid === uuid;
    });
    let copyUserList = [...userList];
    copyUserList = copyUserList.map((user) => {
      if (user.uuid === uuid) {
        return Object.assign({}, user, { selected: false });
      }
      return user;
    });
    if (index > -1) {
      users.splice(index, 1);
    }
    setSelected('');
    setSelectedRespUsers(users);
    setUserList(copyUserList);
  };

  const setRequiredCol = (colIndex, selectedValue, mode) => {
    console.log('selectedValue', selectedValue);
    console.log('colDropDowns', colDropDowns);
    const cols = [...colDropDowns];
    let accLabels = [...accountLabels];
    let conLabels = [...contactLabels];
    cols[colIndex] =
      mode === 'add'
        ? { sValue: selectedValue.fieldLabel, sGroup: selectedValue.inGroup, dbColName: selectedValue.dbColName }
        : { sValue: '', sGroup: '', dbColName: '' };
    console.log('cols', cols);
    const tempArray = [];
    cols.forEach((k) => {
      if (k && k.sValue !== '') {
        tempArray.push({ value: k.sValue, group: k.sGroup });
      }
    });

    if (selectedValue.sGroup === 'account' || selectedValue.inGroup === 'account') {
      accLabels = accLabels.map((k) => {
        const index = _.findIndex(tempArray, (o) => {
          return o.group === 'account' && o.value === k.fieldLabel;
        });
        if (index > -1) {
          return Object.assign({}, k, { vis: false });
        }
        return Object.assign({}, k, { vis: true });
      });
      setAccountLabels(accLabels);
    } else {
      conLabels = conLabels.map((k) => {
        const index = _.findIndex(tempArray, (o) => {
          return o.group === 'contact' && o.value === k.fieldLabel;
        });
        if (index > -1) {
          return Object.assign({}, k, { vis: false });
        }
        return Object.assign({}, k, { vis: true });
      });

      setContactLabels(conLabels);
    }

    setColDropDowns(cols);
  };

  const submit = async () => {
    if (importMode === 'NONE') {
      return props.putError('Please select any one of the mode of import!');
    }
    const inserted = [];
    const checkedColumns = [];
    const headings = [];
    colDropDowns.forEach((k, i) => {
      if (k && k.sValue !== '') {
        headings.push(k.dbColName);
        inserted.push(k.sValue);
        checkedColumns.push(i);
      }
    });
    const isHasAccountName = _.intersection(['Company Name'], inserted).length > 0;
    const isHasContactFirstName = _.intersection(['Contact Firstname'], inserted).length > 0;
    const isHasContactLastName = _.intersection(['Contact Lastname'], inserted).length > 0;
    if (!isHasAccountName && !isHasContactFirstName && !isHasContactLastName) {
      return props.putError('Please select at least Company name OR Contact First Name, Last Name');
    } else if (!isHasContactFirstName && isHasContactLastName) {
      return props.putError('Contact First name is required');
    } else if (isHasContactFirstName && !isHasContactLastName) {
      return props.putError('Contact Last name is required');
    }

    const rowDataList = [];
    props.csvData.forEach((rowData, i) => {
      if (i !== 0) {
        const oneRowData = [];
        rowData.forEach((cellData, n) => {
          if (checkedColumns.indexOf(n) >= 0) {
            oneRowData.push(cellData);
          }
        });
        rowDataList.push(oneRowData);
      }
    });
    console.log('rowDataList', rowDataList);
    let userResponsible = '';
    if (selectedRespUsers.length === 0) {
      userResponsible = 'None';
    } else {
      selectedRespUsers.forEach((selectedUser) => {
        userResponsible += selectedUser.email + ',';
      });
      userResponsible = userResponsible.substring(0, userResponsible.length - 1);
    }
    if (importMode === 'CALL_LIST') {
      userResponsible = props.user.email;
    }
    console.log('userResponsible', userResponsible);

    const errorList = [];
    const validRowDataList = [];
    const accountIndex = headings.indexOf('accountName');
    const fNameIndex = headings.indexOf('contactFirstName');
    const leadProductGroup = headings.indexOf('leadproductgroup');
    const leadPriority = headings.indexOf('leadpriority');
    const lNameIndex = headings.indexOf('contactLastName');

    rowDataList.forEach((rowData, n) => {
      // let rowErrorString = '',
      //   isValidAccount = false,
      //   isValidContact = false,
      //   isValidProductGroup = false,
      //   isValidPriority = false;
      // if (accountIndex > -1 && rowData[accountIndex].length > 0) {
      //   isValidAccount = true;
      // }
      // if (fNameIndex > -1 && lNameIndex > -1 && rowData[fNameIndex].length > 0 && rowData[lNameIndex].length > 0) {
      //   isValidAccount = true;
      // }
      // if (!isValidAccount && !isValidContact) {
      //   rowErrorString =
      //     (rowErrorString ? ' ,' : '') +
      //     _l`Account name is missing` +
      //     ' ,' +
      //     _l`Contact First name is missing` +
      //     ' ,' +
      //     _l`Contact Last name is missing`;
      // }
      // if (rowErrorString.length > 0) {
      //   errorList.push(`Row (${n + 1}) : ${rowErrorString}`);
      // } else {
      //   rowData.forEach((cellData, index) => {
      //     if (cellData.length > 255 && rowData[index] !== 'contactNote' && rowData[index] !== 'accountNote') {
      //       rowData[index] = cellData.substring(0, 255);
      //     }
      //   });
      //   validRowDataList.push(rowData);
      // }
      validRowDataList.push(rowData);
    });
    console.log('validRowDataList', validRowDataList);
    console.log('headings', headings);

    const importDTO = {
      header: headings,
      detail: validRowDataList,
      userResponsible: userResponsible,
      fileName: props.fileName,
      timezone: getCurrentTimeZone(),
    };
    await validateImportData(importDTO);
    // if (importMode === 'ACCOUNT_CONTACT') {
    //   if (userResponsible === 'None') {
    //     const _modal = {
    //       status: true,
    //       title:
    //         _l`Please add at least one user for the import or the accounts and contacts want be displayed in any list.` +
    //         _l`Do you want to continue ?`,
    //       fnOk: () => {
    //         execImportContactAccount(importDTO);
    //       },
    //       fnCancel: () => {
    //         setConfirmModal({ status: false });
    //       },
    //     };
    //     setConfirmModal(_modal);
    //   } else {
    //     execImportContactAccount(importDTO);
    //   }
    // } else if (importMode === 'CALL_LIST') {
    //   const modalData = { ...callListBaseData };
    //   const callListType = _.upperCase(modalData.type);
    //   if (accountIndex < 0 && callListType === 'ACCOUNT') {
    //     return props.putError("Can't import Account Call lists without Accounts");
    //   }
    //   if ((fNameIndex < 0 || lNameIndex < 0) && callListType === 'CONTACT') {
    //     return props.putError("Can't import Contact Call lists without Contacts");
    //   }
    //   importDTO.callListImportDTO = { type: callListType };
    //   if (modalData.uuid) {
    //     importDTO.callListImportDTO.callListId = modalData.uuid;
    //   } else {
    //     importDTO.callListImportDTO.name = modalData.name;
    //     importDTO.callListImportDTO.ownerId = modalData.ownerId;
    //     importDTO.callListImportDTO.deadlineDate = new Date(modalData.deadlineDate);
    //   }
    //   importCallListFromWeb(importDTO);
    // } else {
    //   //import lead
    //   if (!leadBaseData.user) {
    //     const _modal = {
    //       status: true,
    //       title:
    //         _l`Please add a user as owner before saving if you don’t want your prospect to be sent to the unassigned list.` +
    //         _l`Do you want to continue ?`,
    //       fnOk: () => {
    //         execImportLead(importDTO);
    //       },
    //       fnCancel: () => {
    //         setConfirmModal({ status: false });
    //       },
    //     };
    //     setConfirmModal(_modal);
    //   } else {
    //     execImportLead(importDTO);
    //   }
    // }
  };

  const continueImport = () => {
    if (importMode === 'NONE') {
      return props.putError('Please select any one of the mode of import!');
    }
    const inserted = [];
    const checkedColumns = [];
    const headings = [];
    colDropDowns.forEach((k, i) => {
      if (k && k.sValue !== '') {
        headings.push(k.dbColName);
        inserted.push(k.sValue);
        checkedColumns.push(i);
      }
    });
    const isHasAccountName = _.intersection(['Company Name'], inserted).length > 0;
    const isHasContactFirstName = _.intersection(['Contact Firstname'], inserted).length > 0;
    const isHasContactLastName = _.intersection(['Contact Lastname'], inserted).length > 0;
    if (!isHasAccountName && !isHasContactFirstName && !isHasContactLastName) {
      return props.putError('Please select at least Company name OR Contact First Name, Last Name');
    } else if (!isHasContactFirstName && isHasContactLastName) {
      return props.putError('Contact First name is required');
    } else if (isHasContactFirstName && !isHasContactLastName) {
      return props.putError('Contact Last name is required');
    }

    const rowDataList = [];
    props.csvData.forEach((rowData, i) => {
      if (i !== 0) {
        const oneRowData = [];
        rowData.forEach((cellData, n) => {
          if (checkedColumns.indexOf(n) >= 0) {
            oneRowData.push(cellData);
          }
        });
        rowDataList.push(oneRowData);
      }
    });
    let userResponsible = '';
    if (selectedRespUsers.length === 0) {
      userResponsible = 'None';
    } else {
      selectedRespUsers.forEach((selectedUser) => {
        userResponsible += selectedUser.email + ',';
      });
      userResponsible = userResponsible.substring(0, userResponsible.length - 1);
    }
    if (importMode === 'CALL_LIST') {
      userResponsible = props.user.email;
    }

    const errorList = [];
    const validRowDataList = [];
    const accountIndex = headings.indexOf('accountName');
    const fNameIndex = headings.indexOf('contactFirstName');
    const leadProductGroup = headings.indexOf('leadproductgroup');
    const leadPriority = headings.indexOf('leadpriority');
    const lNameIndex = headings.indexOf('contactLastName');

    rowDataList.forEach((rowData, n) => {
      let rowErrorString = '',
        isValidAccount = false,
        isValidContact = false,
        isValidProductGroup = false,
        isValidPriority = false;
      if (accountIndex > -1 && rowData[accountIndex]?.length > 0) {
        isValidAccount = true;
      }
      if (fNameIndex > -1 && lNameIndex > -1 && rowData[fNameIndex]?.length > 0 && rowData[lNameIndex]?.length > 0) {
        isValidAccount = true;
      }
      if (!isValidAccount && !isValidContact) {
        rowErrorString =
          (rowErrorString ? ' ,' : '') +
          _l`Account name is missing` +
          ' ,' +
          _l`Contact First name is missing` +
          ' ,' +
          _l`Contact Last name is missing`;
      }
      if (rowErrorString.length > 0) {
        errorList.push(`Row (${n + 1}) : ${rowErrorString}`);
      } else {
        rowData.forEach((cellData, index) => {
          if(cellData?.trim() === '') {
            rowData[index] = null;
          }
          if (cellData?.length > 255 && rowData[index] !== 'contactNote' && rowData[index] !== 'accountNote') {
            rowData[index] = cellData?.substring(0, 255);
          }
        });
        validRowDataList.push(rowData);
      }
    });

    const importDTO = {
      header: headings,
      detail: validRowDataList,
      userResponsible: userResponsible,
      fileName: props.fileName,
      timezone: getCurrentTimeZone(),
    };
    if (importMode === 'ACCOUNT_CONTACT') {
      if (userResponsible === 'None') {
        const _modal = {
          status: true,
          title:
            _l`Please add at least one user for the import or the accounts and contacts want be displayed in any list.` +
            _l`Do you want to continue ?`,
          fnOk: () => {
            execImportContactAccount(importDTO);
          },
          fnCancel: () => {
            setConfirmModal({ status: false });
          },
        };
        setConfirmModal(_modal);
      } else {
        execImportContactAccount(importDTO);
      }
    } else if (importMode === 'CALL_LIST') {
      const modalData = { ...callListBaseData };
      const callListType = _.upperCase(modalData.type);
      if (accountIndex < 0 && callListType === 'ACCOUNT') {
        return props.putError("Can't import Account Call lists without Accounts");
      }
      if ((fNameIndex < 0 || lNameIndex < 0) && callListType === 'CONTACT') {
        return props.putError("Can't import Contact Call lists without Contacts");
      }
      importDTO.callListImportDTO = { type: callListType };
      if (modalData.uuid) {
        importDTO.callListImportDTO.callListId = modalData.uuid;
      } else {
        importDTO.callListImportDTO.name = modalData.name;
        importDTO.callListImportDTO.ownerId = modalData.ownerId;
        importDTO.callListImportDTO.deadlineDate = new Date(modalData.deadlineDate);
      }
      importCallListFromWeb(importDTO);
    } else {
      //import lead
      if (!leadBaseData.user) {
        const _modal = {
          status: true,
          title:
            _l`Please add a user as owner before saving if you don’t want your prospect to be sent to the unassigned list.` +
            _l`Do you want to continue ?`,
          fnOk: () => {
            execImportLead(importDTO);
          },
          fnCancel: () => {
            setConfirmModal({ status: false });
          },
        };
        setConfirmModal(_modal);
      } else {
        execImportLead(importDTO);
      }
    }
  };
  const handleOkSummary = () => {
    continueImport();
  };
  const handleCancleSummary = () => {
    setVisibleSummary(false);
    setErrorSummary([]);
    // setColDropDowns([]);
    // setSelectedRespUsers([]);
    // setSelected('');
    // clearProgress();
    // props.importedDone();
  };
  const validateImportData = async (importDTO) => {
    setImporting(true);
    // setTimeout(() => {
    //   setImporting(false);
    //   setVisibleSummary(true);
    //   clearProgress();
    // }, 5000);

    const { detail, header } = importDTO;
    let totalRow = detail.length;

    let errorArray = [];
    for (let index = 0; index < header.length; index++) {
      for (let i = 0; i < totalRow; i++) {
        if (!validateDataWithType(detail[i][index], getTypeOfColumn(header[index]))) {
          // let error = { ...errorSummary, [header[index]]: true };
          errorArray.push(header[index]);
        }
        if (header[index] === 'contactFirstName' || header[index] === 'contactLastName') {
          if (detail[i][index] === null || detail[i][index] === undefined || detail[i][index] === '') {
            errorArray.push(header[index]);
          }
        }
      }
      calculatingPercentImporting();
    }
    let newArrayAfterFilter = [...new Set(errorArray)];
    setErrorSummary(newArrayAfterFilter);
    setImporting(false);
    clearProgress();
    setVisibleSummary(true);
    console.log('SUMMARY:', errorSummary);
  };
  const validateDataWithType = (data, type) => {
    if (type === 'PHONE') {
      if (!data) return true;
      if(data && data.trim() === '') return true;
      return isPhone(data);
    } else if (type === 'NUMBER') {
      if (!data) return true;
      if(data && data.trim() === '') return true;
      return /^\d+$/.test(data);
    } else if (type === 'EMAIL') {
      if (!data) return true;
      if(data && data.trim() === '') return true;
      if (!isEmail(data)) {
        console.log('=======>Data error:', data);
      }
      return isEmail(data);
    } else if (type === 'DATE') {
      if (!data) return true;
      if(data && data.trim() === '') return true;
      let check = moment(data);
      return check.isValid();
      // return /^\d{1,4}[-\/\s]?\d{1,2}[-\/\s]?\d{1,4}$/gm.test(data);
    } else return true;
  };
  const getTypeOfColumn = (columnName) => {
    let field =
      accountLabels.filter((e) => e.dbColName === columnName)?.pop() ||
      contactLabels.filter((e) => e.dbColName === columnName)?.pop() ||
      leadLabels.filter((e) => e.dbColName === columnName)?.pop();
    return field?.fieldType || 'TEXT';
  };
  const getColumnNameByDbColumn = (columnName) => {
    let field =
      accountLabels.filter((e) => e.dbColName === columnName)?.pop() ||
      contactLabels.filter((e) => e.dbColName === columnName)?.pop() ||
      leadLabels.filter((e) => e.dbColName === columnName)?.pop();
    return field;
  };
  const getMessageErrorForColumn = (columnName) => {
    let dataType = getTypeOfColumn(columnName);
    switch (dataType) {
      case 'PHONE':
        return _l`contains invalid phone number format`;
      case 'NUMBER':
        return _l`contains non number formats`;
      case 'DATE':
        return _l`contains invalid format date` + `, supported formats YYYY-MM-DD, YYYY/MM/DD, YYYY MM DD`;
      case 'EMAIL':
        return _l`contains invalid email`;
    }
  };
  const execImportContactAccount = async (importDTO) => {
    calculatingPercentImporting();
    try {
      props.putSuccess('You will receive an email when the import is done');
      setColDropDowns([]);
      setSelectedRespUsers([]);
      setSelected('');
      clearProgress();
      props.importedDone();
      const res = await newApi.post({
        resource: `import-v3.0/import`,
        data: importDTO,
      });
      // const res = await api.post({
      //   resource: `import-v3.0/import`,
      //   data: importDTO,
      // });
      if (res) {
      }
    } catch (error) {
      props.putError(error);
    }
  };

  const importCallListFromWeb = async (importDTO) => {
    calculatingPercentImporting();
    try {
      props.putSuccess('You will receive an email when the import is done');
      setColDropDowns([]);
      setSelectedRespUsers([]);
      setSelected('');
      clearProgress();
      setCallListBaseData({});
      props.importedDone();
      const res = await newApi.post({
        resource: `import-v3.0/importCallList`,
        data: {
          callListImportDTO: importDTO.callListImportDTO,
          header: importDTO.header,
          detail: importDTO.detail,
          userResponsible: importDTO.userResponsible,
          fileName: importDTO.fileName,
        },
      });
      // const res = await api.post({
      //   resource: `import-v3.0/importCallList`,
      //   data: {
      //     callListImportDTO: importDTO.callListImportDTO,
      //     header: importDTO.header,
      //     detail: importDTO.detail,
      //     userResponsible: importDTO.userResponsible,
      //     fileName: importDTO.fileName,
      //   },
      // });
      if (res) {
      }
    } catch (error) {
      props.putError(error);
    }
  };

  const execImportLead = async (importDTO) => {
    calculatingPercentImporting();
    importDTO.leadImportDTO = {
      productList: [],
      deadlineDate: leadBaseData.deadlineDate ? new Date(leadBaseData.deadlineDate) : null,
      lineOfBusinessId: leadBaseData.lineOfBusiness ? leadBaseData.lineOfBusiness.uuid : null,
      status: leadBaseData.status || null,
      priority: leadBaseData.priority || null,
      ownerId: leadBaseData.user ? leadBaseData.user.uuid : null,
    };
    if (leadBaseData.productList && leadBaseData.productList.length > 0) {
      leadBaseData.productList.forEach((element) => {
        importDTO.leadImportDTO.productList.push(element.uuid);
      });
    }
    try {
      props.putSuccess('You will receive an email when the import is done');
      setColDropDowns([]);
      setSelectedRespUsers([]);
      setSelected('');
      setCallListBaseData({});
      clearProgress();
      setLeadBaseData({});
      props.importedDone();
      const res = await newApi.post({
        resource: `import-v3.0/import`,
        data: importDTO,
      });
      // const res = await api.post({
      //   resource: `import-v3.0/import`,
      //   data: importDTO,
      // });
      if (res) {
      }
    } catch (error) {
      props.putError(error);
    }
  };

  const openEditCallListModal = () => {
    const _modal = {
      status: true,
      type: 'EDIT_CALL',
      form: {
        ...callListBaseData,
      },
      fnOk: (data) => {
        console.log('call list', data);
        setCallListBaseData({ ...data });
        setAddModal({ status: false });
      },
      fnCancel: () => {
        setAddModal({ status: false });
      },
    };
    setAddModal(_modal);
  };

  const openEditLeadModal = () => {
    const _modal = {
      status: true,
      type: 'ADD_LEAD',
      form: {
        ...leadBaseData,
      },
      fnOk: (data) => {
        // console.log('lead base data', data);
        setLeadBaseData({ ...data });
        setAddModal({ status: false });
      },
      fnCancel: () => {
        setAddModal({ status: false });
      },
    };
    setAddModal(_modal);
  };

  const calculatingPercentImporting = () => {
    setImporting(false);
    calculatingPercentInterval = setInterval(() => {
      if (percentImporting + 2 <= 98) {
        setPercentImporting((percentImporting) => percentImporting + 2);
      } else {
        clearInterval(calculatingPercentInterval);
      }
    }, 1000);
  };

  const clearProgress = () => {
    setPercentImporting(100);
    clearInterval(calculatingPercentInterval);
    setImporting(false);
  };

  // console.log('selectedRespUsers', selectedRespUsers.length);
  // console.log('callListBaseData', callListBaseData);
  return (
    <>
      <div className={css.container}>
        <div className={cx(css.wrapper)}>
          <div className={css.step}>
            <span>1</span>
            <strong>{_l`Type`}</strong>
          </div>
          <div className={css.actionBtn}>
            <Button
              className={cx(css.btn, css.margin, { [css.btnActive]: importMode === 'ACCOUNT_CONTACT' })}
              onClick={() => changeImportMode('ACCOUNT_CONTACT')}
            >
              {_l`Companies & contacts`}
            </Button>
            <Button
              className={cx(css.btn, css.margin, { [css.btnActive]: importMode === 'CALL_LIST' })}
              onClick={() => changeImportMode('CALL_LIST')}
            >
              {_l`Call lists`}
            </Button>
            <Button
              className={cx(css.btn, { [css.btnActive]: importMode === 'LEAD' })}
              onClick={() => changeImportMode('LEAD')}
            >{_l`Prospects`}</Button>
          </div>
        </div>
        {importMode !== 'NONE' &&
          ((importMode === 'ACCOUNT_CONTACT' && selectedRespUsers.length >= 0) ||
            (importMode === 'CALL_LIST' && callListBaseData.name) ||
            (importMode === 'LEAD' && leadBaseData.priority)) && (
            <div className={cx(css.wrapper)} style={{ marginTop: '15' }}>
              <div className={cx(css.step, css.notBorderRight)}>
                <span>2</span>
                {importMode === 'ACCOUNT_CONTACT' && <strong>{_l`Responsible users`}</strong>}
                {importMode === 'CALL_LIST' && (
                  <strong>{callListBaseData.type === 'contact' ? 'Contact call list' : 'Company call list'}</strong>
                )}
              </div>
              {importMode === 'ACCOUNT_CONTACT' && (
                <div className={cx(css.actionBtn)}>
                  <div style={{ width: '30%' }}>
                    <UserDropDown
                      options={userList}
                      selectUser={selectUser}
                      selectedRespUsers={selectedRespUsers}
                      value={selected}
                    />
                  </div>
                  <div style={{ width: '70%', paddingLeft: '5', paddingRight: '5' }}>
                    {selectedRespUsers.map((user) => {
                      return (
                        <Label as="a" key={user.uuid} className={cx(css.btn, css.btnLabel)}>
                          {user.firstName + ' ' + user.lastName}
                          <Icon
                            name="delete"
                            onClick={() => {
                              // if(selectedRespUsers && selectedRespUsers.length <= 1) {
                              //   props.putError('A responsbile is required')
                              // } else {
                              removeUser(user.uuid);
                              // }
                            }}
                          />
                        </Label>
                      );
                    })}
                  </div>
                </div>
              )}
              {importMode === 'CALL_LIST' && (
                <div className={cx(css.actionBtn)}>
                  <div style={{ width: '90%' }}>
                    {/* {callListBaseData.type && (
                    <Label as="a" className={cx(css.btn, css.btnLabel)}>
                      {callListBaseData.type === 'contact' ? 'Contact call list' : 'Account call list'}
                    </Label>
                  )} */}
                    {callListBaseData.name && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {callListBaseData.name}
                      </Label>
                    )}
                    {callListBaseData.ownerName && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {callListBaseData.ownerName}
                      </Label>
                    )}
                    {callListBaseData.deadlineDate && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {moment(callListBaseData.deadlineDate).format('DD MMM YYYY')}
                      </Label>
                    )}
                  </div>
                  <div style={{ width: '10%' }}>
                    <MoreMenu className={css.bgMore} color="task">
                      <Menu.Item icon onClick={openEditCallListModal}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {_l`Update`}
                          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                        </div>
                      </Menu.Item>
                    </MoreMenu>
                  </div>
                </div>
              )}
              {importMode === 'LEAD' && (
                <div className={cx(css.actionBtn)}>
                  <div style={{ width: '90%' }}>
                    {leadBaseData.productGroup && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {leadBaseData.productGroup.text}
                      </Label>
                    )}
                    {leadBaseData.status && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {leadBaseData.status}
                      </Label>
                    )}
                    {leadBaseData.priority && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {leadBaseData.priority}
                      </Label>
                    )}
                    {leadBaseData.user && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {leadBaseData.user.name}
                      </Label>
                    )}
                    {leadBaseData.deadlineDate && (
                      <Label as="a" className={cx(css.btn, css.btnLabel)}>
                        {moment(callListBaseData.deadlineDate).format('DD MMM YYYY')}
                      </Label>
                    )}
                    {(leadBaseData.products ? leadBaseData.products : []).map((product, index) => {
                      return (
                        <Label as="a" className={cx(css.btn, css.btnLabel)} key={index}>
                          {product.text}
                        </Label>
                      );
                    })}
                  </div>
                  <div style={{ width: '10%' }}>
                    <MoreMenu className={css.bgMore} color="task">
                      <Menu.Item icon onClick={openEditLeadModal}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {_l`Update`}
                          <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                        </div>
                      </Menu.Item>
                    </MoreMenu>
                  </div>
                </div>
              )}
            </div>
          )}
        {/* selectedRespUsers.length > 0 || callListBaseData.name || leadBaseData.priority */}
        {importMode !== 'NONE' &&
          ((importMode === 'ACCOUNT_CONTACT' && selectedRespUsers.length >= 0) ||
            (importMode === 'CALL_LIST' && callListBaseData.name) ||
            (importMode === 'LEAD' && leadBaseData.priority)) && (
            <div className={cx(css.wrapper, css.notBorder)} style={{ marginTop: '15' }}>
              <div className={cx(css.step, css.notBorderRight, css.notCenter)}>
                <span>3</span>
                <strong>{_l`Column mapping`}</strong>
              </div>
              <div className={`${css.columMap}`}>
                <div className={cx(css.listItem, css.Title)}>
                  <div className={css.mapColumn}>
                    <span>{_l`File columns`}</span>
                  </div>
                  <div className={css.salesBox}>
                    <span>{_l`Salesbox data field`}</span>
                  </div>
                  <div className={css.columnActions}>
                    <div className={css.submit}>
                      <Button className={css.btn} onClick={submit}>{_l`Submit`}</Button>
                    </div>
                  </div>
                </div>
                <div className={`common-list-content ${css.vericalScroll}`} id="common-list-content">
                  {(props.csvData.length > 0 ? props.csvData[0] : []).map((header, index) => {
                    return (
                      <div className={`position-unset ${cx(css.listItem, css.Title)}`} key={index}>
                        <div className={css.mapColumn}>
                          <span>{header}</span>
                        </div>
                        <div className={cx(css.salesBox, css.dropdown)}>
                          {importMode !== 'NONE' && (
                            <SelectDropDown
                              accountLabels={accountLabels}
                              contactLabels={contactLabels}
                              leadLabels={leadLabels}
                              colDropDowns={colDropDowns[index]}
                              setRequiredCol={setRequiredCol}
                              columnIndex={index}
                              colId={`selectDropDown-${index}`}
                            />
                          )}
                        </div>
                        <div className={css.columnActions}>
                          <span />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
      </div>

      <AddToCallListModal
        visible={addModal.status && addModal.type === 'ADD_CALL'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
      />
      <EditCallListModal
        visible={addModal.status && addModal.type === 'EDIT_CALL'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
        form={addModal.form}
      />
      <CreatePipelineModal
        visible={addModal.status && addModal.type === 'ADD_LEAD'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
        form={addModal.form || {}}
      />
      <SyncCalendarModal
        visible={confirmModal.status}
        onClose={confirmModal.fnCancel}
        onDone={confirmModal.fnOk}
        title={confirmModal.title}
      />
      <ModalCommon
        visible={isImporting}
        title={_l`Importing`}
        size="tiny"
        cancelHidden={true}
        okLabel={_l`OK`}
        onClose={clearProgress}
        onDone={clearProgress}
      >
        <div className={css.importing}>
          <div>
            <p className={css.fTitleImporting}>
              {_l`Don't close the web browser or browser tab while importing`}
              <span className={css.lineImporting}></span>
            </p>
          </div>
          <p className={css.sTitleImporting}>{_l`Analysing your data...`}</p>
        </div>
        <Progress percent={percentImporting} indicating active />
      </ModalCommon>
      <ModalCommon
        visible={visibleSummary}
        title={_l`Summary`}
        size="tiny"
        okLabel={_l`Continue`}
        onClose={handleCancleSummary}
        onDone={handleOkSummary}
      >
        {errorSummary.length === 0 && <p>{_l`File scan is completed and no bad formats were found`}</p>}
        {errorSummary.length !== 0 && (
          <div>
            <p style={{ wordBreak: 'break-word' }}>
              {_l`The following columns include not support formats and any row including a bad format will be excluded from the import`}
            </p>
            {errorSummary.map((e) => {
              if (e === 'contactFirstName')
                return <p>{_l`Column` + ` ` + _l`Contact First Name` + `: ` + _l`contains some empty value`}</p>;
              if (e === 'contactLastName')
                return <p>{_l`Column` + ` ` + _l`Contact Last Name` + `: ` + _l`contains some empty value`}</p>;
              return (
                <p>
                  {getColumnNameByDbColumn(e)?.fieldLabel?.includes('Custom Field')
                    ? _l`Column` +
                      ` ${getColumnNameByDbColumn(e) &&
                        getColumnNameByDbColumn(e).fieldLabel}: ${getMessageErrorForColumn(e)}`
                    : _l`Column` +
                      ` ${getColumnNameByDbColumn(e) &&
                        _l.call(this, [getColumnNameByDbColumn(e).fieldLabel])}: ${getMessageErrorForColumn(e)}`}
                </p>
              );
            })}
          </div>
        )}
      </ModalCommon>
    </>
  );
};
export default connect(
  (state) => {
    return {
      users: state.entities.user,
      user: state.auth.user,
    };
  },
  {
    putError: NotificationActions.error,
    putSuccess: NotificationActions.success,
  }
)(ColumnMap);

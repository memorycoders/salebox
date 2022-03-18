/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import _l from 'lib/i18n';
import cx from 'classnames';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import IntergrationPane from '../IntergrationPane';
import api from '../../../lib/apiClient';
import css from './importContact.css';

import SyncCalendarModal from '../SyncCalendarModal';
import ContactsList from './ContactsList';
import Tasks from './Tasks';
import signInGoogle from '../../../../public/btnSignInGoogledark.png';
import iconGoogle from '../../../../public/g-logo.png';
import iconOffice from '../../../../public/icon_Office.png';
import iconMs from '../../../../public/msTeams_not_connect.png';
import { Endpoints, popupWindow } from '../../../Constants';
import ConfirmModal from '../../Common/Modal/ConfirmModal';
import { setStatusConnectTeams, setStorageIntegration } from '../../Common/common.actions';
import AppConfig from '../../../../config/app.config';
import ConnectGoogleModal from '../ConnectGoogleModal';
import ConnectDomainModal from '../ConnectGoogleModal/ConnectDomainModal';

addTranslations({
  'en-US': {
    Google: 'Google',
    'Link to sync contacts, tasks, appointments and documents':
      'Link to sync contacts, tasks, appointments and documents',
    Link: 'Link',
    'Import contacts': 'Import contacts',
    'Sync calendar': 'Sync calendar',
  },
});

const ImportContacts = (props) => {
  const [linked, setLinked] = useState({});

  const [googleStorage, setGoogleStorage] = useState({});
  const [isLinkedGoogle, setLinkedGoogle] = useState(false);
  const [office365Storage, setOffice365Storage] = useState({});
  const [isLinkedOffice365, setLinkedOffice365] = useState(false);

  const [msTeamStorage, setMsTeamStorage] = useState({});
  const [isLinkedTeam, setLinkedTeam] = useState(false);

  const [totalGoogleAppointments, setTotalGoogleAppointments] = useState();
  const [totalGoogleTasks, setTotalGoogleTasks] = useState();
  const [totalGoogleContacts, setTotalGoogleContacts] = useState(0);

  const [totalOffice365Appointments, setTotalOffice365Appointments] = useState();
  const [totalOffice365Tasks, setTotalOffice365Tasks] = useState();
  const [totalOffice365Contacts, setTotalOffice365Contacts] = useState(0);

  const [isOnSyncGmail, setOnSyncGmail] = useState(false);
  const [isOnSyncOffice365, setOnSyncOffice365] = useState(false);

  const [isOnCalendarGmail, setOnCalendarGmail] = useState(false);
  const [isOnContactGoogle, setOnContactGoogle] = useState(false);
  const [isOnTask, setOnTask] = useState(false);

  const [isOnCalendarOffice, setOncalendarOffice] = useState(false);
  const [isOnContactOffice, setOnContactOffice] = useState(false);

  const [showSyncCalendarModal, setShowSyncCalendarModal] = useState(false);
  const [showStartSyncCalendarModal, setShowStartCalendarModal] = useState(false);

  const [showUnsyncEmailModal, setShowUnsyncEmailModal] = useState(false);
  const [showSyncEmailModal, setShowSyncEmailModal] = useState(false);

  const [currentChanel, setChanel] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ status: false, title: '', fnOk: null, fnCancel: null });

  const [showContactsGoogle, setShowContactsGoogle] = useState(false);
  const [showUnsyncContactGoogleModal, setShowUnsyncContactGoogleModal] = useState(false);

  const [showTasks, setShowTasks] = useState(false);

  const [connectGoogleModal, setConnectGoogleModal] = useState(false);
  const [domainInstalledGoogleAddon, setDomainInstalledGoogleAddon] = useState(true);
  const { userStorageIntegrationDTOList, listPersonalStorage } = props;
  useEffect(() => {
    checkStorage(userStorageIntegrationDTOList);
  }, [userStorageIntegrationDTOList]);

  useEffect(() => {
    getListSyncStatistics();
  }, []);

  useEffect(() => {
    checkSyncGmailEmail();
    checkSyncO365();
  }, []);

  const handleOnDoneConnectGoogleModal = async (email) => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/storage/saveGoogleAccount`,
        query: {
          email: email,
        },
      });
      if (res) {
        setConnectGoogleModal(false);
        props.putSuccess('Please check your email to verify connection with Google account');
      }
    } catch (e) {
      if(e.message === 'THIS_GOOGLE_ACCOUNT_HAS_ALREADY_CONNECT_TO_ANOTHER_SALESBOX_ACCOUNT')
        props.putError('This Google account has already connected to another Salesbox account');
      if(e.message === 'EMAIL_NOT_MAPPING_WITH_VERIFIED_DOMAIN')
        props.putError('This Google account is not mapping with your connected domain. Please try again with other Google account')
    }
  };
  const handleOnDoneSaveDomain = async (domain) => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/googleAddon/saveDomainForEnterprise`,
        query: {
          domain: domain,
        },
      });
      if (res) {
        setVisibleModalConnectDomain(false);
        if(res.hasRedirect) {
          window.open('https://workspace.google.com/marketplace/app/salesbox_crm_workspace_sync/874458135332');
        } else {
          checkStorage(userStorageIntegrationDTOList);
        }
      }
    } catch (e) {
    }
  };
  const handleOnCloseConnectGoogleModal = () => {
    setConnectGoogleModal(false);
  };
  const checkStorage = async (userStorageIntegrationDTOList) => {
    console.log('checkStorage -> userStorageIntegrationDTOList', userStorageIntegrationDTOList);
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/googleAddon/checkDomainInstalled`,
        query: {
          connectedEmail: 'example@gmail.com',
        },
      });
      if (res === 'SUCCESS') {
        setDomainInstalledGoogleAddon(true);
      } else {
        setDomainInstalledGoogleAddon(false);
      }
    } catch (e) {}
    userStorageIntegrationDTOList.forEach(async (iter) => {
      if (iter.type === 'GOOGLE_WEB' || iter.type === 'GOOGLE_IOS') {
        setGoogleStorage({
          name: iter.name,
          email: iter.email,
          uuid: iter.uuid,
        });
        setLinkedGoogle(true);
        setLinked({ ...linked, CHANEL_GOOGLE: true });
        iter.syncStatusDTOList.forEach((sync) => {
          if (sync.type === 'APPOINTMENT' && sync.status) setOnCalendarGmail(true);
          if (sync.type === 'CONTACT' && sync.status) setOnContactGoogle(true);
          if (sync.type === 'TASK' && sync.status) setOnTask(true);
        });
      }
      if (iter.type === 'OFFICE365_WEB' || iter.type === 'OFFICE365_IOS') {
        setOffice365Storage({
          name: iter.name,
          email: iter.email,
          uuid: iter.uuid,
        });
        setLinkedOffice365(true);
        setLinked({ ...linked, CHANEL_OFFICE: true });
        iter.syncStatusDTOList.forEach((sync) => {
          if (sync.type === 'APPOINTMENT' && sync.status) setOncalendarOffice(true);
          if (sync.type === 'CONTACT' && sync.status) setOnContactOffice(true);
        });
      }
      if (iter.type === 'MS_TEAM') {
        setMsTeamStorage({
          name: iter.name,
          email: iter.email,
          uuid: iter.uuid,
        });
        setLinkedTeam(true);
      }
    });
  };

  // const listPersonalStorage = async () => {
  //   try {
  //     const res = await api.get({
  //       resource: 'enterprise-v3.0/storage/listPersonalStorage',
  //     });
  //     if (res && res.userStorageIntegrationDTOList) {
  //       checkStorage(res.userStorageIntegrationDTOList)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getListSyncStatistics = async () => {
    try {
      const res = await api.get({
        resource: 'enterprise-v3.0/storage/listSyncStatistics',
      });
      if (res && res.syncStatisticsDTOList) {
        res.syncStatisticsDTOList.forEach((iter) => {
          if (iter.type === 'GOOGLE') {
            setTotalGoogleAppointments(iter.totalAppointments);
            setTotalGoogleTasks(iter.totalTasks);
            setTotalGoogleContacts(iter.totalContacts);
          }
          if (iter.type === 'OFFICE365') {
            setTotalOffice365Appointments(iter.totalAppointments);
            setTotalOffice365Tasks(iter.totalTasks);
            setTotalOffice365Contacts(iter.totalContacts);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLinked = (chanel) => {
    return !!linked[chanel];
  };

  const checkSyncGmailEmail = async () => {
    try {
      const res = await api.get({
        resource: 'contact-v3.0/isSyncGmail',
      });
      if (res) {
        if (res === 'ON') setOnSyncGmail(true);
        if (res === 'OFF') setOnSyncGmail(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkSyncO365 = async () => {
    try {
      const res = await api.get({
        resource: 'contact-v3.0/isSyncO365',
      });
      if (res) {
        if (res === 'ON') setOnSyncOffice365(true);
        if (res === 'OFF') setOnSyncOffice365(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickSyncCalendar = (chanel, unlink) => {
    setChanel(chanel);
    if (unlink) {
      setShowSyncCalendarModal(true);
      return;
    }
    if (!isLinked(chanel)) {
      props.putError('Please link the service first');
    } else {
      setShowStartCalendarModal(true);
    }
  };

  const onCloseSyncCalendarModal = () => {
    setShowSyncCalendarModal(false);
  };

  const stopSyncGoogleCalendar = async () => {
    if (currentChanel === 'CHANEL_GOOGLE') {
      try {
        const res = await api.get({
          resource: 'appointment-v3.0/stopSyncGoogleCalendar',
        });
        if (res === 'SUCCESS') {
          setShowSyncCalendarModal(false);
          setOnCalendarGmail(false);
          switch (currentChanel) {
            case 'CHANEL_GOOGLE':
              setTotalGoogleAppointments(0);
              break;
            case 'CHANEL_OFFICE':
              setTotalOffice365Appointments(0);
          }
        }
      } catch (error) {
        props.putError('Failed to unsync calendar');
      }
    }
  };

  const startSyncCalendarModal = async () => {
    if (currentChanel === 'CHANEL_GOOGLE') {
      try {
        const res = await api.post({
          resource: 'appointment-v3.0/startSyncWithGoogle',
          data: { calendarEventDTOList: [] },
        });
        if (res === 'SUCCESS') {
          setShowSyncCalendarModal(false);
          setOnCalendarGmail(false);
          switch (currentChanel) {
            case 'CHANEL_GOOGLE':
              setShowStartCalendarModal(false);
              props.putSuccess('Congratulations, you just synchronized appointments.');
              // {_l.call(this, [contentErrorCfPass])}
              setOnCalendarGmail(true);
              listPersonalStorage();
              getListSyncStatistics();
              break;
            case 'CHANEL_OFFICE':
              setTotalOffice365Appointments(0);
          }
        }
      } catch (error) {
        props.putError('Failed to sync calendar');
      }
    }
  };

  const clickSyncGmailMail = (chanel) => {
    setChanel(chanel);
    if (isOnSyncGmail) {
      setShowUnsyncEmailModal(true);
    } else if (!isLinked(chanel)) {
      props.putError('Please link the service first');
    } else {
      setShowSyncEmailModal(true);
    }
  };

  const stopSyncGmail = async () => {
    try {
      const res = await api.get({
        resource: 'contact-v3.0/stopSyncGmail',
      });
      if (res && res === 'SUCCESS') {
        setShowUnsyncEmailModal(false);
        setOnSyncGmail(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startSyncWithGmail = async () => {
    try {
      const res = await api.post({
        resource: 'contact-v3.0/startSyncWithGmail',
        data: {},
      });
      if (res && res === 'SUCCESS') {
        setShowSyncEmailModal(false);
        setOnSyncGmail(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //import contacts
  const clickImportContact = (chanel, unlink) => {
    setChanel(chanel);
    if (unlink) {
      setShowUnsyncContactGoogleModal(true);
      return;
    }
    if (!isLinked(chanel)) {
      props.putError('Please link the service first');
    } else {
      setShowContactsGoogle(true);
      setShowTasks(false);
    }
  };

  const clickImportTask = async (chanel, unlink) => {
    setChanel(chanel);
    if (unlink) {
      const _modal = {
        status: true,
        title: _l`Do you want to unsync task?`,
        fnOk: async () => {
          try {
            const rs = await api.get({
              resource: `task-v3.0/stopSyncGoogleTask`,
            });
            if (rs) {
              setTotalGoogleTasks(0);
              setConfirmModal({ status: false });
              setOnTask(false);
            }
          } catch (error) {
            props.putError('Failed to sync calendar');
          }
        },
        fnCancel: () => {
          setConfirmModal({ status: false });
        },
      };
      setConfirmModal(_modal);
      return;
    }
    if (!isLinked(chanel)) {
      props.putError('Please link the service first');
    } else {
      setShowContactsGoogle(false);
      setShowTasks(true);
    }
  };

  const importContactSuccess = () => {
    getListSyncStatistics();
    if (currentChanel === 'CHANEL_OFFICE') {
      setOnContactOffice(true);
    } else {
      setOnContactGoogle(true);
    }
  };

  const importTaskSuccess = () => {
    getListSyncStatistics();
    setOnTask(true);
  };

  const stopSyncGoogleContact = async () => {
    try {
      let url = 'contact-v3.0/stopSyncGoogleContact';
      if (currentChanel === 'CHANEL_OFFICE') {
        url = 'contact-v3.0/stopSyncOffice365Contact';
      }
      const res = await api.get({
        resource: url,
      });
      if (res && res === 'SUCCESS') {
        setShowUnsyncContactGoogleModal(false);
        if (currentChanel === 'CHANEL_OFFICE') {
          setOnContactOffice(false);
        } else {
          setOnContactGoogle(false);
        }
        switch (currentChanel) {
          case 'CHANEL_GOOGLE':
            setTotalGoogleContacts(0);
            break;
          case 'CHANEL_OFFICE':
            setTotalOffice365Contacts(0);
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** check connect MSTeams */
  // const checkConnectMSTeams = async () => {
  //   try {
  //     const _status = await api.get({
  //       resource: `${Endpoints.Enterprise}/storage/isConnectToTeam`,
  //     });
  //     if(_status === 'ON') {
  //       setStatusConnectMSTeams(true)
  //       props.setStatusConnectTeams(true)
  //     } else {
  //       setStatusConnectMSTeams(false)
  //       props.setStatusConnectTeams(false)
  //     }
  //   }catch(ex){
  //   }
  // }

  const setConnectMSTeams = async (connected) => {
    try {
      // const rs = await api.get({
      //   resource: `${Endpoints.Enterprise}/storage/connectToTeams`,
      //   query: {
      //     connected: connected
      //   }
      // });
      // if(rs && rs === 'SUCCESS') {
      //   props.setStatusConnectTeams(connected)
      // }
      // setConfirmModal({status: false})

      props.setStatusConnectTeams(connected);
      setConfirmModal({ status: false });
    } catch (ex) {
      setConfirmModal({ status: false });
      props.putError('Failed to connect to Teams');
    }
  };

  const handleConnectTeamO365 = async () => {
    if (isLinkedOffice365) {
      const _modal = {
        status: true,
        title: _l`Do you want to unconnect to Teams?`,
        fnOk: () => {
          setConnectMSTeams(false);
        },
        fnCancel: () => {
          setConfirmModal({ status: false });
        },
      };
      if (props.isConnectMsTeams) {
        setConfirmModal(_modal);
      } else {
        _modal.title = _l`Do you want to connect to Teams?`;
        _modal.fnOk = () => {
          setConnectMSTeams(true);
        };
        setConfirmModal(_modal);
      }
    } else {
      props.putError('Please link the service first');
    }
  };

  const handleSyncEmailsOffice = async () => {
    if (isLinkedOffice365) {
      const _modal = {
        status: true,
        title: _l`Do you want to sync email?`,
        fnOk: () => {
          setSyncEmailsOffice(true);
        },
        fnCancel: () => {
          setConfirmModal({ status: false });
        },
      };
      if (!isOnSyncOffice365) {
        setConfirmModal(_modal);
      } else {
        _modal.title = _l`Do you want to unsync email?`;
        _modal.fnOk = () => {
          setSyncEmailsOffice(false);
        };
        setConfirmModal(_modal);
      }
    } else {
      props.putError('Please link the service first');
    }
  };

  const setSyncEmailsOffice = async (connected) => {
    if (connected) {
      try {
        const rs = await api.post({
          resource: `contact-v3.0/subOffice365MailWebhook`,
          data: {},
        });
        if (rs) {
          setConfirmModal({ status: false });
          setOnSyncOffice365(true);
        }
      } catch (error) {
        setConfirmModal({ status: false });
        props.putError('Failed to sync email');
      }
    } else {
      try {
        const rs = await api.delete({
          resource: `contact-v3.0/stopListenO365MailWebhook`,
          data: {},
        });
        if (rs) {
          setConfirmModal({ status: false });
          setOnSyncOffice365(false);
        }
      } catch (error) {
        setConfirmModal({ status: false });
        props.putError('Failed to sync email');
      }
    }
  };

  const handleSyncCalendarOffice = async () => {
    if (isLinkedOffice365) {
      const _modal = {
        status: true,
        title: _l`Do you want to sync calendar?`,
        fnOk: () => {
          setSyncCalendarOffice(true);
        },
        fnCancel: () => {
          setConfirmModal({ status: false });
        },
      };
      if (!isOnCalendarOffice) {
        setConfirmModal(_modal);
      } else {
        _modal.title = _l`Do you want to unsync calendar?`;
        _modal.fnOk = () => {
          setSyncCalendarOffice(false);
        };
        setConfirmModal(_modal);
      }
    } else {
      props.putError('Please link the service first');
    }
  };

  const setSyncCalendarOffice = async (connected) => {
    if (connected) {
      try {
        const rs = await api.post({
          resource: `appointment-v3.0/startSyncWithOffice365`,
          data: {
            calendarEventDTOList: [],
          },
        });
        if (rs) {
          setConfirmModal({ status: false });
          setOncalendarOffice(true);
          props.putSuccess('Congratulations, you just synchronized appointments.', 'Success');
          getListSyncStatistics();
          listPersonalStorage();
          props.setStorageIntegration({ isLinkedTeam, isOnCalendarOffice: connected, isLinkedOffice365 });
        }
      } catch (error) {
        setConfirmModal({ status: false });
        props.putError('Failed to sync calendar');
      }
    } else {
      try {
        const rs = await api.get({
          resource: `appointment-v3.0/stopSyncOffice365Calendar`,
          data: {},
        });
        if (rs) {
          setConfirmModal({ status: false });
          setOncalendarOffice(false);
          setTotalOffice365Appointments(0);
          props.setStorageIntegration({ isLinkedTeam, isOnCalendarOffice: connected, isLinkedOffice365 });
        }
      } catch (error) {
        setConfirmModal({ status: false });
        props.putError('Failed to sync calendar');
      }
    }
  };

  const unlinkOffice365 = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          const rs = await api.get({
            resource: `enterprise-v3.0/storage/personalStorageAccount/delete/${office365Storage.uuid}`,
          });
          if (rs) {
            setOffice365Storage({});
            setLinkedOffice365(false);
            setOnContactOffice(false);
            setOncalendarOffice(false);
            setOnSyncOffice365(false);
            setTotalOffice365Appointments(0);
            setTotalOffice365Contacts(0);
            setSyncEmailsOffice(false);

            setConfirmModal({ status: false });
            props.setStorageIntegration({ isLinkedTeam, isOnCalendarOffice, isLinkedOffice365: false });
          }
        } catch (error) {
          props.putError('Failed to sync calendar');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  };

  const linkGoogle = () => {
    // const popup = popupWindow('http://accounts.google.com/o/oauth2/auth?response_type=code&client_id=' +
    //   AppConfig.google_client_id + '&redirect_uri=' + AppConfig.redirect_uri + '&access_type=offline&approval_prompt=force&' +
    //   "&state=google&scope=profile " +
    //   "https://www.googleapis.com/auth/calendar " +
    //   "https://www.googleapis.com/auth/userinfo.email  " +
    //   'https://www.googleapis.com/auth/userinfo.profile ' +
    //   'https://www.googleapis.com/auth/gmail.readonly ' +
    //   'https://www.googleapis.com/auth/gmail.send ' +
    //   'https://www.googleapis.com/auth/gmail.labels', 'Google', 600, 600);
    //   const timer = setInterval(() => {
    //     if (!popup || popup.closed) {
    //       clearInterval(timer);
    //       listPersonalStorage();
    //     }
    //   }, 100)
    setConnectGoogleModal(true);
  };
  const unlinkGoogle = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unlink this account?`,
      fnOk: async () => {
        try {
          const rs = await api.get({
            resource: `enterprise-v3.0/storage/personalStorageAccount/delete/${googleStorage.uuid}`,
          });
          if (rs) {
            setGoogleStorage({});
            setLinkedGoogle(false);
            setOnCalendarGmail(false);
            setOnContactGoogle(false);
            setOnTask(false);
            setOnSyncGmail(false);

            setTotalGoogleAppointments(0);
            setTotalGoogleContacts(0);
            setTotalGoogleTasks(0);

            setConfirmModal({ status: false });
          }
        } catch (error) {
          props.putError('Failed to sync calendar');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  };

  const unlinkTeam = () => {
    const _modal = {
      status: true,
      title: _l`Do you want to unconnect to Teams?`,
      fnOk: async () => {
        try {
          const rs = await api.get({
            resource: `enterprise-v3.0/storage/personalStorageAccount/delete/${msTeamStorage.uuid}`,
          });
          if (rs) {
            setMsTeamStorage({});
            setLinkedTeam(false);

            setConfirmModal({ status: false });
            setConnectMSTeams(false);

            props.setStorageIntegration({ isLinkedTeam: false, isOnCalendarOffice, isLinkedOffice365 });
          }
        } catch (error) {
          props.putError('Failed to sync calendar');
        }
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
  };

  const linkOffice365 = () => {
    console.log('config', AppConfig.redirect_uri_office365);
    const popup = popupWindow(
      'https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&' +
        'client_id=' +
        AppConfig.office365_client_id +
        '&prompt=consent&redirect_uri=' +
        AppConfig.redirect_uri +
        '&state=office365&scope=offline_access ' +
        'https://graph.microsoft.com/v1.0/me/contacts ' +
        'https://graph.microsoft.com/v1.0/me/events ' +
        'https://outlook.office.com/contacts.readwrite ' +
        'https://outlook.office.com/calendars.readwrite ' +
        'https://outlook.office.com/Mail.Read ',
      'https://outlook.office.com/Mail.ReadWrite ',
      'https://outlook.office.com/Mail.Send ',
      'Office365',
      600,
      600
    );
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        listPersonalStorage();
        props.setStorageIntegration({ isLinkedTeam, isOnCalendarOffice, isLinkedOffice365: true });
      }
    }, 100);
  };

  const linkMsTeam = async () => {
    try {
      const res = await api.get({
        resource: `enterprise-v3.0/storage/checkMSTeamConnection`,
      });
      if (res) {
        if (res === 'ADMIN_EXISTED') {
          const popup = popupWindow(
            'https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&' +
              'client_id=' +
              AppConfig.msteam_client_id_admin_existed +
              '&prompt=consent&redirect_uri=' +
              AppConfig.redirect_uri +
              '&state=msTeamsMember&scope=offline_access ' +
              'https://graph.microsoft.com/v1.0/me/events ' +
              'https://outlook.office.com/contacts.readwrite ' +
              'https://outlook.office.com/calendars.readwrite ' +
              'https://outlook.office.com/Mail.Read ',
            'https://outlook.office.com/Mail.ReadWrite ',
            'https://outlook.office.com/Mail.Send ',
            'https://outlook.office.com/ChannelMessage.Send',
            'https://outlook.office.com/ChannelMessage.Edit',
            'Office365',
            600,
            600
          );
          const timer = setInterval(() => {
            if (!popup || popup.closed) {
              clearInterval(timer);
              listPersonalStorage();
              props.setStorageIntegration({ isLinkedTeam: true, isOnCalendarOffice, isLinkedOffice365 });
            }
          }, 100);
        } else if (res === 'NO_ADMIN') {
          const popup = popupWindow(
            'https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&' +
              'client_id=' +
              AppConfig.msteam_client_id_no_admin +
              '&prompt=consent&redirect_uri=' +
              AppConfig.redirect_uri +
              '&state=msTeams&scope=offline_access ' +
              'https://graph.microsoft.com/v1.0/me/contacts ' +
              'https://graph.microsoft.com/v1.0/me/events ' +
              'https://outlook.office.com/contacts.readwrite ' +
              'https://outlook.office.com/calendars.readwrite ' +
              'https://outlook.office.com/Mail.Read ',
            'https://outlook.office.com/Mail.ReadWrite ',
            'https://outlook.office.com/Mail.Send ',
            'https://outlook.office.com/GroupMember.ReadWrite.All ' +
              'https://outlook.office.com/Group.ReadWrite.All ' +
              'https://outlook.office.com/Directory.ReadWrite.All ' +
              'https://outlook.office.com/Directory.AccessAsUser.All',
            'https://outlook.office.com/ChannelMessage.Send',
            'https://outlook.office.com/ChannelMessage.Reall.All',
            'https://outlook.office.com/ChannelMessage.Edit',
            'https://outlook.office.com/CallRecords.Read.All',
            'https://outlook.office.com/User.Invite.All',
            'Office365',
            600,
            600
          );
          const timer = setInterval(() => {
            if (!popup || popup.closed) {
              clearInterval(timer);
              listPersonalStorage();
              props.setStorageIntegration({ isLinkedTeam: true, isOnCalendarOffice, isLinkedOffice365 });
            }
          }, 100);
        }
      }
    } catch (e) {}
  };

  const [visibleModalConnectDomain, setVisibleModalConnectDomain] = useState(false);

  const openModalConnectDomain = () => {
    setVisibleModalConnectDomain(true);
  };
  return (
    <>
      <IntergrationPane padded title={_l`Sync emails and calendars`}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3} style={{ paddingLeft: '8px' }}>
                    <img src={iconGoogle} width={35} />
                  </Grid.Column>
                  <Grid.Column width={13} style={{ paddingLeft: '8px' }}>
                    <p className={css.txtTitle}>{_l`Google`}</p>
                    {
                      domainInstalledGoogleAddon &&  <>
                      <p>{_l`Sync calendar`}</p>
                      <p>{_l`Sync emails`}</p>
                      {googleStorage && googleStorage.email ? (
                      <p>
                        {_l`Connected account`}: {googleStorage.email}
                      </p>
                    ) : (
                      ''
                    )}
                      </>
                    }
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    {!domainInstalledGoogleAddon ? (
                      <a
                        className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSize, css.btnPrimary)}
                        onClick={openModalConnectDomain}
                        // href="https://workspace.google.com/marketplace/app/salesbox_crm_workspace_sync/874458135332"
                        // target="_blank"
                      >{_l`Connect your domain`}</a>
                    ) : (
                      <>
                        {isLinkedGoogle ? (
                          <a
                            onClick={unlinkGoogle}
                            className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSucces)}
                          >
                            {_l`Unlink`}
                          </a>
                        ) : (
                          <a
                            onClick={() => !isLinkedOffice365 && linkGoogle()}
                            className={cx(
                              css.btn,
                              css.btnDefault,
                              css.btnBlock,
                              { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                              { [css.btnDisable]: !isLinkedGoogle && isLinkedOffice365 }
                            )}
                          >{_l`Link`}</a>
                          // <img onClick={() => !isLinkedOffice365 && linkGoogle()} src={signInGoogle} style={{marginBottom: 8, cursor:'pointer', width:'100%'}}/>
                        )}
                        {isOnCalendarGmail ? (
                          <a
                            className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSize, css.btnSucces)}
                            onClick={() => clickSyncCalendar('CHANEL_GOOGLE', true)}
                          >{_l`Unsync`}</a>
                        ) : (
                          <a
                            className={cx(
                              css.btn,
                              css.btnDefault,
                              css.btnBlock,
                              { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                              { [css.btnDisable]: !isLinkedGoogle && isLinkedOffice365 },
                              { [css.btnDanger]: isLinkedGoogle }
                            )}
                            onClick={() => clickSyncCalendar('CHANEL_GOOGLE', false)}
                          >
                            {_l`Sync`}
                          </a>
                        )}
                        {isOnSyncGmail ? (
                          <a
                            className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSucces)}
                            onClick={() => clickSyncGmailMail('CHANEL_GOOGLE')}
                          >{_l`Unsync`}</a>
                        ) : (
                          <a
                            className={cx(
                              css.btn,
                              css.btnDefault,
                              css.btnBlock,
                              { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                              { [css.btnDisable]: !isLinkedGoogle && isLinkedOffice365 },
                              { [css.btnDanger]: isLinkedGoogle }
                            )}
                            onClick={() => clickSyncGmailMail('CHANEL_GOOGLE')}
                          >
                            {_l`Sync`}
                          </a>
                        )}
                      </>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3} style={{ paddingLeft: '8px' }}>
                    <img src={iconOffice} width={35} />
                  </Grid.Column>
                  <Grid.Column width={13} style={{ paddingLeft: '8px' }}>
                    <p className={css.txtTitle}>{_l`Office 365`}</p>
                    <p>{_l`Sync calendar`}</p>
                    <p>{_l`Sync emails`}</p>
                    {office365Storage && office365Storage.email ? (
                      <p>
                        {_l`Connected account`}: {office365Storage.email}
                      </p>
                    ) : (
                      ''
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    {isLinkedOffice365 ? (
                      <a onClick={unlinkOffice365} className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSucces)}>
                        {_l`Unlink`}
                      </a>
                    ) : (
                      <a
                        onClick={() => !isLinkedGoogle && linkOffice365()}
                        className={cx(
                          css.btn,
                          css.btnDefault,
                          css.btnBlock,
                          { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                          { [css.btnDisable]: isLinkedGoogle && !isLinkedOffice365 }
                        )}
                      >{_l`Link`}</a>
                    )}
                    {/* {isOnContactOffice ? (
                      <a
                        onClick={() => clickImportContact('CHANEL_OFFICE', true)}
                        className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSize, css.btnSucces)}
                      >
                        {_l`Unsync contacts`}
                      </a>
                    ) : (
                      <a
                        onClick={() => clickImportContact('CHANEL_OFFICE', false)}
                        className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSize, css.btnPrimary)}
                      >
                        {_l`Import contacts`}
                      </a>
                    )} */}
                    <a
                      onClick={handleSyncCalendarOffice}
                      className={cx(
                        css.btn,
                        css.btnDefault,
                        css.btnBlock,
                        css.btnSize,
                        { [css.btnSucces]: isOnCalendarOffice },
                        { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                        { [css.btnDisable]: isLinkedGoogle && !isLinkedOffice365 },
                        { [css.btnDanger]: isLinkedOffice365 && !isOnCalendarOffice }
                      )}
                    >
                      {isOnCalendarOffice ? _l`Unsync` : _l`Sync`}
                    </a>
                    {isOnSyncOffice365 ? (
                      <a
                        onClick={() => handleSyncEmailsOffice()}
                        className={cx(css.btn, css.btnDefault, css.btnBlock, css.btnSucces)}
                      >{_l`Unsync`}</a>
                    ) : (
                      <a
                        onClick={() => handleSyncEmailsOffice()}
                        className={cx(
                          css.btn,
                          css.btnDefault,
                          css.btnBlock,
                          { [css.btnPrimary]: !isLinkedGoogle && !isLinkedOffice365 },
                          { [css.btnDisable]: isLinkedGoogle && !isLinkedOffice365 },
                          { [css.btnDanger]: isLinkedOffice365 }
                        )}
                      >
                        {_l`Sync`}
                      </a>
                    )}
                  </Grid.Column>
                  {/* <Grid.Column width={8}>
                    <p className={css.txtBold}>
                      {_l`Imported contacts`}: {totalOffice365Contacts}
                    </p>
                    <p className={css.txtBold}>
                      {_l`Synced appointments`}: {totalOffice365Appointments}
                    </p>
                  </Grid.Column> */}
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3} style={{ paddingLeft: '8px' }}>
                    <img src={iconMs} width={35} />
                  </Grid.Column>
                  <Grid.Column width={13} style={{ paddingLeft: '8px' }}>
                    <p className={css.txtTitle} style={{ marginBottom: '2px' }}>{_l`Microsoft Teams`}</p>
                    <p
                      className={css.txtContent}
                    >{_l`Add + start Teams meetings from Salesbox requires that Office 365 is connected and the calendar sync is turned on.`}</p>
                    {msTeamStorage && msTeamStorage.email ? (
                      <p>
                        {_l`Connected account`}: {msTeamStorage.email}
                      </p>
                    ) : (
                      ''
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={6}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <a
                      className={`${cx(css.btn, css.btnDefault, css.btnBlock, css.btnSize, css.btnPrimary)} ${
                        isLinkedTeam ? css.btnSucces : ''
                      }`}
                      onClick={() => (isLinkedTeam ? unlinkTeam() : linkMsTeam())}
                    >
                      {isLinkedTeam ? _l`Unlink` : _l`Link`}
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            {showContactsGoogle && <ContactsList importContactSuccess={importContactSuccess} chanel={currentChanel} />}
            {showTasks && <Tasks importTaskSuccess={importTaskSuccess} />}
          </Grid.Row>
        </Grid>
      </IntergrationPane>

      <SyncCalendarModal
        visible={showSyncCalendarModal}
        onClose={onCloseSyncCalendarModal}
        onDone={stopSyncGoogleCalendar}
        title={_l`Do you want to unsync calendar?`}
      />
      <SyncCalendarModal
        visible={showStartSyncCalendarModal}
        onClose={() => setShowStartCalendarModal(false)}
        onDone={startSyncCalendarModal}
        title={_l`Do you want to sync calendar?`}
      />
      <SyncCalendarModal
        visible={showUnsyncEmailModal}
        onClose={() => setShowUnsyncEmailModal(false)}
        onDone={stopSyncGmail}
        title={_l`Do you want to unsync email?`}
      />
      <SyncCalendarModal
        visible={showSyncEmailModal}
        onClose={() => setShowSyncEmailModal(false)}
        onDone={startSyncWithGmail}
        title={_l`Do you want to sync email?`}
      />
      <SyncCalendarModal
        visible={showUnsyncContactGoogleModal}
        onClose={() => setShowUnsyncContactGoogleModal(false)}
        onDone={stopSyncGoogleContact}
        title={_l`Do you want to unsync contact?`}
      />
      <ConfirmModal
        visible={confirmModal.status}
        fnOk={confirmModal.fnOk}
        fnCancel={confirmModal.fnCancel}
        title={confirmModal.title}
      />

      <ConnectGoogleModal
        visible={connectGoogleModal}
        onClose={handleOnCloseConnectGoogleModal}
        onDone={handleOnDoneConnectGoogleModal}
      />
      <ConnectDomainModal
        visible={visibleModalConnectDomain}
        onClose={() => setVisibleModalConnectDomain(false)}
        onDone={handleOnDoneSaveDomain}
      />
    </>
  );
};
export default connect(
  (state) => ({
    isConnectMsTeams: state.common.isConnectMsTeams,
  }),
  {
    putError: NotificationActions.error,
    putSuccess: NotificationActions.success,
    setStatusConnectTeams: setStatusConnectTeams,
    setStorageIntegration,
  }
)(ImportContacts);

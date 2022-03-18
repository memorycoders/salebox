import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from '../Settings.css';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import { getUser } from '../../Auth/auth.selector';
import * as NotificationActions from '../../Notification/notification.actions';

const AutomaticReminder = ({ currentUser, notiError, notiSuccess }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    fetchValueAutomaticReminder();
  }, []);

  const fetchValueAutomaticReminder = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/user/setting/getByKey`,
        query: {
          key: 'AUTOMATIC_REMINDER',
        },
      });
      if (res) {
        setValue(res.value);
      }
    } catch (error) {}
  };

  const handleChangeDropdown = async (e, { value }) => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/user/setting/update`,
        query: {
          key: 'AUTOMATIC_REMINDER',
          value: value,
          uuid: currentUser?.uuid,
        },
      });
      if (res === 'SUCCESS') {
        setValue(value);
        notiSuccess('Updated', '', 2000);
      }
    } catch (error) {
      notiError('Oh, something went wrong');
    }
  };
  let optionDropdown = [
    {
      value: 'ON',
      text: _l`On`,
    },
    {
      value: 'OFF',
      text: _l`Off`,
    },
  ];
  return (
    <div>
      <div className={css.inputLabelAutomaticReminder1}>
        {_l`Automatic reminders`}
        <Popup
          hoverable
          trigger={<div className={`${css.infoIcon_auto}`} />}
          style={{
            fontSize: 11,
            fontWeight: '400',
            width: '100% !important',
            wordWrap: 'break-word !important',
          }}
          content={_l`Turn on/off Salesbox's smart reminders. (Salesbox automatically creates a reminder to focus on the next stage if to much time has passed and to little progress has been made on a deal. The time passed is compared to the normal sales cycle for the responsible user.)`}
        /></div>
      <div className={css.type1} style={{ width: '150px ', padding: 2 }}>

        {/* <Dropdown
          id="automaticReminderDropdown"
          type="text"
          value={value}
          fluid
          selection
          onChange={handleChangeDropdown}
          options={optionDropdown}
        /> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: getUser(state),
});

const mapDispatchToProps = {
  notiSuccess: NotificationActions.success,
  notiError: NotificationActions.error,
};

export default connect(mapStateToProps, mapDispatchToProps)(AutomaticReminder);

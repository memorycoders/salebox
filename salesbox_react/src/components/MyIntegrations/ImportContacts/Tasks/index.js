/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import OrganisationDropdown from 'components/Organisation/OrganisationDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import ContactDropdown from 'components/Contact/ContactDropdown';
import api from '../../../../lib/apiClient';
import _l from 'lib/i18n';
import css from '../../../CompanySettings/DefaultValues/SaleProcess/SaleProcess.css';
import otherCss from '../importContact.css';
import localCss from './tasks.css';

const Tasks = (props) => {
  const [tasks, setTask] = useState([]);
  useEffect(() => {
    loadIntegrationContact();
  }, []);

  const loadIntegrationContact = async () => {
    try {
      const res = await api.get({
        resource: 'task-v3.0/getGoogleTasks',
      });
      if (res && res.googleTaskDTOList) {
        const newArrays = [...res.googleTaskDTOList];
        setTask(newArrays);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedTask = (task, index) => {
    task.selected = !task.selected;
    const newContacts = [...tasks.slice(0, index), task, ...tasks.slice(index + 1)];
    setTask(newContacts);
  };

  const handleFocusChange = (data, task, index) => {
    task.focusWorkData = { uuid: data.value };
    const newContacts = [...tasks.slice(0, index), task, ...tasks.slice(index + 1)];
    setTask(newContacts);
  };

  const onChangeOrganisation = (data, task, index) => {
    task.organisationId = data.value;
    const newContacts = [...tasks.slice(0, index), task, ...tasks.slice(index + 1)];
    setTask(newContacts);
  };

  const handleContactChange = (data, task, index) => {
    task.contactId = data.value;
    const newContacts = [...tasks.slice(0, index), task, ...tasks.slice(index + 1)];
    setTask(newContacts);
  };

  const importTask = async () => {
    const taskList = tasks.filter((ta) => {
      return ta.selected;
    });
    let hasError = false;

    taskList.forEach((task) => {
      if (!task.focusWorkData) {
        hasError = true;
      }
      delete task.organisation;
      delete task.contact;
      delete task.focus;
      delete task.selected;
    });

    if (taskList.length === 0) {
      props.putError(_l`No task selected'`);
    }

    if (hasError) {
      props.putError(_l`No task selected'`);
      return;
    }

    try {
      const res = await api.post({
        resource: 'task-v3.0/importGoogleTask',
        data: {
          googleTaskDTOList: taskList,
        },
      });
      if (res) {
        const mes = _l`Congratulations, you just imported ${taskList.length} tasks`;
        props.putSuccess(mes, _l`Success`);
        loadIntegrationContact();
        props.importTaskSuccess();
      }
    } catch (error) {
      props.putError(_l`Failed to import tasks`);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={localCss.header}>
        <strong>{_l`Sync contact`}</strong>
        <span>
          {_l`The import includes photos, first & last name, phone, email and company (account).Once imported Salesbox syncs the contact 1-way with`}
          {` `}
          {_l`Google`}
        </span>
      </div>
      <div className={localCss.header}>
        <a
          className={cx(otherCss.btn, otherCss.btnDefault, otherCss.btnBlock, otherCss.btnSucces, localCss.btnWith)}
          onClick={() => importTask()}
        >{_l`Import`}</a>
      </div>
      <div className={localCss.main}>
        <div className={cx(localCss.listItem, localCss.Title)}>
          <div className={localCss.import}>
            <span>{_l`Sync`}({tasks.length})</span>
          </div>
          <div className={localCss.title}>
            <span>{_l`Title`}</span>
          </div>
          <div className={localCss.time}>
            <span>{_l`Time`}</span>
          </div>
          <div className={localCss.focus}>
            <span>{_l`Focus`}</span>
          </div>
          <div className={localCss.suggested}>
            <span>{_l`Selected account`}</span>
          </div>
          <div className={localCss.suggested}>
            <span>{_l`Selected contact`}</span>
          </div>
        </div>
        <div className={localCss.mainContent} id="import-contacts-list">
          {tasks.map((t, index) => {
            return (
              <div className={cx(localCss.listItem)} key={t.googleId}>
                <div className={localCss.import}>
                  <div className={t.selected ? css.setDone : css.notSetasDone} onClick={() => selectedTask(t, index)}>
                    <div />
                  </div>
                </div>
                <div className={localCss.title}>
                  <span>{t.title}</span>
                </div>
                <div className={localCss.time}>
                  <span>{t.dueDate}</span>
                </div>
                <div className={localCss.focus}>
                  {!t.selected && _l`Set focus`}
                  {t.selected && (
                    <FocusDropdown
                      colId="import-form-focus"
                      focusType="PROSPECT"
                      size="small"
                      value={t.focusWorkData && t.focusWorkData.uuid}
                      onChange={(e, data) => handleFocusChange(data, t, index)}
                      // errors={errors}
                      addLabel={_l`Add focus`}
                    />
                  )}
                </div>
                <div className={localCss.suggested}>
                  {!t.selected && _l`Please select account`}
                  {t.selected && (
                    <OrganisationDropdown
                      colId="import-contact-organisation"
                      value={t.organisationId || null}
                      onChange={(e, data) => onChangeOrganisation(data, t, index)}
                      addLabel='Add company'
                    />
                  )}
                </div>
                <div className={localCss.suggested}>
                  {!t.selected && _l`Please select contact`}
                  {t.selected && (
                    <ContactDropdown
                      colId="import-sync-task"
                      organisationId={t.organisationId || null}
                      value={t.contactId}
                      onChange={(e, data) => handleContactChange(data, t, index)}
                      placeholder={' '}
                      addLabel={_l`Add contact`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default connect(null, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(Tasks);

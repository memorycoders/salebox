/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import OrganisationDropdown from 'components/Organisation/OrganisationDropdown';
import api from '../../../../lib/apiClient';
import _l from 'lib/i18n';
import css from '../../../CompanySettings/DefaultValues/SaleProcess/SaleProcess.css';
import localCss from './ContactList.css';
import otherCss from '../importContact.css';

const ContactsList = (props) => {
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(props.chanel === 'CHANEL_GOOGLE' ? 1 : 0);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadIntegrationContact();
  }, [pageIndex]);

  const loadIntegrationContact = async () => {
    let url = 'contact-v3.0/getGoogleContactList';
    if (props.chanel === 'CHANEL_OFFICE') {
      url = 'contact-v3.0/getOffice365ContactList';
    }
    try {
      const res = await api.get({
        resource: url,
        query: {
          pageIndex,
          pageSize,
        },
      });
      if (res && res.contactIntegrationDTOList) {
        const newArrays = [...contacts, ...res.contactIntegrationDTOList];
        setContacts(newArrays);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onScroll = () => {
    const menu = document.getElementById('import-contacts-list');
    if (menu.offsetHeight + menu.scrollTop === menu.scrollHeight) {
      setPageIndex(pageSize + 1);
    }
  };

  const selectContact = async (contact, index) => {
    const emailList = [];
    contact.additionalEmailList.forEach((item) => {
      emailList.push(item.value);
    });
    const getSuggestedAccountDTO = {
      organisationName: contact.organisationName,
      emailList: emailList,
      suggestedOrganisationDTOList: [],
    };
    if (contact.selected) {
      contact.selected = false;
    } else {
      contact.selected = true;
      try {
        const res = await api.post({
          resource: 'contact-v3.0/getSuggestedAccountList',
          data: getSuggestedAccountDTO,
        });
        if (res && res.suggestedOrganisationDTOList) {
          contact.suggestedAccountList = res.suggestedOrganisationDTOList;
          contact.selected = true;
          if (contact.suggestedAccountList.length >= 1) {
            contact.organisationSelected = res.suggestedOrganisationDTOList[0];
          } else {
            contact.organisationSelected = {};
          }
          const newContacts = [...contacts.slice(0, index), contact, ...contacts.slice(index + 1)];
          setContacts(newContacts);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChangeOrganisation = (e, data, contact, index) => {
    contact.organisationSelected.name = data.text;
    contact.organisationSelected.uuid = data.value;
    const newContacts = [...contacts.slice(0, index), contact, ...contacts.slice(index + 1)];
    setContacts(newContacts);
  };

  const importContact = async () => {
    const listImport = [];
    contacts.map((contact) => {
      if (contact.selected) {
        const _contact = _.clone(contact);
        if (_contact.organisationSelected) {
          if (_contact.organisationSelected.uuid) {
            _contact.organisationId = _contact.organisationSelected.uuid;
          }
          if (_contact.organisationSelected.name) {
            _contact.organisationName = _contact.organisationSelected.name;
          }
        }
        delete _contact.selected;
        delete _contact.organisationSelected;
        delete _contact.suggestedAccountList;
        listImport.push(_contact);
      }
    });
    if (listImport.length == 0) {
      props.putError(_l`No contact selected`);
      return;
    }
    try {
      let url = 'contact-v3.0/importGoogleContact';
      if (props.chanel === 'CHANEL_OFFICE') {
        url = 'contact-v3.0/importOffice365Contact';
      }
      const res = await api.post({
        resource: url,
        data: {
          contactIntegrationDTOList: listImport,
        },
      });
      if (res && res === 'SUCCESS') {
        const mes = _l`Congratulations, you just imported ${listImport.length} contacts.`;
        props.putSuccess(mes, _l`Success`);
        setContacts([]);
        setPageIndex(1);
        loadIntegrationContact();
        props.importContactSuccess();
      }
    } catch (error) {
      props.putError(_l`Failed to import contacts`);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={localCss.header}>
        <strong>{_l`Sync contact`}</strong>
        <span>
          {_l`The import includes photos, first & last name, phone, email and company (account).Once imported Salesbox syncs the contact 1-way with`}
          {` `}
          {props.chanel === 'CHANEL_OFFICE' ? _l`Office` : 'Google'}
        </span>
      </div>
      <div className={localCss.header}>
        <a
          className={cx(otherCss.btn, otherCss.btnDefault, otherCss.btnBlock, otherCss.btnSucces, localCss.btnWith)}
          onClick={importContact}
        >{_l`Import`}</a>
      </div>
      <div className={localCss.main}>
        <div className={cx(localCss.listItem, localCss.Title)}>
          <div className={localCss.import}>
            <span>
              {_l`Import`}({contacts.length})
            </span>
          </div>
          <div className={localCss.contact}>
            <span>{_l`Contact`}</span>
          </div>
          <div className={localCss.email}>
            <span>{_l`Email`}</span>
          </div>
          <div className={localCss.suggested}>
            <span>{_l`Suggested account`}</span>
          </div>
        </div>
        <div className={localCss.mainContent} onScroll={onScroll} id="import-contacts-list">
          {contacts.map((c, index) => {
            return (
              <div className={cx(localCss.listItem)} key={index}>
                <div className={localCss.import}>
                  <div className={c.selected ? css.setDone : css.notSetasDone} onClick={() => selectContact(c, index)}>
                    <div />
                  </div>
                </div>
                <div className={localCss.contact}>{c.fullName}</div>
                <div className={localCss.email}>{c.email}</div>
                <div className={localCss.suggested}>
                  {!c.selected && _l`Please select account`}
                  {c.selected && (
                    <OrganisationDropdown
                      colId="import-contact-organisation"
                      // className={cssForm.dropdownForm}
                      value={c.organisationSelected && c.organisationSelected.uuid ? c.organisationSelected.uuid : null}
                      onChange={(e, data) => onChangeOrganisation(e, data, c, index)}
                      width={8}
                      addLabel='Add company'
                      text={c.organisationSelected && c.organisationSelected.name}
                      style={{ border: 'none !important' }}
                      className={localCss.dropdown}
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
})(ContactsList);

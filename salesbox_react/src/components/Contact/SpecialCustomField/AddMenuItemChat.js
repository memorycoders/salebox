import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Popup, Menu, Image } from 'semantic-ui-react';
import localCss from './SpecialCustomField.css';
import css from '../../CreateMenu/CreateMenu.css';
import _l from 'lib/i18n';
import taskAdd from '../../../../public/Tasks.svg';
import appointmentAdd from '../../../../public/Appointments.svg';
import unqualifiedAdd from '../../../../public/Unqualified_deals.svg';
import qualifiedAdd from '../../../../public/Qualified_deals.svg';
import callList from '../../../../public/Call lists.svg';
import addContact from '../../../../public/Contacts.svg';
import api from 'lib/apiClient';
import addNote from '../../../../public/Notes-Menu.svg';
import {
  setActionForHighlight,
  highlight,
  createEntity as createEntityOverview,
} from '../../Overview/overview.actions';
import { OverviewTypes, Endpoints } from '../../../Constants';
import { contactItem, createEntity } from '../../Contact/contact.actions';
import { organisationItem } from '../../Organisation/organisation.actions';
import { updateCreateEntity } from '../../Task/task.actions';
import { getUser } from '../../Auth/auth.selector';
import { updateCreateEntityUnqualified } from '../../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { updateCreateEntityQualified } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import addChat from '../../../../public/add_chat.svg';

export const AddMenuItemChat = ({
  messeage,
  languageCode,
  contactItem,
  organisationItem,
  updateCreateEntity,
  setActionForHighlight,
  userAccount,
  createEntityOverview,
  updateCreateEntityUnqualified,
  updateCreateEntityQualified,
  highlight,
  createEntity,
}) => {
  // hook
  const [open, setOpen] = useState(false);
  const [existedUser, setExistedUser] = useState(null);
  const [contact, setContact] = useState(null);
  // style
  const popupStyle = {
    padding: 0,
  };

  const iconAdd = (
    <div className={localCss.circleBig} onMouseEnter={handleOnOpen} onClick={handleOnOpen}>
      <Image src={addChat} width={18} circular />
    </div>
  );

  const checkUserExistedSB = async (mess) => {
    try {
      if (mess && mess.from && mess.from.user) {
        const res = await api.get({
          resource: `contact-v3.0/msTeam/checkIfUserExistedInSalesbox`,
          query: {
            userId: mess.from.user.id,
          },
        });
        if (res && res.uuid) {
          setExistedUser(true);

          const contactDetail = await api.get({
            resource: `${Endpoints.Contact}/getDetails/${res.uuid}`,
            query: {
              languageCode,
            },
          });
          if (contactDetail && contactDetail.uuid) setContact(contactDetail);
        } else {
          setExistedUser(false);
          if (messeage && messeage.from && messeage.from.user) {
            const userMSTeam = await api.get({
              resource: `contact-v3.0/msTeam/getUserInfo`,
              query: {
                userId: messeage.from.user.id,
              },
            });
            if (userMSTeam) {
              setContact({
                avatar: userMSTeam.avatar,
                avatarData: userMSTeam.avatar,
                organisationName: userMSTeam.companyName,
                displayName: userMSTeam.displayName,
                firstName: userMSTeam.givenName,
                lastName: userMSTeam.surName,
                email: userMSTeam.mail,
                msTeamId: userMSTeam.id,
                teamId: messeage.channelIdentity.teamId,
                additionalEmailList: [
                  {
                    uuid: 0,
                    main: true,
                    type: 'EMAIL_WORK',
                    value: userMSTeam.mail,
                  },
                ],
              });
            }
          }
        }
      }
    } catch (ex) {}
  };
  // handle action
  const handleOnClose = async () => {
    setOpen(false);
  };
  const handleOnOpen = async () => {
    checkUserExistedSB(messeage);
    setOpen(true);
  };

  const handleAddContact = (e) => {
    e.stopPropagation();

    let overviewT = OverviewTypes.Contact;
    highlight(overviewT, null, 'create');
    createEntity(contact);
  };
  const handleAddNote = (e) => {
    e.stopPropagation();
    highlight(OverviewTypes.Contact_Note, contact.uuid, 'add_note');
  };
  const handleAddReminder = (e) => {
    e.stopPropagation();

    contactItem([contact]);
    organisationItem({ uuid: contact.organisationId, name: contact.organisationName });
    let overviewT = OverviewTypes.Contact_Task;
    updateCreateEntity(
      { organisationId: contact.organisationId, contactDTO: contact, organisation: contact.organisation },
      overviewT
    );
    setActionForHighlight(overviewT, 'create');

    // highlight(OverviewTypes.Contact_Task, );
  };
  const handleAddMeeting = (e) => {
    e.stopPropagation();

    contactItem([contact]);
    organisationItem({ uuid: contact.organisationId, name: contact.organisationName });
    createEntityOverview(OverviewTypes.Contact_Appointment, {
      contacts: [contact.uuid],
      responsible: userAccount.uuid,
      organisation: contact.organisation != null ? contact.organisation.uuid : contact.organisationId,
    });
    let overviewT = OverviewTypes.Contact_Appointment;
    setActionForHighlight(overviewT, 'create');
  };
  const handleAddProspect = (e) => {
    e.stopPropagation();

    contactItem([contact]);
    organisationItem({ uuid: contact.organisationId, name: contact.organisationName });
    let overviewT = OverviewTypes.Contact_Quick_Unqualified;
    updateCreateEntityUnqualified({ organisationId: contact.organisationId, contactId: contact.uuid }, overviewT);
    setActionForHighlight(overviewT, 'create');
  };
  const handleAddDeal = (e) => {
    e.stopPropagation();

    contactItem([contact]);
    // organisationItem(contact.organisation);
    organisationItem({ uuid: contact.organisationId, name: contact.organisationName });

    let overviewT = OverviewTypes.Contact_Quick_Qualified;
    updateCreateEntityQualified(
      { organisation: { uuid: contact.organisationId }, contacts: [{ uuid: contact.uuid }] },
      overviewT
    );
    setActionForHighlight(overviewT, 'create');
  };
  const handleAddToCalllist = (e) => {
    e.stopPropagation();
    let overviewT = OverviewTypes.Contact;
    highlight(overviewT, contact.uuid, 'add_to_call_list');
  };

  return (
    <Popup
      hoverable
      trigger={iconAdd}
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      onClick={handleOnClose}
      open={open}
      flowing
      position="bottom right"
      style={popupStyle}
      className={localCss.iconAdd}
      keepInViewPort
      hideOnScroll
    >
      {existedUser !== null && existedUser === false && (
        <Menu vertical color="teal">
          <Menu.Item onClick={handleAddContact}>
            <div className={css.actionIcon}>
              {_l`Add contact`}
              <img style={{ height: '13px', width: '20px' }} src={addContact} />
            </div>
          </Menu.Item>
        </Menu>
      )}
      {existedUser !== null && existedUser === true && (
        <Menu vertical color="teal">
          <Menu.Item onClick={handleAddNote}>
            <div className={css.actionIcon}>
              {_l`Add note`}
              <img style={{ height: '13px', width: '20px' }} src={addNote} />
            </div>
          </Menu.Item>
          <Menu.Item onClick={handleAddReminder}>
            <div className={css.actionIcon}>
              {_l`Add reminder`}
              <img style={{ height: '13px', width: '20px' }} src={taskAdd} />
            </div>
          </Menu.Item>
          <Menu.Item onClick={handleAddMeeting}>
            <div className={css.actionIcon}>
              {_l`Add meeting`}
              <img style={{ height: '13px', width: '20px' }} src={appointmentAdd} />
            </div>
          </Menu.Item>
          <Menu.Item onClick={handleAddProspect}>
            <div className={css.actionIcon}>
              {_l`Add prospect`}
              <img style={{ height: '13px', width: '20px' }} src={unqualifiedAdd} />
            </div>
          </Menu.Item>
          <Menu.Item onClick={handleAddDeal}>
            <div className={css.actionIcon}>
              {_l`Add deal`}
              <img style={{ height: '13px', width: '20px' }} src={qualifiedAdd} />
            </div>
          </Menu.Item>
          <Menu.Item onClick={handleAddToCalllist}>
            <div className={css.actionIcon}>
              {_l`Add to call list`}
              <img style={{ height: '13px', width: '20px' }} src={callList} />
            </div>
          </Menu.Item>
        </Menu>
      )}
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  languageCode: state.ui.app.locale,
  userAccount: getUser(state),
});

const mapDispatchToProps = {
  setActionForHighlight,
  contactItem,
  organisationItem,
  updateCreateEntity,
  highlight,
  createEntityOverview,
  updateCreateEntityUnqualified,
  updateCreateEntityQualified,
  createEntity,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMenuItemChat);

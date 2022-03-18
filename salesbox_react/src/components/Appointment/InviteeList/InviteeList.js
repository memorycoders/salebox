// @flow
import * as React from 'react';
import { Icon, List } from 'semantic-ui-react';
import css from './InviteeList.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Collapsible } from 'components';
import Avatar from 'components/Avatar/Avatar';
import ContactAvatar from '../ContactList/ContactAvatar'
import noneAvatar from '../../../../public/none_avatar.png';
import _l from 'lib/i18n';
import cssAvatar from '../../User/CreatorPane/CreatorPane.css';
import addSvg from '../../../../public/Add.svg';
import { highlight } from '../../Overview/overview.actions';
import { OverviewTypes, EmailTypes } from '../../../Constants';
import { createEntity } from '../../Contact/contact.actions'
type PropsT = {
  invitees: array,
};


addTranslations({
  'en-US': {
    Invitees: 'Invitees'
  },
});

const InviteeList = ({ highlight, invitees, appointment, createEntity }: PropsT) => {
  if (!invitees || (invitees.contactInviteeDTOList.length < 1 && invitees.communicationInviteeDTOList.length < 1)) return null;
  return (
    <Collapsible hasDragable title={_l`Invitees`} width={308}  count={invitees.contactInviteeDTOList.length +invitees.communicationInviteeDTOList.length} padded open >

      <div className={css.list}>
        {invitees.contactInviteeDTOList.map(value => {
          return <ContactAvatar contact={value}/>
        })}
        {invitees.communicationInviteeDTOList.map((email) => {
          return (
            <div key={email} className={css.listItem}>
              <div className={cssAvatar.avatar}>
                <div style={{ marginLeft: 0, marginRight: 5 }} className={cssAvatar.container}>
                  <img src={noneAvatar} style={{ width: '63px' }} />
                  <div className={cssAvatar.nameOfImage}>

                  </div>
                </div>
              </div>
             
              {/* <div className={css.avatar}>
                <Icon name="envelope" />
              </div> */}
              <div className={cssAvatar.info}>
                <div className={cssAvatar.creatorName}>
                </div>
                <List style={{ marginTop: 0, wordBreak: 'break-all', paddingRight: 3 }}>
                  {email && (
                    <List.Item>
                      <List.Icon name="envelope" />
                      <List.Content>
                        <a href={`mailto:${email.value}`}>{email.value}</a>
                      </List.Content>
                    </List.Item>
                  )}
                </List>
              </div>
              <div onClick={()=> {
                createEntity({
                  additionalEmailList: [{
                    main: true,
                    value: email.value,
                    uuid: 0,
                    type: EmailTypes.Work,
                  }]})
                highlight(OverviewTypes.Activity.Appointment_Add_Contact, appointment.uuid, 'create');
              }} className={css.bgMore}>
                <img style={{ width: 12, height: 12}} src={addSvg}/>
              </div>
            </div>
          );
        })}
      </div>
    </Collapsible>
    
  );
};
export default compose(
  connect(null, {
    highlight,
    createEntity
  })
)(InviteeList);

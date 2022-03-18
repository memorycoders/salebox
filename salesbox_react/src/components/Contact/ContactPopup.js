//@flow
import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Popup, List, Button, Icon } from 'semantic-ui-react';


import css from './ContactPopup.css';

type PropsT = {
  name: string,
  email: string,
  phone: string,
};

const ContactPopup = ({ name, email, phone, triggerClassName }: PropsT) => {
  if (!email && !phone){
    return <div className={`${css.infoIcon} ${triggerClassName}`}/>
  }
  return (
    <Popup
     hoverable trigger={
      // <Icon name="info circle" size="large" />
        <div className={`${css.infoIcon} ${triggerClassName}`}></div>
      }>
      <Popup.Header><span className={css.header}>{name}</span></Popup.Header>
      <Popup.Content>
        <List>
          {email && (
            <List.Item>
              <List.Icon name="envelope" />
              <List.Content>
                <a className={css.email} href={`mailto:${email}`}>{email}</a>
              </List.Content>
            </List.Item>
          )}
          {phone && (
            <List.Item>
              <List.Icon name="phone" />
              <List.Content>
                <a className={css.phone} href={`tel:${phone}`}>{phone}</a>
              </List.Content>
            </List.Item>
          )}
        </List>
      </Popup.Content>
    </Popup>
  );
};

export default compose()(ContactPopup);

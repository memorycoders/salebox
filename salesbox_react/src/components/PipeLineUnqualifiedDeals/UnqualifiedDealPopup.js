//@flow
import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Popup, List, Button } from 'semantic-ui-react';

type PropsT = {
  name: string,
  email: string,
  phone: string,
};

const CallListAccountPopup = ({ name, email, phone }: PropsT) => {
  return (
    <Popup hoverable trigger={<Button basic icon="info circle" />}>
      <Popup.Header>{name}</Popup.Header>
      <Popup.Content>
        <List>
          {email && (
            <List.Item>
              <List.Icon name="envelope" />
              <List.Content>
                <a href={`mailto:${email}`}>{email}</a>
              </List.Content>
            </List.Item>
          )}
          {phone && (
            <List.Item>
              <List.Icon name="phone" />
              <List.Content>
                <a href={`tel:${phone}`}>{phone}</a>
              </List.Content>
            </List.Item>
          )}
        </List>
      </Popup.Content>
    </Popup>
  );
};

export default compose(branch(({ email, name, phone }) => !email && !phone, renderNothing))(CallListAccountPopup);

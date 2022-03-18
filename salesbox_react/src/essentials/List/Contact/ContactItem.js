
// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Avatar } from 'components';
import { Icon, Popup, Button } from 'semantic-ui-react';

import { ContactActionMenu } from 'essentials';

import * as contactActions from 'components/Contact/contact.actions';

import { makeGetContact } from 'components/Contact/contact.selector';

import cx from 'classnames';
import css from './ContactItem.css';

import _l from 'lib/i18n';
import QualifiedDealActionMenu from "../../Menu/QualifiedDealActionMenu";
addTranslations({
  'en-US': {
    Responsible: 'Responsible',
    Reminders: 'Reminders',
    'Qualified': 'Qualified',
  },
});

type PropsT = {
  contact: {},
  handleToggleFavorite: (event: Event) => void,
};

const ContactListHeader = () => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div className={css.avatar} />
      <div className={css.name} />
      <div className={css.kpi}>
        <Popup inverted position="top center" trigger={<Icon name="user outline" />}>{_l`Responsible`}</Popup>
      </div>
      <div className={css.kpi}>
        <Popup inverted position="top center" trigger={<Icon name="tasks" />}>{_l`Reminders`}</Popup>
      </div>
      <div className={css.kpi}>
        <Popup inverted position="top center" trigger={<Icon name="calendar alternate outline" />}>{_l`Meeting`}</Popup>
      </div>
      <div className={css.kpi}>
        <Popup inverted position="top center" trigger={<Icon name="money" color="grey" />}>{_l`Deals`}</Popup>
      </div>
      <div className={css.avatar} />
      <div className={css.button} />
    </div>
  );
};

const FavoriteIcon = <Icon name="star" color="yellow" />;
const NotFavoriteIcon = <Icon name="star outline" />;

const ContactItem = ({
  contact,
  handleToggleFavorite,
                       overviewType
}: PropsT) => {
  const favoriteIton = contact.favorite ? FavoriteIcon : NotFavoriteIcon;
  return (
    <div className={css.listItem}>
      <div className={css.avatar}>
        <Avatar size={32} src={contact.avatar} border={contact.relationship} fallbackIcon="user" />
      </div>
      <div className={css.name}>
        {contact.displayName}
        <div className={css.organisation}>{contact.organisation.displayName}</div>
      </div>
      <div className={css.kpi}>{_l`${contact.participants.length}:n`}</div>
      <div className={css.kpi}>{_l`${contact.numberActiveTask}:n`}</div>
      <div className={css.kpi}>{_l`${contact.numberActiveMeeting}:n`}</div>
      <div className={css.kpi}>{_l`${contact.numberActiveProspect}:n`}</div>
      <div className={css.avatar}>
        <Avatar size={32} src={contact.owner.avatar} border={contact.owner.discProfile} fallbackIcon="user" />
      </div>
      <div className={css.button}>
        <Button basic compact icon={favoriteIton} onClick={handleToggleFavorite} />
        <ContactActionMenu contact={contact}
                           overviewType={overviewType}
        />
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state, { contactId }) => ({
    contact: getContact(state, contactId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest: contactActions.toggleFavoriteRequest,
};

export default compose(
  branch(({ header }) => header, renderComponent(ContactListHeader)),
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
  }),
)(ContactItem);

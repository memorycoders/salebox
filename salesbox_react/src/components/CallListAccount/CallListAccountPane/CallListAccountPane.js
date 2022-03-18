//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure, defaultProps } from 'recompose';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { Avatar } from 'components';
import css from './CallListAccountPane.css';

type PropsT = {
  callListAccount: {},
  color: string,
  fallbackIcon?: string,
  children: React.Node,
};

const CallListAccountPane = ({ children, fallbackIcon, color, callListAccount }: PropsT) => {
  const hasTitle = !!callListAccount.title;
  const hasOrganisation = callListAccount.organisation && callListAccount.organisation.name;
  const hasSize = callListAccount.size && callListAccount.size.name;
  return (
    <React.Fragment>
      <div className={cx(css.header, color)}>
        <div className={css.heading}>{callListAccount.name}</div>
        {hasTitle && <div className={css.subHeading}>{_l`${callListAccount.title} at ${callListAccount.organisation.name}`}</div>}
        {!hasTitle && hasOrganisation && <div className={css.subHeading}>{callListAccount.organisation.name}</div>}
        {callListAccount.type && <div className={css.subHeading}>{callListAccount.type.name}</div>}
        <div className={css.contactDetails}>
          <ul>
            {hasSize && (
              <li>
                <Icon name="users" />
                {callListAccount.size.name}
              </li>
            )}
            {callListAccount.phone && (
              <li>
                <Icon name="phone" />
                <a href={`tel:${callListAccount.phone}`}>{callListAccount.phone}</a>
              </li>
            )}
            {callListAccount.email && (
              <li>
                <Icon name="envelope" />
                <a href={`mailto:${callListAccount.email}`}>{callListAccount.email}</a>
              </li>
            )}
            {callListAccount.web && (
              <li>
                <Icon name="world" />
                <a href={`${callListAccount.web}`}>{callListAccount.web}</a>
              </li>
            )}
            {callListAccount.fullAddress && (
              <li>
                <Icon name="building" />
                {callListAccount.fullAddress}
              </li>
            )}
            {children}
          </ul>
        </div>
      </div>
      <div className={css.centerImage}>
        <Avatar size={82} src={callListAccount.avatar} fallbackIcon={fallbackIcon} border={callListAccount.relationship || 'YELLOW'} />
      </div>
    </React.Fragment>
  );
};

export default compose(
  defaultProps({
    fallbackIcon: 'user',
  }),
  branch(({ callListAccount }) => !callListAccount, renderNothing),
  pure
)(CallListAccountPane);

//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { branch, renderNothing, compose, pure } from 'recompose';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';
import { Icon, Image } from 'semantic-ui-react';
import Collapsible from 'components/Collapsible/Collapsible';
import { getAvatarUrl } from 'lib';
import css from './OrganisationPane.css';

type PropsT = {
  organisation: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
  },
});

const OrganisationPane = ({ organisation }: PropsT) => {
  const hasSize = organisation.size && organisation.size.name;
  const src = getAvatarUrl(organisation.avatar);
  const avatar = src ? (
    <div className={css.avatarContainer}>
      <Image src={src} avatar size="tiny" circular />
    </div>
  ) : (
    <Icon inverted circular size="large" name="building outline" />
  );
  return (
    <Collapsible padded title={_l`Company info`}>
      <div className={css.pane}>
        <div className={css.avatar}>{avatar}</div>
        <ul className={css.contactDetails}>
          {organisation.industry.name && (
            <li>
              <Icon name="factory" />
              {organisation.industry.name}
            </li>
          )}
          {organisation.type.name && (
            <li>
              <Icon name="address card outline" />
              {organisation.type.name}
            </li>
          )}
          {hasSize && (
            <li>
              <Icon name="users" />
              {organisation.size.name}
            </li>
          )}
          {organisation.phone && (
            <li>
              <Icon name="phone" />
              <a href={`tel:${organisation.phone}`}>{organisation.phone}</a>
            </li>
          )}
          {organisation.email && (
            <li>
              <Icon name="envelope" />
              <a href={`mailto:${organisation.email}`}>{organisation.email}</a>
            </li>
          )}
          {organisation.web && (
            <li>
              <Icon name="world" />
              <a href={`${organisation.web}`}>{organisation.web}</a>
            </li>
          )}
          {organisation.fullAddress && (
            <li>
              <Icon name="building" />
              {organisation.fullAddress}
            </li>
          )}
        </ul>
      </div>
    </Collapsible>
  );
};

const makeMapStateToProps = () => {
  const getOrganisation = makeGetOrganisation();
  const mapStateToProps = (state, { organisationId }) => ({
    organisation: getOrganisation(state, organisationId),
  });
  return mapStateToProps;
};

export default compose(
  branch(({ organisationId }) => !organisationId, renderNothing),
  connect(makeMapStateToProps),
  // branch(({ organisation }) => !organisation || !organisation.uuid, renderNothing),
  pure
)(OrganisationPane);

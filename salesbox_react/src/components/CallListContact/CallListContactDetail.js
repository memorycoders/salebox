//@flow
import * as React from 'react';

import { Button } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetContact } from 'components/Contact/contact.selector';
import { ContentLoader } from 'components/Svg';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as ContactActions from '../Contact/contact.actions';

import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';

import ContactPane from 'components/Contact/ContactPane/ContactPane';
import ContactPaneMenu from 'components/Contact/ContactPaneMenu/ContactPaneMenu';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import SalesPane from 'components/Contact/SalesPane/SalesPane';
import PipelinePane from 'components/Contact/PipelinePane/PipelinePane';
import StatisticsPane from 'components/Contact/StatisticsPane/StatisticsPane';
import LatestCommunicationPane from 'components/Contact/LatestCommunicationPane/LatestCommunicationPane';
import ContactTeamPane from 'components/Contact/ContactTeamPane/ContactTeamPane';
import MultiRelationsPane from 'components/MultiRelation/MultiRelationsPane';

import ContactActionMenu from 'essentials/Menu/ContactActionMenu';

import _l from '../../lib/i18n';
import { getCallListContact } from './callListContact.selector';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    '{0} at {1}': '{0} at {1}',
    'Reminder focus': 'Reminder focus',
    Note: 'Note',
    Creator: 'Creator',
    'Contact growth': 'Contact growth',
  },
});

type PropsT = {
  contact: {},
  color: string,
  editContact: () => void,
  handleToggleFavorite: (event: Event) => void,
};

const ContactDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const ContactDetail = ({ handleToggleFavorite, color = CssNames.Contact, contact, editContact }: PropsT) => {

  return (
    <div className={css.pane}>
      <div className={css.controls}>
        <div className={css.date} />
        <Button.Group>
          {!contact.favorite && <Button icon="star outline" onClick={handleToggleFavorite} />}
          {contact.favorite && <Button icon="star" className={css.favorited} onClick={handleToggleFavorite} />}
          {/* onClick={handleToggleFavorite}  */}
          <Button compact icon="pencil" onClick={editContact} />
          <ContactActionMenu contact={contact} />
          <Button compact icon="close" as={Link} to={`/call-lists/contact/${contact.uuid}`} />
        </Button.Group>
      </div>
      <ContactPane contact={contact} color={color} />
      <ContactPaneMenu contact={contact} />
      <CustomFieldsPane
        object={contact}
        customFields={contact.customFields}
        objectType={ObjectTypes.Contact}
        objectId={contact.uuid}
      />
      <SalesPane item={contact} growthType="Contact growth" />
      {/*<PipelinePane contact={contact} />*/}
      <LatestCommunicationPane contact={contact} />
      <StatisticsPane contact={contact} />
      <MultiRelationsPane
        multiRelations={contact.multiRelations}
        objectType={ObjectTypes.Contact}
        objectId={contact.uuid}
      />
      <ContactTeamPane contact={contact} />
    </div>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => ({
    contact: getCallListContact(state, props.match.params.callListContactId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  requestFetchContact: ContactActions.requestFetchContact,
  editEntity: OverviewActions.editEntity,
  toggleFavoriteRequest: ContactActions.toggleFavoriteRequest,
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Contact,
  }),
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  ),
  withGetData(({ requestFetchContact, match: { params: { contactId } } }) => () => {
    requestFetchContact(contactId);
  }),
  withHandlers({
    editContact: ({ editEntity, overviewType, contact }) => () => {
      // highlight(overviewType, contact.uuid, 'edit');
      editEntity(overviewType, contact.uuid);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
  }),
  branch(({ contact }) => !contact, renderComponent(ContactDetailPlaceHolder))
)(ContactDetail);

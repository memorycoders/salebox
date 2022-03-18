//@flow
import * as React from 'react';

import { Button } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';
import { ContentLoader } from 'components/Svg';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as AccountActions from 'components/Organisation/organisation.actions';

import { ObjectTypes, OverviewTypes, Colors } from 'Constants';

import ContactPane from 'components/Contact/ContactPane/ContactPane';
import AccountPaneMenu from 'components/Organisation/AccountPaneMenu/AccountPaneMenu';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import MultiRelationsPane from 'components/MultiRelation/MultiRelationsPane';
import SalesPane from 'components/Contact/SalesPane/SalesPane';
import StatisticsPane from 'components/Contact/StatisticsPane/StatisticsPane';
import PipelinePane from 'components/Contact/PipelinePane/PipelinePane';
import ContactTeamPane from 'components/Contact/ContactTeamPane/ContactTeamPane';
import AccountTargetPane from 'components/Organisation/AccountTargetPane/AccountTargetPane';
import LatestCommunicationPane from 'components/Contact/LatestCommunicationPane/LatestCommunicationPane';

import ListActionMenu from 'components/Organisation/Menus/ListActionMenu';

import _l from '../../lib/i18n';
import {getCallListAccount} from "./callListAccount.selector";
addTranslations({
  'en-US': {
    '{0}': '{0}',
    '{0} at {1}': '{0} at {1}',
    'Reminder focus': 'Reminder focus',
    Note: 'Note',
    Creator: 'Creator',
  },
});

type PropsT = {
  account: {},
  editAccount: () => void,
  overviewType: string,
  handleToggleFavorite: (event: Event) => void,
};

const AccountDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const AccountDetail = ({
  account,
  overviewType,
  editAccount,
  handleToggleFavorite,
}: PropsT) => {

  return (
    <div className={css.pane}>
      <div className={css.controls}>
        <div className={css.date} />
        <Button.Group>
          { !account.favorite && <Button icon='star outline' onClick={handleToggleFavorite} />}
          { account.favorite && <Button icon='star' className={css.favorited} onClick={handleToggleFavorite} />}
          <Button compact icon="pencil" onClick={editAccount} />
          <ListActionMenu overviewType={overviewType} organisation={account} />

          <Button compact icon="close" as={Link} to={`/call-lists/account/${account.uuid}`} />

        </Button.Group>
      </div>
      <ContactPane fallbackIcon="building outline" contact={account} color={Colors.Account} />
      <AccountPaneMenu account={account} />
      <CustomFieldsPane
        object={account}
        customFields={account.customFields}
        objectType={ObjectTypes.Account}
        objectId={account.uuid}
      />
      <SalesPane item={account} growthType={_l`Company growth`} />
      {/*<PipelinePane contact={account} />*/}
      <AccountTargetPane account={account} />
      <LatestCommunicationPane account={account} />
      <StatisticsPane contact={account} />
      <MultiRelationsPane
        multiRelations={account.multiRelations}
        objectType={ObjectTypes.Account}
        objectId={account.uuid}
      />
      <ContactTeamPane contact={account} />
    </div>
  );
};

const makeMapStateToProps = () => {
  // const getAccount = makeGetOrganisation();
  const mapStateToProps = (state, props) => ({
    account: getCallListAccount(state, props.match.params.callListAccountId),

  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  requestFetchOrganisation: AccountActions.requestFetchOrganisation,
  editEntity: OverviewActions.editEntity,
  toggleFavoriteRequest: AccountActions.toggleFavoriteRequest,
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Account,
  }),
  connect(
    makeMapStateToProps,
    mapDispatchToProps
  ),
  withGetData(({ requestFetchOrganisation, match: { params: { organisationId } } }) => () => {
    requestFetchOrganisation(organisationId);
  }),
  withHandlers({
    editAccount: ({ editEntity, overviewType, account }) => () => {
      editEntity(overviewType, account.uuid);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, account }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(account.uuid, !account.favorite);
    },
  }),
  branch(({ account }) => !account, renderComponent(AccountDetailPlaceHolder))
)(AccountDetail);

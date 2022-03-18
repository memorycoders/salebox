//@flow
import * as React from 'react';

import { Popup } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';
import { ContentLoader } from 'components/Svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCategoryDetailSections } from '../../components/App/app.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as AccountActions from 'components/Organisation/organisation.actions';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';

import AccountPane from '../../components/Organisation/AccountPane/AccountPane';
import AccountPaneMenu from 'components/Organisation/AccountPaneMenu/AccountPaneMenu';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import MultiRelationsPane from 'components/MultiRelation/MultiRelationsPane';
import SalesPane from 'components/Contact/SalesPane/SalesPane';
import StatisticsPane from 'components/Contact/StatisticsPane/StatisticsPane';
import PipelinePane from 'components/Contact/PipelinePane/PipelinePane';
import ContactTeamPane from 'components/Contact/ContactTeamPane/ContactTeamPane';
import AccountTargetPane from 'components/Organisation/AccountTargetPane/AccountTargetPane';
import LatestCommunicationPane from 'components/Contact/LatestCommunicationPane/LatestCommunicationPane';
import localCss from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail.css';
import ListActionMenu from 'components/Organisation/Menus/ListActionMenu';
import CallListPane from '../../components/Organisation/CallList/CallListPane';
import add from '../../../public/Add.svg';
import _l from '../../lib/i18n';
import starSvg from '../../../public/myStar.svg';
import starActiveSvg from '../../../public/myStar_active.png';

const historyTooltip = {
  fontSize: '11px',
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  marginTop: '1rem',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: '#f0f0f0',
  // padding: grid,
  width: 340,
});

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
  setFavoriteDeal: () => void,
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
  accountInlist,
  _DETAIL_ACCOUNT,
  overviewType,
  editAccount,
  handleToggleFavorite,
  setFavoriteDeal,
  linkTo,
  history,
  unhighlight,
  route,
  isOrigin,
  overviewTypeHightlight,
  accountSections,
  updateCategoryDetailSections,
}: PropsT) => {
  console.log('accountInlist: ', accountInlist)
  let account = _DETAIL_ACCOUNT && _DETAIL_ACCOUNT.uuid ? _DETAIL_ACCOUNT : accountInlist;

  const onDragEnd = (result) => {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const items = reorder(accountSections, result.source.index, result.destination.index);

    updateCategoryDetailSections('accountSections', items);
  };

  const renderPane = (key, index) => {
    switch (key) {
      case 'LatestCommunicationPane':
        return (
          <LatestCommunicationPane
            overviewType={overviewType}
            objectType={ObjectTypes.Account}
            contact={{
              ...account,
              latestCommunication: account.latestCommunicationHistoryDTOList,
            }}
          />
        );
      case 'CustomFieldsPane':
        return (
          <CustomFieldsPane
            isDetail
            object={account}
            customFields={account.customFields}
            objectType={ObjectTypes.Account}
            objectId={account.uuid}
          />
        );
      case 'SalesPane':
        return <SalesPane item={account} growthType={_l`Company growth`} />;
      case 'AccountTargetPane':
        return <AccountTargetPane overviewType={OverviewTypes.Account} account={account} />;
      case 'MultiRelationsPane':
        return (
          <MultiRelationsPane
            multiRelations={accountInlist.multiRelations}
            objectType={ObjectTypes.Account}
            objectId={accountInlist.uuid}
            overviewType={overviewType}
            parentName={account.name}
          />
        );
      case 'ContactTeamPane':
        return (
          <ContactTeamPane
            contact={{
              ...account,
              participants: account && account.participantList ? account.participantList : [],
            }}
          />
        );
      case 'CallListPane':
        return <CallListPane overviewType={OverviewTypes.Account} account={account} />;
      default:
        break;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
            className={css.pane}
          >
            <div className={css.controls}>
              <div className={css.date} />
              <div className={css.detailTaskGroupButton}>
                <Popup
                  style={{ fontSize: 11 }}
                  content={_l`Favourites`}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail}>
                      {!accountInlist.favorite && (
                        <img
                          src={starSvg}
                          style={{ marginTop: '0px', marginLeft: '0px', height: 15, width: 15 }}
                          onClick={setFavoriteDeal}
                        />
                      )}
                      {accountInlist.favorite && (
                        <img
                          src={starActiveSvg}
                          style={{ marginTop: '0px', marginLeft: '0px', height: 15, width: 15 }}
                          onClick={setFavoriteDeal}
                        />
                      )}
                    </div>
                  }
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={editAccount}>
                      <img className={localCss.detailIconSize} src={require('../../../public/Edit.svg')} />
                    </div>
                  }
                  content={_l`Update`}
                  position="top center"
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div
                      onClick={() => {
                        if (isOrigin) {
                          unhighlight(overviewTypeHightlight, account.uuid);
                          return history.push(linkTo);
                        }
                        unhighlight(overviewType, account.uuid);
                        const checkCurrent = (location.pathname.match(/\//g) || []).length === 2;
                        const checkCurrentDetail = location.pathname.includes('accounts');
                        if (checkCurrentDetail && checkCurrent) {
                          return history.push('/accounts');
                        }
                        history.goBack();
                      }}
                      className={localCss.circleButtonTaskDetail}
                    >
                      <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={add} />
                    </div>
                  }
                  content={_l`Close`}
                  position="top center"
                />
              </div>
            </div>
            <AccountPane history={history} account={account} color={Colors.Account} />
            <AccountPaneMenu route={route} account={account} />

            {accountSections.map((key, index) => {
              return (
                <Draggable key={`ACCOUNT_${key}`} index={index} draggableId={`CONTACT_${key}`}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                    >
                      {renderPane(key, index)}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const makeMapStateToProps = () => {
  const getAccount = makeGetOrganisation();

  const mapStateToProps = (state, props) => {
    const {
      match: {
        params: { organisationId },
      },
    } = props;
    let _DETAIL_ACCOUNT = state.entities.organisation.__DETAIL || {};
    if (organisationId !== _DETAIL_ACCOUNT.uuid) {
      _DETAIL_ACCOUNT = {};
    }
    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};
    return {
      accountInlist: getAccount(state, props.match.params.organisationId),
      _DETAIL_ACCOUNT,
      accountSections: detailSectionsDisplay.accountSections || [],
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = {
  requestFetchOrganisation: AccountActions.requestFetchOrganisation,
  editEntity: AccountActions.editEntity,
  toggleFavoriteRequest: AccountActions.toggleFavoriteRequest,
  setFavoriteDeal: AccountActions.setFavoriteDeal,
  highlight: OverviewActions.highlight,
  unhighlight: OverviewActions.unhighlight,
  updateCategoryDetailSections,
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Account,
    linkTo: '/accounts',
  }),
  connect(makeMapStateToProps, mapDispatchToProps),
  withGetData(({ requestFetchOrganisation, match: { params: { organisationId } } }) => () => {
    requestFetchOrganisation(organisationId);
  }),
  withHandlers({
    editAccount: ({ editEntity, overviewType, accountInlist, _DETAIL_ACCOUNT, highlight }) => () => {
      const account = _DETAIL_ACCOUNT ? _DETAIL_ACCOUNT : accountInlist;
      highlight(overviewType, account.uuid, 'edit');
      editEntity(overviewType, account);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, account }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(account.uuid, !account.favorite);
    },
    setFavoriteDeal: ({ setFavoriteDeal, accountInlist }) => (e) => {
      e.stopPropagation();
      setFavoriteDeal(accountInlist.uuid, !accountInlist.favorite);
    },
  })
  // branch(({ account }) => !account, renderComponent(AccountDetailPlaceHolder))
)(AccountDetail);

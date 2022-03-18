//@flow
import * as React from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCategoryDetailSections } from '../../components/App/app.actions';

import { Button, Popup } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { ContentLoader } from 'components/Svg';
import Deadline from '../Deadline/Deadline';
import { ObjectTypes, OverviewTypes, Colors } from 'Constants';

import ContactPanePipeline from './UnqualifiedDealPane/UnqualifiedDealPane';
import UnqualifiedPaneMenu from './UnqualifiedDealsPaneMenu/UnqualifiedDealsPaneMenu';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import MultiRelationsPane from 'components/MultiRelation/MultiRelationsPane';
import SalesPane from 'components/Contact/SalesPane/SalesPane';
import StatisticsPane from 'components/Contact/StatisticsPane/StatisticsPane';
import PipelinePane from 'components/Contact/PipelinePane/PipelinePane';
import ContactTeamPane from 'components/Contact/ContactTeamPane/ContactTeamPane';
import AccountTargetPane from 'components/Organisation/AccountTargetPane/AccountTargetPane';
import LatestCommunicationPane from 'components/Contact/LatestCommunicationPane/LatestCommunicationPane';
import add from '../../../public/Add.svg';
import OrganisationActionMenu from 'components/Organisation/Menus/ListActionMenu';
import _l from '../../lib/i18n';
import localCss from './UnqualifiedDealDetail.css';
import { makeGetUnqualifiedDeal } from './unqualifiedDeal.selector';
import { editEntity, highlight, unhighlight } from '../Overview/overview.actions';
import { fetchUnqualifiedDetail, updateEdit, clearErrors, changeNote } from './unqualifiedDeal.actions';
import { CreateNotePane } from '../../components/Note';
import { CreatorPane } from '../../components/User';
import { CreatorMailChimp } from '../../components/Common/CreatorMailChimp';
import InterestInPane from './InterestInPane/InterestInPane';
import { fetchLeadDetail } from '../Lead/lead.actions';
import { makeGetLead } from '../Lead/lead.selector';
import { CssNames } from '../../Constants';
import { ContentPaneGlobal } from '../../components/User/CreatorPane/CreatorPane';

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
    Source: 'Source',
  },
});

type PropsT = {
  unqualifiedDeal: {},
  setUnqualified: () => void,
  editAccount: () => void,
  overviewType: string,
  color: string,
  handleToggleFavorite: (event: Event) => void,
};

const UnqualifiedDealDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const UnqualifiedDealDetail = ({
  history,
  unqualifiedDeal,
  overviewType,
  editAccount,
  handleToggleFavorite,
  setUnqualified,
  unqualifiedDetail = {},
  color = CssNames.Opportunity,
  route,
  leadSections,
  updateCategoryDetailSections,
  unhighlight
}: PropsT) => {
  let contact = unqualifiedDeal.contact ? unqualifiedDeal.contact : {};
  let organisation = unqualifiedDeal.organisation ? unqualifiedDeal.organisation : {};
  if (unqualifiedDetail && unqualifiedDetail.uuid) {
    contact = unqualifiedDetail.contactDTO ? unqualifiedDetail.contactDTO : {};
    organisation = unqualifiedDetail.organisationDTO ? unqualifiedDetail.organisationDTO : {};
  }

  const onDragEnd = (result) => {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const items = reorder(
      leadSections,
      result.source.index,
      result.destination.index,
    );

    updateCategoryDetailSections('leadSections', items)
  }

  const renderPane = (key, index) => {

    switch (key) {
      case 'InterestInPane':
        return <InterestInPane unqualifiedDeal={unqualifiedDeal} />
      case 'CustomFieldsPane':
        return <CustomFieldsPane object={unqualifiedDetail} objectType={ObjectTypes.Lead} objectId={unqualifiedDetail.uuid} />
      case 'ContentPaneGlobal':
        return <>
          {(unqualifiedDetail.leadBoxerList && unqualifiedDetail.leadBoxerList.length > 0) &&
            <ContentPaneGlobal
              title={_l`Source`}
              qualifiedDeal={unqualifiedDetail}
            />
          }</>
      case 'CreatorPane':
        return <CreatorPane size={40} creator={unqualifiedDetail.uuid ? unqualifiedDetail.owner : unqualifiedDeal.creator} />
      case 'MultiRelationsPane':
        return <MultiRelationsPane
          multiRelations={contact.multiRelations}
          objectType={ObjectTypes.Contact}
          objectId={contact.uuid}
          overviewType={overviewType}
          parentName={contact.fullName}
        />
      case 'CreatorMailChimp':
        return <>
          {unqualifiedDetail.type != 'PRIORITISED' ? (
            <CreatorPane
              size={40}
              title={_l`Source`}
              creator={unqualifiedDetail.uuid ? unqualifiedDetail.creator : unqualifiedDeal.creator}
            />
          ) : (
              unqualifiedDetail.source == 'MAIL_CHIMP' && <CreatorMailChimp lead={unqualifiedDetail} />
            )}</>
      default:
        break;
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
            className={css.pane}>
            <div className={css.controls}>
              <div className={css.date}>
                <Deadline onlyDate className={css['font-half-11']} date={unqualifiedDeal.deadlineDate} />
              </div>
              <div className={css.detailTaskGroupButton}>
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail}>
                      <img
                        className={localCss.detailIconSize}
                        src={require('../../../public/Check.svg')}
                        onClick={setUnqualified}/>
                    </div>}
                  content={_l`Set as done`}
                  position="top center"
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={editAccount}>
                      <img className={localCss.detailIconSize} src={require('../../../public/Edit.svg')} />
                    </div>}
                  content={_l`Update`}
                  position="top center"
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div onClick={() => {
                      unhighlight(overviewType, unqualifiedDeal.uuid);
                      const checkCurrent = (location.pathname.match(/\//g) || []).length === 3;
                      const checkCurrentDetail = location.pathname.includes('pipeline/leads');
                      if (checkCurrentDetail && checkCurrent) {
                        return history.push('/pipeline/leads');
                      }
                      history.goBack();
                    }} className={localCss.circleButtonTaskDetail}>
                      <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={add} />
                      {/* <Link to={overviewType === OverviewTypes.Pipeline.Lead ? '/pipeline/leads' : '/delegation/leads'}>

                </Link> */}
                    </div>}
                  content={_l`Close`}
                  position="top center"
                />

              </div>
            </div>

            <ContactPanePipeline
              route={route}
              fallbackIcon="building outline"
              unqualifiedDeal={unqualifiedDetail.uuid ? unqualifiedDetail : unqualifiedDeal}
              contact={contact}
              organisation={organisation}
              color={color}
            />

            <UnqualifiedPaneMenu
              route={route}
              objectType={ObjectTypes.Lead}
              unqualifiedDeal={unqualifiedDetail.uuid ? unqualifiedDetail : unqualifiedDeal}
            />

            {leadSections.map((key, index) => {
              return <Draggable key={`LEAD_${key}`} index={index} draggableId={`LEAD_${key}`}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    style={getItemStyle(
                      draggableSnapshot.isDragging,
                      draggableProvided.draggableProps.style,
                    )}
                  >
                    {renderPane(key, index)}
                  </div>
                )}
              </Draggable>

            })}
            {droppableProvided.placeholder}

            {/*<PipelinePane contact={account} />*/}
            {/*<AccountTargetPane account={unqualifiedDeal} />*/}
            {/*<LatestCommunicationPane account={unqualifiedDeal} />*/}
            {/*<StatisticsPane contact={unqualifiedDeal} />*/}
            {/* <MultiRelationsPane
        multiRelations={unqualifiedDeal.multiRelations}
        objectType={ObjectTypes.Lead}
        objectId={unqualifiedDeal.uuid}
      /> */}

            {/* <ContactTeamPane unqualifiedDeal={unqualifiedDeal} /> */}
          </div>
        )}
      </Droppable>
    </DragDropContext>

  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    const { overviewType } = props;

    const getUnqualifiedDeal = makeGetUnqualifiedDeal();
    const getLead = makeGetLead();
    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};
    return {
      unqualifiedDeal:
        props.overviewType === OverviewTypes.Pipeline.Lead
          ? getUnqualifiedDeal(state, props.match.params.unqualifiedDealId)
          : getLead(state, props.match.params.unqualifiedDealId),
      unqualifiedDetail:
        props.overviewType === OverviewTypes.Pipeline.Lead
          ? state.entities.unqualifiedDeal.__DETAIL
          : state.entities.lead.__DETAIL,
      leadSections: (detailSectionsDisplay.leadSections) || []
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Pipeline.Lead,
  }),
  connect(
    makeMapStateToProps,
    {
      editEntity,
      fetchUnqualifiedDetail,
      highlight,
      updateEdit,
      clearErrors,
      fetchLeadDetail,
      updateCategoryDetailSections,
      unhighlight
    }
  ),

  withGetData(
    ({
      fetchUnqualifiedDetail,
      fetchLeadDetail,
      match: {
        params: { unqualifiedDealId },
      },
      overviewType,
    }) => () => {
      overviewType === OverviewTypes.Pipeline.Lead
        ? fetchUnqualifiedDetail(unqualifiedDealId)
        : fetchLeadDetail(unqualifiedDealId);
    }
  ),

  lifecycle({
    componentWillReceiveProps(nextProps) {

    }
  }),
  withHandlers({
    editAccount: ({ updateEdit, overviewType, unqualifiedDeal, clearErrors, highlight }) => () => {
      highlight(overviewType, unqualifiedDeal.uuid, 'edit');
      updateEdit(unqualifiedDeal);
      clearErrors();
    },
    setUnqualified: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'set');
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, unqualifiedDeal }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(unqualifiedDeal.uuid, !unqualifiedDeal.favorite);
    },
  }),
  branch(({ unqualifiedDeal }) => !unqualifiedDeal, renderComponent(UnqualifiedDealDetailPlaceHolder))
)(UnqualifiedDealDetail);

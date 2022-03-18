//@flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers, defaultProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import css from 'components/Lead/LeadDetail.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCategoryDetailSections } from '../../components/App/app.actions';

import localCss from './../PipeLineUnqualifiedDeals/UnqualifiedDealDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';
import QualifiedPaneMenu from './QualifiedDealsPaneMenu/QualifiedDealsPaneMenu';
import CreatorQualifiedPane from './QualifiedDealsPaneMenu/CreatorQualifiedPane';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import _l from '../../lib/i18n';
import * as OverviewActions from 'components/Overview/overview.actions';

import {
  fetchQualifiedDetail,
  setFavoriteDeal,
  fetchNumberOrderRow,
  updateEntity,
  updateInfoForDetailToEdit,
} from './qualifiedDeal.actions';

import add from '../../../public/Add.svg';
import ContactQualified from '../Contact/ContactPane/ContactQualified';
import starIcon from '../../../public/starDetail.svg';
import starIconActive from '../../../public/starDetail_active.svg';
import detailCss from './QualifiedDetail.css';
import { contactItem } from '../../components/Contact/contact.actions';
import { organisationItem } from '../../components/Organisation/organisation.actions';
import { prospectConcatItem } from '../../components/Prospect/prospect.action';

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

const QualifiedDealDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const STAR_STYLE = {
  fontSize: '15px',
  color: '#808080',
  margin: '0px',
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Resp.': 'Resp.',
    Name: 'Name',
    Sales: 'Sales',
    Profit: 'Profit',
    Gross: 'Gross',
    Net: 'Net',
    Created: 'Created',
    Closed: 'Closed',
    Value: 'Value',
    'Suggested next step': 'Suggested next step',
    Won: 'Won',
    Lost: 'Lost',
    'Won/Lost': 'Won/Lost',
  },
});

const QualifiedDetail = ({
  history,
  overviewType,
  color = CssNames.Opportunity,
  qualifiedDeal,
  currency,
  setFavoriteDeal,
  setWonDeal,
  setLostDeal,
  onEdit,
  route,
  unhighlight,
  qualifiedSections,
  updateCategoryDetailSections,
}) => {
  const { won } = qualifiedDeal;
  const isOrder = won !== undefined && won !== null;

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(qualifiedSections, result.source.index, result.destination.index);

    updateCategoryDetailSections('qualifiedSections', items);
  };

  const renderPane = (key, index) => {
    switch (key) {
      case 'CustomFieldsPane':
        return (
          <CustomFieldsPane object={qualifiedDeal} objectType={ObjectTypes.Opportunity} objectId={qualifiedDeal.uuid} />
        );
      case 'CreatorQualifiedPane':
        return (
          <>
            {qualifiedDeal && qualifiedDeal.participantList && qualifiedDeal.participantList.length > 0 ? (
              <div className={css.creator}>
                <CreatorQualifiedPane
                  size={40}
                  creator={
                    qualifiedDeal && qualifiedDeal.participantList && qualifiedDeal.participantList.length > 0
                      ? qualifiedDeal.participantList
                      : null
                  }
                />
              </div>
            ) : (
              <div>{/* There is no info about Creator or API  had not finished yet */}</div>
            )}
          </>
        );

      case 'ContactQualifiedPane':
        return (
          <CreatorQualifiedPane
            size={40}
            route={route}
            title={_l`Contact`}
            creator={
              qualifiedDeal && qualifiedDeal.sponsorList && qualifiedDeal.sponsorList.length > 0
                ? qualifiedDeal.sponsorList
                : null
            }
          />
        );
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
              <div className={css.date}>
                <div className={detailCss.leftGroup}>
                  <Popup
                    style={{ fontSize: 11 }}
                    content={_l`Set as won`}
                    trigger={
                      <div
                        className={`${localCss.circleButtonTaskDetail} ${
                          isOrder && won ? detailCss.starButtonWonActive : detailCss.starButtonWon
                        }`}
                        onClick={setWonDeal}
                      >
                        <div />
                      </div>
                    }
                  />
                  <Popup
                    style={{ fontSize: 11 }}
                    content={_l`Set as lost`}
                    trigger={
                      <div
                        style={{ marginLeft: '5px' }}
                        className={`${localCss.circleButtonTaskDetail} ${
                          isOrder && !won ? detailCss.starButtonLostActive : detailCss.starButtonLost
                        }`}
                        onClick={setLostDeal}
                      >
                        <div />
                      </div>
                    }
                  />
                </div>
              </div>
              <div className={css.detailTaskGroupButton}>
                <Popup
                  style={{ fontSize: 11 }}
                  content={_l`Favourites`}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail}>
                      {!qualifiedDeal.favorite && (
                        <a href="#" onClick={setFavoriteDeal}>
                          <img style={{ height: '15px', width: '15px' }} src={starIcon} />
                        </a>
                      )}
                      {qualifiedDeal.favorite && (
                        <a href="#" onClick={setFavoriteDeal}>
                          <img style={{ height: '15px', width: '15px' }} src={starIconActive} />
                        </a>
                      )}
                    </div>
                  }
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={onEdit}>
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
                        unhighlight(overviewType, qualifiedDeal.uuid);
                        const checkCurrent = (location.pathname.match(/\//g) || []).length === 3;
                        const checkCurrentDetail = location.pathname.includes('pipeline/overview');
                        if (checkCurrentDetail && checkCurrent) {
                          return history.push('/pipeline/overview');
                        }
                        history.goBack();
                      }}
                      className={localCss.circleButtonTaskDetail}
                    >
                      <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={add} />
                      {/* <Link to={qualifiedDeal.won !== null ? '/pipeline/orders' : '/pipeline/overview'}>
              </Link> */}
                  </div>}
                  content={_l`Close`}
                  position="top center"
                />
              </div>
            </div>
            <ContactQualified
              history={history}
              route={route}
              isOrder={isOrder}
              currency={currency}
              color={color}
              qualifiedDeal={qualifiedDeal}
            />

            <QualifiedPaneMenu route={route} objectType={ObjectTypes.PipelineQualified} qualifiedDeal={qualifiedDeal} />
            {qualifiedSections.map((key, index) => {
              return (
                <Draggable key={`QUALIFIED_${key}`} index={index} draggableId={`QUALIFIED_${key}`}>
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

            {/* <Workload data={qualifiedDeal}/> */}
            {/* <SuggestNextStep data={qualifiedDeal}/> */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    const { currency } = state.ui.app;

    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};
    return {
      qualifiedDeal: state.entities.qualifiedDeal.__DETAIL,
      currency: currency ? currency : 'SEK',
      qualifiedSections: detailSectionsDisplay.qualifiedSections || [],
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Pipeline.Qualified,
  }),

  connect(makeMapStateToProps, {
    fetchQualifiedDetail,
    setFavoriteDeal,
    fetchNumberOrderRow,
    highlight: OverviewActions.highlight,
    updateEntity,
    contactItem,
    organisationItem,
    prospectConcatItem,
    unhighlight: OverviewActions.unhighlight,
    updateCategoryDetailSections,
    updateInfoForDetailToEdit,
  }),
  lifecycle({
    componentDidUpdate(prevProps, prevState) {
      const { qualifiedDeal, prospectConcatItem } = this.props;
      prospectConcatItem(qualifiedDeal);
    },
  }),
  withGetData(({ fetchQualifiedDetail, match: { params: { qualifiedDealId } }, overviewType }) => () => {
    fetchQualifiedDetail(qualifiedDealId);
  }),
  withHandlers({
    setFavoriteDeal: ({ qualifiedDeal, setFavoriteDeal }) => (e) => {
      e.stopPropagation();
      setFavoriteDeal(qualifiedDeal.uuid, !qualifiedDeal.favorite);
    },
    setLostDeal: ({ highlight, overviewType, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      if (qualifiedDeal.won != null && !qualifiedDeal.won) {
        return;
      }
      highlight(overviewType, qualifiedDeal.uuid, 'set_lost_qualified_deal');
    },
    setWonDeal: ({ fetchNumberOrderRow, overviewType, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      if (qualifiedDeal.won != null && qualifiedDeal.won) {
        return;
      }
      fetchNumberOrderRow(qualifiedDeal.uuid, overviewType);
    },
    onEdit: ({
      route,
      overviewType,
      qualifiedDeal,
      highlight,
      updateEntity,
      contactItem,
      organisationItem,
      updateInfoForDetailToEdit,
    }) => (e) => {
      let path = window.location.pathname;
      if (path.includes('pipeline/order') || path.includes(`${route}/order`)) {
        updateInfoForDetailToEdit({ qualifiedDealId: qualifiedDeal.uuid });
        e.stopPropagation();
        updateEntity();
        highlight(OverviewTypes.Pipeline.Order, qualifiedDeal.uuid, 'editOrder');
      } else if (path.includes('pipeline/overview') || path.includes(`${route}/qualified`)) {
        updateInfoForDetailToEdit({ qualifiedDealId: qualifiedDeal.uuid });
        e.stopPropagation();
        contactItem(qualifiedDeal.sponsorList);
        organisationItem({ uuid: qualifiedDeal.organisationId, name: qualifiedDeal.organisationName });
        updateEntity();
        highlight(overviewType, qualifiedDeal.uuid, 'edit');
      }
    },
  }),
  branch(({ qualifiedDeal }) => !qualifiedDeal, renderComponent(QualifiedDealDetailPlaceHolder))
)(QualifiedDetail);

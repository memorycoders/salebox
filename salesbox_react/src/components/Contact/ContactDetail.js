//@flow
import * as React from 'react';

// import { Button } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers, defaultProps, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCategoryDetailSections } from '../../components/App/app.actions';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetContact } from 'components/Contact/contact.selector';
import { ContentLoader } from 'components/Svg';
import { Popup } from 'semantic-ui-react';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as ContactActions from './contact.actions';
import { ObjectTypes, OverviewTypes, CssNames } from 'Constants';
import ContactPane from 'components/Contact/ContactPane/ContactPane';
import ContactPaneMenu from 'components/Contact/ContactPaneMenu/ContactPaneMenu';
import CustomFieldsPane from 'components/CustomField/CustomFieldsPane';
import SalesPane from 'components/Contact/SalesPane/SalesPane';
// import PipelinePane from 'components/Contact/PipelinePane/PipelinePane';
// import StatisticsPane from 'components/Contact/StatisticsPane/StatisticsPane';
import LatestCommunicationPane from 'components/Contact/LatestCommunicationPane/LatestCommunicationPane';
import ContactTeamPane from 'components/Contact/ContactTeamPane/ContactTeamPane';
import MultiRelationsPane from 'components/MultiRelation/MultiRelationsPane';
import starSvg from '../../../public/myStar.svg';
import starActiveSvg from '../../../public/myStar_active.png';
// import { ContactActionMenu } from 'essentials';
import add from '../../../public/Add.svg';
import localCss from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail.css';
import CallListPane from './CallList/CallListPane';
import _l from '../../lib/i18n';
import { organisationItem } from '../../components/Organisation/organisation.actions';
import { concatType } from '../../components/Type/type.actions';
import { isSignedIn } from '../../components/Auth/auth.selector';
import { STATUS_MSTEAMS_OF_CONTACT } from '../../Constants';
import SpecialCustomField from './SpecialCustomField/SpecialCustomField';

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

const ContactDetail = ({
  handleToggleFavorite,
  color = CssNames.Contact,
  contact,
  editContact,
  contactDetail,
  setFavoriteDeal,
  overviewType,
  history,
  route,
  unhighlight,
  isOrigin,
  linkTo,
  overviewTypeHightlight,
  contactSections,
  updateCategoryDetailSections,
  isConnectMsTeams,
  statusMsTeamsOfContact,
  clickIconMSTeams,
  handleCheckConnectMsTeams,
}: PropsT) => {
  const contactShow = contactDetail ? contactDetail : contact;
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(contactSections, result.source.index, result.destination.index);
    updateCategoryDetailSections('contactSections', items);
  };

  const renderPane = (key, index) => {
    switch (key) {
      case 'LatestCommunicationPane':
        return (
          <LatestCommunicationPane
            overviewType={overviewType}
            objectType={ObjectTypes.Contact}
            contact={{
              ...contactShow,
              latestCommunication: contactShow.latestCommunicationHistoryDTOList,
            }}
          />
        );
      case 'CustomFieldsPane':
        return (
          <CustomFieldsPane
            isConnectTeams={statusMsTeamsOfContact && statusMsTeamsOfContact.msTeamsId}
            isDetail
            object={contactShow}
            customFields={contactShow.customFields}
            objectType={ObjectTypes.Contact}
            objectId={contactShow.uuid}
          />
        );
      case 'SalesPane':
        return <SalesPane item={contactShow} growthType="Contact growth" />;
      case 'CallListPane':
        return <CallListPane overviewType={OverviewTypes.Contact} contact={contactShow} />;
      case 'MultiRelationsPane':
        return (
          <MultiRelationsPane
            multiRelations={contact.multiRelations}
            objectType={ObjectTypes.Contact}
            objectId={contact.uuid}
            overviewType={overviewType}
            parentName={contact.fullName}
          />
        );
      case 'ContactTeamPane':
        return (
          <ContactTeamPane
            contact={{
              ...contactShow,
              participants: contactShow && contactShow.participantList ? contactShow.participantList : [],
            }}
          />
        );
      default:
        break;
    }
  };

  const getStatusMsTeams = () => {
    console.log("getStatusMsTeams -> getStatusMsTeams")
    if (isConnectMsTeams && statusMsTeamsOfContact) {
      switch (statusMsTeamsOfContact.status) {
        case STATUS_MSTEAMS_OF_CONTACT.CONTACT_NOT_CONNECTED_TO_USER_IN_TEAMS:
          return `${css.notConnet} ${css.iconMsTeams}`;
        case STATUS_MSTEAMS_OF_CONTACT.AVAILABLE:
          return `${css.online} ${css.iconMsTeams}`;
        case STATUS_MSTEAMS_OF_CONTACT.BE_RIGHT_BACK:
        case STATUS_MSTEAMS_OF_CONTACT.AWAY:
          return `${css.doNotDisturb} ${css.iconMsTeams}`;
        case STATUS_MSTEAMS_OF_CONTACT.BUSY:
        case STATUS_MSTEAMS_OF_CONTACT.DO_NOT_DISTURB:
        case STATUS_MSTEAMS_OF_CONTACT.OFFLINE:
          return `${css.offline} ${css.iconMsTeams}`;
        default:
          return `${css.notConnet} ${css.iconMsTeams}`;
      }
    }
  };

  const getStatusContactMsTeams = () => {
    if (isConnectMsTeams && statusMsTeamsOfContact) {
      switch (statusMsTeamsOfContact.status) {
        case STATUS_MSTEAMS_OF_CONTACT.CONTACT_NOT_CONNECTED_TO_USER_IN_TEAMS:
          return _l`Invite`;
        case STATUS_MSTEAMS_OF_CONTACT.AVAILABLE:
          return _l`Available`;
        case STATUS_MSTEAMS_OF_CONTACT.BE_RIGHT_BACK:
        case STATUS_MSTEAMS_OF_CONTACT.AWAY:
          return _l`Away`;
        case STATUS_MSTEAMS_OF_CONTACT.BUSY:
        case STATUS_MSTEAMS_OF_CONTACT.DO_NOT_DISTURB:
        case STATUS_MSTEAMS_OF_CONTACT.OFFLINE:
          return _l`Busy`;
        case STATUS_MSTEAMS_OF_CONTACT.PRESENCE_UNKNOWN:
          return _l`Invited`;
        default:
          return _l`Invite`;
      }
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
              {getStatusContactMsTeams() ? (
                <Popup
                  trigger={<div className={getStatusMsTeams()} onClick={handleCheckConnectMsTeams} ></div>}
                  content={<p>{getStatusContactMsTeams()}</p>}
                />
              ) : (
                <div className={getStatusMsTeams()}  onClick={handleCheckConnectMsTeams}></div>
              )}
              <div className={css.date}></div>
              <div className={css.detailTaskGroupButton}>
                <Popup
                  style={{ fontSize: 11 }}
                  content={_l`Favourites`}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail}>
                      {!contact.favorite && (
                        <img
                          src={starSvg}
                          style={{ marginTop: '0px', marginLeft: '0px', height: 15, width: 15 }}
                          onClick={handleToggleFavorite}
                        />
                      )}
                      {contact.favorite && (
                        <img
                          src={starActiveSvg}
                          style={{ marginTop: '0px', marginLeft: '0px', height: 15, width: 15 }}
                          onClick={handleToggleFavorite}
                        />
                      )}
                    </div>
                  }
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={editContact}>
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
                          unhighlight(overviewTypeHightlight, contact.uuid);
                          return history.push(linkTo);
                        }
                        unhighlight(overviewType, contact.uuid);
                        const checkCurrent = (location.pathname.match(/\//g) || []).length === 2;
                        const checkCurrentDetail = location.pathname.includes('contacts');
                        if (checkCurrentDetail && checkCurrent) {
                          return history.push('/contacts');
                        }
                        if(location.pathname.includes('recruitment/active')) {
                          return history.push('/recruitment/active');
                        }
                         if(location.pathname.includes('recruitment/closed')) {
                          return history.push('/recruitment/closed');
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
            <ContactPane
              route={route}
              history={history}
              organisation={{}}
              contact={{
                ...contact,
                ...contactDetail,
              }}
              color={color}
              isContactDeatail
            />
            <ContactPaneMenu route={route} contact={contactShow} />
            {/* {statusMsTeamsOfContact && statusMsTeamsOfContact.msTeamsId ? <SpecialCustomField /> : null} */}
            {contactSections.map((key, index) => {
              return (
                <Draggable key={`CONTACT_${key}`} index={index} draggableId={`CONTACT_${key}`}>
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
  const getContact = makeGetContact();
  const mapStateToProps = (state, props) => {
    const {
      match: {
        params: { contactId },
      },
    } = props;
    let contactDetail = state.entities.contact.__DETAIL || {};
    if (contactId !== contactDetail.uuid) {
      contactDetail = {};
    }

    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};
    return {
      statusMsTeamsOfContact: state.entities.contact.statusMsTeams,
      isConnectMsTeams: state.common.isConnectMsTeams,
      contact: getContact(state, props.match.params.contactId),
      contactDetail,
      contactSections: detailSectionsDisplay.contactSections || [],
      isSignedIn: isSignedIn(state),
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = {
  requestFetchContact: ContactActions.requestFetchContact,
  editEntity: ContactActions.editEntity,
  toggleFavoriteRequest: ContactActions.toggleFavoriteRequest,
  highlight: OverviewActions.highlight,
  organisationItem,
  concatType,
  unhighlight: OverviewActions.unhighlight,
  updateCategoryDetailSections,
  requestFetchContactDetailToEdit: ContactActions.requestFetchContactDetailToEdit,
  checkIfContactExistedInTeams: ContactActions.checkIfContactExistedInTeams,
  showListChannelMsTeam: ContactActions.showListChannelMsTeam,
  showPopupInviteToTeam: ContactActions.showPopupInviteToTeam
};

export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.Contact,
  }),
  connect(makeMapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.isSignedIn) {
        const {
          requestFetchContact,
          match: {
            params: { contactId },
          },
        } = this.props;
        const {
          match: {
            params: { contactId: nextContactId },
          },
        } = nextProps;
        if (contactId !== nextContactId) {
          requestFetchContact(nextContactId);
        }
      }
    },
  }),
  withGetData(({ requestFetchContact, match: { params: { contactId } } }) => () => {
    requestFetchContact(contactId);
  }),
  withState('clickIconMSTeams', 'handleClickIconMSTeams', false),
  withHandlers({
    editContact: ({
      editEntity,
      overviewType,
      contact,
      highlight,
      contactDetail,
      organisationItem,
      concatType,
      requestFetchContactDetailToEdit,
    }) => () => {
      requestFetchContactDetailToEdit(contact.uuid);

      const contactShow = contactDetail ? contactDetail : contact;
      if (contactShow.organisationId) {
        organisationItem({ uuid: contactShow.organisationId, name: contactShow.organisationName });
      }
      if (contactShow.relation) {
        concatType(contactShow.relation);
      }
      highlight(overviewType, contact.uuid, 'edit');
      editEntity(overviewType, contactShow);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, contact }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(contact.uuid, !contact.favorite);
    },
    handleCheckConnectMsTeams: ({
      checkIfContactExistedInTeams,
      showListChannelMsTeam,
      statusMsTeamsOfContact,
      contact,
      showPopupInviteToTeam
    }) => () => {
      if (statusMsTeamsOfContact.msTeamsId) {
        showListChannelMsTeam(true);
      } else {
        console.log("MEEEshowPopupInviteToTeam")

        showPopupInviteToTeam(true);
      }
    },
  }),
  branch(({ contact }) => !contact, renderComponent(ContactDetailPlaceHolder))
)(ContactDetail);

//@flow
import * as React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { updateCategoryDetailSections } from '../../components/App/app.actions';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import localCss from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetAppointment } from 'components/Appointment/appointment.selector';
import { ContentLoader } from 'components/Svg';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as AppointmentActions from 'components/Appointment/appointment.actions';
import ContactPane from 'components/Contact/ContactPane/ContactPane';
import AppointmentPane from '../../components/Appointment/AppointmentPane/AppointmentPane';
import ContactsCard from 'components/Organisation/Cards/ContactsCard';
import ContactList from '../../components/Appointment/ContactList/ContactList';
import add from '../../../public/Add.svg';
import OrganisationPane from 'components/Organisation/OrganisationPane/OrganisationPane';
import NotePane from 'components/Note/NotePane/NotePane';
import { CreatorPane } from '../../components/User';
import InviteeList from 'components/Appointment/InviteeList/InviteeList';
import FocusPane from 'components/Focus/FocusPane/FocusPane';
import AppointmentActionMenu from 'components/Appointment/AppointmentActionMenu/AppointmentActionMenu';
import { ProspectPane } from 'components/Prospect';
import { CssNames, OverviewTypes } from 'Constants';
import { CreateNotePane } from '../../components/Note';
import GoogleMap1 from '../../components/GoogleMap/GoogleMap';
import CustomFieldPane from '../../components/CustomField/CustomFieldsPane';
import _l from 'lib/i18n';
import { ObjectTypes } from '../../Constants';

import iconMs from '../../../public/icon_ms_teams.png';

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
    Note: 'Note',
    Creator: 'Creator',
    Invitees: 'Invitees',
  },
});

type PropsT = {
  appointment: {},
  editAppointment: () => void,
  deleteAppointment: () => void,
  color: string,
  overviewUrl: string,
};

const AppointmentDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const AppointmentDetail = ({
  appointmentSections,
  updateCategoryDetailSections,
  route,
  clearHighlight,
  history,
  handleNoteChange,
  overviewUrl = '/activities/appointments',
  color = CssNames.Activity,
  appointmentInList,
  editAppointment,
  __DETAIL,
  overviewType,
  unQualifiedDeals,
  unQualifiedDetail,
  deleteAppointment,
}: PropsT) => {
  let appointment = __DETAIL ? __DETAIL : appointmentInList;
  let unQuanlified = null;
  if (appointment.leadId) {
    unQuanlified =
      unQualifiedDeals[appointment?.leadId] || (unQualifiedDetail?.uuid == appointment?.leadId ? unQualifiedDetail : null);
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(appointmentSections, result.source.index, result.destination.index);

    updateCategoryDetailSections('appointmentSections', items);
  };

  const renderPane = (key, index) => {
    switch (key) {
      case 'FocusPane':
        return <FocusPane title={_l`Meeting focus`} overviewType={overviewType} focus={appointment.focusWorkData} />;
      case 'CustomFieldPane':
        return (
          <CustomFieldPane
            colId={`appointment-detail-custom-field-dropdown`}
            object={appointment}
            objectType={ObjectTypes.Appointment}
            objectId={appointment.uuid}
          />
        );
      case 'CreateNotePane':
        return <CreateNotePane onChange={handleNoteChange} note={appointment.note} />;

      case 'ContactList':
        return appointment.contactList && appointment.contactList.length > 0 ? (
          <ContactList list={appointment.contactList ? appointment.contactList : []} />
        ) : (
          <div></div>
        );
      case 'InviteeList':
        return <InviteeList appointment={appointment} invitees={appointment.inviteeList} />;
      case 'ProspectPane':
        return (
          <ProspectPane
            route={location.pathname.includes('calendar') ? 'activities/calendar' : 'activities/appointments'}
            unQualified={unQuanlified}
            task={appointment}
            // hasShowConnect
            prospect={appointment.prospect || {}}
            overviewType={overviewType}
          />
        );
      case 'CreatorPane':
        return <CreatorPane size={40} creator={appointment.owner || {}} />;
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
                <div className={localCss.leftGroup}>
                  {appointment.onlineMeeting && (
                    <Popup
                      style={historyTooltip}
                      trigger={
                        <div
                          className={localCss.circleButtonTaskDetail}
                          onClick={() => {
                            window.open(appointment.onlineMeetingJoinUrl);
                          }}
                        >
                          <img
                            className={`${localCss.closeIcon} ${localCss.detailIconSize}`}
                            style={{ width: 25, height: 25, transform: 'rotate(0deg)' }}
                            src={iconMs}
                          />
                        </div>
                      }
                      content={_l`Teams`}
                      position="top center"
                    />
                  )}
                </div>
              </div>
              <div className={css.detailTaskGroupButton}>
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={deleteAppointment}>
                      <Icon name="trash alternate" color="grey" size="large" style={{ fontSize: '1.4em' }} />
                    </div>
                  }
                  content={_l`Delete`}
                  position="top center"
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={editAppointment}>
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
                        clearHighlight(overviewType, appointment.uuid);
                        const checkCurrent = (location.pathname.match(/\//g) || []).length === 3;
                        const checkCurrentDetail = location.pathname.includes('activities/appointments');
                        if (checkCurrentDetail && checkCurrent) {
                          return history.push('/activities/appointments');
                        }
                        history.goBack();
                      }}
                      className={localCss.circleButtonTaskDetail}
                    >
                      <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={add} />
                      {/* <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={add} /> */}
                    </div>
                  }
                  content={_l`Close`}
                  position="top center"
                />
              </div>
            </div>
            <AppointmentPane
              route={route}
              history={history}
              fallbackIcon="user outline"
              appointment={appointment}
              color={color}
            ></AppointmentPane>
            {/* {appointment && appointment.onlineMeeting ? null : <GoogleMap1 appointment={appointment} />} */}

            {appointmentSections.map((key, index) => {
              return (
                <Draggable key={`APPOINTMENT_${key}`} index={index} draggableId={`APPOINTMENT_${key}`}>
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
  const getAppointment = makeGetAppointment();
  const mapStateToProps = (state, props) => {
    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};
    return {
      appointmentInList: getAppointment(state, props.match.params.appointmentId),
      __DETAIL: state.entities.appointment.__DETAIL,
      editFormShown: state.ui.delegation.appointmentIdToEdit !== null,
      unQualifiedDeals: state.entities.lead,
      unQualifiedDetail: state.entities.unqualifiedDeal.__DETAIL,
      appointmentSections: detailSectionsDisplay.appointmentSections,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    changeNote: AppointmentActions.updateNoteSaga,
    requestFetchAppointment: AppointmentActions.requestFetchAppointment,
    editAppointment: AppointmentActions.editAppointment,
    highlight: OverviewActions.highlight,
    clearHighlight: OverviewActions.unhighlight,
    updateCategoryDetailSections,
  }),
  withGetData(({ requestFetchAppointment, match: { params: { appointmentId } } }) => () => {
    requestFetchAppointment(appointmentId);
  }),
  withHandlers({
    handleNoteChange: ({ changeNote, __DETAIL }) => (newNote) => changeNote(__DETAIL.uuid, newNote),
    editAppointment: ({ editAppointment, __DETAIL, highlight }) => () => {
      editAppointment(__DETAIL.uuid);
      highlight(OverviewTypes.Activity.Appointment, __DETAIL.uuid, 'edit');
    },
    deleteAppointment: ({ overviewType, highlight, __DETAIL }) => () => {
      highlight(OverviewTypes.Activity.Appointment, __DETAIL.uuid, 'delete');
    },
  })
)(AppointmentDetail);

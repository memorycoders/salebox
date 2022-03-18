//@flow
import * as React from 'react';
import { Icon, Popup } from 'semantic-ui-react';

import { TaskActionMenu } from 'essentials';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { compose, branch, renderComponent, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import css from 'components/Lead/LeadDetail.css';
import { withGetData } from 'lib/hocHelpers';
import { makeGetTask } from 'components/Task/task.selector';
import { updateCategoryDetailSections } from '../../components/App/app.actions';
import * as delegationActions from 'components/Delegation/delegation.actions';
import CustomFieldPane from '../../components/CustomField/CustomFieldsPane';
import { ContentLoader } from 'components/Svg';
import Deadline from 'components/Deadline/Deadline';
import { ProspectPane } from 'components/Prospect';
import { CreateNotePane } from '../../components/Note';
import { FocusPane } from 'components/Focus';
import { CreatorPane } from '../../components/User';
import ContactPane from '../../components/Contact/ContactPane/ContactPane';
import AccountPane from '../../components/Organisation/AccountPane/AccountPane';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as TaskActions from 'components/Task/task.actions';
import { updateEdit, fetchLead, clearErrors } from 'components/Task/task.actions';
import { CssNames, OverviewTypes } from 'Constants';
import localCss from './TaskDetail.css';
import add from '../../../public/Add.svg';
import { ObjectTypes } from '../../Constants';
import _l from 'lib/i18n';
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
  task: {},
  editTask: () => void,
  setTask: () => void,
  overviewType: string,
  color: string,
  handleNoteChange: (string) => void,
};

const TaskDetailPlaceHolder = () => (
  <ContentLoader width={380} height={380}>
    <rect x={8} y={24} rx={4} ry={4} width={292} height={8} />
    <rect x={316} y={24} rx={4} ry={4} width={48} height={8} />
    {[0, 1, 2, 3, 4, 5, 6].map((item) => {
      return <rect key={item} x={8} y={60 + item * 24} rx={4} ry={4} width={Math.random() * 300} height={8} />;
    })}
  </ContentLoader>
);

const TaskDetail = ({
  updateCategoryDetailSections,
  taskSections,
  route,
  __DETAIL,
  clearHighlight,
  history,
  handleNoteChange,
  overviewType,
  color = CssNames.Task,
  task,
  editTask,
  setTask,
  unQualifiedDeals,
}: PropsT) => {
  let unQuanlified = null;

  if (task.leadId) {
    unQuanlified = unQualifiedDeals[task.leadId];
  }
  const calculatingPositionMenuDropdown = (id, classDialog, domIdWrapAD) => {
    let dropdown = document.getElementById(id);
    if (dropdown) {
      let _widthDropdown = dropdown.offsetWidth;
      let _menu = dropdown.getElementsByClassName(`${classDialog ? classDialog : 'menu'}`)[0];
      if (_menu) {
        _menu.style.width = _widthDropdown;
        _menu.style.minWidth = _widthDropdown;
        _menu.style.top = dropdown.offsetTop + 28 - document.getElementById(domIdWrapAD).scrollTop;
        _menu.style.left = dropdown.offsetLeft;
        _menu = null;
      }
    }
    dropdown = null;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const isDelegation = overviewType === 'DELEGATION_TASKS';
    const items = reorder(taskSections, result.source.index, result.destination.index);

    updateCategoryDetailSections(isDelegation ? 'delegationTaskSections' : 'taskSections', items);
  };

  const renderPane = (key, index) => {
    switch (key) {
      case 'FocusPane':
        return (
          <Draggable key={'TASK_FOCUS_PANE'} index={index} draggableId={'TASK_FOCUS_PANE'}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
              >
                <FocusPane
                  color={task.tag ? task.tag.colorCode : '#fff'}
                  focus={task.focus}
                  overviewType={overviewType}
                />
              </div>
            )}
          </Draggable>
        );
      case 'CustomFieldPane':
        return (
          <Draggable key={'TASK_CUSTOM_FIELD_PANE'} index={index} draggableId={'TASK_CUSTOM_FIELD_PANE'}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
              >
                <CustomFieldPane
                  colId={`task-detail-custom-field-dropdown`}
                  calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                  object={task}
                  objectType={ObjectTypes.Task}
                  objectId={task.uuid}
                />
              </div>
            )}
          </Draggable>
        );
      case 'CreateNotePane':
        return (
          <Draggable key={'TASK_CREATE_NOTE_PANE'} index={index} draggableId={'TASK_CREATE_NOTE_PANE'}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
              >
                <CreateNotePane onChange={handleNoteChange} note={task.note} />
              </div>
            )}
          </Draggable>
        );
      case 'ProspectPane':
        return (
          <Draggable key={'TASK_PROSPECT_PANE'} index={index} draggableId={'TASK_PROSPECT_PANE'}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
              >
                <ProspectPane
                  route={route}
                  unQualified={unQuanlified}
                  prospect={task.prospect}
                  task={task}
                  overviewType={overviewType}
                />
              </div>
            )}
          </Draggable>
        );
      case 'CreatorPane':
        return (
          <Draggable key={'TASK_CREATOR_PANE'} index={index} draggableId={'TASK_CREATOR_PANE'}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
              >
                <CreatorPane size={40} creator={task.creator} />
              </div>
            )}
          </Draggable>
        );

      default:
        break;
    }
  };
//console.log('task',task);
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
                <Deadline className={css['font-half-11']} date={task.dateAndTime} />
              </div>
              <div className={css.detailTaskGroupButton}>
                {!task.finished && (
                  <Popup
                    style={historyTooltip}
                    trigger={
                      <div className={localCss.circleButtonTaskDetail}>
                        <img
                          className={localCss.detailIconSize}
                          src={require('../../../public/Check.svg')}
                          onClick={setTask}
                        />
                      </div>
                    }
                    content={_l`Set as done`}
                    position="top center"
                  />
                )}
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail} onClick={editTask}>
                      {!task.finished && (
                        <img className={localCss.detailIconSize} src={require('../../../public/Edit.svg')} />
                      )}
                    </div>
                  }
                  content={_l`Update`}
                  position="top center"
                />
                <Popup
                  style={historyTooltip}
                  trigger={
                    <div className={localCss.circleButtonTaskDetail}>
                      <img
                        onClick={() => {
                          const checkCurrent = (location.pathname.match(/\//g) || []).length === 3;
                          clearHighlight(overviewType, task.uuid);
                          const checkCurrentDetail = location.pathname.includes('activities/task');
                          if (checkCurrentDetail && checkCurrent) {
                            return history.push('/activities');
                          }
                          history.goBack();
                        }}
                        className={`${localCss.closeIcon} ${localCss.detailIconSize}`}
                        src={add}
                      />
                    </div>
                  }
                  content={_l`Close`}
                  position="top center"
                />
              </div>
            </div>
            {task.contactId && task.organisationDTO ? (
              <ContactPane
                __DETAIL={__DETAIL}
                task={task}
                route={route}
                history={history}
                organisation={task.organisation}
                contact={task.contact}
                color={color}
              />
            ) : task.contactId && !task.organisationDTO ? (
              <ContactPane
                __DETAIL={__DETAIL}
                task={task}
                route={route}
                history={history}
                organisation={task.organisation}
                contact={task.contact}
                color={color}
              />
            ) : !task.contactId && task.organisationDTO ? (
              <AccountPane
                __DETAIL={__DETAIL}
                task={task}
                route={route}
                history={history}
                account={task.organisation}
                contact={task.contact}
                color={color}
              />
                ) : <ContactPane
                    __DETAIL={__DETAIL}
                    task={task}
                    route={route}
                    history={history}
                    organisation={task.organisation}
                    contact={task.contact}
                    color={color}
                  />}
            {taskSections.map((key, index) => {
              return renderPane(key, index);
            })}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, props) => {
    const { overviewType } = props;
    const isDelegation = overviewType === 'DELEGATION_TASKS';
    const detailSectionsDisplay = state.ui.app.detailSectionsDisplay || {};

    return {
      task: getTask(state, props.match.params.taskId),
      __DETAIL: state.entities.task.__DETAIL || {},
      unQualifiedDeals: state.entities.lead,
      editFormShown: state.ui.delegation.taskIdToEdit !== null,
      taskSections:
       detailSectionsDisplay.taskSections
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    changeNote: TaskActions.updateNoteSaga,
    requestFetchTask: delegationActions.requestFetchTask,
    highlight: OverviewActions.highlight,
    clearHighlight: OverviewActions.unhighlight,
    updateEdit,
    fetchLead,
    clearErrors,
    updateCategoryDetailSections,
  }),

  lifecycle({
    componentWillReceiveProps(nextProps) {
      // const { requestFetchTask, match: { params: { taskId } } } = this.props;
      // if (nextProps.match.params.taskId !== taskId && nextProps.match.params.taskId){
      //   requestFetchTask(nextProps.match.params.taskId);
      // }
    },
  }),
  withGetData(({ updateCategoryDetailSections, requestFetchTask, match: { params: { taskId } } }) => () => {
    requestFetchTask(taskId);
  }),
  withHandlers({
    handleNoteChange: ({ changeNote, task }) => (newNote) => changeNote(task.uuid, newNote),
    editTask: ({ highlight, overviewType, task, updateEdit, fetchLead, clearErrors }) => () => {
      highlight(overviewType, task.uuid, 'edit');
      updateEdit(task);
      fetchLead(task.uuid);
      clearErrors();
    },
    setTask: ({ overviewType, highlight, task }) => () => {
      highlight(overviewType, task.uuid, 'set');
    },
  }),
  branch(({ task }) => !task || !task.creator, renderComponent(TaskDetailPlaceHolder))
)(TaskDetail);

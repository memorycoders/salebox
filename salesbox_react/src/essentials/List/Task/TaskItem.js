// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import Avatar from '../../../components/Avatar/Avatar';
import { Icon, Popup, Button } from 'semantic-ui-react';
import ContactPopup from '../../../components/Contact/ContactPopup';
import CreatorPane from '../../../components/User/CreatorPane/CreatorPane';
import { TaskActionMenu } from 'essentials';
import * as OverviewActions from 'components/Overview/overview.actions';
// import * as contactActions from 'components/Contact/contact.actions';
import { makeGetTask } from 'components/Task/task.selector';
import HistoryActionMenu from '../../Menu/HistoryActionMenu';
import cx from 'classnames';
import css from './TaskItem.css';
import overviewCss from 'components/Overview/Overview.css';
import Moment from 'react-moment';
import moment from 'moment';
import { DateTimeFormat, OverviewTypes, ObjectTypes } from 'Constants';
import { updateEdit } from 'components/Task/task.actions';
import FocusPopup from '../../../components/Focus/FocusPopup';

import _l from 'lib/i18n';
import { withRouter } from 'react-router';
addTranslations({
  'en-US': {
    Deadline: 'Deadline',
    Who: 'Who',
    Focus: 'Focus',
    'Resp.': 'Resp.',
  },
});

type PropsT = {
  task: {},
};

const TaskListHeader = ({ orderBy, setOrderBy, objectType }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div onClick={() => setOrderBy('dateAndTime')} className={css.dealine}>
        <span>
          {_l`Deadline`}
          <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => setOrderBy('accountContact')} className={css.who}>
        <span>
          {_l`Who`}
          <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div className={css.info} />
      <div onClick={() => setOrderBy('focus')} className={css.focus}>
        <span>
          {_l`Focus`}
          <span className={orderBy === 'focus' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      {/* <div className={css.mask} /> */}
      <div
        onClick={() => {
          setOrderBy('owner');
        }}
        className={css.resp}
      >
        <span style={{ marginLeft: 6 }}>
          {_l`Resp.`}
          <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
    </div>
  );
};

const TaskItem = ({
  task,
  overviewType,
  acceptedDelegate,
  declineDelegate,
  setTask,
  setActionInHistoryTask,
  route,
  history,
}: PropsT) => {
  const renderActionSpinder = () => {
    if (task.accepted === null && task.type === 'INVITED') {
      return (
        <div className={css.responsibleRow}>
          <Avatar
            size={30}
            fallbackIcon="user"
            isShowName
            src={task.ownerAvatar}
            firstName={task.ownerFirstName}
            lastName={task.ownerLastName}
          />
          <div className={css.invitedBtn}>
            <a onClick={acceptedDelegate} className={css.accpetInvited}>{_l`Accept`}</a>
            <a onClick={declineDelegate} className={css.declineInvited}>{_l`Decline`}</a>
          </div>
        </div>
      );
    }
    return (
      <div className={css.responsibleRow}>
        <Avatar
          size={30}
          fallbackIcon="user"
          isShowName
          src={task.ownerAvatar}
          firstName={task.ownerFirstName}
          lastName={task.ownerLastName}
        />
        <div className={css.rightMenu}>
          <div className={css.reponsibleIconSize}>
            <div
              className={!task.finished ? `${css.notSetasDone}` : `${css.setDone}`}
              onClick={!task.finished ? setTask : setActionInHistoryTask}
            >
              <div></div>
            </div>
          </div>
          <div className={css.reponsibleIconSize}>
            {task.finished ? (
              <HistoryActionMenu task={task} overviewType={overviewType} className={css.bgMore} />
            ) : task.type === 'MANUAL' || (task.type === 'INVITED' && task.owner && task.accepted) ? (
              <TaskActionMenu className={css.bgMore} task={task} overviewType={overviewType} />
            ) : (
              <div style={{ paddingRight: '20px' }}></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const listCn = cx(css.listItem, css[task.tag.color]);

  return (
    <div
      onClick={() => {
        if (route) {
          history.push(`${route}/tasks/${task.uuid}`);
        }
      }}
      className={listCn}
    >
      <div className={css.dealine}>
        {task.dateAndTime && (
          <div>
            <span
              className={
                moment(task.dateAndTime)
                  .format()
                  .valueOf() <
                moment()
                  .format()
                  .valueOf()
                  ? css.oldDate
                  : css.normalDate
              }
            >
              {moment(task.dateAndTime).format(DateTimeFormat.DATE_ONLY)}
            </span>
          </div>
        )}
        {task.dateAndTime && (
          <div>
            <span
              className={
                moment(task.dateAndTime)
                  .format()
                  .valueOf() <
                moment()
                  .format()
                  .valueOf()
                  ? css.oldDate
                  : css.normalDate
              }
            >
              {moment(task.dateAndTime).format(DateTimeFormat.TIME_ONLY)}
            </span>
          </div>
        )}
      </div>
      <div className={css.who}>
        <Avatar
          size={30}
          fallbackIcon="user"
          isShowName
          borderSize={3}
          src={task.contactAvatar}
          firstName={task.contactFirstName}
          lastName={task.contactLastName}
          border={task.relationship}
        />
      </div>
      <div className={css.info}>
        <ContactPopup
          triggerClassName={css.bgMore}
          name={task.contactName}
          email={task.contactEmail}
          phone={task.contactPhone}
        />
      </div>
      <div className={css.focus}>
        <FocusPopup focus={task.focus} />
      </div>
      {/* <div className={css.mask}>
        [c]
      </div> */}
      <div className={css.resp}>{renderActionSpinder()}</div>
      {/* <div className={css.button}>
        <TaskActionMenu overviewType={overviewType} className={css.bgMore} task={task} />
      </div> */}
    </div>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { taskId }) => ({
    task: getTask(state, taskId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  highlight: OverviewActions.highlight,
  updateEdit,
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(TaskListHeader)),
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    acceptedDelegate: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'acceptedDelegate');
    },
    declineDelegate: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'declineDelegate');
    },

    setTask: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'set');
    },
  })
)(TaskItem);

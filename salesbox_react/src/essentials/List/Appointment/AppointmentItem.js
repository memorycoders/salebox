// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Avatar from '../../../components/Avatar/Avatar';
import * as OverviewActions from 'components/Overview/overview.actions';
import cx from 'classnames';
import css from './AppointmentItem.css';
import moment from 'moment';
import AppointmentActionMenu from './AppointmentAction';
import { AppointmentLine } from './AppointmentLine';
import { Popup } from 'semantic-ui-react';

import _l from 'lib/i18n';
import { withRouter } from 'react-router';
addTranslations({
  'en-US': {
    Deadline: 'Deadline',
    Who: 'Who',
    Focus: 'Focus',
    'Resp.': 'Resp.',
    Where: 'Where',
  },
});

type PropsT = {
  task: {},
  onClose: () => void,
  onOpen: () => void,
  open: boolean,
};

const AppointmentListHeader = ({ orderBy, setOrderBy }) => {
  return (
    <div className={cx(css.listItem, css.header)}>
      <div className={css.showInfo}></div>
      <div onClick={() => setOrderBy('dateAndTime')} className={css.dateTime}>
        <span>
          {_l`When`}
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
      {/* <div onClick={() => setOrderBy('focus')} className={css.focus}>
                <span>{_l`Focus`}
                <span className={orderBy === 'focus' ? `${css.activeIcon}` : `${css.normalIcon}`}>
                    <i class="angle down icon"></i>
                    </span>
                    </span>
            </div> */}
      <div className={css.where} onClick={() => setOrderBy('location')}>
        <span>
          {_l`Where`}
          <span className={orderBy === 'location' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => setOrderBy('owner')} className={css.resp}>
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

const AppointmentItem = ({
  appointment,
  overviewType,
  acceptedDelegate,
  declineDelegate,
  setTask,
  setActionInHistoryTask,
  onClose,
  open,
  onOpen,
  history,
  route
}: PropsT) => {
  const { contactList, note, location, startDate, owner, endDate, organisation } = appointment;
  const renderActionSpinder = () => {
    return (
      <div className={css.responsibleRow}>
        <Avatar
          size={30}
          fallbackIcon="user"
          isShowName
          src={owner.avatar}
          firstName={owner.firstName}
          lastName={owner.lastName}
        />
        <div className={css.rightMenu}>
          {/* <div className={css.reponsibleIconSize}>
                        <div className={!appointment.finished ? `${css.notSetasDone}` : `${css.setDone}`}>
                            <div></div>
                        </div>
                    </div> */}
          <div className={css.reponsibleIconSize} onMouseEnter={onClose} onMouseLeave={onOpen}>
            <AppointmentActionMenu className={css.bgMore} appointment={appointment} overviewType={overviewType}/>
          </div>
        </div>
      </div>
    );
  };

  const listCn = cx(css.listItem, css[appointment.contactAccountRelation]);

  let avatar = null;
  let contactFirstName = '';
  let contactLastName = '';
  let relationship = null;
  if (contactList.length > 0) {
    avatar = contactList[0].avatar;
    contactFirstName = contactList[0].firstName;
    contactLastName = contactList[0].lastName;
    relationship = contactList[0].relation;
  }
  if (organisation && !avatar) {
    avatar = organisation.avatar;
  }
  const content = (
    <div onClick={()=>{
      if(route){
        history.push(`${route}/appointments/${appointment.uuid}`)
      }
    }} className={listCn}>
      <div className={css.showInfo}>
        <AppointmentLine finished={appointment.finished || endDate < moment().valueOf()} />
      </div>
      <div className={css.dateTime}>
        <div>
          <span> {moment(startDate).format('DD MMM, YYYY')}</span>
          <span> {moment(startDate).format('HH:mm')}</span>
        </div>
      </div>
      <div className={css.who}>
        <Avatar
          size={30}
          fallbackIcon="user"
          isShowName
          borderSize={3}
          src={avatar}
          firstName={contactFirstName}
          lastName={contactLastName}
          border={relationship}
        />
      </div>
      {/* <div className={css.focus}>
                {focusWorkData.name}
            </div> */}

      <div className={css.where}>{location}</div>
      <div className={css.resp}>{renderActionSpinder()}</div>
    </div>
  );
  if (!note) {
    return content;
  }
  return (
    <Popup
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      style={{ fontSize: 11, minWidth: 150 }}
      position="top center"
      trigger={content}
    >
      <Popup.Content>
        <div className={css.content}>{note}</div>
      </Popup.Content>
    </Popup>
  );
};

const mapDispatchToProps = {
  highlight: OverviewActions.highlight,
};

export default compose(
  withRouter,
  branch(({ header }) => header, renderComponent(AppointmentListHeader)),
  connect(null, mapDispatchToProps),
  withState('open', 'setOpen', false),
  withHandlers({
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
    onOpen: ({ setOpen }) => () => {
      setOpen(true);
    },
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
)(AppointmentItem);

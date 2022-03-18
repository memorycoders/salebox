// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import moment from 'moment';
import { Icon, Button, Popup } from 'semantic-ui-react';
import { makeGetUser } from 'components/User/user.selector';
import { highlight } from '../../Overview/overview.actions';
import { Avatar } from 'components';
import { CommunicationTypes, OverviewTypes } from 'Constants';
import smsSvg from '../../../../public/sms.svg';
import emailSvg from '../../../../public/email.svg';
import emailOpenSvg from '../../../../public/email_open.svg';
import emailNoActionSvg from '../../../../public/email_no_action.svg';
import answerCallSvg from '../../../../public/answer_call.svg';
import unAnswerCallSvg from '../../../../public/unanswer_call.svg';
import globalGreenSvg from '../../../../public/global_green.svg';
import globalGraySvg from '../../../../public/global.svg';
import receiveSvg from '../../../../public/mail.svg';
import noteSvg from '../../../../public/Orders.svg';
import documentSvg from '../../../../public/Documents.svg';
import msTeam from '../../../../public/msTeams_not_connect.png';
import css from './CommunicationItem.css';
import * as NotificationActions from '../../Notification/notification.actions';

type PropsT = {
  user: {},
  communication: {},
  type?: string,
};

addTranslations({
  'en-US': {
    'Really delete?': 'Really delete?',
    Email: 'Email',
    Call: 'Call',
    Video: 'Video',
    SMS: 'SMS',
  },
});

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
}

const EmailIcon = <Icon name="envelope outline" size="large" />;
const DefaultIcon = <Icon name="question" />;

const Email = ({ user, communication, type, style, highlight, overviewType }: PropsT) => {
  const shortenValue = (value) => {
    if (value && value.length > 13) {
      return value.slice(0, 13);
    }
    return value;
  };
  const text = type === CommunicationTypes.Email.Receiver ? _l`Received` : _l`Sent`;
  const colorIcon = type !== CommunicationTypes.Email.Receiver ? 'rgb(111,189,209)' : 'rgb(76,139,196)';
  const isTracking =
    communication.trackingCode || communication.trackingUrlCode || communication.trackingAttachmentCode;
  let iconFirst = null;
  let iconSecond = null;
  let iconThird = null;
  let receiveDateShow = '';
  if (isTracking) {
    const {
      receiveDate,
      receiveUrlDate,
      receiveAttachmentDate,
      trackingCode,
      trackingAttachmentCode,
      trackingUrlCode,
    } = communication;
    iconFirst = trackingCode ? (receiveDate ? 'rgb(171, 208,76)' : 'rgb(144,144,144)') : null;
    iconSecond = trackingUrlCode ? (receiveUrlDate ? globalGreenSvg : globalGraySvg) : null;
    iconThird = trackingAttachmentCode ? (receiveAttachmentDate ? documentSvg : documentSvg) : null;

    if (!receiveAttachmentDate && !receiveUrlDate) {
      receiveDateShow = receiveDate;
    }
    if (receiveAttachmentDate) {
      receiveDateShow = receiveAttachmentDate;
    }
    if (receiveUrlDate && !receiveAttachmentDate) {
      receiveDateShow = receiveUrlDate;
    }
  }

  // const trakingIcon = {
  //   mail: isTracking ? 'rgb(171, 208,76)' : 'rgb(144,144,144)',
  //   global: isTracking ? globalGreenSvg : globalGraySvg,
  // }
  return (
    <div
      onClick={() => {
        highlight(overviewType, null, 'communication_detail', communication);
      }}
      style={style}
      className={css.item}
    >
      <div className={css.info}>
        <div className={css.sentReceived}>{`${_l`Email`}-${text}`}</div>
        <div className={css.name}>
          {user && user.name && user.name.length > 0 ? (
            user.name.length > 13 ? (
              <Popup
                trigger={<div>{`${shortenValue(user.name)}...`}</div>}
                style={{ fontSize: 11 }}
                content={user.name}
              />
            ) : (
              user.name
            )
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={css.iconContent}>
        <Icon className={css.icon} style={{ color: colorIcon }} name={'mail'} />
        {type !== CommunicationTypes.Email.Receiver && (
          <div className={css.trackingIcon}>
            {iconFirst && <Icon className={css.icon} style={{ color: iconFirst }} name={'mail'} />}
            {iconSecond && <img className={css.icon} src={iconSecond} />}
            {iconThird && <img className={css.icon} src={iconThird} />}
          </div>
        )}
      </div>
      <div className={css.date}>
        {_l`${moment(communication.startDate).format('HH:mm DD MMM, YYYY')}`}
        <div className={css.receivedDate}>
          {receiveDateShow && _l`${moment(communication.receiveDate).format('HH:mm DD MMM, YYYY')}`}
        </div>
      </div>
      <div className={css.type}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            highlight(overviewType, null, 'delete_communication', communication);
          }}
          className={css.deleteButton}
          icon="delete"
          size="mini"
        />
      </div>
    </div>
  );
};

const CallDialSMS = ({ user, communication, type, style, highlight, overviewType }: PropsT) => {
  const text =
    type === CommunicationTypes.Call
      ? _l`Call`
      : type === CommunicationItem.Video
      ? _l`Video`
      : type === CommunicationTypes.Dial
      ? _l`Dial`
      : type === CommunicationTypes.FACE_TIME_DIAL
      ? _l`Video dial`
      : type === CommunicationTypes.FACE_TIME_CALL
      ? _l`Video call`
      : _l`SMS`;

  const shortenValue = (value) => {
    if (value && value.length > 13) {
      return value.slice(0, 13);
    }
    return value;
  };

  const iconDefault =
    type === CommunicationTypes.Call || type === CommunicationTypes.Video
      ? answerCallSvg
      : type === CommunicationTypes.Dial || type === CommunicationTypes.FACE_TIME_DIAL
      ? unAnswerCallSvg
      : smsSvg;
  const secondIcon = type === CommunicationTypes.Call && communication.noteContent ? noteSvg : null;

  let duration = '';
  if (communication.duration) {
    duration = secondsToHms(communication.duration / 1000);
  }
  return (
    <div
      onClick={() => {
        if (type === CommunicationTypes.I_MESSAGE) {
          highlight(overviewType, null, 'communication_detail', communication);
        }
      }}
      style={style}
      className={css.item}
    >
      <div className={css.info}>
        <div className={css.sentReceived}>{`${text}`}</div>
        <div className={css.name}>
          {user && user.name ? (
            user.name.length > 13 ? (
              <Popup
                trigger={<div>{`${shortenValue(user.name)}...`}</div>}
                style={{ fontSize: 11 }}
                content={user.name}
              />
            ) : (
              user.name
            )
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={css.iconContent}>
        <img className={css.icon} src={iconDefault} />
        {secondIcon && (
          <div className={css.trackingIcon}>
            <Popup
              style={{ fontSize: 11 }}
              trigger={<img className={css.icon} src={secondIcon} />}
              content={communication.noteContent}
            ></Popup>
          </div>
        )}
      </div>
      <div className={css.date}>
        {_l`${moment(communication.startDate).format('HH:mm DD MMM, YYYY')}`}
        {duration && <span style={{ color: '#E25657' }}>{duration}</span>}
      </div>
      <div className={css.type}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            highlight(overviewType, null, 'delete_communication', communication);
          }}
          className={css.deleteButton}
          icon="delete"
          size="mini"
        />
      </div>
    </div>
  );
};
const ChatMsTeam = ({
  user,
  communication,
  type,
  style,
  highlight,
  overviewType,
  notiError,
  isConnectMsTeams,
}: PropsT) => {
  const text = _l`Chat`;

  const shortenValue = (value) => {
    if (value && value.length > 13) {
      return value.slice(0, 13);
    }
    return value;
  };

  const iconDefault = msTeam;
  const secondIcon = type === CommunicationTypes.Call && communication.noteContent ? noteSvg : null;

  let duration = '';
  if (communication.duration) {
    duration = secondsToHms(communication.duration / 1000);
  }
  return (
    <div
      onClick={() => {
        // open popup chat & go to message
        if (!isConnectMsTeams) {
          notiError(`Connect to Teams to open the chat`, '', null);
        }
      }}
      style={style}
      className={css.item}
    >
      <div className={css.info}>
        <div className={css.sentReceived}>{`${text}`}</div>
        <div className={css.name}>
          {user && user.name ? (
            user.name.length > 13 ? (
              <Popup
                trigger={<div>{`${shortenValue(user.name)}...`}</div>}
                style={{ fontSize: 11 }}
                content={user.name}
              />
            ) : (
              user.name
            )
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={css.iconContent}>
        <img className={css.icon} src={iconDefault} />
        {secondIcon && (
          <div className={css.trackingIcon}>
            <Popup
              style={{ fontSize: 11 }}
              trigger={<img className={css.icon} src={secondIcon} />}
              content={communication.noteContent}
            ></Popup>
          </div>
        )}
      </div>
      <div className={css.date}>
        {_l`${moment(communication.startDate).format('HH:mm DD MMM, YYYY')}`}
        {duration && <span style={{ color: '#E25657' }}>{duration}</span>}
      </div>
      <div className={css.type}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            highlight(overviewType, null, 'delete_communication', communication);
          }}
          className={css.deleteButton}
          icon="delete"
          size="mini"
        />
      </div>
    </div>
  );
};

const DefaultItem = ({ user, communication, style, highlight }: PropsT) => {
  return (
    <div style={style} className={css.item}>
      {/* <div className={css.info}>

      </div> */}
      <div className={css.info}>
        <div className={css.header}>{user.name}</div>
      </div>
      <div className={css.date}>{_l`${moment(communication.startDate).format('HH:mm DD MMM, YYYY')}`}</div>
      <div className={css.type}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            highlight(overviewType, null, 'delete_communication', communication);
          }}
          className={css.deleteButton}
          icon="delete"
          size="mini"
        />
      </div>
    </div>
  );
};

const CommunicationItem = ({ user, communication, style, highlight, overviewType, notiError, isConnectMsTeams }: PropsT) => {
  let userShow = user;
  if (overviewType === OverviewTypes.Account) {
    userShow = {
      name: communication.sharedContactName,
    };
  }

  if (
    communication.type === CommunicationTypes.Call ||
    communication.type === CommunicationTypes.Dial ||
    communication.type === CommunicationTypes.FACE_TIME_DIAL
  ) {
    return (
      <CallDialSMS
        overviewType={overviewType}
        highlight={highlight}
        style={style}
        user={userShow}
        type={communication.type}
        communication={communication}
      />
    );
  } else if (
    communication.type === CommunicationTypes.Email.Receiver ||
    communication.type === CommunicationTypes.Email.Sender ||
    communication.type === CommunicationTypes.Email.Unknown
  ) {
    return (
      <Email
        overviewType={overviewType}
        highlight={highlight}
        style={style}
        type={communication.type}
        user={userShow}
        communication={communication}
      />
    );
  } else if (communication.type === CommunicationTypes.Chat) {
    return (
      <ChatMsTeam
        notiError={notiError}
        overviewType={overviewType}
        highlight={highlight}
        style={style}
        type={communication.type}
        user={userShow}
        communication={communication}
        isConnectMsTeams={isConnectMsTeams}
      />
    );
  } else
    return (
      <CallDialSMS
        overviewType={overviewType}
        highlight={highlight}
        style={style}
        user={userShow}
        type={communication.type}
        communication={communication}
      />
    );
};

const makeMapStateToProps = () => {
  const getUser = makeGetUser();
  const mapStateToProps = (state, { communication }) => ({
    user: getUser(state, communication.userId),
    isConnectMsTeams: state.common.isConnectMsTeams,
  });
  return mapStateToProps;
};

export default compose(connect(makeMapStateToProps, { highlight, notiError: NotificationActions.error }))(
  CommunicationItem
);

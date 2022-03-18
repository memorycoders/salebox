//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';
import { Popup } from 'semantic-ui-react'
import _l from 'lib/i18n';
import InsightPane from '../InsightPane/InsightPane';
import css from './timeline.css'
import moment from 'moment'
import Avatar from '../../Avatar/Avatar';
import { OverviewTypes } from 'Constants';
import { fetchRecentActivity } from '../insight.actions'
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import taskIcon from '../../../../public/Tasks.svg';
import contactIcon from '../../../../public/Contacts.svg';
import unqualifiedIcon from '../../../../public/Unqualified_deals.svg';
import qualifiedIcon from '../../../../public/Qualified_deals.svg';
import accountIcon from '../../../../public/Accounts.svg';
import appointmentIcon from '../../../../public/Appointments.svg';
import documentSvg from '../../../../public/Documents.svg';
import photoSvg from '../../../../public/Photos.svg';
import wonIcon from '../../../../public/star_circle_won_active.svg'
import lostIcon from '../../../../public/star_circle_lost_active.svg'
import contactAvatar from '../../../../public/Contacts.svg';
import accountAvatar from '../../../../public/Accounts.svg'
import actionPlanSvg from '../../../../public/action_plan.svg';
import callAdd from '../../../../public/Call lists.svg';
import noAvatar from '../../../../public/square-image.png'
type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Timeline: 'Timeline',
  },
});

const TimelinePane = ({ timeline, fetchRecentActivity }: PropsT) => {
  console.log('timeline; ', timeline)
  let pageIndexSection = 0;

  return (
    <InsightPane padded title={_l`Timeline`}>
      <InfiniteLoader
        autoReload={true}
        isRowLoaded={isRowRender(timeline.list)}
        loadMoreRows={(param) => {
          const { stopIndex } = param;
          const pageIndex = Math.ceil(stopIndex / 20) - 1;

          if (pageIndexSection < pageIndex) {
            pageIndexSection = pageIndex;
            fetchRecentActivity(pageIndex);
          }
        }}
        threshold={1}
        rowCount={timeline.count}
      >
        {
          ({ onRowsRendered, registerChild }) => {
            return <List
              height={300}
              className={css.list}
              rowCount={timeline.list.length}
              rowHeight={50}
              width={500}
              ref={registerChild}
              onRowsRendered={onRowsRendered}
              rowRenderer={getRowRender(timeline.list)}
              threshold={300}
              data={timeline.list}
            />
          }
        }
      </InfiniteLoader>
    </InsightPane>
  );
};

const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
}



const getRowRender = (quotes) => ({ index, style }) => {
  const item = quotes[index];

  if (!item) {
    return null;
  }
  return <TimelineItem style={style} recentActivity={item} />
};

const TimelineItem = ({ recentActivity, style }) => {
  const { contactDTO, organisationDTO } = recentActivity;

  var timelineItem = {
    // relationship: recentActivity.contactDTO ? recentActivity.contactDTO.relationship : (recentActivity.organisationDTO ? recentActivity.organisationDTO.relationship : ''),
    // contactAvatar: recentActivity.contactDTO ? recentActivity.contactDTO.avatar : (recentActivity.organisationDTO ? recentActivity.organisationDTO.avatar : ''),
    // ownerAvatar: recentActivity.contactDTO ? recentActivity.contactDTO.ownerAvatar : (recentActivity.organisationDTO ? recentActivity.organisationDTO.ownerAvatar : ''),
    relationship: (recentActivity.contactDTO && recentActivity.contactDTO.uuid) ? recentActivity.contactDTO.relationship : (recentActivity.organisationDTO ? recentActivity.organisationDTO.relationship : ''),
    contactAvatar: (recentActivity.contactDTO && recentActivity.contactDTO.uuid) ? recentActivity.contactDTO.avatar : (recentActivity.organisationDTO ? recentActivity.organisationDTO.avatar : ''),
    ownerAvatar: (recentActivity.contactDTO && recentActivity.contactDTO.uuid) ? recentActivity.contactDTO.ownerAvatar : (recentActivity.organisationDTO ? recentActivity.organisationDTO.ownerAvatar : ''),
    objectName: recentActivity.objectType === 'OPPORTUNITY' ? recentActivity.prospectDescription : recentActivity.objectName,
    objectType: recentActivity.objectType,
    objectId: recentActivity.objectId,
    recentActionType: recentActivity.recentActionType,
    contactJob: recentActivity.objectType == 'CONTACT' ? recentActivity.contactDTO.organisationName : '',
    actionIcon: getIcon(recentActivity.recentActionType),
    updatedDate: recentActivity.updatedDate,
    prospectProgress: '',
    discProfile: ''
  };
  if (timelineItem.objectType == 'ACCOUNT') {
    if (timelineItem.relationship) {
      if (parseFloat(timelineItem.relationship) < -0.25) {
        timelineItem.relationship = 'RED';
      } else if (parseFloat(timelineItem.relationship) <= 0.25) {
        timelineItem.relationship = 'YELLOW';
      } else if (parseFloat(timelineItem.relationship) > 0.25) {
        timelineItem.relationship = 'GREEN';
      }
    } else {
      timelineItem.relationship = 'YELLOW';
    }
  }

  let disc = '#F5B342';
  let discDesc = '';

  if (timelineItem.objectType == 'CONTACT') {
    if (contactDTO.discProfile === "NONE") {
      disc = '#ADADAD';
      discDesc = 'Behaviour not defined';
    } else if (contactDTO.discProfile === 'BLUE') {
      disc = '#2F83EB';
      discDesc = 'Likes facts, quality and accuracy';
    } else if (contactDTO.discProfile === 'RED') {
      disc = '#ed684e'
      discDesc = 'Likes to take quick decisions, to act and take lead'
    } else if (contactDTO.discProfile === 'GREEN') {
      disc = '#A9D231'
      discDesc = 'Likes socialising, collaboration and security'
    } else if (contactDTO.discProfile === 'YELLOW') {
      disc = '#F5B342'
      discDesc = 'Likes to convince, influence and inspire others'
    }
  }

  timelineItem.contactAvatarUrl = timelineItem.contactAvatar || accountIcon;
  timelineItem.ownerAvatarUrl = timelineItem.ownerAvatar || contactAvatar;
  if (timelineItem.objectType == 'OPPORTUNITY') {
    timelineItem.prospectProgress = recentActivity.prospectProgress;
    if (recentActivity.createdDate) {
      timelineItem.createdDate = recentActivity.createdDate;
    }
  }

  if (timelineItem.objectType == 'CONTACT') {
    return <div className={css.timelineItem} style={{ ...style, width: '100%' }}>

      <Popup style={{ fontSize: 11 }} content={discDesc} trigger={
        <div className={css.timelineLeft}>
          <Avatar size={40} fallbackIcon={contactAvatar} backgroundColor={disc} src={timelineItem.contactAvatarUrl} />
        </div>
      }>
      </Popup>
      <div className={css.timelineCenter}>
        <div className={css.title}>{timelineItem.objectName}</div>
        <div>{recentActivity.contactJob}</div>
        <span>
          <img style={{ width: 12, marginRight: 5, height: 12 }} src={timelineItem.actionIcon} />
          {moment(timelineItem.updatedDate).format('DD MMM, YYYY HH:mm')}
        </span>
      </div>
      <div className={css.timelineRight}>
        <Avatar size={30} src={timelineItem.ownerAvatarUrl} />
      </div>
    </div>
  }

  if (timelineItem.objectType == 'OPPORTUNITY') {
    return <div className={css.timelineItem} style={{ ...style, width: '100%' }}>

      <div className={css.timelineLeft}>
        <CircularProgressBar
          color={checkProgressBarColor(timelineItem)}
          width={30}
          height={30}
          percentage={timelineItem.prospectProgress}
        />
      </div>
      <div className={css.timelineCenter}>
        <div className={css.title}>{timelineItem.objectName}</div>
        <div>{recentActivity.contactJob}</div>
        <span>
          <img style={{ width: 12, marginRight: 5, height: 12 }} src={timelineItem.actionIcon} />
          {moment(timelineItem.updatedDate).format('DD MMM, YYYY HH:mm')}
        </span>
      </div>
      <div className={css.timelineRight}>
        <Avatar size={30} src={timelineItem.ownerAvatarUrl} />
      </div>
    </div>
  }

  return <div className={css.timelineItem} style={{ ...style, width: '100%' }}>
    <Popup hoverable style={{ fontSize: 11 }} content={getRelationshipDescription(timelineItem.relationship)}
      trigger={
        <div className={css.timelineLeft}>
          <Avatar
            overviewType={OverviewTypes.Account}
            borderSize={3} size={30} fallbackIcon={contactAvatar} border={timelineItem.relationship} src={timelineItem.contactAvatarUrl} />
        </div>
      }>

    </Popup>

    <div className={css.timelineCenter}>
      <div className={css.title}>{timelineItem.objectName}</div>
      <div>{recentActivity.contactJob}</div>
      <span>
        <img style={{ width: 12, marginRight: 5, height: 12 }} src={timelineItem.actionIcon.icon} />
        {moment(timelineItem.updatedDate).format('DD MMM, YYYY HH:mm')}
      </span>
    </div>
    <div className={css.timelineRight}>
      <Avatar isNoAvatar fallbackIcon={contactAvatar} size={30} src={timelineItem.ownerAvatarUrl} />
    </div>
  </div>
}

const checkProgressBarColor = function (prospect) {
  if (prospect) {
    var now = new Date().getTime();

    if (now - prospect.contractDate >= 0) {
      return 'RED';
    }
    else if (isTimeToAct(prospect)) {
      return 'YELLOW';
    }
    else {
      return 'GREEN';
    }
  }
};

const isTimeToAct = function (opportunity) {
  if (opportunity.won != null) {
    return false;
  }
  var now = new Date().getTime();
  if (opportunity.havePrioritiesTask && opportunity.realProspectProgress < 50) {
    return true;
  }
};


const getRelationshipDescription = (key) => {
  switch (key) {
    case 'RED':
      return relationshipDescription.redDescription;
    case 'YELLOW':
      return relationshipDescription.yellowDescription;
    case 'GREEN':
      return relationshipDescription.greenDescription;
    default:
      return relationshipDescription.noneDescription;
  }
}

var relationshipDescription = {
  yellowDescription: 'Yellow: Relationship is neutral',
  greenDescription: 'Green: Relationship is good',
  redDescription: 'Red: Relationship is bad',
  noneDescription: 'None: Relationship is undefined'
};

const getIcon = (style) => {
  switch (style) {
    case 'ADD_TO_OBJECT_USER_LIST':
      return {
        icon: accountIcon,
        backgroundColor: 'rgba(95, 106, 124, .1)',
      };
    case 'TASK':
      return {
        icon: taskIcon,
        backgroundColor: '#fef9f0',
      };
    case 'APPOINTMENT':
      return {
        icon: appointmentIcon,
        backgroundColor: '#f5f0e6',
      };
    case 'LEAD':
      return {
        icon: unqualifiedIcon,
        backgroundColor: '#fbe6e3',
      };
    case 'OPPORTUNITY':
    case 'ADD_OPPORTUNITY':
      return {
        icon: qualifiedIcon,
        backgroundColor: '#fbe6e3',
      };
    case 'VIEW_DETAILS':
      return {
        icon: contactIcon,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'DOCUMENT':
      return {
        icon: documentSvg,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'PHOTO':
      return {
        icon: photoSvg,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'WON_OPPORTUNITY':
      return {
        icon: wonIcon,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'LOST_OPPORTUNITY':
      return {
        icon: lostIcon,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'PROGRESS':
      return {
        icon: actionPlanSvg,
        backgroundColor: 'rgb(235, 243, 240)',
      };
    case 'FACE_TIME':
      return {
        icon: callAdd,
        backgroundColor: 'rgb(235, 243, 240)',
      };

    default:
      return {
        icon: taskIcon,
        backgroundColor: '#fef9f0',
      };
  }
};

export default compose(
  connect(
    state => {
      const { timeline } = state.entities.insight;
      return {
        timeline: timeline || {
          list: [],
          count: 0
        }
      }
    },
    {
      fetchRecentActivity
    }
  ),
  lifecycle({
    componentDidMount() {

    }
  })
)(TimelinePane);

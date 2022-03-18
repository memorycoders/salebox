import React from 'react';
import './CardStep.less';
import Avatar from '../../Avatar/Avatar';
import moment from 'moment';
import { withRouter } from 'react-router';
import { Popup, List, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, lifecycle, pure } from 'recompose';
import { browserHistory } from '../../../lib/history';
import { OverviewTypes } from 'Constants';
import * as OverviewActions from 'components/Overview/overview.actions';
import QualifiedDealActionMenu from '../../../essentials/Menu/QualifiedDealActionMenu';
import FocusDescription from '../../Focus/FocusDescription';
import starWonActive from '../../../../public/star_circle_won_white.svg';
import starLostActive from '../../../../public/star_circle_lost_white.svg';
import { setTrelloSelectedTrack } from './TrelloElement/trello-action';
import { getActiveUsersDTO } from '../../User/user.selector';
import css from '../QualifiedDealListRow.css';
import RecruitmentActionMenu from '../../Recruitment/RecruitmentActionMenu';

var historyListen = null;

export const CardNoBody = () => {
  return <div />;
};

String.prototype.convertMoney = function() {
  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const CardHeader = ({
  name,
  count,
  description,
  grossValue,
  progress,
  discProfile,
  manualProgress,
  currency,
  overviewType,
}) => {
  return (
    <div className="card-header">
      <div className="content">
        <Popup trigger={<span className="title">{name}</span>} style={{ fontSize: 11 }}>
          <Popup.Content>
            <span style={{ fontSize: 11 }}>{description}</span>
          </Popup.Content>
          <FocusDescription
            noteStyle={{ marginTop: 5, lineHeight: '15px' }}
            styleBox={{ width: 15, height: 15 }}
            styleText={{ fontSize: 11 }}
            discProfile={discProfile}
          />
        </Popup>

        <span>{manualProgress === 'OFF' ? progress + '%' : ''}</span>
      </div>
      <div className={overviewType === OverviewTypes.Pipeline.Qualified ? 'content' : 'contentRecruitment'}>
        {overviewType === OverviewTypes.Pipeline.Qualified && (
          <span>
            {Math.ceil(Number(grossValue ? grossValue : 0))
              .toString()
              .convertMoney()}{' '}
            {currency}
          </span>
        )}

        <span className="count">{count}</span>
      </div>
    </div>
  );
};

function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
    // width: '94%',
    // padding: '10px'
  };
}

const CardItemC = ({
  users,
  prospect,
  goto,
  isActive,
  currency,
  laneId,
  provided,
  isDragging,
  index,
  uuid,
  cardStyle,
  style,
  overviewType,
}) => {
  if (!prospect) return null;
  const { organisation, ownerAvatar, description, grossValue, sponsorList, contractDate, ownerDiscProfile } = prospect;
  const shortenValue = (value) => {
    if (value && value.length > 35) {
      return value.slice(0, 35) + '...';
    }
    return value.slice(0, 35);
  };
  let responsibleAvatar =
    ownerAvatar || (prospect.ownerId && users[prospect.ownerId] ? users[prospect.ownerId].avatar : null);

  // let styleNextAction = (contractDate!=null && prospect.won !== true && prospect.won !== false) ? (moment(new Date(contractDate)).isSameOrAfter(moment(new Date())) || moment(new Date(contractDate)).isSame(moment(new Date()), 'day') ? null : css.oldDeadline) : null;

  if (overviewType === OverviewTypes.RecruitmentActive) {
    const { email } = prospect;

    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        data-is-dragging={isDragging}
        data-testid={uuid}
        data-index={index}
        ref={provided.innerRef}
        onClick={(e) => {
          goto(e, prospect);
        }}
        style={getStyle(provided, style)}
        className={`card-item-container ${isActive ? 'card-item-active' : ''}`}
      >
        <div className="owner-info">
          <Avatar
            size={30}
            src={prospect.ownerAvatar}
            fullName={prospect.contactName}
            isShowName
            borderSize={4}
            border={prospect.ownerDiscProfile}
            containerStyle={{ height: '38px' }}
          />
          <div className="info">
            <div>
              <p className={css.candidateName}>{prospect.contactName}</p>
            </div>
            <List style={{ marginTop: 2 }}>
              {prospect.email && (
                <List.Item className={css.infoCandidate}>
                  <List.Icon color="black" name="envelope" />
                  <List.Content className="candidate-item-email-phone">
                    <a href={`mailto:${prospect.email}`} className={css.emailRecruitment}>{prospect.email}</a>
                  </List.Content>
                </List.Item>
              )}
              {prospect.phone && (
                <List.Item className={css.infoCandidate}>
                  <List.Icon color="black" name="phone" />
                  <List.Content className="candidate-item-email-phone">
                    <a  href={`tel:${prospect.phone}`} className={css.emailRecruitment}>{prospect.phone}</a>
                  </List.Content>
                </List.Item>
              )}
            </List>
          </div>
        </div>
        <div className={css.moreMenuRecruitment}>
          {!isDragging && <RecruitmentActionMenu overviewType={OverviewTypes.RecruitmentActive} candidate={prospect} />}
        </div>
      </div>
    );
  }
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={uuid}
      data-index={index}
      ref={provided.innerRef}
      onClick={(e) => {
        goto(e, prospect);
      }}
      style={getStyle(provided, style)}
      className={`card-item-container ${isActive ? 'card-item-active' : ''} ${checkBorder(prospect)}`}
    >
      <div className="owner-info">
        <Avatar size={30} src={responsibleAvatar} fullName={prospect.ownerName} isShowName />
        <div className="info">
          {/* <div className="name"> */}
          <Popup
            trigger={
              <div className="name">
                {organisation ? organisation.name : ''}
                <div className={organisation ? 'fullInfo' : 'onlyContact'}></div>
              </div>
            }
            style={{ fontSize: 11 }}
            content={organisation ? organisation.name : ''}
          ></Popup>
          {sponsorList && sponsorList.length > 0 && (
            <Popup
              hoverable
              trigger={
                <div className={organisation ? 'sponsor' : 'name'}>
                  {`${shortenValue(`${sponsorList[0].firstName} ${sponsorList[0].lastName}`)}`}
                </div>
              }
              style={{ fontSize: 11 }}
              content={`${sponsorList[0].firstName} ${sponsorList[0].lastName} `}
            ></Popup>
          )}

          <Popup
            trigger={<div className="description">{description}</div>}
            style={{ fontSize: 11 }}
            content={description}
          ></Popup>
        </div>
      </div>
      <div className="profit-info">
        <span>
          {Math.ceil(Number(grossValue))
            .toString()
            .convertMoney()}{' '}
          {currency}
        </span>
        <span>{moment(contractDate).format('DD MMM, YYYY')}</span>
      </div>
      <div>
        {!isDragging && (
          <QualifiedDealActionMenu
            className={'bg-more'}
            overviewType={OverviewTypes.Pipeline.Qualified}
            qualifiedDeal={prospect}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    users: getActiveUsersDTO(state),
  };
};
export const CardItem = compose(
  withRouter,
  pure,
  connect(mapStateToProps, {
    highlight: OverviewActions.highlight,
    setTrelloSelectedTrack,
  }),
  withState('isActive', 'setActive', false),
  lifecycle({
    componentDidMount() {
      const { history, setActive, prospect, overviewType } = this.props;
      const splitPathNameInit = location.pathname.split('/');
      if (splitPathNameInit.length > 0) {
        if (overviewType === OverviewTypes.Pipeline.Qualified) {
          setActive(prospect.uuid === splitPathNameInit[splitPathNameInit.length - 1]);
        } else {
          setActive(prospect.contactId === splitPathNameInit[splitPathNameInit.length - 1]);
        }
      }

      historyListen = history.listen((location) => {
        const splitPathName = location.pathname.split('/');
        if (splitPathName.length > 0) {
          if (overviewType === OverviewTypes.Pipeline.Qualified) {
            setActive(prospect.uuid === splitPathName[splitPathName.length - 1]);
          } else {
            setActive(prospect.contactId === splitPathName[splitPathName.length - 1]);
          }
        }
      });
    },

    componentWillUnmount() {
      if (historyListen) {
        historyListen();
      }
    },
  }),
  withHandlers({
    goto: ({ highlight, history, setTrelloSelectedTrack, columnId, parentId, overviewType }) => (e, prospect) => {
      if (overviewType === OverviewTypes.Pipeline.Qualified) {
        e.stopPropagation();
        setTrelloSelectedTrack(columnId, prospect.uuid, parentId);
        highlight(OverviewTypes.Pipeline.Qualified, prospect.uuid);
        history.push(`/pipeline/overview/${prospect.uuid}`);
      } else {
        e.stopPropagation();
        highlight(OverviewTypes.RecruitmentActive, prospect.contactId);
        history.push(`/recruitment/active/${prospect.contactId}`);
      }
    },
  })
)(CardItemC);

export const checkBorder = (prospect) => {
  if (prospect) {
    let now = new Date();
    now.setHours(0, 0, 0, 0);

    let contractDate = new Date(prospect.contractDate);

    contractDate.setHours(0, 0, 0, 0);
    if (now.getTime() - contractDate.getTime() > 0) {
      return 'RED';
    } else if (isTimeToAct(prospect)) {
      return 'YELLOW';
    } else {
      return 'GREEN';
    }
  }
};

const isTimeToAct = (opportunity) => {
  if (!opportunity) {
    return false;
  }
  if (opportunity.won != null) {
    return false;
  }
  const now = new Date().getTime();
  if (opportunity.havePrioritiesTask && opportunity.realProspectProgress < 50) {
    return true;
  }
  return false;
};

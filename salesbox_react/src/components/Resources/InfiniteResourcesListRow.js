//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { useState } from 'react';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';

import { isItemSelected, isItemHighlighted, isShowSpiner } from 'components/Overview/overview.selectors';
import { makeGetResource } from './resources.selector';
import ReactCardFlip from 'react-card-flip';

import ContactPopup from 'components/Contact/ContactPopup';
import { Grid, Icon, Checkbox, Popup } from 'semantic-ui-react';
import { Avatar } from 'components';
import moment from 'moment';
import * as OverviewActions from 'components/Overview/overview.actions';
import FocusRelationship from '../Focus/FocusRelationship';
import { ContactActionMenu } from 'essentials';
// import * as contactActions from 'components/Contact/resource.actions';
import cx from 'classnames';
import overviewCss from 'components/Overview/Overview.css';
import css from './ResourceListRow.css';
import starSvg from '../../../public/myStar.svg';
import starActiveSvg from '../../../public/myStar_active.png';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import _l from 'lib/i18n';
import { toggleFavoriteRequest, fetchResourceDetail } from './resources.actions';
import ResourceActionMenu from './ResourceActionMenu';
import { OverviewTypes } from '../../Constants';
import SpinnerResourceDetail from './ResourceDetail/SpinnerResourceDetail';

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);
const nameLoader = (
  <ContentLoader width={400} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);
const occuiedLoader = (
  <ContentLoader width={100} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);
const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={400} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.content}>
        <div className={css.contact}>{nameLoader}</div>
        <div className={css.email}>{daysLoader}</div>
        <div className={css.title}>{noteLoader}</div>
        <div className={css.occuied}>{occuiedLoader}</div>
        <div className={css.sale}>{occuiedLoader}</div>
        <div className={css.owner}>{daysLoader}</div>
        <div className={css.more}>{checkLoader}</div>
      </div>
    </div>
  );
};

const InfiniteResourceListRow = ({
  handleToggleFavorite,
  select,
  highlighted,
  resource,
  style,
  className,
  goto,
  selected,
  overviewType,
}) => {
  const [isFlipAvatar, setIsFlipAvatar] = useState(false);
  const [open, setOpen] = useState(false);
  const handleFlip = (type) => {
    setOpen(false);
    setIsFlipAvatar(type);
  };
  const styleAccountRowTheme = {
    // "color": "#5F6A7B",
    fontWeight: '300',
    fontSize: '11',
  };
  let relationshipAccountColor = 'YELLOW';
  let disc = '';
  let discDesc = '';
  if (resource.discProfile === 'NONE') {
    disc = '#ADADAD';
    discDesc = 'Behaviour not defined';
  } else if (resource.discProfile === 'BLUE') {
    disc = '#2F83EB';
    discDesc = 'Likes facts, quality and accuracy';
  } else if (resource.discProfile === 'RED') {
    disc = '#ed684e';
    discDesc = 'Likes to take quick decisions, to act and take lead';
  } else if (resource.discProfile === 'GREEN') {
    disc = '#A9D231';
    discDesc = 'Likes socialising, collaboration and security';
  } else if (resource.discProfile === 'YELLOW') {
    disc = '#F5B342';
    discDesc = 'Likes to convince, influence and inspire others';
  }
  const listCn = cx(className, {
    [overviewCss.highlighted]: highlighted,
    [overviewCss.selected]: selected,
  });

  // let recentActionTypeIcon = null;
  // const { communicationHistoryLatest } = resource;
  // const { chStartDate, chType, chTypeName } = communicationHistoryLatest || {};

  let limitContact = 0;
  let limitAccount = 0;
  let limitTitle = 0;
  let url = window.location.pathname;
  let screen_width = window.innerWidth;

  if (screen_width >= 1920) {
    if (url.length > 10) {
      limitContact = 72;
      limitAccount = 33;
      limitTitle = 66;
    } else {
      limitContact = 100;
      limitAccount = 40;
      limitTitle = 66;
    }
  } else if (screen_width > 1580 && screen_width < 1920) {
    if (url.length > 10) {
      limitContact = 52;
      limitAccount = 35;
      limitTitle = 48;
    } else {
      limitContact = 80;
      limitAccount = 30;
      limitTitle = 66;
    }
  } else if (screen_width <= 1580) {
    if (url.length > 10) {
      limitContact = 30;
      limitAccount = 22;
      limitTitle = 27;
    } else {
      limitContact = 52;
      limitAccount = 37;
      limitTitle = 55;
    }
  }
  let displayName = `${resource?.firstName} ${resource?.lastName}`;
  let accountName = displayName ? displayName.trim() : '';
  // const MAX_LENGTH_NAME = 50;
  const shortenValueContactName = (value) => {
    if (value && value.length > limitContact) {
      return value.slice(0, limitContact);
    }
    return value;
  };
  const shortenValueTitle = (value) => {
    if (value && value.length > limitTitle) {
      return value.slice(0, limitTitle);
    }
    return value;
  };
  const shortenValueAccountName = (value) => {
    if (value && value.length > limitAccount) {
      return value.slice(0, limitAccount);
    }
    return value;
  };

  return (
    <div className={`${listCn} ${css.itemRow}`} style={style} onClick={goto}>
      <div className={css.content}>
        <div className={`${css.check} height-60`}>
          <Checkbox onChange={select} checked={selected} />
        </div>
        <div className={css.contact} onClick={() => {}} style={{ display: 'flex', alignItems: 'center' }}>
          {/* <Popup
            hoverable
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            trigger={

            }
            position="top left"
          >
            <Popup.Content>
              {isFlipAvatar ? (
                <div>
                  <span className={css.relationFont}>{discDesc}</span>
                </div>
              ) : (
                <FocusRelationship
                  noteStyle={{ marginTop: 5, lineHeight: '15px' }}
                  styleBox={{ width: 15, height: 15 }}
                  styleText={{ fontSize: 11, fontWeight: 300 }}
                  discProfile={relationshipAccountColor}
                />
              )}
            </Popup.Content>
          </Popup> */}
          <div className={css.nameShow} isFlipped={isFlipAvatar} flipDirection="horizontal">
            <ReactCardFlip isFlipped={isFlipAvatar} flipDirection="horizontal">
              <Popup
                on="click"
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                content={
                  <div>
                    <span className={css.relationFont}>{discDesc}</span>
                  </div>
                }
                trigger={
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(true);
                    }}
                    overviewType={overviewType}
                    borderSize={4}
                    size={30}
                    isShowName
                    firstName={resource.firstName}
                    lastName={resource.lastName}
                    src={resource.originalAvatar ? resource.originalAvatar : null}
                    fallbackIcon="building outline"
                    // border={relationshipAccountColor}
                  />
                }
                position="top left"
              ></Popup>
              <Avatar
                isFlip
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip(false);
                }}
                size={30}
                borderSize={4}
                border={relationshipAccountColor}
                backgroundColor={disc}
              />
            </ReactCardFlip>
          </div>
          <div className={css.nameWapper}>
            {displayName?.length > limitContact ? (
              <Popup
                style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                trigger={<div className={css.customName}>{`${shortenValueContactName(displayName)}...`}</div>}
                content={<div className={css.customName}>{displayName}</div>}
              />
            ) : (
              <div className={css.customName}>{displayName}</div>
            )}

            <div>
              {resource.enterpriseName ? (
                resource.enterpriseName.length > limitAccount ? (
                  <Popup
                    style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                    trigger={<div>{`${shortenValueAccountName(resource.enterpriseName)}...`}</div>}
                    content={<div>{resource.enterpriseName}</div>}
                  />
                ) : (
                  <div>{resource.enterpriseName}</div>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {resource.email || resource.phone ? (
          <div className={css.email}>
            <ContactPopup name={displayName} email={resource.email} phone={resource.phone} />
          </div>
        ) : (
          <div className={css.email}></div>
        )}
        <div className={css.title}>
          {resource.title ? (
            resource.title.length > limitTitle ? (
              <Popup
                style={{ fontSize: 11, fontWeight: '400', width: '100% !important', wordBreak: 'break-all' }}
                trigger={<div>{`${shortenValueTitle(resource.title)}...`}</div>}
                content={<div>{resource.title}</div>}
              />
            ) : (
              <div>{resource.title}</div>
            )
          ) : (
            ''
          )}
        </div>
        <div className={css.occuied}>{resource.occupied ? resource.occupied : 0}</div>
        <div className={css.sale} style={styleAccountRowTheme}>
          {resource.pipeline}
        </div>
        <div className={css.owner}>
          {/* <Avatar
          src={resource.participants.length || resource.numberContactTeam ? resource.owner.avatar : null}
          backgroundColor="transparent"
          missingColor="red"
        /> */}
          {resource.ownerAvatar || resource.ownerFirstName || resource.ownerLastName ? (
            <CreatorPane
              size={30}
              creator={{
                avatar: resource.ownerAvatar,
                disc: resource.discProfile,
                fullName:
                  resource.ownerFirstName && resource.ownerLastName
                    ? `${resource.ownerFirstName} ${resource.ownerLastName}`
                    : '',
              }}
              avatar={true}
            />
          ) : (
            ''
          )}
        </div>
        <div className={css.more}>
          <div className={css.moreItemWapper} style={{ paddingRight: 13 }}>
            <Grid.Row centered textAlign="center">
              <div style={{ backgroundColor: resource.favorite && '#fdf5e8' }} className={css.moreAction}>
                {!resource.favorite && <img src={starSvg} className={css.beStar} onClick={handleToggleFavorite} />}
                {resource.favorite && <img src={starActiveSvg} className={css.beStar} onClick={handleToggleFavorite} />}
              </div>
            </Grid.Row>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            {/* <ResourceActionMenu overviewType={OverviewTypes.Resource} /> */}
            <SpinnerResourceDetail overviewType={overviewType} resource={resource} spinnerInList={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getResource = makeGetResource();
  const mapStateToProps = (state, { overviewType, itemId }) => ({
    resource: getResource(state, itemId),
    showSpiner: isShowSpiner(state, overviewType),
    selected: isItemSelected(state, overviewType, itemId),
    highlighted: isItemHighlighted(state, overviewType, itemId),
  });
  return mapStateToProps;
};
const mapDispatchToProps = {
  toggleFavoriteRequest,
  fetchResourceDetail,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  branch(({ resource }) => !resource, renderNothing),
  withHandlers({
    goto: ({ resource, history, highlight, overviewType, fetchResourceDetail }) => () => {
      // highlight(overviewType, resource.uuid);

      // fetchResourceDetail(resource.uuid, 'se');
      history.push(`/resources/${resource.uuid}`);
      // history.push(`/resources/123145`);
    },
    select: ({ select, resource }) => (event, { checked }) => {
      event.stopPropagation();
      select(resource.uuid, checked);
    },
    handleToggleFavorite: ({ toggleFavoriteRequest, resource }) => (event) => {
      event.stopPropagation();
      toggleFavoriteRequest(resource.uuid, !resource.favorite);
    },
  })
)(InfiniteResourceListRow);

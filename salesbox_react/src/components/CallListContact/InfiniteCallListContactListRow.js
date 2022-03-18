//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing, withState } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';
import { isItemSelected, isItemHighlighted, isShowSpiner } from 'components/Overview/overview.selectors';
import { Checkbox, Progress, Popup } from 'semantic-ui-react';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { Avatar } from 'components';
import overviewCss from 'components/Overview/Overview.css';
import css from './CallListContactListRow.css';
import { makeGetCallListContact } from './callListContact.selector';
import * as OverviewActions from 'components/Overview/overview.actions';
import moment from 'moment';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import { Colors, ObjectTypes, OverviewTypes } from '../../Constants';
import OneRowMenu from './Menu/OneRowMenu';
import MutilActionMenu from './Menu/MutilActionMenu';
import * as AdvancedSearchActions from '../../components/AdvancedSearch/advanced-search.actions';

type PropsType = {
  callListContact: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
  showHistory: boolean,
  style: {},
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

type HeaderPropsType = {
  overviewType: string,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Resp.': 'Resp.',
    Name: 'Name',
    Sales: 'Sales',
    Profit: 'Profit',
    Gross: 'Gross',
    Weighted: 'Weighted',
    Deadline: 'Deadline',
  },
});

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);

const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

const fHeaderComponent = ({
  overviewType,
  width,
  showSpiner,
  handleSortColumn,
  orderBy,
  objectType,
}: HeaderPropsType) => {
  return (
    <div className={css.header} style={{ width }}>
      <div className={css.content}>
        <div className={css.check}>
          <OverviewSelectAll overviewType={overviewType} />
        </div>
        {showSpiner && (
          <div className={css.check}>
            <MutilActionMenu className={css.bgMore} overviewType={OverviewTypes.CallList.Contact} />
          </div>
        )}
        <div
          className={cx(css.contact, css.clickable)}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
          onClick={() => handleSortColumn('name', objectType)}
        >
          {_l`Name`}{' '}
          <span className={orderBy === 'name' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </div>
        <div
          className={cx(css.contact, css.clickable)}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
          onClick={() => handleSortColumn('deadlineDate', objectType)}
        >
          {_l`Deadline`}{' '}
          <span className={orderBy === 'deadlineDate' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </div>
        {/* <div className={cx(css.contact, css.clickable)}>{_l`Added`}</div> */}
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberAccount', objectType)}>
          <div className={`${css.ic_accounts} ${css.icon}`}>
            {' '}
            <span
              className={orderBy === 'numberAccount' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}
              style={{ marginTop: '-2px' }}
            >
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberContact', objectType)}>
          <div className={`${css.ic_contacts} ${css.icon}`}>
            {' '}
            <span
              className={orderBy === 'numberContact' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}
              style={{ marginTop: '-2px' }}
            >
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberCall', objectType)}>
          <div className={`${css.ic_answer_call} ${css.icon}`}>
            {' '}
            <span className={orderBy === 'numberCall' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberDial', objectType)}>
          <div className={`${css.ic_unanswer_call} ${css.icon}`}>
            {' '}
            <span className={orderBy === 'numberDial' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>
        {/* <div className={css.kpiTwo}>
      <div className={`${css.ic_appointment} ${css.icon}`}></div>
    </div>
    <div className={css.kpiTwo}>
      <div className={`${css.ic_pipeline} ${css.icon}`}></div>
    </div> */}
        <div className={`${css.owner} ${css.clickable}`} onClick={() => handleSortColumn('owner', objectType)}>
          {_l`Resp.`}{' '}
          <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </div>
        <div className={css.more} />
      </div>
    </div>
  );
};
export const HeaderComponent = compose(
  connect(
    (state, { overviewType, objectType }) => {
      const showSpiner = isShowSpiner(state, overviewType);
      return {
        showSpiner: showSpiner,
      };
    },
    {
      requestSetOrderBy: AdvancedSearchActions.setOrderBy,
    }
  ),
  withState('orderBy', 'setOrderBy', 'deadlineDate'),
  withHandlers({
    handleSortColumn: ({ setOrderBy, requestSetOrderBy }) => (orderBy, objectType) => {
      setOrderBy(orderBy);
      requestSetOrderBy(ObjectTypes.CallListContact, orderBy);
    },
  })
)(fHeaderComponent);

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.check}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.contact}>{noteLoader}</div>
      <div className={css.email}>{checkLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.owner}>{daysLoader}</div>
      <div className={css.more}>{checkLoader}</div>
    </div>
  );
};

const InfiniteCallListContactListRow = ({
  select,
  highlighted,
  callListContact,
  style,
  className,
  goto,
  selected,
  showHistory,
}: PropsType) => {
  const listCn = cx(className, {
    [overviewCss.highlighted]: highlighted,
    [overviewCss.selected]: selected,
  });
  let limit = 0;
  let url = window.location.pathname
  let screen_width = window.innerWidth;
  if (screen_width >= 1920) {
    if (url.length > 30 && url.length < 90) limit = 117
     else if (url.length > 92) limit = 52
      else limit = 187
  }
  else if (screen_width > 1580 && screen_width < 1920) {
    if(url.length > 30 && url.length < 90) limit = 40
     else if (url.length > 92) limit = 40
      else limit = 52
  }
  else if (screen_width <= 1580){
    if(url.length > 30 && url.length < 90) limit = 30
     else if (url.length > 92) limit = 30
      else limit = 53
  }
  const shortenValue = (value) => {
    if (value && value.length > limit) {
      return value.slice(0, limit);
    }
    return value;
  };
  return (
    <div className={listCn} style={style} onClick={goto}>
      <div className={css.content}>
        <div className={`${css.check} height-60`}>
          <Checkbox onChange={select} checked={selected} />
        </div>
        <div className={`${css.contact} height-60 font-bold`}>
          {callListContact.name && callListContact.name.length > 0 ? (
              callListContact.name.length > limit ? (
                <Popup
                  trigger={<div>{`${shortenValue(callListContact.name)}...`}</div>}
                  style={{ fontSize: 11 }}
                  content={callListContact.name}
                />
              ) : (
                callListContact.name
              )
            ) : (
              ''
            )}
        </div>
        <div className={`${css.contact} height-60`}>
          {callListContact.deadlineDate ? (
            <div>{moment(callListContact.deadlineDate).format('DD MMM, YYYY')}</div>
          ) : (
              ''
            )}
        </div>
        <div className={`${css.kpiTwo} height-60`}>
          {Math.floor(callListContact.numberAccount / 1000) >= 1
            ? Math.floor(callListContact.numberAccount / 1000) + 'K'
            : callListContact.numberAccount}
          {/*{_l`${callListContact.orderIntake}:n`}*/}
        </div>
        <div className={`${css.kpiTwo} height-60`}>{callListContact.numberContact}</div>
        <div className={`${css.kpiTwo} height-60`}>{callListContact.numberCall}</div>
        <div className={`${css.kpiTwo} height-60`}>{callListContact.numberDial}</div>
        {/* <div className={`${css.kpiTwo} height-60`}>{callListContact.numberMeeting}</div>
      <div className={`${css.kpiTwo} height-60`}>{callListContact.numberProspect}</div> */}
        <div className={`${css.owner} height-60`}>
          <Avatar
            src={callListContact.ownerAvatar ? callListContact.ownerAvatar : null}
            border={callListContact.relationship}
            fallbackIcon="user"
            size={30}
            firstName={callListContact.ownerFirstName}
            lastName={callListContact.ownerLastName}
            isShowName
          />
        </div>
        <div className={css.more1}>
          <div className={css.bgMore}>
            <OneRowMenu
              item={callListContact}
              callListContact={callListContact}
              overviewType={OverviewTypes.CallList.Contact}
              className={css.bgMore}
            />
          </div>
        </div>
        <div className={css.progress}>
          <Progress
            value={callListContact.numberCalledContact}
            total={callListContact.numberContact}
            progress="value"
            color={showHistory ? Colors.CallList : 'call-list-account-color'}
            size={'medium'}
          />
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getCallListContact = makeGetCallListContact();
  const mapStateToProps = (state, { overviewType, itemId }) => {
    const getStateSearch = getSearch(state, overviewType);
    return {
      callListContact: getCallListContact(state, itemId),
      selected: isItemSelected(state, overviewType, itemId),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      showHistory: getStateSearch.history,
    };
  };
  return mapStateToProps;
};
const mapDispatchToProps = {
  highlight: OverviewActions.highlight,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  branch(({ callListContact }) => !callListContact, renderNothing),
  withHandlers({
    goto: ({ callListContact, history, overviewType, highlight }) => () => {
      highlight(overviewType, callListContact.uuid);
      history.push(`/call-lists/contact/${callListContact.uuid}`);
    },
    select: ({ select, callListContact }) => (event, { checked }) => {
      event.stopPropagation();
      select(callListContact.uuid, checked);
    },
  })
)(InfiniteCallListContactListRow);

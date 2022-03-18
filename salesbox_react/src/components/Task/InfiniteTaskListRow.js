//@flow
import * as React from 'react';
import { Checkbox, Popup, Label } from 'semantic-ui-react';
import { TaskActionMenu } from 'essentials';
import MutilActionMenu from '../../essentials/Menu/MutilActionMenu';
import HistoryActionMenu from '../../essentials/Menu/HistoryActionMenu';
import Deadline from 'components/Deadline/Deadline';
import { ContentLoader } from 'components/Svg';
import Days from 'components/Deadline/Days';
import FocusPopup from '../Focus/FocusPopup';
import ContactPopup from '../Contact/ContactPopup';
// import CreatorPane from '../User/CreatorPane/CreatorPane';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import { changeOnMutilTaskMenu } from './task.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import { setOrderBy } from '../AdvancedSearch/advanced-search.actions';
import { connect } from 'react-redux';
import { compose, withHandlers, branch, renderNothing, withState } from 'recompose';
import { withRouter } from 'react-router';
import {
  isItemSelected,
  isItemHighlighted,
  isShowSpiner,
  getTotalRowSelected,
} from 'components/Overview/overview.selectors';
import { makeGetTask, getCompanyAvgDistributionDays } from './task.selector';
import { getOverview } from '../Overview/overview.selectors';
import OverviewSelectAll from '../Overview/OverviewSelectAll';
import { ObjectTypes, OverviewTypes } from '../../Constants';
import { TaskT } from './task.types';

import cx from 'classnames';
import overviewCss from 'components/Overview/Overview.css';
import css from './TaskListRow.css';

type PropsType = {
  task: TaskT,
  showHistory: boolean,
  className?: string,
  selected: boolean,
  highlighted: boolean,
  style: {},
  goto: () => void,
  setTask: () => void,
  overviewType: string,
  select: (event: Event, { checked: boolean }) => void,
  sortByColumn: (string) => void,
  setActionInHistoryTask: () => void,
  declineDelegate: () => void,
  acceptedDelegate: () => void,
  orderBy: string,
  collapseNote: boolean,
  handleCollapseNote: () => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'Search for a reminder': 'Search for a reminder',
    Focus: 'Focus',
    Note: 'Note',
    Days: 'Days',
    Name: 'Name',
    Category: 'Category',
    Responsible: 'Responsible',
  },
});
const historyTooltip = {
  fontSize: '11px',
};
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

const categoryLoader = (
  <ContentLoader width={120} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const deadlineLoader = (
  <ContentLoader width={128} height={44}>
    <rect x={8} y={8} rx={4} ry={4} width={96} height={8} />
    <rect x={8} y={24} rx={4} ry={4} width={64} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

const responsibleLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

const fHeaderComponent = ({
  width,
  setOrderBy,
  orderBy,
  showSpiner,
  overviewType,
  objectType,
  changeOnMutilTaskMenu,
  totalRowSelected
}: PropsType) => {
  if (overviewType == OverviewTypes.Delegation.Task) {
    return (
      <div style={{ width }} className={css.header}>
        <div className={css.content}>
          <div className={css.check}>
            <OverviewSelectAll overviewType={overviewType} className={css.checkAll} />
          </div>
          {showSpiner && (
            <div className={css.check}>
              <MutilActionMenu
                overviewType={overviewType}
                changeOnMutilTaskMenu={changeOnMutilTaskMenu}
                className={css.bgMore}
              />
            </div>
          )}
          <div className={css.start} onClick={() => setOrderBy('dateAndTime', objectType)}>
            <span>
              {_l`Deadline`}
              <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
                <i class="angle down icon"></i>
              </span>
            </span>
          </div>
          <div className={css.contact} onClick={() => setOrderBy('accountContact', objectType)}>
            <span>
              {_l`Name`}
              <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
                <i class="angle down icon"></i>
              </span>
            </span>
          </div>
          <div className={css.focusDelegation} onClick={() => setOrderBy('focus', objectType)}>
            <span>
              {_l`Focus`}
              <span className={orderBy === 'focus' ? `${css.activeIcon}` : `${css.normalIcon}`}>
                <i class="angle down icon"></i>
              </span>
            </span>
          </div>
          {/*        <div className={css.category} onClick={() => setOrderBy('category', objectType)}><span>{_l`Category`}<span className={orderBy === 'category' ? `${css.activeIcon}` : `${css.normalIcon}`}><i class="angle down icon"></i></span></span></div>*/}
          <div className={css.noteDelegation}>
            <span>{_l`Note`}</span>
          </div>
          <div className={css.daysDelegation}>
            <span>{_l`Days`}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content}>
        <div className={css.check}>
          <OverviewSelectAll overviewType={overviewType} className={css.checkAll} />
        </div>
        {showSpiner && (
          <div className={css.check}>
            <MutilActionMenu
              overviewType={overviewType}
              changeOnMutilTaskMenu={changeOnMutilTaskMenu}
              className={css.bgMore}
            />
          </div>
        )}
        <div className={css.start} onClick={() => setOrderBy('dateAndTime', objectType)}>
          <span>
            {_l`When`}
            <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        </div>
        <div className={css.contact} onClick={() => setOrderBy('accountContact', objectType)}>
          <span>
            {_l`Name`}
            <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        </div>
        <div className={css.focus} onClick={() => setOrderBy('focus', objectType)}>
          <span>
            {_l`Focus`}
            <span className={orderBy === 'focus' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        </div>
        <div className={css.category} onClick={() => setOrderBy('category', objectType)}>
          <span>
            {_l`Category`}
            <span className={orderBy === 'category' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        </div>
        <div className={css.note}>
          <span>{_l`Note`}</span>
        </div>
        <div className={css.responsible} onClick={() => setOrderBy('owner', objectType)}>
          <span>
            {_l`Responsible`}
            <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i class="angle down icon"></i>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const HeaderComponent = compose(
  connect(
    (state, { overviewType, objectType }) => {
      const search = getSearch(state, objectType);
      const overview = getOverview(state, overviewType);
      const showSpiner = isShowSpiner(state, overviewType);
      return {
        orderBy: search ? search.orderBy : 'dateAndTime',
        showSpiner: showSpiner,
        selectAll: overview.selectAll,
      };
    },
    {
      setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
      changeOnMutilTaskMenu: changeOnMutilTaskMenu,
    }
  ),
  withHandlers({
    sortByColumn: ({ sortByDate }) => (sortValue) => {
      sortByDate(sortValue);
    },
  })
)(fHeaderComponent);

export const PlaceholderComponent = ({ className, style, overviewType }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.listItem, css.loading, className)} style={style}>
      <div className={css.check}>{checkLoader}</div>
      <div className={css.start}>{deadlineLoader}</div>
      <div className={css.contact}>{noteLoader}</div>
      {overviewType != OverviewTypes.Delegation.Task ? (
        <>
          <div className={css.focus}>{noteLoader}</div>
          <div className={css.category}>{categoryLoader}</div>
          <div className={css.note}>{noteLoader}</div>
          <div className={css.responsible}>{responsibleLoader}</div>
        </>
      ) : (
        <>
          <div className={css.focusDelegation}>{noteLoader}</div>
          <div className={css.noteDelegation}>{noteLoader}</div>
          <div className={css.daysDelegation}>{responsibleLoader}</div>
        </>
      )}
    </div>
  );
};

const InfiniteTaskListRow = ({
  overviewType,
  select,
  highlighted,
  task,
  showHistory,
  style,
  className,
  goto,
  setTask,
  setActionInHistoryTask,
  selected,
  acceptedDelegate,
  declineDelegate,
  selectAll,
  collapseNote,
  handleCollapseNote,
  showSpiner,
  companyAvgDistributionDays,
}: PropsType) => {
  const listCn = cx(css.itemRow, className, {
    [overviewCss.highlighted]: highlighted,
  });

  const getDelegationDays = () => {
    let currentDate = new Date();
    let distributionDate = new Date(task.distributionDate);
    let timeDiff = Math.abs(currentDate.getTime() - distributionDate.getTime());
    let date = Math.floor(timeDiff / (1000 * 3600 * 24));

    // companyAvgDistributionDays got from server
    // let companyAvgDistributionDays;
    if (companyAvgDistributionDays == null) companyAvgDistributionDays = 0;

    if (date < companyAvgDistributionDays * 0.75) {
      return css.textGreen;
    } else if (date >= companyAvgDistributionDays * 0.75 && date <= companyAvgDistributionDays) {
      return css.textYellow;
    } else {
      return css.textRed;
    }
    return '';
  };
  const getPassedDateTime = () => {
    if (task.dateAndTime) {
      let currentDate = new Date();
      let deadlineDate = new Date(task.dateAndTime);
      let timeDiff = Math.abs(currentDate.getTime() - deadlineDate.getTime());

      return Math.floor(timeDiff / (1000 * 3600 * 24));
    } else {
      return 0;
    }
  };
  const renderActionSpinder = () => {
    if (task.accepted === null && task.type === 'INVITED') {
      return (
        <div className={css.responsibleRow}>
          <CreatorPane size={30} creator={{ avatar: task.ownerAvatar }} firstName={task.ownerFirstName} lastName={task.ownerLastName}  avatar={true} />
          <div className={css.invitedBtn}>
            <a onClick={acceptedDelegate} className={css.accpetInvited}>
              Accept
            </a>
            <a onClick={declineDelegate} className={css.declineInvited}>
              Decline
            </a>
          </div>
        </div>
      );
    }
    if (task.type === 'DISTRIBUTE') {
      return (
        <div className={css.responsibleRow}>
          <div className={cx(css.noteDelegation, getDelegationDays(task), css.dayFonts)}>{getPassedDateTime(task)}</div>
          <div className={css.rightMenu}>
            <div className={css.reponsibleIconSize}>
              <TaskActionMenu className={css.bgMore} task={task} overviewType={overviewType} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={css.responsibleRow}>
        <CreatorPane size={30} firstName={task.ownerFirstName} lastName={task.ownerLastName} creator={{ avatar: task.ownerAvatar, disc: task.ownerDiscProfile }} avatar={true} />
        <div className={css.rightMenu}>
          <Popup
            style={historyTooltip}
            trigger={
              <div className={css.reponsibleIconSize}>
                <div
                  className={!task.finished ? `${css.notSetasDone}` : `${css.setDone}`}
                  onClick={!task.finished ? setTask : setActionInHistoryTask}
                >
                  <div></div>
                </div>
              </div>
            }
            content={!task.finished ? _l`Set as done` : _l`Done`}
            position="top center"
          />
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

  const shortenNote = (value) => {
    if (value && value.length > 70) {
      return value.slice(0, 70);
    }
    return value;
  };

  const onlyConnectAccount = !task.contactId && task.organisationId;

  const { contactEmail, organisationEmail, organisationPhone, contactPhone } = task;

  const email = contactEmail ? contactEmail : organisationEmail;
  const phone = contactPhone ? contactPhone : organisationPhone;
  const isDelegation = overviewType == OverviewTypes.Delegation.Task;

  const contentCss = cx(css.content, css[task.tag.color]);
  return (
    <div className={listCn} style={style} onClick={goto}>
      <div className={`${css.content} ${css[task.tag.color]}`}>
        <div className={css.check}>
          <Checkbox size={12} onChange={select} checked={selected} />
        </div>
        {showSpiner && <div className={css.check}></div>}
        <div className={css.start}>
          <Deadline twoRows date={task.dateAndTime} />
        </div>
        <div className={css.contact}>
          <div className={cx(css.responsibleRow, css.nameRow)}>
            <div style={{ marginRight: 5 }}>
              <div className={css.customName}>{task.contact.displayName} </div>
              <div className={onlyConnectAccount && css.customName}>{task.organisation.displayName}</div>
            </div>
            {email || phone ? <ContactPopup name={task.contact.name} email={email} phone={phone} /> : <div></div>}
          </div>
        </div>
        <div className={!isDelegation ? css.focus : css.focusDelegation}>
          <FocusPopup focus={task.focus} />
        </div>
        {!isDelegation && <div className={css.category}>{task.category}</div>}
        {/* {
        ( !task.note || (task.note && task.note.length <= 70)) ? <div className={!isDelegation? css.note : css.noteDelegation}><p>{task.note}</p></div>:
          (collapseNote)? <div className={!isDelegation? css.note : css.noteDelegation}>{shortenNote(task.note)}<a className={css.textMore} onClick={()=>{}}> ...</a></div> :
          <div className={!isDelegation? css.note : css.noteDelegation}>{task.note}<a className={css.textMore} onClick={handleCollapseNote}>^</a></div>

      } */}
        {!task.note || (task.note && task.note.length <= 70) ? (
          <div className={!isDelegation ? css.note : css.noteDelegation}>
            <p>{task.note}</p>
          </div>
        ) : (
          <Popup
            trigger={
              <div className={!isDelegation ? css.note : css.noteDelegation}>{`${shortenNote(task.note)}...`}</div>
            }
            style={{ fontSize: 11 }}
            content={task.note}
          />
        )}
        <div className={!isDelegation ? css.responsible : css.daysDelegation}>{renderActionSpinder(task)}</div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType, itemId, objectType }) => {
    const getStateSearch = getSearch(state, objectType);
    const overview = getOverview(state, overviewType);
    const showSpiner = isShowSpiner(state, overviewType);
    const companyAvgDistributionDays = getCompanyAvgDistributionDays(state, overviewType);
    return {
      task: getTask(state, itemId),
      selected: isItemSelected(state, overviewType, itemId),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      showHistory: getStateSearch.history,
      showSpiner: showSpiner,
      selectAll: overview.selectAll,
      companyAvgDistributionDays: companyAvgDistributionDays,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    highlight: OverviewActions.highlight,
  }),
  withState('collapseNote', 'setCollapseNote', true),
  branch(({ task }) => !task, renderNothing),
  withHandlers({
    goto: ({ overviewType, task, route = '/tasks', history, highlight }) => () => {
      highlight(overviewType, task.uuid);
      history.push(`${route}/${task.uuid}`);
    },
    select: ({ select, task }) => (event, { checked }) => {
      event.stopPropagation();
      select(task.uuid, checked);
    },
    setTask: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'set');
    },
    setActionInHistoryTask: () => (e) => {
      e.stopPropagation();
    },
    acceptedDelegate: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'acceptedDelegate');
    },
    declineDelegate: ({ overviewType, highlight, task }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, task.uuid, 'declineDelegate');
    },
    handleCollapseNote: ({ setCollapseNote, collapseNote }) => (e) => {
      e.stopPropagation();
      setCollapseNote(!collapseNote);
    },
  })
)(InfiniteTaskListRow);

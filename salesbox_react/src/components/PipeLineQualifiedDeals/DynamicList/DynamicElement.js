import React from 'react';
import moment from 'moment';
import _l from 'lib/i18n';
import './Dynamic.less';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import * as OverviewActions from 'components/Overview/overview.actions';
import { compose, withHandlers, branch, renderNothing, withState } from 'recompose';
import ProgressBar from '../../CircularProgressBar/CircularProgressBar';
import QualifiedDealActionMenu from '../../../essentials/Menu/QualifiedDealActionMenu';
import { checkBorder } from '../TaskSteps/CardStep';
import { setOrderBy, progressUpdate } from '../qualifiedDeal.actions';
import { withRouter } from 'react-router';
import { OverviewTypes } from 'Constants';
import { isItemHighlighted } from '../../Overview/overview.selectors';
import FocusDescription from '../../Focus/FocusDescription';

addTranslations({
  'en-US': {
    value: 'Value',
    Account: 'Account',
    Progress: 'Progress',
    Gross: 'Gross',
    Weighted: 'Weighted',
    Net: 'Net',
  },
});

const DynamicHeaderF = ({ width, labels, orderBy, sortByColumn }) => {
  return (
    <div style={{ width }} className="header">
      <div onClick={() => sortByColumn('contractDate')} className="info column">
        <span className="row">
          {_l`When`}
          <span className={orderBy === 'contractDate' ? `activeIcon` : `normalIcon`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => sortByColumn('grossValue')} className="value column">
        <span className="row">
          {_l`Value`}
          <span className={orderBy === 'grossValue' ? `activeIcon` : `normalIcon`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => sortByColumn('accountContactName')} className="account column">
        <span className="row">
          {_l`Company`}
          <span className={orderBy === 'accountContactName' ? `activeIcon` : `normalIcon`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => sortByColumn('opportunityProgress')} className="total-progress column">
        <span className="row">
          {_l`Progress`}
          <span className={orderBy === 'opportunityProgress' ? `activeIcon` : `normalIcon`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      {labels.map((label, index) => {
        return (
          <Popup
            trigger={
              <div style={{ width: `${60 / labels.length}%` }} className="special-column column" key={index.toString()}>
                {label.name}
              </div>
            }
            position="top center"
          >
            <Popup.Content>
              <span style={{ fontSize: 11 }}>{label.description}</span>
            </Popup.Content>
            <FocusDescription
              noteStyle={{ marginTop: 5, lineHeight: '15px' }}
              styleBox={{ width: 15, height: 15 }}
              styleText={{ fontSize: 11 }}
              discProfile={label.discProfile}
            />
          </Popup>
        );
      })}
      <div className="more column"></div>
    </div>
  );
};

const DynamicItemF = ({
  goto,
  width,
  item,
  labels,
  style,
  overviewType,
  progressUpdate,
  salesProcessId,
  highlighted,
}) => {
  const { organisation, prospectProgressDTOList } = item;
  const contactName =
    item.sponsorList && item.sponsorList.length > 0
      ? item.sponsorList[0].firstName + ' ' + item.sponsorList[0].lastName
      : '';
  const shortenValue = (value) => {
    if (value && value.length > 30) {
      return value.slice(0, 30);
    }
    return value;
  };
  const borderColorCheck = checkBorder(item);
  const progressBorberColor =
    borderColorCheck === 'GREEN' ? '#aacd40' : borderColorCheck === 'GREEN' ? '#f4b24e' : '#df5759';

  const backgroundColor = highlighted ? '#f0f0f0' : '#fff';

  return (
    <div onClick={goto} style={{ ...style, width, cursor: 'pointer', backgroundColor }} className="header item">
      <div className="info column">
        <div
          className={moment(item.contractDate).format() > moment().format() ? 'contractFutureDate' : 'contractOldDate'}
        >
          {moment(item.contractDate).format('DD MMM, YYYY')}
        </div>
      </div>
      <div className="value column">
        <span className="grossValue">{Math.ceil(item.grossValue / 1000)}K</span>
      </div>
      <div className="account column">
        <span className="accountName">
          {organisation && organisation.name ? (
            organisation.name.length > 30 ? (
              <Popup trigger={<div>{shortenValue(organisation.name)}...</div>}>
                <Popup.Content>{organisation.name}</Popup.Content>
              </Popup>
            ) : (
              organisation.name
            )
          ) : (
            contactName
          )}
          {/* {organisation && organisation.name ? (organisation.name.length < 30 ? <div>{organisation.name}</div> : <div>{organisation.name}</div> ): contactName} */}
        </span>
        <div className="description">
          {item && item.description && item.description.length > 30 ? (
            <Popup trigger={<div>{shortenValue(item.description)}...</div>} position="top center">
              <Popup.Content>{item.description}</Popup.Content>
            </Popup>
          ) : (
            ''
          )}
          {item && item.description && item.description.length < 30 ? <div>{item.description}</div> : ''}
        </div>
      </div>
      <div className="total-progress column">
        <ProgressBar
          width={48}
          height={48}
          percentage={item ? item.prospectProgress : 0}
          radius={18}
          color={progressBorberColor}
        />
      </div>
      {labels.map((label, index) => {
        const prospect = (prospectProgressDTOList ? prospectProgressDTOList : []).find(
          (value) => value.activityId === label.activityId
        );
        return (
          <div style={{ width: `${60 / labels.length}%` }} className="special-column column" key={index.toString()}>
            {prospect && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  progressUpdate(prospect.uuid, !prospect.finished, salesProcessId, item.uuid);
                }}
                className={`${prospect && prospect.finished ? 'done' : 'not-done'} circle`}
              >
                <div />
              </div>
            )}
          </div>
        );
      })}
      <div className="more column">
        <QualifiedDealActionMenu className={'bg-more circle'} overviewType={overviewType} qualifiedDeal={item} />
      </div>
    </div>
  );
};

export const DynamicItem = compose(
  withRouter,
  connect(
    (state, { item }) => {
      return {
        highlighted: isItemHighlighted(state, OverviewTypes.Pipeline.Qualified, item.uuid),
      };
    },
    {
      progressUpdate,
      highlight: OverviewActions.highlight,
    }
  ),
  withHandlers({
    goto: ({ highlight, history, item }) => (e) => {
      e.stopPropagation();
      highlight(OverviewTypes.Pipeline.Qualified, item.uuid);
      history.push(`/pipeline/overview/${item.uuid}`);
    },
  })
)(DynamicItemF);

export const DynamicTotalItem = ({ width, item, labels, style }) => {
  return (
    <div style={{ ...style, width }} className="header item total">
      <div className="info column total-info">
        {/* <span style={{ color: '#EE8267' }}>{_l`Gross`} {item.grossValue.toString().convertMoney()}
        <span style={{ marginLeft: 10 }}>{_l`Net`} {item.totalNetValue.toString().convertMoney()}</span>
      </span> */}
      </div>
      <div className="value column"></div>
      <div className="account column">
        <span></span>
      </div>
      <div className="total-progress column"></div>
      {labels.map((label, index) => {
        return (
          <div style={{ width: `${60 / labels.length}%` }} className="special-column column" key={index.toString()}>
            <span className="percent-wrap normal-text">{label.progress}%</span>
          </div>
        );
      })}
      <div className="more column"></div>
    </div>
  );
};

export const DynamicHeader = compose(
  connect(
    (state) => {
      const search = state.entities.qualifiedDeal.__SEARCH_PROGRESS_LIST;
      return {
        orderBy: search ? search.orderBy : 'contractDate',
      };
    },
    {
      setOrderBy,
      progressUpdate,
    }
  ),
  withHandlers({
    sortByColumn: ({ salesProcessId, setOrderBy }) => (sortValue) => {
      setOrderBy(salesProcessId, sortValue);
    },
  })
)(DynamicHeaderF);

// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Checkbox, Label } from 'semantic-ui-react';
import { getOverview, getTotalRowSelected } from 'components/Overview/overview.selectors';
import * as OverviewActions from './overview.actions';
import { OverviewTypes } from '../../../src/Constants';

type PropsT = {
  selectAll: boolean,
  onChange: (Event, { checked: boolean }) => void,
};

const OverviewSelectAll = ({ selectAll, onChange, className, totalRowSelected, showSearch, overviewType }: PropsT) => {
  if (overviewType === OverviewTypes.Pipeline.Qualified) {
    return (
      <>
        {totalRowSelected > 0 && (
          <span
            className={showSearch ? 'total-selected-row-has-search-deal' : 'total-selected-row-no-search-deal'}
            id="total-selected-row"
          >
            {totalRowSelected}
          </span>
        )}

        <Checkbox className={className} checked={selectAll} onChange={onChange} />
      </>
    );
  }
  if (overviewType === OverviewTypes.Pipeline.Order) {
    return (
      <>
        {totalRowSelected > 0 && (
          <span
            className={showSearch ? 'total-selected-row-has-search-order' : 'total-selected-row-no-search-order'}
            id="total-selected-row"
          >
            {totalRowSelected}
          </span>
        )}

        <Checkbox className={className} checked={selectAll} onChange={onChange} />
      </>
    );
  }
  return (
    <>
      {totalRowSelected > 0 && (
        <span
          className={showSearch ? 'total-selected-row-has-search' : 'total-selected-row-no-search'}
          id="total-selected-row"
        >
          {totalRowSelected}
        </span>
      )}

      <Checkbox className={className} checked={selectAll} onChange={onChange} />
    </>
  );
};

export default compose(
  connect(
    (state, { overviewType }) => {
      const overview = getOverview(state, overviewType);
      const totalRowSelected = getTotalRowSelected(state, overviewType);
      let showSearch = false;
      switch (overviewType) {
        case OverviewTypes.Activity.Task:
          showSearch = state.search?.TASK?.shown;
          break;
        case OverviewTypes.Activity.Appointment:
          showSearch = state.search?.APPOINTMENT?.shown;
          break;
        case OverviewTypes.Account:
          showSearch = state.search?.ACCOUNT?.shown;
          break;
        case OverviewTypes.Contact:
          showSearch = state.search?.CONTACT?.shown;
          break;
        case OverviewTypes.CallList.Account:
          showSearch = state.search?.CALL_LIST_ACCOUNT?.shown;
          break;
        case OverviewTypes.CallList.Contact:
          showSearch = state.search?.CALL_LIST_CONTACT?.shown;
          break;
        case OverviewTypes.Resource:
          showSearch = state.search?.RESOURCE?.shown;
          break;
        case OverviewTypes.Delegation.Task:
          showSearch = state.search?.DELEGATION?.shown;
          break;
        case OverviewTypes.Delegation.Lead:
          showSearch = state.search?.DELEGATION_LEADS?.shown;
          break;
        case OverviewTypes.Pipeline.Lead:
          showSearch = state.search?.LEAD?.shown;
          break;
        case OverviewTypes.Pipeline.Qualified:
          showSearch = state.search?.PIPELINE_QUALIFIED?.shown;
          break;
        case OverviewTypes.Pipeline.Order:
          showSearch = state.search?.PIPELINE_ORDER?.shown;
          break;
        case OverviewTypes.RecruitmentClosed:
          showSearch = state.search?.CANDIDATE_CLOSE?.shown;
          break;
      }
      return {
        selectAll: overview.selectAll,
        totalRowSelected: totalRowSelected,
        showSearch: showSearch,
      };
    },
    {
      setSelectAll: OverviewActions.setSelectAll,
    }
  ),
  withHandlers({
    onChange: ({ setSelectAll, overviewType }) => (event: Event, { checked: selectAll }) => {
      setSelectAll(overviewType, selectAll);
    },
  })
)(OverviewSelectAll);

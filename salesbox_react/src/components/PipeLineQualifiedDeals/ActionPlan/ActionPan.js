//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Popup, Loader } from 'semantic-ui-react';
import { TaskItem } from 'essentials';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';

import * as QualifiedActions from '../qualifiedDeal.actions';
import ActionPlanItem, { ActionPlanHeader } from './ActionPlanElement';
import _l from 'lib/i18n';
import { ObjectTypes } from '../../../Constants';
import './ActionPlan.less';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Action Plan': 'Action Plan',
    'Delivery Start': 'Delivery Start',
    'Delivery End': 'Delivery End',
  },
});

const ActionPlan = ({
  objectType,
  qualifiedInList,
  qualifiedDeal,
  overviewType,
  history,
  setTagManual,
  tag,
  handleHistory,
  handleOrderBy,
  orderBy,
  isFetching,
}) => {
  let objectMerge = qualifiedDeal;
  if (qualifiedInList) {
    objectMerge = {
      ...qualifiedInList,
      ...qualifiedDeal,
    };
  }
  const { actionPlan } = objectMerge;
  const prospectProgressDTOList = actionPlan ? actionPlan.prospectProgressDTOList : [];
  return (
    <Collapsible width={308} title={_l`Action Plan`} open={true}>
      {isFetching ? (
        <div className={isFetching && `isFetching`}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          <ActionPlanHeader detail={qualifiedDeal} header />
          {(prospectProgressDTOList ? prospectProgressDTOList : []).map((prospect, idx) => {
            const preProspect = idx - 1 >= 0 ? prospectProgressDTOList[idx - 1] : null;
            return (
              <ActionPlanItem
                qualifiedId={qualifiedDeal.uuid}
                prospect={prospect}
                preProspect={preProspect}
                detail={qualifiedDeal}
                salesMethodMode={qualifiedDeal.salesMethodMode}
                key={prospect.uuid}
              />
            );
          })}
          <ActionPlanItem date name={_l`Next action`} value={qualifiedDeal ? qualifiedDeal.contractDate : null} />
          <ActionPlanItem date name={_l`Delivery start`} value={actionPlan ? actionPlan.deliveryStartDate : null} />
          <ActionPlanItem date name={_l`Delivery end`} value={actionPlan ? actionPlan.deliveryEndDate : null} />
        </>
      )}
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchActionPlan: QualifiedActions.requestFetchActionPlan,
};

export default compose(
  connect((state, { qualifiedDeal }) => {
    const commonData = state.entities.qualifiedDeal.__COMMON_DATA;
    return {
      qualifiedInList: state.entities.qualifiedDeal[qualifiedDeal.uuid],
      actionPlanRefesh: commonData ? commonData.actionPlanRefesh : 0,
      isFetching: state.overview.PIPELINE_QUALIFIED ? state.overview.PIPELINE_QUALIFIED.isFetching : false,
    };
  }, mapDispatchToProps),

  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchActionPlan, qualifiedDeal, actionPlanRefesh } = this.props;
      if (nextProps.qualifiedDeal.uuid !== qualifiedDeal.uuid || actionPlanRefesh !== nextProps.actionPlanRefesh) {
        requestFetchActionPlan(nextProps.qualifiedDeal.uuid);
      }
    },
  }),
  //orderBy
  withGetData(({ requestFetchActionPlan, qualifiedDeal }) => () => {
    requestFetchActionPlan(qualifiedDeal.uuid);
  }),

  withHandlers({})
)(ActionPlan);

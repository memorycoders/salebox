// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import { moveStepActionPlan, progressUpdate } from '../qualifiedDeal.actions';
import moment from 'moment';
import { getSaleProcessActive } from '../qualifiedDeal.selector';
import FocusDescription from '../../Focus/FocusDescription';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Progress: 'Progress',
    Meeting: 'Meeting',
    Done: 'Done',
  },
});

type PropsT = {
  task: {},
};

export const ActionPlanHeader = ({ detail }) => {
  return (
    <div className="action-plan-item header-action-plan">
      <div className="step common-item">{_l`Stage`}</div>
      {detail && detail.salesMethodManualProgress === 'OFF' ? (
        <div className="progress common-item">{_l`Progress`}</div>
      ) : (
        <div className="progress common-item" />
      )}
      {/* <div className="metting common-item">
        {_l`Meeting`}
      </div> */}
      <div className="done-item common-item">{_l`Done`}</div>
    </div>
  );
};

const ActionPlanItem = ({ prospect, progressUpdate, salesMethodMode, preProspect, detail }: PropsT) => {
  return (
    <div className={`action-plan-item`}>
      <div className="step common-item">
        <div className="step-name">
          <Popup style={{ fontSize: 11 }} trigger={<span>{prospect.name}</span>}>
            <Popup.Content>
              <span style={{ fontSize: 11 }}>{prospect.description}</span>
            </Popup.Content>
            <FocusDescription
              noteStyle={{ marginTop: 5, lineHeight: '15px' }}
              styleBox={{ width: 15, height: 15 }}
              styleText={{ fontSize: 11 }}
              discProfile={prospect.discProfile}
            />
          </Popup>
        </div>
        <div className="step-progress">
          <div className="progress-line" />
          <div className={`circle progress-status ${prospect && prospect.finished ? 'circle-green' : 'circle-grey'}`} />
          <div className="progress-line" />
        </div>
      </div>
      {detail.salesMethodManualProgress === 'OFF' ? (
        <div className={`progress common-item ${prospect && prospect.finished ? 'green-text' : ''}`}>
          {prospect.progress}%
        </div>
      ) : (
        <div className="progress common-item" />
      )}
      {/* <div className="metting common-item">
        {prospect.numberActiveMeeting}
      </div> */}
      <div className="done-item common-item">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (salesMethodMode === 'DYNAMIC') {
              progressUpdate(prospect.uuid, prospect.activityId, prospect);
            } else {
              if (!preProspect) {
                return;
              }
              progressUpdate(prospect.uuid, prospect.activityId, prospect);
            }
          }}
          className={`${prospect && prospect.finished ? 'done' : 'not-done'} circle`}
        >
          <div />
        </div>
      </div>
    </div>
  );
};

const ActionPlanDate = ({ name, value }: PropsT) => {
  return (
    <div className="action-plan-item">
      <div className="step common-item">
        <div className="step-name">{name}</div>
        <div className="step-progress">
          <div className="progress-line" />
          <div className={`circle progress-status circle-grey`} />
          <div className="progress-line" />
        </div>
      </div>
      <div className={`action-plan-date common-item`}>{value && moment(value).format('DD MMM, YYYY')}</div>
    </div>
  );
};

const mapDispatchToProps = {
  moveStepActionPlan,
  progressUpdate,
};

export default compose(
  branch(({ header }) => header, renderComponent(ActionPlanHeader)),
  branch(({ date }) => date, renderComponent(ActionPlanDate)),
  connect((state) => {
    return {
      salesProcessId: getSaleProcessActive(state),
    };
  }, mapDispatchToProps),

  withHandlers({
    progressUpdate: ({ moveStepActionPlan, progressUpdate, salesProcessId, qualifiedId, salesMethodMode }) => (
      stepId,
      activityId,
      prospect
    ) => {
      if (salesMethodMode === 'DYNAMIC') {
        return progressUpdate(prospect.uuid, !prospect.finished, salesProcessId, qualifiedId);
      }
      moveStepActionPlan(stepId, salesProcessId, qualifiedId, activityId);
    },
  })
)(ActionPlanItem);

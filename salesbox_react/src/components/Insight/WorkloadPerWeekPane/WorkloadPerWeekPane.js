//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Progress } from 'semantic-ui-react';
import { calculatePercentage } from 'lib';
import InsightPane from '../InsightPane/InsightPane';
import css from '../Insight.css';
import { progressColors } from '../colors';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Workload per week': 'Workload per week',
    Dials: 'Dials',
    Calls: 'Calls',
    Hours: 'Hours',
    'Weeks to go': 'Weeks to go',
  },
});

const WorkloadPerWeekPane = ({ data }: PropsT) => {
  return (
    <InsightPane padded title={_l`Workload per week`}>
      {data.DIAL && (
        <div className={css.workload}>
          <div className={css.label}>
            <span>{_l`Dials`}</span>
            <strong>{data.DIAL.targetValue}</strong>
          </div>
          <Progress
            progress
            color={progressColors[data.DIAL.colorType]}
            size="small"
            percent={calculatePercentage(data.DIAL.actualValue, data.DIAL.targetValue)}
          />
        </div>
      )}
      {data.CALL && (
        <div className={css.workload}>
          <div className={css.label}>
            <span>{_l`Calls`}</span>
            <strong>{data.CALL.targetValue}</strong>
          </div>
          <Progress
            progress
            color={progressColors[data.CALL.colorType]}
            size="small"
            percent={calculatePercentage(data.CALL.actualValue, data.CALL.targetValue)}
          />
        </div>
      )}
      {data.APPOINTMENT && (
        <div className={css.workload}>
          <div className={css.label}>
            <span>{_l`Meetings`}</span>
            <strong>{data.APPOINTMENT.targetValue}</strong>
          </div>
          <Progress
            progress
            color={progressColors[data.APPOINTMENT.colorType]}
            size="small"
            percent={calculatePercentage(data.APPOINTMENT.actualValue, data.APPOINTMENT.targetValue)}
          />
        </div>
      )}
      {data.HOUR && (
        <div className={css.workload}>
          <div className={css.label}>
            <span>{_l`Hours`}</span>
            <strong>{data.HOUR.targetValue}</strong>
          </div>
          <Progress
            progress
            color={progressColors[data.HOUR.colorType]}
            size="small"
            percent={calculatePercentage(data.HOUR.actualValue, data.HOUR.targetValue)}
          />
        </div>
      )}
      {data.WEEK_TO_GO && (
        <div className={css.workload}>
          <div className={css.label}>
            <span>{_l`Weeks to go`}</span>
            <strong>{data.WEEK_TO_GO.targetValue}</strong>
          </div>
          <Progress
            progress
            color={progressColors[data.WEEK_TO_GO.colorType]}
            size="small"
            percent={calculatePercentage(data.WEEK_TO_GO.actualValue, data.WEEK_TO_GO.targetValue)}
          />
        </div>
      )}
    </InsightPane>
  );
};

export default WorkloadPerWeekPane;

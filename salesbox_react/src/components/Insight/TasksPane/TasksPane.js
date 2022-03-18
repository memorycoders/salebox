//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Container, Progress, Text } from 'components/CircularProgressBar';
import { calculatePercentage } from 'lib';
import colors from '../colors';
import InsightPane from '../InsightPane/InsightPane';
import AwardImage from '../AwardImage';
import css from '../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Reminders: 'Reminders',
    'Average {0}': 'Average {0}',
    'Record {0}': 'Record {0}',
  },
});

const TasksPane = ({ data }: PropsT) => {
  return (
    <InsightPane padded title={_l`Reminders`}>
      <div className={css.progress}>
        <Container fullRadius={128}>
          <Progress
            percentage={ calculatePercentage(data.doneValue, data.needValue) }
            color={colors[data.bigCircleColor]}
            strokeWidth={16}
          />
          <Progress
            percentage={ calculatePercentage(data.doneValue, data.targetValue) }
            color={colors[data.smallCircleColor]}
            padding={18}
            strokeWidth={16}
          />
          <Text size={40} color="#777" text={_l`${data.doneValue}`} x={128} y={128 - 30} />
          <Text size={20} color="#333" text={_l`Average ${data.needValue}`} x={128} y={128 + 18} />
          <Text size={20} color="#333" text={_l`Record ${data.targetValue}`} x={128} y={128 + 38} />
        </Container>
        <AwardImage fade/>
      </div>
    </InsightPane>
  );
};

export default TasksPane;

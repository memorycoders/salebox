//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Container, Progress, Text } from 'components/CircularProgressBar';
import { calculatePercentage } from 'lib';
import humanFormat from 'human-format';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';
import colors from '../../colors';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Win ratio': 'Win ratio',
    Qualified: 'Qualified',
    'Sales forecast': 'Sales forecast',
    'Target: {0}': 'Target: {0}',
  },
});

const PipelineSalesPane = ({ data, salesStats }: PropsT) => {
  if (!data || !data.REPORT_CIRCLE_SALES) {
    return <InsightPane padded title={_l`Pipeline`}></InsightPane>;
  }

  return (
    <InsightPane padded title={_l`Pipeline`}>
      <div className={css.pipeline}>
        <div className={css.column}>
          <Container fullRadius={80}>
            <Progress
              percentage={calculatePercentage(salesStats.WIN_RATIO.percent, 100)}
              color={colors[salesStats.WIN_RATIO.colorType]}
              strokeWidth={10}
            />
            <Text size={30} color="#777" text={_l`${salesStats.WIN_RATIO.percent / 100}:p`} x={80} y={80} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Win ratio`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <Container fullRadius={80}>
            <Progress
              percentage={calculatePercentage(salesStats.PIPE_PROGRESS ? salesStats.PIPE_PROGRESS.percent : 0, 100)}
              color={colors.GREEN}
              strokeWidth={10}
            />
            <Text
              size={30}
              color="#777"
              text={_l`${(salesStats.PIPE_PROGRESS ? salesStats.PIPE_PROGRESS.percent : 0) / 100}:p`}
              x={80}
              y={80}
            />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Pipe progress`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <Container fullRadius={80}>
            <Progress
              percentage={calculatePercentage(data.REPORT_CIRCLE_PROSPECT.percent, 100)}
              color={colors[data.REPORT_CIRCLE_PROSPECT.colorType]}
              strokeWidth={10}
            />
            <Text size={30} color="#777" text={humanFormat(data.REPORT_CIRCLE_PROSPECT.value)} x={80} y={80} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Deals`}</strong>
            <br />
            {_l`Target: ${humanFormat(data.REPORT_CIRCLE_PROSPECT.value)}`}
          </div>
        </div>
        <div className={css.column}>
          <Container fullRadius={80}>
            <Progress
              percentage={calculatePercentage(data.REPORT_CIRCLE_SALES.percent, 100)}
              color={colors[data.REPORT_CIRCLE_SALES.colorType]}
              strokeWidth={10}
            />
            <Text size={30} color="#777" text={humanFormat(data.REPORT_CIRCLE_SALES.value)} x={80} y={80} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Sales forecast`}</strong>
            <br />
            {_l`Won + net`}
            <br />
            {_l`Target: ${humanFormat(data.REPORT_CIRCLE_SALES.value)}`}
          </div>
        </div>
      </div>
    </InsightPane>
  );
};

export default PipelineSalesPane;

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
  forecast: {},
};

addTranslations({
  'en-US': {
    Sales: 'Sales',
    Closed: 'Closed',
    Gap: 'Gap',
    Weighted: 'Weighted',
    Gross: 'Gross',
    Me: 'Me',
    Company: 'Company',
    'Profit forecast': 'Profit forecast',
    'Sales target: {0}': 'Sales target: {0}',
    'Missing pipe: {0}': 'Missing pipe: {0}',
    'Company best: {0}': 'Company best: {0}',
    'Profit target: {0}': 'Profit target: {0}',
  },
});

const SalesPane = ({ data, forecast = {} }: PropsT) => {
  if (!data || !data.CLOSED) {
    return <InsightPane padded title={_l`Sales`}></InsightPane>;
  }
  return (
    <InsightPane padded title={_l`Sales`}>
      <div className={css.sales}>
        <div className={css.column}>
          <Container fullRadius={128}>
            <Progress
              percentage={calculatePercentage(data.CLOSED.percent, 100)}
              color={colors[data.CLOSED.colorType]}
              strokeWidth={16}
            />
            <Progress
              percentage={calculatePercentage(data.GAP.percent, 100)}
              color={colors[data.GAP.colorType]}
              padding={18}
              strokeWidth={16}
            />
            <Text size={20} color="#333" text={_l`Done`} x={128} y={128 - 68} />
            <Text
              size={40}
              color={colors[data.CLOSED.colorType]}
              text={humanFormat(data.CLOSED.value)}
              x={128}
              y={128 - 30}
            />
            <Text
              size={40}
              color={colors[data.GAP.colorType]}
              text={humanFormat(data.GAP.value)}
              x={128}
              y={128 + 30}
            />
            <Text size={20} color="#333" text={_l`Gap`} x={128} y={128 + 68} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Sales target: ${humanFormat(data.TARGET.value)}`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <Container fullRadius={128}>
            <Progress
              percentage={calculatePercentage(data.GROSS_PIPE.percent, 100)}
              color={colors[data.GROSS_PIPE.colorType]}
              strokeWidth={16}
            />
            <Progress
              percentage={calculatePercentage(data.NET_PIPELINE.percent, 100)}
              color={colors[data.NET_PIPELINE.colorType]}
              padding={18}
              strokeWidth={16}
            />
            <Text size={20} color="#333" text={_l`Gross`} x={128} y={128 - 68} />
            <Text
              size={40}
              color={colors[data.GROSS_PIPE.colorType]}
              text={humanFormat(data.GROSS_PIPE.value)}
              x={128}
              y={128 - 30}
            />
            <Text
              size={40}
              color={colors[data.NET_PIPELINE.colorType]}
              text={humanFormat(data.NET_PIPELINE.value)}
              x={128}
              y={128 + 30}
            />
            <Text size={20} color="#333" text={_l`Net`} x={128} y={128 + 68} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Missing pipe: ${humanFormat(data.MISSING_PIPE.value)}`}</strong>
          </div>
        </div>

        <div className={css.column}>
          <Container fullRadius={128}>
            <Progress
              percentage={calculatePercentage(data.DEAL_SIZE.percent, 100)}
              color={colors[data.MEDIAN_DEAL_SIZE.smallCircleColor]}
              strokeWidth={16}
            />
            <Progress
              percentage={calculatePercentage(data.MEDIAN_DEAL_SIZE.doneValue, data.MEDIAN_DEAL_SIZE.targetValue)}
              color={colors[data.MEDIAN_DEAL_SIZE.bigCircleColor]}
              padding={18}
              strokeWidth={16}
            />
            <Text size={20} color="#333" text={_l`Me`} x={128} y={128 - 68} />
            <Text
              size={40}
              color={colors[data.MEDIAN_DEAL_SIZE.smallCircleColor]}
              text={humanFormat(data.DEAL_SIZE.value)}
              x={128}
              y={128 - 30}
            />
            <Text
              size={40}
              color={colors[data.MEDIAN_DEAL_SIZE.bigCircleColor]}
              text={humanFormat(data.COMPANY_DEAL_SIZE.value)}
              x={128}
              y={128 + 30}
            />
            <Text size={20} color="#333" text={_l`Company`} x={128} y={128 + 68} />
          </Container>
          <div className={css.legend}>
            <strong>{_l`Your best: ${humanFormat(data.MEDIAN_DEAL_SIZE.targetValue)}`}</strong>
          </div>
        </div>
        {forecast.colorType && (
          <div className={css.column}>
            <Container fullRadius={128}>
              <Progress
                percentage={calculatePercentage(data.DEAL_SIZE.percent, 100)}
                color={colors[forecast.colorType]}
                strokeWidth={16}
              />
              <Text size={20} color="#333" text={_l`Profit forecast`} x={128} y={128 - 68} />
              <Text
                size={40}
                color={colors[forecast.colorType]}
                text={humanFormat(forecast.value)}
                x={128}
                y={128 - 30}
              />
              <Text
                size={40}
                color={colors[forecast.colorType]}
                text={humanFormat(data ? data["CLOSED"].value: 0)}
                x={128}
                y={128 + 30}
              />
              <Text size={20} color="#333" text={_l`Profit`} x={128} y={128 + 68} />
            </Container>
            <div className={css.legend}>
              <strong>{_l`Profit target: ${humanFormat(forecast.targetValue)}`}</strong>
            </div>
          </div>
        )}
      </div>
    </InsightPane>
  );
};

export default SalesPane;

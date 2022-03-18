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
    'Quote sent': 'Quote sent',
  },
});

const QuoteSentPane = ({ data }: PropsT) => {

  const headerRight = () => {
    if (data.remainToMaximum == 0 && data.doneValue) {
      return <div className={css.greatJob}>
        <div className={css.greatJobButton}>
          {_l`Great Job`}
        </div>
        <div className={css.greatJobButton}>
          No 1
        </div>
      </div>
    }

    if (data.remainToMaximum > 0) {
      return <div className={css.greatJob}>
        <div className={css.greatJobButton}>
          {data.remainToMaximum} <span>{_l`to go`}</span>
        </div>
      </div>
    }
  }
  const getColor = (data) => {
    const { doneValue, needValue, targetValue } = data;

    if (doneValue == 0 && (needValue == 0 && targetValue == 0)) {
      return 'BLUE';
    }
    if (doneValue == 0 && (needValue > 0 || targetValue > 0)) {
      return 'RED';
    }
    if (doneValue > 0 && (needValue == 0 || targetValue == 0)) {
      return 'GREEN'
    }
  }
  const fadeCup = () => {
    if (data.remainToMaximum === 0 && data.doneValue) {
      return false;
    }
    return true;
  }
  let circleBigColor = getColor(data);

  return (
    <InsightPane headerRight={headerRight()} padded title={_l`Quote sent`}>
      <div className={css.progress}>
        <Container fullRadius={128}>
          <Progress
            percentage={calculatePercentage(data.doneValue, data.needValue)}
            color={colors[circleBigColor]}
            strokeWidth={16}
          />
          <Progress
            percentage={calculatePercentage(data.doneValue, data.targetValue)}
            color={colors[data.smallCircleColor]}
            padding={18}
            strokeWidth={16}
          />
          <Text size={40} color="#777" text={_l`${data.doneValue}`} x={128} y={128 - 30} />
          <Text size={20} color="#333" text={_l`Required ${data.needValue}`} x={128} y={128 + 18} />
          <Text size={20} color="#333" text={_l`Target ${data.targetValue}`} x={128} y={128 + 38} />
        </Container>
        <AwardImage fade={fadeCup() ? true : false} />
      </div>
    </InsightPane>
  );
};

export default QuoteSentPane;


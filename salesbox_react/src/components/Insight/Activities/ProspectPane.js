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
    Calls: 'Calls',
    'Needed {0}': 'Needed {0}',
    'Target {0}': 'Target {0}',
  },
});

const getColor = (data) => {
  const { doneValue, needValue, targetValue } = data;
  // if (doneValue === 0) {
  //     return 'GREY'
  // }
  // if (needValue === 0 && doneValue > 0) {
  //     return 'GREEN'
  // }

  // const percent = doneValue / needValue;
  // if (percent < 0.1) {
  //     return 'RED'
  // } else if (percent > 0.1 && percent < 0.2) {
  //     return 'YELLOW'
  // } else {
  //     return 'GREEN'
  // }

  if (doneValue === 0 && (needValue === 0 || targetValue === 0)) {
    return 'GREY';
  }
  if (doneValue === 0 && (needValue > 0 || targetValue > 0)) {
    return 'RED';
  }
  if (doneValue > 0 && (needValue === 0 || targetValue === 0)) {
    return 'GREEN';
  }
};

const ProspectPane = ({ data }: PropsT) => {
  console.log('getColor(data): ', getColor(data));

  const headerRight = () => {
    if (data.remainToMaximum == 0 && data.doneValue) {
      return (
        <div className={css.greatJob}>
          <div className={css.greatJobButton}>{_l`Great Job`}</div>
          <div className={css.greatJobButton}>No 1</div>
        </div>
      );
    }

    if (data.remainToMaximum > 0) {
      return (
        <div className={css.greatJob}>
          <div className={css.greatJobButton}>
            {data.remainToMaximum} <span>{_l`to go`}</span>
          </div>
        </div>
      );
    }
  };
  const fadeCup = () => {
    if (data.remainToMaximum === 0 && data.doneValue) {
      return false;
    }
    return true;
  };
  return (
    <InsightPane headerRight={headerRight()} padded title={_l`Prospects added`}>
      <div className={css.progress}>
        <Container fullRadius={128}>
          <Progress
            percentage={calculatePercentage(data.doneValue, data.needValue)}
            color={colors[getColor(data)]}
            strokeWidth={16}
          />
          <Progress
            percentage={calculatePercentage(data.targetValue, 100)}
            color={colors[data.smallCircleColor]}
            padding={18}
            strokeWidth={16}
          />
          <Text size={40} color="#777" text={_l`${data.doneValue}`} x={128} y={128 - 30} />
          <Text size={20} color="#333" text={_l`Needed ${data.needValue}`} x={128} y={128 + 18} />
          <Text size={20} color="#333" text={_l`Converted ${data.targetValue}`} x={128} y={128 + 38} />
        </Container>
        <AwardImage fade={fadeCup() ? true : false} />
      </div>
    </InsightPane>
  );
};

export default ProspectPane;

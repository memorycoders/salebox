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
  },
});




const AppointmentsPane = ({ data, title }: PropsT) => {
  console.log('appointment-data: ', data)
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
  const circleBigPercent = title === _l`Meetings booked` ? calculatePercentage(data.bookValue, data.needValue) : calculatePercentage(data.doneValue, data.needValue);

  // const circleBigColor = title === _l`Deals added` ? getColor(data) : data.bigCircleColor;
  let circleBigColor = getColor(data);
  return (
    <InsightPane headerRight={headerRight()} padded title={title}>
      <div className={css.progress}>
        <Container fullRadius={128}>
          <Progress
            percentage={circleBigPercent}
            color={colors[circleBigColor]}
            strokeWidth={16}
          />
          {
            title === _l`Deals added` ? <Progress
              percentage={calculatePercentage(data.targetValue, 100)}
              color={colors[data.smallCircleColor]}
              padding={18}
              strokeWidth={16}
            /> : <Progress
                percentage={calculatePercentage(title === _l`Meetings booked` ? data.bookValue : data.doneValue, data.targetValue)}
                color={colors[data.smallCircleColor]}
                padding={18}
                strokeWidth={16}
              />
          }

          <Text size={40} color="#777" text={title === _l`Meetings booked` ? _l`${data.bookValue}` : _l`${data.doneValue}`} x={128} y={128 - 30} />
          <Text size={20} color="#333" text={_l`Needed ${data.needValue}`} x={128} y={128 + 18} />
          <Text size={20} color="#333" text={title === _l`Deals added` ? _l`Win ratio ${data.targetValue}` : _l`Target ${data.targetValue}`} x={128} y={128 + 38} />
        </Container>
        <AwardImage fade={fadeCup() ? true : false} />
      </div>
    </InsightPane>
  );
};

export default AppointmentsPane;

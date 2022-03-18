//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import InsightPane from '../InsightPane/InsightPane';
import css from '../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Activity Performance': 'Activity Performance',
    Dials: 'Dials',
    Calls: 'Calls',
  },
});

const animals = {
  BEAR: '/bear.png',
  CHEETAH: '/cheetah.png',
  WOLF: '/wolf.png',
};

const medals = {
  BRONZE: '/bronze-medal.png',
  SILVER: '/silver-medal.png',
  GOLD: '/gold-medal.png',
};

const ActivityPerformancePane = ({ data }: PropsT) => {
  return (
    <InsightPane padded title={_l`Activity Performance`}>
      <div className={css.listItem}>
        <div className={css.animal}>
          <img src={animals[data.DIAL.animalType]} />
        </div>
        <div className={css.content}>
          <strong>{_l`Dials`}</strong>
          <div>{_l`${data.DIAL.value}`}</div>
        </div>
        <div className={css.count}>
          <strong>{_l`${data.DIAL.value}`}</strong>
          {data.DIAL.medalType !== 'NONE' && (
            <div>
              <img src={medals[data.DIAL.medalType]} />
            </div>
          )}
        </div>
      </div>
      <div className={css.listItem}>
        <div className={css.animal}>
          <img src={animals[data.CALL.animalType]} />
        </div>
        <div className={css.content}>
          <strong>{_l`Calls`}</strong>
          <div>{_l`${data.CALL.value}`}</div>
        </div>
        <div className={css.count}>
          <strong>{_l`${data.CALL.value}`}</strong>
          {data.CALL.medalType !== 'NONE' && (
            <div>
              <img src={medals[data.CALL.medalType]} />
            </div>
          )}
        </div>
      </div>
      <div className={css.listItem}>
        <div className={css.animal}>
          <img src={animals[data.APPOINTMENT.animalType]} />
        </div>
        <div className={css.content}>
          <strong>{_l`Meetings`}</strong>
          <div>{_l`${data.APPOINTMENT.value}`}</div>
        </div>
        <div className={css.count}>
          <strong>{_l`${data.APPOINTMENT.value}`}</strong>
          {data.APPOINTMENT.medalType !== 'NONE' && (
            <div>
              <img src={medals[data.APPOINTMENT.medalType]} />
            </div>
          )}
        </div>
      </div>
    </InsightPane>
  );
};

export default ActivityPerformancePane;

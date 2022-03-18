//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { VictoryBar, VictoryChart } from 'victory';
import InsightPane from '../InsightPane/InsightPane';
import css from '../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Campaigns: 'Campaigns',
    'Target {0}': 'Target {0}',
  },
});

const sampleData = [{ Active: 1, y: 2 }, { Done: 2, y: 3 }, { New: 3, y: 5 }];

const CampaignsPane = ({ data }: PropsT) => {
  return (
    <InsightPane padded title={_l`Campaigns`}>
      <div className={css.chart}>
        <VictoryChart>
          <VictoryBar data={sampleData} labels={(d) => `y: ${d.y}`} />
        </VictoryChart>
      </div>
    </InsightPane>
  );
};

export default CampaignsPane;

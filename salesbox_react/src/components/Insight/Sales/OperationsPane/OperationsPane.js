//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { VictoryPie } from 'victory';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Operations: 'Operations',
    Unknown: 'Unknown',
    'Top countries': 'Top countries',
    'Top regions': 'Top regions',
    'Top cities': 'Top cities',
    'Top industries': 'Top industries',
  },
});

const colorScale = ['tomato', 'orange', 'gold', 'cyan', 'navy'];

const OperationsPane = ({ data }: PropsT) => {
  if (!data.TOP_COUNTRY) {
    return <InsightPane padded title={_l`Operations`}></InsightPane>;
  }
  return (
    <InsightPane padded title={_l`Operations`}>
      <div className={css.operations}>
        <div className={css.column}>
          <div className={css.chart}>
            <VictoryPie animate colorScale={colorScale} data={data.TOP_COUNTRY} />
          </div>
          <div className={css.legend}>
            <strong>{_l`Top countries`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <div className={css.chart}>
            <VictoryPie animate colorScale={colorScale} data={data.TOP_REGION} />
          </div>
          <div className={css.legend}>
            <strong>{_l`Top regions`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <div className={css.chart}>
            <VictoryPie animate colorScale={colorScale} data={data.TOP_CITY} />
          </div>
          <div className={css.legend}>
            <strong>{_l`Top cities`}</strong>
          </div>
        </div>
        <div className={css.column}>
          <div className={css.chart}>
            <VictoryPie animate colorScale={colorScale} data={data.TOP_INDUSTRY} />
          </div>
          <div className={css.legend}>
            <strong>{_l`Top industries`}</strong>
          </div>
        </div>
      </div>
    </InsightPane>
  );
};

export default OperationsPane;

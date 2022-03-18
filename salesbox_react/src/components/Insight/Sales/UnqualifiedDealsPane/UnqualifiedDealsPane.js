//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Grid, Progress, Header, Placeholder, Segment } from 'semantic-ui-react';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Unqualified': 'Unqualified',
    converted: 'converted',
    Active: 'Active',
    New: 'New',
    Done: 'Done',
  },
});

const UnqualifiedDealsPane = ({ data }: PropsT) => {
  if (!data.lead) return <InsightPane title={_l`Prospects`} padded>

  </InsightPane>;

  const total = Math.max(Math.max(data.lead.numberActive, data.lead.numberDone), data.lead.numberNew);
  return (
    <InsightPane padded title={_l`Prospects`}>
      <Grid>
        <Grid.Column width={4}>
          <Header as="h2">{_l`${data.lead.convertedPercentage / 100}:p`}</Header>
          {_l`converted`}
        </Grid.Column>
        <Grid.Column width={12}>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Active`}</span>
            </div>
            <Progress
              color={`insight-progress-bar`}
              size="small"
              value={data.lead.numberActive}
              total={total}
              progress="value"
              className={`insightColor`}
            />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`New`}</span>
            </div>
            <Progress
              color={`insight-progress-bar`}
              size="small"
              value={data.lead.numberNew}
              total={total}
              progress="value"
            />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Done`}</span>
            </div>
            <Progress
              color={`insight-progress-bar`}
              size="small"
              value={data.lead.numberDone}
              total={total}
              progress="value"
            />
          </div>
        </Grid.Column>
      </Grid>
    </InsightPane>
  );
};

export default UnqualifiedDealsPane;

//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Grid, Progress, Header } from 'semantic-ui-react';
import humanFormat from 'human-format';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Gross: 'Gross',
    Qualified: 'Qualified',
    Weighted: 'Weighted',
    Won: 'Won',
    Lost: 'Lost',
    Active: 'Active',
    New: 'New',
    Done: 'Done',
  },
});

const QualifiedDealsPane = ({ data }: PropsT) => {
  if (!data.prospect)
    return (
      <InsightPane padded title={_l`Deals`}>
        {/* <List divided className={css.records}></List> */}
      </InsightPane>
    );
  const total = Math.max(Math.max(data.prospect.numberActive, data.prospect.numberDone), data.prospect.numberNew);
  const wonTotal = Math.max(data.prospect.numberWon, data.prospect.numberLost);
  return (
    <InsightPane padded title={_l`Deals`}>
      <Grid>
        <Grid.Column width={2}>
          <Header style={{ fontSize: 18 }} as="h2">{_l`${humanFormat(data.prospect.grossValue)}:n`}</Header>
          {_l`Gross`}
          <Header style={{ fontSize: 18 }} as="h2">{_l`${humanFormat(data.prospect.netValue)}:n`}</Header>
          {_l`Net`}
        </Grid.Column>
        <Grid.Column width={6}>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Active`}</span>
            </div>
            <Progress color={`insight-progress-bar`}
              size="small" value={data.prospect.numberActive} total={total} progress="value" />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`New`}</span>
            </div>
            <Progress color={`insight-progress-bar`}
              size="small" value={data.prospect.numberNew} total={total} progress="value" />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Done`}</span>
            </div>
            <Progress color={`insight-progress-bar`}
              size="small" value={data.prospect.numberDone} total={total} progress="value" />
          </div>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header style={{ fontSize: 18 }} as="h2">
            {humanFormat(data.prospect.wonValue)}
          </Header>
          {_l`Won`}
          <Header style={{ fontSize: 18 }} as="h2">
            {humanFormat(data.prospect.lostValue)}
          </Header>
          {_l`Lost`}
        </Grid.Column>
        <Grid.Column width={6}>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Active`}</span>
            </div>
            <Progress color={`insight-progress-bar`}
              size="small" value={data.prospect.numberWon} total={wonTotal} progress="value" />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`New`}</span>
            </div>
            <Progress color={`insight-progress-bar`}
              size="small" value={data.prospect.numberLost} total={wonTotal} progress="value" />
          </div>
        </Grid.Column>
      </Grid>
    </InsightPane>
  );
};

export default QualifiedDealsPane;

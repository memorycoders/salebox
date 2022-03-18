//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Grid, Progress, Header } from 'semantic-ui-react';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Unqualified': 'Unqualified',
    'Qualified': 'Qualified',
    Campaigns: 'Campaigns',
    Active: 'Active',
    New: 'New',
    Done: 'Done',
  },
});

const CampaignPane = ({ data }: PropsT) => {
  if (!data.campaign) return <InsightPane padded title={_l`Campaigns`}></InsightPane>;
  const total = Math.max(Math.max(data.campaign.numberActive, data.campaign.numberDone), data.campaign.numberNew);
  return (
    <InsightPane padded title={_l`Campaigns`}>
      <Grid>
        <Grid.Column width={6}>
          <Header as="h2">{_l`${data.campaign.numberLead}:n`}</Header>
          {_l`Prospect`}
          <Header as="h2">{_l`${data.campaign.numberProspect}:n`}</Header>
          {_l`Deal`}
        </Grid.Column>
        <Grid.Column width={10}>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`Active`}</span>
            </div>
            <Progress
              color={`insight-progress-bar`}
              size="small"
              value={data.campaign.numberActive}
              total={total}
              progress="value"
            />
          </div>
          <div className={css.workload}>
            <div className={css.label}>
              <span>{_l`New`}</span>
            </div>
            <Progress
              color={`insight-progress-bar`}
              size="small"
              value={data.campaign.numberNew}
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
              value={data.campaign.numberDone}
              total={total}
              progress="value"
            />
          </div>
        </Grid.Column>
      </Grid>
    </InsightPane>
  );
};

export default CampaignPane;

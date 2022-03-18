//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { List } from 'semantic-ui-react';
import humanFormat from 'human-format';
import InsightPane from '../../InsightPane/InsightPane';
import css from '../../Insight.css';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    Records: 'Records',
    '{0} days': '{0} days',
    'Biggest deal': 'Biggest deal',
    'Fastest deal': 'Fastest deal',
    'Most profitable deal': 'Most profitable deal',
  },
});

const medals = {
  BRONZE: '/bronze-medal.png',
  SILVER: '/silver-medal.png',
  GOLD: '/gold-medal.png',
};

const RecordsPane = ({ data }: PropsT) => {
  console.log('datadatadatadatadatadatadata: ', data)
  if (!data || !data.BIGGEST) {
    return <InsightPane padded title={_l`Records`}>
      <List divided className={css.records}></List>
    </InsightPane>;
  }
  return (
    <InsightPane padded title={_l`Records`}>
      <List divided className={css.records}>
        {data.MOST_PROFITABLE && (
          <List.Item>
            <List.Content floated="left">
              <List.Header>{_l`Most profitable deal`}</List.Header>
              <List.Description>
                {_l`${new Date(data.MOST_PROFITABLE.wonDate)}:t(D)`}
                <br />
                {data.MOST_PROFITABLE.organisationName}
              </List.Description>
            </List.Content>
            <List.Content floated="right" className={css.rightAlign}>
              <strong>{_l`${data.MOST_PROFITABLE.value / 100}:p`}</strong>
              {data.MOST_PROFITABLE.medalType !== 'NONE' && (
                <div>
                  <img src={medals[data.MOST_PROFITABLE.medalType]} />
                </div>
              )}
              {data.MOST_PROFITABLE.contactName}
            </List.Content>
          </List.Item>
        )}
        {data.BIGGEST && (
          <List.Item>
            <List.Content floated="left">
              <List.Header>{_l`Biggest deal`}</List.Header>
              <List.Description>
                {_l`${new Date(data.BIGGEST.wonDate)}:t(D)`}
                <br />
                {data.BIGGEST.organisationName}
              </List.Description>
            </List.Content>
            <List.Content floated="right" className={css.rightAlign}>
              <strong>{humanFormat(data.BIGGEST.value)}</strong>
              {data.BIGGEST.medalType !== 'NONE' && (
                <div>
                  <img src={medals[data.BIGGEST.medalType]} />
                </div>
              )}
              {data.BIGGEST.contactName}
            </List.Content>
          </List.Item>
        )}
        {data.FASTEST && (
          <List.Item>
            <List.Content floated="left">
              <List.Header>{_l`Fastest deal`}</List.Header>
              <List.Description>
                {_l`${new Date(data.FASTEST.wonDate)}:t(D)`}
                <br />
                {data.FASTEST.organisationName}
              </List.Description>
            </List.Content>
            <List.Content floated="right" className={css.rightAlign}>
              <strong>{_l`${data.FASTEST.value}:n days`}</strong>
              {data.FASTEST.medalType !== 'NONE' && (
                <div>
                  <img src={medals[data.FASTEST.medalType]} />
                </div>
              )}
              {data.FASTEST.contactName}
            </List.Content>
          </List.Item>
        )}
      </List>
    </InsightPane>
  );
};

export default RecordsPane;

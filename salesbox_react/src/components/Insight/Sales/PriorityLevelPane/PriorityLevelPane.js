//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Container, Header } from 'semantic-ui-react';
import humanFormat from 'human-format';
import InsightPane from '../../InsightPane/InsightPane';

type PropsT = {
  data: {},
};

addTranslations({
  'en-US': {
    'Priority level': 'Priority level',
  },
});

const PriorityLevelPane = ({ data }: PropsT) => {
  if (!data.PRIORITY_LEVEL) return <InsightPane padded title={_l`Priority level`}></InsightPane>;
  return (
    <InsightPane padded title={_l`Priority level`}>
      <Container textAlign="center">
        <Header as="h2">{humanFormat(data.PRIORITY_LEVEL.value)}</Header>
      </Container>
    </InsightPane>
  );
};

export default PriorityLevelPane;

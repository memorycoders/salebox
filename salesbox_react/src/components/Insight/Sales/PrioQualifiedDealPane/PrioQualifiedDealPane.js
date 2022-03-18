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
  },
});

const PrioQualifiedDealPane = ({ data }: PropsT) => {
  if (!data.PRIORITIZED) return <InsightPane padded title={_l`Prioritizied deals`}></InsightPane>;
  return (
    <InsightPane padded title={_l`Prioritizied deals`}>
      <Container textAlign="center">
        <Header as="h2">{humanFormat(data.PRIORITIZED.value)}</Header>
      </Container>
    </InsightPane>
  );
};

export default PrioQualifiedDealPane;

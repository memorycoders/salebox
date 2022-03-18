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

const MissingQualifiedDealPane = ({ data }: PropsT) => {
  if (!data.MISSING) return null;
  return (
    <InsightPane padded title={_l`Prioritizied deals`}>
      <Container textAlign="center">
        <Header as="h2">{humanFormat(data.MISSING.value)}</Header>
      </Container>
    </InsightPane>
  );
};

export default MissingQualifiedDealPane;

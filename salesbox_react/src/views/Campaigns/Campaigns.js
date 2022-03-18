// @flow
import * as React from 'react';
import { Segment, Header, Dimmer, Loader } from 'semantic-ui-react';
import PeriodSelector from 'components/PeriodSelector/PeriodSelector';
import common from 'style/Common.css';
import _l from 'lib/i18n';
import { CssNames } from 'Constants';

type PropsT = {};

addTranslations({
  'en-US': {
    Campaigns: 'Campaigns',
  },
});

class Campaigns extends React.Component<PropsT> {
  render() {
    return (
      <div className={common.container}>
        <PeriodSelector color={CssNames.Campaign} />
        <Segment>
          <Header as="h2">{_l`Campaigns`}</Header>
        </Segment>
        <Segment>
          <Dimmer active inverted>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
        </Segment>
      </div>
    );
  }
}

export default Campaigns;

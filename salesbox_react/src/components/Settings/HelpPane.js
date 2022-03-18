//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { FormPair } from 'components';
import { Icon, Checkbox, Segment, Menu } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as AppActions from 'components/App/app.actions';

type PropsT = {
  displayHelp: string,
  handleHelpModeChange: (event, { checked: boolean }) => void,
};

addTranslations({
  'en-US': {
    'Help Mode': 'Help Mode',
    'Display help': 'Display help',
  },
});

const HelpPane = ({ handleHelpModeChange, displayHelp }: PropsT) => {
  return (
    <Segment.Group>
      <Menu icon attached="top" borderless>
        <Menu.Item icon>
          <Icon name="world" />
        </Menu.Item>
        <Menu.Item header>{_l`Help Mode`}</Menu.Item>
      </Menu>
      <Segment attached="bottom">
        <FormPair label={_l`Display help`}>
          <Checkbox toggle checked={displayHelp} onChange={handleHelpModeChange} />
        </FormPair>
      </Segment>
    </Segment.Group>
  );
};

export default compose(
  connect(
    (state) => ({
      displayHelp: state.ui.app.helpMode === 'ON',
    }),
    {
      setHelpModeRequest: AppActions.setHelpModeRequest,
    }
  ),
  withHandlers({
    handleHelpModeChange: ({ setHelpModeRequest }) => (event, { checked: displayHelp }) => {
      setHelpModeRequest(displayHelp ? 'ON' : 'OFF');
    },
  })
)(HelpPane);

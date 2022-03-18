//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { Icon, Segment, Menu } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withGetData } from 'lib/hocHelpers';
import * as SetingsActions from 'components/Settings/settings.actions';
import DisplaySettingsRow from './DisplaySettingsRow';
import AutomaticReminder from '../AutomaticReminder';

addTranslations({});

type PropsType = {
  hasSettings: boolean,
};

const DisplaySettingsPane = ({ hasSettings, newIndustry }: PropsType) => {
  return (
    <div>
      <Menu icon attached="top" borderless style={{ border: 'none', borderBottom: '1px solid rgb(212, 212, 213)' }}>
        <Menu.Item icon>
          <Icon name="settings" color="grey" />
        </Menu.Item>
        <Menu.Item header>{_l`Display settings`}</Menu.Item>
      </Menu>
      {hasSettings && (
        <Segment attached="bottom" style={{ border: 'none' }}>
          <DisplaySettingsRow
            haveCheckbox={false}
            name="startScreen"
            title={_l`Landing page`}
            style={{ marginBottom: '8px' }}
          />
          <DisplaySettingsRow name="tasks" title={_l`Calendar`} />
          <DisplaySettingsRow name="callLists" title={_l`Call lists`} />
          <DisplaySettingsRow name="delegation" title={_l`Unassigned`} />
          <DisplaySettingsRow name="pipeline" title={_l`Pipeline`} />
          <DisplaySettingsRow name="accounts" title={_l`Companies`} />
          <DisplaySettingsRow name="contacts" title={_l`Contacts`} />
          <DisplaySettingsRow name="insights" title={_l`Insights`} />
          {newIndustry && (newIndustry === 'IT_CONSULTANCY') && (
            <DisplaySettingsRow name="resources" title={_l`Resources`} />
          )}
          {newIndustry && (newIndustry === 'IT_CONSULTANCY') && (
            <DisplaySettingsRow name="recruitment" title={_l`Recruitment`} />
          )}
          <DisplaySettingsRow haveCheckbox={false} name="notificationSettings" title={_l`Notification`} />
          {/* <AutomaticReminder/> */}
        </Segment>
      )}
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      hasSettings: state.settings.display && state.settings.display.mySettings,
      newIndustry: state.auth?.company?.newIndustry,
    }),
    {
      requestFetchDisplaySettings: SetingsActions.requestFetchDisplaySettings,
    }
  ),
  withGetData(({ requestFetchDisplaySettings }) => () => requestFetchDisplaySettings())
)(DisplaySettingsPane);

// @flow
import * as React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { Dropdown, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as SettingsActions from '../settings.actions';
import { makeGetDisplaySetting } from 'components/Settings/settings.selectors';
import css from '../Settings.css';
import _l from 'lib/i18n';

const mockSetting = {
  startScreen: {
    viewList: [
      {
        name: 'Calendar',
        value: 'Tasks',
      },
      {
        name: 'Call lists',
        value: 'Call lists',
      },
      {
        name: 'Unassigned',
        value: 'Delegation',
      },
      {
        name: 'Pipeline',
        value: 'Pipeline',
      },
      {
        name: 'Companies',
        value: 'Accounts',
      },
      {
        name: 'Contacts',
        value: 'Contacts',
      },
      {
        name: 'Insights',
        value: 'Insights',
      },
      // {
      //   name: 'Resources',
      //   value: 'Resources',
      // },
      // {
      //   name: 'Recruitments',
      //   value: 'Recruitments',
      // },
    ],
  },
  tasks: {
    viewList: [
      {
        name: 'Reminders',
        value: 'Tasks',
      },
      {
        name: 'Meetings',
        value: 'Appointments',
      },
      {
        name: 'Calendar',
        value: 'Calendar',
      },
    ],
  },
  callLists: {
    viewList: [
      {
        name: 'Company lists',
        value: 'Account',
      },
      {
        name: 'Contact lists',
        value: 'Contact',
      },
    ],
  },
  delegation: {
    viewList: [
      {
        name: 'Reminders',
        value: 'Tasks',
      },
      {
        name: 'Prospects',
        value: 'Unqualified deals',
      },
    ],
  },
  pipeline: {
    viewList: [
      {
        name: 'Prospects',
        value: 'Unqualified deals',
      },
      {
        name: 'Deals',
        value: 'Qualified deals',
      },
      {
        name: 'Orders',
        value: 'Orders',
      },
    ],
  },
  accounts: {
    viewList: [],
  },
  contacts: {
    viewList: [],
  },
  insights: {
    viewList: [
      {
        name: 'Activities',
        value: 'Activities',
      },
      {
        name: 'Sales',
        value: 'Sales',
      },
      {
        name: 'Top 5 lists',
        value: 'Top Lists',
      },
      { name: 'Custom', value: 'Dashboard' },
      { name: 'Excel reports', value: 'Reports' },
    ],
  },
  resources: {
    viewList: [],
  },
  recruitment: {
    viewList: [
      { name: 'Active', value: 'CandidateActive' },
      { name: 'Closed', value: 'CandidateClosed' },
    ],
  },
  notificationSettings: {
    viewList: [
      {
        name: 'Real-time',
        value: 'Real-time',
      },
      {
        name: 'At login',
        value: 'At login',
      },
    ],
  },
};
type PropsT = {
  setting: {
    defaultView: string,
    value: string,
    display: boolean,
  },
  title: string,
  toggleDisplay: () => void,
  handleDefaultViewChange: (event, { value: string }) => void,
  options: Array<{ text: string, value: string }>,
};

const getOptions = (viewList) => {
  if (!viewList) return [];
  return viewList.map((view) => ({
    value: view.value,
    text: _l.call(this, [view.name]),
    key: view.value
  }));
};

const DisplaySettingsRow = ({
  handleDefaultViewChange,
  toggleDisplay,
  title,
  options,
  setting: { defaultView, display },
  haveCheckbox = true,
  name,
  newIndustry,
}: PropsT) => {
  let optionDropdpwn = options;
  if (name === 'startScreen' && (newIndustry === 'IT_CONSULTANCY')) {
    optionDropdpwn = [
      ...options,
      {
        text: _l`Resources`,
        value: 'Resources',
        key: 'Resources',
      },
      {
        text: _l`Recruitments`,
        value: 'Recruitments',
        key: 'Recruitments',
      },
    ];
  }
  return (
    <div className={css.row}>
      <div className={css.iconButton}>
        {/* <Button size='tiny' icon="check" color={display ? 'green' : undefined} basic={!display} onClick={toggleDisplay} /> */}
        {haveCheckbox ? (
          <>
            {display ? (
              <div className={css.setDone} onClick={toggleDisplay}>
                <div />
              </div>
            ) : (
              <div className={css.notSetasDone} onClick={toggleDisplay}>
                <div />
              </div>
            )}
          </>
        ) : (
          <div style={{ width: '25px' }}></div>
        )}
      </div>
      <div className={css.title}>{title}</div>
      {options.length > 0 && (
        <div className={css.type}>
          <Dropdown
            width={6}
            value={defaultView}
            selection
            options={optionDropdpwn}
            fluid
            onChange={handleDefaultViewChange}
          />
        </div>
      )}
    </div>
  );
};

const makeMapStateToProps = () => {
  const getDisplaySetting = makeGetDisplaySetting();
  return (state, { name }) => ({
    profileId: state.auth.userId,
    setting: getDisplaySetting(state, name),
    newIndustry: state.auth?.company?.newIndustry,
  });
};

const mapDispatchToProps = {
  updateDisplaySetting: SettingsActions.updateDisplaySetting,
  requestUpdateDisplaySetting: SettingsActions.requestUpdateDisplaySetting,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withProps(({ setting, name, newIndustry }) => ({
    // options: getOptions(setting.viewList),
    options: getOptions(mockSetting[name].viewList),
  })),
  withHandlers({
    toggleDisplay: ({ updateDisplaySetting, name, setting, requestUpdateDisplaySetting }) => () => {
      updateDisplaySetting(name, { display: !setting.display });
      requestUpdateDisplaySetting();
    },
    handleDefaultViewChange: ({ updateDisplaySetting, name, requestUpdateDisplaySetting }) => (
      event,
      { value: defaultView }
    ) => {
      updateDisplaySetting(name, {
        defaultView,
      });
      requestUpdateDisplaySetting();
    },
  })
)(DisplaySettingsRow);

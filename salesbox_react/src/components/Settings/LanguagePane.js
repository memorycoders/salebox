//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { FormPair } from 'components';
import { Icon, Dropdown, Segment, Menu } from 'semantic-ui-react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { getLanguageOptions } from 'lib/common';
import * as AppActions from 'components/App/app.actions';
import css from './Settings.css';
import { updateRememberLanguage } from './settings.actions';
type PropsT = {
  language: string,
  handleLocaleChange: (event, { value: string }) => void,
};

addTranslations({
  'en-US': {},
});

const LanguagePane = ({ language, handleLocaleChange }: PropsT) => {
  return (
    <div style={{ margin: '14px 0' }}>
      <Menu icon attached="top" borderless style={{ border: 'none', borderBottom: '1px solid rgb(212, 212, 213)' }}>
        <Menu.Item icon>
          <Icon name="world" color="grey" />
        </Menu.Item>
        <Menu.Item header>{_l`Language Settings`}</Menu.Item>
      </Menu>
      <Segment attached="bottom" style={{ border: 'none' }}>
        <FormPair mini label={_l`Language`} labelStyle={css.inputLabelPassword} left>
          <Dropdown
            id="languageDropdown"
            type="text"
            value={language}
            placeholder={_l`Select language`}
            fluid
            search
            selection
            onChange={handleLocaleChange}
            options={getLanguageOptions()}
          />
        </FormPair>
      </Segment>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      language: state.ui.app.locale,
    }),
    {
      setLocaleRequest: AppActions.setLocaleRequest,
      updateRememberLanguage,
    }
  ),
  withHandlers({
    handleLocaleChange: ({ setLocaleRequest, language, updateRememberLanguage }) => (event, { value: locale }) => {
      if (locale !== language) {
        setLocaleRequest(locale);
        updateRememberLanguage(locale);
      }
    },
  })
)(LanguagePane);

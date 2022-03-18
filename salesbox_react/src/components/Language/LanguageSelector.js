//@flow
import * as React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { getLanguageSelection } from 'lib/common';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    'Select country': 'Select country',
  },
});

const LanguageSelector = (props) => {
  const { languages, input, ...other } = props;

  return (
    <Form.Field>
      <label>{props.label}</label>
      <Dropdown
        value={props.input.value}
        lazyLoad
        
        className='icon dd-language'
        labeled
        placeholder={_l`Select language`}
        selection {...input}
        options={languages}
        onChange={(param, languages) => input.onChange(languages.value)}
        {...other}
      />
    </Form.Field>
  )
};

export default compose(
  connect((state) => ({
    languages: getLanguageSelection(state),
  })),

  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(LanguageSelector);

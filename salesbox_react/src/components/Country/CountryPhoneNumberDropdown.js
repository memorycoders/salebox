//@flow
import * as React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { getCountryOptions } from 'lib/common';
import { compose, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import css from './CountryDropdown.css';
import { ComponentLoader } from 'react-imported-component';

addTranslations({
  'en-US': {
    'Select language': 'Select language',
  },
});

const countries = [
  { value: 'England', flag: 'gb', text: _l`English`, dial: '44' },
  { value: 'Spain', flag: 'es', text: `Español`, dial: '34' },
  // { value: 'Portugal', flag: 'pt', text: `Português`, dial: '351' },
  { value: 'Germany', flag: 'de', text: `Deutsch`, dial: '49' },
  { value: 'Sweden', flag: 'se', text: `Svenska`, dial: '46' },
];
const preload_contries = [
  { value: 'England', flag: 'gb', text: _l`English`, dial: '44' },
  { value: 'Spain', flag: 'es', text: `Español`, dial: '34' },
  // { value: 'Portugal', flag: 'pt', text: `Português`, dial: '351' },
  { value: 'Germany', flag: 'de', text: `Deutsch`, dial: '49' },
  { value: 'Sweden', flag: 'se', text: `Svenska`, dial: '46' },
];
export {countries};

const CountryPhoneNumberDropdown = (props) => {
  const { input, ...other } = props;

  // Default value is English
  console.log('input ',input.value)
  return (
    <Form.Field>
      <label>{props.label}</label>
      <div className={css.preload}>
      <Dropdown
        defaultOpen
        labeled
        selection
        options={preload_contries}
      />
      </div>
      <Dropdown
        value={props.input.value}
        lazyLoad
        className={css.countryPhoneDropdown}
        labeled
        placeholder={_l`Select language`}
        selection
        {...input}
        options={countries}
        onChange={(param, countries) => input.onChange(countries.value)}
        {...other}
      />
    </Form.Field>
  );
};

export default compose(
  connect((state) => ({
    countries: getCountryOptions(state),
  })),

  // lifecycle({
  //   componentDidMount() {
  //     const { countries, input } = this.props;
  //     input.onChange(countries[0].value);
  //   },
  // }),

  // eslint-disable-next-line no-unused-vars
  mapProps(({ dispatch, ...other }) => ({
    ...other,
  }))
)(CountryPhoneNumberDropdown);

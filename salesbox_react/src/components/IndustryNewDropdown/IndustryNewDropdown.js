//@flow
import * as React from 'react';
import { Form, Dropdown, Icon, Popup, Input } from 'semantic-ui-react';
import { getCountryOptions } from 'lib/common';
import { compose, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import css from '../Country/CountryDropdown.css';

const tooltip = {
  fontSize: '14px',
};
const countries = [
  { value: 'England', flag: 'gb', text: _l`English`, dial: '44' },
  { value: 'Spain', flag: 'es', text: `Español`, dial: '34' },
  { value: 'Portugal', flag: 'pt', text: `Português`, dial: '351' },
  { value: 'Germany', flag: 'de', text: `Deutsch`, dial: '49' },
  { value: 'Sweden', flag: 'se', text: `Svenska`, dial: '46' },
];
const preload_contries = [
  { value: 'England', flag: 'gb', text: _l`English`, dial: '44' },
  { value: 'Spain', flag: 'es', text: `Español`, dial: '34' },
  { value: 'Portugal', flag: 'pt', text: `Português`, dial: '351' },
  { value: 'Germany', flag: 'de', text: `Deutsch`, dial: '49' },
  { value: 'Sweden', flag: 'se', text: `Svenska`, dial: '46' },
];
const CountryPhoneNumberDropdown = (props) => {
  const { input, meta, ...other } = props;
  const { error, touched } = meta;
  const hasError = touched && !!error;
  const industries = [
    { value: 'OTHER', text: _l`Other`, key: 'OTHER' },
    { value: 'IT_CONSULTANCY', text: _l`Consultants`, key: 'IT_CONSULTANCY' },
    { value: 'FINANCE_INVEST', text: _l`Finance invest`, key: 'FINANCE_INVEST' },
    { value: 'INSURANCE', text: _l`Insurance`, key: 'INSURANCE' },
    { value: 'LEGAL', text: _l`Legal`, key: 'LEGAL' },
    { value: 'HOME_BUSINESS_ELECTRONICS', text: _l`Home business electronics`, key: 'HOME_BUSINESS_ELECTRONICS' },
    { value: 'CAR_DEALER', text: _l`Car dealer`, key: 'CAR_DEALER' },
    { value: 'SAAS', text: _l`Saas`, key: 'SAAS' }
    // { value: 'OTHER_CONSULTING', text: _l`Other consulting` },
  ];

  // Default value is English

  return (
    <Form.Field error={hasError}>
      <label>{props.label}</label>
      <div className={css.preload}>
        <Dropdown defaultOpen labeled selection options={industries} />
      </div>
      <div className={css.industryDropdown}>
        {/* <div> */}
        <Dropdown
          search
          value={props.input.value}
          lazyLoad
          className={css.countryDropdown}
          labeled
          placeholder={_l`Select industry`}
          selection
          {...input}
          options={industries}
          onChange={(param, countries) => input.onChange(countries.value)}
          {...other}
        />
        <div className={css.faqIcon}>
          <Popup
            hoverable
            style={tooltip}
            trigger={<Icon name="question" color="grey" size="" />}
            content={_l`Select a template to get industry specific processes, classifications, dropdown values, products, and other relevant industry specific configurations. Please select a relevant template when signing up since it is not possible to select a template after signing up. If you prefer a standard configuration, please select the option None.`}
          />
        </div>
      </div>
      {hasError && <div className={css.error}>{error}</div>}
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

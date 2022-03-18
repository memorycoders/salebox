/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { getListCountryOptions } from 'lib/common';
import { addPhone } from '../../contact.actions';
import PhoneRow from './PhoneRow';
import css from './PhonePane.css';
import './styles.less';

addTranslations({
  'en-US': {
    Default: 'Default',
    'Add phone': 'Add phone',
  },
});
class PhonePane extends React.PureComponent {
  handleAdd = () => {
    const { country } = this.props.form;
    let dial = null;
    if (country) {
      const currentCountry = this.props.countries.find((c) => c.value === country.replace(/\s/g,''));
      dial = currentCountry!=null ? currentCountry.dial : null;
    }
    this.props.addPhone(this.props.formKey, dial);
  };

  render() {
    return (
      <div className="email-pane-wrapper">
        {this.props.phones.map((phone) => {
          return <PhoneRow key={phone.uuid} formKey={this.props.formKey} phone={phone} />;
        })}
        <Form className="email-row delete">
          <Form.Group className="account-fields">
            <div className="account-field-label" />
            <div className="email-field-type" onClick={this.handleAdd}>
              <span className={css.addBtn}>+ {_l`Add phone`}</span>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default connect(
  (state, { formKey }) => ({
    countries: getListCountryOptions(state),
    form: state.entities.contact[formKey] || {},
  }),
  { addPhone }
)(PhonePane);

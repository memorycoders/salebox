/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { addEmail } from '../../contact.actions';
import EmailRow from './EmailRow';
import './styles.less';
import css from '../PhonePane/PhonePane.css';
addTranslations({
  'en-US': {
    Default: 'Default',
  },
});

class EmailPane extends React.PureComponent {
  render() {
    return (
      <div className="email-pane-wrapper">
        {this.props.emails.map((email) => {
          return <EmailRow email={email} key={email.uuid} formKey={this.props.formKey} />;
        })}
        <Form className="email-row delete">
          <Form.Group className="account-fields">
            <div className="account-field-label" />
            <div className="email-field-type" onClick={() => this.props.addEmail(this.props.formKey)}>
              <span className={css.addBtn}>+ {_l`Add email`}</span>
            </div>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default connect(null, { addEmail })(EmailPane);

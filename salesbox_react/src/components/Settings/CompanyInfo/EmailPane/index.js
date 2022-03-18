/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { GridColumn, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import EmailRow from './EmailRow';
import './styles.less';
import css from '../../../Contact/CreateContactForm/PhonePane/PhonePane.css';
import { addEmail } from '../../settings.actions';

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
        {/* <Grid style={{ marginTop: 0 }}>
          <GridColumn width={4}></GridColumn>
          <GridColumn width={12}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.addEmail(this.props.formKey)}
            >
              <span className={css.addBtn}>+ {_l`Add email`}</span>
            </div>
          </GridColumn>
        </Grid> */}
      </div>
    );
  }
}
export default connect(null, { addEmail })(EmailPane);

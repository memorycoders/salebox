import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Grid, GridRow, GridColumn, Checkbox, Button } from 'semantic-ui-react';
import css from './StartWithFortnox.css';
import cx from 'classnames';
import { withRouter } from 'react-router';
import { setIsLoginFromStartPageFortnox } from '../../components/Common/common.actions';
import api from 'lib/apiClient';
import _l from 'lib/i18n';
import { Link } from 'react-router-dom';
import { requestLogout } from '../../components/Auth/auth.actions';
import TermOfUseModal from '../../components/SignUpForm/TermOfUseModal';
export class StartWithFortnox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
      checked: false,
      errorCheckbox: false,
      showTermOfUse: false,
    };
  }

  componentDidMount() {
    this.props.requestLogout(false);
  }
  gotoLogin = () => {
    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    this.props.setIsLoginFromStartPageFortnox(true, queryObj['authorization-code']);
    this.props.history.push(`/sign-in?mode=login&authorization-code=${queryObj['authorization-code']}`);
  };
  handleChangeCheckbox = () => {
    this.setState({
      checked: !this.state.checked,
      errorCheckbox: false,
    });
  };
  handlelClickTestFree = () => {
    if (!this.state.checked) {
      this.setState({
        errorCheckbox: true,
      });
      return;
    }

    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });

    if (queryObj['authorization-code']) {
      window.location.replace(
        `https://production.salesbox.com/enterprise-v3.0/fortNox/redirect?authorization-code=${queryObj['authorization-code']}`
      );
    }
  };
  render() {
    const { year, checked } = this.state;

    return (
      <div className={css.root}>
        <div className={css.container}>
          <Image src="/salesbox-logo-menu.svg" className={css.logo} />

          <div className={css.content}>
            <Grid columns={2}>
              <GridRow>
                <GridColumn className={cx(css.left, css.column)}>
                  <div className={css.contentText}>
                    <h3>
                      {_l`Market’s best CRM for SME!`} <br />
                      {_l`Not a user yet? Test free for 14 days.`}
                    </h3>
                    <p>
                      {_l`Connect Salesbox CRM with Fortnox and get full sync of customers, contacts, invoices and articles in both directions. Salesbox also imports your customers, invoices and relevant items automatically within 48 hours after signing up.`}
                    </p>
                    <strong>{_l`Short about Salesbox`}</strong>
                    <ul>
                      <li>{_l`Get CRM for SEK 29 per month & person`}</li>
                      <li>{_l`Test for free with 2 people`}</li>
                      <li>{_l`No lock-in period`}</li>
                      <li>{_l`Add Fortnox to Salesbox for SEK 19 extra per month`}</li>
                    </ul>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        onChange={this.handleChangeCheckbox}
                        checked={checked}
                        // label={_l`I accepted Salesbox's terms`}
                      />
                      <p style={{ marginBottom: 0 }}>{_l`I accept`}</p>
                      <p style={{ whiteSpace: 'break-spaces' }}> </p>
                      <p style={{ cursor: 'pointer' }} onClick={() => this.setState({ showTermOfUse: true })}>
                        {_l`Salesbox's terms`}
                      </p>
                    </div>

                    {this.state.errorCheckbox && (
                      <p className={css.errorMessage}>{_l`Please accept the Salesbox's terms first`}</p>
                    )}
                  </div>
                  <Button
                    onClick={this.handlelClickTestFree}
                    className={cx(css.loginBtn, css.btnTestFree)}
                  >{_l`Test free`}</Button>
                </GridColumn>
                <GridColumn className={cx(css.right, css.column)}>
                  <div className={css.contentText}>
                    <h3>
                      {_l`Already a Salesbox user?`} <br />
                      {_l`Connect the systems now.`}
                    </h3>
                    <p>{_l`Are you already a Salesbox user and want to connect Salesbox with Fortnox? Login to Salesbox with an existing Salesbox admin account and get full sync of customers, contacts, invoices and articles in both directions.`}</p>
                    <p>{_l`Salesbox imports your existing customers, invoices and relevant articles automatically within 48 hours.`}</p>
                    <p>
                      <strong>{_l`Note!`} </strong>
                      {_l`If you are an existing user of Salesbox you need to add the add-on Fortnox in Salesbox billing before you login to be able to activate the connection.`}
                    </p>
                  </div>

                  <Button className={css.loginBtn} onClick={this.gotoLogin}>{_l`Login`}</Button>
                </GridColumn>
              </GridRow>
            </Grid>
          </div>
          <div className={css.footer}>Copyright &copy; {year} Salesbox &reg; </div>
        </div>
        <TermOfUseModal
          isOpened={this.state.showTermOfUse}
          isSignupPage={false}
          onCloseTermOfUse={() => this.setState({ showTermOfUse: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setIsLoginFromStartPageFortnox,
  requestLogout,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StartWithFortnox));

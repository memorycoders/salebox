import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Segment, Menu, Button, Icon, Input } from 'semantic-ui-react';
import { FormPair } from 'components';
import _l from 'lib/i18n';
import css from './Settings.css';
import { requestChangePassword } from './settings.actions';

export class ChangePasswordPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
      confirmPass: '',
      errorOldPass: false,
      errorNewPass: false,
      errorCfPass: false,
      contentErrorCfPass: '',
    };
  }

  handleChangeOldPass = (e) => {
    this.setState({ errorOldPass: false, oldPass: e.target.value });
  };
  handleChangeNewPass = (e) => {
    this.setState({ errorNewPass: false, errorCfPass: false, newPass: e.target.value, confirmPass: '' });
  };
  handleChangeConfirmPass = (e) => {
    this.setState({ errorCfPass: false, confirmPass: e.target.value });
  };
  requestChangePassword = () => {
    const { requestChangePassword } = this.props;
    if (this.validateInput()) {
      requestChangePassword(this.state.oldPass, this.state.newPass);
    }
  };
  validateInput = () => {
    const { oldPass, newPass, confirmPass } = this.state;
    if (!oldPass) {
      this.setState({ errorOldPass: true });
      return false;
    }
    if (!newPass) {
      this.setState({ errorNewPass: true });
      return false;
    }
    if (!confirmPass) {
      this.setState({ errorCfPass: true, contentErrorCfPass: 'Confirm new password is required' });
      return false;
    }
    if (newPass !== confirmPass) {
      this.setState({ errorCfPass: true, contentErrorCfPass: 'Password does not match' });
      return false;
    }
    return true;
  };
  render() {
    const { oldPass, newPass, confirmPass, errorOldPass, errorNewPass, errorCfPass, contentErrorCfPass } = this.state;
    return (
      <div>
        <Menu icon attached="top" borderless style={{ border: 'none', borderBottom: '1px solid rgb(212, 212, 213)' }}>
          <Menu.Item icon>
            <Icon name="lock" color="grey" />
          </Menu.Item>
          <Menu.Item header>{_l`Change password`}</Menu.Item>
        </Menu>
        <Segment attached="bottom" style={{ border: 'none' }}>
          <FormPair mini label={_l`Old password`} labelStyle={css.inputLabelPassword} left>
            <Input id="hiddeUsernameFormPassword" type="username" />
            <Input
              hidden
              error={errorOldPass}
              type="password"
              className={css.inputForm}
              fluid
              value={oldPass || ''}
              onChange={this.handleChangeOldPass}
            />
            {errorOldPass && <p style={{ color: '#ed684e' }}>{_l`Old password is required`}</p>}
          </FormPair>
          <FormPair mini label={_l`New password`} labelStyle={css.inputLabelPassword} left style={{ margin: '8px 0' }}>
            <Input
              error={errorNewPass}
              type="password"
              className={css.inputForm}
              fluid
              value={newPass || ''}
              onChange={this.handleChangeNewPass}
            />
            {errorNewPass && <p style={{ color: '#ed684e' }}>{_l`New password is required`}</p>}
          </FormPair>
          <FormPair mini label={_l`Confirm new password`} labelStyle={css.inputLabelPassword} left>
            <Input
              error={errorCfPass}
              type="password"
              className={css.inputForm}
              fluid
              value={confirmPass || ''}
              onChange={this.handleChangeConfirmPass}
            />
            {errorCfPass && <p style={{ color: '#ed684e' }}>{_l.call(this, [contentErrorCfPass])}</p>}
          </FormPair>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button className={css.btnDone} onClick={this.requestChangePassword}>{_l`Done`}</Button>
          </div>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  requestChangePassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPane);

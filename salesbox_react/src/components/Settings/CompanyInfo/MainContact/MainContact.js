import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import css from '../CompanyInfo.css';
import _l from 'lib/i18n';
import { getUsersForDropdown } from '../../../User/user.selector';
import * as SettingActions from '../../settings.actions';

export const MainContact = (props) => {
  const { users, mainContact, updateCompanyInfo, requestUpdateMainContact } = props;

  const handleChangeMainContact = (e, { value }) => {
    requestUpdateMainContact({ userId: value });
  };
  return (
    <div style={{ paddingLeft: '10px' }}>
      <h5 style={{ marginTop: '10px' }}>{_l`Main contact`}</h5>
      <Dropdown fluid search selection options={users} value={mainContact} onChange={handleChangeMainContact} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: getUsersForDropdown(state),
  mainContact: state.settings.companyInfo ? state.settings.companyInfo.mainContactId : null,
});

const mapDispatchToProps = {
  updateCompanyInfo: SettingActions.updateCompanyInfo,
  requestUpdateMainContact: SettingActions.requestUpdateMainContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContact);

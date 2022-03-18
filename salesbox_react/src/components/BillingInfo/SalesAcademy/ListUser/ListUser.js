import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getActiveUsers } from '../../../User/user.selector';
import ItemListUser from './ItemListUser';
import css from './ListUser.css';
import { Message } from 'semantic-ui-react';
import _l from 'lib/i18n';

export const ListUser = (props) => {
  const { listUser, toggleActive } = props;
  return (
    <div className={css.containerListUser}>
      {listUser.map((e, index) => {
        return <ItemListUser data={e} key={index} toggleActive={toggleActive} />;
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: getActiveUsers(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListUser);

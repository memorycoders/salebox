import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import css from './ListUser.css';
import { makeGetUser } from '../../../User/user.selector';

export const ItemListUser = (props) => {
  const { data, toggleActive, user } = props;

  const handleCheckbox = () => {
    toggleActive(data?.userId);
  };
  return (
    <Grid>
      <GridRow>
        <GridColumn width={12} style={{ paddingLeft: '5px' }}>
          {user?.firstName} {user?.lastName}
        </GridColumn>
        <GridColumn width={4}>
          {data?.marked ? (
            <div className={css.setDone} onClick={handleCheckbox}>
              <div />
            </div>
          ) : (
            <div className={css.notSetasDone} onClick={handleCheckbox}>
              <div />
            </div>
          )}
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

const makeMapStateToProps = () => {
  const getUser = makeGetUser();
  const mapStateToProps = (state, { data }) => ({
    user: getUser(state, data.userId),
  });
  return mapStateToProps;
};

const mapDispatchToProps = {};

export default connect(makeMapStateToProps, mapDispatchToProps)(ItemListUser);

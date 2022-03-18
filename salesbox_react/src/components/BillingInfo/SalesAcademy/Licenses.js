import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from '../Subscriptions/Licenses/licenses.css';

export const Licenses = (props) => {
  const { numberPaidLicense, numberMoreLicense, removeNumberLicense, addNumberLicense } = props;

  return (
    <div className={css.numberLice}>
      <a className={css.remove} onClick={removeNumberLicense}>
        -
      </a>
      <span>{numberPaidLicense + numberMoreLicense}</span>
      <a className={css.add} onClick={addNumberLicense}>
        +
      </a>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Licenses);

// @flow
import * as React from 'react';
import CompanyListItem from './CompanyListItem';
import css from './List.css';

const CompanyList = () => {
  return (
    <div className={css.list}>
      <CompanyListItem />
    </div>
  );
};

export default CompanyList;

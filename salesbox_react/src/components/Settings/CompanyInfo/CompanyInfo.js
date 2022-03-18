import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import css from './CompanyInfo.css';
import CompanyInfoPane from './CompanyInfoPane/CompanyInfoPane';
import MainContact from './MainContact/MainContact';
import Organisation from '../Organisation/Organisation';

export const CompanyInfo = ({}) => {
  return (
    <div className={css.container}>
      <Grid divided columns={2}>
        <Grid.Column className={css.column}>
          <CompanyInfoPane />
          <MainContact />
        </Grid.Column>
        <Grid.Column className={css.column} style={{ minHeight: '1000px' }}>
          <Organisation />
        </Grid.Column>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);

import * as React from 'react';
import CompanyInfoComponent from '../../components/Settings/CompanyInfo/CompanyInfo';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import * as SetingsActions from '../../components/Settings/settings.actions';

const CompanyInfo = () => {
  return <CompanyInfoComponent />;
};

export default compose(
  connect(),
  withGetData(() => () => {})
)(CompanyInfo);

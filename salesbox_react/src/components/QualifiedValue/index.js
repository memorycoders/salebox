/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import { getQualifiedValue } from '../PipeLineQualifiedDeals/qualifiedDeal.selector';
import './qualifiedValue.less';
import { ROUTERS } from '../../Constants';


const checkDetailShow = () => {
  const { pathname } = location;

  const listPath = pathname.split('/');

  if (pathname.includes(`/${ROUTERS.DELEGATION}`)) {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return hasDetail;
  }
  if (pathname.includes(`/${ROUTERS.ACTIVITIES}`)) {
    return listPath.length > 3;
  }

  if (pathname.includes(`/${ROUTERS.CONTACTS}`)) {
    return listPath.length > 2;
  }

  // if (pathname.includes(`/${ROUTERS.PIPELINE}`)) {
  //   const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
  //   return hasDetail
  // }

  if (pathname.includes(`/${ROUTERS.PIPELINE}/orders`)) {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    return hasDetail
  }

  if (pathname.includes(`/${ROUTERS.ACCOUNTS}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.CALL_LIST}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.CAMPAIGNS}`)) {
    return listPath.length > 2;
  }

  if (pathname.includes(`/${ROUTERS.INSIGHTS}`)) {
    return listPath.length > 2;
  }
  return listPath.length > 2;
}


addTranslations({
  'en-US': {
    G: 'G',
    N: 'N',
    Net: 'Net',
    Gross: 'Gross',
  },
});

class QualifiedValue extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  render() {
    const hasDetail = checkDetailShow();
    const { totalGrossValue, totalNetValue } = this.props.qualifiedValue || {};
    // let grossValue = totalGrossValue ? this.numberWithCommas(Math.ceil(totalGrossValue)): 0 ;
    // let netValue = totalNetValue ? this.numberWithCommas(Math.ceil(totalNetValue)): 0 ;
    return (
      <div className="qualified-value-wrapper" style={{ width: this.props.width }}>
        <span className="gross-wrapper">
          {hasDetail ? _l`Gross` :_l`Sales`}: {totalGrossValue ? this.numberWithCommas(Math.ceil(totalGrossValue)): 0}
        </span>
        <span className="weighted-wrapper">
          {hasDetail ? _l`Net` : _l`Profit`}: {totalNetValue ? this.numberWithCommas(Math.ceil(totalNetValue)): 0}
        </span>
      </div>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  return {
    qualifiedValue: getQualifiedValue(state, overviewType),
  };
};

export default connect(mapStateToProps, {})(QualifiedValue);

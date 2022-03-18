/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Icon, Popup } from 'semantic-ui-react';
import { getQualifiedValue } from '../PipeLineQualifiedDeals/qualifiedDeal.selector';
import './styles.less';
import {
  updateSaleMethodActive,
  updateSaleAll,
  changeOrderSale,
} from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { setSelectAll } from '../../components/Overview/overview.actions.js';
class QualifiedSalesProcess extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countProspectBySalesProcessDTOs: [],
      indexOffset: 0,
    };
    this.refSaleProcess = React.createRef();
  }

  componentDidMount() {}

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  changeSaleMethod = (saleMethodId) => {
    this.props.updateSaleMethodActive(saleMethodId);
    this.props.setSelectAll(this.props.overviewType, false);
  };

  renderSaleMethodUsing = () => {
    const { countProspectBySalesProcessDTOs = [] } = this.props.qualifiedValue || {};
    const { salesMethodDTOList = [] } = this.props;
    const salesMethodUsing = salesMethodDTOList
      .filter((value) => {
        const checkInCountProspectBySalesProcessDTOs = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === value.uuid;
        });
        return (value.using && !value.deleted) || checkInCountProspectBySalesProcessDTOs !== -1;
      })
      .map((val, index) => {
        const sortIndex = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === val.uuid;
        });
        return {
          ...val,
          sortIndex: sortIndex !== -1 ? sortIndex : null,
          grossValue: sortIndex !== -1 ? countProspectBySalesProcessDTOs[sortIndex].grossValue : 0,
          isActive: index === 0 ? true : false,
        };
      })
      .sort((value1, value2) => {
        if (value1.sortIndex === value2.sortIndex) {
          return 0;
        } else if (value1.sortIndex === null) {
          return 1;
        } else if (value2.sortIndex === null) {
          return -1;
        } else if (true) {
          return value1.sortIndex < value2.sortIndex ? -1 : 1;
        }
      });
    return salesMethodUsing;
  };

  changeOffsetIndex1 = (type) => {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    const maxShow = hasDetail ? 2 : 2;
    let salesMethodUsingOrder = this.renderSaleMethodUsing();
    const { indexOffset } = this.state;
    if (type === 'PRE' && indexOffset > 0) {
      this.setState({ indexOffset: indexOffset - 1 });
    } else if (type !== 'PRE' && indexOffset < salesMethodUsingOrder.length - maxShow + 2) {
      this.setState({ indexOffset: indexOffset + 1 });
    }
  };

  renderSale = () => {
    const { salesMethodUsing, qualifiedValue, listShow, overviewType, isAll } = this.props;
    const { countProspectBySalesProcessDTOs, totalGrossValue } = qualifiedValue || {};
    let total = 0;
    countProspectBySalesProcessDTOs && countProspectBySalesProcessDTOs.length > 0
      ? countProspectBySalesProcessDTOs.map((p) => {
          total += p.count;
        })
      : [];
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    const lengthAll = this.renderSaleMethodUsing().length;
    const { indexOffset } = this.state;
    let screen_width = window.innerWidth;
    let ShowDetail = 0;
    let ShowNoDetail = 0;
    let detailWidth = '';
    let norWidth = '';
    let limit = 0;
    if (screen_width <= 1190) {
      ShowDetail = 7;
      ShowNoDetail = 7;
      limit = hasDetail ? 14 : 14;
      detailWidth = '10%';
      norWidth = '11%';
    } else if (screen_width <= 1410 && screen_width > 1190) {
      ShowDetail = 6;
      ShowNoDetail = 7;
      limit = hasDetail ? 25 : 25;
      detailWidth = '16%';
      norWidth = '16%';
    } else if (screen_width > 1410 && screen_width < 1500) {
      ShowDetail = 8;
      ShowNoDetail = 8;
      limit = hasDetail ? 30 : 30;
      detailWidth = '13%';
      norWidth = '14%';
    } else {
      ShowDetail = 8;
      ShowNoDetail = 8;
      limit = hasDetail ? 30 : 30;
      detailWidth = '13%';
      norWidth = '14%';
    }
    const maxShow = hasDetail ? ShowDetail : ShowNoDetail; // if change width of div below, fix this const to change limit of div can show
    let salesMethodUsingOrder = salesMethodUsing;
    if (salesMethodUsingOrder && salesMethodUsingOrder.length > maxShow) {
      salesMethodUsingOrder = salesMethodUsingOrder.filter(
        (value, index) => index < maxShow + indexOffset && index >= indexOffset
      );
    }
    const shortenValue = (value, count) => {
      if (value && value.length > limit) {
        return value.slice(0, limit) + '...' + '(' + count + ')';
      }
      if (value && value.length <= limit) return value;
      // return value.slice(0, 30);
    };
    return (
      <div className="qualified-sales-wrapper">
        {lengthAll > maxShow && indexOffset > 0 ? (
          <div onClick={() => this.changeOffsetIndex1('PRE')} className={'circle-button'} style={{ marginRight: 10 }}>
            <Icon style={{ fontSize: 18 }} name="angle left" />
          </div>
        ) : (
          <div
            onClick={() => this.changeOffsetIndex1('PRE')}
            className={'circle-button'}
            style={{ marginRight: 10, display: 'none' }}
          >
            <Icon style={{ fontSize: 18 }} name="angle left" />
          </div>
        )}

        <div className={hasDetail ? "wrapper-srcoll-detail" : "wrapper-srcoll"}>
        {(listShow || overviewType === 'PIPELINE_ORDER') && (
          <div
            style={{ width: hasDetail ? '8%' : '8%' }}
            // className={`sales-process-wrapper ${isAll ? 'active' : ''}`}
            className={`sales-process-wrapper ${isAll ? 'active' : ''} ${lengthAll > maxShow ? 'width-full' : ''}`}
            onClick={() => {
              this.props.updateSaleAll();
              this.props.setSelectAll(this.props.overviewType, false);
            }}
          >
            <div className="process-name">All({total})</div>
            <div className="process-value">
              {totalGrossValue && this.numberWithCommas(Math.ceil(totalGrossValue))} {this.props.currency}
            </div>
          </div>
        )}
          {(salesMethodUsingOrder ? salesMethodUsingOrder : []).map((sale) => {
            const countProspect = (countProspectBySalesProcessDTOs ? countProspectBySalesProcessDTOs : []).find(
              (value) => value.salesProcessId === sale.uuid
            );
            let nameAll = sale.name.toString();
            let lengthName = nameAll.length;
            let setWidth = sale.name.length / 3;
            let newElement = (
              <div
                ref={this.refSaleProcess}
                onClick={() => {
                  this.changeSaleMethod(sale.uuid);
                }}
                // style={{ width: hasDetail ? detailWidth : norWidth }}
                // className={`sales-process-wrapper ${!isAll && sale.isActive ? 'active' : ''}`}
                className={`sales-process-wrapper ${!isAll && sale.isActive ? 'active' : ''} ${
                  lengthAll > maxShow ? 'width-full' : ''
                }`}
                key={sale.uuid}
              >
                {/* {lengthName <= limit ? (
            <div className="process-name">
              {sale.name}({countProspect ? countProspect.count : 0})
            </div>
          ) : (
            <Popup
              hoverable
              trigger={
                <div className="process-name">
                  {`${shortenValue(sale.name, countProspect ? countProspect.count : 0)}`}
                </div>
              }
              style={{ fontSize: 11 }}
              content={sale.name}
            />
          )} */}
                <div className="process-name">
                  {sale.name}({countProspect ? countProspect.count : 0})
                </div>

                <div className="process-value">
                  {this.numberWithCommas(Math.ceil(countProspect ? countProspect.grossValue : 0))} {this.props.currency}
                </div>
              </div>
            );
            return newElement;
          })}
        </div>

        {lengthAll > maxShow && indexOffset < lengthAll - maxShow + 2 && (
          <div className={'circle-button-right'} onClick={() => this.changeOffsetIndex1('NEXT')}>
            <Icon style={{ fontSize: 18 }} name="angle right" />
          </div>
        )}
      </div>
    );
  };

  changeOffsetIndex = (type) => {
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    const maxShow = hasDetail ? 2 : 3;
    let salesMethodUsingOrder = this.renderSaleMethodUsing();
    const { indexOffset } = this.state;
    if (type === 'PRE' && indexOffset > 0) {
      this.setState({ indexOffset: indexOffset - 1 });
    } else if (type !== 'PRE' && indexOffset < salesMethodUsingOrder.length - maxShow + 2) {
      this.setState({ indexOffset: indexOffset + 1 });
    }
  };

  // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.

  renderSaleOrder = () => {
    const { qualifiedValue, listShow, overviewType, isAll, orderSale } = this.props;
    const { countProspectBySalesProcessDTOs, totalGrossValue } = qualifiedValue || {};
    const { indexOffset } = this.state;
    let total = 0;
    countProspectBySalesProcessDTOs && countProspectBySalesProcessDTOs.length > 0
      ? countProspectBySalesProcessDTOs.map((p) => {
          total += p.count;
        })
      : [];
    const hasDetail = (location.pathname.match(/\//g) || []).length > 2;
    const lengthAll = this.renderSaleMethodUsing().length;
    let screen_width = window.innerWidth;
    let ShowDetail = 0;
    let ShowNoDetail = 0;
    let detailWidth = '';
    let norWidth = '';
    let limit = 0;
    if (screen_width <= 1190) {
      ShowDetail = 7;
      ShowNoDetail = 7;
      limit = hasDetail ? 14 : 14;
      detailWidth = '11%';
      norWidth = '11%';
    } else if (screen_width <= 1410 && screen_width > 1190) {
      ShowDetail = 7;
      ShowNoDetail = 7;
      limit = hasDetail ? 14 : 17;
      detailWidth = '11%';
      norWidth = '11%';
    } else if (screen_width > 1410 && screen_width < 1500) {
      ShowDetail = 7;
      ShowNoDetail = 7;
      limit = hasDetail ? 18 : 20;
      detailWidth = '12%';
      norWidth = '12%';
    } else {
      ShowDetail = 7;
      ShowNoDetail = 7;
      limit = hasDetail ? 17 : 21;
      detailWidth = '12%';
      norWidth = '12%';
    }
    const shortenValue = (value, count) => {
      if (value && value.length > limit) {
        return value.slice(0, limit) + '...' + '(' + count + ')';
      }
      if (value && value.length <= limit) return value;
      // return value.slice(0, 30);
    };
    const maxShow = hasDetail ? ShowDetail : ShowNoDetail; // if change width of div below, fix this const to change limit of div can show
    let salesMethodUsingOrder = this.renderSaleMethodUsing();
    if (salesMethodUsingOrder && salesMethodUsingOrder.length > maxShow) {
      salesMethodUsingOrder = salesMethodUsingOrder.filter(
        (value, index) => index < maxShow + indexOffset && index >= indexOffset
      );
    }

    return (
      <div className="qualified-sales-wrapper">
        {lengthAll > maxShow && indexOffset > 0 && (
          <div onClick={() => this.changeOffsetIndex('PRE')} className={'circle-button'} style={{ marginRight: 10 }}>
            <Icon style={{ fontSize: 18 }} name="angle left" />
          </div>
        )}
        <div
          style={{ width: hasDetail ? '8%' : '8%' }}
          className={`sales-process-wrapper ${orderSale.isAll ? 'active' : ''} ${
            lengthAll > maxShow ? 'width-full' : ''
          }`}
          onClick={() => {
            this.props.changeOrderSale(true, null);
            this.props.setSelectAll(this.props.overviewType, false);
          }}
        >
          <div className="process-name">All({total})</div>
          <div className="process-value">
            {totalGrossValue && this.numberWithCommas(Math.ceil(totalGrossValue))} {this.props.currency}
          </div>
        </div>
        <div className="wrapper-srcoll-order">
          {(salesMethodUsingOrder ? salesMethodUsingOrder : []).map((sale) => {
            const countProspect = (countProspectBySalesProcessDTOs ? countProspectBySalesProcessDTOs : []).find(
              (value) => value.salesProcessId === sale.uuid
            );
            let nameAll = sale.name.toString();
            let lengthName = nameAll.length;
            let setWidth = sale.name.length / 3;
            return (
              <div
                // style={{ width: hasDetail ? detailWidth : norWidth }}
                onClick={() => {
                  this.props.changeOrderSale(false, sale.uuid);
                  this.props.setSelectAll(this.props.overviewType, false);
                }}
                className={`sales-process-wrapper ${
                  !orderSale.isAll && orderSale.saleId === sale.uuid ? 'active' : ''
                } ${lengthAll > maxShow ? 'width-full' : ''}`}
                key={sale.uuid}
              >
                {/* {lengthName <= limit ? (
                <div className="process-name">
                  {sale.name}({countProspect ? countProspect.count : 0})
                </div>
              ) : (
                <Popup
                  hoverable
                  trigger={
                    <div className="process-name">
                      {`${shortenValue(sale.name, countProspect ? countProspect.count : 0)}`}
                    </div>
                  }
                  style={{ fontSize: 11 }}
                  content={sale.name}
                />
              )} */}
                <div className="process-name">
                  {sale.name}({countProspect ? countProspect.count : 0})
                </div>
                <div className="process-value">
                  {this.numberWithCommas(Math.ceil(countProspect ? countProspect.grossValue : 0))} {this.props.currency}
                </div>
              </div>
            );
          })}
        </div>

        {lengthAll > maxShow && indexOffset < lengthAll - maxShow + 2 && (
          <div className={'circle-button-right-order'} onClick={() => this.changeOffsetIndex('NEXT')}>
            <Icon style={{ fontSize: 18 }} name="angle right" />
          </div>
        )}
      </div>
    );
  };

  render() {
    const { overviewType } = this.props;
    return (
      <div style={{ width: this.props.width }} className="qualified-sales-container">
        {overviewType === 'PIPELINE_ORDER' && this.renderSaleOrder()}
        {overviewType !== 'PIPELINE_ORDER' && this.renderSale()}
      </div>
    );
  }
}
const mapStateToProps = (state, { overviewType }) => {
  return {
    qualifiedValue: getQualifiedValue(state, overviewType),
    salesMethodUsing: state.entities.qualifiedDeal.__COMMON_DATA
      ? state.entities.qualifiedDeal.__COMMON_DATA.salesMethodUsing
      : [],
    listShow: state.entities.qualifiedDeal.__COMMON_DATA ? state.entities.qualifiedDeal.__COMMON_DATA.listShow : false,
    count: state.overview[overviewType] && state.overview[overviewType].itemCount,
    isAll: state.entities.qualifiedDeal.__COMMON_DATA ? state.entities.qualifiedDeal.__COMMON_DATA.isAll : false,
    currency: state.ui.app.currency,
    salesMethodDTOList: state.entities.qualifiedDeal.__COMMON_DATA
      ? state.entities.qualifiedDeal.__COMMON_DATA.salesMethodDTOList
      : [],
    orderSale: state.entities.qualifiedDeal.__ORDER_SALE ? state.entities.qualifiedDeal.__ORDER_SALE : {},
  };
};

export default connect(mapStateToProps, {
  updateSaleMethodActive,
  updateSaleAll,
  changeOrderSale,
  setSelectAll,
})(QualifiedSalesProcess);

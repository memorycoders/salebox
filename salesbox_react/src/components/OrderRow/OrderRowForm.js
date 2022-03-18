/* eslint-disable react/prop-types */
// @flow
import React, { useEffect } from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { Table, Button, Icon, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment, { isMoment } from 'moment';
import MeasurementTypeDropdown from 'components/MeasurementType/MeasurementTypeDropdown';
import LineOfBusinessDropdown from 'components/LineOfBusiness/LineOfBusinessDropdown';
import ProductDropdown from 'components/Product/ProductDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import { getProduct } from 'components/Product/product.selector';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { getOverview } from 'components/Overview/overview.selectors';
import * as OrderRowActions from './order-row.actions';
import { makeGetOrderRow } from './order-row.selectors';
import css from './OrderRow.css';
import * as OverviewActions from 'components/Overview/overview.actions';
import { calculatingPositionMenuDropdown, Endpoints, REVENUETYPE } from '../../Constants';
import PeriodTypeDropdown from './PeriodTypeDropdown';
import RevenueTypeDropdown from './RevenueTypeDropdown';
import { getLineOfBusinesses } from 'components/LineOfBusiness/line-of-business.selector';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getProducts } from '../Product/product.selector';

type PropsT = {
  orderRow: {},
  disabledColumns: {},
  remove: () => void,
  handleProductChange: () => void,
  handleLOBChange: () => void,
  handleMTChange: () => void,
  handleStartChange: () => void,
  handleEndChange: () => void,
  handleQuantityChange: () => void,
  handleDiscountPercentageChange: () => void,
  handleMarginChange: () => void,
  handleCostChange: () => void,
  handleChangeRevenueType: () => void,
  handleChangePeriodType: () => void,
  handleChangeNumberRevenueType: () => void,
  handleChangeOccupied: () => void,
};

addTranslations({
  'en-US': {
    'Product group': 'Product group',
    Product: 'Product',
    'Product type': 'Product type',
    'Start date': 'Start date',
    'End date': 'End date',
    Units: 'Units',
    'Price/unit': 'Price/unit',
    'Cost/unit': 'Cost/unit',
    'Discount %': 'Discount %',
    'Discounted price': 'Discounted price',
    'Discount amount': 'Discount amount',
    'Margin %': 'Margin %',
    Cost: 'Cost',
    Value: 'Value',
    Profit: 'Profit',
    Description: 'Description',
    Currency: 'Currency',
    Date: 'Date',
    Discount: 'Discount',
  },
});

const OrderRowForm = ({
  disabledColumns,
  rowId,
  remove,
  orderRow,
  handleStartChange,
  handleEndChange,
  handleProductChange,
  handleLOBChange,
  handleMTChange,
  handleQuantityChange,
  handleDiscountPercentageChange,
  handleMarginChange,
  handleCostChange,
  handleChangeOccupied,
  handleUnitPrice,
  handleDescriptionChange,
  handleCostUnitChange,
  handleDiscountedPriceChange,
  handleChangeRevenueType,
  handleChangePeriodType,
  handleChangeNumberRevenueType,
  revenueType,
  error,
  lobs,
  products,
  isAddDealResource,
  currentResourceId,
  resourceReportId,
  resourceAddDealInList,
  newIndustry
}: PropsT) => {
  const startDate = orderRow.deliveryStartDate ? new Date(orderRow.deliveryStartDate) : new Date();
  const endDate = orderRow.deliveryEndDate ? new Date(orderRow.deliveryEndDate) : new Date();
  const numberWithCommas = (x) => {
    return x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const rowClass = cx(css.row);


  useEffect(() => {
    if (isAddDealResource) {
      handleLOBChange(null, { value: currentResourceId });
    }
  }, [currentResourceId]);

  useEffect(() => {
    console.log('COME HIREER');
    if (isAddDealResource) {
      let resourceId = location.pathname.substring('/resources/'.length, location.pathname?.length) ||resourceAddDealInList.uuid;

      if(location.pathname === '/insights/resource') {
        resourceId = resourceReportId;
      }
      handleProductChange(null, {
        value:
          products?.find((i) => i.resourceId === resourceId) &&
          products?.find((i) => i.resourceId === resourceId).value,
      });
      // if(resourceAddDealInList) {
      //   handleProductChange(null,  {
      //     value: resourceAddDealInList?.uuid
      //   })
      // }
    }
  }, [products]);



  return (
    <Table.Row className={rowClass}>
      {!disabledColumns.productGroup && (
        <Table.Cell singleLine id={`${rowId}-LineOfBusinessDropdown`}>
          <LineOfBusinessDropdown
            onClick={() => calculatingPositionMenuDropdown(`${rowId}-LineOfBusinessDropdown`, null, true)}
            className="position-clear"
            value={orderRow.lineOfBusinessId}
            onChange={handleLOBChange}
            className={`${css.noBorder} position-clear`}
            search
          />
        </Table.Cell>
      )}
      {!disabledColumns.product && (
        <Table.Cell singleLine id={`${rowId}-OrderRowProductDropdown`}>
          <ProductDropdown
            orderRow={orderRow}
            isAddDealResource={isAddDealResource}
            handleProductChange={handleProductChange}
            onClick={() => calculatingPositionMenuDropdown(`${rowId}-OrderRowProductDropdown`, null, true)}
            lineOfBusinessId={orderRow?.lineOfBusinessId}
            value={orderRow.product}
            onChange={handleProductChange}
            isMultiple={false}
            className={`${css.noBorder} position-clear`}
            search
          />
        </Table.Cell>
      )}
      {!disabledColumns.productType && (
        <Table.Cell singleLine id={`${rowId}-OrderRowTypeDropdown`}>
          <MeasurementTypeDropdown
            onClick={() => calculatingPositionMenuDropdown(`${rowId}-OrderRowTypeDropdown`, null, true)}
            value={orderRow.measurementTypeId}
            onChange={handleMTChange}
            className={`${css.noBorder} position-clear`}
          />
        </Table.Cell>
      )}
      {!disabledColumns.startDate && revenueType !== REVENUETYPE.FIXED_RECURRING && (
        <Table.Cell>
          <div className={css.DatePicker}>
            <DatePickerInput onChange={handleStartChange} value={startDate} className={css.noBorder} />
          </div>
        </Table.Cell>
      )}
      {!disabledColumns.endDate && revenueType !== REVENUETYPE.FIXED_RECURRING && (
        <Table.Cell>
          <div className={css.DatePicker}>
            <DatePickerInput onChange={handleEndChange} value={endDate} className={css.noBorder} />
          </div>
        </Table.Cell>
      )}
      {revenueType === REVENUETYPE.FIXED_RECURRING && (
        <Table.Cell id={`${rowId}-RevenueTypeDropdown`}>
          <div className={css.DatePicker}>
            <RevenueTypeDropdown
              value={orderRow.type}
              onClick={() => calculatingPositionMenuDropdown(`${rowId}-RevenueTypeDropdown`, null, true)}
              className={`${css.noBorder} position-clear`}
              onChange={handleChangeRevenueType}
            />
          </div>
        </Table.Cell>
      )}
      {revenueType === REVENUETYPE.FIXED_RECURRING && (
        <Table.Cell id={`${rowId}-OrderRowPeriodTypeDropdown`}>
          <div className={css.DatePicker}>
            {orderRow.type === 'FIXED' ? null : (
              <PeriodTypeDropdown
                value={orderRow.periodType}
                onClick={() => calculatingPositionMenuDropdown(`${rowId}-OrderRowPeriodTypeDropdown`, null, true)}
                className={`${css.noBorder} position-clear`}
                onChange={handleChangePeriodType}
              />
            )}
          </div>
        </Table.Cell>
      )}
      {revenueType === REVENUETYPE.FIXED_RECURRING && (
        <Table.Cell>
          <div className={css.DatePicker}>
            {orderRow.type === 'FIXED' ? null : (
              <Input
                fluid
                type="number"
                value={orderRow.periodNumber}
                onChange={handleChangeNumberRevenueType}
                className={css.noBorder}
              />
            )}
          </div>
        </Table.Cell>
      )}
      {!disabledColumns.unitAmount && (
        <Table.Cell singleLine>
          <Input
            fluid
            type="number"
            value={orderRow.quantity}
            onChange={handleQuantityChange}
            className={css.noBorder}
          />
        </Table.Cell>
      )}
      {!disabledColumns.unitPrice && (
        <Table.Cell>
          <Input
            fluid
            value={orderRow.price && orderRow.price}
            onChange={handleUnitPrice}
            className={css.noBorder}
            type="number"
          />
        </Table.Cell>
      )}
      {!disabledColumns.unitCost && (
        <Table.Cell>
          <Input
            fluid
            value={orderRow.costUnit && orderRow.costUnit}
            className={css.noBorder}
            type="number"
            onChange={handleCostUnitChange}
          />
        </Table.Cell>
      )}
      {!disabledColumns.discountPercent && (
        <Table.Cell>
          <Input
            fluid
            value={orderRow.discountPercent}
            onChange={handleDiscountPercentageChange}
            className={css.noBorder}
          />
        </Table.Cell>
      )}
      {!disabledColumns.discountedPrice && (
        <Table.Cell>
          <Input
            fluid
            value={orderRow.discountedPrice}
            onChange={handleDiscountedPriceChange}
            type="number"
            className={css.noBorder}
          />
        </Table.Cell>
      )}
      {!disabledColumns.discountAmount && (
        <Table.Cell>
          <Input fluid value={orderRow.discountAmount} className={css.noBorder} />
        </Table.Cell>
      )}
      {!disabledColumns.margin && (
        <Table.Cell>
          <Input fluid type="number" value={orderRow.margin} onChange={handleMarginChange} className={css.noBorder} />
        </Table.Cell>
      )}
      {!disabledColumns.cost && (
        <Table.Cell>
          <Input
            fluid
            type="number"
            value={orderRow.cost && orderRow.cost}
            className={css.noBorder}
            onChange={handleCostChange}
          />
        </Table.Cell>
      )}
      {!disabledColumns.value && (
        <Table.Cell singleLine>
          <Input fluid value={orderRow.value && numberWithCommas(orderRow.value)} className={css.noBorder} />
        </Table.Cell>
      )}
      {!disabledColumns.occupied && newIndustry == 'IT_CONSULTANCY' && (
        <Table.Cell singleLine>
          <Input
            fluid
            type="number"
            value={orderRow.occupied && numberWithCommas(orderRow.occupied)}
            className={css.noBorder}
            onChange={handleChangeOccupied}
          />
        </Table.Cell>
      )}
      {!disabledColumns.profit && (
        <Table.Cell>
          <Input fluid value={orderRow.profit && numberWithCommas(orderRow.profit)} className={css.noBorder} />
        </Table.Cell>
      )}
      {!disabledColumns.description && (
        <Table.Cell>
          <Input
            fluid
            value={orderRow.description}
            className={cx(css.noBorder, css.description)}
            onChange={handleDescriptionChange}
          />
        </Table.Cell>
      )}
      {/* {!disabledColumns.currency && (
        <Table.Cell>
          <Input fluid value={null} className={css.noBorder} />
        </Table.Cell>
      )} */}
      <Table.Cell className={css.action}>
        <Button icon compact onClick={() => remove(orderRow)} className={css.deleteButton}>
          <Icon name="trash alternate" color="grey" />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

const makeMapStateToProps = () => {
  const getOrderRow = makeGetOrderRow();
  // const overviewType = OverviewTypes.OrderRow;
  const mapStateToProps = (state, { rowId, overviewType }) => {
    const orderRow = getOrderRow(state, rowId);
    // const overview = getOverview(state, overviewType || OverviewTypes.OrderRow);
    const overview = getOverview(state, OverviewTypes.CommonOrderRow);
    // console.log('orderRow',orderRow)
    const lobs = getLineOfBusinesses(state);
    const products = getProducts(state);

    return {
      orderRow,
      disabledColumns: overview.disabledColumns || {},
      product: orderRow.product ? getProduct(state, orderRow.product) : null,
      lobs,
      products,
      isAddDealResource: state.entities?.resources?.isAddDealResource,
      resourceReportId: state.entities?.resources?.resourceReportId,
      currentResourceId: state.common.currentResourceId,
      resourceAddDealInList: state.entities?.resources?.resourceAddDealInList,
      newIndustry: state.auth?.company?.newIndustry,

    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  remove: OrderRowActions.remove,
  update: OrderRowActions.update,
  setActionForHighlight: OverviewActions.highlight,
  requestFetchDropdown: DropdownActions.requestFetch,
};

const createUpdateHandler = (key) => ({ update, rowId, revenueType, orderRow }) => (event, { value }) => {
  update(rowId, { [key]: value }, key);
}

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      const { requestFetchDropdown } = this.props;
      requestFetchDropdown(ObjectTypes.LineOfBusiness);
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.product !== prevProps.product &&
        this.props.product &&
        (prevProps.orderRow == null || prevProps.orderRow.product != this.props.product.uuid)
      ) {
        const { measurementTypeId, quantity, price, costUnit, margin, description } = this.props.product;
        this.props.update(this.props.rowId, {
          measurementTypeId,
          quantity,
          price,
          costUnit,
          margin,
          description: description ? description : null,
          productDTO: this.props.product,
        });
      }
    },
  }),
  withHandlers({
    remove: ({ remove, rowId, setActionForHighlight }) => (orderRow) => {
      if (!orderRow.uuid) remove(rowId);
      if (orderRow.uuid) {
        setActionForHighlight(OverviewTypes.OrderRow, orderRow.uuid, 'deleteOrder');
      }
    },
    handleProductChange: createUpdateHandler('product'),
    handleLOBChange: createUpdateHandler('lineOfBusinessId'),
    handleMTChange: createUpdateHandler('measurementTypeId'),
    handleQuantityChange: createUpdateHandler('quantity'),
    handleDiscountPercentageChange: createUpdateHandler('discountPercent'),
    handleMarginChange: createUpdateHandler('margin'),
    handleCostChange: createUpdateHandler('cost'),
    handleUnitPrice: createUpdateHandler('price'),
    handleStartChange: ({ update, rowId }) => (deliveryStartDate) =>
    update(rowId, { deliveryStartDate, deliveryEndDate: deliveryStartDate }),
    handleEndChange: ({ update, rowId }) => (deliveryEndDate) => update(rowId, { deliveryEndDate }),
    handleDescriptionChange: createUpdateHandler('description'),
    handleCostUnitChange: createUpdateHandler('costUnit'),
    handleDiscountedPriceChange: createUpdateHandler('discountedPrice'),
    handleChangeRevenueType: createUpdateHandler('type'),
    handleChangePeriodType: createUpdateHandler('periodType'),
    handleChangeNumberRevenueType: createUpdateHandler('periodNumber'),
    handleChangeOccupied: createUpdateHandler('occupied'),
  })
)(OrderRowForm);

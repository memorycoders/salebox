/* eslint-disable react/prop-types */
// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Table, Button, Icon } from 'semantic-ui-react';
import humanFormat from 'human-format';
import { getTotals, makeGetSizes } from 'components/OrderRow/order-row.selectors';
import { OverviewTypes } from 'Constants';
import _l from 'lib/i18n';
import cx from 'classnames';
import { getOverview } from 'components/Overview/overview.selectors';
import OrderRowActionMenu from './OrderRowActionMenu';
import css from './OrderRow.css';
import api from 'lib/apiClient';
import { Endpoints, REVENUETYPE } from '../../Constants';

type PropsT = {
  prop: string,
  totals: {},
};

addTranslations({
  'en-US': {
    Group: 'Group',
    Product: 'Product',
    Type: 'Type',
    Date: 'Date',
    Start: 'Start',
    End: 'End',
    Units: 'Units',
    Price: 'Price',
    Cost: 'Cost',
    Discount: 'Discount',
    '%': '%',
    Amount: 'Amount',
    'Margin %': 'Margin %',
    Value: 'Value',
    Profit: 'Profit',
    Description: 'Description',
    Currency: 'Currency',
    Total: 'Total',
  },
});

const OrderRowOverview = ({
  sizes,
  disabledColumns,
  totals,
  prop,
  children,
  overviewType = OverviewTypes.OrderRow,
  revenueType,
  newIndustry
}: PropsT) => {
  const numberWithCommas = (x) => {
    return x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <Table compact celled className={css.table}>
      <Table.Header>
        <Table.Row className={css.headerTable}>
          {sizes.product > 0 && (
            <Table.HeaderCell colSpan={sizes.product} textAlign="center">{_l`Product`}</Table.HeaderCell>
          )}
          {sizes.date > 0 && revenueType !== REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell
              className={css.striped}
              colSpan={sizes.date}
              textAlign="center"
            >{_l`Date`}</Table.HeaderCell>
          )}
          {revenueType === REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={css.striped} colSpan={3} textAlign="center"></Table.HeaderCell>
          )}
          {sizes.units > 0 && <Table.HeaderCell colSpan={sizes.units} textAlign="center">{_l`Units`}</Table.HeaderCell>}
          {sizes.discount > 0 && (
            <Table.HeaderCell
              className={css.striped}
              colSpan={sizes.discount}
              textAlign="center"
            >{_l`Discount`}</Table.HeaderCell>
          )}
          <Table.HeaderCell colSpan={7} />
        </Table.Row>
        <Table.Row className={css.headerTable}>
          {!disabledColumns.productGroup && <Table.HeaderCell singleLine>{_l`Group`}</Table.HeaderCell>}
          {!disabledColumns.product && <Table.HeaderCell singleLine>{_l`Product`}</Table.HeaderCell>}
          {!disabledColumns.productType && <Table.HeaderCell singleLine>{_l`Type`}</Table.HeaderCell>}
          {!disabledColumns.startDate && revenueType !== REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={cx(css.date, css.striped)} singleLine>{_l`Start`}</Table.HeaderCell>
          )}
          {!disabledColumns.endDate && revenueType !== REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={cx(css.date, css.striped)} singleLine>{_l`End`}</Table.HeaderCell>
          )}
          {revenueType === REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={cx(css.date, css.striped)} singleLine>{_l`Type`}</Table.HeaderCell>
          )}
          {revenueType === REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={cx(css.date, css.striped)} singleLine>{_l`Period`}</Table.HeaderCell>
          )}
          {revenueType === REVENUETYPE.FIXED_RECURRING && (
            <Table.HeaderCell className={cx(css.date, css.striped)} singleLine>{_l`Number`}</Table.HeaderCell>
          )}
          {!disabledColumns.unitAmount && (
            <Table.HeaderCell className={css.cell} singleLine>{_l`Amount`}</Table.HeaderCell>
          )}
          {!disabledColumns.unitPrice && (
            <Table.HeaderCell className={css.cell} singleLine>{_l`Price`}</Table.HeaderCell>
          )}
          {!disabledColumns.unitCost && <Table.HeaderCell className={css.cell} singleLine>{_l`Cost`}</Table.HeaderCell>}
          {!disabledColumns.discountPercent && (
            <Table.HeaderCell className={cx(css.cell, css.striped)} singleLine>{_l`%`}</Table.HeaderCell>
          )}
          {!disabledColumns.discountedPrice && (
            <Table.HeaderCell className={cx(css.cell, css.striped)} singleLine>{_l`Price`}</Table.HeaderCell>
          )}
          {!disabledColumns.discountAmount && (
            <Table.HeaderCell className={cx(css.cell, css.striped)} singleLine>{_l`Amount`}</Table.HeaderCell>
          )}
          {!disabledColumns.margin && (
            <Table.HeaderCell className={css.cell} singleLine>{_l`Margin %`}</Table.HeaderCell>
          )}
          {!disabledColumns.cost && <Table.HeaderCell className={css.cell} singleLine>{_l`Cost`}</Table.HeaderCell>}
          {!disabledColumns.value && <Table.HeaderCell className={css.cell} singleLine>{_l`Value`}</Table.HeaderCell>}
          {!disabledColumns.occupied && newIndustry == 'IT_CONSULTANCY' && <Table.HeaderCell className={css.cell} singleLine>{_l`Occupied`} (%)</Table.HeaderCell>}
          {!disabledColumns.profit && <Table.HeaderCell className={css.cell} singleLine>{_l`Profit`}</Table.HeaderCell>}
          {!disabledColumns.description && (
            <Table.HeaderCell className={css.cell} singleLine>{_l`Description`}</Table.HeaderCell>
          )}
          {/* {!disabledColumns.currency && (
            <Table.HeaderCell className={css.cell} singleLine>{_l`Currency`}</Table.HeaderCell>
          )} */}
          <Table.HeaderCell className={cx(css.action, css.btnAction)}>
            <OrderRowActionMenu overviewType={overviewType} />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{children}</Table.Body>
      <Table.Footer>
        <Table.Row className={css.headerTable}>
          {sizes.product > 0 && (
            <Table.HeaderCell className={css.headerTable} colSpan={sizes.product}>{_l`Total`}</Table.HeaderCell>
          )}
          {sizes.date > 0 && revenueType !== REVENUETYPE.FIXED_RECURRING && <Table.HeaderCell colSpan={sizes.date} className={cx(css.striped, css.headerTable)} />}
          {revenueType === REVENUETYPE.FIXED_RECURRING && <Table.HeaderCell colSpan={3} className={cx(css.striped, css.headerTable)} />}
          {sizes.units > 0 && <Table.HeaderCell className={cx(css.striped, css.headerTable)} colSpan={sizes.units} />}
          {sizes.discount > 1 && <Table.HeaderCell colSpan={sizes.discount - 1} className={css.striped} />}
          {!disabledColumns.discountAmount && (
            <Table.HeaderCell className={cx(css.striped, css.headerTable)} singleLine>
              {totals.discountAmount && numberWithCommas(totals.discountAmount)}
              {/* {humanFormat(totals.discountAmount)} */}
            </Table.HeaderCell>
          )}
          {!disabledColumns.margin && <Table.HeaderCell />}
          {!disabledColumns.cost && (
            <Table.HeaderCell className={css.headerTable} singleLine>
              {/* {humanFormat(totals.cost)} */}
              {/* {humanFormat(totals.cost)} */}
              {totals.cost && numberWithCommas(totals.cost)}
            </Table.HeaderCell>
          )}
          {!disabledColumns.value && (
            <Table.HeaderCell className={css.headerTable}>
              {totals.value && numberWithCommas(totals.value)}
            </Table.HeaderCell>
          )}
          {!disabledColumns.occupied &&  newIndustry == 'IT_CONSULTANCY' && (
            <Table.HeaderCell className={css.headerTable}>
              {/* {totals.value && numberWithCommas(totals.occupied)} */}
            </Table.HeaderCell>
          )}
          {!disabledColumns.profit && (
            <Table.HeaderCell className={css.headerTable} singleLine>
              {/* {humanFormat(totals.profit)} */}
              {totals.profit && numberWithCommas(totals.profit)}
            </Table.HeaderCell>
          )}
          {!disabledColumns.description && <Table.HeaderCell colSpan={3} />}
          {/* {!disabledColumns.currency && <Table.HeaderCell colSpan={3} />} */}
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

const overviewType = OverviewTypes.OrderRow;

export default compose(
  connect((state, { overviewType = OverviewTypes.OrderRow }) => {
    const overviewT = OverviewTypes.CommonOrderRow;

    const getSizes = makeGetSizes(overviewT);
    const overview = getOverview(state, overviewT);
    return {
      disabledColumns: overview.disabledColumns || {},
      sizes: getSizes(state, overviewT),
      totals: getTotals(state),
      newIndustry: state.auth?.company?.newIndustry,
    };
  })
)(OrderRowOverview);

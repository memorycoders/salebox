// @flow
import * as React from 'react';
import { compose, withHandlers, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Popup, Segment, Header, Icon, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import cx from 'classnames';
import { getOverview } from 'components/Overview/overview.selectors';
import * as OverviewActions from 'components/Overview/overview.actions';
import css from './OrderRow.css';
import commonCss from 'Common.css';
import { updateDisplayColumnOrderRow } from '../Settings/settings.actions';

type PropsT = {
  editAppointment: () => void,
  deleteAppointment: () => void,
};

addTranslations({
  'en-US': {
    Columns: 'Columns',
    'Unit price': 'Unit price',
    'Unit amount': 'Unit amount',
    'Discount percentage': 'Discount percentage',
  },
});

const getColumns = () => [
  { key: 'product', value: _l`Product` },
  { key: 'productGroup', value: _l`Product group` },
  { key: 'productType', value: _l`Product type` },
  { key: 'startDate', value: _l`Start date` },
  { key: 'endDate', value: _l`End date` },
  { key: 'unitAmount', value: _l`Unit amount` },
  { key: 'unitPrice', value: _l`Unit price` },
  { key: 'unitCost', value: _l`Unit cost` },
  { key: 'discountPercent', value: _l`Discount percentage` },
  { key: 'discountedPrice', value: _l`Discounted price` },
  { key: 'discountAmount', value: _l`Discount amount` },
  { key: 'margin', value: _l`Margin %` },
  { key: 'cost', value: _l`Cost` },
  { key: 'value', value: _l`Value` },
  { key: 'occupied', value: _l`Occupied` },
  { key: 'profit', value: _l`Profit` },
  { key: 'description', value: _l`Description` },
  // { key: 'currency', value: _l`Currency` },
];

const enhanceColumn = withHandlers({
  handleToggle: ({ name, enabled, onToggle }) => () => {
    onToggle(name, !enabled);
  },
});

const enabledIcon = (
  <div className={css.setDone}>
    <div></div>
  </div>
);
const disabledIcon = (
  <div className={css.notSetasDone}>
    <div></div>
  </div>
);

const headerStyle = {
  margin: 0,
  fontSize: '16px',
  backgroundColor: '#f3f4f4 !important',
};

const headerH3 = {
  fontSize: '16px',
  backgroundColor: '#f3f4f4 !important',
  color: '#808080 !important',
};

const popupStyle = {
  padding: 0,
};

const Column = enhanceColumn(({ enabled, label, handleToggle }) => {
  return (
    <Menu.Item icon onClick={handleToggle} className={css.columnLabel}>
      {label}
      {enabled && enabledIcon}
      {!enabled && disabledIcon}
    </Menu.Item>
  );
});

const OrderRowActionMenu = ({ handleClick, handleColumnToggle, disabledColumns, newIndustry }: PropsT) => {
  const columns = getColumns();
  return (
    <Popup
      onClick={handleClick}
      trigger={
        <div className={css.bgMore} icon="ellipsis vertical">
          <img style={{ height: 12 }} src={require('../../../public/3_dots.svg')} />
        </div>
      }
      flowing
      hoverable
      style={popupStyle}
      position="left center"
      className={cx(commonCss.popup, CssNames.Pipeline)}
      keepInViewPort
      hideOnScroll
    >
      <Menu vertical className={css.popMenu}>
        {/* <Segment inverted style={headerStyle} className={css.segmentHeader}>
          <Header className={css.headerH3} as="h3">{_l`Columns`}</Header>
        </Segment> */}
        {columns.map((column) => {
          if(column?.key == 'occupied' && newIndustry != 'IT_CONSULTANCY') {
            return null;
          }
          return (
            <Column
              enabled={!disabledColumns[column.key]}
              key={column.key}
              name={column.key}
              onToggle={handleColumnToggle}
              label={column.value}
            />
          );
        })}
      </Menu>
    </Popup>
  );
};

export default compose(
  defaultProps({
    overviewType: OverviewTypes.OrderRow,
  }),
  connect(
    (state, { overviewType }) => {
      const overviewT = OverviewTypes.CommonOrderRow;
      // const overview = getOverview(state, overviewType);
      const overview = getOverview(state, overviewT);

      return {
        disabledColumns: overview.disabledColumns || {},
        newIndustry: state.auth?.company?.newIndustry,

      };
    },
    {
      enableColumn: OverviewActions.enableColumn,
      disableColumn: OverviewActions.disableColumn,
      updateDisplayColumnOrderRow,
    }
  ),
  withHandlers({
    handleColumnToggle: ({ overviewType, enableColumn, disableColumn, updateDisplayColumnOrderRow }) => (name, enabled) => {
      const overviewT = OverviewTypes.CommonOrderRow;
      if (enabled) {
        enableColumn(overviewT, name);
      } else {
        disableColumn(overviewT, name);
      }

      updateDisplayColumnOrderRow(name, enabled);
    },
    handleClick: () => (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    },
  })
)(OrderRowActionMenu);

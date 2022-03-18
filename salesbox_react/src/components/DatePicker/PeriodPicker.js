// @flow
import * as React from 'react';
import { Popup, Input, Grid } from 'semantic-ui-react';
import { compose, withState, withProps, withHandlers } from 'recompose';
import _l from 'lib/i18n';
import ControlledDatePicker from './ControlledDatePicker';
import isSameDay from './isSameDay';

type PropsT = {
  startDate: Date,
  endDate: Date,
  monthLeft: Date,
  monthRight: Date,
  prevEnabled: boolean,
  nextEnabled: boolean,
  selectMonthLeft: (Date) => void,
  selectMonthRight: (Date) => void,
  onSelect: (Date) => void,
  active: (Date) => boolean,
  onMouseDown: (event: Event) => void,
  trigger: React.Node,
};

addTranslations({
  'en-US': {
    '{0} - {1}': '{0} - {1}',
  },
});

const PeriodPicker = ({
  startDate,
  endDate,
  onMouseDown,
  onSelect,
  monthLeft,
  monthRight,
  trigger,
  selectMonthLeft,
  selectMonthRight,
  prevEnabled,
  nextEnabled,
  active,
}: PropsT) => {
  return (
    <Popup
      onMouseDown={onMouseDown}
      on="click"
      trigger={trigger || <Input size="small" color="purple" value={_l`${startDate}:t(D) - ${endDate}:t(D)`} />}
      flowing
    >
      <Grid columns={2}>
        <Grid.Column>
          <ControlledDatePicker
            active={active}
            highlightAfter={startDate}
            highlightBefore={endDate}
            value={startDate}
            selectMonth={selectMonthLeft}
            selectedMonth={monthLeft}
            onSelect={onSelect}
            nextEnabled={nextEnabled}
          />
        </Grid.Column>
        <Grid.Column>
          <ControlledDatePicker
            active={active}
            highlightAfter={startDate}
            highlightBefore={endDate}
            selectMonth={selectMonthRight}
            selectedMonth={monthRight}
            value={endDate}
            onSelect={onSelect}
            prevEnabled={prevEnabled}
          />
        </Grid.Column>
      </Grid>
    </Popup>
  );
};

const getMonth = (date, offset = 1) => {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + offset);
  return currentDate;
};

const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export default compose(
  withState('order', 'setOrder', 1),
  withState('monthLeft', 'selectMonthLeft', ({ startDate }) => getStartOfMonth(startDate)),
  withState('monthRight', 'selectMonthRight', ({ endDate }) => getStartOfMonth(endDate)),
  withProps(({ startDate, endDate, monthLeft, monthRight }) => ({
    monthRight: monthRight > monthLeft ? monthRight : getMonth(monthLeft, 1),
    nextEnabled: monthLeft < getMonth(monthRight, -1),
    prevEnabled: monthRight > getMonth(monthLeft, 1),
    active: (date) => {
      return isSameDay(date, startDate) || isSameDay(date, endDate);
    },
  })),
  withHandlers({
    onMouseDown: () => (event) => {
      event.preventDefault();
    },
    selectMonthLeft: ({ selectMonthLeft, monthRight }) => (date) => {
      if (date < monthRight) {
        selectMonthLeft(date);
      } else {
        selectMonthLeft(getMonth(monthRight, -1));
      }
    },
    selectMonthRight: ({ selectMonthRight, monthLeft }) => (date) => {
      if (date > monthLeft) {
        selectMonthRight(date);
      } else {
        selectMonthRight(getMonth(monthLeft, 1));
      }
    },
    onSelect: ({ startDate, endDate, order, setOrder, onChangeEnd, onChangeStart }) => (date) => {
      if (order === 0) {
        if (endDate < date) {
          //onChangeStart(endDate);
          onChangeEnd(date);
        } else {
          onChangeStart(date);
        }
      } else {
        if (date < startDate) {
          //onChangeEnd(startDate);
          onChangeStart(date);
        } else {
          onChangeEnd(date);
        }
      }
      setOrder(1 - order);
    },
  })
)(PeriodPicker);

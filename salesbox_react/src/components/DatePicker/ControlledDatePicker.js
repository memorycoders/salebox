// @flow
import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withHandlers, defaultProps, withProps, compose } from 'recompose';
import css from './DatePicker.css';
import WeekDays from './WeekDays';
import Days from './Days';
import TimePicker from './TimePicker';
import { isMoment } from 'moment';
import _l from 'lib/i18n';

type PropsT = {
  weekdays: Array<string>,
  months: Array<string>,
  value: Date,
  active?: (Date) => boolean,
  timePicker?: boolean,
  month: number,
  year: number,
  prev: () => void,
  next: () => void,
  prevEnabled: true,
  nextEnabled: true,
  prevYear: () => void,
  nextYear: () => void,
  highlightBefore: Date,
  highlightAfter: Date,
  onSelect: (date: Date) => void,
  selectNow: () => void
};

const setupFormats = (locale) => {
  const date = new Date(1970, 2, 1);
  const dayFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short', // ?? what should I put here
  });
  const monthFormat = new Intl.DateTimeFormat(locale, {
    month: 'long', // ?? what should I put here
  });
  const weekdays = [];
  const months = [];
  for (let i = 2; i < 9; i++) {
    date.setDate(i);
    weekdays.push(dayFormat.format(date));
  }
  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    months.push(monthFormat.format(date));
  }
  return {
    weekdays,
    months,
  };
};

const DatePicker = ({
  active,
  months,
  highlightBefore,
  highlightAfter,
  onSelect,
  prev,
  next,
  prevEnabled,
  nextEnabled,
  prevYear,
  nextYear,
  weekdays,
  month,
  year,
  value,
  timePicker,
  isCalendar,
  appointmentsTime,
  selectNow
}: PropsT) => {
  // const newValue = isMoment(value) ? value : new Date();
  const newValue = value ? value : new Date();
  return (
    <div className={css.pickerWrapper}>
      <div>
        <div className={css.controls}>
          {!isCalendar ? (
            <Button.Group>
              <Button disabled={!prevEnabled} compact icon="angle double left" onClick={prevYear} />
              <Button disabled={!prevEnabled} compact icon="angle left" onClick={prev} />
              <Button className={css.btnHome} compact icon="home" onClick={selectNow} />
            </Button.Group>
          ) : (
            <div />
          )}
          <div className={css.header}>
            {month && months[month] !== 0 ? _l.call(this, [months[month]]) : _l`January`} - {year}
          </div>
          {!isCalendar ? (
            <Button.Group>
              <Button disabled={!nextEnabled} compact icon="angle right" onClick={next} />
              <Button disabled={!nextEnabled} compact icon="angle double right" onClick={nextYear} />
            </Button.Group>
          ) : (
            <div />
          )}
        </div>
        <WeekDays weekdays={weekdays} />
        <Days
          isCalendar
          active={active}
          appointmentsTime={appointmentsTime}
          highlightBefore={highlightBefore}
          highlightAfter={highlightAfter}
          value={newValue}
          month={month}
          year={year}
          onSelect={onSelect}
        />
      </div>
      {timePicker && <TimePicker value={newValue} onChange={onSelect} />}
    </div>
  );
};
export default compose(
  defaultProps({
    prevEnabled: true,
    nextEnabled: true,
  }),
  withProps(({ value, selectedMonth }) => {
    // const newValue = value && isMoment(value) ? value : new Date();
    // let date = value && isMoment(value) ? new Date(value) : new Date();
    const newValue = value ? value : new Date();
    let date = value ? new Date(value) : new Date();
    if (selectedMonth) {
      date = new Date(selectedMonth);
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      selectedMonth: new Date(year, month, 1),
      year,
      month,
      ...setupFormats('en-US'),
    };
  }),
  withHandlers({
    onSelect: ({ onSelect }) => (date, count) => {
      if (onSelect) {
        console.log('objectobjectobjectobject', date, count);
        onSelect(date, count);
      }
    },
    prev: ({ selectedMonth, selectMonth }) => (event) => {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      selectMonth(new Date(year, month - 1, 1, 0, 0, 0, 0));
    },
    next: ({ selectedMonth, selectMonth }) => (event) => {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      selectMonth(new Date(year, month + 1, 1, 0, 0, 0, 0));
    },
    prevYear: ({ selectedMonth, selectMonth }) => (event) => {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      selectMonth(new Date(year, month - 12, 1, 0, 0, 0, 0));
    },
    nextYear: ({ selectedMonth, selectMonth }) => (event) => {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      selectMonth(new Date(year, month + 12, 1, 0, 0, 0, 0));
    },
    selectNow: ({onSelect}) => () => {
      let now = new Date();
      onSelect(now);
    }
  })
)(DatePicker);

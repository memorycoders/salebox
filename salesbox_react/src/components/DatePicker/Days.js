// @flow
import * as React from 'react';
import cx from 'classnames';
import { withProps, withHandlers, defaultProps, compose } from 'recompose';
import Day from './Day';
import css from './DatePicker.css';
import moment from 'moment';
import _ from 'lodash';

const emptyDay = cx(css.day, css.empty);

type PropsT = {
  year: number,
  month: number,
  active: (Date) => boolean,
  highlightBefore: Date,
  highlightAfter: Date,
  start: Date,
  end: Date,
  onSelect: (date: Date) => void,
};

const days = [1, 2, 3, 4, 5, 6, 7];
const weeks = [0, 1, 2, 3, 4, 5];

const countAppointmentDay = appointmentsTime => {
  let result = {};
  if (!appointmentsTime){
    return result
  }
  appointmentsTime.forEach(value => {
    const time = moment(value.start).startOf('day').valueOf();
    if (result[time]){
      result[time] = result[time]+1;
    } else {
      result[time] = 1;
    }
  });
  return result;
}

const Days = ({ highlightBefore, highlightAfter, onSelect, active, year, month, start, end, appointmentsTime }: PropsT) => {
  const countAppointmentList = countAppointmentDay(appointmentsTime);
  return (
    <div className={css.month}>
      {weeks.map((week) => {
        return (
          <div className={css.week} key={`${year}-${month}-${week}`}>
            {days.map((weekDay) => {
              const monthDay =  (week * 7 + weekDay) - start;
              const dayDate = new Date(year, month, monthDay, 0, 0, 0, 0);
              if (monthDay > 0 && monthDay <= end) {
                let highlighted = false;
                if (highlightBefore && !highlightAfter) {
                  highlighted = dayDate <= highlightBefore;
                } else if (!highlightBefore && highlightAfter) {
                  highlighted = dayDate >= highlightAfter;
                } else if (highlightBefore && highlightAfter) {
                  highlighted = dayDate <= highlightBefore && dayDate >= highlightAfter;
                }

                let countAppointment = 0;
                if (appointmentsTime){
                  const startDay = moment(dayDate).startOf('day').valueOf();
                  countAppointment = countAppointmentList[startDay] ? countAppointmentList[startDay] : 0;
                }
                return (
                  <Day
                    highlighted={highlighted}
                    key={weekDay}
                    date={dayDate}
                    countAppointment={countAppointment}
                    active={active(dayDate)}
                    monthDay={monthDay}
                    onSelect={onSelect}
                  // onMouseDown={ event => this.selectDate(event, dayDate) }
                  />
                );
              }
              return <div key={weekDay} className={emptyDay} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default compose(
  defaultProps({
    active: () => false,
  }),
  withProps(({ year, month }) => {
    const firstOfMonth = new Date(Date.UTC(year, month, 0));
    const lastOfMonth = new Date(year, month + 1, 0);
    const start = firstOfMonth.getUTCDay();
    const end = lastOfMonth.getUTCDate() + 1;

    return {
      year,
      month,
      start,
      end,
    };
  }),
  withHandlers({
    onSelect: ({ value, onSelect }) => (date, count) => {
      if (onSelect) {
        const newDate = moment(date).toDate();
        const newValue = new Date(value);

        newDate.setHours(newValue.getHours(), newValue.getMinutes());

        onSelect(newDate, count);
      }
    },
  })
)(Days);

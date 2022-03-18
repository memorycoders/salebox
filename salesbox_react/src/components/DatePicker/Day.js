// @flow
import * as React from 'react';
import cx from 'classnames';
import { compose, withHandlers } from 'recompose';
import css from './DatePicker.css';

type PropsT = {
  active: boolean,
  highlighted: boolean,
  monthDay: number,
  onSelect: (event: Event) => void,
};

const Day = ({ active, highlighted, onSelect, monthDay, countAppointment }: PropsT) => {
  const className = cx(css.day, {
    [css.active]: active,
    [css.highlight]: highlighted && !active,
  });
  return (
    <div style={{ position: 'relative' }} onMouseDown={onSelect} className={className}>
      {(countAppointment && countAppointment !== 0) ? <span className={css.appointmentCount}>{countAppointment}</span>: ''}
      {monthDay}
    </div>
  );
};

export default compose(
  withHandlers({
    onSelect: ({ date, onSelect, countAppointment }) => (event) => {
      event.preventDefault();
      if (onSelect) {
        onSelect(date, countAppointment);
      }
    },
  })
)(Day);

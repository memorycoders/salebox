// @flow
import * as React from 'react';
import cx from 'classnames';
import css from './DatePicker.css';
import _l from 'lib/i18n';

type PropsT = {
  weekdays: Array<string>,
};

const WeekDays = ({ weekdays }: PropsT) => (
  <div className={cx(css.week, css.border)}>
    {weekdays.map((day) => (
      <div key={day} className={css.weekDay}>
        {_l.call(this, [day])}
      </div>
    ))}
  </div>
);

export default WeekDays;

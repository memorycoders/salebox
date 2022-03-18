// @flow
import * as React from 'react';
import { withState, withProps, compose, lifecycle } from 'recompose';
import ControlledDatePicker from './ControlledDatePicker';
import isSameDay from './isSameDay';

/**
 * @render react
 * @name DatePicker
 * @description Datepicker component
 * @example
 * <DatePicker
 *   value={new Date()}
 * />
 */

type PropsT = {
  /**
   * @property {Date} value Chose date for the picker
   */
  value: Date,
};

const DatePicker = ({ value, ...other }: PropsT) => <ControlledDatePicker value={value} {...other} />;

export default compose(
  withState('selectedMonth', 'selectMonth', ({ selectedMonth, value }) => {
    const newValue = value ? value : new Date();
    return new Date(selectedMonth || newValue);
  }),
  withProps(({ value, isCalendar }) => {
    const newValue = value ? value : new Date();
    return {
      active: (date) => {
        if (isCalendar){
          return isSameDay(date, new Date());
        }
        return isSameDay(date, newValue);
      },
    };
  }),

  lifecycle({
    componentWillReceiveProps(nextProps){
      if (nextProps.value !== this.props.value){
        this.props.selectMonth(nextProps.value)
      }
    }
  })
)(DatePicker);

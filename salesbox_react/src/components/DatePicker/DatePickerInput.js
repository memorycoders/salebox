// @flow
import * as React from 'react';
import { Popup, Input } from 'semantic-ui-react';
import { compose, withHandlers, withProps, withState, lifecycle } from 'recompose';
import _l from 'lib/i18n';
import cx from 'classnames';
import DatePicker from './DatePicker';
import css from './DatePicker.css';
import moment, { isDate } from 'moment';
const ENTER_KEY = 13;
const SPACE = 32;

type PropsType = {
  value: Date,
  onChange: (Date) => void,
  onMouseDown: (event: Event) => void,
  label: string,
  disabled: boolean,
  size?: string,
};

const toDate = (timePicker, date) => {
  return timePicker && date ? _l`${date}:t(h)` : moment(date).format('DD MMM YYYY');
};

const validate = (dateTime) => {
  const stamp = dateTime.split(' ');
  const validDate = !/Invalid|NaN/.test(new Date(stamp[0]).toString());
  const validTime = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(stamp[1]);
  return !validDate || !validTime || (stamp && stamp.length > 2);
};

const validateDate = (dateTime) => {
  /*
  const stamp = dateTime.split(' ');
  // const validDate = !/Invalid|NaN/.test(new Date(stamp[0]).toString());
  return !validDate || (stamp && stamp.length > 2);
*/
  return false;
};

const DatePickerInput = ({
  handleClick,
  size,
  disabled,
  label,
  value,
  onMouseDown,
  onChange,
  handOnChange,
  inputValue,
  handleKeyDown,
  handleBlur,
  isError,
  handleOnSelectDate,
  open,
  setOpen,
  placeholder,
  ...other
}: PropsType) => {
  const input = (
    <Input
      size={size}
      fluid
      icon="calendar"
      value={inputValue}
      onChange={handOnChange}
      onKeyDown={handleKeyDown}
      onClick={() => setOpen(true)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={isError ? cx(css.dateError, css.inputSize) : css.inputSize}
    />
  );
  return (
    <Popup
      onClose={() => setOpen(false)}
      open={open}
      onClick={handleClick}
      onMouseDown={onMouseDown}
      on="click"
      trigger={input}
      flowing
      placeholder=""
    >
      <DatePicker
        selected="null"
        value={inputValue ? inputValue : new Date()}
        onSelect={handleOnSelectDate}
        {...other}
        placeholder={placeholder}
      />
    </Popup>
  );
};

export default compose(
  withProps(({ timePicker, value }) => {
    const label =
      timePicker && value
        ? _l`${moment(value).format('DD MMM YYYY, HH:mm')}:t(h)`
        : value
        ? moment(value).format('DD MMM YYYY')
        : '';
    return {
      label,
    };
  }),
  withState('inputValue', 'setValue', (props) => {
    return props.label;
  }),
  withState('open', 'setOpen', false),
  withState('isError', 'setError', false),
  withState('inputDraft', 'setInputDraft', null),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (
        prevProps.value !== this.props.value ||
        prevProps.inputDraft != this.props.inputDraft
        // && prevProps.value
      ) {
        const { value, timePicker } = this.props;
        // console.log('componentDidUpdate value',value)
        let label =
          timePicker && value
            ? _l`${moment(value).format('DD MMM YYYY, HH:mm')}:t(h)`
            : moment(value).format('DD MMM YYYY');
        label = value == null || value == '' ? '' : label;
        this.props.setValue(label);
      }
    },
  }),
  withHandlers({
    onMouseDown: () => (event) => {
      event.preventDefault();
    },
    handleClick: () => (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    handOnChange: (props) => (e) => {
      props.setValue(e.target.value);
    },
    handleKeyDown: (props) => (e) => {
      if (e.keyCode === ENTER_KEY) {
        if (props.isValidate) {
          if (props.timePicker ? validate(e.target.value) : validateDate(e.target.value)) {
            props.setError(true);
            const newDate = new Date();
            props.setValue(e.target.value);
            props.setValue(toDate(props.timePicker ? true : false, newDate));
            setTimeout(() => {
              props.setError(false);
            }, 2000);
          } else {
            props.setError(false);
            props.setValue(e.target.value);

            const newValue = new Date(e.target.value);
            props.onChange(newValue);
            props.setOpen(false);
          }
        }
      }
    },
    handleBlur: (props) => (e) => {
      console.log('e.target.value',e.target.value)
      props.setInputDraft(e.target.value);
      if (props.isValidate) {
        if (props.timePicker ? validate(e.target.value) : validateDate(e.target.value)) {
          props.setError(true);
          const newDate = new Date();
          props.setValue(e.target.value);
          props.setValue(toDate(props.timePicker ? true : false, newDate));
          setTimeout(() => {
            props.setError(false);
          }, 2000);
        } else {
          props.setError(false);
          props.setValue(e.target.value);
          // const newValue = new Date(e.target.value);
          let newValue = e.target.value != null && e.target.value != '' ? new Date(e.target.value) : null;
          newValue = newValue == 'Invalid Date' ? new Date() : newValue;
          if (props.handlePropsEvent) {
            return props.handlePropsEvent();
          }
          props.setOpen(false);
          props.onChange(newValue);
        }
      } else {
        props.setError(false);
        props.setValue(e.target.value);
        let newValue = e.target.value != null && e.target.value != '' ? new Date(e.target.value) : null;
        newValue = newValue == 'Invalid Date' ? new Date() : newValue;
        if (props.handlePropsEvent) {
          return props.handlePropsEvent(newValue);
        }
        props.onChange(newValue);
        props.setOpen(false);
      }
    },
    handleOnSelectDate: ({ setOpen, onChange, setValue, timePicker }) => (valueDate) => {
      let label =
        timePicker && valueDate
          ? _l`${moment(valueDate).format('DD MMM YYYY, HH:mm')}:t(h)`
          : moment(valueDate).format('DD MMM YYYY');
      setValue(label);
      onChange(valueDate);
      if (timePicker) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    },
  })
)(DatePickerInput);

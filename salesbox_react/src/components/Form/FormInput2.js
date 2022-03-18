// @flow
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';
import css from './FormInput.css';

type ValueT = string | number;

export type FormInputPropsT = {
  input: {
    value: ValueT,
    onBlur: () => {},
    onFocus: () => {},
    onChange: (ValueT) => void,
  },
  meta: {
    pristine: boolean,
    error?: string,
    active: boolean,
    touched: boolean,
  },
  label: string,
};

export type EventDataT = {
  value: ValueT,
};

export default class FormInput2 extends React.Component<FormInputPropsT> {
  handleChange = (event: {}, { value }: EventDataT) => {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  };

  render() {
    const { meta, input, label, ...other } = this.props;
    const { value } = input;
    const { error, touched } = meta;
    const hasError = touched && !!error;


    return (
      <Form.Field error={hasError}>
        {/* <label>{label}</label> */}
        <Input value={value ? value : ""} onBlur={input.onBlur} onFocus={input.onFocus} onChange={this.handleChange} {...other} />
        {hasError && <div className={css.error}>{error}</div>}
      </Form.Field>
    );
  }
}

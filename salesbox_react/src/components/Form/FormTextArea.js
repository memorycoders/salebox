// @flow
import * as React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import type { FormInputPropsT, EventDataT } from './FormInput';
import css from './FormInput.css';

export default class FormInput extends React.Component<FormInputPropsT> {
  handleChange = (event: {}, { value }: EventDataT) => {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  };

  render() {
    const { meta, input, label, ...other } = this.props;
    const { value } = input;
    const { error } = meta;
    return (
      <Form.Field error={!!error}>
        <label>{label}</label>
        <TextArea value={value} onBlur={input.onBlur} onFocus={input.onFocus} onChange={this.handleChange} {...other} />
        {error && <div className={css.error}>{error}</div>}
      </Form.Field>
    );
  }
}

// @flow
import * as React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import css from './FormInput.css';
import type { FormInputPropsT, EventDataT } from './FormInput';

type FormDropdownPropsT = FormInputPropsT & {
  options: [],
};

export default class FormDropdown extends React.Component<FormDropdownPropsT> {
  handleChange = (event: {}, { value }: EventDataT) => {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  };

  render() {
    const { meta, input, label, options, ...other } = this.props;
    const { value } = input;
    const { error } = meta;

    return (
      <Form.Field error={!!error}>
        <label>{label}</label>
        <Dropdown
          value={value}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          selection
          scrolling
          options={options}
          onChange={this.handleChange}
          {...other}
        />
        {error && <div className={css.error}>{error}</div>}
      </Form.Field>
    );
  }
}

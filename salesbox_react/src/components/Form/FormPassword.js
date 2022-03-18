// @flow
import * as React from 'react';
import { Form, Progress, Input, Divider } from 'semantic-ui-react';
import calculatePasswordScore from 'lib/calculatePasswordScore';
import _l from 'lib/i18n';
import css from './FormInput.css';
import type { FormInputPropsT, EventDataT } from './FormInput';

addTranslations({
  'en-US': {
    'Very strong': 'Very strong',
    Strong: 'Strong',
    Good: 'Good',
    Weak: 'Weak',
    'Very weak': 'Very weak',
  },
});

export default class FormPassword extends React.Component<FormInputPropsT> {
  handleChange = (event: {}, { value }: EventDataT) => {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  };

  render() {
    const { label, meta, input, ...other } = this.props;
    const { value, onBlur, onFocus } = input;
    const { error } = meta;
    const passwordScore = calculatePasswordScore(`${value}`);
    let strength;
    let color;
    if (passwordScore > 90) {
      strength = _l`Very strong`;
      color = 'green';
    } else if (passwordScore > 70) {
      strength = _l`Strong`;
      color = 'green';
    } else if (passwordScore > 50) {
      strength = _l`Good`;
      color = 'orange';
    } else if (passwordScore > 30) {
      strength = _l`Weak`;
      color = 'orange';
    } else {
      strength = _l`Very weak`;
      color = 'red';
    }
    return (
      <Form.Field error={!!error}>
        <label>{label}</label>
        <Input
          type="password"
          value={value}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={this.handleChange}
          {...other}
        />
        {error && <div className={css.error}>{error}</div>}
        <Divider hidden />
        {passwordScore > 0 && <Progress progress="value" value={passwordScore} color={color} label={strength} />}
      </Form.Field>
    );
  }
}

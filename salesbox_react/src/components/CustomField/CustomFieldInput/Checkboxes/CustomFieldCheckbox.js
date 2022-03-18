//@flow
import * as React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { mapProps, compose, withHandlers } from 'recompose';

type PropsType = {
  value: string,
  radio: boolean,
  name: string,
  checked: boolean,
};

const CustomFieldCheckbox = ({ handleChange, value, radio, name, checked, ...other }: PropsType) => {

  // !!!: cons

  return (
    <Checkbox
      // radio={radio}
      name={name}
      value={value}
      checked={checked}
      label={value}
      {...other}
      onChange={handleChange}
    />
  );
};

export default compose(
  withHandlers({
    handleChange: ({ optionId, onChange }) => (event, { checked }) => {
      onChange(optionId, checked);
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ optionId, handleUpdate, onChange, ...other }) => ({
    ...other,
  }))
)(CustomFieldCheckbox);

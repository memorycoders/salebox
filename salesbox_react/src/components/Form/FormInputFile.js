// @flow
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';
import css from './FormInput.css';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import * as wizardActions from 'components/Wizard/wizard.actions';

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
  imageOnCropEnabled: (event: Event, { value: any }) => void,
};

export type EventDataT = {
  value: ValueT,
};

// FIXME: Support wizard crop-able image only.
class FormInputFile extends React.Component<FormInputPropsT> {
  handleChange = (event: {}, { value }: EventDataT) => {
    const {
      input: { onChange },
      imageOnCropEnabled,
    } = this.props;
    onChange(value);

    // handleOnFileSelected(value);

    const fileData = event.target.files[0];
    // value = fakePath
    imageOnCropEnabled(value, fileData);
  };

  render() {
    const { meta, input, label, ...other } = this.props;
    // const { value } = input;
    const { error, touched } = meta;
    const hasError = touched && !!error;

    return (
      <Form.Field error={hasError}>
        <label>{label}</label>
        <Input type="file" onBlur={input.onBlur} onFocus={input.onFocus} onChange={this.handleChange}
               style={this.props.hiddenInput && { display:'none'}}
               {...other} />
        {hasError && <div className={css.error}>{error}</div>}
      </Form.Field>
    );
  }
}

const mapStateToProps = (state) => {
  //
  return {
  }
};
const mapDispatchToProps = {
  imageOnCropEnabled: wizardActions.imageOnCropEnabled,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  // withHandlers({
  //   handleOnFileSelected: ({ imageOnCropEnabled }) => (event, { value }) => {
  //     const fileData = event.target.files[0];
  //     // value = fakePath
  //     imageOnCropEnabled(value, fileData);
  //   },
  // }),
)(FormInputFile);

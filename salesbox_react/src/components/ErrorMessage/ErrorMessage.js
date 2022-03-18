// @flow
import * as React from 'react';

type PropsT = {
  error?: {
    message: string,
  },
};

// TODO: See if remantic-ui has something nice for this
export default class ErrorMessage extends React.Component<PropsT> {
  render() {
    const { message = 'Error' } = this.props.error || {};

    return <div>{message}</div>;
  }
}

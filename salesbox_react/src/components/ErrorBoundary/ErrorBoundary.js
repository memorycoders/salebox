// @flow
import * as React from 'react';
import css from './ErrorBoundary.css';

type PropsType = {
  error: {
    toString: () => string,
  },
  info: {
    componentStack: {
      trim: () => string,
    },
  },
};

const ErrorBoundary = ({ error, info }: PropsType) => {
  return (
    <div className={css.wrapper}>
      <div className={css.error}>
        <h1>Error: {error.toString()}</h1>
        <div className={css.stack}>{info.componentStack.trim()}</div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

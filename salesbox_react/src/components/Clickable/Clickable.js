// @flow
import * as React from 'react';
import { compose, withHandlers, mapProps } from 'recompose';
import cx from 'classnames';
import css from './Clickable.css';

type PropsType = {
  className: string,
};

const Clickable = ({ className, ...rest }: PropsType) => {
  return <div role="button" tabIndex={0} className={cx(className, css.clickable)} {...rest} />;
};

export default compose(
  withHandlers({
    onClick: ({ onNavigate }) => () => {
      onNavigate();
    },
    onKeyDown: ({ onNavigate }) => (event) => {
      if (event.keyCode === 13) {
        onNavigate();
      }
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ onNavigate, ...other }) => ({
    ...other,
  }))
)(Clickable);

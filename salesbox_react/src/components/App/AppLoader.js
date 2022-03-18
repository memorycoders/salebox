//@flow
import * as React from 'react';
import css from 'Common.css';
import cx from 'classnames';

type PropsT = {
  loading: boolean,
};

const AppLoader = ({ loading }: PropsT) => {
  return (
    <div className={css.loader} style={{ display: loading ? 'flex' : 'none' }}>
      <div className={cx(css.rotatePulse, css.big)}>
        <div />
        <div />
      </div>
    </div>
  );
};

export default AppLoader;

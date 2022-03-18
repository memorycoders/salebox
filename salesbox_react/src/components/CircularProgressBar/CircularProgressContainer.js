//@flow
import * as React from 'react';
import { compose, defaultProps } from 'recompose';
import css from './CircularProgressBar.css';

const FULL_RADIUS = 50;

type PropsT = {
  background: boolean,
  fullRadius: number,
  children: React.Node,
};

const CircularProgressContainer = ({ fullRadius, background, children }: PropsT) => {
  return (
    <svg viewBox={`0 0 ${fullRadius * 2} ${fullRadius * 2}`} width={fullRadius} height={fullRadius}>
      {background && <circle className={css.background} cx={fullRadius / 2} cy={fullRadius / 2} r={fullRadius} />}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { fullRadius });
      })}
    </svg>
  );
};

export default compose(
  defaultProps({
    background: false,
    fullRadius: FULL_RADIUS,
  })
)(CircularProgressContainer);

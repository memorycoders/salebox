// @flow
import * as React from 'react';
import css from './CircularProgressBar.css';

type PropsT = {
  text: string,
  color: string,
  size: string,
};

const CircularProgressText = ({ text, color, size, fullRadius, ...other }: PropsT) => {
  return (
    <text fill={color} style={{ fontSize: `${size}px` }} className={css.text} {...other}>
      {text}
    </text>
  );
};

export default CircularProgressText;

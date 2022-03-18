// @flow
import * as React from 'react';
import css from './VerticalProgressBar.css';

type PropsType = {
  progress: number,
};

const getColor = (days) => {
  const value = Math.max(0, Math.min(days / 100, 1));
  const hue = ((1 - value) * 120).toString(10);
  return `hsl(${hue}, 100%, 60%)`;
};

const VerticalProgressBar = ({ progress }: PropsType) => {
  const value = Math.max(Math.min(100, progress), 0);
  const backgroundColor = getColor(value);
  const style = {
    backgroundColor,
    height: `${value}%`,
  };
  return (
    <div className={css.bar}>
      <div className={css.progress} style={style} />
    </div>
  );
};

export default VerticalProgressBar;

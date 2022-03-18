//@flow
import * as React from 'react';
import { compose, withProps, defaultProps } from 'recompose';
import css from './CircularProgressBar.css';

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;
const FULL_RADIUS = 50;

type PropsT = {
  strokeWidth: number,
  color: string,
  pathStyles: string,
  pathDescription: string,
};

const rgba = (input, opacity = 1) => {
  const hex = input.replace('#', '');
  const r = Math.ceil(parseInt(hex.substring(0, 2), 16));
  const g = Math.ceil(parseInt(hex.substring(2, 4), 16));
  const b = Math.ceil(parseInt(hex.substring(4, 6), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const CircularProgress = ({ color, strokeWidth, pathStyles, pathDescription }: PropsT) => {
  return (
    <g>
      <path stroke={rgba(color, 0.5)} d={pathDescription} strokeWidth={strokeWidth} fillOpacity={0} />
      <path
        className={css.path}
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={pathStyles}
        stroke={color}
      />
    </g>
  );
};

const getPathRadius = (fullRadius, background, padding, strokeWidth) => {
  return fullRadius - strokeWidth / 2 - padding;
};

const getPathDescription = (fullRadius, background, padding, strokeWidth) => {
  const radius = getPathRadius(fullRadius, background, padding, strokeWidth);

  return `
    M ${fullRadius},${fullRadius}
    m 0,-${radius}
    a ${radius},${radius} 0 1 1 0,${2 * radius}
    a ${radius},${radius} 0 1 1 0,-${2 * radius}
  `;
};

const getPathStyles = (fullRadius, percentage, background, padding, strokeWidth) => {
  const diameter = Math.PI * 2 * getPathRadius(fullRadius, background, padding, strokeWidth);
  const truncatedPercentage = Math.min(Math.max(percentage, MIN_PERCENTAGE), MAX_PERCENTAGE);
  const dashoffset = ((100 - truncatedPercentage) / 100) * diameter;

  return {
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${dashoffset}px`,
  };
};

export default compose(
  defaultProps({
    color: '#3e98c7',
    background: false,
    strokeWidth: 6,
    percentage: 0,
    padding: 0,
    fullRadius: FULL_RADIUS,
  }),
  withProps(({ fullRadius, percentage, background, padding, strokeWidth }) => ({
    pathStyles: getPathStyles(fullRadius, percentage, background, padding, strokeWidth),
    pathDescription: getPathDescription(fullRadius, background, padding, strokeWidth),
  }))
)(CircularProgress);

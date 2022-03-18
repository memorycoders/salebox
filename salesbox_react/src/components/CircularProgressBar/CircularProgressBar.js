//@flow
import * as React from 'react';
import { compose, withProps, defaultProps, lifecycle } from 'recompose';
import _l from 'lib/i18n';
import css from './CircularProgressBar.css';

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;
const MAX_X = 100;
const MAX_Y = 100;
const FULL_RADIUS = 50;
const CENTER_X = 50;
const CENTER_Y = 50;

type PropsT = {
  background: boolean,
  strokeWidth: number,
  color: string,
  pathStyles: string,
  pathDescription: string,
  text: string,
  fullRadius: number,
};

const rgba = (input, opacity = 1) => {
  const hex = input.replace('#', '');
  const r = Math.ceil(parseInt(hex.substring(0, 2), 16));
  const g = Math.ceil(parseInt(hex.substring(2, 4), 16));
  const b = Math.ceil(parseInt(hex.substring(4, 6), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ProgressBar = ({ fullRadius, color, strokeWidth, background, pathStyles, pathDescription, text, width = 100, height = 100, textStyle, subText }: PropsT) => {
  return (
    <svg viewBox={`0 0 ${MAX_X} ${MAX_Y}`} width={width} height={height}>
      <circle className={css.background} cx={CENTER_X} cy={CENTER_Y} r={38} />
      <path stroke={rgba(color, 0.1)} d={pathDescription} strokeWidth={strokeWidth} fillOpacity={0} />
      <path
        className={css.path}
        d={pathDescription}
        strokeWidth={strokeWidth}
        fillOpacity={0}
        style={pathStyles}
        stroke={color}
      />
      {text && (
        <text fill="#fff" className={`${css.text} ${textStyle}`} x={CENTER_X} y={CENTER_Y + 2}>
          {text}
        </text>
      )}
      {subText !== undefined && (
        <text fill="#fff" className={`${css.subText}`} x={CENTER_X} y={72}>
          {subText}
        </text>
      )}
    </svg>
  );
};

const getBackgroundPadding = (background, strokeWidth, backgroundPadding) => {
  if (background) {
    if (backgroundPadding === null) {
      return strokeWidth;
    }
    return backgroundPadding;
  }
  return 0;
};

const getPathRadius = (fullRadius, background, backgroundPadding, strokeWidth) => {
  return fullRadius - strokeWidth / 2 - getBackgroundPadding(background, strokeWidth, backgroundPadding);
};

const getPathDescription = (fullRadius, background, backgroundPadding, strokeWidth) => {
  const radius = getPathRadius(fullRadius, background, backgroundPadding, strokeWidth);

  return `
    M ${CENTER_X},${CENTER_Y}
    m 0,-${radius}
    a ${radius},${radius} 0 1 1 0,${2 * radius}
    a ${radius},${radius} 0 1 1 0,-${2 * radius}
  `;
};

const getPathStyles = (fullRadius, percentage, background, backgroundPadding, strokeWidth) => {
  const diameter = Math.PI * 2 * getPathRadius(fullRadius, background, backgroundPadding, strokeWidth);
  const truncatedPercentage = Math.min(Math.max(percentage, MIN_PERCENTAGE), MAX_PERCENTAGE);
  const dashoffset = ((100 - truncatedPercentage) / 100) * diameter;

  return {
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${dashoffset}px`,
  };
};

export default compose(
  defaultProps({
    background: false,
    strokeWidth: 8,
    percentage: 0,
    backgroundPadding: null,
    fullRadius: FULL_RADIUS,
  }),
  withProps(({ fullRadius, percentage, background, backgroundPadding, strokeWidth, noBorder }) => ({
    pathStyles: getPathStyles(fullRadius, percentage, background, backgroundPadding, strokeWidth),
    pathDescription: getPathDescription(fullRadius, background, backgroundPadding, strokeWidth),
    text: noBorder ? percentage : _l`${percentage / 100}:p`,
  })),
  lifecycle({
    componentDidMount() {

    }
  })
)(ProgressBar);

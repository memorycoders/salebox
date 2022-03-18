// @flow
import * as React from 'react';
import Svg from '../Svg';

type PropsT = {
  color: string,
};

const hexToRgb = (input, opacity = 1) => {
  const hex = input.replace('#', '');
  const r = Math.ceil(parseInt(hex.substring(0, 2), 16));
  const g = Math.ceil(parseInt(hex.substring(2, 4), 16));
  const b = Math.ceil(parseInt(hex.substring(4, 6), 16));
  return {
    r,
    g,
    b,
    a: opacity,
  };
};

export default class LinePoints extends React.Component<PropsT> {
  static defaultProps = {
    color: '#E9CF99',
  };

  /*
        <rect
          x="36.189"
          y="31.245"
          transform="matrix(-0.9978 -0.0667 0.0667 -0.9978 90.4668 65.6548)"
          fill={color}
          width="20.278"
          height="0.147"
        />


 */
  render() {
    const { color, ...other } = this.props;
    return (
      <Svg viewBox="0 0 90.411 50.545" height={51} width={91} {...other}>
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={hexToRgb(color, 0.75)} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="linear2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={hexToRgb(color, 0.75)} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle fill={color} cx="36.589" cy="1.774" r="1.774" />
        <circle fill={color} cx="36.379" cy="30.564" r="1.774" />
        <circle fill={color} cx="56.612" cy="31.916" r="1.774" />
        <circle fill={color} cx="13.822" cy="50.394" r="1.774" />
        <circle fill={color} cx="58.939" cy="47.722" r="1.774" />
        <circle fill={color} cx="84.577" cy="48.771" r="1.774" />
        <line x1="36.589" y1="1.774" x2="36.379" y2="30.564" strokeWidth={0.2} stroke={color} />
        <line x1="36.589" y1="1.774" x2="56.612" y2="31.916" strokeWidth={0.2} stroke={color} />
        <line x1="36.379" y1="30.564" x2="56.612" y2="31.916" strokeWidth={0.2} stroke={color} />
        <line x1="13.822" y1="50.394" x2="36.379" y2="30.564" strokeWidth={0.2} stroke={color} />
        <line x1="56.612" y1="31.916" x2="58.939" y2="47.722" strokeWidth={0.2} stroke={color} />
        <line x1="56.612" y1="31.916" x2="84.577" y2="48.771" strokeWidth={0.2} stroke={color} />

        <line x1="56.612" y1="31.916" x2="90" y2="12.771" strokeWidth={0.2} stroke="url(#linear)" />
        <line x1="2" y1="32.771" x2="36.379" y2="30.564" strokeWidth={0.2} stroke="url(#linear2)" />
      </Svg>
    );
  }
}

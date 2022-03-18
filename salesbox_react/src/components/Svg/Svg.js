// @flow
import * as React from 'react';
import classNames from 'classnames';
import css from './Svg.css';

type SvgT = {
  size?: number,
  width?: number,
  height?: number,
  children: React.Node,
  className?: string,
};

const Svg = ({ children, width, height, size, className, ...props }: SvgT) => (
  <svg
    {...props}
    className={classNames(css.root, className)}
    width={width || size || 24}
    height={height || size || 24}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

export default Svg;

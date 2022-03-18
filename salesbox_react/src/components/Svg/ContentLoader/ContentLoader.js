// @flow
import * as React from 'react';
import { compose, defaultProps } from 'recompose';
import Svg from '../Svg';

type PropsT = {
  color: string,
  width: number,
  height: number,
  children: React.Node,
};

const ContentLoader = ({ width, height, color, children, ...other }: PropsT) => (
  <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} {...other}>
    <g fill={color} stroke={color}>
      {children}
    </g>
  </Svg>
);

export default compose(
  defaultProps({
    color: '#DDD',
    width: 64,
    height: 64,
  })
)(ContentLoader);

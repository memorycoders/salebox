/* eslint-disable react/prop-types */
import * as React from 'react';
import Svg from '../Svg';

const QualifiedCircle = ({ width, height, color, percent, radius, strokeWidth = 2 }) => {
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

    return d;
  };
  const outerRadius = radius;
  const middleRadius = (13 / 15) * outerRadius;
  const innerRadius = (7 / 9) * outerRadius;
  const textSize = (5 / 9) * outerRadius;
  const p = (percent * 360) / 100;
  const trans = `translate(${radius + 2}, ${radius + 2})`;
  return (
    <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="xMinYMin">
      <g transform={trans}>
        <circle r={middleRadius} fill="transparent" />
        <circle r={innerRadius} fill="#173849" />
        <text
          textAnchor="middle"
          className=""
          dy="5"
          dx="0"
          style={{ fill: 'rgb(255, 255, 255)', fontSize: `${textSize}px` }}
        >
          {percent}%
        </text>
        <path d={describeArc(0, 0, radius, 0, p)} fill="none" stroke={color} strokeWidth={strokeWidth} />
      </g>
    </Svg>
  );
};

export default QualifiedCircle;

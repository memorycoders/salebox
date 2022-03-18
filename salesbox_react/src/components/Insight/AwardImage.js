//@flow
import * as React from 'react';
import cx from 'classnames';
import css from './Insight.css';

type PropsType = {
  fade: {},
};

const AwardImage = ({ fade }: PropsType) => {
  const cn = cx(css.award, {
    [css.fade]: fade,
  });
  return <img src="/insight-award.png" className={cn} />;
};

export default AwardImage;

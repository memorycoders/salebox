// @flow

import * as React from 'react';
import cx from 'classnames';
import css from './Pane.css';

type PropsT = {
  children: React.Node,
  className?: string,
  horizontal?: boolean,
  grows?: boolean,
  shrinks?: boolean,
};

const Pane = ({ className, children, horizontal, grows, shrinks }: PropsT) => {
  const cn = cx(css.root, className, {
    [css.horizontal]: horizontal,
    [css.grows]: grows,
    [css.shrinks]: shrinks,
  });
  return <div className={cn}>{children}</div>;
};
export default Pane;

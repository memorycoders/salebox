//@flow
import * as React from 'react';
import cx from 'classnames';
import css from './Pair.css';

type PropsT = {
  label: React.Node,
  action: React.Node,
  mini?: boolean,
};

const Header = ({ label, action, mini }: PropsT) => {
  const className = cx(css.header, {
    [css.mini]: mini,
  });
  return (
    <div className={className}>
      <div className={css.label}>{label}</div>
      {action && <div className={css.action}>{action}</div>}
    </div>
  );
};

export default Header;

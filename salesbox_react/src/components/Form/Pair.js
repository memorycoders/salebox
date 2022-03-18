//@flow
import * as React from 'react';

import { Label } from 'semantic-ui-react';

import cx from 'classnames';
import css from './Pair.css';

type PropsT = {
  label: string,
  children: React.Node,
  mini?: boolean,
  left?: boolean,
  required?: boolean,
  labelStyle?: string,
};

const Pair = ({ required, label, children, mini, left, labelStyle, isCustomFieldPair, style }: PropsT) => {
  const className = cx(isCustomFieldPair ? css.customFieldPair : css.pair, {
    [css.mini]: mini,
    [css.left]: left,
  });
  const labelStyles = cx(css.label, labelStyle);
  return (
    <div className={className}>
      <div className={css.labelWrapper}>
        <div className={labelStyles}>
          {/* <Label basic>{label}</Label> */}
          {label}
          {required && <span className={css.required}>*</span>}
        </div>
        <div style={style} className={css.input}>{children}</div>
      </div>
    </div>
  );
};

export default Pair;

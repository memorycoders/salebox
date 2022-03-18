//@flow
import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Menu } from 'semantic-ui-react';
import cx from 'classnames';
import css from 'components/Collapsible/Collapsible.css';
import localCss from './style.css';

type PropsT = {
  handleRef: (any) => void,
  style: {},
  children: React.Node,
  title: string,
  wrapperClassName: string,
  containerClassName: string,
};

const headerStyle = {
  border: 'none',
  borderBottom: '2px solid #d4d4d5',
};

const SettingPane = ({ minWidth, containerClassName, wrapperClassName, title, handleRef, style, children }: PropsT) => {
  return (
    <div style={{ minWidth: minWidth ? minWidth : 'unset' }} className={cx(css.collapsible, css.margin)}>
      <Menu style={headerStyle} attached="top" borderless>
        <Menu.Item header>{title}</Menu.Item>
      </Menu>
      <div ref={handleRef} className={containerClassName} style={style}>
        <div className={wrapperClassName}>{children}</div>
      </div>
    </div>
  );
};

export default compose(
  withProps(({ flex, padded, open, vertical, containerClassName }) => ({
    wrapperClassName: cx(css.wrapper, {
      [css.padded]: padded,
      [css.flex]: flex,
      [css.vertical]: vertical,
    }),
    containerClassName: containerClassName
      ? containerClassName
      : cx(localCss.container, {
        [css.closed]: !open,
      }),
  }))
)(SettingPane);

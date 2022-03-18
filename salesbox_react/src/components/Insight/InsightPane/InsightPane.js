//@flow
import * as React from 'react';
import { compose, withProps } from 'recompose';
import { Menu } from 'semantic-ui-react';
import cx from 'classnames';
import css from 'components/Collapsible/Collapsible.css';

type PropsT = {
  handleRef: (any) => void,
  style: {},
  children: React.Node,
  title: string,
  wrapperClassName: string,
  containerClassName: string,
};

const headerStyle={
  border: 'none',
  borderBottom: '1px solid #d4d4d5'
}

const InsightPane = ({ minWidth, containerClassName, wrapperClassName, title, handleRef, style, children, headerRight }: PropsT) => {
  return (
    <div style={{ minWidth: minWidth ? minWidth : 'unset' }} className={cx(css.collapsible, css.margin)}>
      <Menu style={headerStyle} attached="top" borderless>
        <Menu.Item header>{title}</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            {headerRight}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div ref={handleRef} className={containerClassName} style={style}>
        <div className={wrapperClassName}>{children}</div>
      </div>
    </div>
  );
};

export default compose(
  withProps(({ flex, padded, open, vertical }) => ({
    wrapperClassName: cx(css.wrapper, {
      [css.padded]: padded,
      [css.flex]: flex,
      [css.vertical]: vertical,
    }),
    containerClassName: cx(css.container, {
      [css.closed]: !open,
    }),
  }))
)(InsightPane);

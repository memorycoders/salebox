//@flow
import * as React from 'react';
import { lifecycle, withState, withHandlers, compose, withProps, defaultProps, setStatic } from 'recompose';
import { Menu, Label, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import css from './Collapsible.css';
import _l from 'lib/i18n';

import iconImport from '../../../../../public/icon-import.jpg';
import iconExport from '../../../../../public/icon-export.png';
type PropsT = {
  handleRef: (any) => void,
  style: {},
  open: boolean,
  toggle: () => void,
  children: React.Node,
  title: string,
  wrapperClassName: string,
  containerClassName: string,
  icon: React.Node,
  onIconClick: (Event) => void,
  statusText: string,
  statusColor: string,
  onClick: (Event) => void,
};

const Collapsible = ({
  containerClassName,
  wrapperClassName,
  open,
  toggle,
  title,
  handleRef,
  style,
  children,
  icon,
  onIconClick,
  statusText,
  statusColor,
  count,
  width,
  right,
  rightClassName,
  maxHeight,
  hasDragable,
  onClick,
  height,
  isImport,
}: PropsT) => {
  const colorCount = "#f3f4f4";

  return (
    <React.Fragment>
      <Menu style={{ width, minWidth: width, position: 'relative' }} className={css.collapsibleHeader} attached="top" borderless>
        {/* {hasDragable && <div className={css.absoluteIcon}>
          <img style={{ width: 19 }} src={require('../../../public/dragable-icon.png')} />
        </div>} */}
        <Menu.Item style={{ width: '10.5px !important'}} header onClick={() => {
          if (typeof onClick === 'function') onClick();
        }}>
          {isImport && (
            <img src={iconImport} width={15} height={18} />
          )}
          {!isImport && (
            <img src={iconExport} style={{ width: '15px',
              height: '16px',
              marginRight: '5px' }} />
          )}
          {_l`${title}`}
          {count &&
            <span className={css.count}>{count}</span>
          }
        </Menu.Item>
        {statusText && (
          <Menu.Item>
            <Label style={{ fontSize: 11, backgroundColor: statusColor, }} color={statusColor}>{statusText}</Label>
          </Menu.Item>
        )}
        {icon && (
          <Menu.Item onClick={onIconClick} icon className={right ? css.normal : css.noRightMenu}>
            {icon}
          </Menu.Item>
        )}
        <Menu.Menu position="right">
          <Menu.Item className={rightClassName}>{right}</Menu.Item>
          {/* {!right && <Menu.Item icon={open ? 'chevron up' : 'chevron down'} onClick={toggle} />} */}
        </Menu.Menu>
      </Menu>
      <div style={{ ...style, width, overflowY: 'auto', height }} ref={handleRef} className={containerClassName}>
        <div style={{display: open ? 'block' : 'none'}} className={`${wrapperClassName} ${css.childDescription}`}>
          {children}
          </div>
      </div>
    </React.Fragment>
  );
};

export default compose(
  defaultProps({
    open: true,
  }),
  withState('maxHeight', 'setMaxHeight', null),
  withState('open', 'setOpen', ({ open }) => open),
  withHandlers(() => {
    let container;
    return {
      toggle: ({ open, setOpen }) => () => setOpen(!open),
      handleRef: () => (ref) => (container = ref),
      setMaxHeight: ({ maxHeight, setMaxHeight }) => () => {
        if (maxHeight !== container.scrollHeight) {
          setMaxHeight(container.scrollHeight);
        }
      },
    };
  }),
  withProps(({ flex, padded, open, maxHeight, vertical }) => ({
    wrapperClassName: cx(css.wrapper, {
      [css.padded]: padded,
      [css.flex]: flex,
      [css.vertical]: vertical,
    }),
    containerClassName: cx(css.container, {
      [css.closed]: !open,
    }),
  })),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (prevProps.open !== this.props.open) {
        this.props.setOpen(this.props.open);
      }
      this.props.setMaxHeight();
    },
    componentDidMount() {
      this.props.setMaxHeight();
    },
  })
)(Collapsible);

// @flow
import * as React from 'react';
import { defaultProps, compose, withHandlers, withState } from 'recompose';
import cx from 'classnames';
import { Segment, Menu, Header, Popup, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './MoreMenu.css';

type PropsType = {
  children: React.Node,
  open: boolean,
  onClick: () => void,
  onOpen: () => void,
  onClose: () => void,
  handleClick: () => void,
  color: string,
  title: string,
  className: string
};

addTranslations({
  'en-US': {
    Actions: 'Actions',
  },
});

const headerStyle = {
  margin: 0,
};

const popupStyle = {
  padding: 0,
};

const SortMenu = ({ children, open, handleClick, onOpen, onClose, color, className, filter, imageClass }: PropsType) => {
  return (
    <Popup
      onClick={handleClick}
      trigger={<div className={className} onClick={handleClick} icon="ellipsis vertical">
        {filter && <img className={`${css.filter} ${imageClass}`} src={require('../../../public/sort.png')}/>}
      </div>}
      onOpen={onOpen}
      onClose={onClose}
      open={open}
      flowing
      hoverable
      style={popupStyle}
      position="bottom center"
      className={cx(color)}
      keepInViewPort
      hideOnScroll
    >
      <Menu vertical color="teal">
        {/* <Segment inverted style={headerStyle}>
          <Header as="h3">{title}</Header>
        </Segment> */}
        {children}
      </Menu>
    </Popup>
  );
};

export default compose(
  defaultProps({
    title: _l`Actions`,
  }),
  withState('open', 'setOpen', false),
  withHandlers({
    onOpen: ({ setOpen }) => () => {
      setOpen(true);
    },
    handleClick: ({ setOpen }) => (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
  })
)(SortMenu);

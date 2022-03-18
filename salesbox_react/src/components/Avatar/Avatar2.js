//@flow
import * as React from 'react';
import { compose, withProps, defaultProps } from 'recompose';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import css from './Avatar.css';

type PropsType = {
  style: {},
  border: string,
  src: string,
  fallbackIcon: string,
  backgroundColor: string,
  missingColor: string,
};

const Avatar2 = ({ style, src, fallbackIcon, missingColor }: PropsType) => {
  return (
    <div className={css.avatar} style={style}>
      {!src && <Icon inverted name={fallbackIcon} color={missingColor} size="big" />}
    </div>
  );
};

export default compose(
  defaultProps({
    size: 80,   // FIXME: Merge me with Avatar Component.
    fallbackIcon: 'warning sign',
    backgroundColor: 'rgba(200, 200, 200)',
  }),
  withProps(({ src, size, backgroundColor }) => ({
    style: {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      backgroundColor,
      backgroundImage: src ? `url(https://d3si3omi71glok.cloudfront.net/salesboxfiles/${src.slice(-3)}/${src})` : null,
    },
  }))
)(Avatar2);

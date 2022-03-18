import React from 'react';
import { Button } from 'semantic-ui-react';
import css from './IconButton.css';

export const IconButton = ({ size, src, reverseClass, imageClass, btnClass, children, style, className, name, buttonName,...other }) => {
  return (
    <Button
      {...other}
      style={{
        maxWidth: size,
        maxHeight: size,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      className={
        reverseClass
          ? `${css.reverseBtn} ${btnClass} ${css.alignItemBtn} ${className}`
          : `${css.btn} ${btnClass} ${css.alignItemBtn} ${className}`
      }
    >
      <img className={imageClass} src={src} />
      {children}
    </Button>
  );
};

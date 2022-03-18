import React from 'react';
import { Button } from 'semantic-ui-react';
import css from './IconButton.css';

export const IconButton = ({ size, src, reverseClass, imageClass, btnClass, children, style, className, name, buttonName, ...other }) => {
  return (
    <Button
      {...other}
      className={
        reverseClass
        ? `${css.reverseBtn} ${btnClass} ${css.alignItemBtn} ${className}`
        : buttonName === 'configBtn' ? `${css.configBtn} ${btnClass} ${css.alignItemBtn} ${className}` : `${css.btn} ${btnClass} ${css.alignItemBtn} ${className}`
      }
      style={{
        maxWidth: size,
        maxHeight: size,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      <img className={imageClass} src={src} />
      {children}
    </Button>
  );
};

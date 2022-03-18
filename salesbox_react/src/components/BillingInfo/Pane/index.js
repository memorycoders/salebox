/* eslint-disable react/prop-types */
import React from 'react';
import css from './pane.css';
import { Image } from 'semantic-ui-react';
import step3 from '../../../../public/step3.svg';
import step1 from '../../../../public/step1.svg';
import step2 from '../../../../public/step2.svg';
const BillingPane = (props) => {
  return (
    <div className={css.container}>
      <div className={css.title}>
        <span className={css.step0}>
          <Image
            className={props.step == 2 ? css.number2 : css.number}
            src={props.step == 1 ? step1 : props.step == 2 ? step2 : step3}
          />
        </span>
        <strong>{props.title}</strong>
      </div>
      <div
        className={
          props.title == 'Card info' ? css.contentTop15 : props.title == 'Licenses' ? css.contentTop23 : css.content
        }
      >
        {props.children}
      </div>
    </div>
  );
};
export default BillingPane;

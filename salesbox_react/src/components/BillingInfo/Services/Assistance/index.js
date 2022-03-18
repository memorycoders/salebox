/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from '../../Subscriptions/Licenses/licenses.css';
import otherCss from '../../../CompanySettings/DefaultValues/SaleProcess/SaleProcess.css';
import { Icon, Segment, Menu } from 'semantic-ui-react';
import { iconMoney } from '../../../../Constants';

const Licenses = ({
  listAddOn,
  currency,
  // period,
  addOnSelecteds,
  __extraPackage,
  // numberPaidLicense,
  // numberMoreLicense,
  // removeNumberLicense,
  // addNumberLicense,
  selectAddOn,
                    paymentAssistance
}) => {
  const customParseFloat = (number) => {
    if (isNaN(parseFloat(number)) === false) {
      let toFixedLength = 0;
      const str = String(number);

      ['.', ','].forEach((seperator) => {
        const arr = str.split(seperator);
        if (arr.length === 2) {
          toFixedLength = 2;
        }
      });
      return parseFloat(str).toFixed(toFixedLength);
    }
    return number;
  };

  return (
    <>
{/*
      <div className={css.numberLice}>
        <a className={css.remove} onClick={removeNumberLicense}>-</a>
        <span>{numberPaidLicense + numberMoreLicense}</span>
        <a className={css.add} onClick={addNumberLicense}>+</a>
      </div>
*/}
      <div style={{textAlign: 'center'}}>
        <Icon id="userMdId" name='user md' size='huge'/>
      </div>
      <div style={{ marginTop: '18px' }}>
        <div className={cx(css.listAddOne, css.Title)}>
          <div className={css.addOne}>
            <span>{_l`Type`}</span>
          </div>
          <div className={css.activated}>
            <span>{_l`Activated`}</span>
          </div>
          <div className={css.activated}>
            <span>{_l`Price per unit`}</span>
          </div>
        </div>
        {listAddOn.map((addOne, index) => {
          return (
            <div className={cx(css.listAddOne)} key={index}>
              <div className={css.addOne}>
                <Popup
                  style={{ fontSize: '11px' }}
                  content={<div dangerouslySetInnerHTML={{ __html: addOne.tooltip }} />}
                  position={'left center'}
                  trigger={<span>{addOne.packageName}</span>}
                />
              </div>
              <div className={css.activated}>
                <div
                  onClick={() => selectAddOn(addOne)}
                  className={
                    __extraPackage[addOne.field]
                      ? otherCss.setDone
                      : addOnSelecteds[addOne.field]
                        ? otherCss.notSetasDone
                        : otherCss.btn
                  }
                >
                  <div />
                </div>
              </div>
              <div className={css.activated}>
                <strong>
                  {customParseFloat(addOne.price[currency])} {`${iconMoney[currency]} ${addOne.unit}`}
                </strong>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Licenses;

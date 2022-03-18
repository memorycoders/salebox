/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { Divider } from 'semantic-ui-react';
import moment from 'moment';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import css from './style.css';
import other from '../BillingInfo/billing.css';
import { iconMoney } from '../../../../Constants';


const BillingModal = (props) => {
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
    <ModalCommon
      title={_l`Success`}
      visible={props.visible}
      okHidden={true}
      scrolling={false}
      onClose={props.onClose}
      paddingAsHeader
      size={'small'}
      className={css.modal}
    >
      <p>{_l`Thank you for subscribing to Salesbox`}</p>
      <p>{_l`The subscription fee will be withdrawn at the invoice date. You will receive a receipt via email at the invoice date.`}</p>
      <Divider />
      <div className={other.item}>
        <span>{_l`Billing date`}</span>
        <strong>{moment(props.invoiceDate).format('DD MMM YYYY')}</strong>
      </div>
      <div className={other.item}>
        <span>{_l`No. of users`}</span>
        <strong>{props.totalQuatity}</strong>
      </div>
      <div className={other.item}>
        <span>{_l`Subscription fee`}</span>
        <strong>
          {customParseFloat(props.unitPrice)} {`${iconMoney[props.currency]} / ${props.period}`}
        </strong>
      </div>
      <div className={other.item}>
        <span>{_l`VAT`}</span>
        <strong>{props.vatPercent}</strong>
      </div>
      <div className={other.item}>
        <span>{_l`Discount`}</span>
        <strong>{props.discountPercent}%</strong>
      </div>
      <div className={other.item}>
        <span>{_l`Total`}</span>
        <strong>
          {customParseFloat(props.total)} {`${iconMoney[props.currency]}`}
        </strong>
      </div>
    </ModalCommon>
  );
};
export default BillingModal;

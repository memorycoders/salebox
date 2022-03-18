/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { Button, Dropdown, Form, Input, Message } from 'semantic-ui-react';
import valid from 'card-validator';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';
import css from './card.css';
import { Endpoints } from '../../../../Constants';
import api from '../../../../lib/apiClient';
import iconStripe from '../../../../../public/stripe.png';
import { Field } from 'redux-form';
import cssBilling from '../../Services/BillingInfo/billing.css';

const months = [
  { value: 1, text: '01' },
  { value: 2, text: '02' },
  { value: 3, text: '03' },
  { value: 4, text: '04' },
  { value: 5, text: '05' },
  { value: 6, text: '06' },
  { value: 7, text: '07' },
  { value: 8, text: '08' },
  { value: 9, text: '09' },
  { value: 10, text: '10' },
  { value: 11, text: '11' },
  { value: 12, text: '12' },
];
let listYear = [];
var currentYear = new Date().getFullYear();
for (var n = 0; n <= 10; n++) {
  listYear.push({ value: currentYear + n, text: currentYear + n });
}
const Card = ({
  card,
  error,
  setCard,
  setError,
  getCardType,
  putSuccess,
  getPaymentInfo,
  isConnectWithStripe,
  putError,
  submitting,
  setSubmitting,
}) => {
  const [invalidCard, setInvalidCard] = useState(false);

  const handleNumber = (e, { value }) => {
    const numberValidation = valid.number(value);
    if (numberValidation.isValid) {
      setCard({ ...card, number: value, type: numberValidation.card.type });
    } else {
      setCard({ ...card, number: value });
    }
  };
  const validate = () => {
    const error = {};
    let isValid = true;
    error.expiryDateInvalid = false;

    if (!card.number) {
      isValid = false;
      error.cardNumberRequired = true;
    }
    if (card.number && !valid.number(card.number).isValid) {
      isValid = false;
      error.cardNumberInvalid = true;
    }

    if (!card.holderName) {
      isValid = false;
      error.nameCardRequired = true;
    }
    if (!card.cscCode) {
      isValid = false;
      error.codeCardRequired = true;
    }
    if (!card.type) {
      isValid = false;
      error.cardNumberInvalid = true;
    }
    if (!card.expiredMonth || !card.expiredYear) {
      isValid = false;
      error.expiryDateRequired = true;
    }
    if (isNaN(card.expiredMonth) || isNaN(card.expiredYear) || card.expiredMonth < 1 || card.expiredMonth > 12) {
      isValid = false;
      error.expiryDateInvalid = true;
      error.messageExpiry = _l`Expiry date is invalid`;
    }
    if (card.expiredMonth < new Date().getMonth() + 1 && card.expiredYear <= new Date().getFullYear()) {
      isValid = false;
      error.expiryDateInvalid = true;
      error.messageExpiry = _l`Your card's expiration month is invalid.`;
    }
    setError(error);
    return isValid;
  };

  const updateCard = async () => {
    if (validate()) {
      const cardDTO = {
        type: getCardType(card.type),
        holderName: card.holderName,
        number: card.number,
        cscCode: card.cscCode,
        expiredMonth: card.expiredMonth,
        expiredYear: card.expiredYear,
      };
      try {
        const res = await api.post({
          resource: `${Endpoints.Enterprise}/payment/card/update`,
          // resource: `enterprise-v3.1/payment/card/update`,
          data: cardDTO,
        });
        if (res) {
          putSuccess('success', '', 2000);
          getPaymentInfo();
        }
        setSubmitting(false);
      } catch (error) {
        console.log(error);
        if (error?.errorMessage === 'STRIPE_ERROR') {
          setInvalidCard(error?.additionInfo);
          setSubmitting(false);
          return;
        }
        if (error.message) {
          putError(error.message);
        }
      }
    }
    setSubmitting(false);
  };
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img src={iconStripe} style={{ maxWidth: '90%', height: '80px' }} />
      </div>
      <div className="appointment-add-form" style={{ marginTop: '20px' }}>
        <Form className="position-unset">
          <Form.Group className="unqualified-fields">
            <div className={`${css.label} unqualified-label`}>
              {_l`Card number`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={card.number} onChange={handleNumber} placeholder={card.numberInit || ''} />
              {error.cardNumberRequired && <span className="form-errors">{_l`Card number is required`}</span>}
              {!error.cardNumberRequired && error.cardNumberInvalid && (
                <span className="form-errors">{_l`Card number invalid`}</span>
              )}
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className={`unqualified-label ${css.label}`}>
              {_l`Name of card holder`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={card.holderName} onChange={(e, { value }) => setCard({ ...card, holderName: value })} />
              {error.nameCardRequired && <span className="form-errors">{_l`Card name is required`}</span>}
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className={`unqualified-label ${css.label}`}>
              {_l`Csc code`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <Input value={card.cscCode || ''} onChange={(e, { value }) => setCard({ ...card, cscCode: value })} />
              {error.codeCardRequired && <span className="form-errors">{_l`CSC code is required`}</span>}
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className={`unqualified-label ${css.label}`}>
              {_l`Expiry date`}
              <span className="required">*</span>
            </div>
            <div className="dropdown-wrapper">
              <div style={{ display: 'flex', flex: 1, width: '100%', justifyContent: 'space-between' }}>
                {/*
                <Input
                  style={{ width: '48%' }}
                  value={card.expiredMonth || ''}
                  onChange={(e, { value }) => setCard({ ...card, expiredMonth: isNaN(value )? null : Math.round(value) })}
                />
                <Input
                  style={{ width: '50%' }}
                  value={card.expiredYear || ''}
                  onChange={(e, { value }) => setCard({ ...card, expiredYear:  isNaN(value )? null : Math.round(value) })}
                />
*/}
                <Dropdown
                  // autoFocus
                  value={card.expiredMonth}
                  onChange={(e, { value }) => setCard({ ...card, expiredMonth: value })}
                  // lazyLoad
                  // className={css.countryDropdown}
                  style={{ width: '48%', minWidth: 'unset' }}
                  // labeled
                  placeholder={_l`Select month`}
                  selection
                  options={months}
                />
                <Dropdown
                  // autoFocus
                  value={card.expiredYear}
                  onChange={(e, { value }) => setCard({ ...card, expiredYear: value })}
                  // lazyLoad
                  // className={css.countryDropdown}
                  style={{ width: '50%', minWidth: 'unset' }}
                  // labeled
                  placeholder={_l`Select year`}
                  selection
                  options={listYear}
                />
              </div>
              {error.expiryDateRequired && <span className="form-errors">{_l`Expiry date is required`}</span>}
              {!error.expiryDateRequired && error.expiryDateInvalid && (
                <span className="form-errors">{error.messageExpiry}</span>
              )}
            </div>
          </Form.Group>
        </Form>
        {/* {card.number && card.holderName && (
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <a className={css.btnCard} onClick={updateCard}>
              {isConnectWithStripe ? _l`Update card` : _l`Save card`}
            </a>
          </div>
        )} */}
        {invalidCard && (
          <p className="form-errors">{invalidCard}</p>
        )}
        <div
          // style={{textAlign: 'center', marginTop: 30, marginLeft: 50}}
          style={{ justifyContent: 'center', marginTop: 30, marginLeft: 50 }}
          className={cssBilling.listAction}
        >
          {/*<a className={css.btnCard} onClick={updateCard}>*/}
          {/*{isConnectWithStripe ? _l`Update card` : _l`Save card`}*/}
          {/*</a>*/}
          <Button
            type="submit"
            fluid
            disabled={submitting}
            loading={submitting}
            className={cssBilling.btnCard}
            onClick={() => {
              setInvalidCard(null);
              setSubmitting(true);
              updateCard();
            }}
          >
            {isConnectWithStripe ? _l`Update card` : _l`Save card`}
          </Button>
        </div>
      </div>
    </>
  );
};
export default connect(null, {
  putSuccess: NotificationActions.success,
  putError: NotificationActions.error,
})(Card);

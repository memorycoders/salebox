/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import _l from 'lib/i18n';
import { Input, Message, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';
import css from './billing.css';
import iconCard from '../../../../../public/shopping.svg';
import * as NotificationActions from 'components/Notification/notification.actions';
import { connect } from 'react-redux';
import { Endpoints, iconMoney } from '../../../../Constants';
import api from '../../../../lib/apiClient';
import ConfirmModal from '../../../Common/Modal/ConfirmModal';
import InvoiceModal from '../InvoiceModal';
import cssBilling from '../../Services/BillingInfo/billing.css';
// import iconCard from '../../../../../public/cart.png';


const BillingInfo = ({
  invoiceDate,
  unitPrice,
  currency,
  period,
  currentQuantity,
  numberMoreLicense,
  totalQuatity,
  subTotal,
  discountPercent,
  vatPercent,
  total,
  totalQuatityMessege,
  isConnectWithStripe,
  card,
  subscribe,
  error,
  setCoupon,
  coupon,
  subscribeMaestrano,
  maestranoUserId,
  putSuccess,
  initData,
  pendingCancel,
  putError,
  submitting,
  setSubmitting,
  isAcademy = false,
  setDiscountPercent,
  errorCardInfo,
}) => {
  const [confirmModal, setConfirmModal] = useState({ status: false, title: '', fnOk: null, fnCancel: null });
  const [showModal, setShowModal] = useState(false);
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [durationDiscount, setDurationDiscount] = useState(null);

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

  const cancelSubscription = async () => {
    const _modal = {
      status: true,
      title: _l`Do you really want to cancel?`,
      fnOk: async () => {
        // setSubmitting(true);
        try {
          const res = await api.post({
            resource: `${Endpoints.Enterprise}/payment/stripe/cancel`,
          });
          if (res) {
            setConfirmModal({ status: false });
            // putSuccess('success', '', 2000);
            putSuccess(
              _l`The subscription has now been canceled. Even if canceled it will still be possible to access until ${
                res.cancellingDate ? _l`${moment(res.cancellingDate).format('DD MMM, YYYY')}:t(d)` : ''
              }`,
              'success',
              null,
              true
            );

            initData();
          }
        } catch (error) {
          if (error.message) {
            putError(error.message);
          }
          console.log(error);
        }
        // setSubmitting(false);
      },
      fnCancel: () => {
        setConfirmModal({ status: false });
      },
    };
    setConfirmModal(_modal);
    // setSubmitting(false);
  };

  const openReceipt = () => {
    setShowModal(true);
  };

  const checkCoupon = async (e) => {
    let couponValue = e.target.value;
    if (couponValue) {
      try {
        const res = await api.get({
          // resource: `/enterprise-v3.1/payment/checkCoupon`,
          resource: `${Endpoints.Enterprise}/payment/checkCoupon`,
          query: {
            coupon: couponValue,
          },
        });
        if (res) {
          if (res.percentOff && setDiscountPercent) {
            setDiscountPercent(res.percentOff);
            setDurationDiscount(res.durationInMonths);
          }
          if (!res.percentOff && setDiscountPercent) {
            setDiscountPercent(0);
            setDurationDiscount(null);
          }
        }
      } catch (error) {
        if (error.message === 'INVALID_COUPON') {
          setInvalidCoupon(true);
          setDiscountPercent(0);
          setDurationDiscount(null);
        }
      }
    } else {
      setDiscountPercent(0);
      setDurationDiscount(null);
    }
  };
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img src={iconCard} style={{ width: '130px', height: '50px', marginRight: 40, marginTop: 24 }} />
        {/* <Icon name='shopping cart' size='massive' color="grey"/> */}
      </div>
      <div className={css.main}>
        {totalQuatityMessege !== 0 && (
          <Message negative>
            {totalQuatityMessege === 2 && <p>{_l`Number of licenses must be equal or greater than active users`}</p>}
            {totalQuatityMessege === 1 && <p>{_l`The total subscribers must be greater than 1 and less than 999`}</p>}
          </Message>
        )}
        {error.numberMoreLicenseZero && (
          <Message negative>
            <p>{_l`Please update number license`}</p>
          </Message>
        )}
        <div className={css.item}>
          <span>{_l`Billing date`}</span>
          <strong>{moment(invoiceDate).format('DD MMM YYYY')}</strong>
        </div>
        <div className={css.item}>
          <span>{_l`Unit price`}</span>
          <strong>
            {customParseFloat(unitPrice)} {`${iconMoney[currency]} / ${period}`}
          </strong>
        </div>
        <div className={css.item}>
          <span>{_l`Current Quantity`}</span>
          <strong>{currentQuantity}</strong>
        </div>
        <div className={css.item}>
          <span>{_l`Added`}</span>
          <strong>{numberMoreLicense}</strong>
        </div>
        <div className={css.item}>
          <span>{_l`Total Quantity`}</span>
          <strong>{totalQuatity}</strong>
        </div>
        <div className={css.item}>
          <span>{_l`Subtotal`}</span>
          <strong>
            {customParseFloat(subTotal)} {`${iconMoney[currency]}`}
          </strong>
        </div>
        <div className={css.item}>
          <span>{_l`Discount`}</span>
          <strong>
            {discountPercent ? discountPercent : 0}{`%`}
          </strong>
        </div>
        {durationDiscount && (
          <div className={css.item}>
            <span>{_l`Discounted months`}</span>
            <strong>{durationDiscount + ' ' + _l`months`}</strong>
          </div>
        )}
        <div className={css.item}>
          <span>{_l`VAT`}</span>
          <strong>{vatPercent}%</strong>
        </div>
        <div className={css.item}>
          <span>{_l`Total`}</span>
          <strong>
            {customParseFloat(total)} {`${iconMoney[currency]}`}
          </strong>
        </div>
        <div className={css.item}>
          <span>{_l`Coupon`}</span>
          <Input
            value={coupon || ''}
            onBlur={checkCoupon}
            onChange={(e, { value }) => {
              setCoupon(value);
              setInvalidCoupon(false);
            }}
          />
        </div>
        {invalidCoupon && <p className="form-errors">{_l`Invalid coupon`}</p>}
        {errorCardInfo && <p className="form-errors">{errorCardInfo}</p>}
        {isAcademy ? (
          <div className={css.listAction} style={{ justifyContent: 'center' }}>
            <Button
              type="submit"
              fluid
              disabled={submitting}
              loading={submitting}
              className={cssBilling.btnCard}
              onClick={() => {
                setSubmitting(true);
                if (!maestranoUserId) subscribe();
                if (maestranoUserId) subscribeMaestrano();
              }}
            >
              {isConnectWithStripe ? _l`Order` : _l`Order`}
            </Button>
          </div>
        ) : (
          <div className={css.listAction}>
            {/*
          <a
            className={css.btnCard}
            onClick={() => {
              if (!maestranoUserId) subscribe();
              if (maestranoUserId) subscribeMaestrano();
            }}
          >
            {isConnectWithStripe ? _l`Update` : _l`Subscribe`}
          </a>
          {isConnectWithStripe && !pendingCancel && (
            <a onClick={cancelSubscription} className={css.btnCard}>{_l`Cancel`}</a>
          )}
          <a className={css.btnCard} onClick={openReceipt}>{_l`Receipt`}</a>
*/}

            <Button
              type="submit"
              fluid
              disabled={submitting}
              loading={submitting}
              className={cssBilling.btnCard}
              onClick={() => {
                setSubmitting(true);
                if (!maestranoUserId) subscribe();
                if (maestranoUserId) subscribeMaestrano();
              }}
            >
              {isConnectWithStripe ? _l`Update` : _l`Subscribe`}
            </Button>

            {isConnectWithStripe && !pendingCancel && (
              <Button
                type="submit"
                fluid
                // disabled={submitting} loading={submitting}
                className={cssBilling.btnCard}
                onClick={() => {
                  cancelSubscription();
                }}
              >
                {_l`Cancel Transaction`}
              </Button>
            )}
            <Button
              type="submit"
              fluid
              // disabled={submitting} loading={submitting}
              className={cssBilling.btnCard}
              onClick={() => {
                openReceipt();
              }}
            >
              {_l`Receipt`}
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        visible={confirmModal.status}
        fnOk={confirmModal.fnOk}
        fnCancel={confirmModal.fnCancel}
        title={confirmModal.title}
      />

      <InvoiceModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
export default connect(null, {
  putSuccess: NotificationActions.success,
  putError: NotificationActions.error,
})(BillingInfo);

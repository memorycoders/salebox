import React from 'react';
import _l from 'lib/i18n';
import {Button, Input, Message} from 'semantic-ui-react';
import moment from 'moment';
import css from './billing.css';
import * as NotificationActions from 'components/Notification/notification.actions';
import {connect} from 'react-redux';
import cx from 'classnames';
import iconCard from '../../../../../public/shopping.svg';
import { iconMoney } from '../../../../Constants';


const numberWithCommas = (x) => {
  return x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
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
                       // isConnectWithStripe,
                       // card,
                       subscribe,
                       error,
                       setCoupon,
                       coupon,
                       // subscribeMaestrano,
                       // maestranoUserId,
                       putSuccess,
                       // initData,
                       // pendingCancel,

                       paymentAssistance,
                       onChangeAmountOfOnlineTraining,
                       onChangeAmountOfDataImport,
                       serviceSelecteds,
                       submitOrder,
                       submitting,
                       setSubmitting
                     }) => {
/*
  const [confirmModal, setConfirmModal] = useState({status: false, title: '', fnOk: null, fnCancel: null});
*/
  const customParseFloat = (number, fixedLength:0) => {
    if (isNaN(parseFloat(number)) === false) {
      let toFixedLength = 0;
      const str = String(number);

      ['.', ','].forEach((seperator) => {
        const arr = str.split(seperator);
        if (arr.length === 2) {
          toFixedLength = fixedLength;
        }
      });
      return parseFloat(str).toFixed(toFixedLength);
    }
    return number;
  };
/*

  const cancelSubscription = async () => {
    const _modal = {
      status: true,
      title: _l`Do you really want to cancel?`,
      fnOk: async () => {
        try {
          const res = await api.post({
            resource: `${Endpoints.Enterprise}/payment/stripe/cancel`,
          });
          if (res) {
            setConfirmModal({status: false});
            putSuccess('success', '', 2000);
            initData();
          }
        } catch (error) {
          console.log(error);
        }
      },
      fnCancel: () => {
        setConfirmModal({status: false});
      },
    };
    setConfirmModal(_modal);
  };
*/

  return (
    <>
      <div style={{textAlign: 'center'}}>
        {/*<img src={iconCard} style={{maxWidth: '90%', height: '75px'}}/>*/}
        <img src={iconCard} style={{ width: '130px', height: '50px', marginRight: 40, marginTop: 24 }} />
      </div>
      <div className={css.main}>
{/*        {totalQuatityMessege !== 0 && (
          <Message negative>
            {totalQuatityMessege === 2 && <p>{_l`Number of licenses must be equal or greater than active users`}</p>}
            {totalQuatityMessege === 1 && <p>{_l`The total subscribers must be greater than 1 and less than 999`}</p>}
          </Message>
        )}*/}
        {error.isError && (
          <Message negative>
            <p>{error.message}</p>
          </Message>
        )}

        <table  striped bordered hover style={{width: '100%'}}>
        <tbody>

          <tr>
            <td><span>{_l`Billing date`}</span></td>
            <td className={cx(css.textBold, css.textRight)} colSpan="3">
              <strong>{moment(invoiceDate).format('DD MMM YYYY')}</strong>
            </td>
          </tr>

          <tr>
            <td className={cx(css.textBold, css.textLeft)}
                style={{paddingTop: '15px', borderTop: 'none'}}>{_l`Type`}</td>
            <td className={cx(css.textBold, css.textCenter)}
                style={{paddingTop: '15px', borderTop: 'none', width: '20%'}}>{_l`Amount`}
            </td>
            <td className={cx(css.textBold, css.textCenter)}
                style={{paddingTop: '15px', borderTop: 'none'}}>{_l`Price`}</td>
            <td className={cx(css.textBold, css.textRight)}
                style={{paddingTop: '15px', borderTop: 'none', minWidth: '80px'}}>{_l`Subtotal`}
            </td>
          </tr>
          <tr>
            <td >Online training</td>
            <td>
              {/*              <input type="text" className="text-right no-border" ng-disabled="!serviceSelecteds['onlineTrainingId']"
                       style="min-width: 30px;width: 100%;" onKeyPress="return isNumber(event)" min="0"
                       ng-model="paymentAssistance.amountOfOnlineTraining" ng-change="onchangeAmountService()">*/}
              <Input
                fluid
                disabled={!serviceSelecteds['onlineTrainingId']}
                type="number"
                value={paymentAssistance.amountOfOnlineTraining}
                className={cx(css.noBorder, css.textRight)}
                onChange={onChangeAmountOfOnlineTraining}
              />
            </td>
            <td className={css.textRight}>
              <span>{
                numberWithCommas(paymentAssistance.onlineTrainingDTO.service.price[currency] || 0)}</span> {`${iconMoney[currency]}`}
            </td>
            <td className={cx(css.textBold, css.textRight)}>
              <span>{numberWithCommas(paymentAssistance.onlineTrainingDTO.subTotal || 0)} </span> {`${iconMoney[currency]}`}
            </td>
          </tr>
          <tr>
            <td >Data migration</td>
            <td>
              {/*
              <input type="text" className="text-right no-border" ng-disabled="!serviceSelecteds['dataImportId']"
                       style="min-width: 30px;width: 100%;" onKeyPress="return isNumber(event)" min="0"
                       ng-model="paymentAssistance.amountOfDataImport" ng-change="onchangeAmountService()">
*/}
              <Input
                fluid
                disabled={!serviceSelecteds['dataImportId']}
                type="number"
                value={paymentAssistance.amountOfDataImport}
                className={cx(css.noBorder, css.textRight)}
                onChange={onChangeAmountOfDataImport}
              />
            </td>
            <td className={css.textRight}>
              <span>{numberWithCommas(paymentAssistance.dataImportDTO.service.price[currency] || 0)}</span> {`${iconMoney[currency]}`}
            </td>
            <td className={cx(css.textBold, css.textRight)}>
              <span>{numberWithCommas(paymentAssistance.dataImportDTO.subTotal || 0)} </span> {`${iconMoney[currency]}`}
            </td>
          </tr>

          <tr>
            <td className={css.paddingRowOnlyText}>{_l`Subtotal`}</td>
            <td></td>
            <td className={cx(css.textBold, css.textRight)} colSpan="2">{numberWithCommas(paymentAssistance.subTotal || 0)} {`${iconMoney[currency]}`}
            </td>
          </tr>

          <tr>
            <td  className={css.paddingRowOnlyText}>{_l`VAT`}</td>
            <td className={cx(css.textBold, css.textRight)}>{vatPercent}%</td>
            <td className={cx(css.textBold, css.textRight)} colSpan="2">{numberWithCommas(customParseFloat(paymentAssistance.subTotalVAT , 2))} {`${iconMoney[currency]}`}
            </td>
          </tr>
          <tr>
            <td  className={css.paddingRowOnlyText}>{_l`Total`}</td>
            <td></td>
            <td className={cx(css.textBold, css.textRight, css.textRed)} colSpan="2">{numberWithCommas(customParseFloat(paymentAssistance.total , 2))} {`${iconMoney[currency]}`}
            </td>
          </tr>
        </tbody>

        </table>
{/*
        <button className="btn btn-success btn-block center-block text-bold"
                ng-click="submitOrder()"
                style="line-height: 40px; margin-top: 30px;">
          Order
        </button>
*/}


        <div className={css.listAction} style={{justifyContent: 'center'}}>
          <Button type="submit" fluid disabled={submitting} loading={submitting}
                  className={css.btnCard}
                  onClick={() => {
                    setSubmitting(true);
                    submitOrder();
                  }}
          >
            {_l`Order`}
          </Button>
          {/*<a*/}
            {/*className={css.btnCard}*/}
            {/*onClick={() => {*/}
              {/*setSubmitting(true);*/}
              {/*submitOrder();*/}
            {/*}}*/}
          {/*>{_l`Order`}</a>*/}
{/*          {isConnectWithStripe && !pendingCancel && (
            <a onClick={cancelSubscription} className={css.btnCard}>{_l`Cancel`}</a>
          )}
          <a className={css.btnCard}>{_l`Receipt`}</a>*/}
        </div>
      </div>
{/*

      <ConfirmModal
        visible={confirmModal.status}
        fnOk={confirmModal.fnOk}
        fnCancel={confirmModal.fnCancel}
        title={confirmModal.title}
      />
*/}
    </>
  );
};
export default connect(null, {
  putSuccess: NotificationActions.success,
})(BillingInfo);

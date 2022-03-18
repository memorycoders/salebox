import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import BillingPane from '../Pane';
import BillingInfo from '../Subscriptions/BillingInfo';
import _l from 'lib/i18n';
import Licenses from './Licenses';
import ListUser from './ListUser/ListUser';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';
import * as NotificationActions from '../../Notification/notification.actions';
import { checkVAT, countries } from 'jsvat';
import CommonBilling from '../Subscriptions/common';

export const SalesAcademy = (props) => {
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [numberPaidLicense, setNumberPaidLicense] = useState(0);
  const [numberMoreLicense, setNumberMoreLicense] = useState(0);
  const [listUser, setListUser] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [vatPercent, setVatPercent] = useState(0);
  const [totalQuatityMessege, setTotalQuatityMessege] = useState(0);
  const [isConnectWithStripe, setConnectWithStripe] = useState(false);
  const [card, setCard] = useState({});
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState({});
  const [pendingCancel, setPendingCancel] = useState(false);
  const [submittingSubscribe, setSubmittingSubscribe] = useState(false);
  const [period, setPeriod] = useState('Year');
  const [company, setCompany] = useState({});

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    // getPackageInfo();
    getUserUsingAcademy();
    // getPaymentInfo();
    getCompanyInfo();
    getCardInfo();
    // asyncListUser();
  };
  // const getPackageInfo = async () => {
  //   try {
  //     const res = await api.get({
  //       resource: `${Endpoints.Enterprise}/payment/getPackageInfo`,
  //     });
  //     if (res) {
  //       setNumberPaidLicense(res.mainSubscription?.numberPaidLicense || 0);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getUserUsingAcademy = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/stripe/getPaymentInfoVideoAcademy`,
      });
      if (res) {
        setListUser(res.userAcademyPermissionDTOList);
        setNumberPaidLicense(res.numberPaidLicense || 0);
      }
    } catch (error) {}
  };
  const getCardInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/card/get`,
      });
      if (res)
        setCard({
          ...res,
          numberInit: res.number,
          number: undefined,
          expiredMonth: res.expiredMonth == 0 ? undefined : res.expiredMonth,
          expiredYear: res.expiredYear == 0 ? undefined : res.expiredYear,
        });
    } catch (error) {
      console.log(error);
    }
  };
  // const asyncListUser = async () => {
  //   try {
  //     const res = await api.get({
  //       resource: `${Endpoints.Enterprise}/user/listUserLite`,
  //     });
  //     if (res && res.userLiteDTOList) {
  //       setUserList(res.userLiteDTOList);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const SEKCountries = CommonBilling.SEKCountries;
  const EURCountries = CommonBilling.EURCountries;
  const populateDefaultCurrencyByCountry = (country) => {
    if (!country || country.length === 0) {
      setCurrency('USD');
      return;
    }
    if (SEKCountries.includes(country)) {
      setCurrency('SEK');
      return;
    }
    if (EURCountries.includes(country)) {
      setCurrency('EUR');
      return;
    }
    setCurrency('USD');
  };

  const populateDefaultCurrency = (currency, country) => {
    if (currency === 'NO_FIXED_CURRENCY') {
      populateDefaultCurrencyByCountry(country);
      return;
    }
    setCurrency(currency);
  };
  const validation = () => {
    const error = {};
    let isValid = true;
    const currentQuantity = numberPaidLicense || 0;
    const totalQuatity = parseInt(currentQuantity) + parseInt(numberMoreLicense);
    if (numberMoreLicense === 0 && totalQuatity === 0) {
      isValid = false;
      error.numberMoreLicenseZero = true;
    }
    if (totalQuatity < listUser.filter((e) => e.marked).length) {
      isValid = false;
      setTotalQuatityMessege(2);
    }
    // if (!card.number) {
    //   isValid = false;
    //   error.cardNumberRequired = true;
    // }
    // if (card.number && !valid.number(card.number).isValid) {
    //   isValid = false;
    //   error.cardNumberRequired = true;
    // }

    // if (!card.holderName) {
    //   isValid = false;
    //   error.nameCardRequired = true;
    // }
    // if (!card.cscCode) {
    //   isValid = false;
    //   error.codeCardRequired = true;
    // }
    // if (!card.type) {
    //   isValid = false;
    //   error.cardNumberInvalid = true;
    // }
    setError(error);
    return isValid;
  };
  const validationMaestrano = () => {
    const error = {};
    let isValid = true;
    if (numberMoreLicense === 0 && totalQuatity === 0) {
      isValid = false;
      error.numberMoreLicenseZero = true;
    }
    if (totalQuatity > 999) {
      isValid = false;
      setTotalQuatityMessege(1);
    }
    if (totalQuatity < listUser.filter((e) => e.marked).length) {
      isValid = false;
      setTotalQuatityMessege(2);
    }
    setError(error);
    return isValid;
  };
  const businessItem = {
    period: 'Year',
    package: 'Ultimate',
    price: {
      USD: 24,
      EUR: 24,
      SEK: 240,
    },
  };
  const calculateAmount = () => {
    let unitPrice = (businessItem.price && businessItem.price[currency]) || 0;
    const currentQuantity = numberPaidLicense || 0;
    const totalQuatity = parseInt(currentQuantity) + parseInt(numberMoreLicense);
    const subTotal = unitPrice * totalQuatity;
    let total = subTotal + (subTotal * parseInt(vatPercent)) / 100;
    if (discountPercent) {
      total = (total * (100 - discountPercent)) / 100;
    }
    return {
      unitPrice,
      currentQuantity,
      totalQuatity,
      subTotal,
      total,
    };
  };
  const { unitPrice, currentQuantity, totalQuatity, subTotal, total } = calculateAmount();

  const removeNumberLicense = () => {
    if (numberMoreLicense > 0) {
      let num = numberMoreLicense - 1;
      setNumberMoreLicense(num);
    }
  };

  const addNumberLicense = () => {
    let num = numberMoreLicense + 1;
    setNumberMoreLicense(num);
  };
  const subscribe = () => {
    if (validation()) {
      // processPayment();
      processCardInfo();
    } else {
      console.log('errror');
      setSubmittingSubscribe(false);
    }
  };
  const subscribeMaestrano = async () => {
    if (validationMaestrano()) {
      try {
        const res = await api.get({
          resource: `${Endpoints.Enterprise}/createSubscriptionMaestrano`,
          query: {
            numberPaidLicense: totalQuatity,
            packageType: 'ULTIMATE_MONTHLY',
            currency,
          },
        });
        if (res === 'SUCCESS') {
          props.putSuccess('Success', '', 2000);
        }
      } catch (error) {
        if (error.message) {
          if (error.message == 'CURRENT_SUBSCRIPTION_IS_CANCELLED') {
            props.putError(
              _l`You already have an active subscription that has been canceled. You can activate it again on ${moment(
                invoiceDate
              ).format('DD MMM YYYY')}"`,
              null,
              null,
              true
            );
          } else {
            props.putError(error.message);
          }
        }
        console.log('e');
      }
    }
    setSubmittingSubscribe(false);
  };
  const getCardType = (name) => {
    switch (name) {
      case 'visa':
        return 'VISA';
        break;
      case 'mastercard':
        return 'MASTERCARD';
        break;
      case 'american-express':
        return 'AMERICAN_EXPRESS';
        break;
      case 'discover':
        return 'DISCOVER';
        break;
    }
    return 'NONE';
  };
  const salesboxPackage = {
    USD: 'plan_GsnDbqySIsUaOb',
    EUR: 'plan_GsnEyvVOxYxWuz',
    SEK: 'SalesboxMonthlySEK',
  };
  const getCompanyInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/company/get`,
      });
      if (res) {
        populateVat(res);
        if (res.stripeCustomerId) {
          setConnectWithStripe(true);
        }
        setCompany(res);
      }
      const billinCurrency = await api.get({
        resource: `${Endpoints.Enterprise}/payment/getBillingCurrency`,
      });
      if (billinCurrency) {
        populateDefaultCurrency(billinCurrency, res.country);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPaymentInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/getAllPaymentInfo`,
      });
      if (res) {
        let paid = 0;
        let nextBillingDate = new Date();
        let discount = 0;
        res.subscriptionLiteDTOList.forEach((subscription) => {
          if (subscription.source === 'STRIPE') {
            paid = subscription.numberPaidLicense || 0;
            nextBillingDate = subscription.nextBillingDate;
            discount = subscription.discountPercent;
          }
        });
        setNumberPaidLicense(paid);
        setInvoiceDate(nextBillingDate);
        setDiscountPercent(discount);
        setPendingCancel(res.pendingCancel);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const processCardInfo = async () => {
    const dto = {
      vatPercent: vatPercent,
      numberLicense: totalQuatity,
    };
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/payment/stripe/purchaseVideoAcademy`,
        data: dto,
      });
      if (res) {
        props.putSuccess('Success', '', 2000);
        updateUserUsingVideoAcademy();
        // setShowModal(true);
        setConnectWithStripe(true);
        setTimeout(() => {
          setNumberMoreLicense(0);
          // getPaymentInfo();
          // getPackageInfo();
          initData();
        }, 5000);
      }
    } catch (error) {
      if (error.message) {
        if (error.message == 'CURRENT_SUBSCRIPTION_IS_CANCELLED') {
          props.putError(
            _l`You already have an active subscription that has been canceled. You can activate it again on ${moment(
              invoiceDate
            ).format('DD MMM YYYY')}`,
            null,
            null,
            true
          );
        } else {
          props.putError(error.message);
        }
      }
      console.log('e');
    }
    setSubmittingSubscribe(false);
  };

  const updateUserUsingVideoAcademy = async () => {
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/updateUserUsingVideoAcademy`,
        data: {
          userAcademyPermissionDTOList: listUser,
        },
      });
    } catch (e) {}
  };
  const toggleActive = (userId) => {
    let totalLicenses = numberPaidLicense + numberMoreLicense;
    let totalUserMarked = listUser.filter((e) => e.marked).length;
    let user = listUser.find((e) => e.userId === userId);
    if (!user?.marked) {
      if (totalLicenses > totalUserMarked) {
        let index = listUser.findIndex((e) => e.userId === userId);
        let newList = [
          ...listUser.slice(0, index),
          { userId: userId, marked: !user.marked },
          ...listUser.slice(index + 1, listUser.length),
        ];
        setListUser(newList);
      }
    } else {
      let index = listUser.findIndex((e) => e.userId === userId);
      let newList = [
        ...listUser.slice(0, index),
        { userId: userId, marked: !user.marked },
        ...listUser.slice(index + 1, listUser.length),
      ];
      setListUser(newList);
    }
  };
  const isEurope = (country) => {
    const europe = [
      'Austria',
      'Belgium',
      'Bulgaria',
      'Croatia',
      'Cyprus',
      'Czech Republic',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Sweden',
      'Germany',
      'Greece',
      'Hungary',
      'Ireland',
      'Italy',
      'Lithuania',
      'Luxembourg',
      'Latvia',
      'Malta',
      'Netherlands',
      'Poland',
      'Portugal',
      'Slovenia',
      'Slovakia',
      'Sweden',
      'Spain',
      'United Kingdom',
      'Romania',
    ];
    return _.includes(europe, country);
  };
  const populateVat = (company) => {
    if (!company) return;
    let vatNumberCorrect = false;
    const vatNumber = company.vat !== null ? company.vat : '';
    const country = company.country;
    let vatValue = 0;
    const europe = isEurope(country);
    if (europe && vatNumber.length > 0) {
      const countryCode = vatNumber.substring(0, 2);
      // const vatCode = vatNumber.substring(2, vatNumber.length);
      // const vatCodeCorrect = vatCode.replace(/-/g, "").replace(/ /g, "").replace(/\(/g, "").replace(/\)/g, "");
      const checkVatResult = checkVAT(vatNumber, countries);
      if (countryCode === 'SE') {
        vatValue = 25;
        if (checkVatResult.isValid && checkVatResult.country && checkVatResult.country.name === _.lowerCase(country)) {
          vatNumberCorrect = true;
        }
        setVatPercent(vatValue);
      } else {
        if (checkVatResult.isValid && checkVatResult.country && checkVatResult.country.name === _.lowerCase(country)) {
          vatNumberCorrect = true;
          vatValue = 0;
        } else {
          vatValue = 25;
        }
        setVatPercent(vatValue);
      }
    } else if (europe && vatNumber.length === 0) {
      vatValue = 25;
      setVatPercent(vatValue);
    } else {
      vatValue = 0;
      setVatPercent(0);
    }
  };
  return (
    <>
      <Grid columns={3}>
        <GridRow>
          <GridColumn>
            <BillingPane step={1} title={_l`Licenses`}>
              <Licenses
                addNumberLicense={addNumberLicense}
                removeNumberLicense={removeNumberLicense}
                numberPaidLicense={numberPaidLicense}
                numberMoreLicense={numberMoreLicense}
              />
            </BillingPane>
          </GridColumn>
          <GridColumn>
            <BillingPane step={2} title={_l`Users`}>
              <ListUser listUser={listUser} toggleActive={toggleActive} />
            </BillingPane>
          </GridColumn>
          <GridColumn>
            <BillingPane step={3} title={_l`Billing info`}>
              <BillingInfo
                invoiceDate={invoiceDate}
                unitPrice={unitPrice}
                currency={currency}
                period={period}
                currentQuantity={currentQuantity}
                numberMoreLicense={numberMoreLicense}
                totalQuatity={totalQuatity}
                subTotal={subTotal}
                discountPercent={discountPercent}
                vatPercent={vatPercent}
                total={total}
                totalQuatityMessege={totalQuatityMessege}
                isConnectWithStripe={isConnectWithStripe}
                card={card}
                subscribe={subscribe}
                coupon={coupon}
                setCoupon={setCoupon}
                error={error}
                subscribeMaestrano={subscribeMaestrano}
                maestranoUserId={props.maestranoUserId}
                initData={initData}
                pendingCancel={pendingCancel}
                submitting={submittingSubscribe}
                setSubmitting={setSubmittingSubscribe}
                isAcademy={true}
                setDiscountPercent={setDiscountPercent}
              />
            </BillingPane>
          </GridColumn>
        </GridRow>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({
  maestranoUserId: state.auth.user.maestranoUserId,
});

const mapDispatchToProps = {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesAcademy);

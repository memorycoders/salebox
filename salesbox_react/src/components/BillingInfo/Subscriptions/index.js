/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import _l from 'lib/i18n';
import _ from 'lodash';
import { checkVAT, countries } from 'jsvat';
import valid from 'card-validator';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import BillingPane from '../Pane';
import Licenses from './Licenses';
import Card from './Card';
import BillingInfo from './BillingInfo';
import { Endpoints, popupWindow } from '../../../Constants';
import CommonBilling from './common';
import api from '../../../lib/apiClient';

import BillingModal from './BillingModal';
import moment from 'moment';

const extraPackages = {
  OFFICE365_GOOGLE: 'OFFICE365_GOOGLE',
  MICROSOFT_TEAMS: 'MS_TEAM',
  DOCUMENT_STORAGE: 'DOCUMENT_STORAGE',
  LEAD_CLIPPER: 'LEAD_CLIPPER',
  MAIL_CHIMP: 'MAIL_CHIMP',
  FORT_NOX: 'FORT_NOX',
  WORDPRESS: 'WORDPRESS'
};

const salesboxPackage = {
  USD: 'plan_GsnDbqySIsUaOb',
  EUR: 'plan_GsnEyvVOxYxWuz',
  SEK: 'SalesboxMonthlySEK',
};

const businessList = CommonBilling.getBusinessList();
const extraBusinessList = CommonBilling.getExtraBusinessList();
const businessItem = {
  period: 'Month',
  package: 'Ultimate',
  price: {
    USD: 2.9,
    EUR: 2.9,
    SEK: 29,
  },
};
const SEKCountries = CommonBilling.SEKCountries;
const EURCountries = CommonBilling.EURCountries;

const Subscriptions = (props) => {
  const [currency, setCurrency] = useState('USD');
  const [period, setPeriod] = useState('Month');
  const [pack, setPackage] = useState('Ultimate');
  const [vatPercent, setVatPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [card, setCard] = useState({});
  const [userList, setUserList] = useState([]);
  const [totalQuatityMessege, setTotalQuatityMessege] = useState(0);
  const [isConnectWithStripe, setConnectWithStripe] = useState(false);
  const [company, setCompany] = useState({});
  const [coupon, setCoupon] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(false);

  const [numberMoreLicense, setNumberMoreLicense] = useState(0);
  const [numberPaidLicense, setNumberPaidLicense] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  const [addOnSelecteds, setAddOneSelecteds] = useState({});
  const [__extraPackage, setExtraPackage] = useState({});

  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingSubscribe, setSubmittingSubscribe] = useState(false);

  useEffect(() => {
    getPackageInfo();
  }, []);
  useEffect(() => {
    getPaymentInfo();
  }, []);
  useEffect(() => {
    getCompanyInfo();
  }, []);
  useEffect(() => {
    getCardInfo();
  }, []);
  useEffect(() => {
    asyncListUser();
  }, []);
  const getPackageInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/getPackageInfo`,
      });
      if (res) {
        if (res.mainSubscription) {
          const newSelecteds = { ...addOnSelecteds };
          const newExtra = { ...__extraPackage };
          for (let i = 0; i < listAddOn.length; i++) {
            if (res.extraPackage.indexOf(listAddOn[i].packageType) !== -1) {
              newSelecteds[listAddOn[i].field] = newExtra[listAddOn[i].field] = {
                packageId: listAddOn[i].packageId[currency],
                packageList: listAddOn[i].packageId,
                priceList: listAddOn[i].price,
                price: listAddOn[i].price[currency],
              };
            }
          }
          setAddOneSelecteds(newSelecteds);
          setExtraPackage(newExtra);
          setNumberPaidLicense(res.mainSubscription.numberPaidLicense || 0);
        }
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

  const asyncListUser = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/user/listUserLite`,
      });
      if (res && res.userLiteDTOList) {
        setUserList(res.userLiteDTOList);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        if (checkVatResult.isValid && checkVatResult.country && _.lowerCase(checkVatResult.country.name) === _.lowerCase(country)) {
          vatNumberCorrect = true;
        }
        setVatPercent(vatValue);
      } else {
        if (checkVatResult.isValid && checkVatResult.country && _.lowerCase(checkVatResult.country.name) === _.lowerCase(country)) {
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

  const removeNumberLicense = () => {
    if (totalQuatity > userList.length) {
      const num = numberMoreLicense - 1;
      setNumberMoreLicense(num);
      if (parseInt(currentQuantity) + parseInt(num) < 999 && totalQuatityMessege == 1) {
        setTotalQuatityMessege(0);
      }
    } else {
      setTotalQuatityMessege(2);
    }
  };

  const addNumberLicense = () => {
    if (totalQuatity < 999) {
      const num = numberMoreLicense + 1;
      setNumberMoreLicense(num);
      if (parseInt(currentQuantity) + parseInt(num) >= userList.length && totalQuatityMessege == 2) {
        setTotalQuatityMessege(0);
      }
    } else {
      setTotalQuatityMessege(1);
    }
  };

  const selectAddOn = (addOn) => {
    const newSelected = { ...addOnSelecteds };
    const newExtra = { ...__extraPackage };
    if (!newSelected[addOn.field]) {
      newSelected[addOn.field] = {
        packageId: addOn.packageId[currency],
        packageList: addOn.packageId,
        priceList: addOn.price,
        price: addOn.price[currency],
      };
    } else {
      delete newSelected[addOn.field];
    }
    if (newExtra[addOn.field]) {
      delete newExtra[addOn.field];
    }
    setAddOneSelecteds(newSelected);
    setExtraPackage(newExtra);
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
    if (totalQuatity < userList.length) {
      isValid = false;
      error.numberLicenceNotEnough = true;
    }
    if (!card.numberInit && !card.number) {
      isValid = false;
      error.cardNumberRequired = true;
    }
    if (card.number && !valid.number(card.number).isValid) {
      isValid = false;
      error.cardNumberRequired = true;
    }

    if (!card.holderName) {
      isValid = false;
      error.nameCardRequired = true;
    }
    if (!card.numberInit && !card.cscCode) {
      isValid = false;
      error.codeCardRequired = true;
    }
    if (!card.type) {
      isValid = false;
      error.cardNumberInvalid = true;
    }
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
    if (totalQuatity < userList.length) {
      isValid = false;
      error.numberLicenceNotEnough = true;
    }
    if (totalQuatity > 999) {
      isValid = false;
      setTotalQuatityMessege(1);
    }
    if (totalQuatity < userList.length) {
      isValid = false;
      setTotalQuatityMessege(2);
    }
    setError(error);
    return isValid;
  };

  const subscribe = () => {
    if (validation()) {
      console.log('Process Payment');
      // processPayment();
      processCardInfo();
    } else {
      console.log('errror');
      setSubmittingSubscribe(false);
    }
  };

  const processPayment = async () => {
    const paymentDTO = {
      token: props.token,
      companyDTO: {
        uuid: company.uuid,
        name: company.name,
        phone: company.phone,
        email: company.email,
        industry: company.industry,
        address: company.address,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
        country: company.country,
        vat: company.vat,
        vatPercent: company.vatPercent,
      },
      numberLicense: 999,
    };
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/payment/preview`,
        data: paymentDTO,
      });
      if (res && res === 'SUCCESS') {
        processCardInfo();
      }
    } catch (error) {
      if (error.message) {
        putError(error.message);
      }
      console.log(error);
    }
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

  const [errorCardInfo, setErrorCardInfo] = useState(null);
  const processCardInfo = async () => {
    const dto = {
      token: props.token,
      cardType: getCardType(card.type),
      cardName: card.holderName,
      cardNumber: card.number,
      cscCode: card.cscCode,
      expiredMonth: card.expiredMonth,
      expiredYear: card.expiredYear,
      numberLicense: totalQuatity,
      vatNumber: company.vatNumber,
      vatPercent: vatPercent,
      companyDTO: {
        uuid: company.uuid,
        name: company.name,
        email: company.email,
      },
      planId: salesboxPackage[currency],
      o365GooglePlanId: addOnSelecteds.o365GooglePlanId ? addOnSelecteds.o365GooglePlanId.packageList[currency] : null,
      documentPlanId: addOnSelecteds.documentPlanId ? addOnSelecteds.documentPlanId.packageList[currency] : null,
      leadCliperPlanId: addOnSelecteds.leadCliperPlanId ? addOnSelecteds.leadCliperPlanId.packageList[currency] : null,
      mailchimpPlanId: addOnSelecteds.mailchimpPlanId ? addOnSelecteds.mailchimpPlanId.packageList[currency] : null,
      fortnoxPlanId: addOnSelecteds.fortnoxPlanId ? addOnSelecteds.fortnoxPlanId.packageList[currency] : null,
      msTeamPlanId: addOnSelecteds.msTeamPlanId ? addOnSelecteds.msTeamPlanId.packageList[currency] : null,
      wordpressPlanId: addOnSelecteds.wordpressPlanId ? addOnSelecteds.wordpressPlanId.packageList[currency] : null,
      couponId: coupon,
    };
    try {
      const res = await api.post({
        resource: `${Endpoints.Enterprise}/payment/stripe/purchaseNew`,
        // resource: `enterprise-v3.1/payment/stripe/purchaseNew`,
        data: dto,
      });
      if (res) {
        // const popup = popupWindow('https://invoice.stripe.com/i/acct_150CklC7cXVm3yoB/invst_IRqtd9azzbie2tgT4lN5g23JHtOPxjE', 'Stripe', 600, 800);

        if (res === 'SUCCESS') {
          setErrorCardInfo(null);
          setShowModal(true);
          setConnectWithStripe(true);
          // setAddOneSelecteds({});
          // setExtraPackage({});
          setNumberMoreLicense(0);
          setTimeout(() => {
            getPaymentInfo();
            getPackageInfo();
          }, 10000);
        } else {
          const popup = popupWindow(res, 'Stripe', 600, 800);
          let timer = setInterval(() => {
            if (!popup || popup.closed) {
              clearInterval(timer);
            }
          }, 100);
        }
      }
    } catch (error) {
      console.log(error);
      if (error?.errorMessage === 'STRIPE_ERROR') {
        setErrorCardInfo(error?.additionInfo);
        setSubmittingSubscribe(false);
        return;
      }
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
          props.putSuccess('success', '', 2000);
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

  const initData = () => {
    getPackageInfo();
    getPaymentInfo();
    getCompanyInfo();
    getCardInfo();
    asyncListUser();
  };

  const calculateAmount = () => {
    let unitPrice = (businessItem.price && businessItem.price[currency]) || 0;
    for (const obj in addOnSelecteds) {
      unitPrice += addOnSelecteds[obj].priceList[currency];
    }
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

  console.log('addOnSelecteds', addOnSelecteds);
  const { unitPrice, currentQuantity, totalQuatity, subTotal, total } = calculateAmount();
  const listAddOn = [
    {
      packageName: _l`Office 365/Gsuite`,
      packageId: {
        USD: 'plan_GsnFhOvsTbomFK',
        EUR: 'plan_GsnGEcR85BHbKV',
        SEK: 'plan_Gsn96yn9XH9hoH',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'o365GooglePlanId',
      packageType: extraPackages.OFFICE365_GOOGLE,
      tooltip: `<p><b>${_l`Office 365/Gsuite`}</b></p>
        <p>- ${_l`Syncs all sent/received emails to contacts and accounts in Salesbox, regardless from where you send/receive`}</p>
        <p>- ${_l`Send personalised mass emails from Salesbox with your Office 365 / Gmail account and track open and click`}</p>
        <p>- ${_l`Syncs your Office365/Google calendar with Salesbox`}</p>
        <p>- ${_l`Adds a Salesbox contact panel inside Outlook and Gmail so you can take action directly from Outlook/Gmail`}</p>`,
    },
    {
      packageName: _l`Microsoft Teams`,
      packageId: {
        USD: 'price_1HMPxRC7cXVm3yoBYDOYfGbw',
        EUR: 'price_1HMPxSC7cXVm3yoB4q7GYdg8',
        SEK: 'price_1HMPxRC7cXVm3yoB0k326Ycm',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'msTeamPlanId',
      packageType: extraPackages.MICROSOFT_TEAMS,
      tooltip: `<p><b>${_l`Microsoft Teams`}</b></p>
        <p>- ${_l`2-way sync of your Teams meetings`}</p>
        <p>- ${_l`Add & initiate Teams meetings from Salesbox`}</p>
        <p>- ${_l`Logs your inbound/outbound dials/calls done with Teams directly to the communication logs and statistics in Salesbox`}</p>
        <p>- ${_l`Chat with contacts you share Teams groups with, directly from Salesbox. Add notes, reminders, meetings, prospects and deals directly from the chat.`}</p>
        <p>- ${_l`Get shortcuts to Teams groups on Companies, Contacts and deals`}</p>`,
    },
    {
      packageName: _l`Documents`,
      packageId: {
        USD: 'plan_GxLtnignkwoyxL',
        EUR: 'plan_GxLuRShCLCoTgo',
        SEK: 'plan_GxLuRiBW7HpGiq',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'documentPlanId',
      packageType: extraPackages.DOCUMENT_STORAGE,
      tooltip: `<p><b>${_l`Document storage`}</b></p>
        <p>- ${_l`Connect OneDrive for Business, Google Drive or Dropbox`}</p>
        <p>- ${_l`Sync documents/files on Accounts, Contacts and Qualified deals`}</p>`,
    },
    {
      packageName: _l`LeadClipper for LinkedIn`,
      packageId: {
        USD: 'plan_Gsp0S41H7rTKaE',
        EUR: 'plan_Gsp1tdsNAopNoX',
        SEK: 'plan_GsnBci1oZHHfIb',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'leadCliperPlanId',
      packageType: extraPackages.LEAD_CLIPPER,
      tooltip: `<p><b>${_l`LeadClipper for LinkedIn`}</b></p>
        <p>${_l`Import or enrich any contact or company you find on LinkedIn directly to Salesbox by clicking a button`}</p>`,
    },
    {
      packageName: _l`Mailchimp`,
      packageId: {
        USD: 'plan_Gsp1WRQqFuI4OT',
        EUR: 'plan_Gsp2GwJlCIOrAz',
        SEK: 'plan_GsnCoYSjG2fnFE',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'mailchimpPlanId',
      packageType: extraPackages.MAIL_CHIMP,
      tooltip: `<p><b>${_l`Mailchimp`}</b></p>
        <p>- ${_l`Export selected contacts form any section in Salesbox to your preferred audience in Mailchimp`}</p>
        <p>- ${_l`Track send outs from Mailchimp and automatically get those that open added automatically as Unqualified deals to your Pipeline with Salesbox campaigns`}</p>`,
    },
    {
      packageName: _l`Fortnox ERP`,
      packageId: {
        USD: 'plan_GyseFcLkofJ27P',
        EUR: 'plan_GysewtsiCUweRP',
        SEK: 'plan_GsnCsHSvvQU70e',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'fortnoxPlanId',
      packageType: extraPackages.FORT_NOX,
      tooltip: `<p><b>${_l`Fortnox ERP`}</b></p>
        <p>- ${_l`Automatically create an invoice in Fortnox when closing a deal as won in Salesbox`}</p>
        <p>- ${_l`Sync company data`}</p>
        <p>- ${_l`Sync products and articles`}</p>`,
    },
    {
      packageName: _l`Wordpress form`,
      packageId: {
        USD: 'price_1IQ5h5C7cXVm3yoB7E6tHj6F',
        EUR: 'price_1IQ5h5C7cXVm3yoBoaEIs74w',
        SEK: 'price_1IQ5h5C7cXVm3yoBAsDxa81z',
      },
      price: {
        USD: 1.9,
        EUR: 1.9,
        SEK: 19,
      },
      field: 'wordpressPlanId',
      packageType: extraPackages.WORDPRESS,
      tooltip: `<p><b>${_l`Wordpress form`}</b></p>
        <p>${_l`Configure your own lead generation forms to catch leads from Wordpress and get them added automatically to your Salesbox account.`}</p>`,
    },
  ];
  return (
    <>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
            <BillingPane step={1} title={_l`Licenses`}>
              <Licenses
                extraPackages={extraPackages}
                listAddOn={listAddOn}
                currency={currency}
                period={period}
                __extraPackage={__extraPackage}
                addOnSelecteds={addOnSelecteds}
                numberPaidLicense={numberPaidLicense}
                numberMoreLicense={numberMoreLicense}
                removeNumberLicense={removeNumberLicense}
                addNumberLicense={addNumberLicense}
                selectAddOn={selectAddOn}
              />
            </BillingPane>
          </Grid.Column>
          <Grid.Column>
            <BillingPane step={2} title={_l`Card info`}>
              <Card
                card={card}
                error={error}
                setCard={setCard}
                setError={setError}
                getCardType={getCardType}
                getPaymentInfo={getPaymentInfo}
                isConnectWithStripe={isConnectWithStripe}
                submitting={submitting}
                setSubmitting={setSubmitting}
              />
            </BillingPane>
          </Grid.Column>
          <Grid.Column>
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
                isAcademy={false}
                setDiscountPercent={setDiscountPercent}
                errorCardInfo={errorCardInfo}
              />
            </BillingPane>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BillingModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        totalQuatity={totalQuatity}
        unitPrice={unitPrice}
        currency={currency}
        period={period}
        vatPercent={vatPercent}
        discountPercent={discountPercent}
        total={total}
        invoiceDate={invoiceDate}
      />
    </>
  );
};
export default connect(
  (state) => {
    return {
      token: state.auth.token,
      maestranoUserId: state.auth.user.maestranoUserId,
    };
  },
  {
    putSuccess: NotificationActions.success,
    putError: NotificationActions.error,
  }
)(Subscriptions);

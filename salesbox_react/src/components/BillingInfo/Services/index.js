import { Grid } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';
import BillingPane from '../Pane';
import _l from 'lib/i18n';
import Assistance from './Assistance';
import connect from 'react-redux/es/connect/connect';
import api from '../../../lib/apiClient';
import { Endpoints } from '../../../Constants';
import * as NotificationActions from 'components/Notification/notification.actions';
import CommonBilling from '../Subscriptions/common';
import BillingInfo from './BillingInfo';
import { checkVAT, countries } from 'jsvat';
import _ from 'lodash';
import OnlineTraniningModal from './OnlineTraniningModal';
import TrainingFocusModal from './TrainingFocusModal';
import moment from 'moment';
const extraPackages = {
  OFFICE365_GOOGLE: 'OFFICE365_GOOGLE',
  DOCUMENT_STORAGE: 'DOCUMENT_STORAGE',
  LEAD_CLIPPER: 'LEAD_CLIPPER',
  MAIL_CHIMP: 'MAIL_CHIMP',
  FORT_NOX: 'FORT_NOX',
};
const SEKCountries = CommonBilling.SEKCountries;
const EURCountries = CommonBilling.EURCountries;
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
  if (!company) return 0;
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
      // setVatPercent(vatValue);
    } else {
      if (checkVatResult.isValid && checkVatResult.country && checkVatResult.country.name === _.lowerCase(country)) {
        vatNumberCorrect = true;
        vatValue = 0;
      } else {
        vatValue = 25;
      }
      // setVatPercent(vatValue);
    }
  } else if (europe && vatNumber.length === 0) {
    vatValue = 25;
    // setVatPercent(vatValue);
  } else {
    vatValue = 0;
    // setVatPercent(0);
  }
  return vatValue;
};

const Services = (props) => {
  const listAddServices = [
    {
      packageName: _l`30 min online training`,
      packageId: {
        USD: 'plan_GsnFhOvsTbomFK',
        EUR: 'plan_GsnGEcR85BHbKV',
        SEK: 'plan_Gsn96yn9XH9hoH',
      },
      price: {
        USD: 49,
        EUR: 49,
        SEK: 490,
      },
      tooltip: `<p><b>${_l`Online training`}</b></p>
<p>- ${_l`You get a 30 min personal online session to discuss your questions`}</p>
<p>- ${_l`You can connect 3 computers to the session`}</p>
<p>- ${_l`You can be several people behind each computer`}</p>`,
      field: 'onlineTrainingId',
      packageType: extraPackages.OFFICE365_GOOGLE,
      unit: _l`per session`,
    },
    {
      packageName: _l`Data import/migration`,
      packageId: {
        USD: 'plan_GxLtnignkwoyxL',
        EUR: 'plan_GxLuRShCLCoTgo',
        SEK: 'plan_GxLuRiBW7HpGiq',
      },
      price: {
        USD: 99,
        EUR: 99,
        SEK: 990,
      },
      tooltip: `<p><b>${_l`Data migration`}</b></p>
<p>- ${_l`Send your file with companies and contacts that you want to import to Salesbox`}</p>
<p>- ${_l`Let us know what responsible user we should add to the imported data`}</p>
<p>- ${_l`We will have your data imported within 24 hours`}</p>`,
      field: 'dataImportId',
      packageType: extraPackages.DOCUMENT_STORAGE,
      unit: _l`per import`,
    },
  ];
  let paymentAssistanceInit = {
    vatNumber: '',
    // vatPercent: 25,
    amountOfOnlineTraining: 0,
    amountOfDataImport: 0,
    // currency: null,// set when sent request
    onlineTrainingDTO: {
      startTime: null,
      focus: null,
      service: listAddServices[0],
      subTotal: 0,
    },
    dataImportDTO: {
      responsible: null,
      file: null,
      service: listAddServices[1],
      subTotal: 0,
    },
    subTotal: 0,
    subTotalVAT: 0,
    total: 0,
    chooseOnlineTraining: false,
    chooseDataImport: false,
  };

  const [currency, setCurrency] = useState('EUR');
  // const [period, setPeriod] = useState(_l`per session`);
  const [invoiceDateService, setInvoiceDateService] = useState(new Date());
  const [__extraPackageService, setExtraPackageService] = useState({});
  const [serviceSelecteds, setServiceSelecteds] = useState({});
  const [fileImport, setFileImport] = useState(null);
  const [paymentAssistance, setPaymentAssistance] = useState(paymentAssistanceInit);
  const [mainSubscription, setMainSubscription] = useState(null);
  const [error, setError] = useState({});
  const [vatPercent, setVatPercent] = useState(0);
  const [company, setCompany] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [onlineTrainingModal, setOnlineTrainingModal] = useState({
    visible: false,
    fnOk: null,
    fnCancel: null,
  });
  const [importModal, setImportModal] = useState({
    visible: false,
    fnOk: null,
    fnCancel: null,
  });
  useEffect(() => {
    getPackageInfo();
  }, []);
  useEffect(() => {
    getCompanyInfo();
  }, []);
  useEffect(() => {
    initInputService();
  }, []);

  const getPackageInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/payment/getPackageInfo`,
      });
      if (res) {
        if (res.mainSubscription) {
          /*          const newSelecteds = { ...addOnSelecteds };
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
                    setNumberPaidLicense(res.mainSubscription.numberPaidLicense || 0);*/
        }
        setMainSubscription(res.mainSubscription);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const populateDefaultCurrency = (country) => {
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
  const getCompanyInfo = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Enterprise}/company/get`,
      });
      if (res) {
        populateDefaultCurrency(res.country);
        setVatPercent(populateVat(res));
        /*
                if (res.stripeCustomerId) {
                  setConnectWithStripe(true);
                }
        */
        setCompany(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initInputService = () => {
    setServiceSelecteds({});
    setExtraPackageService({});
    // $scope.fileImport=null;
    setFileImport(null);
    setPaymentAssistance(paymentAssistanceInit);
  };
  const cleanInputService = () => {
    initInputService();
  };
  const addToServiceSelecteds = (addOn) => {
    let resultAdd = {
      ...serviceSelecteds,
      [addOn.field]: {
        packageId: addOn.packageId[currency],
        packageList: addOn.packageId,
        priceList: addOn.price,
        price: addOn.price[currency],
      },
    };
    setServiceSelecteds(resultAdd);
  };
  const selectServices = (addOn) => {

    let serviceSelectedsTemp = { ...serviceSelecteds };
    let __extraPackageServiceTemp = { ...__extraPackageService };
    if (!serviceSelecteds[addOn.field]) {
      if (addOn.field == 'onlineTrainingId') {
        checkOnlineTraining(addOn);
      } else {
        checkDataImport(addOn);
      }
    } else {
      // delete $scope.serviceSelecteds[addOn.field];
      delete serviceSelectedsTemp[addOn.field];
      if (addOn.field == 'onlineTrainingId') {
        unCheckOnlineTraining();
      } else {
        unCheckDataImport();
      }
      setServiceSelecteds(serviceSelectedsTemp);
    }

    if (__extraPackageService[addOn.field]) {
      // delete $scope.__extraPackageService[addOn.field];
      delete __extraPackageServiceTemp[addOn.field];
      setExtraPackageService(__extraPackageServiceTemp);
    }

    // calculateAmountService();
    // console.log('serviceSelectedsTemp -> addOn', serviceSelectedsTemp);
    // console.log('$scope.selectServices -> addOn', serviceSelecteds);
  };

  const checkOnlineTraining = (addOn) => {
    setOnlineTrainingModal({
      visible: true,
      fnOk: (time, focus) => {
        // console.log('DTATA heareeeee:------------------->', new Date(time).getTime(), focus);
        setOnlineTrainingModal({ visible: false });
        // console.log('checkOnlineTraining success call back:' + paymentAssistance);
        addToServiceSelecteds(addOn);
        let paymentAssistanceTemp = {
          ...paymentAssistance,
          onlineTrainingDTO: {
            startTime: new Date(time).getTime(),
            focus: focus,
            service: listAddServices[0],
            subTotal: 0,
          },
        };
        // console.log("paymentAssistanceTemp:" + paymentAssistanceTemp);
        // console.log("paymentAssistanceTemp.amountOfOnlineTraining:" + paymentAssistanceTemp.amountOfOnlineTraining);
        paymentAssistanceTemp.chooseOnlineTraining = true;
        paymentAssistanceTemp.amountOfOnlineTraining = 1;
        calculateAmountService(paymentAssistanceTemp);
      },
      fnCancel: () => {
        unCheckOnlineTraining();
        setOnlineTrainingModal({ visible: false });
      },
      // fnChangeFocusNote: () => {
      //   console.log('jijiji')
      // },
    });
  };

  const unCheckOnlineTraining = () => {
    let paymentAssistanceTemp = { ...paymentAssistance };
    paymentAssistanceTemp.chooseOnlineTraining = false;
    paymentAssistanceTemp.amountOfOnlineTraining = 0;
    calculateAmountService(paymentAssistanceTemp);
  };
  //data import
  const checkDataImport = (addOn) => {
    setImportModal({
      visible: true,
      fnOk: (responsible, file) => {
        addToServiceSelecteds(addOn);
        if(file!=null) setFileImport(file);
        let paymentAssistanceTemp = { ...paymentAssistance };
        paymentAssistanceTemp.dataImportDTO.responsible= responsible;
        paymentAssistanceTemp.chooseDataImport = true;
        paymentAssistanceTemp.amountOfDataImport = 1;
        calculateAmountService(paymentAssistanceTemp);
        setImportModal({ visible: false });
      },
      fnCancel: () => {
        unCheckDataImport();
        setImportModal({ visible: false });
      },
    });
  };
  const unCheckDataImport = () => {
    let paymentAssistanceTemp = { ...paymentAssistance };

    paymentAssistanceTemp.chooseDataImport = false;
    paymentAssistanceTemp.amountOfDataImport = 0;
    // $scope.fileImport = null;
    setFileImport(null);
    calculateAmountService(paymentAssistanceTemp);
  };

  const calculateAmountService = (paymentAssistanceTemp = { ...paymentAssistance }) => {
    // console.log('==paymentAssistanceTemp:' + paymentAssistanceTemp);
    // console.log('paymentAssistanceTemp.amountOfOnlineTraining:' + paymentAssistanceTemp.amountOfOnlineTraining);

    paymentAssistanceTemp.amountOfOnlineTraining = !isNaN(paymentAssistanceTemp.amountOfOnlineTraining)
      ? paymentAssistanceTemp.amountOfOnlineTraining
      : 0;
    paymentAssistanceTemp.amountOfOnlineTraining = Math.round(paymentAssistanceTemp.amountOfOnlineTraining);
    paymentAssistanceTemp.onlineTrainingDTO.subTotal =
      paymentAssistanceTemp.amountOfOnlineTraining * paymentAssistanceTemp.onlineTrainingDTO.service.price[currency];
    paymentAssistanceTemp.amountOfDataImport = !isNaN(paymentAssistanceTemp.amountOfDataImport)
      ? paymentAssistanceTemp.amountOfDataImport
      : 0;
    paymentAssistanceTemp.amountOfDataImport = Math.round(paymentAssistanceTemp.amountOfDataImport);
    paymentAssistanceTemp.dataImportDTO.subTotal =
      paymentAssistanceTemp.amountOfDataImport * paymentAssistanceTemp.dataImportDTO.service.price[currency];

    paymentAssistanceTemp.subTotal =
      paymentAssistanceTemp.onlineTrainingDTO.subTotal + paymentAssistanceTemp.dataImportDTO.subTotal;

    paymentAssistanceTemp.subTotalVAT = (paymentAssistanceTemp.subTotal * parseInt(vatPercent)) / 100;
    paymentAssistanceTemp.total =
      paymentAssistanceTemp.subTotal + (paymentAssistanceTemp.subTotal * parseInt(vatPercent)) / 100;

    setPaymentAssistance(paymentAssistanceTemp);
    return paymentAssistanceTemp;
  };

  const onchangeAmountService = () => {
    calculateAmountService({ ...paymentAssistance });
  };
  const onChangeAmountOfOnlineTraining = (event, { value }) => {
    let paymentAssistanceTemp = { ...paymentAssistance };
    paymentAssistanceTemp.amountOfOnlineTraining = value;

    calculateAmountService(paymentAssistanceTemp);
  };
  const onChangeAmountOfDataImport = (event, { value }) => {
    let paymentAssistanceTemp = { ...paymentAssistance };
    paymentAssistanceTemp.amountOfDataImport = value;
    calculateAmountService(paymentAssistanceTemp);
  };
  const validateService = () => {
    if (!mainSubscription) {
      setError({
        isError: true,
        message: _l`You need to subscribe to minimum 1 Salesbox CRM license to order services`,
      });
      return false;
    }
    if (paymentAssistance.chooseOnlineTraining && paymentAssistance.amountOfOnlineTraining <= 0) {
      setError({ isError: true, message: _l`Amount of Online training must be greater than zero` });
      return false;
    }
    if (paymentAssistance.chooseDataImport && paymentAssistance.amountOfDataImport <= 0) {
      setError({ isError: true, message: _l`Amount of Data migration must be greater than zero` });
      return false;
    }
    if (paymentAssistance.amountOfOnlineTraining + paymentAssistance.amountOfDataImport <= 0) {
      setError({ isError: true, message: _l`Amount must be greater than zero` });
      return false;
    }
    setError({ isError: false });
    return true;
  };

  const submitOrder = () => {
    // paymentAssistance.vatNumber = $scope.vatNumber;
    // paymentAssistance.currency = $scope.currency;
    if (!validateService()) {
      setSubmitting(false);
      return;
    }
    //prepare data for api
    try {
      var paySubmit = {
        vatPercent: paymentAssistance.vatPercent,
        currency: currency,
        amountOfOnlineTraining: paymentAssistance.amountOfOnlineTraining,
        amountOfDataImport: paymentAssistance.amountOfDataImport,
        onlineTrainingDTO: paymentAssistance.chooseOnlineTraining
          ? {
              startTime:
                paymentAssistance.onlineTrainingDTO.startTime != null
                  ? paymentAssistance.onlineTrainingDTO.startTime
                  : 0,
              focus: paymentAssistance.onlineTrainingDTO.focus,
            }
          : null,
        dataImportDTO: paymentAssistance.chooseDataImport
          ? {
              responsible: paymentAssistance.dataImportDTO.responsible,
            }
          : null,
      };
      processPurchaseAssistance(
        paySubmit,
        fileImport,
        function(data) {
          // $("#loading").fadeOut();
          //callback success
          cleanInputService();
          // popupService.openSuccessMessage(gettextCatalog.getString("Success"));
          // toastr.success('Success');
          /*
            props.putError('Success')
*/
        },
        function(data) {
          // $("#loading").fadeOut();
          if (JSON.parse(data) != null && JSON.parse(data).errorMessage != null) {
            props.putError(JSON.parse(data).errorMessage);
          } else {
            props.putError('Request fail');
          }
        }
      );
    } catch (e) {
      console.log(e);
      // $("#loading").fadeOut();
    }
    // $("#loading").fadeIn();
  };
  const processPurchaseAssistance = async (paymentDTO, file, successCallback, failureCallback) => {
    try {
      let res;
      if (file != null) {
        let formData = new FormData();
        formData.append('importFile', file);
        formData.append('paymentAssistanceDTO', JSON.stringify(paymentDTO));
        res = await api.post({
          resource: `${Endpoints.Enterprise}/payment/stripe/purchaseAssistance`,
          data: formData,
          options: {
            headers: {
              'content-type': 'multipart/form-data',
            },
          },
        });
      } else {
        res = await api.post({
          resource: `${Endpoints.Enterprise}/payment/stripe/purchaseAssistance`,
          // data: paymentDTO,
          options: {
            headers: {
              'Content-Type': 'multipart/form-data; boundary=' + Date.now(),
            },
          },
          query: {
            paymentAssistanceDTO: JSON.stringify(paymentDTO),
          },
        });
      }
      if (res && res === 'SUCCESS') {
        // processCardInfo();
        // setError({isError: true, message: _l`Success`});
        props.putSuccess('success', '', 2000);
        cleanInputService();
      }
    } catch (error) {
      // setError({isError: true, message: _l`Request fail`});
      props.putError(_l`Request fail`);

      console.log(error);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Grid columns={3}>
        <Grid.Column>
          <BillingPane step={1} title={_l`Assistance`}>
            <Assistance
              extraPackages={extraPackages}
              listAddOn={listAddServices}
              currency={currency}
              // period={period}
              __extraPackage={__extraPackageService}
              addOnSelecteds={serviceSelecteds}
              selectAddOn={selectServices}
            />
          </BillingPane>
        </Grid.Column>
        <Grid.Column>
          <BillingPane step={2} title={_l`Billing Info`}>
            <BillingInfo
              invoiceDate={invoiceDateService}
              currency={currency}
              vatPercent={vatPercent}
              submitOrder={submitOrder}
              onChangeAmountOfOnlineTraining={onChangeAmountOfOnlineTraining}
              onChangeAmountOfDataImport={onChangeAmountOfDataImport}
              error={error}
              serviceSelecteds={serviceSelecteds}
              paymentAssistance={paymentAssistance}
              submitting={submitting}
              setSubmitting={setSubmitting}
            />
          </BillingPane>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
      <OnlineTraniningModal
        visible={onlineTrainingModal.visible}
        fnOk={onlineTrainingModal.fnOk}
        fnCancel={onlineTrainingModal.fnCancel}
      />

      <TrainingFocusModal visible={importModal.visible} fnOk={importModal.fnOk} fnCancel={importModal.fnCancel} />
    </>
  );
};

// export default Services;

export default connect(
  (state) => {
    return {
      token: state.auth.token,
      // maestranoUserId: state.auth.user.maestranoUserId,
    };
  },
  {
    putError: NotificationActions.error,
    putSuccess: NotificationActions.success,
  }
)(Services);

// @flow
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { startSubmit, stopSubmit } from 'redux-form';
import * as NotificationActions from 'components/Notification/notification.actions';

// Actions
import AuthActions from 'components/Auth/auth.actions';
import WizardActions from 'components/Wizard/wizard.actions';
import md5 from 'browser-md5';

// FIXME: Convert theme as constants
// Endpoints
const enterpriseEndPoints = 'enterprise-v3.0';
const administrationEndPoints = 'administration-v3.0';
const documentEndPoints = 'document-v3.0';

const statusResponseSuccess = 'SUCCESS';

// Selectors
// FIXME: Un-cropped Image.
// Common
export const getFileData = (state) => state.wizard.__UPLOAD.fileData;
export const getUserId = (state) => state.auth.userId;
export const getFlagForceLogout = (state) => state.wizard.forceLogout;
// export const getCroppedImage = (state) => state.wizard.__UPLOAD.dataURL;

// 1. Corp
export const getSizes = (state) => state.entities.size;
export const getLineOfBusiness = (state) => state.entities.lineOfBusiness;
export const getMeasurements = (state) => state.entities.measurementType;
export const getCompanyInWizard = (state) => state.wizard.corporation.company;
export const getLineOfBusinessInWizard = (state) => state.wizard.corporation.inWizard.lineOfBusiness;
export const getMeasurementInWizard = (state) => state.wizard.corporation.inWizard.measurement;
export const getProductInWizard = (state) => state.wizard.corporation.inWizard.product;
export const getCorpAvatarId = (state) => state.wizard.corporation.avatarId;
export const getPersonalAvatarId = (state) => state.wizard.corporation.personalAvatarId;

// 2. Personal
export const getAvatarId = (state) => state.wizard.personal.avatarId;

// 11
export function* companyGetRequest(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${enterpriseEndPoints}/company/get`,
    });

    if (data) {
      yield put({ type: WizardActions.COMPANY_GET_SUCCESS, values: data });
      yield put({ type: WizardActions.CORP_INFO });
    }
  } catch (e) {
    yield put({ type: WizardActions.COMPANY_GET_FAIL, message: e.message });
  }
}

// 12
export function* corpImageUpdatePhotoAvatarRequest({ name, size, form }): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const imageData = yield select(getFileData);
    let formData = new FormData();
    formData.append('avatar', imageData);

    const data = yield call(api.post, {
      resource: `${documentEndPoints}/photo/uploadAvatar`,
      data: formData,
      options: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    });

    if (data) {
      // Save uploaded image avatar id here.
      yield put({ type: WizardActions.CORP_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS, values: data });
      yield put({
        type: WizardActions.COMPANY_UPDATE_REQUEST,
        name: name,
        size: size,
        form: form,
      });

      // Deprecated
      // yield put({ type: WizardActions.USER_UPDATE_AVATAR_ID_REQUEST }); // This is for Corp // FIXME: The name plz
    }
    yield put(stopSubmit(form));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form));
  }
}

// 13
export function* companyUpdateRequest({ name, size, form }): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const sizes = yield select(getSizes);
    var company = yield select(getCompanyInWizard);
    var isForceLogout = yield select(getFlagForceLogout);

    // Assigning Avatar.
    var corpAvatarId = yield select(getCorpAvatarId);
    if (!corpAvatarId) {
      corpAvatarId = company.avatar;
    }

    let sizeEntity = null;
    if (size) sizeEntity = sizes[size];

    // TODO: Improve later for adjustment of entity.
    // company.name = name;
    // company.size = sizeEntity;

    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/company/update`,

      // Options (Testing)
      // 1: Failed (Can not adjust the read-only property of object in JS).
      // data: company,

      // 2: Worked
      data: {
        uuid: company.uuid,
        name: name ? name : '',
        industry: company.industry,
        size: sizeEntity,
        address: company.address,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
        country: company.country,
        phone: company.phone,
        email: company.email,
        type: company.type,
        numberLicense: company.numberLicense,
        numberFreeLicenseLeft: company.numberFreeLicenseLeft,
        numberFreeLicenseUsed: company.numberFreeLicenseUsed,
        numberPaidLicenseInTotal: company.numberPaidLicenseInTotal,
        numberPaidLicenseUsed: company.numberPaidLicenseUsed,
        numberFreeExpirableLicense: company.numberFreeExpirableLicense,
        numberUserActive: company.numberUserActive,
        mainPhoneType: company.mainPhoneType,
        mainEmailType: company.mainEmailType,
        additionalEmailList: company.additionalEmailList,
        additionalPhoneList: company.additionalPhoneList,
        avatar: corpAvatarId,
        language: company.language,
        expireDate: company.expireDate,
        expireYear: company.expireYear,
        expireMonth: company.expireMonth,
        expireDay: company.expireDay,
        dateExpire: company.dateExpire,
        subscriptionId: company.subscriptionId,
        stripeCustomerId: company.stripeCustomerId,
        subscriptionCanceled: company.subscriptionCanceled,
        subscriptionFailed: company.subscriptionFailed,
        vat: company.vat,
        vatPercent: company.vatPercent,
        mainContactId: company.mainContactId,
        createdDate: company.createdDate,
        isFromAppDirect: company.isFromAppDirect,
      },
    });

    if (data) {
      yield put({ type: WizardActions.COMPANY_UPDATE_SUCCESS, values: data });

      if (!isForceLogout) yield put({ type: WizardActions.LINE_OF_BUSINESS_GET_REQUEST });
      else yield put({ type: AuthActions.LOGOUT_REQUEST });
    }

    yield put(stopSubmit(form));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

// 14
export function* lineOfBusinessGetRequest({}): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${administrationEndPoints}/lineOfBusiness/getInWizard`,
    });

    if (data) {
      yield put({ type: WizardActions.LINE_OF_BUSINESS_GET_SUCCESS, values: data });
    }
    yield put({ type: WizardActions.MEASUREMENT_GET_REQUEST });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 15
export function* measurementGetRequest({}): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${administrationEndPoints}/measurement/getInWizard`,
    });

    if (data) {
      yield put({ type: WizardActions.MEASUREMENT_GET_SUCCESS, values: data });
    }
    yield put({ type: WizardActions.PRODUCT_GET_REQUEST });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 16
export function* productGetRequest({}): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${administrationEndPoints}/product/getInWizard`,
    });

    if (data) {
      yield put({ type: WizardActions.PRODUCT_UPDATE_SUCCESS, values: data });
    }
    yield put({ type: WizardActions.CORP_INFO_PRODUCT });
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 17
export function* corp2ImageUpdatePhotoAvatarRequest({ name, form }): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const imageData = yield select(getFileData);
    let formData = new FormData();
    formData.append('avatar', imageData);

    const data = yield call(api.post, {
      resource: `${documentEndPoints}/photo/uploadAvatar`,
      data: formData,
      options: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    });

    if (data) {
      yield put({ type: WizardActions.CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS, values: data });
      yield put({
        type: WizardActions.LINE_OF_BUSINESS_UPDATE_REQUEST,
        name: name,
        form: form,
      });
    }
    yield put(stopSubmit(form));
  } catch (e) {
    yield put(stopSubmit(form, { _error: e.message }));
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 18
export function* lineOfBusinessUpdateRequest({ name, form }): Generator<*, *, *> {
  yield put(startSubmit(form));

  try {
    const lineOfBusinessInWizard = yield select(getLineOfBusinessInWizard);
    const lineOfBusinessEntities = yield select(getLineOfBusiness);

    let lineOfBusiness;
    let firstKey = Object.keys(lineOfBusinessEntities)[0];
    if (!Object.keys(lineOfBusinessInWizard).length) {
      Object.keys(lineOfBusinessEntities).forEach((key) => {
        if (lineOfBusinessEntities[key].name === 'Sales platform') {
          lineOfBusiness = lineOfBusinessEntities[key];
        }
      });

      if (!lineOfBusiness) {
        lineOfBusiness = lineOfBusinessEntities[firstKey];
      }
    } else {
      lineOfBusiness = lineOfBusinessInWizard;
    }

    if (lineOfBusiness == undefined) lineOfBusiness = {};
    const payload = {
      uuid: lineOfBusiness.uuid,
      name: name ? name : '',
      numberActiveProducts: lineOfBusiness.numberActiveProducts,
      numberOfProducts: lineOfBusiness.numberOfProducts,
      salesMethodDTO: lineOfBusiness.salesMethodDTO,
    };

    const data = yield call(api.post, {
      resource: `${administrationEndPoints}/lineOfBusiness/updateInWizard`,
      data: payload,
    });

    if (data) {
      yield put({ type: WizardActions.LINE_OF_BUSINESS_UPDATE_SUCCESS, values: data });
      yield put({ type: WizardActions.MEASUREMENT_UPDATE_REQUEST, name: name, form: form });
    }

    yield put(stopSubmit(form));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

// 19
export function* measurementUpdateRequest({ name, form }): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    const measurementsInWizard = yield select(getLineOfBusinessInWizard);
    const measurementsEntities = yield select(getMeasurements);

    let measurement;
    let firstKey = Object.keys(measurementsEntities)[0];
    if (!Object.keys(measurementsInWizard).length) {
      Object.keys(measurementsEntities).forEach((key) => {
        if (measurementsEntities[key].name === 'Services') {
          measurement = measurementsEntities[key];
        }
      });
      if (!measurement) {
        measurement = measurementsEntities[firstKey];
      }
    } else {
      measurement = measurementsInWizard;
    }

    const payload = {
      uuid: measurement.uuid,
      name: name ? name : '',
    };
    const data = yield call(api.post, {
      resource: `${administrationEndPoints}/measurement/updateInWizard`,
      data: payload,
    });

    if (data) {
      yield put({ type: WizardActions.MEASUREMENT_UPDATE_SUCCESS, values: data });
      yield put({ type: WizardActions.PRODUCT_UPDATE_REQUEST, name: name, form: form });
    }

    yield put(stopSubmit(form));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

// 20
export function* productUpdateRequest({ name, form }): Generator<*, *, *> {
  yield put(startSubmit(form));

  try {
    // FIXME: Need some API to fetch products from entities context.
    const productInWizard = yield select(getProductInWizard);
    const lineOfBusinessInWizard = yield select(getLineOfBusinessInWizard);
    const measurementInWizard = yield select(getMeasurementInWizard);

    let payload = {};
    if (!Object.keys(productInWizard).length) {
      payload = {
        lineOfBusinessId: lineOfBusinessInWizard.uuid,
        margin: 0,
        measurementTypeId: measurementInWizard.uuid,
        name: name ? name : '',
        price: 0,
      };
    } else {
      payload = {
        lineOfBusinessId: productInWizard.lineOfBusinessId,
        margin: productInWizard.margin,
        measurementTypeId: productInWizard.measurementTypeId,
        name: name ? name : '',
        price: productInWizard.price,
      };
    }

    const data = yield call(api.post, {
      resource: `${administrationEndPoints}/product/updateInWizard`,
      data: payload,
    });

    if (data) {
      yield put({ type: WizardActions.PRODUCT_UPDATE_SUCCESS, values: data });
      yield put({ type: WizardActions.USER_UPDATE_AVATAR_ID_REQUEST });
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 21
export function* userUpdateAvatarIdRequest({}): Generator<*, *, *> {
  try {
    // FIXME: Need some API to fetch products from entities context.
    const personalAvatarId = yield select(getPersonalAvatarId);
    const userId = yield select(getUserId);
    var isForceLogout = yield select(getFlagForceLogout);

    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/user/updateAvatarId`,
      query: {
        uuid: userId,
        avatarId: personalAvatarId,
      },
    });

    if (data) {
      yield put({ type: WizardActions.USER_UPDATE_AVATAR_ID_SUCCESS });

      if (!isForceLogout) yield put({ type: WizardActions.CORP_INFO_LEAD_CLIPPER });
      else yield put({ type: AuthActions.LOGOUT_REQUEST });
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 22
export function* updateFinishedRequest({}): Generator<*, *, *> {
  yield put(startSubmit(''));
  try {
    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/wizard/updateFinished`,
      query: {
        type: 'COMPANY',
      },
    });
    if (data == statusResponseSuccess) {
      yield put({ type: WizardActions.CORP_SAVE_EXIT });
      yield put({ type: AuthActions.FETCH_USER_BY_ID_REQUEST });
    }
    yield put(stopSubmit(''));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(''));
  }
}
// Corp - End

// Personal - Begin
// 21
export function* personalImageUpdatePhotoAvatarRequest({ password, form }): Generator<*, *, *> {
  yield put(startSubmit(form));

  try {
    const imageData = yield select(getFileData);
    let formData = new FormData();
    formData.append('avatar', imageData);

    const data = yield call(api.post, {
      resource: `${documentEndPoints}/photo/uploadAvatar`,
      data: formData,
      options: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    });

    if (data) {
      yield put({ type: WizardActions.PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS, values: data });
      yield put({
        type: WizardActions.CHANGE_PASSWORD_NEW_REQUEST,
        password: password,
        form: form,
      });
    }
    yield put(stopSubmit(form));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form));
  }
}

// 22
export function* changePasswordNewRequest({ password, form }): Generator<*, *, *> {
  yield put(startSubmit(form));
  try {
    if (password) {
      const userId = yield select(getUserId);

      const query = {
        uuid: userId,
        newPassword: md5(password),
      };

      const data = yield call(api.post, {
        resource: `${enterpriseEndPoints}/user/changePasswordNew`,
        query: query,
      });

      if (data) {
        yield put({ type: WizardActions.USER_2_UPDATE_AVATAR_ID_REQUEST });
      }
      yield put(stopSubmit(form));
    } else {
      yield put({ type: WizardActions.USER_2_UPDATE_AVATAR_ID_REQUEST });
      yield put(stopSubmit(form));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

// 23
export function* user2UpdateAvatarIdRequest(): Generator<*, *, *> {
  try {
    // FIXME: Need some API to fetch products from entities context.
    const userId = yield select(getUserId);
    const avatarId = yield select(getAvatarId);
    var isForceLogout = yield select(getFlagForceLogout);

    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/user/updateAvatarId`,
      query: {
        uuid: userId,
        avatarId: avatarId,
      },
    });

    if (data) {
      yield put({ type: WizardActions.USER_2_UPDATE_AVATAR_ID_SUCCESS });

      if (!isForceLogout) yield put({ type: WizardActions.PERSONAL_INFO_LEAD_CLIPPER });
      else yield put({ type: AuthActions.LOGOUT_REQUEST });
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// 24
export function* personalUpdateFinishedRequest(): Generator<*, *, *> {
  yield put(startSubmit(''));
  try {
    const data = yield call(api.post, {
      resource: `${enterpriseEndPoints}/wizard/updateFinished`,
      query: {
        type: 'PERSONAL',
      },
    });
    if (data == statusResponseSuccess) {
      yield put({ type: WizardActions.PERSONAL_SAVE_EXIT });
      yield put({ type: AuthActions.FETCH_USER_BY_ID_REQUEST });
    }
    yield put(stopSubmit(''));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(stopSubmit(''));
  }
}
// Personal - End

export default function* saga(): Generator<*, *, *> {
  // Flow 1: Corp
  // 11
  yield takeLatest(WizardActions.COMPANY_GET_REQUEST, companyGetRequest);

  // 12
  yield takeLatest(WizardActions.CORP_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST, corpImageUpdatePhotoAvatarRequest);

  // 13 (We assign avatar data here after upload image on previous step)
  yield takeLatest(WizardActions.COMPANY_UPDATE_REQUEST, companyUpdateRequest);

  // 14
  yield takeLatest(WizardActions.LINE_OF_BUSINESS_GET_REQUEST, lineOfBusinessGetRequest);

  // 15
  yield takeLatest(WizardActions.MEASUREMENT_GET_REQUEST, measurementGetRequest);

  // 16
  yield takeLatest(WizardActions.PRODUCT_GET_REQUEST, productGetRequest);

  // 17
  yield takeLatest(WizardActions.CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST, corp2ImageUpdatePhotoAvatarRequest);

  // 18
  yield takeLatest(WizardActions.LINE_OF_BUSINESS_UPDATE_REQUEST, lineOfBusinessUpdateRequest);

  // 19
  yield takeLatest(WizardActions.MEASUREMENT_UPDATE_REQUEST, measurementUpdateRequest);

  // 20
  yield takeLatest(WizardActions.PRODUCT_UPDATE_REQUEST, productUpdateRequest);

  // 21
  yield takeLatest(WizardActions.USER_UPDATE_AVATAR_ID_REQUEST, userUpdateAvatarIdRequest);

  // 22
  yield takeLatest(WizardActions.UPDATE_FINISHED_REQUEST, updateFinishedRequest);

  // Flow 2: Personal
  // 21
  yield takeLatest(WizardActions.PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST, personalImageUpdatePhotoAvatarRequest);

  // 22
  yield takeLatest(WizardActions.CHANGE_PASSWORD_NEW_REQUEST, changePasswordNewRequest);

  // 23
  yield takeLatest(WizardActions.USER_2_UPDATE_AVATAR_ID_REQUEST, user2UpdateAvatarIdRequest);

  // 24
  yield takeLatest(WizardActions.PERSONAL_UPDATE_FINISHED_REQUEST, personalUpdateFinishedRequest);
}

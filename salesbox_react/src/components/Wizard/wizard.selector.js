// @flow
import { createSelector } from 'reselect';

// Flow 1: Corporation
export const getCompany = createSelector(
  (state) => state.wizard.corporation.company,
  (company) => {
    return company;
  }
);
export const getProduct = createSelector(
  (state) => state.wizard.corporation.inWizard.product,
  (product) => {
    return product;
  }
);

// Flow 2: Personal

// Common
export const getImageCropScale = createSelector(
  (state) => state.wizard.__UPLOAD.imageCropScale,
  (scale) => {
    return scale;
  }
);
// FIXME: Bring me outside plz.
// export const isMainContact = createSelector(
//   (state) => state.wizard.__UPLOAD.imageCropScale,
//   (scale) => {
//     return scale;
//   }
// );
// export const getCroppedImage = createSelector(
//   (state) => state.wizard.__UPLOAD.dataURL,
//   (dataURL) => {
//     return dataURL;
//   }
// );

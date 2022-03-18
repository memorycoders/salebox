// @flow
import { createSelector } from 'reselect';
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    None: 'None',
  },
});

const selectType = {
  key: null,
  value: null,
  text: _l`None`,
};

export const getActiveSalesMethods = createSelector(
  (state) => state.entities.salesMethod,
  (salesMethods) => {
    const choices = Object.keys(salesMethods)
      .filter((salesMethodId) => {
        const salesMethod = salesMethods[salesMethodId];
        return salesMethod.using;
      })
      .map((salesMethodId) => {
        const salesMethod = salesMethods[salesMethodId];
        return {
          key: salesMethod.uuid,
          value: salesMethod.uuid,
          text: salesMethod.name,
        };
      });
    return [ ...choices ];
  }
);

export const getSaleMethodById = createSelector(
  (state, id) => state.entities?.salesMethod[id],
  (salesMethod) => {
    if (!salesMethod) {
      return {};
    }
    return salesMethod;
  }
);

export default getActiveSalesMethods;

// @flow
import { createSelector } from 'reselect';
import _l from 'lib/i18n';
import addNone from '../../lib/addNone';
import { UIDefaults } from 'Constants';

addTranslations({
  'en-US': {
    'Select industry': 'Select industry',
  },
});

const selectIndustry = {
  key: null,
  value: null,
  text: _l`Select industry`,
};

export const getIndustriesForDropdown = createSelector(
  (state) => state.entities.industry,
  (state, selected) => selected,
  (industries, selected) => {
    const choices = Object.keys(industries)
      let _choise = []
      for (let index = 0; index < choices.length; index++) {
        let industry = industries[choices[index]];
        if(industry.name && industry.name.length > 0) {
          _choise.push({
            key: industry.uuid,
            value: industry.uuid,
            text: industry.name,
          })
        }
      }
    _choise.sort((value1, value2) => value1.text.localeCompare(value2.text) );
    return [selectIndustry, ..._choise];
  }
);

export const getIndustriesForAccount = createSelector(
  (state) => state.entities.industry,
  (state, selected) => selected,
  (industries, selected) => {
    const choices = Object.keys(industries)
      let _choise = []
      for (let index = 0; index < choices.length; index++) {
        let industry = industries[choices[index]];
        if(industry.name && industry.name.length > 0) {
          _choise.push({
            key: industry.uuid,
            value: industry.uuid,
            text: industry.name,
          })
        }
        
      }

    return addNone(_choise);
  }
);
export default getIndustriesForDropdown;

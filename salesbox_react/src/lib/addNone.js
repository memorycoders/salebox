//@flow
import _l from 'lib/i18n';

addTranslations({
  'en-US': {
    None: 'None',
  },
});

const selectNone = {
  key: null,
  value: null,
  text: _l`None`,
};
export {selectNone};

export default (choices, text) => {
  if (text !== undefined) {
    return [{ ...selectNone, text }, ...choices];
  }
  return [selectNone, ...choices];
};

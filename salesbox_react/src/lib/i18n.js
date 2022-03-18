// @flow
import createTranslator from 'oxygen-i18n/lib/createTranslator';

const i18n = createTranslator({}, (translator) => {
  if (process.browser && typeof window !== 'undefined') {
    const initialData = window.__INITIAL_DATA__ ? window.__INITIAL_DATA__ : {};
    if (initialData.messages) {
      translator.addMessages(initialData.messages);
      delete initialData.messages;
    }
  }
  try {
    // const messages = require('../../tmp/messages.json');
    const messages = require('../resources/messages.json');
    translator.addMessages(messages);
  } catch (e) {
    // Log error
  }
});

const { translate } = i18n;
export { i18n };
export default translate;

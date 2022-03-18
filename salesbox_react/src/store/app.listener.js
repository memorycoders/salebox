//@flow
import { i18n } from 'lib/i18n';
import * as AppActions from 'components/App/app.actions';
import {getLanguageDefaultCode} from '../components/SignUpForm/SignUpForm'
import {countries} from "../components/Country/CountryPhoneNumberDropdown";

const select = (state) => state.ui.app;

const languages = {
  en: 'en-US',
};

export default (store) => {
  let currentState = {};
  console.log('default store');
  //set lang default by browser
  let langLocaleStorage = localStorage.getItem('locale');
  if (langLocaleStorage == null) {
    let langBrower = getLanguageDefaultCode();
    localStorage.setItem('locale', langBrower);
  }

  const unsubscribe = store.subscribe(() => {
    const previousState = currentState;
    currentState = select(store.getState());

    let currentLocal= currentState.locale;
    /*
    //set lang by browser
        let langLocaleStorage = localStorage.getItem('locale');
        //check exist
        let country = countries.filter(c=>c.flag==langLocaleStorage  || (c.value=='England' && langLocaleStorage =='en'));
        langLocaleStorage = country != null && country.length > 0 ? langLocaleStorage : null;
        console.log('langLocaleStorage',langLocaleStorage);
        console.log('previousState',previousState);
        console.log('currentState',currentState);
        if (previousState.locale == null) {
          // let langBrower = getLanguageDefaultCode();
          let langBrower = langLocaleStorage || getLanguageDefaultCode();
          if (langBrower != null)
            currentLocal = langBrower;
        }
        console.log('currentLocal',currentLocal);
    */

    if (previousState.locale !== currentLocal) {
      localStorage.setItem('locale', currentLocal);
      i18n.setLocale(languages[currentLocal] || currentLocal);
      store.dispatch(AppActions.updateLocalizationConst());
    }
  });
  if (localStorage.getItem('locale')) {
    store.dispatch(AppActions.setLocale(localStorage.getItem('locale')));
  }
};

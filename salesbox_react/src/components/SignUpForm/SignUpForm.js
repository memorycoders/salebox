//@flow
import * as React from 'react';

// UI
import { Form, Divider, Button, Message, Tab, Label, Dimmer, Loader, Input } from 'semantic-ui-react';
import CountryPNDD from 'components/Country/CountryPhoneNumberDropdown';
import IndustryNewDropdown from '../IndustryNewDropdown/IndustryNewDropdown';
import FormInput from 'components/Form/FormInput';
import TermOfUseModal from './TermOfUseModal';
import { countries} from '../Country/CountryPhoneNumberDropdown'
// Redux
import { connect } from 'react-redux';
import * as authActions from 'components/Auth/auth.actions';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import * as appActions from 'components/App/app.actions';
import { i18n } from 'lib/i18n';

import {
  isSignedUp,
  isSignedSuccess,
  getFullPhone,
  isToUModalOpened,
  getDetectedDefaultLanguage,
  getMessageErrorSignUp,
  isSubmittingForm,
} from 'components/Auth/auth.selector';

import { getCountryOptions } from 'lib/common';

// Validation
import isEmail from 'lib/isEmail';
import isValidPhone from 'lib/isValidPhone';

import css from './SignUpForm.css';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Email: 'Email',
    Password: 'Password',
    'Confirm password': 'Confirm password',
    Language: 'Language',
    'Last name': 'Last name',
    Phone: 'Phone',
    'Email is invalid': 'Email is invalid',
    'Password confirmation': 'Password confirmation',
    'Confirm your password': 'Confirm your password',
    'Password does not match': 'Password does not match',
    'Register now': 'Register now',
    'I accept': 'I accept',
    'Terms of use': 'Terms of use',
    'I accept terms of use': 'I accept terms of use',
    'There were some errors with your registration': 'There were some errors with your registration',
    'An email has been sent to your email address. Please follow instruction to activate your account':
      'An email has been sent to your email address. Please follow instruction to activate your account',
  },
});

type ValuesT = {
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  industry: string,
  phone: string,
  password: string,
  passwordConfirm: string,
  acceptToU: boolean,
};

type PropsT = {
  anyTouched: boolean,
  submitting: boolean,
  error: string,
  signedSuccess: boolean,
  country: string,
  industry: string,
  phone: string,
  requestRegister: (
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    industry: string,
    phone: string,
    password: string,
    form: string
  ) => void,
  handleSubmit: ((ValuesT) => {}) => {},
  handleCountryChange: (event: Event, { value: string, options: [] }) => void,
  handleToUModalOpen: (event: Event, {}) => void,
};

function getSelectedLanguageCodeByCountry(selectCountry: string) {
  if (selectCountry.includes('Sweden')) {
    return 'se';
  } else if (
    selectCountry.includes('Puerto Rico') ||
    selectCountry.includes('Argentina') ||
    selectCountry.includes('Bolivia') ||
    selectCountry.includes('Chile') ||
    selectCountry.includes('Colombia') ||
    selectCountry.includes('Costa Rica') ||
    selectCountry.includes('Cuba') ||
    selectCountry.includes('Dominican Republic') ||
    selectCountry.includes('Ecuador') ||
    selectCountry.includes('El Salvador') ||
    selectCountry.includes('Equatorial Guinea') ||
    selectCountry.includes('Guatemala') ||
    selectCountry.includes('Honduras') ||
    selectCountry.includes('Mexico') ||
    selectCountry.includes('Nicaragua') ||
    selectCountry.includes('Panama') ||
    selectCountry.includes('Paraguay') ||
    selectCountry.includes('Peru') ||
    selectCountry.includes('Spain') ||
    selectCountry.includes('Uruguay') ||
    selectCountry.includes('Venezuela')
  ) {
    return 'es';
  } else if (
    selectCountry.includes('Portugal') ||
    selectCountry.includes('Brazil') ||
    selectCountry.includes('Angola') ||
    selectCountry.includes('Mozambique') ||
    selectCountry.includes('Cape Verde') ||
    selectCountry.includes('Guinea-Bissau') ||
    selectCountry.includes('Sao Tome') ||
    selectCountry.includes('Timorleste') ||
    selectCountry.includes('Equatorial Guinea')
  ) {
    return 'pt';
  } else if (
    selectCountry.includes('Germany') ||
    selectCountry.includes('Austria') ||
    selectCountry.includes('Switzerland') ||
    selectCountry.includes('Luxembourg') ||
    selectCountry.includes('Liechtenstein')
  ) {
    return 'de';
  } else {
    return 'en';
  }

  // TODO: Add more languageCode of it, ja, fr, ru, zh
}

function getLanguageDefaultCode() {
  let currentLanguage = 'en';
  // console.log("currentLanguage: "+currentLanguage);
  var arrLang=['en','se','de','es','pt'];
  if(!arrLang.includes(currentLanguage)){
    // console.log("Is other lang: "+currentLanguage);
    currentLanguage="en";
  }
  var langBrowser=navigator.language || navigator.browserLanguage;
  // console.log("langBrowser: "+langBrowser);
  if(langBrowser!=null){
    langBrowser=langBrowser.toLowerCase();
    if(langBrowser.startsWith("en")){
      currentLanguage ='en';
    }else
    if(langBrowser.toLowerCase().startsWith("se") || langBrowser.toLowerCase().startsWith("sv")){
      currentLanguage ='se';
    }else
    if(langBrowser.toLowerCase().startsWith("de")){
      currentLanguage ='de';
    }else
    if(langBrowser.toLowerCase().startsWith("es")){
      currentLanguage ='es';
      // }else
      // if(langBrowser.toLowerCase().startsWith("pt")){
      //   currentLanguage ='pt';
    }
  }
  // console.log("currentLanguage: ",currentLanguage)

  return currentLanguage
}

function getLanguageDefault(curLang) {
  let currentLanguage = curLang || getLanguageDefaultCode();
  let country = countries.filter(c=>
    (currentLanguage == c.flag || (c.value=='England' && currentLanguage =='en'))
  );
  // console.log("country ",country)
  if(country.length>0){
    return country[0].value;
  }
  return 'England'
}

export {getLanguageDefaultCode};

class SignUpForm extends React.Component<PropsT> {
  constructor(props) {
    super(props);

    this.state = {
      acceptedTerm: true,
      // hiddenIndustry: false,
    };
    this.requestRegister = this.requestRegister.bind(this);
  }

  requestRegister = (values: ValuesT) => {
    const {
      requestRegister,
      // languageCode,
    } = this.props;

    const { firstName, lastName, email, country, phone, password, passwordConfirm, acceptToU, industry } = values;

    // Validation
    if (!firstName) {
      throw new SubmissionError({
        firstName: _l`${_l`First name`} is required`,
        //_error: _l`${_l`First name`} is required`,
      });
    }

    if (!this.props.hiddenIndustry && !industry) {
      throw new SubmissionError({
        industry: _l`${_l`Industry`} is required`,
        //_error: _l`${_l`First name`} is required`,
      });
    }

    if (!lastName) {
      throw new SubmissionError({
        lastName: _l`${_l`Last name`} is required`,
        //_error: _l`${_l`Last name`} is required`,
      });
    }

    if (!email) {
      throw new SubmissionError({
        email: _l`${_l`Email`} is required`,
        //_error: _l`${_l`Email`} is required`,
      });
    } else if (!isEmail(values.email)) {
      throw new SubmissionError({
        email: _l`Email is invalid`,
        //_error: _l`You must add a valid email address`,
      });
    }

    if (!country) {
      throw new SubmissionError({
        country: _l`${_l`Language`} is required`,
        //_error: _l`${_l`Language`} is required`,
      });
    }

    // if (!phone) {
    //   throw new SubmissionError({
    //     phone: _l`${_l`Phone`} is required`,
    //     _error: _l`${_l`Phone`} is required`,
    //   });
    // } else if (!isValidPhone(values.phone)) {
    //   throw new SubmissionError({
    //     phone: _l`You must add a valid phone number`,
    //     _error: _l`You must add a valid phone number`,
    //   });
    // }

    if (!password) {
      throw new SubmissionError({
        password: _l`${_l`Password`} is required`,
        //_error: _l`${_l`Password`} is required`,
      });
    }

    if (!passwordConfirm) {
      throw new SubmissionError({
        passwordConfirm: _l`${_l`Confirm password`} is required`,
        //_error: _l`${_l`Password confirmation`} is required`,
      });
    }

    if (!(password === passwordConfirm)) {
      throw new SubmissionError({
        passwordConfirm: _l`${_l`New & confirmed passwords do not match`}`,
        //_error: _l`${_l`Password and password confirmation must be the same`} is required`,
      });
    }

    if (!acceptToU) {
      this.setState({ acceptedTerm: false });
      throw new SubmissionError({
        acceptToU: _l`${_l`I accept terms of use`} is required`,
        //_error: _l`${_l`I accept terms of use`} is required`,
      });
    }

    // TODO: Cut-Off prefix phone number.
    let languageCode = getSelectedLanguageCodeByCountry(country);
    let industryValue = industry;
    if(this.props.hiddenIndustry || industryValue==null ||industryValue==''){
      industryValue = 'OTHER';
    }

    requestRegister(firstName, lastName, email, country, industryValue, phone, password, languageCode, 'register');
    //clean form
    this.props.signUpCleanStore();
  };

  onChangeForm = () => {
    if (!this.props.isLoginForm) {
      this.props.changeForm(false);
    }
    this.props.signUpCleanStore();
  };

  handleChangeAcceptTerm = () => {
    if (this.refs.acceptTerm.checked) {
      this.setState({ acceptedTerm: false });
    } else {
      this.setState({ acceptedTerm: true });
    }
  };
  handleChangeLanguage = (e, data) => {
    // console.log("handleChangeLanguage: ",data);
    let languageCode = getSelectedLanguageCodeByCountry(data)
    /*
        if(languageCode=='es' || languageCode == 'de'){
            this.setState({
              hiddenIndustry:true
            })
          }else {
            this.setState({
              hiddenIndustry: false
            })

          }
    */
    setTimeout(()=>{
      this.props.onChangeLang();
    },100);
    setTimeout(()=>{
      this.props.setLocale(languageCode);
    },200);
    window.history.replaceState(null, null, '?mode=register&la=' + languageCode);

  }
  onClickTermOfUse(){
    window.open('https://salesbox.com/terms-of-use', '_blank');
  }
  _updateLangByProps(){
    if (this.props.la != null && this.props.la != '') {
      let country = countries.filter(c=>c.flag==this.props.la || (c.value=='England' && this.props.la =='en'));
      if(country!=null && country.length>0){
        let lang = getLanguageDefault(this.props.la);
        /*
                if (this.props.langStore != this.props.la) {
                  this.props.setLocale(this.props.la);
                }
        */

        this.props.setValueLangDefault(lang);
        // this.setState({
        //   languageDefault: lang
        // })
      }
    }
  }
  componentDidMount(): void {
    // console.log("this.props.la ", this.props.la);
    this._updateLangByProps();
  }
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
//     if(prevProps.la!=this.props.la){
//       this._updateLangByProps();
//     }
  }

  render() {
    const {
      error,
      submittingState,
      anyTouched,
      handleSubmit, // Form
      phone,
      country,
      handleCountryChange, // Country
      isToUOpened,
      handleToUModalOpen, // Terms of Use
      signUpToUOpen,
      errorState,
    } = this.props;
    // FIXME: The logic seems to be not good at all.
    let { signedSuccess } = this.props;
    if (signedSuccess === null) {
      signedSuccess = false;
    }
    // console.log('this.state.hiddenIndustry ',this.state.hiddenIndustry);
    // console.log('this.state.languageDefault ', this.state.languageDefault);
    return (
      <div>
        <div className={css.title}>
          <h2>{_l`Sign up`}</h2>
          <Button className={css.signInBtn} onClick={this.onChangeForm}>
            {_l`Login`}
          </Button>
        </div>
        {/*{signedSuccess &&*/}
        {/*<Message success>{_l`An email has been sent to your email address. Please follow instruction to activate your account`}</Message>*/}
        {/*}*/}
        {errorState &&
        (errorState == 'USER_EMAIL_DUPLICATE' ? (
          <div>
            <p className={css.errorSingUp}>{_l`The username already exists`}</p>
          </div>
        ) : (
          <div>
            <p className={css.errorSingUp}>{errorState}</p>
          </div>
        ))}
        <Form onSubmit={handleSubmit(this.requestRegister)} className={css.formSignUp}>
          {/* <Form.Group widths='equal'> */}
          <Field
            autoFocus
            autoComplete="firstName"
            name="firstName"
            component={FormInput}
            // label={_l`First name`}
            placeholder={_l`First name`}
          />
          <Field
            autoComplete="lastName"
            name="lastName"
            component={FormInput}
            // label={_l`Last name`}
            placeholder={_l`Last name`}
          />
          <Field
            autoComplete="email"
            name="email"
            component={FormInput}
            // label={_l`Email`}
            placeholder={_l`Email`}
          />
          <Field
            autoFocus
            autoComplete="country"
            name="country"
            component={CountryPNDD}
            // label={_l`Language`}
            // FIXME: Get dirty form error.
            // onChange={handleCountryChange}
            onChange={this.handleChangeLanguage}
          />
          {!this.props.hiddenIndustry &&
          <Field
            type="password"
            autoFocus
            autoComplete="nope"
            name="industry"
            component={IndustryNewDropdown}
            // label={_l`Language`}
            // FIXME: Get dirty form error.
            // onChange={handleCountryChange}
          />
          }
          <input id="hiddeUsernameFormPassword1" type="username" name="email" />
          <input id="hiddeUsernameFormPassword1" type="password" name="password" autocomplete="new-password"></input>
          <Field
            autoComplete="password"
            name="password"
            type="password"
            component={FormInput}
            // label={_l`Password`}
            placeholder={_l`Password`}
          />
          <Input id="hiddeUsernameFormPassword1" type="username" />
          <Input id="hiddeUsernameFormPassword1" type="password" autocomplete="new-password"/>
          <Field
            autoComplete="passwordConfirm"
            name="passwordConfirm"
            type="password"
            component={FormInput}
            // label={_l`Confirm your password`}
            placeholder={_l`Confirm your password`}
          />
          <Divider hidden />
          <div className={css.accept}>
            <Field
              className={css.acceptTerm}
              name="acceptToU"
              id="acceptToU"
              component="input"
              type="checkbox"
              ref="acceptTerm"
              onChange={this.handleChangeAcceptTerm}
            />
            <label> {_l`I accept`} </label>
            <span className={css.termsOfUse} as="a" onClick={signUpToUOpen}>{_l`Terms of use`}</span>
            {/*<span className={css.termsOfUse} as="a" onClick={this.onClickTermOfUse}>{_l`Terms of use`}</span>*/}

          </div>
          {!this.state.acceptedTerm ? (
            <div>
              <p className={css.errorSingUp}>{_l`You must accept the terms of use`}</p>
            </div>
          ) : (
            <div></div>
          )}
          <Divider hidden />
          <Form.Field>
            {/* <Button className={css.signUpBtn} type="submit" fluid disabled={submitting || !anyTouched} loading={submitting} primary> */}
            <Button
              className={css.signUpBtn}
              type="submit"
              fluid
              disabled={submittingState}
              loading={submittingState}
              primary
            >
              {_l`Register now`}
            </Button>
          </Form.Field>
        </Form>
        {/* {error && (
          <Message error>
            <Message.Header>{_l`There were some errors with your registration`}</Message.Header>
            {error}
          </Message>
        )} */}

        {/* {signedUp &&
          <Dimmer active inverted>
            <Loader size="massive">Loading</Loader>
          </Dimmer>} */}
        <TermOfUseModal isOpened={isToUOpened} />
      </div>
    );
  }
}

const registerForm = reduxForm({
  form: 'register',
  enableReinitialize: true,
});

// Decorate with connect to read form values
const selector = formValueSelector('register') // <-- same as form name

export default compose(
  withState('lang', 'setLang', null),
  connect(
    (state,{lang}) => {
      console.log('state.ui.app.locale: ',state.ui.app.locale);
      console.log('lang: ',lang);
      let countryValue =  lang || getLanguageDefault(state.ui.app.locale);
      // console.log('countryValue',countryValue);
      const currForm = selector(state, 'firstName', 'lastName', 'email', 'country', 'industry', 'password', 'passwordConfirm', 'acceptToU');
      const storeDataForm =  state.auth.__FORM._SIGN_UP.data || {};
      let dataInit =
        Object.keys(currForm).length != 0 ?
          {
            ...currForm,
            country: currForm.country == null ? countryValue : currForm.country
          } : {
            ...storeDataForm,
            country: storeDataForm.country == null ? countryValue : storeDataForm.country
          };
      console.log('storeDataForm:',storeDataForm);
      console.log('currForm:',currForm);
      console.log('dataInit:',dataInit);
      return {
        signedUp: isSignedUp(state),
        signedSuccess: isSignedSuccess(state),
        isToUOpened: isToUModalOpened(state),
        /*
                initialValues: {
                  // country: 'England',
                  country: countryValue,
                },
        */
        initialValues:dataInit,
        enableReinitialize: true,
        langStore: state.ui.app.locale,
        currForm:currForm,
        error: state.auth.form.register.response.statusCode,
        submitting: isSubmittingForm(state),
        hiddenIndustry: dataInit.country == 'Spain' || dataInit.country == 'Germany'
      };
    },
    {
      requestRegister: authActions.requestRegister,
      phoneFill: authActions.phoneFill,
      signUpToUOpen: authActions.signUpToUOpen,
      setLocale: appActions.setLocale,
      signUpSaveStore:authActions.signUpSaveStore,
      signUpCleanStore:authActions.signUpCleanStore
    }
  ),
  withState('errorState', 'updateErrorState', null),
  withState('submittingState', 'updateSubmittingState', false),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      //fix not render when change props
      if (nextProps.error != this.props.error) {
        this.props.updateErrorState(nextProps.error);
      }
      if (nextProps.submitting != this.props.submitting) {
        this.props.updateSubmittingState(nextProps.submitting);
      }
    },
  }),
  registerForm,
  withHandlers({
    handleCountryChange: ({ phoneFill }) => (event, { value }) => {
      // let selectDial = "";
      // options.map((item) => {
      //   if (item.value === value) {
      //     selectDial = item.dial;
      //   }
      // })
      // phoneFill(selectDial);
    },
    // handleToUModalOpen: ({ signUpToUOpen }) => (event, { }) => {
    //   signUpToUOpen();
    // },
    setValueLangDefault:({setLang})=>(la)=>{
      setLang(la);
    },
    onChangeLang:({signUpSaveStore,currForm})=>()=>{
      signUpSaveStore(currForm);
    },
  })
)(SignUpForm);

// @flow
export type LoginActionT = {
  username: string,
  password: string,
  rememberMe: Boolean,
  form: string,
};

export type RegisterActionT = {
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  phone: string,
  password: string,
  languageCode: string,
  form: string,
};

export type CheckExistedActionT = {
  email: string,
  form: string,
};

export type ForgotPassActionT = {
  email: string,
  pass: string,
  form: string,
};

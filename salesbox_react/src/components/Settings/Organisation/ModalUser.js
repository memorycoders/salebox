import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import pick from 'lodash/pick';
import classNames from 'classnames';

import css from './organisation.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isUnitDTOListOrganisation, isCompanyOrganisation } from '../settings.selectors';
import CountryDropdown from '../../Country/CountryDropdown';
import { getListCountryOptions } from 'lib/common';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import moonBlue from '../../../../public/moonBlue.png';
import moonGreen from '../../../../public/moonGreen.png';
import moonRed from '../../../../public/moonRed.png';
import moonYellow from '../../../../public/moonYellow.png';

const validationSchema = Yup.object({
  firstName: Yup.string().required(_l`First Name is required`),
  lastName: Yup.string().required(_l`Last Name is required`),
  email: Yup.string()
    .required(_l`Email is required`)
    .email(_l`Email is invalid`),
  phone: Yup.string()
    .required(_l`Phone is required`)
    .min(8, _l`Phone is invalid`),
});

const ModalUser = ({ openModal, setOpenModal, onDone, unitDTOList, itemEdit, title, countryCodes, company }: any) => {
  const discProfileOptions = [
    {
      key: 'BLUE',
      value: 'BLUE',
      text: _l`Blue`,
      image: { avatar: true, src: moonBlue, className: css.iconColorView },
    },
    {
      key: 'GREEN',
      value: 'GREEN',
      text: _l`Green`,
      image: { avatar: true, src: moonGreen, className: css.iconColorView },
    },
    {
      key: 'RED',
      value: 'RED',
      text: _l`Red`,
      image: { avatar: true, src: moonRed, className: css.iconColorView },
    },
    {
      key: 'YELLOW',
      value: 'YELLOW',
      text: _l`Yellow`,
      image: { avatar: true, src: moonYellow, className: css.iconColorView },
    },
  ];
  const initialValues = useMemo(
    () => ({
      email: '',
      country: itemEdit
        ? ''
        : countryCodes.length > 0
        ? countryCodes.find((i) => i.value === company.country) &&
          countryCodes.find((i) => i.value === company.country).value
        : '',
      discProfile: 'NONE',
      firstName: '',
      huntingFarmingRatio: 0,
      lastName: '',
      manager: false,
      phone: itemEdit
        ? ''
        : countryCodes.length > 0
        ? `+${
            countryCodes.find((i) => i.value === company.country)
              ? countryCodes.find((i) => i.value === company.country).dial
              : ''
          }`
        : '',
      unitId: itemEdit ? '' : unitDTOList.length > 0 ? unitDTOList.find((i) => i.type === 'DEFAULT').uuid : '',
      roleLevel: 'USER',
    }),
    [itemEdit, countryCodes, unitDTOList, company.country]
  );

  const { submitForm, handleBlur, handleChange, errors, setFieldValue, values, setErrors, setValues } = useFormik({
    initialValues,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    validationSchema,
    onSubmit: onDone,
  });

  const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
      event.shiftKey === true ||
      key === 35 ||
      key === 36 || // Allow Shift, Home, End
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 46 || // Allow Backspace, Tab, Enter, Delete
      (key > 36 && key < 41) || // Allow left, up, right, down
      // Allow Ctrl/Command + A,C,V,X,Z
      ((event.ctrlKey === true || event.metaKey === true) &&
        (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
  };

  const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
      (key >= 48 && key <= 57) || // Allow number line
      (key >= 96 && key <= 105) // Allow number pad
    );
  };
  const onKeyDown = (e) => {
    if (!isNumericInput(e) && !isModifierKey(e)) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (values.country) {
      setFieldValue(
        'phone',
        `+${
          countryCodes.find((i) => i.value.toLowerCase() === values.country.toLowerCase())
            ? countryCodes.find((i) => i.value.toLowerCase() === values.country.toLowerCase()).dial
            : '1'
        }`
      );
    }
  }, [countryCodes, values.country]);

  useEffect(() => {
    if (itemEdit) {
      setValues(
        pick(itemEdit, [
          'email',
          'country',
          'discProfile',
          'firstName',
          'huntingFarmingRatio',
          'lastName',
          'manager',
          'phone',
          'unitId',
        ])
      );
    } else {
      setValues(initialValues);
    }
    setErrors({});
  }, [itemEdit, initialValues]);

  const onClose = useCallback(() => {
    setOpenModal(false);
    setErrors({});
    if (!itemEdit) {
      setValues(initialValues);
    } else {
      setValues(
        pick(itemEdit, [
          'email',
          'country',
          'discProfile',
          'firstName',
          'huntingFarmingRatio',
          'lastName',
          'manager',
          'phone',
          'unitId',
        ])
      );
    }
  }, [setOpenModal, setErrors, itemEdit, initialValues]);

  const roleLevelDropdown = [
    {
      key: 'USER',
      text: _l`User`,
      value: 'USER',
    },
    {
      key: 'UNIT',
      text: _l`Unit`,
      value: 'UNIT',
    },
    {
      key: 'COMPANY',
      text: _l`Company`,
      value: 'COMPANY',
    },
  ];
  return (
    <ModalCommon
      title={title}
      visible={openModal}
      className={css.editTaskModal}
      onDone={submitForm}
      onClose={onClose}
      okLabel={_l`Save`}
      scrolling={false}
      description={false}
    >
      <Form className={`position-unset`}>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`First name`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.firstName}
              id="firstName"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
              className={css.inputField}
              required
            />
            <span className="form-errors">{!!errors.firstName && _l`First name is required`}</span>
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Last name`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.lastName}
              id="lastName"
              name="lastName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
              className={css.inputField}
              required
            />
            <span className="form-errors">{!!errors.lastName && _l`Last name is required`}</span>
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Email`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.email}
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className={css.inputField}
              required
            />
            <span className="form-errors">{!values.email && _l`Email is required`}</span>

            <span className="form-errors">{values.email && !!errors.email && _l`Email is invalid`}</span>
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Country`}
          </div>
          <div className={css.inputWraper}>
            <CountryDropdown
              fluid
              value={values.country}
              onChange={(_, data) => setFieldValue('country', data.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Phone`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.phone}
              id="phone"
              name="phone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
              onKeyDown={onKeyDown}
              className={css.inputField}
              required
            />
            <span className="form-errors">{!values.phone && _l`Phone is required`}</span>

            <span className="form-errors">{values.phone && !!errors.phone && _l`Phone is invalid`}</span>
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Behavior profile`}
          </div>
          <div className={css.inputWraper}>
            <Form.Dropdown
              className={css.viewDropdownSelect}
              clearable
              fluid
              search
              placeholder="NONE"
              onChange={(_, data) => setFieldValue('discProfile', data.value)}
              selection
              text={values.discProfile}
              value={values.discProfile}
              options={discProfileOptions}
            />
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Unit`}
          </div>
          <div className={css.inputWraper}>
            <Form.Dropdown
              className={css.dropdownUser}
              clearable
              fluid
              search
              onChange={(_, data) => setFieldValue('unitId', data.value)}
              selection
              value={values.unitId}
              options={unitDTOList.map((i) => ({
                key: i.uuid,
                text: i.name == 'No Unit' || i.name == 'No unit' ? _l`No unit` : i.name,
                value: i.uuid,
                image: {
                  avatar: true,
                  src: i.avatar
                    ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${i.avatar.substr(i.avatar.length - 3)}/${
                        i.avatar
                      }`
                    : 'https://qa.salesbox.com/desktop/assets/img/non-sprite/Default_Photo.png',
                },
              }))}
            />
          </div>
        </Form.Group>

        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`User rights`}
          </div>
          <div className={classNames(css.inputWraper, css.viewCheckbox)}>
            {/* <Form.Checkbox
              onChange={(_, data) => setFieldValue('manager', !data.value)}
              value={values.manager}
              checked={values.manager}
            /> */}
            <Dropdown
              fluid
              selection
              value={values.roleLevel}
              options={roleLevelDropdown}
              onChange={(_, data) => setFieldValue('roleLevel', data.value)}
            />
          </div>
        </Form.Group>
      </Form>
    </ModalCommon>
  );
};

export default compose(
  memo,
  connect((state) => ({
    unitDTOList: isUnitDTOListOrganisation(state),
    countryCodes: getListCountryOptions(state),
    company: isCompanyOrganisation(state),
  }))
)(ModalUser);

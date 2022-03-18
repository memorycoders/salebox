import React, { useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { useFormik } from 'formik';
import { pick, isEmpty } from 'lodash';
import * as Yup from 'yup';
import _l from 'lib/i18n';

import css from './index.css';

const validationSchema = Yup.object({
  name: Yup.string().required(_l`Name is required`),
});

const ProductTypeModal = ({ onDone, visible, onClose, item }: any) => {
  const initialValues = {
    name: '',
  };

  const {
    submitForm,
    handleBlur,
    handleChange,
    errors,
    setFieldValue,
    values,
    resetForm,
    setErrors,
    setValues,
  } = useFormik({
    initialValues,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    validationSchema,
    onSubmit: onDone,
  });

  React.useEffect(() => {
    if (!isEmpty(item)) {
      setValues({
        name: item.name,
      });
    }
  }, [item]);

  React.useEffect(() => {
    !visible && resetForm();
  }, [visible]);

  return (
    <ModalCommon
      title={isEmpty(item) ? _l`Add Product Type` : _l`Update Product Type`}
      visible={visible}
      onDone={submitForm}
      size="tiny"
      onClose={onClose}
      okLabel={_l`Save`}
      scrolling={false}
      description={false}
    >
      <Form className={`position-unset`}>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Name`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.name}
              id="name"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              className={css.inputField}
              required
            />
            <span className="form-errors">{errors.name && _l`Name is required`}</span>
          </div>
        </Form.Group>
      </Form>
    </ModalCommon>
  );
};

export default React.memo(ProductTypeModal);

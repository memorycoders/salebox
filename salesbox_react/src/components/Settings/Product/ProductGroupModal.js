import React, { useMemo, useEffect } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { useFormik } from 'formik';
import { pick, isEmpty } from 'lodash';
import * as Yup from 'yup';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as NotificationActions from '../../Notification/notification.actions';

import css from './index.css';

const validationSchema = Yup.object({
  name: Yup.string().required(_l`Name is required`),
});

const ProductGroupModal = ({ onDone, visible, onClose, item, dispatch, title }: any) => {
  const [salesMethodDTOList, setSalesMethodDTOList] = React.useState([]);

  const initialValues = {
    name: '',
    saleMethod: {},
  };

  const fetchSaleMethod = async () => {
    try {
      const response = await api.get({
        resource: `administration-v3.0/salesMethod/listOur`,
      });
      setSalesMethodDTOList((response.salesMethodDTOList || []).filter((sale) => sale.using));
    } catch (error) {
      dispatch(NotificationActions.error(error.message, '', 2000));
    }
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
      setValues(
        {
          name: item.name,
          saleMethod: item.salesMethodDTO,
        },
        false
      );
    }
  }, [item]);

  React.useEffect(() => {
    !visible && resetForm();
    visible && fetchSaleMethod();
  }, [visible]);

  return (
    <ModalCommon
      title={title ? title : _l`Add Product Group`}
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
        {/* <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Sales process`}
          </div>
          <div className={css.inputWraper}>
            <Dropdown
              clearable
              fluid
              search
              onChange={(_, data) => setFieldValue('saleMethod', data.value)}
              selection
              text={values.saleMethod && values.saleMethod.name}
              // value={values.saleMethod}
              options={salesMethodDTOList.map((item) => ({
                key: item.uuid,
                text: item.name,
                value: item,
              }))}
            />
          </div>
        </Form.Group> */}
      </Form>
    </ModalCommon>
  );
};

export default compose(
  connect(null, (dispatch) => {
    return {
      dispatch,
    };
  })
)(ProductGroupModal);

import React, { useMemo, useEffect } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { useFormik } from 'formik';
import { pick, isEmpty } from 'lodash';
import * as Yup from 'yup';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import * as NotificationActions from '../../Notification/notification.actions';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getProductGroups, getProductTypes } from '../settings.selectors';
import css from './index.css';

const validationSchema = Yup.object({
  name: Yup.string().required(_l`Name is required`),
  price: Yup.string().required(_l`Price is required`),
  quantity: Yup.string().required(_l`No. of units is required`),
  group: Yup.object().required(_l`Product group is required`),
  type: Yup.object().required(_l`Product type is required`),
  margin: Yup.string(),
  costUnit: Yup.string(),
  description: Yup.string(),
});

const ProductModal = ({ onDone, visible, onClose, item, dispatch, productGroups, productTypes }: any) => {
  const [measurementTypeDTOList, setMeasurementTypeDTOList] = React.useState([]);
  const [customFieldDTOList, setCustomFieldDTOList] = React.useState([]);
  const [lineOfBusinessDTOList, setLineOfBusinessDTOList] = React.useState([]);

  const initialValues = {
    name: '',
    price: '',
    quantity: '',
    group: null,
    type: null,
    margin: '',
    costUnit: '',
    description: '',
  };

  const fetchSaleMethod = async () => {
    try {
      const [_lineOfBusinessDTOList, _customFieldDTOList, _measurementTypeDTOList] = await Promise.all([
        api.get({
          resource: `administration-v3.0/lineOfBusiness/list`,
        }),
        api.get({
          resource: `enterprise-v3.0/customField/listByObject`,
          query: {
            objectType: 'PRODUCT_REGISTER',
          },
        }),
        api.get({
          resource: `administration-v3.0/measurement/list`,
        }),
      ]);

      setLineOfBusinessDTOList(_lineOfBusinessDTOList.lineOfBusinessDTOList);
      setMeasurementTypeDTOList(_measurementTypeDTOList.measurementTypeDTOList);
      setCustomFieldDTOList(_customFieldDTOList.customFieldDTOList);
    } catch (error) {
      dispatch(NotificationActions.error(error.message, '', 2000));
    }
  };

  const _onDone = () => {
    console.log('test', item);
    onDone({
      productDTO: {
        ...item,
        lineOfBusinessId: values.group.uuid,
        measurementTypeId: values.type.uuid,
        measurementTypeName: values.type.name,
        name: values.name,
        price: values.price,
        quantity: values.quantity,
        description: values.description,
        costUnit: values.costUnit,
        margin: values.margin,
      },
      listCustomFieldDTOs: customFieldDTOList,
    });
  };

  const {
    submitForm,
    handleBlur,
    setFieldTouched,
    handleChange,
    errors,
    setFieldValue,
    getFieldMeta,
    values,
    resetForm,
    setErrors,
    setValues,
  } = useFormik({
    initialValues,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    validationSchema,
    onSubmit: _onDone,
  });

  const nameMeta = getFieldMeta('name');
  const priceMeta = getFieldMeta('price');
  const quantityMeta = getFieldMeta('quantity');
  const groupMeta = getFieldMeta('group');
  const typeMeta = getFieldMeta('type');
  const marginMeta = getFieldMeta('margin');
  const costUnitMeta = getFieldMeta('costUnit');
  const descriptionMeta = getFieldMeta('description');

  React.useEffect(() => {
    if (!isEmpty(item)) {
      setValues({
        ...item,
        group: (lineOfBusinessDTOList.length > 0 ? lineOfBusinessDTOList : productGroups).find(
          (i) => i.uuid === item.lineOfBusinessId
        ),
        type: (measurementTypeDTOList.length > 0 ? lineOfBusinessDTOList : productTypes).find(
          (i) => i.uuid === item.measurementTypeId
        ),
        description: item.description || '',
      });
    }
  }, [item]);

  React.useEffect(() => {
    !visible && resetForm();
    visible && fetchSaleMethod();
  }, [visible]);

  const handleCostChange = (e) => {
    const costUnit = e.target.value;
    const price = priceMeta.value;
    let margin = Number(((price - costUnit) / price) * 100).toFixed(2) || '0';

    if (price === '0') {
      margin = '0';
    }

    setFieldValue('costUnit', costUnit);
    setFieldValue('margin', margin === Infinity || margin === -Infinity ? '0' : margin);
  };

  const handleMarginChange = (e) => {
    const margin = e.target.value;
    const price = priceMeta.value;
    const costUnit = Number(margin * 100 - price);

    setFieldValue('margin', margin);
    setFieldValue('costUnit', costUnit);
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    const costUnit = costUnitMeta.value;
    let margin = Number(((price - costUnit) / price) * 100).toFixed(2) || '0';

    if (price === '0') {
      margin = '0';
    }

    setFieldValue('margin', margin === Infinity || margin === -Infinity ? '0' : margin);
    setFieldValue('price', price);
  };

  return (
    <ModalCommon
      title={isEmpty(item) ? _l`Add product` : _l`Update product`}
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
            {_l`Product group`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Dropdown
              clearable
              fluid
              search
              onChange={(_, data) => setFieldValue('group', data.value)}
              selection
              text={values.group && values.group.name}
              value={values.group}
              options={lineOfBusinessDTOList.map((item) => ({
                key: item.uuid,
                text: item.name,
                value: item,
              }))}
            />
            <span className="form-errors">{groupMeta.touched && !!errors.group && _l`Product group is required`}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Name`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={nameMeta.touched && errors.name}
              id="name"
              name="name"
              onChange={handleChange}
              onBlur={() => setFieldTouched('name')}
              value={values.name}
              className={css.inputField}
              required
            />
            <span className="form-errors">{nameMeta.touched && errors.name}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Price`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              type="number"
              error={priceMeta.touched && errors.price}
              id="price"
              name="price"
              onChange={handlePriceChange}
              onBlur={() => setFieldTouched('price')}
              value={values.price}
              className={css.inputField}
              required
            />
            <span className="form-errors">{priceMeta.touched && errors.price}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`No. of units`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              type="number"
              error={quantityMeta.touched && errors.quantity}
              id="quantity"
              name="quantity"
              onChange={handleChange}
              onBlur={() => setFieldTouched('quantity')}
              value={values.quantity}
              className={css.inputField}
              required
            />
            <span className="form-errors">{quantityMeta.touched && errors.quantity}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Product type`}
            <span className={css.required}>*</span>
          </div>
          <div className={css.inputWraper}>
            <Dropdown
              clearable
              fluid
              search
              onChange={(_, data) => setFieldValue('type', data.value)}
              selection
              text={values.type && values.type.name}
              value={values.type}
              options={measurementTypeDTOList.map((item) => ({
                key: item.uuid,
                text: item.name,
                value: item,
              }))}
            />
            <span className="form-errors">{typeMeta.touched && !!errors.type && _l`Product type is required`}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Margin: (%)`}
            {/* <span className={css.required}>*</span> */}
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              type="number"
              error={costUnitMeta.touched && errors.costUnit && priceMeta.touched && errors.price}
              id="margin"
              name="margin"
              onBlur={() => setFieldTouched('margin')}
              value={values.margin}
              onChange={handleMarginChange}
              className={css.inputField}
              // required
            />
            <span className="form-errors">
              {costUnitMeta.touched && errors.costUnit && priceMeta.touched && errors.price && errors.margin}
            </span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Cost/Unit`}
            {/* <span className={css.required}>*</span> */}
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              type="number"
              error={costUnitMeta.touched && errors.costUnit}
              onChange={handleCostChange}
              id="costUnit"
              name="costUnit"
              onBlur={() => setFieldTouched('costUnit')}
              value={values.costUnit}
              className={css.inputField}
              // required
            />
            <span className="form-errors">{costUnitMeta.touched && errors.costUnit}</span>
          </div>
        </Form.Group>
        <Form.Group className={css.formField}>
          <div className={css.label} width={6}>
            {_l`Description`}
          </div>
          <div className={css.inputWraper}>
            <Form.Input
              error={!!errors.description}
              id="description"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              className={css.inputField}
            />
            <span className="form-errors">{errors.description}</span>
          </div>
        </Form.Group>
      </Form>
    </ModalCommon>
  );
};

export default compose(
  connect(
    (state) => ({
      productGroups: getProductGroups(state),
      productTypes: getProductTypes(state),
    }),
    (dispatch) => {
      return {
        dispatch,
      };
    }
  )
)(ProductModal);

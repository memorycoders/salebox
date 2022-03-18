import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';
import api from 'lib/apiClient';
import * as NotificationActions from '../../Notification/notification.actions';

import TableHeader from './TableHeader';
import ProductMenu from './ProductMenu';
import ProductTypeModal from './ProductTypeModal';

import { setSelectedProductTypes, deleteProductType, requestFetchProductsSettings } from '../settings.actions';
import { getProductTypes } from '../settings.selectors';
import css from './index.css';

const ProductTypes = ({
  productTypes,
  _onClickRow,
  selectedProductTypes,
  handleDeleteAction,
  handleAddProductType,
  handleUpdateProductType,
}: any) => {
  const [listData, setListData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    setListData(productTypes.filter((item) => item.name.toLowerCase().includes(searchValue.trim().toLowerCase())));
  }, [productTypes, searchValue]);

  const onInputChange = (text) => {
    setSearchValue(text);
  };

  const _getItemNameStyle = (item) =>
    selectedProductTypes.some((p) => p.uuid === item.uuid) ? css.selectedItem : css.item;

  const onClickAdd = () => setAddModalVisible(true);

  const _handleAddProductType = async (item) => {
    if (editItem) {
      await handleUpdateProductType({
        ...item,
        uuid: editItem.uuid,
      });
    } else {
      await handleAddProductType(item);
    }
    setAddModalVisible(false);
    setEditItem(null);
  };

  const _handleUpdateAction = (item) => {
    setEditItem(item);
    setAddModalVisible(true);
  };

  const _onCloseModal = () => {
    setAddModalVisible(false);
    setEditItem(null);
  };

  return (
    <div className={css.topTable}>
      <TableHeader
        inputPlaceholder={_l`Search for products types`}
        title={_l`Product types`}
        onInputChange={onInputChange}
        onClickAdd={onClickAdd}
        searchValue={searchValue}
      />
      <div className={css.bodyContainer}>
        {listData.map((item) => {
          return (
            <div key={item.uuid} style={{ position: 'relative' }}>
              <div onClick={(e) => _onClickRow(e, item)} className={cx(css.listItem, css.itemHover)}>
                <div className={css.columnLeft}>
                  {item.name === 'Resource' ? (
                    <p className={_getItemNameStyle(item)}>{_l`Resource`}</p>
                  ) : (
                    <p className={_getItemNameStyle(item)}>{item.name}</p>
                  )}
                </div>
              </div>
              <div className={css.columnRight}>
                <ProductMenu
                  deleteConfirmText={_l`Do you really want to delete this product type? All products of this type will be deleted`}
                  deleteAction={() => handleDeleteAction(item)}
                  updateAction={() => _handleUpdateAction(item)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {isAddModalVisible && (
        <ProductTypeModal
          title={editItem ? _l`Update Product Type` : _l`Add Product Type`}
          onDone={_handleAddProductType}
          onClose={_onCloseModal}
          visible={isAddModalVisible}
          item={editItem}
        />
      )}
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      productTypes: getProductTypes(state),
      selectedProductTypes: state.settings.products ? state.settings.products.selectedProductTypes : [],
    }),
    (dispatch) => {
      return {
        dispatch,
        setSelectedProductTypes,
        deleteProductType,
      };
    }
  ),
  withHandlers({
    _onClickRow: ({ dispatch, selectedProductTypes }) => (event, item) => {
      console.log('item', event.target);
      const index = selectedProductTypes.indexOf(item);
      const temp = [...selectedProductTypes];
      if (~index) {
        temp.splice(index, 1);
      } else {
        temp.push(item);
      }
      dispatch(setSelectedProductTypes(temp));
    },
    handleDeleteAction: ({ dispatch, deleteProductType }) => (item) => {
      dispatch(deleteProductType(item));
    },
    handleAddProductType: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/measurement/add`,
          data: {
            name: item.name,
          },
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Added`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
    handleUpdateProductType: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/measurement/update`,
          data: {
            name: item.name,
            uuid: item.uuid,
          },
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Updated`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
  })
)(ProductTypes);

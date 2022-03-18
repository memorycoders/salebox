import React, { useState, useEffect } from 'react';
import { Grid, Table, Rating, Label, Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import api from 'lib/apiClient';
import * as NotificationActions from '../../Notification/notification.actions';
import cx from 'classnames';
import ProductMenu from './ProductMenu';
import { getProducts } from '../settings.selectors';
import { deleteProductItem, requestFetchProductsSettings } from '../settings.actions';
import TableHeader from './TableHeader';
import ProductModal from './ProductModal';

import css from './index.css';

const Products = ({ products, _handleDeleteAction, handleAddProduct, handleUpdateProduct }: any) => {
  const [listData, setListData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    setListData(products.filter((item) => item.name.toLowerCase().includes(searchValue.trim().toLowerCase())));
  }, [products, searchValue]);

  const onClickAdd = () => setAddModalVisible(true);

  const onInputChange = (text) => {
    setSearchValue(text);
  };

  const _onCloseModal = () => {
    setAddModalVisible(false);
    setEditItem(null);
  };

  const _handleAddProduct = async (item) => {
    if (!isEmpty(editItem)) {
      await handleUpdateProduct(item);
    } else {
      await handleAddProduct(item);
    }
    setAddModalVisible(false);
    setEditItem(null);
  };

  const _handleUpdateAction = (item) => {
    setEditItem(item);
    setAddModalVisible(true);
  };

  return (
    <div className={css.topTable}>
      <TableHeader
        searchValue={searchValue}
        inputPlaceholder={_l`Search for products`}
        title={_l`Products`}
        onClickAdd={onClickAdd}
        onInputChange={onInputChange}
      />
      <div className={css.bodyContainer}>
        {listData.map((item) => {
          return (
            <div key={item.uuid} style={{ position: 'relative' }}>
              <div className={cx(css.listItem, css.itemHover)}>
                <div className={css.columnLeft}>
                  <p className={css.item}>{item.name}</p>
                </div>
              </div>
              <div className={css.columnRight}>
                <ProductMenu
                  deleteConfirmText={_l`Do you really want to delete this product?`}
                  deleteAction={() => _handleDeleteAction(item)}
                  checkType
                  showDelete={!item.resource}
                  updateAction={() => _handleUpdateAction(item)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {isAddModalVisible && (
        <ProductModal onDone={_handleAddProduct} onClose={_onCloseModal} visible={isAddModalVisible} item={editItem} />
      )}
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      products: getProducts(state),
    }),
    (dispatch) => {
      return {
        dispatch,
        deleteProductItem,
      };
    }
  ),
  withHandlers({
    _handleDeleteAction: ({ dispatch, deleteProductItem }) => (item) => {
      dispatch(deleteProductItem(item));
    },
    handleAddProduct: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/product/addCustomField`,
          data: item,
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Added`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
    handleUpdateProduct: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/product/updateCustomField`,
          data: item,
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Updated`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
  })
)(Products);

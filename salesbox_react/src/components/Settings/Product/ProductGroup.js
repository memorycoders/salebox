import React, { useEffect, useState } from 'react';
import * as NotificationActions from '../../Notification/notification.actions';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import cx from 'classnames';
import { sortBy, isEmpty } from 'lodash';

import TableHeader from './TableHeader';
import ProductMenu from './ProductMenu';
import ProductSortMenu from './ProductSortMenu';
import ProductModal from './ProductModal';

import api from 'lib/apiClient';
import { PRODUCT_SORT_ITEMS } from '../../../Constants';
import { getProducts } from '../settings.selectors';
import { deleteProductItem, requestFetchProductsSettings } from '../settings.actions';
import css from './index.css';

String.prototype.convertMoney = function() {
  if (isNaN(this) || this === 'Nan') {
    return '0';
  }

  return this.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function isValidWebUrl(url) {
  const regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return regEx.test(url);
}

// default sort by product name
const DEFAULT_SORT = PRODUCT_SORT_ITEMS[0].key;
const PRICE_SORT_KEY = 'price';

const ProductGroup = ({
  products,
  selectedProductGroups,
  _handleDeleteAction,
  dispatch,
  handleUpdateProduct,
  handleAddProduct,
}: any) => {
  const [listData, setListData] = useState([]);
  const [sortKey, setSortKey] = useState(DEFAULT_SORT);
  const [searchValue, setSearchValue] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    let newList = sortBy(products, sortKey).filter((item) =>
      item.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    if (sortKey === PRICE_SORT_KEY || sortKey === 'margin' || sortKey === 'quantity') {
      newList = newList.reverse();
    }
    setListData(newList);
  }, [products, sortKey, searchValue]);

  const onClickAdd = () => setAddModalVisible(true);

  const onInputChange = (text) => {
    setSearchValue(text);
  };

  const _handleUpdateAction = (item) => {
    setEditItem(item);
    setAddModalVisible(true);
  };

  const handleSort = (key) => {
    setSortKey(key);
  };

  const changeItemStatus = async (item) => {
    try {
      await api.post({
        resource: `administration-v3.0/product/changeActiveStatus`,
        query: {
          activeStatus: !item.active,
          uuid: item.uuid,
        },
      });
      setListData(
        listData.map((i) =>
          i.uuid === item.uuid
            ? {
                ...i,
                active: !i.active,
              }
            : i
        )
      );
    } catch (error) {
      dispatch(NotificationActions.error(error.message, '', 2000));
    }
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

  return (
    <div className={css.table}>
      <TableHeader
        searchValue={searchValue}
        width={'30%'}
        inputPlaceholder={_l`Search for products`}
        title={_l`Products`}
        onInputChange={onInputChange}
        onClickAdd={onClickAdd}
      >
        {selectedProductGroups.length === 1 && selectedProductGroups[0].name !== 'Resource' &&(
          <span className={css.selectedGroupName}>{selectedProductGroups[0].name}</span>
        )}
        {selectedProductGroups.length === 1 && selectedProductGroups[0].name === 'Resource' && (
          <span className={css.selectedGroupName}>{_l`Resource`}</span>
        )}
      </TableHeader>
      <table style={{ width: '100%' }}>
        <tr className={css.tableHeader}>
          <th style={{ flex: 2, textAlign: 'start' }} className={css.headerItem}>
            {_l`Product`}
          </th>
          <th style={{ flex: 2 }} className={css.headerItem}>
            {_l`Type`}
          </th>
          <th style={{ flex: 2 }} className={css.headerItem}>
            {_l`Description`}
          </th>
          <th className={css.headerItem}>{_l`Price`}</th>
          <th className={css.headerItem}>{_l`No. of units`}</th>
          <th className={css.headerItem}>{_l`Margin`}</th>
          <th className={css.headerItem}>
            <p>{_l`Active`}</p>
          </th>
          <th style={{ display: 'flex', justifyContent: 'center' }} className={css.headerItem}>
            <ProductSortMenu sortKey={sortKey} sortAction={handleSort} />
          </th>
        </tr>
        <div style={{ paddingTop: '20px', padding: '15px' }}>
          {listData.map((item) => {
            return (
              <tr className={cx(css.listItem, css.itemHover)} key={item.uuid}>
                <td style={{ flex: 2, textAlign: 'start' }} className={css.bodyItem}>
                  <p className={css.productItem}>{item.name}</p>
                </td>
                <td style={{ flex: 2 }} className={css.bodyItem}>
                  <p className={css.productItem}>{item.measurementTypeName}</p>
                </td>
                <td style={{ flex: 2 }} className={css.bodyItem}>
                  {isValidWebUrl(item.description) ? (
                    <a target="_blank" rel="noreferrer" href={item.description} className={css.description}>
                      {item.description}
                    </a>
                  ) : (
                    <p className={css.productItem}>{item.description}</p>
                  )}
                </td>
                <td className={css.bodyItem}>
                  <p className={css.productItem}>{item.price.toString().convertMoney()}</p>
                </td>
                <td className={css.bodyItem}>
                  <p className={css.productItem}>{item.quantity.toString().convertMoney()}</p>
                </td>
                <td className={css.bodyItem}>
                  <p className={css.productItem}>{item.margin.toString().convertMoney()}</p>
                </td>
                <td style={{ display: 'flex', justifyContent: 'center' }} className={css.bodyItem}>
                  {/* <div className={css.using}> */}
                  <div onClick={() => !item.resource && changeItemStatus(item)}>
                    {item.active ? (
                      <div className={css.setDone}>
                        <div />
                      </div>
                    ) : (
                      <div className={css.notSetasDone}>
                        <div />
                      </div>
                    )}
                  </div>
                  {/* </div> */}
                </td>
                <td className={css.columnCenter}>
                  <ProductMenu
                    checkType
                    showDelete={!item.resourceId}
                    deleteConfirmText={_l`Do you really want to delete this product?`}
                    deleteAction={() => _handleDeleteAction(item)}
                    updateAction={() => _handleUpdateAction(item)}
                  />
                </td>
              </tr>
            );
          })}
        </div>
      </table>
      {isAddModalVisible && (
        <ProductModal
          title={editItem ? _l`Update product` : _l`Add product`}
          onDone={_handleAddProduct}
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
      products: getProducts(state),
      selectedProductGroups: state.settings.products ? state.settings.products.selectedProductGroups : [],
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
)(ProductGroup);

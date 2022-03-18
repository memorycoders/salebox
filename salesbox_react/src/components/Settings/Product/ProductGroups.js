import React, { useEffect, useState } from 'react';
import { Grid, Table, Rating, Label, Menu, Icon } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';
import api from 'lib/apiClient';
import * as NotificationActions from '../../Notification/notification.actions';
import { isEmpty } from 'lodash';

import TableHeader from './TableHeader';
import ProductMenu from './ProductMenu';
import ProductGroupModal from './ProductGroupModal';

import { setSelectedProductGroups, deleteProductGroup, requestFetchProductsSettings } from '../settings.actions';
import { getProductGroups } from '../settings.selectors';

import css from './index.css';

const ProductGroups = ({
  productGroups,
  _onClickRow,
  selectedProductGroups,
  _handleDeleteAction,
  handleUpdateProductGroup,
  handleAddProductGroup,
}: any) => {
  const [listData, setListData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    setListData(productGroups.filter((item) => item.name.toLowerCase().includes(searchValue.trim().toLowerCase())));
  }, [productGroups, searchValue]);

  const onInputChange = (text) => {
    setSearchValue(text);
  };

  const onClickAdd = () => setAddModalVisible(true);

  const _getItemNameStyle = (item) =>
    selectedProductGroups.some((p) => p.uuid === item.uuid) ? css.selectedItem : css.item;

  const _handleAddProductGroup = async (item) => {
    if (editItem) {
      await handleUpdateProductGroup({
        ...editItem,
        name: item.name,
      });
    } else {
      await handleAddProductGroup(item);
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
        inputPlaceholder={_l`Search for products groups`}
        title={_l`Product groups`}
        onInputChange={onInputChange}
        onClickAdd={onClickAdd}
        searchValue={searchValue}
      />
      <div className={css.bodyContainer}>
        {listData.map((item) => {
          return (
            <div key={item.uuid} style={{ position: 'relative' }}>
              <div onClick={() => _onClickRow(item)} className={cx(css.listItem, css.itemHover)}>
                <div className={css.columnLeft}>
                  {item.name === 'Resource' ? (
                    <p className={_getItemNameStyle(item)}>{_l`Resource`}</p>
                  ) : (
                    <p className={_getItemNameStyle(item)}>{item.name}</p>
                  )}
                </div>
                <div className={css.columnCenter}>
                  <p className={css.item}>{`${item.numberActiveProducts}/${item.numberOfProducts} ${_l`product`}`}</p>
                </div>
              </div>
              <div className={css.columnRight}>
                <ProductMenu
                  deleteConfirmText={_l`Do you really want to delete this product group? All products in the group will also be deleted`}
                  deleteAction={() => _handleDeleteAction(item)}
                  updateAction={() => _handleUpdateAction(item)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {isAddModalVisible && (
        <ProductGroupModal
          title={editItem ? _l`Update Product Group` : _l`Add Product Group`}
          onDone={_handleAddProductGroup}
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
      productGroups: getProductGroups(state),
      selectedProductGroups: state.settings.products ? state.settings.products.selectedProductGroups : [],
    }),
    (dispatch) => {
      return {
        dispatch,
        setSelectedProductGroups,
        deleteProductGroup,
      };
    }
  ),
  withHandlers({
    _onClickRow: ({ dispatch, selectedProductGroups }) => (item) => {
      const index = selectedProductGroups.indexOf(item);
      const temp = [...selectedProductGroups];
      if (~index) {
        temp.splice(index, 1);
      } else {
        temp.push(item);
      }
      dispatch(setSelectedProductGroups(temp));
    },
    _handleDeleteAction: ({ dispatch, deleteProductGroup }) => (item) => {
      dispatch(deleteProductGroup(item));
    },
    handleAddProductGroup: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/lineOfBusiness/add`,
          data: {
            name: item.name,
            salesMethodDTO: isEmpty(item.saleMethod) ? undefined : item.saleMethod,
          },
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Added`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
    handleUpdateProductGroup: ({ dispatch }) => async (item) => {
      try {
        await api.post({
          resource: `administration-v3.0/lineOfBusiness/update`,
          data: item,
        });
        dispatch(requestFetchProductsSettings());
        dispatch(NotificationActions.success(_l`Updated`, '', 2000));
      } catch (error) {
        dispatch(NotificationActions.error(error.message, '', 2000));
      }
    },
  })
)(ProductGroups);

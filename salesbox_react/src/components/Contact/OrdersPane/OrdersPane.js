import * as React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { compose, pure, withState, withHandlers, lifecycle } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import { Message } from 'semantic-ui-react';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';
import { Menu, Popup, Loader } from 'semantic-ui-react';
import { Collapsible } from 'components';
import QualifiedItem from '../../../essentials/List/Qualified/QualifiedItem';
import { requestFetchAccountOrder, loadMoreOrderRows, sortOrderSublist } from '../../Organisation/organisation.actions';
import { requestFetchContactOrder, loadMoreOrderContactRows } from '../contact.actions';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import FilterActionMenu from '../../../essentials/Menu/FilterActionMenu';
import piplineSvg from '../../../../public/Pipeline.svg';
import css from '../../Organisation/Cards/TasksCard.css';
import ProductItem from '../../PipeLineQualifiedDeals/Products/ProductElement';
import cx from 'classnames';
import '../../PipeLineQualifiedDeals/Products/Products.less';
import * as ContactActions from '../contact.actions';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Orders: 'Orders',
    Products: 'Products',
  },
});

const iconStyle = {
  height: 15,
  width: 15,
};

const RightMenu = ({ product, setTagManual, setProduct, objectType, data }) => {
  return (
    <>
      <Menu.Item className={cx(css.rightIcon)}>
        {objectType === ObjectTypes.Account && (
          <FilterActionMenu
            data={data}
            setTagManual={setTagManual}
            imageClass={css.historyIcon}
            objectType={ObjectTypes.AccountOrder}
          />
        )}
        {objectType === ObjectTypes.Contact && (
          <FilterActionMenu
            data={data}
            setTagManual={setTagManual}
            imageClass={css.historyIcon}
            objectType={ObjectTypes.ContactOrder}
          />
        )}
      </Menu.Item>
      <Menu.Item
        className={cx(css.rightIcon, product && css.circleAvtive)}
        onClick={() => {
          setProduct(!product);
        }}
      >
        <Popup hoverable position="top right" trigger={<img style={iconStyle} src={piplineSvg} />}>
          <Popup.Content>
            <p>{_l`Products`}</p>
          </Popup.Content>
        </Popup>
      </Menu.Item>
    </>
  );
};
const OrdersPane = ({
  data,
  dataInList,
  objectType,
  product,
  setTagManual,
  setProduct,
  loadMoreRows,
  orderBy,
  handleOrderBy,
  route,
  isFetching,
}: PropsType) => {
  let pageIndexSection = 0;
  let objectMerge = data;
  if (dataInList) {
    objectMerge = {
      ...data,
      ...dataInList,
    };
  }
  let overviewType = OverviewTypes.Account_Order;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewType = OverviewTypes.Account_Order;
      break;
    case ObjectTypes.Contact:
      overviewType = OverviewTypes.Contact_Order;
      break;
    default:
      break;
  }
  const { orders, orderRows = [], totalOrderRow = 0 } = objectMerge;

  if (!orders || (orders && orders.length === 0)) {
    return (
      <Collapsible count="0" width={308} padded title={_l`Orders`}>
        {isFetching ? (
          <div className={isFetching && `isFetching`}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No orders`}
          </Message>
        )}
      </Collapsible>
    );
  }

  return (
    <Collapsible
      right={
        <RightMenu
          data={data}
          setProduct={setProduct}
          setTagManual={setTagManual}
          product={product}
          objectType={objectType}
        />
      }
      count={orders ? orders.length : ''}
      open={true}
      width={308}
      title={product ? _l`Products` : _l`Orders`}
    >
      {isFetching ? (
        <div className={isFetching && `isFetching`}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          {!product ? (
            <>
              <QualifiedItem isOrder header orderBy={orderBy} setOrderBy={handleOrderBy} />
              {(orders ? orders : []).map((value) => {
                return <QualifiedItem route={route} overviewType={overviewType} isOrder qualifiedDeal={value} />;
              })}
            </>
          ) : (
            <>
              <ProductItem header />
              <InfiniteLoader
                autoReload={true}
                isRowLoaded={isRowRender(orderRows)}
                loadMoreRows={(param) => {
                  const { stopIndex } = param;

                  const pageIndex = Math.ceil(stopIndex / 10) - 1;
                  if (pageIndexSection < pageIndex) {
                    pageIndexSection = pageIndex;

                    loadMoreRows(pageIndex);
                  }
                }}
                threshold={2}
                rowCount={totalOrderRow}
              >
                {({ onRowsRendered, registerChild }) => {
                  return (
                    <List
                      height={300}
                      className={css.list}
                      rowCount={orderRows.length}
                      rowHeight={55}
                      width={308}
                      ref={registerChild}
                      // style={{
                      //   backgroundColor: 'rgb(227, 227, 227)',
                      //   transition: 'background-color 0.2s ease',
                      // }}
                      onRowsRendered={onRowsRendered}
                      rowRenderer={getRowRender(orderRows, overviewType)}
                      threshold={300}
                      data={orderRows}
                    />
                  );
                }}
              </InfiniteLoader>
              {/* {(orderRowList ? orderRowList : []).map((product) => {
            return ;
          })} */}
            </>
          )}
        </>
      )}
    </Collapsible>
  );
};

const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
};

const getRowRender = (quotes, overviewType) => ({ index, style }) => {
  const product = quotes[index];

  if (!product) {
    return null;
  }
  // const patchedStyle = {
  //   ...style,
  //   left: style.left + grid,
  //   top: style.top + grid,
  //   width: `calc(${style.width} - ${grid * 2}px)`,
  //   height: style.height - grid,
  // };
  return <ProductItem overviewType={overviewType} style={style} product={product} />;
};

const mapDispatchToProps = (dispatch, { objectType }) => {
  return {
    loadMoreOrderRows: (id, pagenIndex) => {
      const func =
        objectType === ObjectTypes.Account
          ? loadMoreOrderRows
          : objectType === ObjectTypes.Contact
          ? loadMoreOrderContactRows
          : loadMoreOrderContactRows;
      dispatch(func(id, pagenIndex));
    },
    requestFetchOrder: (id) => {
      const func =
        objectType === ObjectTypes.Account
          ? requestFetchAccountOrder
          : objectType === ObjectTypes.Contact
          ? requestFetchContactOrder
          : requestFetchContactOrder;
      dispatch(func(id));
    },
    // sort in sublist Account
    sortOrderSublist: (uuid, orderBy) => {
      dispatch(sortOrderSublist(uuid, orderBy));
    },
    // sort in sublist Contact
    sortOrderSublistInContact: (uuid, orderBy) => {
      dispatch(ContactActions.sortOrderSublist(uuid, orderBy));
    },
  };
};

export default compose(
  connect((state, { data, objectType }) => {
    return {
      dataInList:
        objectType === ObjectTypes.Account
          ? state.entities.organisation[data.uuid]
          : objectType === ObjectTypes.Contact
          ? state.entities.contact[data.uuid]
          : state.entities.contact[data.uuid],

/*
      isFetching:
        objectType === ObjectTypes.Account
          ? state.overview.ACCOUNTS.isFetching
          : objectType === ObjectTypes.Contact
          ? state.overview.CONTACTS.isFetching
          : false,
*/
    };
  }, mapDispatchToProps),
  withState('product', 'setProduct', false),
  withState('orderBy', 'setOrderBy', 'dateAndTime'),
  withHandlers({
    loadMoreRows: ({ loadMoreOrderRows, data }) => (pageIndex) => {
      loadMoreOrderRows(data.uuid, pageIndex);
    },
    handleOrderBy: ({ setOrderBy, data, sortOrderSublist, sortOrderSublistInContact, objectType }) => (orderBy) => {
      setOrderBy(orderBy);
      if (objectType === ObjectTypes.Account) {
        sortOrderSublist(data.uuid, orderBy);
      } else if (objectType === ObjectTypes.Contact) {
        sortOrderSublistInContact(data.uuid, orderBy);
      }
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchOrder, data } = this.props;
      if (data.uuid !== nextProps.data.uuid) {
        requestFetchOrder(nextProps.data.uuid);
      }
      if (nextProps.objectType === ObjectTypes.Account) {
        nextProps.sortOrderSublist(nextProps.data.uuid, nextProps.orderBy);
      } else if (nextProps.objectType === ObjectTypes.Contact) {
        nextProps.sortOrderSublistInContact(nextProps.data.uuid, nextProps.orderBy);
      }
    },
  }),
  withGetData(({ requestFetchOrder, data }) => () => {
    requestFetchOrder(data.uuid);
  }),
  pure
)(OrdersPane);

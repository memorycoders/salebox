//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import { Menu, Image, Icon, Loader } from 'semantic-ui-react';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import cx from 'classnames';
import * as OverviewActions from 'components/Overview/overview.actions';
import { withGetData } from 'lib/hocHelpers';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { API_URL } from '../../../lib/apiClient';
import * as QualifiedActions from '../qualifiedDeal.actions';
import _l from 'lib/i18n';
import './Products.less';
import css from '../Cards/TasksCard.css';
import ProductItem from './ProductElement';
import editSvg from '../../../../public/Edit.svg';
import exportSvg from '../../../../public/export.svg';
import { addDownload } from '../../../store/local-download.reducer';
import { fetchListByProspect } from '../../../components/OrderRow/order-row.actions';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Products: 'Products',
  },
});

const ICON_STYLE = {
  fontSize: 15,
  margin: '0px',
  height: '15px',
  color: 'rgb(117, 117, 117)',
  width: '15px',
  marginBottom: 3,
};

const RightMenu = ({ updateProducts, addDownload }) => {
  return (
    <>
      <Menu.Item onClick={addDownload} className={cx(css.rightIcon)}>
        <Icon style={ICON_STYLE} name="file excel" />
      </Menu.Item>
      <Menu.Item className={`${css.rightIcon} ${css.mr2}`} onClick={updateProducts}>
        <Image className={css.historyIcon} src={editSvg} />
      </Menu.Item>
    </>
  );
};

const ProductsCard = ({
  addDownload,
  objectType,
  qualifiedInList,
  qualifiedDeal,
  overviewType,
  updateProducts,
  isFetching,
}) => {
  let objectMerge = qualifiedDeal;
  if (qualifiedInList) {
    objectMerge = {
      ...qualifiedInList,
      ...qualifiedDeal,
    };
  }
  const { products } = objectMerge;
  // if (unqualifiedDeal.countOfActiveTask === 0 || tasks && tasks.length === 0) {
  if (!products || products.length === 0) {
    return (
      <Collapsible count="0" width={308} title={_l`Products`} padded rightClassName={css.headerRight}>
        <div className={isFetching ? `isFetching` : ''}>
          {isFetching ? (
            <Loader active={isFetching}>Loading</Loader>
          ) : (
            <Message active info>
              {_l`No products`}
            </Message>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible
      rightClassName={css.headerRight}
      right={<RightMenu updateProducts={updateProducts} addDownload={addDownload} />}
      width={308}
      title={_l`Products`}
      count={products ? products.length : ''}
      open={true}
    >
      <div className={isFetching ? `isFetching` : ''}>
        {isFetching ? (
          <Loader active={isFetching}>Loading</Loader>
        ) : (
          <>
            <ProductItem header />
            {(products ? products : []).map((product) => {
              return <ProductItem overviewType={overviewType} product={product} key={product.uuid} />;
            })}
          </>
        )}
      </div>
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchProducts: QualifiedActions.requestFetchProducts,
  addDownload,
  fetchListByProspect,
  highlight: OverviewActions.highlight,
};

export default compose(
  connect((state, { qualifiedDeal }) => {
    const commonData = state.entities.qualifiedDeal.__COMMON_DATA;
    const auth = state.auth;
    return {
      qualifiedInList: state.entities.qualifiedDeal[qualifiedDeal.uuid],
      taskRefesh: commonData ? commonData.taskRefesh : 0,
      auth,
      isFetching: state.overview.PIPELINE_QUALIFIED ? state.overview.PIPELINE_QUALIFIED.isFetching : false,
    };
  }, mapDispatchToProps),
  //orderBy
  withGetData(({ requestFetchProducts, qualifiedDeal }) => () => {
    requestFetchProducts(qualifiedDeal.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchProducts, qualifiedDeal } = this.props;
      if (qualifiedDeal.uuid !== nextProps.qualifiedDeal.uuid) {
        requestFetchProducts(nextProps.qualifiedDeal.uuid);
      }
    },
  }),
  withHandlers({
    updateProducts: ({ highlight, qualifiedDeal, fetchListByProspect, overviewType }) => () => {
      fetchListByProspect(qualifiedDeal.uuid);
      if (qualifiedDeal && qualifiedDeal.won === null) {
        highlight(OverviewTypes.Pipeline.Qualified, qualifiedDeal.uuid, 'editProducts');
      } else if (qualifiedDeal && qualifiedDeal.won !== null) {
        highlight(OverviewTypes.Pipeline.Order, qualifiedDeal.uuid, 'editProducts');
      }
    },
    addDownload: ({ addDownload, auth, qualifiedDeal }) => () => {
      addDownload(
        API_URL +
          '/' +
          Endpoints.Prospect +
          '/exportNewOpportunity?token=' +
          auth.token +
          '&uuid=' +
          qualifiedDeal.uuid +
          '&enterpriseID=' +
          auth.enterpriseID
      );
    },
  })
)(ProductsCard);


// @flow
import * as React from 'react';
import { compose, branch, renderComponent, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import _l from 'lib/i18n';
import { RECURRING } from '../../../Constants';
addTranslations({
  'en-US': {
    'Start': 'Start',
    'End': 'End',
    'No. units': 'No. units',
    'Price': 'Price',
    Product: 'Product',
    Total: 'Total'
  },
});

type PropsT = {
  task: {},
  onClose: () => void,
  onOpen: () => void,
  open: boolean,

};

const ProductHeader = () => {

  return <div className="product-item header-product">
    <div className="product-name common-item">
      {_l`Product`}
    </div>
    {/* <div className="product-time common-item">
      <div className="column-product">
        <div><span>{_l`Start`}</span>:{' '}{moment(product.deliveryStartDate).format('DD MMM, YYYY')}</div>
        <div><span>{_l`End`}</span>:{' '}{moment(product.deliveryEndDate).format('DD MMM, YYYY')}</div>
      </div>
    </div> */}
    <div className="right-content">
      <div className="top-container">
        <div className="product-unit common-item">
          {_l`No. units`}
        </div>
        <div className="product-unit common-item">
          {_l`Price`}
        </div>
        <div className="product-value common-item">
          {_l`Total`}
        </div>
      </div>
    </div>
  </div>
};

const ProductItem = ({
  product,
  style
}: PropsT) => {

  const { productDTO, description } = product;

  const calculateValue = (product) => {
    let _value = Number( product.type === RECURRING && product.periodNumber ? product.periodNumber * product.price * product.numberOfUnit : product.price * product.numberOfUnit ) - (product.discountPercent * product.price * product.numberOfUnit/100)
    return Math.ceil(_value).toString().convertMoney()
  }

  const memoizedCalculateValue = React.useMemo(() => calculateValue(product), [product]);

  return <div style={style} className="product-item">
      <div className="product-name common-item">
        {/* <div className="step-progress">
          <div className="progress-line" />
          <div className={`circle progress-status circle-green`} />
          <div className="progress-line" />
        </div> */}
        <div className="product-name-text">
          {productDTO.name}
        </div>
      </div>
      {/* <div className="product-time common-item">
      <div className="column-product">
        <div><span>{_l`Start`}</span>:{' '}{moment(product.deliveryStartDate).format('DD MMM, YYYY')}</div>
        <div><span>{_l`End`}</span>:{' '}{moment(product.deliveryEndDate).format('DD MMM, YYYY')}</div>
      </div>
    </div> */}
      <div className="right-content">
      <div className="top-container">
        <div className="product-unit common-item">
          <div className="column-product">
            <div>{product.numberOfUnit}</div>
           
          </div>
        </div>
        <div className="product-unit common-item">
          <div>{product.price}</div>
        </div>
        <div className="product-value common-item">
          <div className="text-value">{memoizedCalculateValue}</div>
        </div>
        </div>
    
        {description && description.startsWith('http') ? <a className="description-product" target="_blank" href={description}>{description}</a> : <div className="description-product">{description}</div>}
        
      </div>
    </div>
};

const mapDispatchToProps = {
  highlight: OverviewActions.highlight
};

export default compose(
  branch(({ header }) => header, renderComponent(ProductHeader)),
  connect(
    null,
    mapDispatchToProps
  ),
  withHandlers({}),
)(ProductItem);

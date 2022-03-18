// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import uuid from 'uuid/v4';
import { RECURRING } from '../../Constants';
import OrderRowActionTypes from './order-row.actions';

const getRowTemplate = () => ({
  quantity: 0,
  price: 0,
  cost: 0,
  discountedPrice: 0,
  discountAmount: 0,
  discountPercent: 0,
  margin: 0,
  value: 0,
  profit: 0,
  costUnit: 0,
  description: null,
  deliveryStartDate: new Date(),
  deliveryEndDate: new Date(),
});

export const initialState = {
  [uuid()]: { ...getRowTemplate() },
};

const consumeEntities = createConsumeEntities('orderRow');

const calculate = (row, keyChange) => {

  let costUnitValue=row.costUnit;
  let costValue=row.cost;
  if(!(keyChange == 'costUnit' || keyChange == 'cost' )){
    costUnitValue = ((100 - row.margin) * row.price) / 100;
    costValue = costUnitValue * row.quantity;
  }
  // const costUnit = ((100 - row.margin) * row.price) / 100;
  const costUnit = costUnitValue || 0;
  let discountedPrice = row.discountedPrice;
  if(!(keyChange == 'discountedPrice' || keyChange == 'discountPercent' )){
     discountedPrice = (row.price * (100 - row.discountPercent)) / 100;
  }
  // const discountAmount = row.quantity * (row.price - row.discountedPrice);
  const discountAmount = row.quantity * (row.price - discountedPrice);
  // const value = row.discountedPrice * row.quantity;
  let value = discountedPrice * row.quantity;
  if(row.type === RECURRING && row.periodNumber && row.periodNumber !== '0' ) {
    value = value * row.periodNumber;
  }
  // const cost = costUnit * row.quantity;
  const cost = costValue || 0;
  const profit = value - cost;
  // console.log('row',row)
  // console.log('cost',cost)
  // console.log('profit',profit)
  // console.log('costUnit',(costUnit || 0))
  return {
    costUnit,
    profit,
    discountedPrice,
    cost,
    discountAmount,
    value,
  };
};
const onChangeByKey = (draft, orderRowId, data, keyChange) =>{
  if (draft[orderRowId] && data[keyChange]) {
    // console.log('data', data);
    // console.log('keyChange', keyChange);
    // console.log('draft[orderRowId].costUnit', draft[orderRowId].costUnit);
    switch (keyChange) {
      case 'costUnit':
        if (draft[orderRowId].price != 0) {
          draft[orderRowId].margin = 100 - Math.round((draft[orderRowId].costUnit / draft[orderRowId].price) * 100*100)/100;
        }else draft[orderRowId].margin=0;

        draft[orderRowId].cost = draft[orderRowId].costUnit * draft[orderRowId].quantity;
        break;
      case 'cost':
        if (data.cost) {
          // console.log('------', data.cost)
          draft[orderRowId].costUnit = draft[orderRowId].quantity!=0 && draft[orderRowId].quantity!=null ? draft[orderRowId].cost / draft[orderRowId].quantity : draft[orderRowId].cost;
          draft[orderRowId].margin =draft[orderRowId].price==0? 0 : 100 - Math.round((draft[orderRowId].costUnit / draft[orderRowId].price) * 100*100)/100;
        }
        break;
      case 'margin':
        if (data.margin) {
          draft[orderRowId].costUnit = (draft[orderRowId].price * (100 - draft[orderRowId].margin)) / 100;
          draft[orderRowId].cost = draft[orderRowId].costUnit * draft[orderRowId].quantity;
        }
        break;
      case 'discountPercent':
        if (data.discountPercent) {
          draft[orderRowId].discountedPrice = draft[orderRowId].price * ((100 - data.discountPercent) / 100);
        }
        break;
      case 'discountedPrice':
        if (data.discountedPrice) {
          console.log('discountedPrice',data.discountedPrice);
          draft[orderRowId].discountPercent =draft[orderRowId].price!= 0 ? (100 - (data.discountedPrice / draft[orderRowId].price) * 100) : 0;
          console.log('draft[orderRowId].discountPercent',draft[orderRowId].discountPercent);
        }else {
          draft[orderRowId].discountPercent = 100;
        }
        break;
      default:

    }
    // console.log('draft[orderRowId].costUnit', draft[orderRowId].costUnit);

  }
}
const updateOrderRow = (draft, orderRowId, data, keyChange) => {
  // console.log('draft[orderRowId]',draft[orderRowId])
  // console.log('data',data)
  // console.log('draft margin 1',draft[orderRowId].margin)

  if (draft[orderRowId]) {
    Object.keys(data).forEach((key) => {
      if (draft[orderRowId]) draft[orderRowId][key] = data[key];
    });
    // console.log('draft margin 2',draft[orderRowId].margin)

    onChangeByKey(draft, orderRowId, data, keyChange);
    // console.log('draft margin 3',draft[orderRowId].margin)
      // console.log(keyChange == null)
    if(keyChange == null){

      // console.log('data',data)
      // console.log('draft[orderRowId].costUnit',draft[orderRowId].costUnit)
      // console.log('draft[orderRowId].cost',draft[orderRowId].cost)

      if (data.margin) {
      draft[orderRowId].costUnit = (draft[orderRowId].price * (100 - draft[orderRowId].margin)) / 100;
      draft[orderRowId].cost = draft[orderRowId].costUnit * draft[orderRowId].quantity;
    }
    // console.log('draft[orderRowId].cost',draft[orderRowId].cost)
    if (data.costUnit) {
      draft[orderRowId].margin = draft[orderRowId].price==0? 0: 100 - Math.round((draft[orderRowId].costUnit / draft[orderRowId].price) * 100*100)/100;
      draft[orderRowId].cost = draft[orderRowId].costUnit * draft[orderRowId].quantity;
    }
      // console.log('draft[orderRowId].cost',draft[orderRowId].cost)

      if (data.cost) {
      // console.log('------', data.cost)
      draft[orderRowId].costUnit = draft[orderRowId].quantity!=0 && draft[orderRowId].quantity!=null ? draft[orderRowId].cost / draft[orderRowId].quantity : draft[orderRowId].cost;
      draft[orderRowId].margin =draft[orderRowId].price==0? 0 : 100 - Math.round((draft[orderRowId].costUnit / draft[orderRowId].price) * 100*100)/100;
    }
      // console.log('draft[orderRowId].cost',draft[orderRowId].cost)

    if (data.discountPercent) {
      draft[orderRowId].discountedPrice = draft[orderRowId].price * ((100 - data.discountPercent) / 100);
    }
    if (data.discountedPrice) {
      draft[orderRowId].discountPercent =100 -  (data.discountedPrice / draft[orderRowId].price) * 100;
    }
    }
    // console.log('draft[orderRowId] margin 3.1',draft[orderRowId].margin)
    draft[orderRowId].margin = draft[orderRowId].margin != -Infinity &&  draft[orderRowId].margin != Infinity ? draft[orderRowId].margin : 0;
    // console.log('draft[orderRowId]',draft[orderRowId].cost)
    // console.log('draft[orderRowId]',draft[orderRowId].costUnit)
    // console.log('draft[orderRowId]',draft[orderRowId].profit)
    // console.log('draft[orderRowId] margin 4',draft[orderRowId].margin)
    // console.log('draft[orderRowId] margin',draft[orderRowId].margin || 0)
    // console.log('data',data)
    const calculatedData = calculate(draft[orderRowId], keyChange);
    // console.log('calculatedData',calculatedData)
    Object.keys(calculatedData).forEach((key) => {
      draft[orderRowId][key] = calculatedData[key];
    });
  }
}

export default createReducer(initialState, {
  [OrderRowActionTypes.CREATE]: (draft, { uuid, defaults }) => {
    draft[uuid] = {
      ...getRowTemplate(),
      ...defaults,
    };
  },
  [OrderRowActionTypes.REMOVE]: (draft, { orderRowId }) => {
    delete draft[orderRowId];
  },
  [OrderRowActionTypes.UPDATE]: (draft, { orderRowId, data, keyChange }) => {
    updateOrderRow(draft, orderRowId, data, keyChange)
  },
  [OrderRowActionTypes.CLEAR]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [OrderRowActionTypes.COPY_ENTITY]: (draft, { data }) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
    if (data.length <= 0) {
      draft[uuid()] = { ...getRowTemplate() };
    }
    data.map((item) => {
      const orderRowDTO = item.orderRowDTO;
      draft[uuid()] = {
        ...orderRowDTO,
        value: orderRowDTO.type === RECURRING && item.periodNumber  ? orderRowDTO.periodNumber * orderRowDTO.numberOfUnit * orderRowDTO.price : orderRowDTO.numberOfUnit * orderRowDTO.price,
        product: orderRowDTO.productDTO.uuid,
        quantity: orderRowDTO.numberOfUnit,
      };
    });
  },
  [OrderRowActionTypes.EDIT_ENTITY]: (draft, { data, prospectId }) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
    data.map((item) => {
      draft[item.uuid] = {
        ...item,
        value: item.type === RECURRING && item.periodNumber? item.numberOfUnit * item.price * item.periodNumber  : item.numberOfUnit * item.price,
        product: item.productDTO.uuid,
        quantity: item.numberOfUnit,
        prospectId: prospectId,
        cost: (item.costUnit || 0) * (item.numberOfUnit || 0),
        profit: item.numberOfUnit * item.price - (item.costUnit || 0) * (item.numberOfUnit || 0)
      };
    });
  },
  [OrderRowActionTypes.CREATE_AND_UPDATE_DATA] : (draft, { data }) => {
    for (let i = 0; i < data.length; i++) {
      let orderRowId = uuid()
      draft[orderRowId] = {
        ...getRowTemplafvte(),
      };
      updateOrderRow(draft, orderRowId, data[i])
    }
  },
  default: consumeEntities,
});

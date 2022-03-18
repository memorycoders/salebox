/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { List, Icon, Popup, Menu, Dropdown } from 'semantic-ui-react';
import api from '../../../../lib/apiClient';
import SettingPane from '../../SettingPane/SettingPane';
import _l from 'lib/i18n';
import CountryDropdown from './CountryDropdown';

import editBtn from '../../../../../public/Edit.svg';
import css from "../AccountAndContactType/account.css";
import {IconButton} from "../../../Common/IconButton";
import add from "../../../../../public/Add.svg";
import cx from 'classnames';
import {updateCurrency} from '../../../App/app.actions';
import {connect} from 'react-redux';

addTranslations({
  'en-US': {
    Data: 'Data',
    'No. workdays/week': 'No. workdays/week',
    'Hours/workday': 'Hours/workday',
    Currency: 'Currency',
    'Adaptive value': 'Adaptive value',
    'Median deal time (days)': 'Median deal time (days)',
    'Median deal size': 'Median deal size',
    'Fiscal year': 'Fiscal year',
    'Start M/D': 'Start M/D',
    'Revenue type': 'Revenue type',
  },
});


const RightMenu = ({ openType, setOpenType, selectRevenueType }) => {
  return (
    <>
      <Popup
        flowing
        on="click"
        keepInViewPort
        closeOnTriggerBlur
        open={openType}
        style={{ padding: 0 }}
        position="bottom right"
        trigger={<Icon color={'grey'} name="caret down" size={'big'} onClick={() => setOpenType(!openType)} />}
      >
        <Menu vertical color="teal">
          <Menu.Item onClick={() => selectRevenueType('START/END')}>{_l`Start/end`}</Menu.Item>
          <Menu.Item onClick={() => selectRevenueType('FIXED/RECURRING')}>{_l`Recurring/fixed`}</Menu.Item>
        </Menu>
      </Popup>
    </>
  );
};

const LeftMenu = ({ openCu, setOpenCu, currencyChange, value }) => {
  return (
    <>
      <Popup
        flowing
        on="click"
        keepInViewPort
        closeOnTriggerBlur
        open={openCu}
        style={{ padding: 0 }}
        position="bottom right"
        trigger={<img style={{ height: '13px', width: '20px' }} src={editBtn} onClick={() => setOpenCu(!openCu)} />}
      >
        <CountryDropdown fluid style={{ width: '200' }} open={openCu} onChange={currencyChange} value={value} />
      </Popup>
    </>
  );
};

const DataWork = ({updateCurrency}) => {

  const OPTIONS = [
    {
      value: 'START/END',
      text: _l`Start/end`,
      key: 'START/END',
    },
    {
      value: 'FIXED/RECURRING',
      text: _l`Recurring/fixed`,
      key: 'FIXED/RECURRING',
    },
  ];
  const [dataWork, setDataWork] = useState({});
  const [openType, setOpenType] = useState(false);
  const [openCu, setOpenCu] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get({
        resource: 'administration-v3.0/workData/workData',
      });
      if (res && res.workDataWorkDataDTOList) {
        setDataWork(convertArrayToObject(res.workDataWorkDataDTOList, 'name'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const asyncWorkDataCurrencyList = async () => {
  //   try {
  //     const res = await api.get({
  //       resource: 'administration-v3.0/workData/workData/currencies',
  //     });
  //     if (res && res.currencyList) {
  //       setCurrencyList(res.currencyList);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  const updateWorkData = async (dto) => {
    try {
      const res = await api.post({
        resource: 'administration-v3.0/workData/workData/update',
        data: dto,
      });
      if (res) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectRevenueType = (e, { value }) => {
    const obj = dataWork['Order rows type'];
    obj.value = value;
    updateWorkData(obj);
  };
  console.log('dataWork', dataWork);

  const currencyChange = (e, { value }) => {
    console.log('value', value);
    const obj = dataWork.Currency;
    obj.value = value;
    updateWorkData(obj);
    updateCurrency(value);
  };

  return (
    <SettingPane padded title={_l`Data`}
                 customTitle={
                   <div className={cx(css.itemHeader, css.titleHeader)}>
                     <div className={css.colName}>
                       <span>{_l`Data`}</span>
                     </div>
                   </div>
                 }
    >
      <List divided relaxed verticalAlign="middle">
        {/* <List.Item>
          <List.Content>{_l`No. workdays/week`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork['No workdays/week'] && dataWork['No workdays/week'].value}
          </List.Content>
        </List.Item> */}
        {/* <List.Item style={{ borderTop: '1px solid #f1f1f1' }}>
          <List.Content>{_l`Hours/workday`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork['Hours/workday'] && dataWork['Hours/workday'].value}
          </List.Content>
        </List.Item> */}
        <List.Item>
          <List.Content>{_l`Currency`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-20px', cursor: 'pointer' }}>
            <CountryDropdown
              fluid
              style={{ width: '150px' }}
              onChange={currencyChange}
              value={dataWork.Currency && dataWork.Currency.value}
            />
          </List.Content>
          {/* <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork.Currency && dataWork.Currency.value}
          </List.Content> */}
        </List.Item>
        {/* <List.Item>
          <List.Content>{_l`Adaptive value`}</List.Content>
        </List.Item> */}
        {/* <List.Item>
          <List.Content>{_l`Median deal time (days)`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork['Median deal time'] && dataWork['Median deal time'].value}
          </List.Content>
        </List.Item> */}
        {/* <List.Item>
          <List.Content>{_l`Median deal size`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork['Median deal size'] && dataWork['Median deal size'].value}
          </List.Content>
        </List.Item> */}
        {/* <List.Item>
          <List.Content>{_l`Fiscal year`}</List.Content>
        </List.Item> */}
        {/* <List.Item>
          <List.Content>{_l`Start M/D`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            <img style={{ height: '13px', width: '20px' }} src={editBtn} />
          </List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {dataWork['Start M/D'] && dataWork['Start M/D'].value}
          </List.Content>
        </List.Item> */}
        <List.Item style={{ borderTop: '1px solid #f1f1f1', paddingTop: '15px' }}>
          <List.Content>{_l`Revenue type`}</List.Content>
          <List.Content floated="right" style={{ marginTop: '-20px', cursor: 'pointer' }}>
            {/* <RightMenu setOpenType={setOpenType} openType={openType} selectRevenueType={selectRevenueType} /> */}
            <Dropdown
              fluid
              selection
              options={OPTIONS}
              value={dataWork['Order rows type'] && dataWork['Order rows type'].value}
              onChange={selectRevenueType}
              style={{ width: '150px' }}
              search
            />
          </List.Content>
          <List.Content floated="right" style={{ marginTop: '-10px' }}>
            {/* {dataWork['Order rows type'] &&
              dataWork['Order rows type'].value === 'FIXED/RECURRING' &&
              _l`Recurring/fixed`}
            {dataWork['Order rows type'] && dataWork['Order rows type'].value === 'START/END' && _l`Start/end`} */}
          </List.Content>
        </List.Item>
      </List>
    </SettingPane>
  );
};
export default connect(null, {updateCurrency})(DataWork);

import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

function SaleProcessDropdown(props) {
  const { value, onChange } = props;
  const [listSaleProcess, setListSaleProcess] = useState([]);
  useEffect(() => {
    fetchListSaleProcess();
  }, []);
  const fetchListSaleProcess = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Recruitment}/recruitment/getListSalesMethod`,
      });
      if (res) {
        setListSaleProcess(
          res.salesMethodDTOList.map((e) => {
            return {
              key: e.uuid,
              text: e.name,
              value: e.uuid,
            };
          })
        );
      }
    } catch (error) {}
  };
  return <Dropdown options={listSaleProcess} selection value={value} onChange={onChange} />;
}

export default SaleProcessDropdown;

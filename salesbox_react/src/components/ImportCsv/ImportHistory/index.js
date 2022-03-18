/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import _ from 'lodash';
import { Icon, Menu, Popup } from 'semantic-ui-react';
import Collapsible from './Collapsible/Collapsible';
import PeriodPicker from 'components/DatePicker/PeriodPicker';
import cx from 'classnames';
import api from '../../../lib/apiClient';
import moment from 'moment';
import css from '../../Contact/LatestCommunicationPane/CommunicationItem.css';
import localCss from './style.css';

import appointmentAdd from '../../../../public/Appointments.svg';

const RightMenu = ({
  openDatePicker,
  setOpenDatePicker,
  startDate,
  endDate,
  selectStartDate,
  selectEndDate,
  resetDate,
}) => {
  return (
    <>
      <Popup
        flowing
        on="click"
        keepInViewPort
        closeOnTriggerBlur
        open={openDatePicker}
        style={{ padding: 0 }}
        position="top right"
        trigger={
          <Menu.Item
            onClick={() => setOpenDatePicker(!openDatePicker)}
            className={`${css.rightIcon} ${css.mr2} ${openDatePicker && css.circleAvtive}`}
          >
            <img style={{ height: 15, width: 15 }} src={appointmentAdd} />
          </Menu.Item>
        }
      >
        <Menu vertical color="teal">
          <Menu.Item onClick={resetDate}>{_l`All`}</Menu.Item>
          <PeriodPicker
            startDate={startDate}
            endDate={endDate}
            onChangeStart={selectStartDate}
            onChangeEnd={selectEndDate}
            trigger={<Menu.Item>{_l`Custom`}</Menu.Item>}
          />
        </Menu>
      </Popup>
    </>
  );
};

const ImportHistory = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [imports, setImports] = useState([]);
  const [isFilter, setFilter] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get({
          resource: `enterprise-v3.0/importHistory`,
        });
        if (res && res.importExportHistoryDTOList) {
          setImports(_.reverse(res.importExportHistoryDTOList));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const selectStartDate = (date) => {
    setStartDate(date);
    setFilter(true);
  };

  const selectEndDate = (date) => {
    setEndDate(date);
    setFilter(true);
  };

  const getImports = () => {
    const arr = [...imports];
    if (isFilter) {
      return _.filter(arr, (o) => {
        return moment(startDate).valueOf() < o.createdDate && o.createdDate < moment(endDate).valueOf();
      });
    }
    return arr;
  };

  const resetDate = () => {
    setFilter(false);
    setStartDate(new Date());
    setEndDate(new Date());
    setOpenDatePicker(false);
  };

  return (
    <Collapsible
      right={
        <RightMenu
          openDatePicker={openDatePicker}
          setOpenDatePicker={setOpenDatePicker}
          startDate={startDate}
          endDate={endDate}
          selectStartDate={selectStartDate}
          selectEndDate={selectEndDate}
          resetDate={resetDate}
        />
      }
      padded
      height={300}
      title={_l`Imports`}
      isImport={true}
    >
      <div>
        {getImports().map((i) => {
          return (
            <div className={localCss.listItem} key={i.uuid}>
              <div className={localCss.name}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{i.fileName}</span>
                  <span>
                    {_l`By`} <strong>{i.username}</strong>
                  </span>
                </div>
              </div>
              <div className={localCss.date}>{_l`${moment(i.createdDate).format('DD MMM YYYY')}`}</div>
            </div>
          );
        })}
      </div>
    </Collapsible>
  );
};
export default ImportHistory;

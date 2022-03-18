/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import _l from 'lib/i18n';
import _ from 'lodash';
import { Table, Rating, Label, Menu, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import api from '../../../../lib/apiClient';
import SettingPane from '../../SettingPane/SettingPane';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './SaleProcess.css';
import AddSaleModal from './AddSaleModal';
import EditSaleModal from './EditSaleModal';
import DeleteSaleModal from './DeleteModal';
import SaleDetail from './Detail';

import editBtn from '../../../../../public/Edit.svg';
import { IconButton } from '../../../Common/IconButton';
import add from '../../../../../public/Add.svg';

addTranslations({
  'en-US': {
    Processes: 'Processes',
    'Our Processes': 'Our Processes',
    Rating: 'Rating',
    Type: 'Type',
    Using: 'Using',
    OWN: 'OWN',
    SHARED: 'SHARED',
    'A process cannot have less than 3 stages': 'A process cannot have less than 3 stages',
  },
});

const SaleProcess = (props) => {
  const [sales, setSales] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const res = await api.get({
        resource: 'administration-v3.0/salesMethod/listOur',
      });
      if (res && res.salesMethodDTOList) {
        setSales(res.salesMethodDTOList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUsing = async (e, item) => {
    e.stopPropagation();
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/update',
        data: {
          ...item,
          using: !item.using,
        },
      });
      if (res) {
        const index = _.findIndex(sales, (o) => {
          return o.uuid === item.uuid;
        });
        if (index !== -1) {
          const newSales = [...sales.slice(0, index), res, ...sales.slice(index + 1)];
          setSales(newSales);
        }
      }
    } catch (error) {
      if (error.message === 'REQUIRE_AT_LEAST_ONE_SALES_METHOD_IN_USING') {
        props.putError('Required at least one sales method in using');
      } else if (error.message === 'ERROR_REMOVE_SALES_METHOD_USING_BY_PROSPECT') {
        props.putError('Sales method is in using');
      } else {
        props.putError(error.message);
      }
    }
  };

  const onAddSale = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onAddSucces = (item) => {
    const newSales = [item, ...sales];
    setSales(newSales);
    // fetchSale();
  };

  const onCloseEditModal = () => {
    setShowEditModal(false);
  };

  const onEditSale = (item) => {
    setShowEditModal(true);
    setSelectedSale(item);
  };

  const onEditSucces = (item) => {
    const index = _.findIndex(sales, (o) => {
      return o.uuid === item.uuid;
    });
    if (index !== -1) {
      const newSales = [...sales.slice(0, index), item, ...sales.slice(index + 1)];
      setSales(newSales);
    }
  };

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onDeleteSale = (item) => {
    setShowDeleteModal(true);
    setSelectedSale(item);
  };

  const onDeleteSucces = (item) => {
    const index = _.findIndex(sales, (o) => {
      return o.uuid === item.uuid;
    });
    if (index !== -1) {
      const newSales = [...sales.slice(0, index), ...sales.slice(index + 1)];
      setSales(newSales);
    }
  };

  const onCopy = async (item) => {
    try {
      const res = await api.get({
        resource: 'administration-v3.0/salesMethod/duplicate',
        query: {
          uuid: item.uuid,
        },
      });
      if (res) {
        fetchSale();
      }
    } catch (error) {
      if (error.message === 'CAN_NOT_DUPLICATE_A_PROCESS_LESS_THAN_THREE_STAGE') {
        console.log(error);
        props.putError('A process cannot have less than 3 stages');
      }
    }
  };

  const openDetail = (e, uuid) => {
    e.stopPropagation();
    console.log('uuid', uuid);
    setSelected(uuid);
  };

  return (
    <>
      <SettingPane
        padded
        title={_l`Pipelines`}
        // hiddenTitle
        customTitle={
          <div className={cx(css.itemHeader, css.titleHeader)}>
            <div className={css.ourProcess}>
              <span>{_l`Pipelines`}</span>
            </div>
            <div className={css.using}>
              <span>{_l`Active`}</span>
            </div>
            <div className={css.actionBtn}>
              <IconButton name="profile" size={24} src={add} onClick={onAddSale} imageClass={css.addIconSize} />
            </div>
          </div>
        }
      >
        {/*
        <div className={cx(css.listItem, css.Title)}>
          <div className={css.ourProcess}>
            <span>{_l`Pipelines`}</span>
          </div>
          <div className={css.using}>
            <span>{_l`Active`}</span>
          </div>
          <div className={css.actionBtn}>
            <IconButton name="profile" size={24} src={add} onClick={onAddSale} imageClass={css.addIconSize} />

            <div className={css.btnAdd} onClick={onAddSale}>
              <div />
            </div>
          </div>
        </div>
*/}
        {sales.map((s) => {
          return (
            <>
              <div className={cx(css.listItem, css.itemHover)} key={s.uuid} onClick={(e) => openDetail(e, s.uuid)}>
                <div className={css.ourProcess}>
                  <span>{s.name}</span>
                </div>
                <div className={css.using}>
                  {s.using === true ? (
                    <div className={css.setDone} onClick={(e) => setUsing(e, s)}>
                      <div />
                    </div>
                  ) : (
                    <div className={css.notSetasDone} onClick={(e) => setUsing(e, s)}>
                      <div />
                    </div>
                  )}
                </div>
                <div className={css.actionBtn}>
                  <MoreMenu className={css.bgMore} color="task">
                    <Menu.Item icon>
                      <div className={css.actionIcon} onClick={() => onEditSale(s)}>
                        {_l`Update`}
                        <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                      </div>
                    </Menu.Item>
                    <Menu.Item icon onClick={() => onCopy(s)}>
                      <div className={css.actionIcon}>
                        {_l`Copy`}
                        <Icon name="copy" color="grey" />
                      </div>
                    </Menu.Item>
                    <Menu.Item icon onClick={() => onDeleteSale(s)}>
                      <div className={css.actionIcon}>
                        {_l`Delete`}
                        <Icon name="trash alternate" color="grey" />
                      </div>
                    </Menu.Item>
                  </MoreMenu>
                </div>
              </div>
              {selected === s.uuid && <SaleDetail uuid={selected} />}
            </>
          );
        })}
      </SettingPane>
      <AddSaleModal visible={showAddModal} onClose={onCloseAddModal} onAddSucces={onAddSucces} />
      <EditSaleModal
        visible={showEditModal}
        onClose={onCloseEditModal}
        data={selectedSale}
        onAddSucces={onEditSucces}
      />
      <DeleteSaleModal
        visible={showDeleteModal}
        onClose={onCloseDeleteModal}
        data={selectedSale}
        onAddSucces={onDeleteSucces}
      />
    </>
  );
};
export default connect(null, { putError: NotificationActions.error })(SaleProcess);

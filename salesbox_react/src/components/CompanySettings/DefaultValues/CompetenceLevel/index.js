import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SettingPane from '../../SettingPane/SettingPane';
import cx from 'classnames';
import _l from 'lib/i18n';
import add from '../../../../../public/Add.svg';
import { IconButton } from '../../../Common/IconButton';
import css from '../AccountAndContactType/account.css';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import FocusPopup from '../../../Focus/FocusPopup';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import api from '../../../../lib/apiClient';
import { FormField, Icon, Menu, Form, Input } from 'semantic-ui-react';
import style from '../SaleProcess/SaleProcess.css';
import editBtn from '../../../../../public/Edit.svg';
import { Endpoints } from '../../../../Constants';
import * as NotificationActions from '../../../Notification/notification.actions';

const mock = [
  {
    uuid: '229c768c-75fd-4b96-ba26-c749623a57c8',
    level: 2,
    description: 'This is description',
  },
  {
    uuid: '179d9414-0b44-43de-b238-e7e968e17f54',
    level: 111,
    description: 'Hoc test ahihii',
  },
];
export const CompetenceLevel = ({ notiError }) => {
  const initData = {
    uuid: null,
    level: null,
    description: null,
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState(initData);
  const [listCompetenceLevel, setListCompetenceLevel] = useState([]);
  const [error, setError] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);

  useEffect(() => {
    fetchListCompetenceLevel();
  }, []);

  const fetchListCompetenceLevel = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Administration}/competenceLevel/listAll`,
      });
      if (res) {
        setListCompetenceLevel(res);
      }
    } catch (error) {}
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setData(initData);
    setError(false);
  };
  const handleDoneModal = async () => {
    if (!data.level) {
      setError(true);
      return;
    }
    try {
      if (data.uuid) {
        const res = await api.put({
          resource: `${Endpoints.Administration}/competenceLevel/update`,
          data: {
            uuid: data.uuid,
            level: data.level,
            description: data.description,
          },
        });
        if (res) {
          setShowAddModal(false);
          fetchListCompetenceLevel();
          setData(initData);
        }
      } else {
        const res = await api.post({
          resource: `${Endpoints.Administration}/competenceLevel/add`,
          data: {
            level: data.level,
            description: data.description,
          },
        });
        if (res) {
          setShowAddModal(false);
          setListCompetenceLevel([...listCompetenceLevel, res]);
          setData(initData);
        }
      }
    } catch (error) {
      if (error.message === 'COMPETENCE_LEVEL_UNIQUE') {
        notiError('Competence level must be unique');
      }
    }
  };
  const handleDeleteObject = (object) => {
    setData(object);
    setVisibleDeleteModal(true);
  };
  const handleUpdateObject = (object) => {
    setData(object);
    setShowAddModal(true);
  };

  const confirmDeleteLevel = async () => {
    try {
      const res = await api.delete({
        resource: `${Endpoints.Administration}/competenceLevel/delete`,
        query: {
          uuid: data.uuid,
        },
      });
      if (res === 'SUCCESS') {
        setListCompetenceLevel(listCompetenceLevel.filter((e) => e.uuid !== data.uuid));
        setVisibleDeleteModal(false);
      }
    } catch (error) {}
  };
  return (
    <>
      <SettingPane
        padded
        customTitle={
          <div className={cx(css.itemHeader, css.titleHeader)}>
            <div className={css.colName}>
              <span>{_l`Competence level`}</span>
            </div>

            <div className={css.actionBtn}>
              <IconButton name="profile" size={24} src={add} onClick={handleAdd} imageClass={css.addIconSize} />
            </div>
          </div>
        }
      >
        {listCompetenceLevel.map((s) => {
          return (
            <>
              <div className={cx(css.listItem, css.itemHover)} key={s.uuid}>
                <div className={css.colName}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{s.level}</span>
                    <FocusPopup focus={s} showIcon isDescriptionPopup />
                  </div>
                </div>
                <div className={css.actionBtn}>
                  <MoreMenu className={style.bgMore} color="task">
                    <Menu.Item icon onClick={() => handleUpdateObject(s)}>
                      <div className={style.actionIcon}>
                        {_l`Update`}
                        <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                      </div>
                    </Menu.Item>
                    <Menu.Item icon onClick={() => handleDeleteObject(s)}>
                      <div className={style.actionIcon}>
                        {_l`Delete`}
                        <Icon name="trash alternate" color="grey" />
                      </div>
                    </Menu.Item>
                  </MoreMenu>
                </div>
              </div>
            </>
          );
        })}
      </SettingPane>
      <ModalCommon
        size="tiny"
        title={data.uuid ? _l`Update competence level` : _l`Add competence level`}
        visible={showAddModal}
        onClose={handleCloseModal}
        onDone={handleDoneModal}
      >
        <Form>
          <FormField className={css.fieldForm}>
            <div style={{ display: 'flex' }}>
              <p className={css.labelForm}>{_l`Level`}</p>
              <span className={css.iconRequired}>*</span>
            </div>
            <div className={css.divInputForm}>
              <Input
                type="number"
                name="level"
                className={css.inputForm}
                value={data.level}
                error={error}
                onChange={(e) => {
                  setError(false);
                  setData({ ...data, level: e.target.value });
                }}
              />
              {error && <p className={css.errorMessage}>{_l`Level is required`}</p>}
            </div>
          </FormField>
          <FormField className={css.fieldForm} style={{ marginTop: 10 }}>
            <p className={css.labelForm}>{_l`Description`}</p>
            <div className={css.divInputForm}>
              <Input
                type="text"
                name="description"
                className={css.inputForm}
                value={data.description}
                onChange={(e) => {
                  setData({ ...data, description: e.target.value });
                }}
              />
            </div>
          </FormField>
        </Form>
      </ModalCommon>

      <ModalCommon
        visible={visibleDeleteModal}
        title={_l`Confirm`}
        size="tiny"
        onClose={() => setVisibleDeleteModal(false)}
        onDone={confirmDeleteLevel}
      >
        <p>{_l`This competence level will be deleted?`}</p>
      </ModalCommon>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  notiError: NotificationActions.error,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompetenceLevel);

/* eslint-disable react/jsx-no-bind */
import React, {useEffect, useState} from 'react';
import {Accordion, Icon, Table, Menu} from 'semantic-ui-react';
import api from '../../../../lib/apiClient';
import SettingPane from '../../SettingPane/SettingPane';
import _l from 'lib/i18n';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import css from './account.css';
import style from '../SaleProcess/SaleProcess.css';
import editBtn from '../../../../../public/Edit.svg';
import cx from 'classnames';
import DeleteModal from "./DeleteModal";
import _ from "lodash";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import add from "../../../../../public/Add.svg";
import {IconButton} from "../../../Common/IconButton";

addTranslations({
  'en-US': {
    Account: 'Account',
    'Company & contact - Type': 'Company & contact - Type',
    'Contact - Positions': 'Contact - Positions',
  },
});
const TYPE = {
  TYPE: 'TYPE',
  CONTACT_RELATIONSHIP: 'CONTACT_RELATIONSHIP'
}
export {TYPE};

const AccountAndContactType = (props) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dataList, setDataList] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get({
          resource: 'administration-v3.0/workData/organisations',
        });
        if (res && res.workDataOrganisationDTOList) {
          setDataList(res.workDataOrganisationDTOList);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (e, titleProps) => {
    const {index} = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  const contactTypes = dataList.filter((o) => o.type === props.type);
  // const contactRelationship = dataList.filter((o) => o.type === TYPE.CONTACT_RELATIONSHIP);


  const onAddObject = () => {
    setShowAddModal(true);
    setSelectedObject({});
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedObject({});
  };

  const onAddSuccess = (item) => {
    const newDataList = [item, ...dataList];
    setDataList(newDataList);
    // fetchSale();
  };


  const onCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedObject({});
  };

  const onEditObject = (item) => {
    setShowEditModal(true);
    setSelectedObject(item);
  };

  const onEditSuccess = (item) => {
    const index = _.findIndex(dataList, (o) => {
      return o.uuid === item.uuid;
    });
    if (index !== -1) {
      const newSales = [...dataList.slice(0, index), item, ...dataList.slice(index + 1)];
      setDataList(newSales);
    }
  };


  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const onDeleteObject = (item) => {
    setShowDeleteModal(true);
    setSelectedObject(item);
  };

  const onDeleteSuccess = (item) => {
    const index = _.findIndex(dataList, (o) => {
      return o.uuid === item.uuid;
    });
    if (index !== -1) {
      const newDataList = [...dataList.slice(0, index), ...dataList.slice(index + 1)];
      setDataList(newDataList);
    }
  };


  console.log('contactTypes', contactTypes);
  let title = _l`Company & contact - Type`;
  switch (props.type) {
    case TYPE.TYPE:
      title = _l`Company & contact - Type`;
      break;
    case TYPE.CONTACT_RELATIONSHIP:
      title = _l`Contact - Positions`;
      break;
  }
  return (
    <>
      <SettingPane padded
        // title={_l`Account`}
        //            hiddenTitle
                   customTitle={
                     <div className={cx(css.itemHeader, css.titleHeader)}>
                       <div className={css.colName}>
                         <span>{title}</span>
                       </div>

                       <div className={css.actionBtn}>
                         <IconButton name="profile" size={24} src={add} onClick={onAddObject}
                                     imageClass={css.addIconSize}/>
                       </div>
                     </div>
                   }
      >
{/*
        <div className={cx(css.listItem, css.Title)}>
          <div className={css.colName}>
            <span>{title}</span>
          </div>

          <div className={css.actionBtn}>
            <IconButton name="profile" size={24} src={add} onClick={onAddObject}  imageClass={css.addIconSize}/>
            <div className={css.btnAdd} onClick={onAddObject}>
              <div/>
            </div>
          </div>
        </div>
*/}
        {
          contactTypes.map((s) => {
            return (
              <>
                <div className={cx(css.listItem, css.itemHover)} key={s.uuid}>
                  <div className={css.colName}>
                    <span>{s.name}</span>
                  </div>
                  <div className={css.actionBtn}>
                    <MoreMenu className={style.bgMore} color="task">
                      <Menu.Item icon onClick={() => onEditObject(s)}>
                        <div className={style.actionIcon}>
                          {_l`Update`}
                          <img style={{height: '13px', width: '20px'}} src={editBtn}/>
                        </div>
                      </Menu.Item>
                      <Menu.Item icon onClick={() => onDeleteObject(s)}>
                        <div className={style.actionIcon}>
                          {_l`Delete`}
                          <Icon name="trash alternate" color="grey"/>
                        </div>
                      </Menu.Item>
                    </MoreMenu>
                  </div>
                </div>
              </>
            );
          })

        }
      </SettingPane>
      <DeleteModal
        visible={showDeleteModal}
        onClose={onCloseDeleteModal}
        data={selectedObject}
        onAddSuccess={onDeleteSuccess}
      />
      <AddModal visible={showAddModal} onClose={onCloseAddModal} onAddSuccess={onAddSuccess} type={props.type} data={selectedObject}/>
      <EditModal visible={showEditModal}
                 onClose={onCloseEditModal}
                 data={selectedObject}
                 onSuccess={onEditSuccess} type={props.type}
      />

    </>
  );
};
export default AccountAndContactType;

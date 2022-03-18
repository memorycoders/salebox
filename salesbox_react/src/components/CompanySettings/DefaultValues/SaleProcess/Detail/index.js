/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import _l from 'lib/i18n';
import _ from 'lodash';
import uuid from 'uuid/v4';
import { Popup, Menu, Icon, Button, Input } from 'semantic-ui-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MoreMenu from 'components/MoreMenu/MoreMenu';
import { connect } from 'react-redux';
import * as NotificationActions from 'components/Notification/notification.actions';
import api from '../../../../../lib/apiClient';
import css from './style.css';
import otherCss from '../SaleProcess.css';
import Switch from './ToggleSwitch';
import AddActivityModal from './AddActivity/AddModal';
import EditSettingsModal from './EditSettings/EditModal';
import ConfirmModal from '../../../../Common/Modal/ConfirmModal';

import editBtn from '../../../../../../public/Edit.svg';
import { IconButton } from './IconButton';
import add from '../../../../../../public/add_white.svg';

import AutomaticReminder from '../../../../Settings/AutomaticReminder';
import { Endpoints } from '../../../../../Constants';

const getListStyle = (isDraggingOver) => ({
  background: '#f0f0f0',
  // padding: grid,
  // width: 340,
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const SaleDetail = (props) => {
  const [activityList, setActivity] = useState([]);
  const [salesProcess, setSalesProcess] = useState({});
  const [addModal, setAddModal] = useState({
    status: false,
    type: '',
    fnOk: null,
    fnCancel: null,
    form: {},
    active: '',
    titie: '',
  });

  const [confirmModal, setConfirmModal] = useState({ status: false, title: '', fnOk: null, fnCancel: null });
  useEffect(() => {
    if (props.uuid) getActivityBySalesMethod();
    if (props.uuid) getSalesMethod();
  }, [props.uuid]);

  const getActivityBySalesMethod = async () => {
    try {
      const res = await api.get({
        resource: 'administration-v3.0/activity/listBySalesMethod/' + props.uuid,
      });
      if (res && res.activityDTOList) {
        setActivity(res.activityDTOList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesMethod = async () => {
    try {
      const res = await api.get({
        resource: 'administration-v3.0/salesMethod/' + props.uuid,
      });
      if (res) {
        setSalesProcess(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(activityList, result.source.index, result.destination.index);
    setActivity(items);
  };

  const onUpdateActivity = async () => {
    const arr = [...activityList];
    const dto = arr.map((item, index) => {
      if (item.saleMethodId) {
        delete item.uuid;
        return {
          ...item,
          index: index + 1,
        };
      }
      return {
        ...item,
        index: index + 1,
      };
    });
    try {
      const res = await api.post({
        resource: 'administration-v3.0/activity/updateActivityList/' + props.uuid,
        data: {
          activityDTOList: dto,
        },
      });
      if (res) {
        props.putSuccess(`Added`, '', 2000);
        getSalesMethod();
        getActivityBySalesMethod();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addActivity = () => {
    const _modal = {
      status: true,
      type: 'ADD_ACTIVITY',
      form: {},
      fnOk: (data) => {
        console.log('activity add', data);
        const newArr = [...activityList];
        newArr.push({ ...data, uuid: uuid() });
        setActivity(newArr);
        setAddModal({ status: false });
      },
      fnCancel: () => {
        setAddModal({ status: false });
      },
    };
    setAddModal(_modal);
  };

  const editActivity = (activity) => {
    console.log('activity', activity);
    const _modal = {
      status: true,
      type: 'EDIT_ACTIVITY',
      form: { ...activity },
      fnOk: (data) => {
        console.log('activity edit', data);
        const newArr = [...activityList];
        const index = _.findIndex(newArr, (o) => {
          return o.uuid === data.uuid;
        });
        if (index !== -1) {
          const newSales = [...newArr.slice(0, index), data, ...newArr.slice(index + 1)];
          setActivity(newSales);
        }
        setAddModal({ status: false });
      },
      fnCancel: () => {
        setAddModal({ status: false });
      },
    };
    setAddModal(_modal);
  };

  const deleteActivity = (activity) => {
    if (activity.type === 'CONTRACT_SENT' || activity.type === 'QUOTE_SENT') {
      const _modal = {
        status: true,
        title: _l`If you delete this stage the connected meeter in Insights will not work`,
        fnOk: () => {
          const newArr = [...activityList];
          const index = _.findIndex(newArr, (o) => {
            return o.uuid === activity.uuid;
          });
          if (index !== -1) {
            const newSales = [...newArr.slice(0, index), ...newArr.slice(index + 1)];
            setActivity(newSales);
          }
          setConfirmModal({ status: false });
        },
        fnCancel: () => {
          setConfirmModal({ status: false });
        },
      };
      setConfirmModal(_modal);
    } else {
      const newArr = [...activityList];
      const index = _.findIndex(newArr, (o) => {
        return o.uuid === activity.uuid;
      });
      if (index !== -1) {
        const newSales = [...newArr.slice(0, index), ...newArr.slice(index + 1)];
        setActivity(newSales);
      }
    }
  };

  const autoStage = async ({ enabled }) => {
    console.log('enable', enabled);
    const mode = enabled ? 'OFF' : 'ON';
    console.log('mode', mode);
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/' + props.uuid + '/updateAutomaticReminder',
        query: {
          mode,
        },
      });
      if (res) {
        getSalesMethod();
        props.putSuccess(_l`Added`, '', 2000);
      }
    } catch (error) {
      alert('err =>', error);
      getSalesMethod();
      props.putError('Oh, something went wrong');
    }
  };

  const toggleStage = async ({ enabled }) => {
    console.log('enable', enabled);
    const mode = enabled ? 'DYNAMIC' : 'SEQUENTIAL';
    console.log('mode', mode);
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/' + props.uuid + '/updateMode',
        query: {
          mode,
        },
      });
      if (res) {
        props.putSuccess(_l`Added`, '', 2000);
        getSalesMethod();
      }
    } catch (error) {
      getSalesMethod();
      if (error.message === 'CAN_NOT_CHANGE_SALES_METHOD_MODE_IN_USING') {
        console.log('bbb');
        props.putError('Sales Process is used by at least one active deal');
      }
    }
  };

  const toggleManual = async ({ enabled }) => {
    console.log('enable', enabled);
    const manualProgress = enabled ? 'OFF' : 'ON';
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/' + props.uuid + '/updateManualProgress',
        query: {
          manualProgress,
        },
      });
      if (res) {
        props.putSuccess(_l`Added`, '', 2000);
        getSalesMethod();
      }
    } catch (error) {
      getSalesMethod();
      if (error.message === 'CAN_NOT_CHANGE_SALES_METHOD_MODE_IN_USING') {
        props.putError('Sales Process is used by at least one active deal');
      }
    }
  };

  const onRecruitment = async ({ enabled }) => {
    console.log('enable', enabled);
    const isRecruitment = enabled ? 'OFF' : 'ON';
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/' + props.uuid + '/switchRecruitmentProcess',
        query: {
          isRecruitment,
        },
      });
      if (res) {
        props.putSuccess(_l`Added`, '', 2000);
        getSalesMethod();
      }
    } catch (error) {
      getSalesMethod();
      if (error.message === 'CAN_NOT_CHANGE_SALES_METHOD_MODE_IN_USING') {
        props.putError('Sales Process is used by at least one active deal');
      }
      if (error.message === 'REQUIRE_AT_LEAST_ONE_SALES_METHOD_IN_USING') {
        props.putError('At least one recruitment process need to be active');
      }
      if (error.message === 'PIPELINE_CONTAINS_ACTIVE_DEALS') {
        props.putError('Pipeline contains active deals');
      }
      if (error.message === 'REQUIRE_AT_LEAST_ONE_RECRUITMENT_CASE_IN_USING') {
        props.putError('At least one recruitment process need to be active');
      }
    }
  };

  const onTimeState = async ({ enabled }) => {
    console.log('enable', enabled);
    const obj = {
      ...salesProcess,
      notificationStatus: !enabled,
    };
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/update',
        data: { ...obj },
      });
      if (res) {
        // props.putSuccess(_l`Added`, '', 2000);
        // getSalesMethod();
      }
    } catch (error) {
      console.log(error);
      // props.putError(error);
    }
  };

  const onEdit = (sale, active, label) => {
    console.log('sale', sale);
    const _modal = {
      status: true,
      type: 'EDIT_SETTING',
      form: { ...sale },
      active,
      label,
      fnOk: async (data) => {
        console.log('edit', data);
        try {
          const res = await api.post({
            resource: 'administration-v3.0/salesMethod/update',
            data: { ...data },
          });
          if (res) {
            props.putSuccess(`Added`, '', 2000);
            setSalesProcess(res);
          }
        } catch (error) {
          console.log(error);
          // props.putError(error);
        }
        setAddModal({ status: false });
      },
      fnCancel: () => {
        setAddModal({ status: false });
      },
    };
    setAddModal(_modal);
  };

  const _handleNotificationTime = (e, { value }) => {
    console.log('aa', value);
    console.log('notificationTime', salesProcess);
    const obj = { ...salesProcess };
    obj.notificationTime = value;
    setSalesProcess(obj);
  };

  const onUpdate = async () => {
    try {
      const res = await api.post({
        resource: 'administration-v3.0/salesMethod/update',
        data: { ...salesProcess },
      });
      if (res) {
        props.putSuccess(`Updated`, '', 2000);
        setSalesProcess(res);
      }
    } catch (error) {
      console.log(error);
      // props.putError(error);
    }
  };

  console.log('render =>>>>>', salesProcess, salesProcess.mode === 'SEQUENTIAL' ? true : false);
  return (
    <div className={cx(css.container)}>
      <div className={css.activity}>
        <div className={css.header}>
          <span>{_l`Pipeline steps`}</span>
          <div className={otherCss.actionBtn} style={{ justifyContent: 'flex-end' }}>
            {/*            <div className={otherCss.btnAdd} onClick={addActivity}>
              <div />
            </div>*/}
            <IconButton
              buttonName='configBtn'
              name="profile"
              size={24}
              src={add}
              onClick={addActivity}
              imageClass={css.addIconSize}
              style={{ marginRight: '0px !important' }}
            />
          </div>
        </div>
        <div className={css.main}>
          <div className={cx(css.listItem, css.Title)}>
            <div className={css.name}>
              <span>{_l`Stage`}</span>
            </div>
            {salesProcess.manualProgress === 'OFF' ? (
              <div className={css.process}>
                <span>{_l`Progress`}</span>
              </div>
            ) : (
              <div className={css.process}></div>
            )}

            {/* <div className={css.appointment}>
              <span>{_l`Appointment`}</span>
            </div> */}
            <div className={css.behavior}>
              <span>{_l`Behavior`}</span>
            </div>
            <div className={css.drag} />
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided, droppableSnapshot) => (
                <div ref={droppableProvided.innerRef} style={getListStyle(droppableSnapshot.isDraggingOver)}>
                  {activityList.map((activity, index) => {
                    let disc = '';
                    let discDesc = '';
                    if (activity.discProfile === 'NONE') {
                      disc = 'transparent';
                      discDesc = 'Behaviour not defined';
                    } else if (activity.discProfile === 'BLUE') {
                      disc = '#2F83EB';
                      discDesc = 'Likes facts, quality and accuracy';
                    } else if (activity.discProfile === 'RED') {
                      disc = '#ed684e';
                      discDesc = 'Likes to take quick decisions, to act and take lead';
                    } else if (activity.discProfile === 'GREEN') {
                      disc = '#A9D231';
                      discDesc = 'Likes socialising, collaboration and security';
                    } else if (activity.discProfile === 'YELLOW') {
                      disc = '#F5B342';
                      discDesc = 'Likes to convince, influence and inspire others';
                    }
                    return (
                      <Draggable key={activity.uuid} index={index} draggableId={activity.uuid}>
                        {(draggableProvided, draggableSnapshot) => (
                          <div
                            className={cx(css.listItem)}
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            // style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                          >
                            <div className={css.name}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10' }}>{activity.name}</span>
                                <Popup
                                  hoverable
                                  trigger={<div className={`${css.infoIcon}`} />}
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '400',
                                    width: '100% !important',
                                    wordBreak: 'break-all',
                                  }}
                                  content={<span>{activity.description}</span>}
                                />
                              </div>
                            </div>
                            {salesProcess.manualProgress === 'OFF' ? (
                              <div className={css.process}>
                                <span>{activity.progress}</span>
                              </div>
                            ) : (
                              <div className={css.process}></div>
                            )}

                            {/* <div className={css.appointment}>
                              <span>{activity.meeting}</span>
                            </div> */}
                            <div className={css.behavior}>
                              <Popup
                                hoverable
                                trigger={<span className={cx(css.discProfile)} style={{ backgroundColor: disc }} />}
                                style={{
                                  fontSize: 11,
                                  fontWeight: '400',
                                  width: '100% !important',
                                  wordBreak: 'break-all',
                                }}
                                content={<span>{discDesc}</span>}
                              />
                            </div>
                            <div className={css.drag}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Icon name="list ul" size="big" color="grey" style={{ fontSize: '14px' }} />
                                <MoreMenu className={otherCss.bgMore} color="task">
                                  <Menu.Item icon onClick={() => editActivity(activity)}>
                                    <div className={otherCss.actionIcon}>
                                      {_l`Update`}
                                      <img style={{ height: '13px', width: '20px' }} src={editBtn} />
                                    </div>
                                  </Menu.Item>
                                  <Menu.Item icon onClick={() => deleteActivity(activity)}>
                                    <div className={otherCss.actionIcon}>
                                      {_l`Delete`}
                                      <Icon name="trash alternate" color="grey" />
                                    </div>
                                  </Menu.Item>
                                </MoreMenu>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10' }}>
            <Button className={cx(css.btn)} onClick={onUpdateActivity}>{_l`Done`}</Button>
          </div>
        </div>
      </div>
      <div className={css.settings}>
        <div className={css.header}>
          <span>{_l`Pipeline settings`}</span>
          <div className={otherCss.actionBtn} />
        </div>
        <div className={css.main}>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Stage based`}</span>
            </div>
            <div className={css.processColumn2}>
              <Switch
                theme="graphite-small"
                className="d-flex"
                enabled={salesProcess.mode === 'SEQUENTIAL' ? false : true}
                onStateChanged={toggleStage}
                id={Math.random()}
              />
            </div>
          </div>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Manual progress`}</span>
            </div>
            <div className={css.processColumn2}>
              <Switch
                theme="graphite-small"
                className="d-flex"
                enabled={salesProcess.manualProgress === 'OFF' ? true : false}
                onStateChanged={toggleManual}
                id={Math.random()}
              />
            </div>
          </div>
          {/* <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Hours/quote`}</span>
            </div>
            <div className={css.processColumn2}>
              <span>{salesProcess.hoursPerQuote}</span>
              <img
                style={{ height: '13px', width: '10px', marginLeft: '10' }}
                src={editBtn}
                onClick={() => onEdit(salesProcess, 'hoursPerQuote', _l`Hours/quote`)}
              />
            </div>
          </div>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Hours/contract`}</span>
            </div>
            <div className={css.processColumn2}>
              <span>{salesProcess.hoursPerContract}</span>
              <img
                style={{ height: '13px', width: '10px', marginLeft: '10' }}
                src={editBtn}
                onClick={() => onEdit(salesProcess, 'hoursPerContract', _l`Hours/contract`)}
              />
            </div>
          </div> */}
          {/* <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Travelling hours/appointment`}</span>
            </div>
            <div className={css.processColumn2}>
              <span>{salesProcess.travellingHoursPerAppointment}</span>
              <img
                style={{ height: '13px', width: '10px', marginLeft: '10' }}
                src={editBtn}
                onClick={() => onEdit(salesProcess, 'travellingHoursPerAppointment', _l`Travelling hours/appointment`)}
              />
            </div>
          </div>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{_l`Progress reduction`}</span>
                <Popup
                  hoverable
                  trigger={<div className={`${css.infoIcon}`} />}
                  style={{
                    fontSize: 11,
                    fontWeight: '400',
                    width: '100% !important',
                    wordBreak: 'break-all',
                  }}
                  content={
                    <span>{_l`Percentage with which the weighted of the opportunity is decreased if there is no next appointment or task on the opportunity`}</span>
                  }
                />
              </div>
            </div>
            <div className={css.processColumn2}>
              <span>{salesProcess.loseMeetingRatio}</span>
              <img
                style={{ height: '13px', width: '10px', marginLeft: '10' }}
                src={editBtn}
                onClick={() => onEdit(salesProcess, 'loseMeetingRatio', _l`Progress reduction`)}
              />
            </div>
          </div> */}
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{_l`Notification time`}</span>
                <Popup
                  hoverable
                  trigger={<div className={`${css.infoIcon}`} />}
                  style={{
                    fontSize: 11,
                    fontWeight: '400',
                    width: '100% !important',
                    wordWrap: 'break-word !important',
                  }}
                  content={_l`Number of days before contract date a notification is sent to opportunity team. The notification is a reminder that contract date is closing`}
                />
              </div>
            </div>
            <div className={css.processColumn2}>
              <Input
                value={salesProcess.notificationTime}
                style={{ width: '35px' }}
                onChange={_handleNotificationTime}
                onBlur={onUpdate}
                type="number"
              />
              {/* <span>{salesProcess.notificationTime}</span>
              <img
                style={{ height: '13px', width: '10px', marginLeft: '10' }}
                src={editBtn}
                onClick={() => onEdit(salesProcess, 'notificationTime', _l`Notification time`)}
              /> */}
            </div>
          </div>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <span>{_l`Notification time status`}</span>
            </div>
            <div className={css.processColumn2}>
              <Switch
                theme="graphite-small"
                className="d-flex"
                enabled={!salesProcess.notificationStatus}
                id={Math.random()}
                onStateChanged={onTimeState}
              />
            </div>
          </div>
          <div className={cx(css.listItem)}>
            <div className={css.processColumn}>
              <AutomaticReminder />
            </div>
            <div className={css.processColumn2}>
              <Switch
                theme="graphite-small"
                className="d-flex"
                enabled={salesProcess.automaticReminder === 'ON' ? false : true}
                onStateChanged={autoStage}
                id={Math.random()}
              />
            </div>
          </div>
          {(props.newIndustry === 'IT_CONSULTANCY') && (
            <div className={cx(css.listItem)}>
              <div className={css.processColumn}>
                <span>{_l`Recruitment process`}</span>
              </div>
              <div className={css.processColumn2}>
                <Switch
                  theme="graphite-small"
                  className="d-flex"
                  enabled={!salesProcess.recruitment}
                  id={Math.random()}
                  onStateChanged={onRecruitment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <AddActivityModal
        visible={addModal.status && addModal.type === 'ADD_ACTIVITY'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
        form={addModal.form || {}}
        uuid={props.uuid}
        modeAdd={addModal.type === 'ADD_ACTIVITY' ? true : false}
      />
      <AddActivityModal
        visible={addModal.status && addModal.type === 'EDIT_ACTIVITY'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
        form={addModal.form || {}}
        uuid={props.uuid}
        modeAdd={addModal.type === 'ADD_ACTIVITY' ? true : false}
      />
      <EditSettingsModal
        visible={addModal.status && addModal.type === 'EDIT_SETTING'}
        onClose={addModal.fnCancel}
        onDone={addModal.fnOk}
        form={addModal.form || {}}
        label={addModal.label}
        active={addModal.active}
      />
      <ConfirmModal
        visible={confirmModal.status}
        fnOk={confirmModal.fnOk}
        fnCancel={confirmModal.fnCancel}
        title={confirmModal.title}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    newIndustry: state.auth?.company?.newIndustry,
  }
}
export default connect(mapStateToProps, {
  putError: NotificationActions.error,
  putSuccess: NotificationActions.success,
})(SaleDetail);

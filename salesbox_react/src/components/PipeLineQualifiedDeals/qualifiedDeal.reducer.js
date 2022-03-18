// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import { OverviewTypes, APPOINTMENT_SUGGEST_ACTION_NAME } from '../../Constants';
import ActionTypes from './qualifiedDeal.actions';
import OrderActionTypes from '../OrderRow/order-row.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import {default as AppointmentType} from './../Appointment/appointment.actions'
import TaskActions from "../Task/task.actions";

export const initialState = {
  __CREATE: { contractDate: new Date() },
  __EDIT: {},
  __ERRORS: {},
  __DETAIL: {},
  __DETAIL_TO_EDIT:{},
  __TASK_STEPS: {},
  __SEARCH_PROGRESS_LIST: {
    orderBy: 'contractDate',
  },
  __COMMON_DATA: {
    taskRefesh: 0,
    actionPlanRefesh: 0,
    listShow: false,
    isAll: false,
    OpportunityReportInfo: {}
  },
  __ACTIVE_TAB: 0,
  __ORDER_CREATE: { contractDate: new Date() },
  __ORDER_ERRORS: {},
  __ORDER_SALE: {
    isAll: true,
  },
  __DOCUMENTS: {
    isFetching: false,
  },
};
const consumeEntities = createConsumeEntities('qualifiedDeal');

export default createReducer(initialState, {

  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
    draft.__CREATE = { contractDate: new Date() };
    draft.__EDIT = {};
    draft.__ERRORS = {};
    draft.__DETAIL = {};
    draft.__TASK_STEPS = {};
    draft.__SEARCH_PROGRESS_LIST = {
      orderBy: 'contractDate',
    };
    draft.__COMMON_DATA = {
      taskRefesh: 0,
      actionPlanRefesh: 0,
      listShow: false,
      isAll: false,
      OpportunityReportInfo: {}
    };
    draft.__ACTIVE_TAB = 0;
    draft.__ORDER_CREATE = { contractDate: new Date() };
    draft.__ORDER_ERRORS = {};
    draft.__ORDER_SALE = {
      isAll: true,
    };
    draft.__DOCUMENTS = {
      isFetching: false,
    };
  },
  [ActionTypes.FETCH_COUNT_BY_STEPS_SUCCESS]: (draft, { salesProcessId, data }) => {
    draft.__TASK_STEPS[salesProcessId] = data;
  },

  [ActionTypes.REFESH_ACTION_PLAN]: (draft) => {
    draft.__COMMON_DATA = draft.__COMMON_DATA || {};
    draft.__COMMON_DATA = {
      ...draft.__COMMON_DATA,
      actionPlanRefesh: draft.__COMMON_DATA.actionPlanRefesh + 1,
    };
  },

  [ActionTypes.FETCH_QUALIFIED_DATA_SUCESS]: (draft, { salesMethodDTOList, salesMethodUsing }) => {
    draft.__COMMON_DATA['salesMethodDTOList'] = salesMethodDTOList;
    draft.__COMMON_DATA['salesMethodUsing'] = salesMethodUsing;
  },
  //UPDATE_STEPS
  [ActionTypes.UPDATE_STEPS]: (draft, { newSteps, salesProcessId }) => {
    draft.__TASK_STEPS[salesProcessId] = newSteps;
  },

  //CHANGE_LIST_SHOW
  [ActionTypes.CHANGE_LIST_SHOW]: (draft) => {
    draft.__COMMON_DATA.listShow = !draft.__COMMON_DATA.listShow;
    draft.__COMMON_DATA.isAll = draft.__COMMON_DATA.listShow ? true : false;
  },

  //UPDATE_SALE_METHOD_ACTIVE
  [ActionTypes.UPDATE_SALE_METHOD_ACTIVE]: (draft, { saleMethodId }) => {
    draft.__COMMON_DATA.isAll = false;
    draft.__COMMON_DATA['salesMethodUsing'] = draft.__COMMON_DATA['salesMethodUsing'].map((value) => {
      return {
        ...value,
        isActive: value.uuid === saleMethodId,
      };
    });
  },

  //ActionTypes.FETCH_LIST_SALE_PROCESS_SUCCESS
  [ActionTypes.FETCH_LIST_SALE_PROCESS_SUCCESS]: (draft, { salesProcessId, data }) => {
    draft.__TASK_STEPS[salesProcessId] = data;
  },

  //FETCH_QUALIFIED_DATA_SUCESS
  default: consumeEntities,

  [ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS]: (draft, { qualified }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = {
      ...draft.__DETAIL,
      ...qualified,
    };
  },
  [ActionTypes.FETCH_QUALIFIED_DETAIL_TO_EDIT_SUCCESS]: (draft, { qualified }) => {
    draft.__DETAIL_TO_EDIT = draft.__DETAIL_TO_EDIT || {};
    draft.__DETAIL_TO_EDIT = {
      ...draft.__DETAIL_TO_EDIT,
      ...qualified,
    };
  },
  [ActionTypes.CREATE_ENTITY_QUALIFIED]: (draft, { formKey, data }) => {

    draft[formKey] = {
      ...draft[formKey],
      ...data,
    };
  },
  [ActionTypes.CREATE_ERRORS_QUALIFIED]: (draft, { formKey, data }) => {
    draft[formKey] = {
      ...draft[formKey],
      ...data,
    };
  },
  [ActionTypes.CLEAR_CREATE_ENTITY]: (draft, { formKey }) => {
    draft[formKey] = { ...initialState[formKey] };
  },

  [ActionTypes.FETCH_TASKS_SUCCESS]: (draft, { qualifiedDealId, entities }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].tasks = entities.task ? Object.keys(entities.task) : null;
    draft.__DETAIL.tasks = entities.task ? Object.keys(entities.task) : null;
  },
  [ActionTypes.REFESH_TASK]: (draft) => {
    draft.__COMMON_DATA = draft.__COMMON_DATA || {};
    draft.__COMMON_DATA = {
      ...draft.__COMMON_DATA,
      taskRefesh: draft.__COMMON_DATA.taskRefesh + 1,
    };
  },

  //FETCH_APPOINTMENTS_SUCCESS
  [ActionTypes.FETCH_APPOINTMENTS_SUCCESS]: (draft, { qualifiedDealId, appointments }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].appointments = appointments;
    draft.__DETAIL = {
      ...draft.__DETAIL,
      appointments: appointments,
    };
  },

  [ActionTypes.FETCH_ACTION_PLAN_SUCCESS]: (draft, { qualifiedDealId, actionPlan }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].actionPlan = actionPlan;
    draft.__DETAIL = {
      ...draft.__DETAIL,
      actionPlan: actionPlan,
    };
  },

  [ActionTypes.REFESH_DESCRIPTION_PHOTO]: (draft, { description, photoId }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    if (draft.__DETAIL.uuid) {
      const uuid = draft.__DETAIL.uuid;
      draft[uuid] = draft[uuid] || {
        photos: []
      };
      draft[uuid].photos = draft[uuid].photos.map(photo => {
        if (photo.uuid === photoId) {
          return {
            ...photo,
            description
          }
        }
        return photo;
      });
      draft.__DETAIL.photos = draft.__DETAIL.photos.map(photo => {
        if (photo.uuid === photoId) {
          return {
            ...photo,
            description
          }
        }
        return photo;
      });
    }

  },

  //FETCH_PHOTOS_SUCCESS
  [ActionTypes.FETCH_PHOTOS_SUCCESS]: (draft, { qualifiedDealId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].photos = data;
    draft.__DETAIL.photos = data;
  },

  [ActionTypes.FETCH_PRODUCTS_SUCCESS]: (draft, { qualifiedDealId, products }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].products = products;
    draft.__DETAIL = {
      ...draft.__DETAIL,
      products: products,
    };
  },

  //FETCH_PRODUCTS_SUCCESS

  [ActionTypes.FETCH_NOTES_SUCCESS]: (draft, { qualifiedDealId, notes }) => {
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].notes = notes;
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = {
      ...draft.__DETAIL,
      notes: notes,
    };
  },
  //SORT_ORDER_BY
  [ActionTypes.SORT_ORDER_BY]: (draft, { orderBy }) => {
    draft.__SEARCH_PROGRESS_LIST.orderBy = orderBy;
  },

  //PROGRESS_UPDATE
  [ActionTypes.PROGRESS_UPDATE]: (draft, { uuid, finished, salesProcessId, prospectId }) => {

    //DETAIL CHANGE

    draft.__DETAIL = draft.__DETAIL || {};

    if (draft.__DETAIL.uuid === prospectId) {
      draft.__DETAIL.actionPlan = draft.__DETAIL.actionPlan || {};
      if (draft.__DETAIL.actionPlan.prospectProgressDTOList) {
        draft.__DETAIL.actionPlan.prospectProgressDTOList = draft.__DETAIL.actionPlan.prospectProgressDTOList.map((value) => {
          if (value.uuid === uuid) {
            return {
              ...value,
              finished: !value.finished
            }
          }
          return {
            ...value
          }
        })
      }
    }

    //step change
    draft.__TASK_STEPS = draft.__TASK_STEPS || {};
    let prospects = draft.__TASK_STEPS[salesProcessId] || [];
    let prospectIndex = prospects.findIndex((item) => item.uuid === prospectId);
    if (prospectIndex !== -1) {
      let prospect = draft.__TASK_STEPS[salesProcessId][prospectIndex];
      let offsetPercent = 0;
      const newProspectProgressDTOList = prospect.prospectProgressDTOList.map((value) => {
        if (value.uuid === uuid) {
          offsetPercent = value.progress;
          return {
            ...value,
            finished,
          };
        }
        return {
          ...value,
        };
      });
      prospect.prospectProgress = Number(prospect.prospectProgress) + (finished ? Number(offsetPercent) : (-Number(offsetPercent)))
      prospect.prospectProgressDTOList = newProspectProgressDTOList;
      draft.__TASK_STEPS[salesProcessId][prospectIndex] = prospect;
    }
  },

  // [ActionTypes.UPDATE_STEP_LOCAL]: (draft, { activityId, salesProcessId, qualifiedId, oldActivityId }) => {
  //   draft.__TASK_STEPS = draft.__TASK_STEPS || {}
  //   let prospects = draft.__TASK_STEPS[salesProcessId] || [];
  //   let prospectIndexNew = prospects.findIndex(item => item.uuid === activityId);
  //   const prospectIndexOld =
  //   if (prospectIndexNew !== -1) {
  //     let prospect = draft.__TASK_STEPS[salesProcessId][prospectIndexNew];
  //     let offsetPercent = 0;
  //     const prospectDTOList = prospect.prospectProgressDTOList.map(value => {
  //       if (value.uuid === uuid) {
  //         offsetPercent = value.progress;
  //         return {
  //           ...value,
  //           finished
  //         }
  //       }
  //       return {
  //         ...value
  //       }
  //     });
  //     prospect.prospectProgress = Number(prospect.prospectProgress) + (finished ? Number(offsetPercent) : (-Number(offsetPercent)))
  //     prospect.prospectProgressDTOList = newProspectProgressDTOList;
  //     draft.__TASK_STEPS[salesProcessId][prospectIndex] = prospect;
  //   }


  // },
  [ActionTypes.MOVE_STEP_ACTION_PLAN_LOCAL]: (draft, { stepId, newProgress }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.actionPlan = draft.__DETAIL.actionPlan || {};

    if (draft.__DETAIL.actionPlan.prospectProgressDTOList) {
      const findChangeIndex = draft.__DETAIL.actionPlan.prospectProgressDTOList.findIndex(value => value.uuid === stepId);
      draft.__DETAIL.actionPlan.prospectProgressDTOList = draft.__DETAIL.actionPlan.prospectProgressDTOList.map((value, idx) => {
        if (value.uuid === stepId) {
          draft.__DETAIL.realProspectProgress = value.progress;

        }

        if (idx <= findChangeIndex) {
          return {
            ...value,
            finished: true
          }
        } else if (idx > findChangeIndex) {
          return {
            ...value,
            finished: false
          }
        }
        return {
          ...value
        }
      })
    } else {
      draft.__DETAIL.realProspectProgress = newProgress;
    }
  },

  //LIST_CHANGE_NEXT_STEP

  [ActionTypes.LIST_CHANGE_NEXT_STEP]: (draft, { firstNextStep, secondNextStep, qualifiedDealId }) => {
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].firstNextStep = firstNextStep;
    draft[qualifiedDealId].secondNextStep = secondNextStep;
  },
  //SORT_ORDER_BY
  [ActionTypes.SORT_ORDER_BY]: (draft, { orderBy }) => {
    draft.__SEARCH_PROGRESS_LIST.orderBy = orderBy;
  },

  [ActionTypes.MOVE_STEP_ACTION_PLAN]: (draft, { stepId }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.actionPlan = draft.__DETAIL.actionPlan || {};
    if (draft.__DETAIL.actionPlan.prospectProgressDTOList) {
      const findChangeIndex = draft.__DETAIL.actionPlan.prospectProgressDTOList.findIndex(value => value.uuid === stepId);
      draft.__DETAIL.actionPlan.prospectProgressDTOList = draft.__DETAIL.actionPlan.prospectProgressDTOList.map((value, idx) => {

        if (value.uuid === stepId) {
          if (!value.finished) {
            draft.__DETAIL.realProspectProgress = value.progress;
          } else {
            draft.__DETAIL.realProspectProgress = draft.__DETAIL.actionPlan.prospectProgressDTOList[findChangeIndex - 1].progress;
          }
          return {
            ...value,
            finished: !value.finished
          }
        }

        if (idx < findChangeIndex) {
          return {
            ...value,
            finished: true
          }
        } else if (idx > findChangeIndex) {
          return {
            ...value,
            finished: false
          }
        }
        return {
          ...value
        }
      })
    }
  },
  //

  [ActionTypes.UPDATE_LIST_SALE_METHOD_USING]: (draft, payload) => {
    const salesMethodDTOList = draft.__COMMON_DATA.salesMethodDTOList || [];
    const countProspectBySalesProcessDTOs = payload.data || [];
    const salesMethodUsing = salesMethodDTOList
      .filter((value) => {
        const checkInCountProspectBySalesProcessDTOs = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === value.uuid;
        });
        return (value.using && !value.deleted) || checkInCountProspectBySalesProcessDTOs !== -1;
      })
      .map((val, index) => {
        const sortIndex = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === val.uuid;
        });
        return {
          ...val,
          sortIndex: sortIndex !== -1 ? sortIndex : null,
          grossValue: sortIndex !== -1 ? countProspectBySalesProcessDTOs[sortIndex].grossValue : 0,
          isActive: index === 0 ? true : false,
        };
      })
      .sort((value1, value2) => {
        if (value1.sortIndex === value2.sortIndex) {
          return 0;
        } else if (value1.sortIndex === null) {
          return 1;
        } else if (value2.sortIndex === null) {
          return -1;
        } else if (true) {
          return value1.sortIndex < value2.sortIndex ? -1 : 1;
        }
      });
    draft.__COMMON_DATA.salesMethodUsing = salesMethodUsing.length > 0 ? salesMethodUsing : payload.data;
  },
  [ActionTypes.UPDATE_LIST_ACTIVITY]: (draft, payload) => {
    const countProspectBySalesProcessDTOs = draft.__COMMON_DATA.salesMethodUsing || [];
    const salesMethodUsing = payload.data
      .filter((value) => {
        const checkInCountProspectBySalesProcessDTOs = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === value.uuid;
        });
        return (value.using && !value.deleted) || checkInCountProspectBySalesProcessDTOs !== -1;
      })
      .map((val, index) => {
        const sortIndex = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === val.uuid;
        });
        return {
          ...val,
          sortIndex: sortIndex !== -1 ? sortIndex : null,
          grossValue: sortIndex !== -1 ? countProspectBySalesProcessDTOs[sortIndex].grossValue : 0,
          isActive: index === 0 ? true : false,
        };
      })
      .sort((value1, value2) => {
        if (value1.sortIndex === value2.sortIndex) {
          return 0;
        } else if (value1.sortIndex === null) {
          return 1;
        } else if (value2.sortIndex === null) {
          return -1;
        } else if (true) {
          return value1.sortIndex < value2.sortIndex ? -1 : 1;
        }
      });
    draft.__COMMON_DATA.salesMethodDTOList = payload.data;
    draft.__COMMON_DATA.salesMethodUsing = salesMethodUsing;
  },
  [ActionTypes.UPDATE_SALE_ALL]: (draft) => {
    draft.__COMMON_DATA.isAll = true;
  },
  [ActionTypes.UPDATE_QUALIFIED_DEAL]: (draft, { data }) => {
    // Object.keys(draft).map((key) => {
    //   if (key === data.prospectId) {
    //     draft[key].favorite = data.favorite;
    //     return;
    //   }
    // });
    if (data) {
      if (data.prospectId === draft.__DETAIL.uuid) {
        draft.__DETAIL.favorite = data.favorite;
      }
      if (draft[data.prospectId]) draft[data.prospectId].favorite = data.favorite;
    }
  },
  [OrderActionTypes.UPDATE_DONE]: (draft, { overviewType, rows, formKey }) => {
    // if (overviewType === OverviewTypes.Pipeline.Qualified) {
    const orderRowCustomFieldDTOList = [];
    rows.map((r) => {
      const {
        costUnit,
        deliveryEndDate,
        deliveryStartDate,
        description,
        discountPercent,
        discountedPrice,
        lineOfBusinessId,
        margin,
        measurementTypeId,
        price,
        productDTO,
        lineOfBusinessName,
        measurementTypeName,
        occupied,
        periodNumber,
        type,
        periodType
      } = r;
      const orderRowDTO = {
        uuid: null,
        type: type ? type : 'NORMAL',
        productList: null,
        periodType: periodType ? periodType: null,
        periodNumber: periodNumber ? periodNumber : 0,
        costUnit,
        deliveryEndDate,
        deliveryStartDate,
        description,
        discountPercent,
        discountedPrice,
        lineOfBusinessId,
        margin,
        measurementTypeId,
        price,
        productDTO,
        numberOfUnit: r.quantity,
        lineOfBusinessName,
        measurementTypeName,
        occupied
      };
      // orderRowCustomFieldDTOList[r.id] = { listCustomFieldDTOs: [], orderRowDTO }
      orderRowCustomFieldDTOList.push({ listCustomFieldDTOs: [], orderRowDTO });
    });
    // if (overviewType === OverviewTypes.Pipeline.Qualified) {
    draft[formKey] = {
      ...draft[formKey],
      orderRowCustomFieldDTOList,
    };
    // }
    // if (overviewType === OverviewTypes.Order) {
    draft.__ORDER_CREATE = {
      ...draft.__ORDER_CREATE,
      orderRowCustomFieldDTOList,
    };

    draft.__ORDER_ERRORS = { ...draft.__ORDER_ERRORS, product: null };
    // }
    // }
  },
  [ActionTypes.CHANGE_TAB]: (draft, { overviewType, tab }) => {
    draft.__ACTIVE_TAB = tab;
  },
  [ActionTypes.COPY_ENTITY_QUALIFIED]: (draft, { data }) => {

    const { participantList, organisation, sponsorList, description, salesMethod, manualProgress, contractDate, leadId } = data;
    const orderRowCustomFieldDTOList = data.orderRowCustomFieldDTOList && data.orderRowCustomFieldDTOList.length > 0 ?
      data.orderRowCustomFieldDTOList.map((o) => {
        return {
          listCustomFieldDTOs: o.listCustomFieldDTOs ? o.listCustomFieldDTOs : [],
          orderRowDTO: {
            ...o.orderRowDTO,
            uuid: null,
          }
        }
      }) : [];
    draft.__CREATE = {
      participantList, sponsorList, description, salesMethod, manualProgress, orderRowCustomFieldDTOList, contractDate,
      organisation: organisation ? { uuid: organisation.uuid } : null,
      salesMethod: salesMethod ? { uuid: salesMethod.uuid } : null,
      orderRowCustomFieldDTOList,
      leadId: leadId
    };
  },
  [ActionTypes.COPY_ENTITY_ORDER]: (draft, { data }) => {

    const { participantList, organisation, sponsorList, description, contractDate, leadId } = data;
    const orderRowCustomFieldDTOList = data.orderRowCustomFieldDTOList && data.orderRowCustomFieldDTOList.length > 0 ?
      data.orderRowCustomFieldDTOList.map((o) => {
        return {
          listCustomFieldDTOs: o.listCustomFieldDTOs ? o.listCustomFieldDTOs : [],
          orderRowDTO: {
            ...o.orderRowDTO,
            uuid: null,
          }
        }
      }) : [];
    draft.__ORDER_CREATE = {
      participantList, sponsorList, description, orderRowCustomFieldDTOList, contractDate,
      organisation: organisation && organisation.uuid ? { uuid: organisation.uuid } : null,
      orderRowCustomFieldDTOList,
      leadId: leadId
    };
  },
  //UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS
  [ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS]: (draft, { qualifiedDealId, ownerAvatar }) => {
    draft[qualifiedDealId] = draft[qualifiedDealId] || {};
    draft[qualifiedDealId].ownerAvatar = ownerAvatar;
  },

  [ActionTypes.GET_OPPORT_UNITY_REPORT_INFO_SUCCESS]: (draft, { data }) => {
    draft.__COMMON_DATA = draft.__COMMON_DATA || {};
    draft.__COMMON_DATA.OpportunityReportInfo = data;
  },
  //GET_OPPORT_UNITY_REPORT_INFO_SUCCESS
  //Update edit qualified entity
  [ActionTypes.UPDATE_ENTITY_QUALIFIED]: (draft) => {
    const { participantList, sponsorList, description, salesMethodUuid, manualProgress, contractDate,
      organisationId, uuid, wonLostDate,
      leadId, lineOfBusinessDTOList } = draft.__DETAIL_TO_EDIT.uuid !== draft.__DETAIL.uuid ? draft.__DETAIL_TO_EDIT : draft.__DETAIL;
    draft.__EDIT = {
      participantList, sponsorList, description, manualProgress, contractDate, wonLostDate, leadId, lineOfBusinessList: lineOfBusinessDTOList,
      organisation: organisationId ? { uuid: organisationId } : null,
      salesMethod: salesMethodUuid ? { uuid: salesMethodUuid } : null,
      uuid,
    };
  },
  [ActionTypes.UPDATE_INFO_FOR_DETAIL_TO_EDIT]:(draft, {data}) => {
    draft.__DETAIL_TO_EDIT.uuid = data.qualifiedDealId;
  },
  [ActionTypes.CHANGE_ORDER_SALE]: (draft, { isAll, saleId }) => {
    draft.__ORDER_SALE = {
      isAll: isAll,
      saleId: isAll ? null : saleId,
    };
  },
  [ActionTypes.FETCH_DOCUMENTS_STORAGE_SUCCESS]: (draft, { data }) => {

    draft.__DOCUMENTS = {
      ...draft.__DOCUMENTS,
      storageDTOList: data.storageDTOList,
      userStorageIntegrationDTOList: data.userStorageIntegrationDTOList,
    };
  },
  [ActionTypes.FETCH_DOCUMENTS_ROOT_FOLDER_SUCCESS]: (draft, { data }) => {
    draft.__DOCUMENTS.isFetching = false;
    draft.__DOCUMENTS = {
      ...draft.__DOCUMENTS,
      ...data,
    };
  },
  [ActionTypes.FETCH_DOCUMENTS_BY_FILEID]: (draft) => {
    draft.__DOCUMENTS.isFetching = true;
  },
  [ActionTypes.FETCH_DOCUMENTS_BY_FILEID_SUCCESS]: (draft, { data, clear }) => {
    const documents = draft.__DOCUMENTS.documentDTOList;
    if (clear) {
      draft.__DOCUMENTS.documentDTOList = data.documentDTOList;
    } else {
      draft.__DOCUMENTS.documentDTOList = [...documents, ...data.documentDTOList]
    }
    draft.__DOCUMENTS.isFetching = false;
  },
  [ActionTypes.FETCH_DOCUMENTS_BY_FILEID_FAIL]: (draft) => {
    draft.__DOCUMENTS.isFetching = false;
  },
  [ActionTypes.CHANGE_DOCUMENT_SELECTED]: (draft, { node }) => {
    draft.__DOCUMENTS.selected = node ? node : draft.__DOCUMENTS.rootFolder;
  },
  [ActionTypes.FETCH_DOCUMENTS_ROOT_FOLDER]: (draft) => {
    draft.__DOCUMENTS.isFetching = true;
  },
  [ActionTypes.DELETE_DOCUMENT_SELECTED]: (draft, { fileId }) => {
    const documents = draft.__DOCUMENTS.documentDTOList;
    const currentIndex = documents.findIndex((x) => x.fileId === fileId);
    // If current is root => selected = root folder
    // if (currentDocument.isRoot) {
    //   draft.__DOCUMENTS.selected = draft.__DOCUMENTS.rootFolder;
    // }

    // if (currentDocument && currentDocument.parentId) {
    //   const parent = documents.findIndex((x) => x.fileId === currentDocument.parentId);
    //   draft.__DOCUMENTS.selected = parent;
    // }
    if (currentIndex >= 0) {
      draft.__DOCUMENTS.documentDTOList = [...documents.slice(0, currentIndex), ...documents.slice(currentIndex + 1)];
      draft.__DOCUMENTS.selected = null;
    }
  },
  [ActionTypes.UPDATE_CREATE_ENTITY]: (draft, { data, overviewType }) => {
    const { contacts, organisation } = data || {};
    if(overviewType == OverviewTypes.Contact_Order
      || overviewType == OverviewTypes.Account_Order){
      draft.__ORDER_CREATE = {
        ...draft.__ORDER_CREATE,
        // organisationId,
        // organisationId: organisation!=null && organisation.uuid!=null ? organisation.uuid: organisationId,
        // leadId: null,
        // contactId: contactDTO && contactDTO.uuid,
        // contactDTO,
        organisation: organisation,
        // prospectId: null,
        // organisationName
        sponsorList: contacts || draft.__ORDER_CREATE.sponsorList
      };
    } else {

    draft.__CREATE = {
      ...draft.__CREATE,
      // organisationId,
      // organisationId: organisation!=null && organisation.uuid!=null ? organisation.uuid: organisationId,
      // leadId: null,
      // contactId: contactDTO && contactDTO.uuid,
      // contactDTO,
      organisation: organisation,
      // prospectId: null,
      // organisationName
      sponsorList: contacts || draft.__CREATE.sponsorList
    };
    }
  },
  [ActionTypes.CLEAR_DETAIL_TO_EDIT]:(draft) => {
    draft.__DETAIL_TO_EDIT = {}
  },
  [AppointmentType.SET_CURRENT_SUGGEST_ACTION] : (draft, { actionName, appointment }) => {
    if(actionName === APPOINTMENT_SUGGEST_ACTION_NAME.ADD_DEAL) {
      if(appointment.contactList && appointment.contactList.length > 0) {
        let _contacts = []
        for(let i = 0; i < appointment.contactList.length; i++) {
          _contacts.push({
           uuid: appointment.contactList[i].uuid
          })
        }
        draft['__CREATE'].sponsorList = _contacts;
      }
      if(appointment.organisation) {
        draft['__CREATE'].organisation = appointment.organisation;
      }
      //deal : prospect
      //focus : focusWorkData
      //location
    }
  },
  [ActionTypes.AUTO_FILL_FORM] : (draft, { data }) => {
    draft.__CREATE = {
      ...draft.__CREATE,
      ...data
    }
  },
  [ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT]:(draft, {companyId,contactId})=>{
    if(draft.__CREATE.organisation == null && companyId!=null ){
      draft.__CREATE = {
        ...draft.__CREATE,
        organisation: {uuid: companyId}
      }
    }
    if(draft.__EDIT.organisation == null && companyId!=null ){
      draft.__EDIT = {
        ...draft.__EDIT,
        organisation: {uuid: companyId}
      }
    }

    if (draft.__CREATE.organisation
      && companyId === draft.__CREATE.organisation?.uuid && contactId || (!companyId && contactId)) {
      draft.__CREATE = {
        ...draft.__CREATE,
        sponsorList:draft.__CREATE.sponsorList!=null? [...draft.__CREATE.sponsorList, {uuid: contactId}]:[{uuid: contactId}],
      }
    }
    if (draft.__EDIT.organisation != null
      && companyId == draft.__EDIT.organisation.uuid &&  contactId != null) {
      draft.__EDIT = {
        ...draft.__EDIT,
        sponsorList: draft.__EDIT.sponsorList != null ? [...draft.__EDIT.sponsorList, {uuid: contactId}] : [{uuid: contactId}],
      }
    }
  },
  [ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY]:(draft, {companyId})=> {
    if( companyId!=null ){
      draft.__CREATE = {
        ...draft.__CREATE,
        organisation: {uuid: companyId},
        sponsorList:[]
      }
    }
    if(companyId!=null ){
      draft.__EDIT = {
        ...draft.__EDIT,
        organisation: {uuid: companyId},
        sponsorList:[]
      }
    }

  },
  [ActionTypes.UPDATE_ENTITY_LIST_VIEW_MANUALLY]:(draft, {data}) => {
    if(data?.uuid) {
      console.log('hellooo');
      draft[data.uuid] = data;
      console.log('done')
    }
  },
  [ActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL]:(draft, {count}) => {
    if(draft.__DETAIL){
      draft.__DETAIL.numberDocument = count;
    }
  }
  });

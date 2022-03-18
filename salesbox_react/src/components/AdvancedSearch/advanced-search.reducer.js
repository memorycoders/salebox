// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import AdvancedSearchActions from 'components/AdvancedSearch/advanced-search.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import { ObjectTypes } from 'Constants';
import AppActionTypes from 'components/App/app.actions';

export const createAdvancedSearchTemplate = (objectType) => {
  return {
    shown: false,
    name: '',
    groups: [],
    fields: [],
    saved: [],
    selected: null,
    tag: null,
    term: '',
    orderBy:
      objectType === ObjectTypes.PipelineLead || objectType === ObjectTypes.DelegationLead
        ? 'priority'
        : objectType === ObjectTypes.PipelineQualified
        ? 'contractDate'
        : objectType === ObjectTypes.Account
        ? 'closedSales'
        : objectType === ObjectTypes.Contact
        ? 'orderIntake'
        : objectType === 'APPOINTMENT'
        ? 'dateAndTime'
        : objectType === ObjectTypes.Resource
        ? 'occupancy'
        : 'dateAndTime',
    sharedWith: {
      selected: 'company',
      person: [],
      unit: [],
    },
    entities: {
      group: {},
      row: {},
      dropdownValue: {},
    },
    filter: '',
    action: null,
    history: false,
    dropdownValueFetching: {},
    salesProcessId: null,
    mode: null,
  };
};

export const initialState = {
  [ObjectTypes.Contact]: createAdvancedSearchTemplate(ObjectTypes.Contact),
  [ObjectTypes.Account]: createAdvancedSearchTemplate(ObjectTypes.Account),
  [ObjectTypes.PipelineQualified]: createAdvancedSearchTemplate(ObjectTypes.PipelineQualified),
};

const createRow = (id: string) => ({
  id,
  customFieldId: null,
  field: null,
  productId: null,
  operator: null,
  value: '',
  valueId: null,
  valueDate: null,
  fieldType: null,
  startDate: null,
  endDate: null,
  occupied: 0,
  availableIndex: 0
});

const createGroup = (id: string, rowId: undefined | string) => ({
  id,
  rows: rowId ? [rowId] : [],
});

export default createReducer(initialState, {
  [AppActionTypes.INIT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      draft[id].term = '';
    });
  },
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [AdvancedSearchActions.REGISTER]: (draft, { objectType }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
      if (!draft[ObjectTypes.Contact]) {
        draft[ObjectTypes.Contact] = createAdvancedSearchTemplate(ObjectTypes.Contact);
      }
      if (!draft[ObjectTypes.Account]) {
        draft[ObjectTypes.Account] = createAdvancedSearchTemplate(ObjectTypes.Account);
      }
      if (!draft[ObjectTypes.PipelineQualified]) {
        draft[ObjectTypes.PipelineQualified] = createAdvancedSearchTemplate(ObjectTypes.PipelineQualified);
      }
    }
  },
  [AdvancedSearchActions.SETUP]: (draft, { objectType, groupId, rowId }) => {
    draft[objectType].groups = [];
    draft[objectType].name = '';
    const row = createRow(rowId);
    const group = createGroup(groupId, rowId);
    draft[objectType].groups.push(groupId);
    draft[objectType].entities.group[groupId] = group;
    draft[objectType].entities.row[rowId] = row;
  },
  [AdvancedSearchActions.BREAK_DOWN]: (draft, { objectType }) => {
    if (draft[objectType]) {
      draft[objectType].groups = [];
      draft[objectType].name = '';
    }
  },
  [AdvancedSearchActions.SET_ACTION]: (draft, { objectType, action }) => {
    draft[objectType].action = action;
  },
  [AdvancedSearchActions.ADD_GROUP]: (draft, { rowId, groupId, objectType }) => {
    const row = createRow(rowId);
    const group = createGroup(groupId, rowId);
    draft[objectType].groups.push(group.id);
    draft[objectType].entities.group[group.id] = group;
    draft[objectType].entities.row[row.id] = row;
  },
  [AdvancedSearchActions.SELECT_SAVED]: (draft, { objectType, selected }) => {
    const search = draft[objectType];
    const selectedSearch = search.saved.find((savedSearch) => selected === savedSearch.uuid);
    if (selectedSearch) {
      search.selected = selected;
      draft[objectType].groups = [];
      draft[objectType].name = selectedSearch.name;
      selectedSearch.searchFieldDTOList.forEach((savedGroup, groupIndex) => {
        const groupId = `${selected}-${groupIndex}`;
        const group = createGroup(groupId);
        search.entities.group[groupId] = group;
        search.groups.push(groupId);
        savedGroup.forEach((savedRow, rowIndex) => {
          const rowId = `${selected}-${groupIndex}-${rowIndex}`;
          const row = {
            id: rowId,
            field: savedRow.field,
            operator: savedRow.operator,
            value: savedRow.valueText,
            valueId: savedRow.valueId,
            fieldType: savedRow.fieldType,
            valueDate: savedRow.valueDate,
            customFieldId: savedRow.customFieldId,
            productId: savedRow.productId,
            startDate: savedRow.startDate,
            endDate: savedRow.endDate,
            occupied: savedRow.occupied,
            availableIndex: savedRow.availableIndex
          };
          search.entities.row[rowId] = row;
          group.rows.push(rowId);
        });
      });
    } else {
      search.selected = null;
      draft[objectType].groups = [];
      draft[objectType].name = '';
    }
  },
  [AdvancedSearchActions.REMOVE]: (draft, { objectType, searchId }) => {
    draft[objectType].saved = draft[objectType].saved.filter((savedSearch) => {
      return savedSearch.uuid !== searchId;
    });
  },
  [AdvancedSearchActions.REMOVE_GROUP]: (draft, { objectType, groupId }) => {
    draft[objectType].groups = draft[objectType].groups.filter((group) => group.id !== groupId);
    delete draft[objectType].entities.group[groupId];
  },
  [AdvancedSearchActions.UPDATE_ROW]: (draft, { objectType, rowId, values }) => {
    Object.keys(values).forEach((key) => {
      draft[objectType].entities.row[rowId][key] = values[key];
    });
  },
  [AdvancedSearchActions.ADD_ROW]: (draft, { objectType, groupId, rowId }) => {
    const search = draft[objectType];
    const row = createRow(rowId);
    search.entities.row[rowId] = row;
    search.entities.group[groupId].rows.push(rowId);
  },
  [AdvancedSearchActions.REMOVE_ROW]: (draft, { objectType, groupId, rowId }) => {
    draft[objectType].entities.group[groupId].rows = draft[objectType].entities.group[groupId].rows.filter((_rowId) => {
      if (rowId === _rowId) {
        delete draft[objectType].entities.row[rowId];
        return false;
      }
      return true;
    });

    if (draft[objectType].entities.group[groupId].rows.length < 1) {
      draft[objectType].groups = draft[objectType].groups.filter((_groupId) => _groupId !== groupId);
      delete draft[objectType].entities.group[groupId];
    }
  },
  [AdvancedSearchActions.SHOW]: (draft, { objectType }) => {
    if (draft[objectType]) draft[objectType].shown = true;
  },
  [AdvancedSearchActions.HIDE]: (draft, { objectType }) => {
    let search = draft[objectType];
    if (draft[objectType]) {
      draft[objectType].shown = false;
      search.selected = '';
    }
  },
  [AdvancedSearchActions.SET_NAME]: (draft, { objectType, name }) => {
    draft[objectType].name = name;
  },
  [AdvancedSearchActions.SET_TAG]: (draft, { objectType, tag }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
    }
    draft[objectType].tag = tag;
    if (objectType === ObjectTypes.AccountOrder) {
    }
  },
  [AdvancedSearchActions.SET_TERM]: (draft, { objectType, term }) => {
    if (draft[objectType]) {
      draft[objectType].term = term;
    }
  },
  [AdvancedSearchActions.GET_SEARCH_INFO]: (draft, { objectType, fields, saved }) => {
    draft[objectType].fields = fields;
    draft[objectType].saved = saved;
  },
  [AdvancedSearchActions.SAVE]: (draft, { objectType, data, update }) => {
    if (!update) {
      draft[objectType].saved.push(data);
    } else {
      let _save = draft[objectType].saved;
      for (let i = 0; i < _save.length; i++) {
        if (_save[i].uuid === data.uuid) {
          _save[i] = data;
        }
      }
      draft[objectType].saved = _save;
    }
  },
  [AdvancedSearchActions.COPY]: (draft, { objectType, data }) => {
    draft[objectType].saved.push(data);
  },
  [AdvancedSearchActions.SET_FILTER]: (draft, { objectType, filter }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
    }
    draft[objectType].filter = filter;
  },

  [AdvancedSearchActions.SET_ORDERBY]: (draft, { objectType, orderBy }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
    }
    draft[objectType].orderBy = orderBy;
  },

  [AdvancedSearchActions.SHARE_WITH]: (draft, { objectType, sharedWith }) => {
    draft[objectType].sharedWith.selected = sharedWith;
  },
  [AdvancedSearchActions.SHARE_WITH_ENTITY]: (draft, { objectType, entity, selected }) => {
    draft[objectType].sharedWith[entity] = selected;
  },
  [AdvancedSearchActions.ENABLE_HISTORY]: (draft, { objectType }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
    }
    draft[objectType].history = true;
    draft[objectType].filter = 'history';
  },
  [AdvancedSearchActions.BLOCK_HISTORY]: (draft, { objectType }) => {
    if (!draft[objectType]) {
      draft[objectType] = createAdvancedSearchTemplate(objectType);
    }
    draft[objectType].history = false;
    draft[objectType].filter = 'active';
  },

  [AdvancedSearchActions.CLEAR_TERM]: (draft, { objectType }) => {
    if (draft[objectType]) {
      draft[objectType].term = '';
    }
  },
  [AdvancedSearchActions.CLEAR_ORDERBY]: (draft, { objectType }) => {
    if (draft[objectType]) {
      if (objectType === ObjectTypes.PipelineLead || objectType === ObjectTypes.DelegationLead) {
        draft[objectType].orderBy = 'priority';
      } else if (objectType === ObjectTypes.PipelineQualified) {
        draft[objectType].orderBy = 'contractDate';
      } else if (objectType === ObjectTypes.Account) {
        draft[objectType].orderBy = 'closedSales';
      } else if (objectType === ObjectTypes.Contact) {
        draft[objectType].orderBy = 'orderIntake';
      } else draft[objectType].orderBy = 'dateAndTime';
    }
  },
  [AdvancedSearchActions.UPDATE_DROPDOWN_VALUE]: (draft, { objectType, data, rowId }) => {
    if (draft[objectType]) {
      draft[objectType].entities.dropdownValue[rowId] = data;
    }
  },
  [AdvancedSearchActions.UPDATE_STATUS_FETCHING_DROPDOWN_VALUE]: (draft, { objectType, status, rowId }) => {
    if (draft[objectType]) {
      draft[objectType].dropdownValueFetching[rowId] = status;
    }
  },
  [AdvancedSearchActions.UPDATE_SALE_PROCESS_AND_MODE]: (draft, { objectType, salesProcessId, mode }) => {
    if (draft[objectType]) {
      draft[objectType].salesProcessId = salesProcessId;
      draft[objectType].mode = mode;
    }
  },
  [AdvancedSearchActions.UPDATE_SPECIAL_FIELD]: (draft, { objectType, field, value }) => {
    
  },
});

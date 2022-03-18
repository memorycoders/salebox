// @flow
import { createSelector } from 'reselect';
import uuid from 'uuid/v4';
import { createAdvancedSearchTemplate } from './advanced-search.reducer';
import {NO_VALUE} from '../../Constants'

const emptyFields = [];
const emptyGroup = [];
const emptyRows = [];
const emptyRow = {};
const emptySearch = createAdvancedSearchTemplate();

export const makeGetGroup = () => {
  return createSelector(
    (state, objectType, groupId) => state.search[objectType].entities.group[groupId],
    (group) => {
      return group || emptyGroup;
    }
  );
};

export const getSearch = createSelector(
  (state, objectType) => {
    return state.search[objectType]
  },
  (search) => {
    return search || emptySearch;
  }
);

export const getStatusFetchingDropdownValue = createSelector(
  (state, rowId) => state.search[state.common.currentObjectType] && state.search[state.common.currentObjectType].dropdownValueFetching[rowId],
  (status) => {
    return status || false;
  }
);

export const getDropdownValue= createSelector(
  (state, rowId) => {
   return state.search[state.common.currentObjectType] && state.search[state.common.currentObjectType].entities.dropdownValue[rowId]
  },
  (datas) => {
    let _options = []
    if(datas && datas.length > 0) {
      _options = datas.map((_data) => {
        return {
          key: _data.uuid,
          value: _data.uuid,
          text: _data.name,
        };
      });
      _options.sort((value1, value2) => value1.text < value2.text ? -1 : 1 );
    }
    return _options;
  }
);



export const getSearchForSave = createSelector(
  getSearch,
  (state, objectType) => objectType,
  (state) => state.auth.userId,
  (search, objectType, ownerId) => {
    return {
      name: search.name,
      objectType,
      ownerId,
      update: !!search.selected,
      uuid: search.selected || uuid(),
      searchFieldDTOList: search.groups
        .map((groupId) => {
          return search.entities.group[groupId].rows
            .map((rowId) => {
              const row = search.entities.row[rowId];
                return {
                  field: row.field,
                  operator: row.operator,
                  valueText: row.value,
                  valueId: row.valueId,
                  fieldType: row.fieldType,
                  valueDate: row.valueDate,
                  customFieldId: row.customFieldId,
                  productId: row.productId,
                  startDate: row.startDate,
                  endDate: row.endDate,
                  occupied: row.occupied === '' ? null : row.occupied,
                  availableIndex: row.availableIndex
                };
            })
            .filter((row) => row?.field);
        })
        .filter((group) => group.length > 0),
    };
  }
);

export const canSave = createSelector(
  getSearch,
  (search) => {
    return search.groups.some((groupId) => {
      return search.entities.group[groupId].rows.some((rowId) => {
        const row = search.entities.row[rowId];
        let hasValue = row.value || row.valueId || row.valueDate;
        if(row.operator === NO_VALUE) {
          hasValue = true;
        }
        return (row.field && row.operator && hasValue) || (row.fieldType === 'SPECIAL');
      });
    });
  }
);

export const hasSearch = createSelector(
  getSearch,
  (search) => {
    if (search.tag || search.filter) return true;
    if (search.shown) {
      return search.groups.some((groupId) => {
        return search.entities.group[groupId].rows.some((rowId) => {
          const row = search.entities.row[rowId];
          const hasValue = row.value || row.valueId || row.valueDate;
          return row.field && row.operator && hasValue;
        });
      });
    }
    return search && search.term !== '';
  }
);

export const makeGetRow = () => {
  return createSelector(
    (state, objectType, rowId) => getSearch(state, objectType).entities.row[rowId],
    (row) => {
      return row || emptyRow;
    }
  );
};


export const isAction = createSelector(
  getSearch,
  (state, objectType, action) => action,
  (search, action) => {
    return search.action === action;
  }
);

export const getSelected = createSelector(getSearch, (search) => search.selected);

export const getSavedSearches = createSelector(
  (state, objectType) => getSearch(state, objectType).saved,
  (savedSearches) => {
    return savedSearches.map(({ uuid, name }) => ({
      key: uuid,
      value: uuid,
      text: name,
    }));
  }
);

export const makeGetOperators = () => {
  return createSelector(
    (state, objectType, rowValue) => rowValue,
    (state, objectType) => getSearch(state, objectType).fields,
    (rowValue, fields) => {
      if (!rowValue) {
        return emptyRows;
      }
      let operators = [];
      fields.some((field) => {
        if (rowValue === field.value) {
          operators = field.operators;
          return true;
        }
        return false;
      });
      return operators;
    }
  );
};

export const makeGetType = () => {
  return createSelector(
    (state, objectType, rowValue) => rowValue,
    (state, objectType) => getSearch(state, objectType).fields,
    (rowValue, fields) => {
      if (!rowValue) {
        return 'TEXT';
      }
      let type = 'TEXT';
      fields.some((field) => {
        if (rowValue === field.value) {
          type = field.type;
          return true;
        }
        return false;
      });
      return type;
    }
  );
};

export const getFields = createSelector(
  (state, objectType) => getSearch(state, objectType).fields,
  (fields) => {
    return fields || emptyFields;
  }
);

export default getSearch;

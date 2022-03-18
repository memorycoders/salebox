// @flow
import * as React from 'react';
import { compose, withHandlers, pure } from 'recompose';
import { makeGetGroup } from './advanced-search.selectors';
import InputRow from './InputRow';
import { connect } from 'react-redux';
import * as AdvancedSearchActions from './advanced-search.actions';
import css from './AdvancedSearch.css';

type PropsT = {
  handleRowChange: (index: number, {}) => void,
  handleAddRow: () => void,
  handleRemoveRow: (inputIndex: number) => void,
  lastGroup: boolean,
  objectType: string,
  group: {
    rows: Array<{}>,
  },
  size?: string,
  groupIndex?: Number,
  preGroupId?: Number
};

const AdvancedSearchGroup = ({
  group,
  handleRowChange,
  handleAddRow,
  handleRemoveRow,
  fetchFieldValueDropdown,
  lastGroup,
  objectType,
  size,
  groupIndex,
  addGroup,
  last,
  domIdWrapAD,
  updateSpecialField,
  preGroup,
}: PropsT) => {
  const { rows } = group;
  const lengthRow = rows.length
  return (
    <div className={css.group}>
      {rows.map((rowId, index) => {
        const isLast = index === lengthRow - 1;
        const canRemove = !lastGroup || lengthRow > 1;
        const indexRow = (preGroup?.rows?.length * groupIndex) + index + 1
        return (
          <InputRow
            domIdWrapAD={domIdWrapAD}
            index={index}
            size={size}
            last={last}
            groupIndex={groupIndex}
            onAddRow={handleAddRow}
            onRemove={handleRemoveRow}
            onChange={handleRowChange}
            fetchFieldValueDropdown={fetchFieldValueDropdown}
            rowId={rowId}
            objectType={objectType}
            canAdd={isLast}
            canRemove={canRemove}
            key={rowId}
            addGroup={addGroup}
            updateSpecialField={updateSpecialField}
            indexRow= {indexRow}
          />
        );
      })}
    </div>
  );
};

const makeMapStateToProps = () => {
  const getGroup = makeGetGroup();
  const mapStateToProps = (state, { objectType, groupId, preGroupId }) => ({
    group: getGroup(state, objectType, groupId),
    preGroup: getGroup(state, objectType, preGroupId)
  });
  return mapStateToProps;
};

export default compose(
  connect(makeMapStateToProps, {
    updateRow: AdvancedSearchActions.updateRow,
    addRow: AdvancedSearchActions.addRow,
    removeRow: AdvancedSearchActions.removeRow,
    fetchFieldValueDropdown: AdvancedSearchActions.fetchFieldValueDropdown,
    showAS: AdvancedSearchActions.show,
    hideAS: AdvancedSearchActions.hide,
    updateSpecialField: AdvancedSearchActions.updateSpecialField
  }),
  pure,
  withHandlers({
    handleRowChange: ({ updateRow, objectType }) => (rowId, values) => {
      updateRow(objectType, rowId, values);
    },
    handleAddRow: ({ addRow, groupId, objectType }) => () => {
      addRow(objectType, groupId);
    },
    handleRemoveRow: ({ removeRow, groupId, objectType, lastGroup, group, hideAS, showAS }) => (rowId) => {
      if (group) {
        const { rows } = group;
        const canRemove = !lastGroup || rows.length > 1;
        if(rows && rows[0] === rowId) {
          hideAS(objectType);
          showAS(objectType);
          return;
        }
        if (canRemove) {
          removeRow(objectType, groupId, rowId);
        } else {
          hideAS(objectType);
          showAS(objectType);
        }
      }
    },
  })
)(AdvancedSearchGroup);

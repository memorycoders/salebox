// disabling flowtype to keep this example super simple
// It matches
/* eslint-disable flowtype/require-valid-file-annotation */

import React, { useCallback, Fragment, memo, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import omit from 'lodash/omit';

import css from './customFields.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isCustomFieldDTOList } from '../settings.selectors';
import * as SettingsActions from 'components/Settings/settings.actions';
import ItemViewDragable from './ItemViewDragable';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle, checkUuid) => ({
  ...draggableStyle,
  backgroundColor: isDragging ? '#F0F0F0' : checkUuid ? '#F0F0F0' : '#ffffff',
});

const getListStyle = () => ({
  background: '#ffffff',
  width: '100%',
});

const ViewDragable = ({ customFieldDTOList, uuidSelect, setUuidSelect, updateCustomFieldsSettings }: any) => {
  const items = useMemo(() => customFieldDTOList.map((item, index) => ({ id: `item-${index}`, ...item })), [
    customFieldDTOList,
  ]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newItems = reorder(items, result.source.index, result.destination.index);
      updateCustomFieldsSettings(newItems.map((item, index) => omit({ ...item, position: index }, ['id'])));
    },
    [items, updateCustomFieldsSettings]
  );

  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div ref={droppableProvided.innerRef} style={getListStyle(droppableSnapshot.isDraggingOver)}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      onClick={() => setUuidSelect(item.uuid)}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className={css.viewItemDraggable}
                      style={getItemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style,
                        uuidSelect === item.uuid
                      )}
                    >
                      <ItemViewDragable setUuidSelect={setUuidSelect} uuidSelect={uuidSelect} item={item} />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Fragment>
  );
};

export default compose(
  memo,
  connect((state) => ({ customFieldDTOList: isCustomFieldDTOList(state) }), {
    updateCustomFieldsSettings: SettingsActions.updateCustomFieldsSettings,
  })
)(ViewDragable);

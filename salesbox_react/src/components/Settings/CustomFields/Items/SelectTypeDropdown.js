import React, { useCallback, Fragment, useMemo, memo, useState } from 'react';
import { Grid, Button, Divider, Icon } from 'semantic-ui-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import update from 'immer';
import uuid from 'uuid/v4';
import omit from 'lodash/omit';

import css from '../customFields.css';
import ItemDropdown from './ItemDropdown';
import { IconButton } from '../../../Common/IconButton';
import add from '../../../../../public/Add.svg';
import _l from 'lib/i18n';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
});

const getListStyle = (length) => ({
  background: '#ffffff',
  height: length * 40,
});

const SelectTypeDropdown = ({ itemSelect, updateCustomFieldRequest, updateCustomField, title }: any) => {
  const [showError, setShowError] = useState(false);

  const items = useMemo(
    () =>
      itemSelect.customFieldOptionDTO.customFieldOptionValueDTOList.map((item, index) => ({
        id: `item-${index}`,
        ...item,
        _uuid: item._uuid || item.uuid || uuid(),
      })),
    [itemSelect]
  );

  const updateNewItem = useCallback(
    (newItems) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          draf.customFieldOptionDTO.customFieldOptionValueDTOList = newItems.map((i) => omit(i, ['id', '_uuid']));
        })
      );
    },
    [itemSelect, updateCustomField]
  );

  const onDragEnd = useCallback(
    (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }
      const newItems = reorder(items, result.source.index, result.destination.index);
      updateNewItem(newItems.map((item, index) => ({ ...item, position: index })));
    },
    [items, updateNewItem]
  );

  const removeItem = useCallback(
    (item) => {
      const newItems = itemSelect.customFieldOptionDTO.customFieldOptionValueDTOList.filter(
        (i) => i.uuid !== item.uuid
      );
      updateNewItem(newItems);
    },
    [updateNewItem, itemSelect]
  );

  const addItemDraggale = useCallback(() => {
    const items = itemSelect.customFieldOptionDTO.customFieldOptionValueDTOList;
    updateNewItem([...items, { active: null, position: items.length, uuid: null, value: '' }]);
  }, [updateNewItem, itemSelect]);

  const updateValueItem = useCallback(
    (uuidItem, value) => {
      updateCustomField(
        update(itemSelect, (draf) => {
          const findIndex = items.findIndex((i) => i._uuid === uuidItem);
          if (findIndex !== -1) {
            draf.customFieldOptionDTO.customFieldOptionValueDTOList[findIndex].value = value;
          }
        })
      );
    },
    [updateCustomField, itemSelect, items]
  );

  const onClickDone = useCallback(() => {
    const itemsEmpty = items.filter((i) => !i.value);

    if (itemsEmpty.length > 0) {
      setShowError(true);
    } else {
      setShowError(false);
      updateCustomFieldRequest();
    }
  }, [items, updateCustomFieldRequest]);

  return (
    <Fragment>
      <Grid.Row className={css.viewHeaderSelectFiled}>
        {/* <Grid.Column width={16}>{showError && <span className={css.error}>Title is required</span>}</Grid.Column> */}

        <Grid.Column verticalAlign="middle" width={6}>
          <p style={{ fontWeight: '500' }}>{title}</p>
        </Grid.Column>
        <Grid.Column width={10} textAlign="right">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={addItemDraggale}
              className={css.viewIconAddHeader}
              imageClass={css.imageClass}
              name="profile"
              size={24}
              src={add}
            />
          </div>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>

        <Grid.Column width={16}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided, droppableSnapshot) => (
                <div ref={droppableProvided.innerRef} className={css.viewDropdown} style={getListStyle(items.length)}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(draggableProvided, draggableSnapshot) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          className={css.viewItemDropdown}
                          style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                        >
                          <ItemDropdown updateValueItem={updateValueItem} item={item} removeItem={removeItem} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid.Column>
      </Grid.Row>

      <Grid.Column className={css.viewHeaderSelectFiled} width={16} textAlign="center">
        <Button className={css.btnDone} onClick={onClickDone}>
          {_l`Done`}
        </Button>
      </Grid.Column>
    </Fragment>
  );
};

export default memo(SelectTypeDropdown);

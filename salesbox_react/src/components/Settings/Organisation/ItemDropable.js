import React, { Fragment, memo } from 'react';
import { Accordion } from 'semantic-ui-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import ItemOrganisation from './ItemOrganisation';
import ItemInCompany from './ItemInCompany';
import css from './organisation.css';

const getListStyle = (active, emptyLength) => ({
  background: '#ffffff',
  width: '100%',
  height: emptyLength === 0 && active ? 80 : active ? emptyLength * 90 : 0,
  display: active ? 'block' : 'none',
  marginTop: 10,
});

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
});

const ItemDropable = ({ item, handleClickItem, index, activeIndex }: any) => {
  return (
    <Fragment>
      <Accordion className={css.viewAccodion} fluid>
        <Accordion.Title active={true} index={index}>
          <ItemOrganisation handleClickItem={handleClickItem} item={item} index={index} activeIndex={activeIndex} />
        </Accordion.Title>
        <div onMouseMove />

        <Droppable droppableId={item.uuid}>
          {(droppableProvided, droppableSnapshot) => {
            return (
              <div
                ref={droppableProvided.innerRef}
                style={getListStyle(activeIndex.includes(index), item.userDTOList.length)}
              >
                <Accordion.Content active={activeIndex.includes(index)}>
                  {item.userDTOList.map((itemList, indexList) => (
                    <Draggable
                      key={itemList.uuid || itemList.pendingId}
                      draggableId={itemList.uuid || itemList.pendingId}
                      index={indexList}
                    >
                      {(draggableProvided, draggableSnapshot) => {
                        return (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            className={css.viewItemDraggable}
                            style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                          >
                            <ItemInCompany item={itemList} />
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                </Accordion.Content>
              </div>
            );
          }}
        </Droppable>
      </Accordion>
    </Fragment>
  );
};

export default memo(ItemDropable);

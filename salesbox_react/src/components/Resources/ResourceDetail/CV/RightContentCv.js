import React, { memo, useCallback, useEffect, useState } from 'react';
import ItemRightCv from './ItemRightCv';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import * as ResourcesActionsTypes from '../../resources.actions';
import { withRouter } from 'react-router-dom';
import css from '../Experiences/Experiences.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = () => ({
  background: '#ffffff',
  width: '100%',
  height: '90vh',
  overflow: 'hidden',
});

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  marginTop: 15,
});

const RightContentCv = ({
  match,
  fetchExperience,
  experienceDTOList,
  experienceList,
  setxperienceCv,
  setExperience,
}: any) => {
  const resourceId = match?.params?.resourceId;

  useEffect(() => {
    if (resourceId) {
      fetchExperience({ resourceId, language: localStorage.getItem('language') || 'en' });
    }
  }, [resourceId]);

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(experienceDTOList);
    setxperienceCv(experienceDTOList);
  }, [experienceDTOList]);

  // useEffect(() => {
  //   return () => {
  //     setExperience([]);
  //   };
  // }, []);

  useEffect(() => {
    if (experienceList.length === 0) {
      setItems(experienceDTOList);
    } else if (experienceList.length > 0) {
      setItems(experienceList);
    }
  }, [experienceList]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const newItems = reorder(items, result.source.index, result.destination.index);
      setItems(newItems);
      setxperienceCv(newItems.map((item, index) => ({ ...item, order: index + 1 })));
    },
    [items, resourceId]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            className={css.viewItemDraggable}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.uuid} draggableId={`item-${item.uuid}`} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                  >
                    <ItemRightCv item={item} />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default compose(
  memo,
  withRouter,
  connect(
    (state) => ({
      experienceDTOList: state.entities?.resources?.experiences?.experienceDTOList || [],
      experienceList: state.entities?.resources?.cv?.experienceList || [],
    }),
    {
      fetchExperience: ResourcesActionsTypes.fetchExperience,
      setxperienceCv: ResourcesActionsTypes.setxperienceCv,
      setExperience: ResourcesActionsTypes.setExperience,
    }
  )
)(RightContentCv);

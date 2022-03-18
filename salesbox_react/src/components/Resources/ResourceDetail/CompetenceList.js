import React, { useCallback, useState, useEffect } from 'react';
import Competence from './Competence';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import css from './Experiences/Experiences.css';
import { updateMultipleCompetence } from '../resources.actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const CompetenceList = ({
  match,
  competences,
  conpetencesName,
  lastUsedOption,
  deleteCompetenceItem,
  updateSingleCompetence,
  resourceId,
  tab,
  levelOptions,
  updateMultipleCompetence,
}) => {
  const resourceIdUrl = match?.params?.resourceId;

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
  });
  const getListStyle = () => ({
    background: '#ffffff',
    width: '100%',
    // height: '90vh',
    overflow: 'hidden',
  });
  const [items, setItems] = useState([]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  useEffect(() => {
    setItems(competences);
  }, [competences]);

  const onDragEnd = useCallback(
    (result) => {
      console.log(result);
      if (!result.destination) {
        return;
      }
      const newItems = reorder(items, result.source.index, result.destination.index);
      setItems(newItems);
      updateMultipleCompetence(newItems.map((item, index) => ({ ...item, order: index + 1 }), resourceId));
    },
    [items, resourceId, updateMultipleCompetence]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            // className={css.viewItemDraggable}
            style={getListStyle(droppableSnapshot.isDraggingOver)}
          >
            {items?.map((item, index) => {
              return (
                <Draggable key={item.uuid} draggableId={`item-${item.uuid}`} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                    >
                      <Competence
                        conpetencesName={conpetencesName}
                        levelOptions={levelOptions}
                        item={item}
                        lastUsedOption={lastUsedOption}
                        index={index}
                        deleteCompetenceItem={deleteCompetenceItem}
                        updateSingleCompetence={updateSingleCompetence}
                        resourceId={resourceId}
                        tab={tab}
                      />{' '}
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
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  updateMultipleCompetence,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompetenceList));

// import React from 'react';
// import Competence from './Competence';

// const CompetenceList = ({
//   competences,
//   conpetencesName,
//   lastUsedOption,
//   deleteCompetenceItem,
//   updateSingleCompetence,
//   resourceId,
//   tab,
//   levelOptions,
// }) => {
//   return (
//     <>
//       {competences?.map((item, index) => {
//         return (
//           <Competence
//             conpetencesName={conpetencesName}
//             levelOptions={levelOptions}
//             item={item}
//             lastUsedOption={lastUsedOption}
//             index={index}
//             deleteCompetenceItem={deleteCompetenceItem}
//             updateSingleCompetence={updateSingleCompetence}
//             resourceId={resourceId}
//             tab={tab}
//           />
//         );
//       })}
//     </>
//   );
// };

// export default CompetenceList;

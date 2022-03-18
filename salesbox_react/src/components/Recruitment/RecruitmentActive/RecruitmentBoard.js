import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from 'react-beautiful-dnd';
import { Column, AbsoluteDroppable } from '../../PipeLineQualifiedDeals/TaskSteps/TrelloElement/column';
import { OverviewTypes, Endpoints } from '../../../Constants';
import { getColumnForRecruitmentBoard } from '../recruitment.selector';
import api from 'lib/apiClient';
import { moveStepCandidateManually, loadMoreCandidateByStep } from '../recruitment.actions';
import { highlight } from '../../Overview/overview.actions';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
`;

export const RecruitmentBoard = ({
  width,
  height,
  currency,
  manualProgress,
  loadMoreCandidateByStep,
  parentId,
  columns,
  moveStepCandidateManually,
  highlight,
}) => {
  const [openToolTipWon, setOpenToolTipWon] = useState(false);
  const [openToolTipLost, setOpenToolTipLost] = useState(false);

  const onDragEnd = async (propsBoard) => {
    handleWonLost(true);
    const { destination, source, draggableId } = propsBoard;
    setOpenToolTipLost(false);
    setOpenToolTipWon(false);
    if (destination?.droppableId === source?.droppableId) {
      return;
    }
    if (destination?.droppableId === 'won') {
      highlight(OverviewTypes.RecruitmentActive, draggableId, 'setWonCandidate');
      // handle set won
    } else if (destination?.droppableId === 'lost') {
      highlight(OverviewTypes.RecruitmentActive, draggableId, 'setLostCandidate');
      // handle set lost
    } else {
      handleCallApiMoveStep(source.droppableId, draggableId, destination?.droppableId);
    }
  };
  const handleCallApiMoveStep = async (sourceId, candidateId, targetId) => {
    // moveStepCandidateManually(sourceId, candidateId, targetId);

    console.log('darrdrasdasdasdrsdL:', sourceId, candidateId, targetId);
    let columnSource = columns.find((e) => e.uuid === sourceId);

    console.log('---columnSource:', columnSource);

    let candidate = columnSource.listCandidates.find((e) => e.uuid === candidateId);
    if (!candidate) {
      return;
    }
    let target = candidate.candidateProgressDTOList?.find((e) => e.activityId === targetId);
    if (!target) {
      return;
    }
    try {
      moveStepCandidateManually(sourceId, candidateId, targetId);
      const res = await api.post({
        resource: `${Endpoints.Recruitment}/candidate/moveProgress`,
        data: {
          candidateId: candidateId,
          targetId: target.uuid,
        },
      });
      if (res) {
      }
    } catch (error) {}
  };
  const onDragStart = () => {};
  const onDragUpdate = (propsBoard) => {
    const { destination } = propsBoard;
    if (destination) {
      if (destination.droppableId === 'won') {
        setOpenToolTipWon(true);
      } else {
        setOpenToolTipWon(false);
      }

      if (destination.droppableId === 'lost') {
        setOpenToolTipLost(true);
      } else {
        setOpenToolTipLost(false);
      }
    }
  };
  const onBeforeDragStart = () => {
    handleWonLost(false);
  };

  const handleWonLost = (hide) => {
    const wonColumn = document.getElementById('won');
    const lostColumn = document.getElementById('lost');
    if (!hide) {
      wonColumn.style.visibility = 'visible';
      lostColumn.style.visibility = 'visible';
      return;
    }
    setTimeout(() => {
      if (hide) {
        wonColumn.style.visibility = 'hidden';
        lostColumn.style.visibility = 'hidden';
      }
    }, 100);
  };
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Container style={{ width, height: height + 20 }}>
        <div style={{ display: 'flex' }}>
          {columns.map((lane, index) => {
            return (
              <Column
                width={width}
                height={height}
                currency={currency}
                manualProgress="OFF"
                key={lane.uuid}
                lastStep={index === columns.length - 1}
                columnData={{ ...lane, count: lane.total }}
                columnNumber={columns.length}
                loadMoreSteps={loadMoreCandidateByStep}
                quotes={lane.listCandidates ? lane.listCandidates : []}
                parentId={parentId}
                columnId={lane.uuid}
                overviewType={OverviewTypes.RecruitmentActive}
              />
            );
          })}
        </div>

        <AbsoluteDroppable
          open={openToolTipWon}
          parentWidth={width}
          width={
            columns.length > 1
              ? width / columns.length - 20 > 120
                ? width / columns.length - 20
                : 120
              : width / 2 - 20
          }
          columnId={'won'}
          overviewType={OverviewTypes.RecruitmentActive}
        />
        <AbsoluteDroppable
          open={openToolTipLost}
          parentWidth={width}
          width={
            columns.length > 1
              ? width / columns.length - 20 > 120
                ? width / columns.length - 20
                : 120
              : width / 2 - 20
          }
          columnId={'lost'}
          overviewType={OverviewTypes.RecruitmentActive}
        />
      </Container>
    </DragDropContext>
  );
};

const mapStateToProps = (state) => ({
  columns: getColumnForRecruitmentBoard(state),
  parentId: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
});

const mapDispatchToProps = {
  moveStepCandidateManually,
  highlight,
  loadMoreCandidateByStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentBoard);

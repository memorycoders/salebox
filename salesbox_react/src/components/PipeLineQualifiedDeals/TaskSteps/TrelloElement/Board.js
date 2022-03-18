import React, { Component } from 'react';
import styled from '@emotion/styled';
import api from 'lib/apiClient';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DraggableLocation } from 'react-beautiful-dnd';
import { ObjectTypes, Endpoints } from 'Constants';
import { Column, AbsoluteDroppable } from './column';
import { updateCardLanes, loadMoreSteps, setTrelloSelectedTrack } from './trello-action';
import { getColumns } from './trello-selectors';
import { moveStepActionPlanLocal, fetchNumberOrderRow } from '../../qualifiedDeal.actions';
import { OverviewTypes } from '../../../../Constants';
import { highlight } from '../../../Overview/overview.actions';
const Container = styled.div`
  display: flex;
`;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnKeys: [],
      openToolTipWon: false,
      openToolTipLost: false,
    }
  }

  onDragEnd = (result) => {
    this.setState({ openToolTipWon: false, openToolTipLost: false })
    this.handleWonLost(true);
    if (!result.destination) {
      return;
    }
    const source = result.source;
    const destination = result.destination;
    if (source.droppableId === destination.droppableId) {
      return;
    }
    const { updateCardLanes, parentId, columns, fetchNumberOrderRow, highlight, setTrelloSelectedTrack } = this.props;


    if (destination.droppableId === 'won') {
      setTrelloSelectedTrack(source.droppableId, result.draggableId, parentId)
      fetchNumberOrderRow(result.draggableId, OverviewTypes.Pipeline.Qualified);
      return;
    }

    if (destination.droppableId === 'lost') {
      setTrelloSelectedTrack(source.droppableId, result.draggableId, parentId)
      highlight(OverviewTypes.Pipeline.Qualified, result.draggableId, 'set_lost_qualified_deal');
      return;
    }


    updateCardLanes(source, destination, parentId);
    const currentColumn = columns.find(value => value.uuid === source.droppableId);
    if (currentColumn) {
      const { prospectDTOList } = currentColumn;
      const prospect = prospectDTOList[source.index];
      if (prospect) {
        const { prospectProgressDTOList } = prospect;
        const prospectTarget = prospectProgressDTOList.find(value => value.activityId === destination.droppableId);
        const { moveStepActionPlanLocal } = this.props;
        const splitPathName = location.pathname.split('/');
        if (splitPathName.length > 0 && result.draggableId === splitPathName[splitPathName.length - 1]) {
          moveStepActionPlanLocal(prospectTarget.uuid, prospectTarget.progress);
        }
        api.post({
          resource: `${Endpoints.Prospect}/prospectProgress/move`,
          data: {
            prospectId: result.draggableId,
            targetId: prospectTarget.uuid
          },
        });
      }
    }
  }

  handleWonLost = (hide) => {
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
    }, 100)
  }

  onDragStart = () => {
    this.handleWonLost(false)
  }

  render() {
    const { width, height, columns, currency, manualProgress, loadMoreSteps, parentId } = this.props;
    const { openToolTipWon, openToolTipLost } = this.state;
    return (
      <DragDropContext
        onDragUpdate={(props) => {
          const { destination } = props;
          if (destination) {
            if (destination.droppableId === 'won') {
              this.setState({ openToolTipWon: true })
            } else {
              this.setState({ openToolTipWon: false })
            }

            if (destination.droppableId === 'lost') {
              this.setState({ openToolTipLost: true })
            } else {
              this.setState({ openToolTipLost: false })
            }
          }
        }}
        onBeforeDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <Container style={{ width, height: height- 10 }}>
          {columns.map((lane, idx) => {
            return <Column
              width={width}
              height={height}
              currency={currency}
              manualProgress={manualProgress}
              key={lane.uuid}
              lastStep={idx === columns.length - 1}
              columnData={lane}
              columnNumber={columns.length}
              loadMoreSteps={loadMoreSteps}
              quotes={lane.prospectDTOList ? lane.prospectDTOList : []}
              parentId={parentId}
              columnId={lane.uuid}
              overviewType={OverviewTypes.Pipeline.Qualified}
              />;
          })}
          <AbsoluteDroppable open={openToolTipWon} parentWidth={width} width={width / columns.length - 10 > 120 ? width / columns.length - 10 : 120} columnId={"won"} />
          <AbsoluteDroppable open={openToolTipLost} parentWidth={width} width={width / columns.length - 10 > 120 ? width / columns.length - 10 : 120} columnId={"lost"} />
        </Container>
      </DragDropContext>
    )
  }
}

export default compose(
  connect(
    (state, { parentId }) => {
      const columns = getColumns(state, parentId)
      return {
        columns
      }
    },
    {
      updateCardLanes,
      loadMoreSteps,
      moveStepActionPlanLocal,
      fetchNumberOrderRow,
      highlight,
      setTrelloSelectedTrack
    }
  )
)(Board);

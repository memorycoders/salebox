import React, { Component } from 'react';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';
import ReactDOM from 'react-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { Popup } from 'semantic-ui-react';
import QuoteItem from './quote-item';
import { CardItem, CardHeader } from '../CardStep';
import starWonActive from '../../../../../public/star_circle_won_white.svg';
import starLostActive from '../../../../../public/star_circle_lost_white.svg';
import _l from 'lib/i18n';
export const grid: number = 10;
export const borderRadius: number = 4;
import { OverviewTypes } from '../../../../Constants';

const ColumnContainer = styled.div`
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: rgb(227, 227, 227);
  flex-shrink: 0;
  margin: 5px;
  display: flex;
  flex-direction: column;
`;

const getRowRender = (quotes, currency, columnId, parentId, overviewType) => ({ index, style }) => {
  const quote = quotes[index];

  if (!quote) {
    return null;
  }
  const patchedStyle = {
    ...style,
    left: style.left + grid,
    top: style.top + grid,
    width: `calc(${style.width} - ${grid * 2}px)`,
    height: style.height - grid,
  };
  return (
    <Draggable draggableId={quote.uuid} index={index} key={quote.uuid}>
      {(provided, snapshot) => (
        <CardItem
          overviewType={overviewType}
          provided={provided}
          {...quote}
          columnId={columnId}
          parentId={parentId}
          prospect={quote}
          currency={currency}
          isDragging={snapshot.isDragging}
          style={patchedStyle}
        />
      )}
    </Draggable>
  );
};

export const Column = React.memo(function Column(props) {
  let pageIndexSection = 0;
  const {
    parentId,
    lastStep,
    columnId,
    quotes,
    width,
    height,
    columnData,
    currency,
    manualProgress,
    loadMoreSteps,
    columnNumber,
    overviewType,
  } = props;

  const isRowRender = ({ index }) => {
    return !!quotes[index];
  };

  return (
    <ColumnContainer className="draft-column">
      <CardHeader manualProgress={manualProgress} currency={currency} overviewType={overviewType} {...columnData} />
      <Droppable
        style={{ backgroundColor: 'rgb(227, 227, 227)' }}
        droppableId={columnId}
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => {
          let style = {};
          if (provided.draggableProps.style.transform) {
            style = {
              transform: `${provided.draggableProps.style.transform} rotate(6deg)`,
            };
          } else {
            style = {};
          }

          return (
            <CardItem
              overviewType={overviewType}
              style={style}
              provided={provided}
              currency={currency}
              isDragging={snapshot.isDragging}
              {...quotes[rubric.source.index]}
              prospect={quotes[rubric.source.index]}
            />
          );
        }}
      >
        {(droppableProvided, snapshot) => {
          const itemCount: number = snapshot.isUsingPlaceholder ? quotes.length + 1 : quotes.length;

          return (
            <InfiniteLoader
              style={{ backgroundColor: 'rgb(227, 227, 227)' }}
              autoReload={true}
              isRowLoaded={isRowRender}
              loadMoreRows={(param) => {
                const { stopIndex } = param;

                const pageIndex = Math.ceil(stopIndex / 24) - 1;
                if (pageIndexSection < pageIndex) {
                  pageIndexSection = pageIndex;
                  if (overviewType === OverviewTypes.Pipeline.Qualified) {
                    loadMoreSteps(columnId, pageIndex, lastStep, parentId);
                  } else if (overviewType === OverviewTypes.RecruitmentActive) {
                    console.log('LOAD HRERERERE');
                    loadMoreSteps(pageIndex, columnId, lastStep, parentId);
                  }
                }
              }}
              threshold={2}
              rowCount={columnData.count || 1000}
            >
              {({ onRowsRendered, registerChild }) => {
                return (
                  <List
                    height={height}
                    className="column-trello"
                    rowCount={itemCount}
                    rowHeight={80}
                    width={
                      width / columnNumber - (10 + 10 / columnNumber) > 150
                        ? width / columnNumber - (10 + 10 / columnNumber)
                        : 150
                    }
                    ref={(ref) => {
                      if (ref) {
                        registerChild(ref);
                        const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                        if (whatHasMyLifeComeTo instanceof HTMLElement) {
                          droppableProvided.innerRef(whatHasMyLifeComeTo);
                        }
                      }
                    }}
                    style={{
                      backgroundColor: 'rgb(227, 227, 227)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onRowsRendered={onRowsRendered}
                    rowRenderer={getRowRender(quotes, currency, columnId, parentId, overviewType)}
                    threshold={300}
                    data={quotes}
                  />
                );
              }}
            </InfiniteLoader>
          );
        }}
      </Droppable>
    </ColumnContainer>
  );
});

const styles = {
  droppableAbsolute: {
    position: 'fixed',
    bottom: 2,
    zIndex: 99,
  },

  fame: {
    color: '#fff',
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    height: 45,
    width: 45,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
};

export const AbsoluteDroppable = ({ columnId, width, parentWidth, open, overviewType }) => {
  const left = parentWidth / 2 + 60 - (columnId === 'won' ? (width > 120 ? width : 120) : 0);
  return (
    <div
      id={columnId}
      className={`absolute-droppable absolute-droppable-${columnId}`}
      style={{
        ...styles.droppableAbsolute,
        background: columnId === 'lost' ? '#df5759' : '#aacd40',
        left: `${left}px`,
      }}
    >
      <Droppable
        droppableId={columnId}
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => {
          return <div />;
        }}
      >
        {(droppableProvided, snapshot) => {
          return (
            <Popup
              open={open}
              position="top center"
              style={{ fontSize: 11 }}
              trigger={
                <div
                  ref={(ref) => droppableProvided.innerRef(ref)}
                  style={{ width: width > 120 ? width : 120, ...styles.fame }}
                >
                  <img style={styles.image} src={columnId === 'won' ? starWonActive : starLostActive} />
                </div>
              }
            >
              {overviewType === 'CANDIDATE_ACTIVE' ? (
                <span style={styles.text}>{columnId === 'won' ? _l`Set as yes` : _l`Set as no`}</span>
              ) : (
                <span style={styles.text}>{columnId === 'won' ? _l`Set as won` : _l`Set as lost`}</span>
              )}
            </Popup>
          );
        }}
      </Droppable>
    </div>
  );
};

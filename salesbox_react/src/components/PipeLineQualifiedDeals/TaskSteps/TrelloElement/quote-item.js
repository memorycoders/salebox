// @flow
import React from 'react';
import styled from '@emotion/styled';

export const grid: number = 8;
export const borderRadius: number = 2;

const getBackgroundColor = (
    isDragging,
    isGroupedOver,
    authorColors,
) => {
    return '#fff'
};

const getBorderColor = (isDragging, authorColors) =>
    isDragging ? authorColors.hard : 'transparent';

const imageSize: number = 40;


const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props) => getBorderColor(props.isDragging, props.colors)};
  background-color: ${(props) =>
        getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) =>
        isDragging ? `2px 2px 1px #000` : 'none'};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: #000;

  &:hover,
  &:active {
    color: #000;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: ${grid}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`

  flex-grow: 1;
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Author = styled.small`
  color: ${(props) => props.colors.hard};
  flex-grow: 0;
  margin: 0;
  background-color: ${(props) => props.colors.soft};
  border-radius: ${borderRadius}px;
  font-weight: normal;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

function getStyle(provided, style) {
    if (!style) {
        return provided.draggableProps.style;
    }

    return {
        ...provided.draggableProps.style,
        ...style,
    };
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItem(props: Props) {
    const {
        quote,
        isDragging,
        isGroupedOver,
        provided,
        style,
        isClone,
        index,
    } = props;

    return (
        <Container
            href={quote.author.url}
            isDragging={isDragging}
            isGroupedOver={isGroupedOver}
            isClone={isClone}
            colors={quote.author.colors}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getStyle(provided, style)}
            data-is-dragging={isDragging}
            data-testid={quote.id}
            data-index={index}
            aria-label={`${quote.author.name} quote ${quote.content}`}
        >
            <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
            <Content>
                <BlockQuote>{quote.content}</BlockQuote>
                <Footer>
                    <Author colors={quote.author.colors}>{quote.author.name}</Author>
                    <QuoteId>id:{quote.id}</QuoteId>
                </Footer>
            </Content>
        </Container>
    );
}

export default React.memo<Props>(QuoteItem);
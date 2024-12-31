import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Row, Col, Badge, Space, Typography, Tag } from "antd";
import {
  EditorContext,
  DragIcon,
} from "lowcoder-sdk";
import { CSSProperties, useContext, useMemo, useState } from "react";
import { OptionPropertyParam } from "../kanbanOptionsControl";
import styled from "styled-components";

// Column
interface SectionItemProps {
  id: string,
  items: string[],
  name: string,
  data: OptionPropertyParam[],
  isSortingContainer: boolean,
  childrenProps: any,
  dataMap: Record<string, number>,
  cardViewJson: any,
  activeId: string | null,
  onClick: (cardIndex: number) => void,
  onEdit: (cardIndex: number) => void,
}

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  line-height: 16px;
  font-size: 14px;
  padding: 12px 0px;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  background: #f5f5f7;
  align-items: center;
  z-index: 999;

  .editAction {
    padding: 2px 8px;
    cursor: pointer;
    color: #3377ff;
    font-weight: 500;
  }

  .dragAction {
    font-weight: bold;
    padding: 2px 6px;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;

    svg {
      min-width: 20px;
      height: 20px;
    }

    span {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;

export const SectionItem = ({
  id,
  items,
  name,
  data,
  isSortingContainer,
  childrenProps,
  dataMap,
  cardViewJson,
  activeId,
  onClick,
  onEdit,
}: SectionItemProps) => {
  const editorState = useContext(EditorContext);
  const isEditorStateAvailable = useMemo(() => Boolean(editorState), [ editorState ]);

  const {
    setNodeRef,
  } = useSortable({
    id: id,
    data: {
      type: "SECTION"
    }
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
    >
      <div
        className="kanban-column-header"
        style={{
          color: childrenProps.boardStyles.textColor,
          fontSize: childrenProps.boardStyles.textSize,
        }}
      >
        {name}
        <Badge
          count={items.length ? items.length : 0}
          showZero={true}
          style={{
            backgroundColor: "#fff",
            color: "#000",
            marginLeft: "10px"
          }}
        />
      </div>
      <div className="kanban-column-list">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, _index) => {
            const itemData = data.find((d) => `task-${d.id}` === item);
            if (!itemData) return null;

            const cardIndex = itemData?.id ? dataMap[itemData.id] : 0;
            return (
              <FieldItem
                id={item}
                key={item}
                item={itemData}
                disabled={isSortingContainer}
                isEditorStateAvailable={isEditorStateAvailable}
                cardViewOption={childrenProps.cardViewOption}
                cardView={childrenProps.cardView}
                cardIndex={cardIndex}
                cardViewJson={cardViewJson}
                cardHeaderStyles={childrenProps.cardHeaderStyles}
                cardContentStyles={childrenProps.cardContentStyles}
                tagStyles={childrenProps.tagStyles}
                dragOverlay={activeId === item}
                onClick={() => onClick(cardIndex)}
                onEdit={() => onEdit(cardIndex)}
              />
            );
          })}
        </SortableContext>
      </div>
    </div>
  );
};

// Task
interface FieldItemProps {
  id: string,
  item: OptionPropertyParam,
  cardIndex: number,
  cardView: any,
  cardViewOption: any,
  cardViewJson: any,
  dragOverlay: boolean,
  disabled: boolean,
  isEditorStateAvailable: boolean,
  cardHeaderStyles: Record<string, string>,
  cardContentStyles: Record<string, string>,
  tagStyles: Record<string, string>,
  onClick: () => void,
  onEdit: () => void,
}
export const FieldItem = ({
  id,
  item,
  cardIndex,
  cardView,
  cardViewOption,
  cardViewJson,
  dragOverlay,
  disabled,
  isEditorStateAvailable,
  cardHeaderStyles,
  cardContentStyles,
  tagStyles,
  onClick,
  onEdit,
}: FieldItemProps) => {
  const {
    setNodeRef,
    listeners,
    isDragging,
    transform,
    transition,
    attributes
  } = useSortable({
    id: id,
    disabled: disabled,
    data: {
      type: "FIELD"
    }
  });
  const [hover, setHover] = useState(false);
  const template = useMemo(() => {
    return cardView.cardTemplate(
      item,
      cardIndex,
    )
  }, [
    JSON.stringify(item),
    cardIndex,
    cardView.cardTemplate,
  ]);

  const style = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: cardContentStyles.backgroundColor,
    borderRadius: cardContentStyles.radius,
    borderWidth: dragOverlay ? '1px' : cardContentStyles.borderWidth,
    borderColor: dragOverlay ? 'rgba(64, 150, 255, 1)' :cardContentStyles.border,
    padding: cardContentStyles.padding,
    margin: cardContentStyles.margin,
    fontSize: cardContentStyles.textSize,
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: dragOverlay
      ? "0 0 0 calc(1px / 1) rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)"
      : cardContentStyles.boxShadow,
    cursor: dragOverlay ? "grabbing" : "grab",
    touchAction:
      window.PointerEvent ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
        ? "manipulation"
        : "none"
  } as React.CSSProperties;
  
  const cardTemplate = useMemo(() => {
    return isEditorStateAvailable && cardViewOption === 'custom'
      ? template
      : (
        <>
          <Row
            justify="space-between"
          >
            <Typography.Text strong style={{
              fontSize: cardHeaderStyles.textSize,
              color: cardHeaderStyles.textColor,
            }}>
              {item.label}
            </Typography.Text>
          </Row>
          <Row
            justify="space-between"
            style={{
              marginTop: "10px",
              color: "#777"
            }}
          >
            <Typography.Text style={{
              fontSize: cardContentStyles.textSize,
            }}>
              {item.summary}
            </Typography.Text>
          </Row>
          <Row
            justify="space-between"
            align={"middle"}
            style={{
              marginTop: "10px",
              color: "#777"
            }}
          >
            <Col>
              {Boolean(item.tags) && item.tags?.split(',').map((tag: string) => (
                <Tag
                  style={{
                    fontSize: tagStyles.textSize,
                    color: tagStyles.textColor,
                  }}
                  key={tag}
                >
                  {tag}
                </Tag>
              ))}
            </Col>
            <Col>
              {Boolean(item.assignee) && (
                <Space align="center">
                  <Avatar key={item.assignee} style={{height: '26px', width: '26px'}}>
                    {item.assignee?.charAt(0)}
                  </Avatar>
                </Space>
              )}
            </Col>
          </Row>
        </>
      )
  }, [
    isEditorStateAvailable,
    cardViewOption,
    template,
    cardViewJson,
  ]);

  return (
    <div
      ref={disabled ? null : setNodeRef}
      className="card"
      style={style}
      {...attributes}
      {...listeners}
      onMouseUpCapture={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <>
        {hover && (
          <CardActions>
            <div className="dragAction">
              <DragIcon />
              <span>{item.label}</span>
            </div>
            <div
              className="editAction"
              onClick={onEdit}
            >
              <span>Edit</span>
            </div>
          </CardActions>
        )}
        {cardTemplate}
      </>
    </div>
  );
};

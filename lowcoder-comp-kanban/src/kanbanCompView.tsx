import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { KanbanImplComp } from "./KabanComp";
import {
  EditorContext,
  childrenToProps,
  ScrollBar,
  SlotConfigContext,
  getPanelStatus,
  DragIcon,
  TextEditIcon,
  deferAction,
} from "lowcoder-sdk";
import differenceWith from "lodash.differencewith";
import differenceBy from "lodash.differenceby";
import isEqual from "lodash.isequal";
import filter from "lodash.filter";
import includes from "lodash.includes";
import styled from "styled-components";
import { extend, addClass, registerLicense } from "@syncfusion/ej2-base";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  CardRenderedEventArgs,
  CardClickEventArgs,
} from "@syncfusion/ej2-react-kanban";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
  DragOverlay,
  getFirstCollision,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
  useSensor,
  MeasuringStrategy,
  DragOverEvent,
  DragStartEvent,
  DragEndEvent,
  Over,
  Active
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import update from "immutability-helper";
import KanbanCardModal from "./kanbanCardModal";
import "./index.css";
// import "./material3.css";
import KanbanBoard from "./components/KanbanBoard";
import { columns, tasks } from "./data/FakeData";
import { SectionItem } from "./components/KanbanCard";

registerLicense(
  "ORg4AjUWIQA/Gnt2UFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5Vd0ViX3pfdXRRR2VY"
);

const Wrapper = styled.div<{
  $bgColor?: string;
}>`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  ${(props) => props.$bgColor && `background: ${props.$bgColor};`}
`;

const LayoutContainer = styled.div<{
  $bgColor?: string;
  $autoHeight?: boolean;
  $overflow?: string;
  $radius?: string;
  $padding?: string;
}>`
  height: ${(props: any) => (props.$autoHeight ? "auto" : "100%")};
  width: 100%;

  overflow: auto;
  ${(props: any) =>
    props.$autoHeight &&
    `::-webkit-scrollbar {
    display: none;
  }`}

  .e-card-wrapper {
    padding-top: 24px !important;
  }

  ${(props) => props.$padding && `
    .e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card {
      .card-template {
        .e-card-header {
          padding-left: 0;
          padding-right: 0;
        }
        .e-card-content {
          padding-left: 0;
          padding-right: 0;
        }
        .e-card-custom-footer {
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  `}
`;

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

const getString = (assignee: string): string => {
  if (!Boolean(assignee)) return '';
  return (assignee.match(/\b(\w)/g) as string[]).join("").toUpperCase();
};

const ColumnTemplate = React.memo((props: {
  data: { [key: string]: string },
  boardStyles: { [key: string]: string }
}) => {
  return (
    <div className="header-template-wrap">
      <div className={"header-icon e-icons " + props.data.keyField}></div>
      <div
        className="header-text"
        style={{
          color: props.boardStyles.textColor,
          fontSize: props.boardStyles.textSize,
        }}
      >
        {props.data.headerText}
      </div>
    </div>
  );
});

const cardRendered = (props: {
  args: CardRenderedEventArgs,
  cardContentStyles: Record<string, string>,
}): void => {
  let val: string = (props.args.data as { [key: string]: Object }).priority as string;
  if (!Boolean(val)) return;
  let cardElement = props.args.element as HTMLElement;
  cardElement.style.backgroundColor = props.cardContentStyles.backgroundColor;
  cardElement.style.borderRadius = props.cardContentStyles.radius;
  cardElement.style.borderWidth = props.cardContentStyles.borderWidth;
  cardElement.style.borderColor = props.cardContentStyles.border;
  cardElement.style.boxShadow = props.cardContentStyles.boxShadow;
  addClass([cardElement], val);
};

export const CardTemplate = React.memo((props: {
  isEditorStateAvailable: boolean;
  cardViewOption: string;
  data: { [key: string]: string },
  cardIndex: number;
  cardView: any;
  cardHeaderStyles: Record<string, string>;
  cardContentStyles: Record<string, string>;
  tagStyles: Record<string, string>;
  onClick: () => void;
  onEdit: () => void;
}) => {
  const [hover, setHover] = useState(false);
  const template = useMemo(() => {
    return props.cardView.cardTemplate(
      props.data,
      props.cardIndex,
    )
  }, [
    JSON.stringify(props.data),
    props.cardIndex,
    // props.cardView.cardTemplate,
  ]);

  if (props.isEditorStateAvailable && props.cardViewOption === 'custom') {
    return (
      <Wrapper
        $bgColor={props.cardContentStyles.backgroundColor}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <CardActions>
            <div className="dragAction">
              <DragIcon />
              <span>{props.data.label}</span>
            </div>
            <div
              className="editAction"
              onClick={props.onEdit}
            >
              <span>Edit</span>
            </div>
          </CardActions>
        )}
        <div
          className={'card-template'}
          onClick={() => {
            props.onClick();
          }}
          style={{
            borderRadius: props.cardContentStyles.radius,
            borderWidth: props.cardContentStyles.borderWidth,
            border: props.cardContentStyles.border,
            padding: props.cardContentStyles.padding,
            margin: props.cardContentStyles.margin,
            fontSize: props.cardContentStyles.textSize,
            overflow: 'hidden',
          }}
        >
          {template}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      $bgColor={props.cardContentStyles.backgroundColor}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <CardActions>
          <div className="dragAction">
            <DragIcon />
            <span>{props.data.label}</span>
          </div>
          <div
            className="editAction"
            onClick={props.onEdit}
          >
            <span>Edit</span>
          </div>
        </CardActions>
      )}
      <div
        className={'card-template'}
        onClick={() => {
          props.onClick();
        }}
        style={{
          borderRadius: props.cardContentStyles.radius,
          borderWidth: props.cardContentStyles.borderWidth,
          border: props.cardContentStyles.border,
          padding: props.cardContentStyles.padding,
          margin: props.cardContentStyles.margin,
          fontSize: props.cardContentStyles.textSize,
          overflow: 'hidden',
        }}
      >
        <div className="e-card-header">
          <div className="e-card-header-caption">
            <div
              className="e-card-header-title e-tooltip-text"
              style={{
                fontSize: props.cardHeaderStyles.textSize,
                color: props.cardHeaderStyles.textColor,
              }}
            >
              {props.data.label}
            </div>
          </div>
        </div>
        <div className="e-card-content e-tooltip-text">
          <div
            className="e-text"
            style={{
              fontSize: props.cardContentStyles.textSize,
            }}
          >
            {props.data.summary}
          </div>
        </div>
        <div className="e-card-custom-footer">
          {props.data.tags?.split(',').map((tag: string) => (
            <div
              className="e-card-tag-field e-tooltip-text"
              style={{
                fontSize: props.tagStyles.textSize,
                color: props.tagStyles.textColor,
              }}
              key={tag}
            >
              {tag}
            </div>
          ))}
          <div className="e-card-avatar">{getString(props.data.assignee)}</div>
        </div>
      </div>
    </Wrapper>
  );
}, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next)
});

type Props = {
  comp: InstanceType<typeof KanbanImplComp>;
};

export const KanbanCompView = React.memo((props: Props) => {
  const { comp } = props;
  const childrenProps = childrenToProps(comp.children);
  
  const editorState = useContext(EditorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Record<string,string>>({});
  const [initDataMap, setInitDataMap] = useState<Record<string, number>>({});
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [items, setItems] = useState<Record<string, any>>({});
  const [containers, setContainers] = useState<Array<string>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clonedItems, setClonedItems] = useState<Record<string, any> | null>(null);
  const lastOverId = useRef(null);
  const initData = useRef(false);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  const isEditorStateAvailable = useMemo(() => Boolean(editorState), [ editorState ]);
  const cardView = useMemo(() => comp.children.cardView.children.cardView.toJsonValue(), [comp.children.cardView]);
  const cardModal = useMemo(() => childrenProps.cardView.cardModalView, [childrenProps.cardView.cardModalView] )
  
  const kanbanColumns: Array<Record<string, any>> = useMemo(() => {
    return childrenProps.statusOptions.map((
      column: {label: string, value: string},
      index: number
    ) => ({
      id: column.value,
      name: column.label,
      order: index,
    }));
  }, [JSON.stringify(childrenProps.statusOptions)]);

  const kanbanData: Array<Record<string, any>> = useMemo(() => {
    return [...childrenProps.data];
  }, [JSON.stringify(childrenProps.data)]);

  const statusOptions = useMemo(() => {
    let uniqueObjectsArray: any = [];
    childrenProps.statusOptions.forEach((statusOption: any) => {
      let status = {
        label: statusOption?.label,
        key: statusOption?.value,
        value: statusOption?.value,
      };
      let isDuplicate = uniqueObjectsArray.some(
        (item: any) => JSON.stringify(item) === JSON.stringify(status)
      );
      if (!isDuplicate) {
        uniqueObjectsArray.push(status);
      }
    }); 
    return uniqueObjectsArray;
  }, [JSON.stringify(childrenProps.statusOptions)]);

  const assigneeOptions = useMemo(() => {
    let assignees: any = [{
      label: 'Unassigned',
      value: '',
      key: 'unassigned',
    }];
    childrenProps.assigneeOptions.forEach((item: any) => {
      let assignee = {
        label: item.name,
        value: item.name,
        key: item.id,
      };
      let isDuplicate = assignees.some(
        (item: any) => JSON.stringify(item) === JSON.stringify(assignee)
      );
      if (!isDuplicate) {
        assignees.push(assignee);
      }
    });
    return assignees;
  }, [JSON.stringify(childrenProps.assigneeOptions)]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        //distance: 5,
        delay: 100,
        tolerance: 5
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
        delay: 100,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      KeyboardSensor: {
        distance: 5,
        delay: 100,
        tolerance: 5
      }
    })
  );
  
  const moveBetweenContainers = useCallback((
    activeContainer: string,
    overContainer: string,
    active: Active,
    over: Over | null,
    overId: string,
  ) => {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const overIndex = overItems.indexOf(overId);
      const activeIndex = activeItems.indexOf(active.id);

      // console.log('moveBetweenContainers', activeContainer, overContainer, active.id)
      let newIndex;

      if (overId in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect?.current?.translated &&
          active.rect?.current?.translated.top >=
            over.rect?.top + over.rect?.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      recentlyMovedToNewContainer.current = true;

      setItems(
        update(items, {
          [activeContainer]: {
            $splice: [[activeIndex, 1]]
          },
          [overContainer]: {
            $splice: [[newIndex, 0, active.id]]
            //$splice: [[newIndex, 0, items[activeContainer][activeIndex]],
          }
        })
      );

      if (active.id !== undefined) {
        const data = JSON.parse(JSON.stringify(kanbanData));
        const taskIdx = data.findIndex(task => String(`task-${task.id}`) === String(active.id));
        if (taskIdx > -1 && `column-${data[taskIdx]?.status}` !== overContainer) {
          data[taskIdx].status = overContainer.replace('column-', '');
          handleDataChange(data);
        }
      }
    },
    [kanbanData, items]
  );

   /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
   const collisionDetectionStrategy = useCallback(
    (args) => {
      // console.log('collisionDetectionStrategy', args)
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          )
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId !== null) {
        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              )
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  const findContainer = (id: string) => {
    if (id in items) return id;
    return containers.find((key) => items[key].includes(id));
  };

  function handleDragStart({ active }: DragStartEvent) {
    console.log('Drag Start');
    setActiveId(active.id as string);
    setClonedItems(items);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const overId = over ? over.id as string : undefined;
    
    if (!overId || active.id in items) return;
    
    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id as string);
    
    if (!overContainer || !activeContainer) return;
    
    console.log('Drag Over', activeContainer, overContainer);
    // when columns change
    if (activeContainer !== overContainer) {
      moveBetweenContainers(
        activeContainer,
        overContainer,
        active,
        over,
        overId
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      setActiveId(null);
      return;
    }

    // if (active.id in items && over?.id) {
    //   setContainers((containers) => {
    //     const activeIndex = containers.indexOf(active.id as string);
    //     const overIndex = containers.indexOf(over.id as string);

    //     return arrayMove(containers, activeIndex, overIndex);
    //   });
    // }

    const activeContainer = findContainer(active.id as string);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(over.id as string);

    console.log('Drag End', activeContainer, overContainer, items);
    // change of index within the same column
    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(over.id);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          )
        }));

      }
    }

    setActiveId(null);
  }

  const handleDragCancel = () => {
    console.log('Drag Cancel');
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };
  
  const handleDataChange = useCallback((data: Array<Record<string,any>>) => {
    console.log('handleDataChange');
    comp.children?.data.children.manual.children.manual.dispatch(
      comp.children?.data.children.manual.children.manual.setChildrensAction(
        data
      )
    );
    comp.children?.data.children.mapData.children.data.dispatchChangeValueAction(
      JSON.stringify(data)
    );
    
    childrenProps.onEvent("change");
  }, [comp, childrenProps.onEvent]);

  const handleOk = useCallback((dialogData: Record<string, string>) => {
    const { id } = dialogData;
    const updatedData = [ ...kanbanData ];
    const index = updatedData.findIndex((item: any) => item.id === id);
    if (index > -1) {
      updatedData[index] = dialogData;
      handleDataChange(updatedData);
    }
    setIsModalOpen(false);
  }, [kanbanData, setIsModalOpen, handleDataChange])
  
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen])

  const updateDataMap = useCallback(() => {
    const mapData: Record<string, number> = {};
    kanbanData?.forEach((item: any, index: number) => {
      mapData[`${item.id}`] = index;
    })
    setDataMap(mapData);

    if (initData.current) {
      const difference = differenceWith(kanbanData, childrenProps.initialData, isEqual);
      const inserted = differenceBy(difference, Object.keys(initDataMap)?.map(id => ({ id: parseInt(id) })), 'id')
      const updated = filter(difference, obj => includes(Object.keys(initDataMap), String(obj.id)));
      const deleted = differenceBy(childrenProps.initialData, Object.keys(mapData)?.map(id => ({ id: parseInt(id) })), 'id')

      comp.children?.updatedItems.dispatchChangeValueAction(updated);
      comp.children?.insertedItems.dispatchChangeValueAction(inserted);
      comp.children?.deletedItems.dispatchChangeValueAction(deleted);
    }

    if (!initData.current && kanbanData?.length) {
      setInitDataMap(mapData);
      comp.children?.initialData.dispatch(
        comp.children?.initialData.changeValueAction(kanbanData.slice())
      );
      initData.current = true;
    }
  }, [ JSON.stringify(kanbanData), setDataMap]);

  const createKanbanStyle = useCallback((minWidth: string) => {
    if (minWidth) {
      let style = document.getElementById('kanban-style');
      if (style) {
        style.remove();
      }
      style = document.createElement('style');
      style.setAttribute('id', 'kanban-style');
      style.setAttribute('type', 'text/css');
      style.innerHTML = `td.e-content-cells, th.e-header-cells {
        width: ${minWidth};
      }`;
      document.getElementsByTagName('head')[0].appendChild(style);
    };
  }, []);

  useEffect(() => {
    updateDataMap();
  }, [updateDataMap]);

  useEffect(() => {
    if (kanbanData) {
      // setData(tasks);
      let cols: Record<string, Array<string>> = {};
      kanbanColumns.sort((a, b) => a.order - b.order);
      kanbanColumns.forEach((c) => {
        cols["column-" + c.id] = [];
      });
      kanbanData.forEach((d: any) => {
        if (!Boolean(d.status)) return;
        if (!("column-" + d.status in cols)) {
          cols["column-" + d.status] = [];
        }
        cols["column-" + d.status].push("task-" + d.id);
      });
      setItems(cols);
      setContainers(Object.keys(cols));
    }
  }, [JSON.stringify(kanbanData), JSON.stringify(kanbanColumns)]);

  const renderKanbanModal = useMemo(() => (
    <KanbanCardModal
      open={isModalOpen}
      data={dialogData}
      statusOptions={statusOptions}
      assigneeOptions={assigneeOptions}
      onOk={(data) => handleOk(data)}
      onCancel={handleCancel}
    />
  ), [
    isModalOpen,
    dialogData,
    JSON.stringify(statusOptions),
    JSON.stringify(assigneeOptions),
    handleOk,
    handleCancel,
  ]);

  return (
    // <KanbanBoard
    //   tasks={kanbanData}
    //   columns={kanbanColumns}
    // />
    <>
      <div className="kanban">
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.WhileDragging
            }
          }}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="kanban-container">
            {containers.map((containerId) => {
              return (
                <SectionItem
                  id={containerId}
                  key={containerId}
                  items={items[containerId]}
                  name={
                    kanbanColumns.filter((c) => `column-${c.id}` === containerId)[0]
                      ?.name
                  }
                  data={kanbanData}
                  isSortingContainer={isSortingContainer}
                  childrenProps={childrenProps}
                  dataMap={dataMap}
                  cardViewJson={cardView}
                />
              );
            })}
          </div>
        </DndContext>
      </div>

      <SlotConfigContext.Provider value={{ modalWidth: 600 }}>
        {cardModal}
      </SlotConfigContext.Provider>
      { renderKanbanModal}
    </>
  )

  // const { comp } = props;
  // const childrenProps = childrenToProps(comp.children);
  // const panelStatus = getPanelStatus();
  
  // const editorState = useContext(EditorContext);
  // const [dataMap, setDataMap] = useState<Record<string, number>>({});
  // const [initDataMap, setInitDataMap] = useState<Record<string, number>>({});
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [dialogData, setDialogData] = useState<Record<string,string>>({});
  // const initData = useRef<boolean>(false);

  // const isEditorStateAvailable = useMemo(() => Boolean(editorState), [ editorState ]);
  // const cardView = useMemo(() => comp.children.cardView.children.cardView.toJsonValue(), [comp.children.cardView]);
  // const cardModal = useMemo(() => childrenProps.cardView.cardModalView, [childrenProps.cardView.cardModalView] )
  // const onEventVal = useMemo(() => comp?.toJsonValue()?.onEvent, [comp]);

  // const updateDataMap = useCallback(() => {
  //   const mapData: Record<string, number> = {};
  //   childrenProps.data?.forEach((item: any, index: number) => {
  //     mapData[`${item.id}`] = index;
  //   })
  //   setDataMap(mapData);

  //   if (initData.current) {
  //     const difference = differenceWith(childrenProps.data, childrenProps.initialData, isEqual);
  //     const inserted = differenceBy(difference, Object.keys(initDataMap)?.map(id => ({ id: parseInt(id) })), 'id')
  //     const updated = filter(difference, obj => includes(Object.keys(initDataMap), String(obj.id)));
  //     const deleted = differenceBy(childrenProps.initialData, Object.keys(mapData)?.map(id => ({ id: parseInt(id) })), 'id')

  //     comp.children?.updatedItems.dispatchChangeValueAction(updated);
  //     comp.children?.insertedItems.dispatchChangeValueAction(inserted);
  //     comp.children?.deletedItems.dispatchChangeValueAction(deleted);
  //   }

  //   if (!initData.current && childrenProps.data?.length) {
  //     setInitDataMap(mapData);
  //     comp.children?.initialData.dispatch(
  //       comp.children?.initialData.changeValueAction([...childrenProps.data])
  //     );
  //     initData.current = true;
  //   }
  // }, [ JSON.stringify(childrenProps.data), setDataMap]);

  // const createKanbanStyle = useCallback((minWidth: string) => {
  //   if (minWidth) {
  //     let style = document.getElementById('kanban-style');
  //     if (style) {
  //       style.remove();
  //     }
  //     style = document.createElement('style');
  //     style.setAttribute('id', 'kanban-style');
  //     style.setAttribute('type', 'text/css');
  //     style.innerHTML = `td.e-content-cells, th.e-header-cells {
  //       width: ${minWidth};
  //     }`;
  //     document.getElementsByTagName('head')[0].appendChild(style);
  //   };
  // }, []);

  // useEffect(() => {
  //   updateDataMap();
  // }, [updateDataMap]);

  // useEffect(() => {
  //   createKanbanStyle(childrenProps.minCardWidth);
  // }, [childrenProps.minCardWidth, createKanbanStyle]);

  // const kanbanData: Object[] = useMemo(() => extend(
  //     [],
  //     childrenProps.data as { [key: string]: Object },
  //     undefined,
  //     true
  //   ) as Object[]
  //   , [JSON.stringify(childrenProps.data)]
  // );

  // const showModal = useCallback(() => {
  //   setIsModalOpen(true);
  // }, [setIsModalOpen]);

  // const OnCardDoubleClick = useCallback((args: CardClickEventArgs): void => {
  //   setDialogData({
  //     ...(args.data as any),
  //   });
  //   setTimeout(() => {
  //     showModal();
  //   }, 100)
  // }, [setDialogData, showModal]);

  // const handleOnEdit = useCallback((data: any): void => {
  //   setDialogData({
  //     ...data,
  //   });
  //   setTimeout(() => {
  //     showModal();
  //   }, 100)
  // }, [setDialogData, showModal]);

  // const assigneeOptions = useMemo(() => {
  //   let assignees: any = [{
  //     label: 'Unassigned',
  //     value: '',
  //     key: 'unassigned',
  //   }];
  //   childrenProps.assigneeOptions.forEach((item: any) => {
  //     let assignee = {
  //       label: item.name,
  //       value: item.name,
  //       key: item.id,
  //     };
  //     let isDuplicate = assignees.some(
  //       (item: any) => JSON.stringify(item) === JSON.stringify(assignee)
  //     );
  //     if (!isDuplicate) {
  //       assignees.push(assignee);
  //     }
  //   });
  //   return assignees;
  // }, [JSON.stringify(childrenProps.assigneeOptions)]);

  // const statusOptions = useMemo(() => {
  //   let uniqueObjectsArray: any = [];
  //   childrenProps.statusOptions.forEach((statusOption: any) => {
  //     let status = {
  //       label: statusOption?.label,
  //       key: statusOption?.value,
  //       value: statusOption?.value,
  //     };
  //     let isDuplicate = uniqueObjectsArray.some(
  //       (item: any) => JSON.stringify(item) === JSON.stringify(status)
  //     );
  //     if (!isDuplicate) {
  //       uniqueObjectsArray.push(status);
  //     }
  //   }); 
  //   return uniqueObjectsArray;
  // }, [JSON.stringify(childrenProps.statusOptions)]);

  // const handleDataChange = useCallback((kanbanData: Array<Record<string,any>>) => {
  //   comp.children?.data.children.manual.children.manual.dispatch(
  //     comp.children?.data.children.manual.children.manual.setChildrensAction(
  //       kanbanData
  //     )
  //   );
  //   comp.children?.data.children.mapData.children.data.dispatchChangeValueAction(
  //     JSON.stringify(kanbanData)
  //   );
    
  //   childrenProps.onEvent("change");
  // }, [comp, childrenProps.onEvent]);

  // const handleActionComplete = useCallback(({
  //   changedRecords,
  // }: {
  //   changedRecords : Array<Record<string,any>>
  // }) => {
  //   const updatedData = [ ...kanbanData ] as Array<Record<string,any>>;
  //   changedRecords?.forEach((record) => {
  //     const { id } = record;
  //     const index = updatedData.findIndex((item: any) => item.id === id);
  //     if (index > -1) {
  //       updatedData[index] = record;
  //     }
  //   });
  //   handleDataChange(updatedData);
  // }, [kanbanData, handleDataChange]);

  // const handleOk = useCallback((dialogData: Record<string, string>) => {
  //   const { id } = dialogData;
  //   const updatedData = [ ...kanbanData ];
  //   const index = updatedData.findIndex((item: any) => item.id === id);
  //   if (index > -1) {
  //     updatedData[index] = dialogData;
  //     handleDataChange(updatedData);
  //   }
  //   setIsModalOpen(false);
  // }, [kanbanData, setIsModalOpen, handleDataChange])
  
  // const handleCancel = useCallback(() => {
  //   setIsModalOpen(false);
  // }, [setIsModalOpen])

  // const cardTemplate = useCallback((data: Record<string, string>) => {
  //   const cardIndex = dataMap[data.id] || 0;
  //   return (
  //     <CardTemplate
  //       key={data.id}
  //       isEditorStateAvailable={isEditorStateAvailable}
  //       cardViewOption={childrenProps.cardViewOption}
  //       data={data}
  //       cardIndex={cardIndex}
  //       cardView={childrenProps.cardView}
  //       cardHeaderStyles={childrenProps.cardHeaderStyles}
  //       cardContentStyles={childrenProps.cardContentStyles}
  //       tagStyles={childrenProps.tagStyles}
  //       onClick={() => {
  //         comp.children.activeCardIndex.dispatchChangeValueAction(cardIndex);
  //         comp.children.activeCardData.dispatchChangeValueAction(childrenProps.data[cardIndex]);
  //         childrenProps.onEvent("cardClick");
  //       }}
  //       onEdit={() => {
  //         if (onEventVal && onEventVal.some((e: any) => e.name === 'onEdit')) {
  //           childrenProps.onEvent('onEdit');
  //           return;
  //         }
  //         handleOnEdit(childrenProps.data[cardIndex]);
  //       }}
  //     />
  //   );
  // }, [
  //   cardView,
  //   childrenProps.cardViewOption,
  //   isEditorStateAvailable,
  //   JSON.stringify(panelStatus),
  //   JSON.stringify(dataMap),
  //   JSON.stringify(childrenProps.cardHeaderStyles),
  //   JSON.stringify(childrenProps.cardContentStyles),
  //   JSON.stringify(childrenProps.tagStyles),
  //   onEventVal,
  // ]);

  // const renderKanbanComp = useMemo(() => {
  //   return (
  //     <ScrollBar
  //       style={{
  //         height: childrenProps.autoHeight ? 'auto' : '100%',
  //         margin: '0px',
  //         padding: '0px',
  //       }}
  //       overflow="scroll"
  //       hideScrollbar={!childrenProps.scrollbars}
  //     >
  //       <LayoutContainer
  //         $padding={childrenProps.cardContentStyles.padding}
  //       >
  //         {Boolean(Object.keys(dataMap).length) && (
  //           <KanbanComponent
  //             id="kanban"
  //             cssClass="kanban-overview"
  //             keyField="status"
  //             dataSource={[...kanbanData]}
  //             // cardDoubleClick={OnCardDoubleClick}
  //             cardClick={(args: CardClickEventArgs) => {
  //               args.event?.stopPropagation();
  //             }}
  //             swimlaneSettings={
  //               {keyField: childrenProps.separateAssigneeSections ? 'assignee' : ''}
  //             }
  //             actionComplete={handleActionComplete}
  //             cardSettings={{
  //               headerField: 'label',
  //               template: cardTemplate,
  //               selectionType: 'Single',
  //             }}
  //             cardRendered={(args: CardRenderedEventArgs) => {
  //               return cardRendered({
  //                 args,
  //                 cardContentStyles: childrenProps.cardContentStyles,
  //               })
  //             }}
  //           >
  //             <ColumnsDirective>
  //               {childrenProps.statusOptions.map((statusOption: any) => (
  //                 <ColumnDirective
  //                   key={statusOption.value}
  //                   headerText={statusOption.label}
  //                   keyField={statusOption.value}
  //                   allowToggle={true}
  //                   template={(data: Record<string, string>) => (
  //                     <ColumnTemplate data={data} boardStyles={childrenProps.boardStyles} />
  //                   )}
  //                 />
  //               ))}
  //             </ColumnsDirective>
  //           </KanbanComponent>
  //         )}
  //       </LayoutContainer>
  //     </ScrollBar>
  // )}, [
  //   cardTemplate,
  //   JSON.stringify(dataMap),
  //   JSON.stringify(kanbanData),
  //   JSON.stringify(childrenProps.statusOptions),
  //   JSON.stringify(childrenProps.cardContentStyles),
  //   JSON.stringify(childrenProps.boardStyles),
  //   childrenProps.autoHeight,
  //   childrenProps.separateAssigneeSections,
  //   // OnCardDoubleClick,
  //   handleActionComplete,
  // ]);

  // const renderKanbanModal = useMemo(() => (
  //   <KanbanCardModal
  //     open={isModalOpen}
  //     data={dialogData}
  //     statusOptions={statusOptions}
  //     assigneeOptions={assigneeOptions}
  //     onOk={(data) => handleOk(data)}
  //     onCancel={handleCancel}
  //   />
  // ), [
  //   isModalOpen,
  //   dialogData,
  //   JSON.stringify(statusOptions),
  //   JSON.stringify(assigneeOptions),
  //   handleOk,
  //   handleCancel,
  // ]);

  // return (
  //   <>
  //     { renderKanbanComp }
  //     <SlotConfigContext.Provider value={{ modalWidth: 600 }}>
  //       {cardModal}
  //     </SlotConfigContext.Provider>
  //     { renderKanbanModal}
  //   </>
  // );
}, (prev, next) =>  {
  return prev.comp.toJsonValue() === next.comp.toJsonValue();
});

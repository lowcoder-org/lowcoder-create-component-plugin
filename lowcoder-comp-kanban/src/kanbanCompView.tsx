import React, { act, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { KanbanImplComp } from "./KabanComp";
import {
  EditorContext,
  childrenToProps,
  ScrollBar,
  SlotConfigContext,
} from "lowcoder-sdk";
import differenceWith from "lodash.differencewith";
import differenceBy from "lodash.differenceby";
import isEqual from "lodash.isequal";
import filter from "lodash.filter";
import includes from "lodash.includes";
import styled from "styled-components";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
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
  arrayMove,
} from "@dnd-kit/sortable";
import update from "immutability-helper";
import KanbanCardModal from "./kanbanCardModal";
import { SectionItem } from "./components/KanbanCard";
import { DroppableContainer, RectMap } from "@dnd-kit/core/dist/store/types";
import { ClientRect, Coordinates } from "@dnd-kit/core/dist/types";
import { OptionPropertyParam } from "kanbanOptionsControl";
import "./index.css";

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

type Props = {
  comp: InstanceType<typeof KanbanImplComp>;
};

type CollisionDetectionStrategyArgs = {
  active: Active;
  collisionRect: ClientRect;
  droppableRects: RectMap;
  droppableContainers: DroppableContainer[];
  pointerCoordinates: Coordinates | null;
}

export const KanbanCompView = React.memo((props: Props) => {
  const { comp } = props;
  const childrenProps = childrenToProps(comp.children);
  
  const editorState = useContext(EditorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Record<string,string>>({});
  const [initDataMap, setInitDataMap] = useState<Record<string, number>>({});
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [items, setItems] = useState<Record<string, Array<string>>>({});
  const [containers, setContainers] = useState<Array<string>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clonedItems, setClonedItems] = useState<Record<string, any> | null>(null);
  const lastOverId = useRef<string | null>(null);
  const initData = useRef(false);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  const isEditorStateAvailable = useMemo(() => Boolean(editorState), [ editorState ]);
  const cardView = useMemo(() => comp.children.cardView.children.cardView.toJsonValue(), [comp.children.cardView]);
  const cardModal = useMemo(() => childrenProps.cardView.cardModalView, [childrenProps.cardView.cardModalView] )
  const onEventVal = useMemo(() => comp?.toJsonValue()?.onEvent, [comp]);

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

  const kanbanData: Array<OptionPropertyParam> = useMemo(() => {
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
      const activeIndex = activeItems.indexOf(active.id as string);

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
        update(items as Record<string, any>, {
          [activeContainer]: {
            $splice: [[activeIndex, 1]]
          },
          [overContainer]: {
            $splice: [[newIndex, 0, active.id]]
          }
        })
      );

      if (active.id !== undefined) {
        const data = JSON.parse(JSON.stringify(kanbanData));
        const taskIdx = data.findIndex((task: { id: string; }) => String(`task-${task.id}`) === String(active.id));
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
    (args: CollisionDetectionStrategyArgs) => {
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
                  containerItems.includes(container.id as string)
              )
            })[0]?.id;
          }
        }

        lastOverId.current = overId as string;

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setClonedItems(items);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const overId = over ? over.id as string : undefined;
    
    if (!overId || active.id in items) return;
    
    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id as string);
    
    if (!overContainer || !activeContainer) return;

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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return setActiveId(null);
    }

    const activeContainer = findContainer(active.id as string);
    if (!activeContainer) {
      return setActiveId(null);
    }

    // change of index within the same column
    const overContainer = findContainer(over.id as string);
    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id as string);
      const overIndex = items[overContainer].indexOf(over.id as string);

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
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };
  
  const handleDataChange = useCallback((data: Array<Record<string,any>>) => {
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

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleOnEdit = useCallback((data: any): void => {
    setDialogData({
      ...data,
    });
    setTimeout(() => {
      showModal();
    }, 100)
  }, [setDialogData, showModal]);

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

  useEffect(() => {
    updateDataMap();
  }, [updateDataMap]);

  useEffect(() => {
    if (kanbanData) {
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
    <>
      <ScrollBar
        style={{
          height: childrenProps.autoHeight ? 'auto' : '100%',
          margin: '0px',
          padding: '0px',
        }}
        overflow="scroll"
        hideScrollbar={!childrenProps.scrollbars}
      >
        <LayoutContainer
          $padding={childrenProps.cardContentStyles.padding}
        >
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
                      activeId={activeId}
                      onClick={(cardIndex: number) => {
                        comp.children.activeCardIndex.dispatchChangeValueAction(cardIndex);
                        comp.children.activeCardData.dispatchChangeValueAction(childrenProps.data[cardIndex]);
                        childrenProps.onEvent("cardClick");
                      }}
                      onEdit={(cardIndex: number) => {
                        if (onEventVal && onEventVal.some((e: any) => e.name === 'onEdit')) {
                          childrenProps.onEvent('onEdit');
                          return;
                        }
                        handleOnEdit(childrenProps.data[cardIndex]);
                      }}
                    />
                  );
                })}
              </div>
            </DndContext>
          </div>
        </LayoutContainer>
      </ScrollBar>

      <SlotConfigContext.Provider value={{ modalWidth: 600 }}>
        {cardModal}
      </SlotConfigContext.Provider>
      { renderKanbanModal}
    </>
  )
}, (prev, next) =>  {
  return prev.comp.toJsonValue() === next.comp.toJsonValue();
});

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { KanbanImplComp } from "./KabanComp";
import {
  EditorContext,
  childrenToProps,
  styled,
  ScrollBar,
  SlotConfigContext,
  getPanelStatus,
} from "lowcoder-sdk";
import { extend, addClass, registerLicense } from "@syncfusion/ej2-base";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  CardRenderedEventArgs,
  CardClickEventArgs,
} from "@syncfusion/ej2-react-kanban";
import KanbanCardModal from "./kanbanCardModal";
import "./index.css";
import "./material3.css";

registerLicense(
  "ORg4AjUWIQA/Gnt2UFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5Vd0ViX3pfdXRRR2VY"
);

const Wrapper = styled.div<{}>`
  height: 100%;
  width: 100%;
  .e-card {
    background-color: red !important;
    font-size: 52px !important;
  }
`;

const LayoutContainer = styled.div<{
  $bgColor?: string;
  $autoHeight?: boolean;
  $overflow?: string;
  $radius?: string;
}>`
  height: ${(props: any) => (props.$autoHeight ? "auto" : "100%")};

  overflow: auto;
  overflow: ${(props: any) => props.$overflow ?? "overlay"};
  ${(props: any) =>
    props.$autoHeight &&
    `::-webkit-scrollbar {
    display: none;
  }`}
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

const CardTemplate = React.memo((props: {
  isEditorStateAvailable: boolean;
  cardViewOption: string;
  data: { [key: string]: string },
  cardIndex: number;
  cardView: any;
  cardHeaderStyles: Record<string, string>;
  cardContentStyles: Record<string, string>;
  tagStyles: Record<string, string>;
}) => {
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
    return template;
  }

  return (
    <Wrapper>
      <div
        className={'card-template'}
        style={{
          backgroundColor: props.cardContentStyles.backgroundColor,
          borderRadius: props.cardContentStyles.radius,
          borderWidth: props.cardContentStyles.borderWidth,
          border: props.cardContentStyles.border,
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
              color: props.cardContentStyles.text,
              padding: props.cardContentStyles.padding,
              margin: props.cardContentStyles.margin,
              borderWidth: props.cardContentStyles.borderWidth,
            }}
          >
            {props.data.summary}
          </div>
        </div>
        <div className="e-card-custom-footer">
          {props.data.tags.split(',').map((tag: string) => (
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
  // const childrenProps = useMemo(() => 
  //   childrenToProps(comp.children),
  //   [childrenToProps, comp.children],
  // );
  const childrenProps = childrenToProps(comp.children);
  const panelStatus = getPanelStatus();
  
  const editorState = useContext(EditorContext);
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogData, setDialogData] = useState<Record<string,string>>({});

  const isEditorStateAvailable = useMemo(() => Boolean(editorState), [ editorState ]);
  const cardView = useMemo(() => comp.children.cardView.children.cardView.toJsonValue(), [comp.children.cardView]);
  const cardModal = useMemo(() => childrenProps.cardView.cardModalView, [childrenProps.cardView.cardModalView] )
  const updateDataMap = useCallback(() => {
    const mapData: Record<string, number> = {};
    childrenProps.data?.forEach((item: any, index: number) => {
      mapData[`${item.id}`] = index;
    })
    setDataMap(mapData);
  }, [ JSON.stringify(childrenProps.data), setDataMap]);

  useEffect(() => {
    updateDataMap();
  }, [updateDataMap]);

  const kanbanData: Object[] = useMemo(() => extend(
      [],
      childrenProps.data as { [key: string]: Object },
      undefined,
      true
    ) as Object[]
    , [JSON.stringify(childrenProps.data)]
  );

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const OnCardDoubleClick = useCallback((args: CardClickEventArgs): void => {
    setDialogData({
      ...(args.data as any),
    });
    setTimeout(() => {
      showModal();
    }, 100)
  }, [setDialogData, showModal]);

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

  const handleDataChange = useCallback((kanbanData: Array<Record<string,any>>) => {
    comp.children?.data.children.manual.children.manual.dispatch(
      comp.children?.data.children.manual.children.manual.setChildrensAction(
        kanbanData
      )
    );
    comp.children?.data.children.mapData.children.data.dispatchChangeValueAction(
      JSON.stringify(kanbanData)
    );
    
    childrenProps.onEvent("change");
  }, [comp, childrenProps.onEvent]);

  const handleActionComplete = useCallback(({
    changedRecords,
  }: {
    changedRecords : Array<Record<string,any>>
  }) => {
    const updatedData = [ ...kanbanData ] as Array<Record<string,any>>;
    changedRecords?.forEach((record) => {
      const { id } = record;
      const index = updatedData.findIndex((item: any) => item.id === id);
      if (index > -1) {
        updatedData[index] = record;
      }
    });
    handleDataChange(updatedData);
  }, [kanbanData, handleDataChange]);

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

  const cardTemplate = useCallback((data: Record<string, string>) => {
    const cardIndex = dataMap[data.id] || 0;
    return (
      <CardTemplate
        key={data.id}
        isEditorStateAvailable={isEditorStateAvailable}
        cardViewOption={childrenProps.cardViewOption}
        data={data}
        cardIndex={cardIndex}
        cardView={childrenProps.cardView}
        cardHeaderStyles={childrenProps.cardHeaderStyles}
        cardContentStyles={childrenProps.cardContentStyles}
        tagStyles={childrenProps.tagStyles}
      />
    );
  }, [
    cardView,
    childrenProps.cardViewOption,
    isEditorStateAvailable,
    JSON.stringify(panelStatus),
    JSON.stringify(dataMap),
    JSON.stringify(childrenProps.cardHeaderStyles),
    JSON.stringify(childrenProps.cardContentStyles),
    JSON.stringify(childrenProps.tagStyles),
  ]);

  const renderKanbanComp = useMemo(() => {
    return (
      <ScrollBar
        style={{
          height: childrenProps.autoHeight ? 'auto' : '100%',
          margin: '0px',
          padding: '0px',
        }}
        hideScrollbar={!childrenProps.scrollbars}
      >
        <LayoutContainer>
          {Boolean(Object.keys(dataMap).length) && (
            <KanbanComponent
              id="kanban"
              cssClass="kanban-overview"
              keyField="status"
              dataSource={[...kanbanData]}
              cardDoubleClick={OnCardDoubleClick}
              cardClick={(args: CardClickEventArgs) => args.event?.stopPropagation()}
              swimlaneSettings={
                {keyField: childrenProps.separateAssigneeSections ? 'assignee' : ''}
              }
              actionComplete={handleActionComplete}
              cardSettings={{
                headerField: 'label',
                template: cardTemplate,
              }}
              cardRendered={(args: CardRenderedEventArgs) => {
                return cardRendered({
                  args,
                  cardContentStyles: childrenProps.cardContentStyles,
                })
              }}
            >
              <ColumnsDirective>
                {childrenProps.statusOptions.map((statusOption: any) => (
                  <ColumnDirective
                    key={statusOption.value}
                    headerText={statusOption.label}
                    keyField={statusOption.value}
                    allowToggle={true}
                    template={(data: Record<string, string>) => (
                      <ColumnTemplate data={data} boardStyles={childrenProps.boardStyles} />
                    )}
                  />
                ))}
              </ColumnsDirective>
            </KanbanComponent>
          )}
        </LayoutContainer>
      </ScrollBar>
  )}, [
    cardTemplate,
    JSON.stringify(dataMap),
    JSON.stringify(kanbanData),
    JSON.stringify(childrenProps.statusOptions),
    JSON.stringify(childrenProps.cardContentStyles),
    JSON.stringify(childrenProps.boardStyles),
    childrenProps.autoHeight,
    childrenProps.separateAssigneeSections,
    OnCardDoubleClick,
    handleActionComplete,
  ]);

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
      { renderKanbanComp }
      <SlotConfigContext.Provider value={{ modalWidth: 600 }}>
        {cardModal}
      </SlotConfigContext.Provider>
      { renderKanbanModal}
    </>
  );
}, (prev, next) =>  {
  return prev.comp.toJsonValue() === next.comp.toJsonValue();
});

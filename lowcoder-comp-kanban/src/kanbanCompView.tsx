import { useContext, useEffect, useRef, useState } from "react";
import { KanbanImplComp } from "./KabanComp";
import {
  EditorContext,
  childrenToProps,
  styled,
  ScrollBar,
  SlotConfigContext,
} from "lowcoder-sdk";
import {  Modal, Input, Flex, Typography } from "antd";
import { extend, addClass, registerLicense } from "@syncfusion/ej2-base";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  DialogFieldsModel,
  CardRenderedEventArgs,
  CardClickEventArgs,
} from "@syncfusion/ej2-react-kanban";
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
  return (assignee.match(/\b(\w)/g) as string[]).join("").toUpperCase();
};

const columnTemplate = (props: {
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
};

const cardRendered = (props: {
  args: CardRenderedEventArgs,
  cardContentStyles: Record<string, string>,
}): void => {
  let val: string = (props.args.data as { [key: string]: Object }).Priority as string;
  let cardElement = props.args.element as HTMLElement;
  cardElement.style.backgroundColor = props.cardContentStyles.backgroundColor;
  cardElement.style.borderRadius = props.cardContentStyles.radius;
  cardElement.style.borderWidth = props.cardContentStyles.borderWidth;
  cardElement.style.borderColor = props.cardContentStyles.border;
  cardElement.style.boxShadow = props.cardContentStyles.boxShadow;
  addClass([cardElement], val);
};

const cardTemplate = (props: {
  data: { [key: string]: string },
  cardIndex: number;
  childrenProps: any;
  cardHeaderStyles: Record<string, string>;
  cardContentStyles: Record<string, string>;
  tagStyles: Record<string, string>;
}) => {
  // const { items, ...otherContainerProps } = props.container;
  const editorState = useContext(EditorContext);
  if (editorState) {
    return props.childrenProps.cardView.cardViewConfig.cardTemplate(
      props.data,
      props.cardIndex,
    );
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
              {props.data.Title}
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
            {props.data.Summary}
          </div>
        </div>
        <div className="e-card-custom-footer">
          {props.data.Tags.split(',').map((tag: string) => (
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
          <div className="e-card-avatar">{getString(props.data.Assignee)}</div>
        </div>
      </div>
    </Wrapper>
  );
};

type Props = {
  comp: InstanceType<typeof KanbanImplComp>;
};

export function KanbanCompView(props: Props) {
  const { comp } = props;
  const childrenProps = childrenToProps(comp.children);
  
  const [dataMap, setDataMap] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateDataMap = () => {
    const mapData: Record<string, number> = {};
    childrenProps.data?.forEach((item: any, index: number) => {
      mapData[item.Id] = index;
    })
    setDataMap(mapData);
  }

  useEffect(() => {
    updateDataMap();
  }, []);

  useEffect(() => {
    updateDataMap();
  }, [JSON.stringify(childrenProps.data)]);

  console.log("🚀 ~ returnnewContainerCompBuilder ~ props:", props)
  
  // const { items, ...otherContainerProps } = childrenProps.container
  // const {items:containerItems, ...otherContainerProps} = childrenProps.container;

  let data: Object[] = extend(
    [],
    childrenProps.data as { [key: string]: Object },
    undefined,
    true
  ) as Object[];

  const fields: DialogFieldsModel[] = [
    { text: "ID", key: "Title", type: "TextBox" },
    { key: "Status", type: "DropDown" },
    { key: "Assignee", type: "DropDown" },
    { key: "RankId", type: "TextBox" },
    { key: "Summary", type: "TextArea" },
    { key: "Tags", type: "TextArea" },
  ];

  const OnCardDoubleClick = (args: CardClickEventArgs): void => {
    setDialogData({
      ...(args.data as any),
      Status: getStatus(),
      Assignee: getAllSigneed(),
    });
    showModal();
  };

  const handleDataChange = () => {
    childrenProps.onEvent("change");
  };

  const getAllSigneed = () => {
    return new Set(
      data.map((item: any) => {
        return {
          label: item.Assignee,
          key: item.Assignee,
        };
      })
    ).values;
  };

  const getStatus = () => {
    let uniqueObjectsArray: any = [];
    data.forEach((element: any) => {
      let status = {
        label: element?.Status,
        key: element?.Status,
      };
      let isDuplicate = uniqueObjectsArray.some(
        (item: any) => JSON.stringify(item) === JSON.stringify(status)
      );
      if (!isDuplicate) {
        uniqueObjectsArray.push(status);
        console.log(`Object added to the array:`, status);
      }
    });
    return uniqueObjectsArray;
  };

  const [dialogData, setDialogData] = useState({
    Title: "",
    Status: getStatus(),
    Assignee: getAllSigneed(),
    RankId: "",
    Summary: "",
    Tags: "",
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDialogData({
      Title: '',
      Status: getStatus(),
      Assignee: getAllSigneed(),
      RankId: '',
      Summary: '',
      Tags: '',
    });
  };

  return (
    <div
      className="schedule-control-section"
      style={{height: `100%`, width: `100%`}}
    >
      <Modal
        title="Edit Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
      >
        <Flex vertical gap={10}>
          <Typography.Title level={5}>Title</Typography.Title>
          <Input
            placeholder={'Title'}
            onChange={(e) =>
              setDialogData((prev) => ({...prev, Title: e.target.value}))
            }
            value={dialogData.Title}
          />
          <Typography.Title level={5}>Status</Typography.Title>
          {/* <Dropdown menu={{ menuItems }} trigger={["click"]} /> */}
          {/* <Typography.Title level={5}>Assignee</Typography.Title>
          <Dropdown menu={dialogData.Status as any} /> */}
          <Typography.Title level={5}>Summary</Typography.Title>
          <Input
            placeholder={'Summary'}
            onChange={(e) =>
              setDialogData((prev) => ({...prev, Summary: e.target.value}))
            }
            value={dialogData.Summary}
          />
          <Typography.Title level={5}>Tags</Typography.Title>
          <Input
            placeholder={'Tags'}
            onChange={(e) =>
              setDialogData((prev) => ({...prev, Tags: e.target.value}))
            }
            value={dialogData.Tags}
          />
        </Flex>
      </Modal>
      <div
        className="col-lg-12 control-section"
        style={{height: `100%`, width: `100%`}}
      >
        <ScrollBar
          style={{
            height: childrenProps.autoHeight ? 'auto' : '100%',
            margin: '0px',
            padding: '0px',
          }}
          hideScrollbar={!childrenProps.scrollbars}
        >
          <LayoutContainer>
            <KanbanComponent
              id="kanban"
              cssClass="kanban-overview"
              keyField="Status"
              dataSource={data}
              // enableTooltip={true}
              // cardDoubleClick={OnCardDoubleClick}
              cardClick={(args: CardClickEventArgs) => args.event?.stopPropagation()}
              swimlaneSettings={{keyField: 'Assignee'}}
              actionComplete={handleDataChange}
              cardSettings={{
                headerField: 'Title',
                template: (data: Record<string, string>) => {
                  const cardIndex = dataMap[data.Id] || 0;
                  return cardTemplate({
                    data,
                    cardIndex,
                    childrenProps,
                    cardHeaderStyles: childrenProps.cardHeaderStyles,
                    cardContentStyles: childrenProps.cardContentStyles,
                    tagStyles: childrenProps.tagStyles,
                  });
                },
                selectionType: 'Multiple',
              }}
              dialogOpen={showModal}
              // dialogSettings={{ fields: fields }}
              cardRendered={(args: CardRenderedEventArgs) => {
                return cardRendered({
                  args,
                  cardContentStyles: childrenProps.cardContentStyles,
                })
              }}
            >
              <ColumnsDirective>
                <ColumnDirective
                  headerText="To Do"
                  keyField="Open"
                  allowToggle={true}
                  template={(data: Record<string, string>) => columnTemplate({
                    data,
                    boardStyles: childrenProps.boardStyles,
                  })}
                />
                <ColumnDirective
                  headerText="In Progress"
                  keyField="InProgress"
                  allowToggle={true}
                  template={(data: Record<string, string>) => columnTemplate({
                    data,
                    boardStyles: childrenProps.boardStyles,
                  })}
                />
                <ColumnDirective
                  headerText="In Review"
                  keyField="Review"
                  allowToggle={true}
                  template={(data: Record<string, string>) => columnTemplate({
                    data,
                    boardStyles: childrenProps.boardStyles,
                  })}
                />
                <ColumnDirective
                  headerText="Done"
                  keyField="Close"
                  allowToggle={true}
                  template={(data: Record<string, string>) => columnTemplate({
                    data,
                    boardStyles: childrenProps.boardStyles,
                  })}
                />
              </ColumnsDirective>
            </KanbanComponent>
          </LayoutContainer>
        </ScrollBar>
        <SlotConfigContext.Provider value={{ modalWidth: 600 }}>
          {childrenProps.cardView.expandModalView}
        </SlotConfigContext.Provider>
        {/* </Wrapper> */}
      </div>
    </div>
  );
}

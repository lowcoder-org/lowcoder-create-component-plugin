import {
  UICompBuilder,
  Section,
  withDefault,
  withExposingConfigs,
  eventHandlerControl,
  styleControl,
  AutoHeightControl,
  ScrollBar,
  BoolControl,
  styled,
  NameConfigHidden,
  NameConfig,
  MultiCompBuilder,
  StringControl,
  NumberControl,
  optionsControl,
} from "lowcoder-sdk";
import "./index.css";
import { extend, addClass, registerLicense } from "@syncfusion/ej2-base";
import "./material3.css";
import {  Modal, Input, Flex, Typography } from "antd";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  DialogFieldsModel,
  CardRenderedEventArgs,
  CardClickEventArgs,
} from "@syncfusion/ej2-react-kanban";
import * as dataSource from "./datasource.json";
import type { MenuProps } from "antd";
import { trans } from "./i18n/comps";
import { useState } from "react";
registerLicense(
  "ORg4AjUWIQA/Gnt2UFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5Vd0ViX3pfdXRRR2VY"
);

export const CardHeaderStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;
export const TagStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;
export const CompStyles = [
  {
    name: "margin",
    label: trans("style.margin"),
    margin: "margin",
  },
  {
    name: "padding",
    label: trans("style.padding"),
    padding: "padding",
  },
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },
  {
    name: "backgroundColor",
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",
  },
  {
    name: "border",
    label: trans("style.border"),
    border: "border",
  },
  {
    name: "radius",
    label: trans("style.borderRadius"),
    radius: "radius",
  },
  {
    name: "borderWidth",
    label: trans("style.borderWidth"),
    borderWidth: "borderWidth",
  },
  {
    name: "boxShadow",
    label: "boxShadow",
    boxShadow: "boxShadow",
  },
] as const;
export const BoardStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;
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
const Wrapper = styled.div<{}>`
  height: 100%;
  width: 100%;
  .e-card {
    background-color: red !important;
    font-size: 52px !important;
  }
`;
let GanttOption = new MultiCompBuilder(
  {
    label: StringControl,
    Title: StringControl,
    Status: StringControl,
    Summary: StringControl,
    Type: StringControl,
    Priority: StringControl,
    Tags: StringControl,
    Estimate: NumberControl,
    Assignee: StringControl,
    RankId: NumberControl,
    Id: StringControl,
  },
  (props: any) => props
).build();
type OptionPropertyParam = {
  label?: string;
  Title?: string;
  Status?: string;
  Summary?: string;
  Type?: string;
  Priority?: string;
  Tags?: string;
  Estimate?: number;
  Assignee?: string;
  RankId?: number;
  Id?: number;
};
interface OptionCompProperty {
  propertyView(param: OptionPropertyParam): React.ReactNode;
}
GanttOption = class extends GanttOption implements OptionCompProperty {
  propertyView(param: any) {
    return (
      <>
        {this.children.label.propertyView({
          label: "Label",
        })}
        {this.children.Title.propertyView({
          label: "Title",
        })}
        {this.children.Status.propertyView({
          label: "Status",
        })}
        {this.children.Summary.propertyView({
          label: "Summary",
        })}

        {this.children.Type.propertyView({
          label: "Type",
        })}

        {this.children.Priority.propertyView({
          label: "Priority",
        })}

        {this.children.Tags.propertyView({
          label: "Tags",
        })}

        {this.children.Estimate.propertyView({
          label: "Estimate",
        })}

        {this.children.Assignee.propertyView({
          label: "Assignee",
        })}

        {this.children.RankId.propertyView({
          label: "RankId",
        })}
      </>
    );
  }
};

export const GanttOptionControl = optionsControl(GanttOption, {
  initOptions: dataSource.cardData,
  uniqField: "Id",
});

const childrenMap = {
  autoHeight: withDefault(AutoHeightControl, "fixed"),
  cardHeaderStyles: styleControl(CardHeaderStyles),
  tagStyles: styleControl(TagStyles),
  boardStyles: styleControl(BoardStyles),
  data: GanttOptionControl,
  scrollbars: withDefault(BoolControl, false),
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "Triggers when Chart data changes",
    },
  ] as const),
  cardContentStyles: styleControl(CompStyles),
  // data: jsonValueExposingStateControl("data", dataSource.cardData),
};
let ContainerBaseComp = (function () {
  return new UICompBuilder(childrenMap, (props: any) => {
    let data: Object[] = extend(
      [],
      props.data as { [key: string]: Object },
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
    const cardRendered = (args: CardRenderedEventArgs): void => {
      let val: string = (args.data as { [key: string]: Object })
        .Priority as string;
      let cardElement = args.element as HTMLElement;
      cardElement.style.backgroundColor =
        props.cardContentStyles.backgroundColor;
      cardElement.style.borderRadius = props.cardContentStyles.radius;
      cardElement.style.borderWidth = props.cardContentStyles.borderWidth;
      cardElement.style.borderColor = props.cardContentStyles.border;
      cardElement.style.boxShadow = props.cardContentStyles.boxShadow;
      addClass([cardElement], val);
    };

    const columnTemplate = (data: { [key: string]: string }) => {
      return (
        <div className="header-template-wrap">
          <div className={"header-icon e-icons " + data.keyField}></div>
          <div
            className="header-text"
            style={{
              color: props.boardStyles.textColor,
              fontSize: props.boardStyles.textSize,
            }}
          >
            {data.headerText}
          </div>
        </div>
      );
    };

    const cardTemplate = (data: { [key: string]: string }) => {
      return (
        <Wrapper>
          <div
            className={"card-template"}
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
                  {data.Title}
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
                {data.Summary}
              </div>
            </div>
            <div className="e-card-custom-footer">
              {data.Tags.split(",").map((tag: string) => (
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
              <div className="e-card-avatar">{getString(data.Assignee)}</div>
            </div>
          </div>
        </Wrapper>
      );
    };
    const getString = (assignee: string): string => {
      return (assignee.match(/\b(\w)/g) as string[]).join("").toUpperCase();
    };
    const OnCardDoubleClick = (args: CardClickEventArgs): void => {
      setDialogData({
        ...(args.data as any),
        Status: getStatus(),
        Assignee: getAllSigneed(),
      });
      showModal();
    };
    const handleDataChange = () => {
      props.onEvent("change");
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    };
    const items: MenuProps["items"] = [
      {
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: "0",
      },
      {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: "1",
      },
      {
        type: "divider",
      },
      {
        label: "3rd menu item",
        key: "3",
      },
    ];
    return (
      <div
        className="schedule-control-section"
        style={{ height: `100%`, width: `100%` }}
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
              placeholder={"Title"}
              onChange={handleDataChange}
              defaultValue={dialogData["Title"]}
            />
            <Typography.Title level={5}>Status</Typography.Title>
            {/* <Dropdown menu={{ items }} trigger={["click"]} /> */}
            {/* <Typography.Title level={5}>Assignee</Typography.Title>
            <Dropdown menu={dialogData.Status as any} /> */}
            <Typography.Title level={5}>Summary</Typography.Title>
            <Input
              placeholder={"Summary"}
              onChange={handleDataChange}
              defaultValue={dialogData["Summary"]}
            />
            <Typography.Title level={5}>Tags</Typography.Title>
            <Input
              placeholder={"Tags"}
              onChange={handleDataChange}
              defaultValue={dialogData["Tags"]}
            />
          </Flex>
        </Modal>
        <div
          className="col-lg-12 control-section"
          style={{ height: `100%`, width: `100%` }}
        >
          <ScrollBar
            style={{
              height: props.autoHeight ? "auto" : "100%",
              margin: "0px",
              padding: "0px",
            }}
            hideScrollbar={!props.scrollbars}
          >
            <LayoutContainer>
              <KanbanComponent
                id="kanban"
                cssClass="kanban-overview"
                keyField="Status"
                dataSource={data}
                // enableTooltip={true}
                cardDoubleClick={OnCardDoubleClick}
                swimlaneSettings={{ keyField: "Assignee" }}
                actionComplete={handleDataChange}
                cardSettings={{
                  headerField: "Title",
                  template: cardTemplate,
                  selectionType: "Multiple",
                }}
                dialogOpen={showModal}
                // dialogSettings={{ fields: fields }}
                cardRendered={cardRendered}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    headerText="To Do"
                    keyField="Open"
                    allowToggle={true}
                    template={columnTemplate}
                  />
                  <ColumnDirective
                    headerText="In Progress"
                    keyField="InProgress"
                    allowToggle={true}
                    template={columnTemplate}
                  />
                  <ColumnDirective
                    headerText="In Review"
                    keyField="Review"
                    allowToggle={true}
                    template={columnTemplate}
                  />
                  <ColumnDirective
                    headerText="Done"
                    keyField="Close"
                    allowToggle={true}
                    template={columnTemplate}
                  />
                </ColumnsDirective>
              </KanbanComponent>
            </LayoutContainer>
          </ScrollBar>
          {/* </Wrapper> */}
        </div>
      </div>
    );
  })
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name="Basic">
            {children.data.propertyView({})}
            {/* {children.data.propertyView({ label: "Data" })} */}
          </Section>
          <Section name="Interaction">
            {children.onEvent.propertyView()}
          </Section>
          <Section name="Styles">
            {children.autoHeight.getPropertyView()}
            {!children.autoHeight.getView() &&
              children.scrollbars.propertyView({
                label: trans("prop.scrollbar"),
              })}
          </Section>
          <Section name="Card Header Styling">
            {children.cardHeaderStyles.getPropertyView()}
          </Section>
          <Section name="Card Styling">
            {children.cardContentStyles.getPropertyView()}
          </Section>
          <Section name="Tag Styles">
            {children.tagStyles.getPropertyView()}
          </Section>
          <Section name="Board Styles">
            {children.boardStyles.getPropertyView()}
          </Section>
        </>
      );
    })
    .build();
})();
ContainerBaseComp = class extends ContainerBaseComp {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

export default withExposingConfigs(ContainerBaseComp, [
  new NameConfig("data", trans("component.data")),
  NameConfigHidden,
]);

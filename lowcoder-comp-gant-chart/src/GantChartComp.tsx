import React, { useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import {
  deferAction,
  UICompBuilder,
  NameConfig,
  Section,
  withDefault,
  withExposingConfigs,
  withMethodExposing,
  eventHandlerControl,
  styleControl,
  AutoHeightControl,
  dropdownControl,
  NameConfigHidden,
  BoolControl,
  StringControl,
  MultiCompBuilder,
  NumberControl,
  optionsControl,
  BoolCodeControl,
  jsonControl,
  toJSONObjectArray,
} from "lowcoder-sdk";
import { i18nObjs, trans } from "./i18n/comps";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

export const CompStyles = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "barBackgroundColor", label: trans("style.barBackgroundColor"), barBackgroundColor: "barBackgroundColor" },
  { name: "barProgressColor", label: trans("style.barProgressColor"), barProgressColor: "barProgressColor" },
  { name: "arrowColor", label: trans("style.arrowColor"), arrowColor: "arrowColor" },
  { name: "radius", label: trans("style.barCornerRadius"), radius: "radius" },
] as const;

const getStartEndDateForProject = (tasks: Task[], projectId: string) => {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  if (projectTasks.length === 0) return [new Date(), new Date()];

  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (const task of projectTasks) {
    if (start > task.start) start = task.start;
    if (end < task.end) end = task.end;
  }
  return [start, end];
};

let GanttOption = new MultiCompBuilder(
  {
    name: StringControl,
    start: jsonControl((data: any) => new Date(data)),
    end: jsonControl((data: any) => new Date(data)),
    label: StringControl,
    id: StringControl,
    project: StringControl,
    progress: NumberControl,
    type: StringControl,
    hideChildren: BoolCodeControl,
    displayOrder: NumberControl,
    dependencies: jsonControl((data: any) => [data]),
  },
  (props: any) => props
).build();

type OptionPropertyParam = {
  start?: Date;
  end?: Date;
  name?: string;
  label?: string;
  id?: string;
  progress?: number;
  type?: string;
  hideChildren?: boolean;
  displayOrder?: number;
  dependencies?: string[];
};

interface OptionCompProperty {
  propertyView(param: OptionPropertyParam): React.ReactNode;
}

GanttOption = class extends GanttOption implements OptionCompProperty {
  propertyView(param: any) {
    return (
      <>
        {this.children.name.propertyView({ label: trans("component.name") })}
        {this.children.start.propertyView({ label: trans("component.start") })}
        {this.children.end.propertyView({ label: trans("component.end") })}
        {this.children.progress.propertyView({ label: trans("component.progress") })}
        {this.children.id.propertyView({ label: trans("component.id") })}
        {this.children.type.propertyView({ label: trans("component.type") })}
        {this.children.project.propertyView({ label: trans("component.project") })}
        {this.children.dependencies.propertyView({ label: trans("component.dependencies") })}
        {this.children.hideChildren.propertyView({ label: trans("component.hideChildren") })}
        {this.children.displayOrder.propertyView({ label: trans("component.displayOrder") })}
      </>
    );
  }
};

export const GanttOptionControl = optionsControl(GanttOption, {
  initOptions: i18nObjs.defaultTasks,
  uniqField: "name",
});

const viewModeOptions = [
  { label: "Hour", value: ViewMode.Hour },
  { label: "Quarter Day", value: ViewMode.QuarterDay },
  { label: "Half Day", value: ViewMode.HalfDay },
  { label: "Day", value: ViewMode.Day },
  { label: "Week", value: ViewMode.Week },
  { label: "Month", value: ViewMode.Month },
  { label: "Year", value: ViewMode.Year },
];

export enum DEP_TYPE {
  CONTRAST_TEXT = "contrastText",
  SELF = "toSelf",
}

function toSelf(color: string) {
  return color;
}

export const LegendStyle = [
  { name: "padding", label: trans("style.padding"), padding: "padding" },
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
] as const;

export const HeaderStyle = [
  { name: "padding", label: trans("style.padding"), padding: "padding" },
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
] as const;

let GantChartCompBase = (function () {
  const childrenMap = {
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    showHeaders: withDefault(BoolControl, true),
    data: GanttOptionControl,
    updatedData: jsonControl((data: any) => toJSONObjectArray(data)),
    legendStyle: styleControl(LegendStyle),
    headerStyle: styleControl(HeaderStyle),
    activeViewMode: dropdownControl(viewModeOptions, ViewMode.Day),
    onEvent: eventHandlerControl([
      { label: "Task Date Changed", value: "handleTaskDateChange", description: "Triggered when task date changes." },
      { label: "Task Clicked", value: "taskClick", description: "Triggered when a task is clicked." },
      { label: "Task Deleted", value: "handleTaskDelete", description: "Triggered when a task is deleted." },
      { label: "Task Progress Changed", value: "handleProgressChange", description: "Triggered when task progress changes." },
      { label: "Task Selected", value: "handleSelect", description: "Triggered when a task is selected." },
      { label: "Task Expandered", value: "handleExpanderClick", description: "" },
      { label: "Task Updated", value: "handleTaskUpdate", description: "" },
      { label: "Task Progress Changed", value: "onProgressChanged", description: "" },
      { label: "Task Selected", value: "onTaskSelected", description: "" },
      { label: "Task Expanded", value: "onTaskExpandClicked", description: "" },
    ]),
  };

  return new UICompBuilder(childrenMap, (props: {
    data: Task[];
    updatedData: any;
    autoHeight: boolean;
    styles: any;
    onEvent: any;
    showHeaders: boolean;
    activeViewMode: ViewMode;
  }, dispatch: any) => {
    const { activeViewMode } = props;
    const [tasks, setTasks] = useState<Task[]>(props.data ?? []);
    const [dimensions, setDimensions] = useState({ width: 480, height: 300 });
    const { width, height, ref: conRef } = useResizeDetector({
      onResize: () => {
        const container = conRef.current;
        if (!container || !width || !height) return;

        if (props.autoHeight) {
          setDimensions({ width, height: dimensions.height });
          return;
        }

        setDimensions({ width, height });
      },
    });    

    const handleTaskChange = (task: Task) => {
      let newTasks = tasks.map(t => (t.id === task.id ? task : t));
      if (task.project) {
        const [start, end] = getStartEndDateForProject(newTasks, task.project);
        const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
        if (
          project.start.getTime() !== start.getTime() ||
          project.end.getTime() !== end.getTime()
        ) {
          const changedProject = { ...project, start, end };
          newTasks = newTasks.map(t =>
            t.id === task.project ? changedProject : t
          );
        }
      }
      setTasks(newTasks);
      setTimeout(() => {
        props.updatedData.dispatchChangeValueAction(JSON.stringify(tasks, null, 2));
      }, 100);
      props.onEvent("handleTaskDateChange");
      return true;  // Confirm operation
    };

    const handleTaskDelete = (task: Task) => {
      const conf = window.confirm("Are you sure about " + task.name + " ?");
      if (conf) {
        const newTasks = tasks.filter(t => t.id !== task.id);
        setTasks(newTasks);
        props.onEvent("handleTaskDelete");
        return true;  // Confirm operation
      }
      return false;  // Undo operation if not confirmed
    };

    const handleProgressChange = async (task: Task) => {
      const newTasks = tasks.map(t => (t.id === task.id ? task : t));
      setTasks(newTasks);
      props.onEvent("handleProgressChange");
      return true;  // Confirm operation
    };

    const handleDblClick = (task: Task) => {
      props.onEvent("taskClick");
      return true;  // Confirm operation
    };

    const handleClick = (task: Task) => {
      props.onEvent("taskClick");
      return true;  // Confirm operation
    };

    const handleSelect = (task: Task, isSelected: boolean) => {
      props.onEvent("handleSelect");
      return true;  // Confirm operation
    };

    const handleExpanderClick = (task: Task) => {
      const newTasks = tasks.map(t => (t.id === task.id ? task : t));
      setTasks(newTasks);
      props.children.updatedData.dispatchChangeValueAction(JSON.stringify(newTasks, null, 2));
      props.onEvent("handleExpanderClick");
      return true;  // Confirm operation
    };

    return (
      <div className="Wrapper" ref={conRef}>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks}
            viewMode={activeViewMode}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            ganttHeight={props.autoHeight ? 0 : 300}
            headerHeight={30}
            columnWidth={65}
            fontSize={props.styles?.textSize}
            rowHeight={40}
            barCornerRadius={props.styles?.radius}
            barFill={50}
            fontFamily="Arial"
            locale="en"
            barBackgroundColor={props.styles?.barBackgroundColor}
            barBackgroundSelectedColor={props.styles?.barBackgroundSelectedColor}
            barProgressColor={props.styles?.barProgressColor}
            arrowColor={props.styles?.arrowColor}
            listCellWidth={props.showHeaders ? "155px" : ""}
          />
        ) : (
          <></>
        )}
      </div>
    );
  })
    .setPropertyViewFn((children: any) => (
      <>
        <Section name="Basic">
          {children.activeViewMode.propertyView({ label: "View Mode" })}
          {children.showHeaders.propertyView({ label: "Show Headers" })}
          {children.data.propertyView({ label: "Data" })}
        </Section>
        <Section name="Interaction">
          {children.onEvent.propertyView()}
        </Section>
        {children.showHeaders.getView() && (
          <Section name={"Header Style"}>{children.headerStyle.getPropertyView()}</Section>
        )}
        {children.showHeaders.getView() && (
          <Section name={"Legend Style"}>{children.legendStyle.getPropertyView()}</Section>
        )}
        <Section name="Styles">
          {children.autoHeight.getPropertyView()}
          {children.styles.getPropertyView()}
        </Section>
      </>
    ))
    .build();
})();

GantChartCompBase = class extends GantChartCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

GantChartCompBase = withMethodExposing(GantChartCompBase, [
  {
    method: {
      name: "setData",
      description: "Set Gantt Chart Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      const newTasks = JSON.parse(values[0]);
      comp.children.data.dispatchChangeValueAction(JSON.stringify(newTasks, null, 2));
    },
  },
  {
    method: {
      name: "getData",
      description: "Get Gantt Chart Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any) => {
      comp.children.updatedData.getView()
    },
  },
]);

export default withExposingConfigs(GantChartCompBase, [
  new NameConfig("data", trans("component.data")),
  new NameConfig("updatedData", trans("component.updatedData")),
  NameConfigHidden,
]);

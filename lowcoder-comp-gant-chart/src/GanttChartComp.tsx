import React, { useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import {
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
  jsonValueExposingStateControl,
  // useMergeCompStyles,
} from "lowcoder-sdk";
import { i18nObjs, trans } from "./i18n/comps";
import _ from 'lodash'

export enum DEP_TYPE {
  CONTRAST_TEXT = 'contrastText',
  SELF = 'toSelf',
}


export const CompStyles = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "barBackgroundColor", label: trans("style.barBackgroundColor"), tooltip: trans("style.barBackgroundColor"), barBackgroundColor: "barBackgroundColor" },
  { name: "barProgressColor", label: trans("style.barProgressColor"), tooltip: trans("style.barProgressColor"), barProgressColor: "barProgressColor" },
  { name: "arrowColor", label: trans("style.arrowColor"), arrowColor: "arrowColor" },
  { name: "radius", label: trans("style.barCornerRadius"), radius: "radius" },
  { name: "barFill", label: trans("style.barFill"), barFill: "barFill" },
  { name: "barProgressSelectedColor", label: trans("style.barProgressSelectedColor"), tooltip: trans("style.barProgressSelectedColor"), barProgressSelectedColor: "barProgressSelectedColor" },
  { name: "barBackgroundSelectedColor", label: trans("style.barBackgroundSelectedColor"), tooltip: trans("style.barBackgroundSelectedColor"), barBackgroundSelectedColor: "barBackgroundSelectedColor" },
  { name: "todayColor", label: trans("style.todayColor"), todayColor: "todayColor" },
] as const;

export const TaskListHeaderStyle = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
  { name: "padding", label: trans("style.padding"), padding: "padding" },
] as const;

export const TaskListTableStyle = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
  { name: "padding", label: trans("style.padding"), padding: "padding" },
] as const;

export const TooltipStyle = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
  { name: "padding", label: trans("style.padding"), padding: "padding" },
  { name: "borderColor", label: trans("style.borderColor"), border: "border" },
  { name: "borderWidth", label: trans("style.borderWidth"), borderWidth: "borderWidth" },
  { name: "radius", label: trans("style.barCornerRadius"), radius: "radius" },
] as const;

export const LegendStyle = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
  { name: "padding", label: trans("style.padding"), padding: "padding" },
] as const;

export const HeaderStyle = [
  { name: "textSize", label: trans("style.textSize"), textSize: "textSize" },
  { name: "fontFamily", label: trans("style.fontFamily"), fontFamily: "fontFamily" },
  { name: "textColor", label: trans("style.textColor"), textColor: "textColor", depType: DEP_TYPE.SELF, transformer: toSelf, color: "#000000" },
  { name: "headerBackground", label: trans("style.backgroundColor"), depName: "background", depType: DEP_TYPE.SELF, transformer: toSelf },
  { name: "padding", label: trans("style.padding"), padding: "padding" },
] as const;

const createHeaderLocal = (
  recordDisplayName: string,
  startDisplayName: string,
  endDisplayName: string,
  legendWidth: string,
  fontFamily: string,
  textSize: string,
  padding: string,
  headerBackground: string,
  textColor: string,
  showHeaders: boolean,
  showLegendTable: boolean,
): React.FunctionComponent<{
  headerHeight: number;
  rowWidth: string;
}> => {
    return ({ headerHeight }) => {
      if (showHeaders && showLegendTable) {
        return ( 
        <div
          className="Gantt-Table"
          style={{
            fontFamily: fontFamily,
            fontSize: textSize,
          }}
        >
          <div
            className="Gantt-Table_Header"
            style={{
              height: headerHeight - 2,
              backgroundColor: headerBackground,
              color: textColor,
              padding: padding,
              width: legendWidth,
              flexDirection: "row",
              display: "flex",
            }}
          >
            <div className="Gantt-Table_Header-Item Gantt-Header_Select__Icon" />
            <div
              className="Gantt-Table_Header-Separator"
              style={{
                height: headerHeight * 0.5,
                marginTop: headerHeight * 0.2,
              }}
            />
            <div
              className="Gantt-Table_Header-Item"
              style={{
                minWidth: "33%",
              }}
            >
              &nbsp;{recordDisplayName}
            </div>
            <div
              className="Gantt-Table_Header-Separator"
              style={{
                height: headerHeight * 0.5,
                marginTop: headerHeight * 0.2,
              }}
            />
            <div
              className="Gantt-Table_Header-Item"
              style={{
                minWidth: "33%",
              }}
            >
              &nbsp;{startDisplayName}
            </div>
            <div
              className="Gantt-Table_Header-Separator"
              style={{
                height: headerHeight * 0.5,
                marginTop: headerHeight * 0.25,
              }}
            />
            <div
              className="Gantt-Table_Header-Item"
              style={{
                minWidth: "33%",
              }}
            >
              &nbsp;{endDisplayName}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
};

const createTaskListLocal = (
  includeTime: boolean,
  onClick: (task: Task) => void,
  formatDateShort: (value: Date, includeTime?: boolean) => string,
  legendWidth: string,
  fontFamily: string,
  textSize: string,
  padding: string,
  headerBackground: string,
  textColor: string,
  showLegendTable: boolean,
): React.FunctionComponent<{
  rowHeight: number;
  rowWidth: string;
  locale: string;
  tasks: (Task&{title:string})[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> => {
  return ({
    rowHeight,
    tasks,
    locale,
    selectedTaskId,
    setSelectedTask,
    onExpanderClick,
  }) => {
    if (showLegendTable) {
      return (
        <div
          className="Gantt-Task-List_Wrapper"
          style={{
            fontFamily: fontFamily,
            fontSize: textSize,
            color: textColor,
            backgroundColor: headerBackground,
            padding: padding,
            width: legendWidth,
          }}
        >
          {tasks.map((t) => {
            let expanderSymbol = "";
            if (t.hideChildren === false) {
              expanderSymbol = "▼";
            } else if (t.hideChildren === true) {
              expanderSymbol = "▶";
            }
            return (
              <div
                className="Gantt-Task-List_Row"
                style={{ height: rowHeight, width: legendWidth, flexDirection: "row", display: "flex", overflow: "hidden"}}
                key={`${t.id}row`}
                onClick={() => {
                  if (selectedTaskId === t.id) {
                    setSelectedTask("");
                  } else {
                    setSelectedTask(t.id);
                  }
                }}
              >
                <div className="Gantt-Task-List_Cell">
                  <div
                    className={
                      selectedTaskId === t.id ? "Gantt-Task-List-Checkbox__Checked" : "Gantt-Task-List-Checkbox"
                    }
                  ></div>
                </div>
                <div
                  className="Gantt-Task-List_Cell"
                  style={{
                    width: "33%",
                    paddingTop: rowHeight * 0.3,
                  }}
                  title={t.title}
                >
                  <div className="Gantt-Task-List_Name-Container" style={{flexDirection: "row", display: "flex",}}>
                    <div
                      className={
                        expanderSymbol
                          ? "Gantt-Task-List_Cell__Expander"
                          : "Gantt-Task-List_Cell__Empty-Expander"
                      }
                      onClick={(e) => {
                        onExpanderClick(t);
                        e.stopPropagation();
                      }}
                    >
                      {expanderSymbol}
                    </div>
                    <div
                      className="Gantt-Task-List_Cell__Link"
                      style={{ 
                        overflow: "hidden",
                        textOverflow: "[..]",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => onClick(t)}
                    >
                      {t.title}
                    </div>
                  </div>
                </div>
                <div
                  className="Gantt-Task-List_Cell"
                  style={{
                    minWidth: "33%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    paddingTop: rowHeight * 0.3,
                  }}
                  title={formatDateShort(t.start, includeTime)}
                >
                  &nbsp;{formatDateShort(t.start, includeTime)}
                </div>
                <div
                  className="Gantt-Task-List_Cell"
                  style={{
                    minWidth: "33%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    paddingTop: rowHeight * 0.3,
                  }}
                  title={formatDateShort(t.end, includeTime)}
                >
                  &nbsp;{formatDateShort(t.end, includeTime)}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };
};

const createTooltip = (
  startDisplayName: string,
  endDisplayName: string,
  progressDisplayName: string,
  durationDisplayName: string,
  metricDisplayName: string,
  includeTime: boolean,
  formatDateShort: (value: Date, includeTime?: boolean) => string,
  fontFamily: string,
  textSize: string,
  padding: string,
  radius: string,
  headerBackground: string,
  textColor: string,
  borderWidth: string,
  borderColor: string,
): React.FunctionComponent<{
  task: Task&{title:string};
}> => {
  return ({ task }) => {
    const style = {
      fontSize: textSize,
      fontFamily: fontFamily,
      padding: padding,
      borderRadius: radius,
      backgroundColor: headerBackground || 'white',
      color: textColor || 'black',
      borderWidth: borderWidth,
      borderColor: borderColor,
      borderStyle: 'solid'
    };
    return (
      <div className={"Gantt-Tooltip_Container"} style={style}>
        <p
          className={"Gantt-Tooltip_Paragraph Gantt-Tooltip_Paragraph__Information"}
          style={{ fontSize: textSize }}
        >
          {task.title}
        </p>
        <p className={"Gantt-Tooltip_Paragraph"} style={{ fontSize: textSize }}>
          {`${startDisplayName}: ${formatDateShort(task.start, includeTime)}`}
        </p>
        <p className={"Gantt-Tooltip_Paragraph"} style={{ fontSize: textSize }}>
          {`${endDisplayName}: ${formatDateShort(task.end, includeTime)}`}
        </p>
        <p className={"Gantt-Tooltip_Paragraph"} style={{ fontSize: textSize }}>
          {`${durationDisplayName}: ${~~((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24))} ${metricDisplayName}`}
        </p>
        <p className={"Gantt-Tooltip_Paragraph"} style={{ fontSize: textSize }}>
          {!!task.progress && `${progressDisplayName}: ${task.progress} %`}
        </p>
      </div>
    );
  };
};

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

const filterTaskFields = (task: Task & { barChildren: Omit<OptionPropertyParam, 'label' | 'hideChildren'>[],title:string}) => ({
  id: task.id,
  title: task.title,
  type: task.type,
  start: task.start,
  end: task.end,
  progress: task.progress,
  displayOrder: task.displayOrder,
  dependencies: task.dependencies,
  barChildren: task.barChildren ? task.barChildren.map(child => ({
    id: child.id,
    title: child.title,
    type: child.type,
    start: child.start,
    end: child.end,
    progress: child.progress,
    displayOrder: child.displayOrder,
    dependencies: child.dependencies,
  })) : [],
});

let GanttOption = new MultiCompBuilder(
  {
    title: StringControl,
    start: jsonControl((data: any) => data ? new Date(data) : new Date()),
    end: jsonControl((data: any) =>  data ? new Date(data) : new Date()),
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
  title?: string;
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
        {this.children.title.propertyView({ label: trans("component.name") })}
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
  uniqField: "id",
});

const viewModeOptions = [
  { label: trans("viewModes.hour"), value: ViewMode.Hour },
  { label: trans("viewModes.quarterDay"), value: ViewMode.QuarterDay },
  { label: trans("viewModes.halfDay"), value: ViewMode.HalfDay },
  { label: trans("viewModes.day"), value: ViewMode.Day },
  { label: trans("viewModes.week"), value: ViewMode.Week },
  { label: trans("viewModes.month"), value: ViewMode.Month },
  { label: trans("viewModes.year"), value: ViewMode.Year },
];

function toSelf(color: string) {
  return color;
}

let GanttChartCompBase = (function () {
  const childrenMap = {
    styles: styleControl(CompStyles, 'styles'),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    showHeaders: withDefault(BoolControl, true),
    showLegendTable: withDefault(BoolControl, true),
    data: GanttOptionControl,
    ganttTasks: jsonValueExposingStateControl("ganttTasks", []),
    legendHeaderStyle: styleControl(TaskListHeaderStyle),
    legendStyle: styleControl(TaskListTableStyle),
    tooltipStyle: styleControl(TooltipStyle),
    ganttChartStyle: styleControl(CompStyles, 'ganttChartStyle'),
    activeViewMode: dropdownControl(viewModeOptions, ViewMode.Day),
    legendWidth: withDefault(StringControl, "300px"),
    headerHeight: withDefault(NumberControl, 30),
    columnWidth: withDefault(NumberControl, 65),
    listCellWidth: withDefault(StringControl, "80px"),
    rowHeight: withDefault(NumberControl, 40),
    handleWidth: withDefault(NumberControl, 10),
    arrowIndent: withDefault(NumberControl, 20),
    onEvent: eventHandlerControl([
      { label: trans("events.handleTaskDateChangeLabel"), value: "handleTaskDateChange", description: trans("events.handleTaskDateChangeDesc") },
      { label: trans("events.taskClickLabel"), value: "taskClick", description: trans("events.taskClickDesc") },
      { label: trans("events.handleTaskDeleteLabel"), value: "handleTaskDelete", description: trans("events.handleTaskDeleteDesc") },
      { label: trans("events.handleProgressChangeLabel"), value: "handleProgressChange", description: trans("events.handleProgressChangeDesc") },
      { label: trans("events.handleSelectLabel"), value: "handleSelect", description: trans("events.handleSelectDesc") },
      { label: trans("events.handleTaskUpdateLabel"), value: "handleTaskUpdate", description: trans("events.handleTaskUpdateDesc") },
    ]),
  };

  return new UICompBuilder(childrenMap, (props: {
    data: Task[];
    ganttTasks: any;
    autoHeight: boolean;
    styles: any;
    onEvent: any;
    showHeaders: boolean;
    showLegendTable: boolean;
    activeViewMode: ViewMode;
    legendWidth: string;
    legendHeaderStyle: any;
    legendStyle: any;
    tooltipStyle: any;
    ganttChartStyle: any;
    headerHeight: number;
    columnWidth: number;
    listCellWidth: string;
    rowHeight: number;
    handleWidth: number;
    arrowIndent: number;
  }, dispatch: any) => {
    const { activeViewMode } = props;
    const [tasks, setTasks] = useState<Task[]>(props.data ?? []);
    const [dimensions, setDimensions] = useState({ width: 480, height: 300 });
    const [updatedGanttTasks, setUpdatedGanttTasks] = useState<Task[]>([]);
    // useMergeCompStyles(props as Record<string, any>, dispatch);

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

    useEffect(() => {
      if (tasks.length === 0) {
        if (props.data.length > 0) {
          setTasks(props.data);
        }
      } else if (!_.isEqual(props.data, tasks)) {
        setTasks(props.data)
      }
    }, [props.data])

    useEffect(() => {
      props.ganttTasks.onChange(updatedGanttTasks);
    }, [updatedGanttTasks]);

    const updateGanttTasks = (newTasks: Task[], taskId: string) => {
      const filteredTasks = newTasks.map(filterTaskFields);
      filteredTasks.currentChagedTask = taskId;
      setUpdatedGanttTasks(filteredTasks);
      props.onEvent("handleTaskUpdate");
    };

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
      updateGanttTasks(newTasks, task.id);
      props.onEvent("handleTaskDateChange");
      return true;  // Confirm operation
    };

    const handleTaskDelete = (task: Task) => {
      const conf = window.confirm("Are you sure about " + task.title + " ?");
      if (conf) {
        const newTasks = tasks.filter(t => t.id !== task.id);
        setTasks(newTasks);
        updateGanttTasks(newTasks, task.id);
        props.onEvent("handleTaskDelete");
        return true;  // Confirm operation
      }
      return false;  // Undo operation if not confirmed
    };

    const handleProgressChange = async (task: Task) => {
      const newTasks = tasks.map(t => (t.id === task.id ? task : t));
      setTasks(newTasks);
      updateGanttTasks(newTasks, task.id);
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
      updateGanttTasks(newTasks, task.id);
      return true;  // Confirm operation
    };

    return (
      <div className="Wrapper" ref={conRef}>
        {tasks.length > 0 ? (
          <Gantt
            tasks={tasks.map(task=>({...task,name:task.title}))}
            viewMode={activeViewMode}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            ganttHeight={props.autoHeight ? 0 : 300}
            headerHeight={props.showHeaders ? props.headerHeight : 0} 
            columnWidth={props.columnWidth} // Individual field
            listCellWidth={props.showLegendTable ? `calc(100% - ${props.legendWidth})` : "100%"} // Individual field
            rowHeight={props.rowHeight} // Individual field
            barFill={props.ganttChartStyle?.barFill}
            handleWidth={props.handleWidth} // Individual field
            fontFamily={props.ganttChartStyle?.fontFamily}
            fontSize={props.ganttChartStyle?.textSize}
            barCornerRadius={props.ganttChartStyle?.radius}
            barProgressColor={props.ganttChartStyle?.barProgressColor}
            barProgressSelectedColor={props.ganttChartStyle?.barProgressSelectedColor}
            barBackgroundColor={props.ganttChartStyle?.barBackgroundColor}
            barBackgroundSelectedColor={props.ganttChartStyle?.barBackgroundSelectedColor}
            arrowColor={props.ganttChartStyle?.arrowColor}
            arrowIndent={props.arrowIndent} // Individual field
            todayColor={props.ganttChartStyle?.todayColor}
            TaskListHeader={createHeaderLocal(
              trans("component.name"),
              trans("component.start"),
              trans("component.end"),
              props.legendWidth, props.legendHeaderStyle?.fontFamily, props.legendHeaderStyle?.textSize, props.legendHeaderStyle?.padding, props.legendHeaderStyle?.headerBackground, props.legendHeaderStyle?.textColor, props.showLegendTable, props.showHeaders)}
            TaskListTable={createTaskListLocal(false, handleClick, (date) => date.toLocaleDateString(), props.legendWidth, props.legendStyle?.fontFamily, props.legendStyle?.textSize, props.legendStyle?.padding, props.legendStyle?.headerBackground, props.legendStyle?.textColor, props.showLegendTable)}
            TooltipContent={createTooltip(
              trans("component.startDate"),
              trans("component.endDate"),
              trans("component.progress"),
              trans("component.duration"),
              trans("component.days"),
              false, (date) => date.toLocaleDateString(), props.tooltipStyle?.fontFamily, props.tooltipStyle?.textSize, props.tooltipStyle?.padding, props.tooltipStyle?.radius, props.tooltipStyle?.headerBackground, props.tooltipStyle?.textColor, props.tooltipStyle?.borderWidth, props.tooltipStyle?.borderColor)}
        />
        ) : (
          <></>
        )}
      </div>
    );
  })
    .setPropertyViewFn((children: any) => (
      <>
        <Section name={trans("sections.basic")}>
  
          {children.data.propertyView({ label: trans("sections.data") })}
        </Section>

        <Section name={trans("sections.interaction")}>
          {children.onEvent.propertyView()}
          {children.activeViewMode.propertyView({ label: trans("sections.viewMode") })}
        </Section>

        <Section name={trans("sections.layout")}>
          {children.showHeaders.propertyView({ label: trans("sections.showHeaders") })}
          {children.showHeaders.getView() && (
            children.showLegendTable.propertyView({ label: trans("sections.showLegendTable") })
          )}
          {children.legendWidth.propertyView({ label: trans("sections.legendWidth") })}
          {children.headerHeight.propertyView({ label: trans("sections.headerHeight") })}
          {children.columnWidth.propertyView({ label: trans("sections.columnWidth") })}
          {children.listCellWidth.propertyView({ label: trans("sections.listCellWidth") })}
          {children.rowHeight.propertyView({ label: trans("sections.rowHeight") })}
          {children.handleWidth.propertyView({ label: trans("sections.handleWidth") })}
          {children.arrowIndent.propertyView({ label: trans("sections.arrowIndent") })}
        </Section>

        {children.showHeaders.getView() && (
          <Section name={trans("sections.legendHeaderStyle")}>
            {children.legendHeaderStyle.getPropertyView()}
          </Section>
        )}

        {children.showHeaders.getView() && (
          <Section name={trans("sections.legendStyle")}>
            {children.legendStyle.getPropertyView()}
          </Section>
        )}

        <Section name={trans("sections.tooltipStyle")}>
          {children.tooltipStyle.getPropertyView()}
        </Section>

        <Section name={trans("sections.styles")}>
          {children.autoHeight.getPropertyView()}
          {children.ganttChartStyle.getPropertyView()}
        </Section>

      </>
    ))
    .build();
})();

GanttChartCompBase = class extends GanttChartCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

GanttChartCompBase = withMethodExposing(GanttChartCompBase, [
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
      const newTasks = values[0];
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

export default withExposingConfigs(GanttChartCompBase, [
  new NameConfig("data", trans("component.data")),
  new NameConfig("ganttTasks", trans("component.data")),
  NameConfigHidden,
]);

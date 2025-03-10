import {
  NameConfig,
  withDefault,
  withExposingConfigs,
  StringControl,
  Section,
  sectionNames,
  styleControl,
  AutoHeightControl,
  InnerGrid,
  gridItemCompToGridItems,
  withMethodExposing,
  HintPlaceHolder,
  ContainerCompBuilder,
  NameConfigHidden,
  hiddenPropertyView,
  EditorContext,
  SliderControl,
} from "lowcoder-sdk";
import { trans } from "./i18n/comps";

const DEFAULT_SIZE = 378;
const DEFAULT_PADDING = 16;

export const CompStyles = [
  {	
    name: "background",	
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",	
  },
];

let childrenMap: any = {
  appId: StringControl,
  style: styleControl(CompStyles),
  autoHeight: withDefault(AutoHeightControl, "auto"),
};
if (SliderControl) {
  childrenMap = {
    ...childrenMap,
    horizontalGridCells: SliderControl,
    verticalGridCells: SliderControl,
  }
}

let BasicInnerGridComp = (function () {
  return new ContainerCompBuilder(
    childrenMap,
    (props: any, dispatch: any) => {
      const { items, ...otherContainerProps } = props.container;

      return (
        <EditorContext.Consumer>
          {(editorState: any) => {
            return (
              <InnerGrid
                {...otherContainerProps}
                items={gridItemCompToGridItems(items)}
                autoHeight={props.autoHeight}
                style={{
                  ...props.style,
                  height: '100%',
                }}
                containerPadding={[DEFAULT_PADDING, DEFAULT_PADDING]}
                hintPlaceholder={HintPlaceHolder}
                emptyRows={props?.verticalGridCells}
                horizontalGridCells={props?.horizontalGridCells}
                minHeight={DEFAULT_SIZE}
              />
              )
            }}
        </EditorContext.Consumer>
      );
    }
  )
    .setPropertyViewFn((children: any) => (
      <>
        <Section name={sectionNames.basic}>
          {children.appId.propertyView({
            label: trans("component.appId"),
          })}
        </Section>
        <Section name={sectionNames.interaction}>
          {hiddenPropertyView(children)}
        </Section>
        <Section name={sectionNames.layout}>
          {children.autoHeight.getPropertyView()}
          {children.horizontalGridCells && children.horizontalGridCells.propertyView({
            label: trans('component.horizontalGridCells'),
          })}
          {children.verticalGridCells && children.verticalGridCells.propertyView({
            label: trans('component.verticalGridCells'),
          })}
        </Section>
        <Section name={sectionNames.style}>
          {children.style.getPropertyView()}
        </Section>
      </>
    ))
    .build();
})();

BasicInnerGridComp = class extends BasicInnerGridComp {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

BasicInnerGridComp = withMethodExposing(BasicInnerGridComp, [
  // {
  //   method: {
  //     name: "methodName",
  //     params: [],
  //   },
  //   execute: (comp: any, values: any) => {
  //     // method functionality
  //   },
  // }
]);

BasicInnerGridComp = withExposingConfigs(BasicInnerGridComp, [
  new NameConfig("appId", trans("component.appId")),
  NameConfigHidden,
]);

export { BasicInnerGridComp };
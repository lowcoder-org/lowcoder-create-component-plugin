// @ts-nocheck
import {
  AutoHeightControl,
  BoolControl,
  BackgroundColorContext,
  ContainerStyle,
  IContainer,
  NameConfigHidden,
  NameGenerator,
  NumberControl,
  Section,
  SimpleContainerComp,
  UICompBuilder,
  sameTypeMap,
  styleControl,
  withDefault,
  withExposingConfigs,
} from "lowcoder-sdk";
import { JSONValue } from "lowcoder-sdk";
import { useContext } from "react";
import { DropZone } from "./components/DropZone";
import { LayoutFrame, Region } from "./components/LayoutFrame";
import { trans } from "./i18n/comps";
import {
  findContainer,
  getCompTree,
  getPasteValue,
  realSimpleContainer,
} from "./templateContainer";

const childrenMap = {
  headerHeight: withDefault(NumberControl, 72),
  sidebarWidth: withDefault(NumberControl, 260),
  horizontalGridCells: withDefault(NumberControl, 24),
  autoHeight: AutoHeightControl,
  showScrollbars: withDefault(BoolControl, false),
  style: styleControl(ContainerStyle),
  containers: withDefault(sameTypeMap(SimpleContainerComp), {
    header: { layout: {}, items: {} },
    sidebar: { layout: {}, items: {} },
    content: { layout: {}, items: {} },
  }),
};

const AppShellLayoutView = (props: any) => {
  const background = useContext(BackgroundColorContext);
  return (
    <BackgroundColorContext.Provider value={props.style?.background || background}>
      <LayoutFrame styleConfig={props.style} autoHeight={props.autoHeight}>
        <Region height={props.headerHeight} minHeight={64} border="bottom" overflow="visible">
          <DropZone
            containers={props.containers}
            dispatch={props.dispatch}
            zoneId="header"
            autoHeight
            horizontalGridCells={props.horizontalGridCells}
            emptyRows={5}
            minHeight="64px"
            containerPadding={[0, 0]}
            hint={trans("hints.header")}
            showName={{ bottom: 12 }}
          />
        </Region>
        <div style={{ display: "flex", flex: 1, minHeight: props.autoHeight ? 220 : undefined }}>
          <Region width={props.sidebarWidth} minWidth={180} border="right">
            <DropZone
              containers={props.containers}
              dispatch={props.dispatch}
              zoneId="sidebar"
              autoHeight
              horizontalGridCells={12}
              emptyRows={30}
              minHeight="360px"
              containerPadding={[0, 0]}
              hint={trans("hints.sidebar")}
            />
          </Region>
          <Region flex={1} minHeight={props.autoHeight ? 220 : undefined}>
            <DropZone
              containers={props.containers}
              dispatch={props.dispatch}
              zoneId="content"
              autoHeight={props.autoHeight}
              showScrollbar={props.showScrollbars}
              horizontalGridCells={props.horizontalGridCells}
              emptyRows={20}
              minHeight="260px"
              containerPadding={[0, 0]}
              hint={trans("hints.content")}
            />
          </Region>
        </div>
      </LayoutFrame>
    </BackgroundColorContext.Provider>
  );
};

const AppShellLayoutBase = new UICompBuilder(childrenMap, (props, dispatch) => {
  return <AppShellLayoutView {...props} dispatch={dispatch} />;
})
  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name={trans("sections.layout")}>
          {children.headerHeight.propertyView({ label: trans("props.headerHeight") })}
          {children.sidebarWidth.propertyView({ label: trans("props.sidebarWidth") })}
          {children.horizontalGridCells.propertyView({ label: trans("props.horizontalGridCells") })}
          {children.autoHeight.getPropertyView()}
          {!children.autoHeight.getView() &&
            children.showScrollbars.propertyView({ label: trans("props.showScrollbars") })}
        </Section>
        <Section name={trans("sections.style")}>{children.style.getPropertyView()}</Section>
      </>
    );
  })
  .build();

class AppShellLayoutImplComp extends AppShellLayoutBase implements IContainer {
  realSimpleContainer(key?: string): SimpleContainerComp | undefined {
    return realSimpleContainer(this.children.containers.children, "content", key);
  }

  getCompTree() {
    return getCompTree(this.children.containers.getView());
  }

  findContainer(key: string) {
    return findContainer(this, this.children.containers.getView(), key);
  }

  getPasteValue(nameGenerator: NameGenerator): JSONValue {
    return getPasteValue(this.toJsonValue(), this.children.containers.getView(), nameGenerator);
  }

  override autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
}

export default withExposingConfigs(AppShellLayoutImplComp, [NameConfigHidden]);

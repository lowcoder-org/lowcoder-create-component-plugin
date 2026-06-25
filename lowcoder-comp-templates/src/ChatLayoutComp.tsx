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
  sidebarWidth: withDefault(NumberControl, 300),
  composerHeight: withDefault(NumberControl, 96),
  horizontalGridCells: withDefault(NumberControl, 24),
  autoHeight: AutoHeightControl,
  showScrollbars: withDefault(BoolControl, false),
  style: styleControl(ContainerStyle),
  containers: withDefault(sameTypeMap(SimpleContainerComp), {
    sidebar: { layout: {}, items: {} },
    messages: { layout: {}, items: {} },
    composer: { layout: {}, items: {} },
  }),
};

const ChatLayoutView = (props: any) => {
  const background = useContext(BackgroundColorContext);
  return (
    <BackgroundColorContext.Provider value={props.style?.background || background}>
      <LayoutFrame styleConfig={props.style} autoHeight={props.autoHeight} direction="row">
        <Region width={props.sidebarWidth} minWidth={200} border="right">
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
        <div style={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}>
          <Region flex={1} minHeight={props.autoHeight ? 240 : undefined}>
            <DropZone
              containers={props.containers}
              dispatch={props.dispatch}
              zoneId="messages"
              autoHeight={props.autoHeight}
              showScrollbar={props.showScrollbars}
              horizontalGridCells={props.horizontalGridCells}
              emptyRows={22}
              minHeight="280px"
              containerPadding={[0, 0]}
              hint={trans("hints.messages")}
            />
          </Region>
          <Region height={props.composerHeight} minHeight={88} border="top" overflow="visible">
            <DropZone
              containers={props.containers}
              dispatch={props.dispatch}
              zoneId="composer"
              autoHeight
              horizontalGridCells={props.horizontalGridCells}
              emptyRows={8}
              minHeight="88px"
              containerPadding={[0, 0]}
              hint={trans("hints.composer")}
              showName={{ top: 12 }}
            />
          </Region>
        </div>
      </LayoutFrame>
    </BackgroundColorContext.Provider>
  );
};

const ChatLayoutBase = new UICompBuilder(childrenMap, (props, dispatch) => {
  return <ChatLayoutView {...props} dispatch={dispatch} />;
})
  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name={trans("sections.layout")}>
          {children.sidebarWidth.propertyView({ label: trans("props.sidebarWidth") })}
          {children.composerHeight.propertyView({ label: trans("props.composerHeight") })}
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

class ChatLayoutImplComp extends ChatLayoutBase implements IContainer {
  realSimpleContainer(key?: string): SimpleContainerComp | undefined {
    return realSimpleContainer(this.children.containers.children, "messages", key);
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

export default withExposingConfigs(ChatLayoutImplComp, [NameConfigHidden]);

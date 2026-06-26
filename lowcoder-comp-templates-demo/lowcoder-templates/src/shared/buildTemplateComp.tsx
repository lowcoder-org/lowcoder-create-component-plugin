import {
  AutoHeightControl,
  IContainer,
  NameConfigHidden,
  NameGenerator,
  SimpleContainerComp,
  sameTypeMap,
  UICompBuilder,
  withDefault,
  withExposingConfigs,
} from "lowcoder-sdk";
import type { JSONValue } from "lowcoder-sdk";
import { ReactNode } from "react";
import { findContainer, getCompTree, getPasteValue, realSimpleContainer } from "./containerUtils";

export type TemplateViewProps = {
  autoHeight: boolean;
  containers: Record<string, any>;
  dispatch: any;
};

export function buildTemplateComp(
  View: (props: TemplateViewProps) => ReactNode,
  defaultContainers: Record<string, { layout: {}; items: {} }>,
  primaryZone: string
) {
  const childrenMap = {
    autoHeight: withDefault(AutoHeightControl, "auto"),
    containers: withDefault(sameTypeMap(SimpleContainerComp), defaultContainers),
  };

  const Base = new UICompBuilder(childrenMap, (props, dispatch) => (
    <View {...props} dispatch={dispatch} />
  ))
    .setPropertyViewFn(() => null)
    .build();

  class Impl extends Base implements IContainer {
    realSimpleContainer(key?: string) {
      return realSimpleContainer(this.children.containers.children, primaryZone, key);
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

  return withExposingConfigs(Impl, [NameConfigHidden]);
}

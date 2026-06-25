// @ts-nocheck
import {
  CompTree,
  IContainer,
  mergeCompTrees,
  NameGenerator,
  SimpleContainerComp,
} from "lowcoder-sdk";
import { JSONValue } from "lowcoder-sdk";

export function realSimpleContainer(
  containers: Record<string, SimpleContainerComp>,
  primaryZone: string,
  key?: string
): SimpleContainerComp | undefined {
  if (key == null) {
    return containers[primaryZone] ?? Object.values(containers)[0];
  }
  return Object.values(containers).find((container) => container.realSimpleContainer(key));
}

export function getCompTree(containers: Record<string, IContainer>): CompTree {
  return mergeCompTrees(Object.values(containers).map((container) => container.getCompTree()));
}

export function findContainer(
  owner: IContainer,
  containers: Record<string, IContainer>,
  key: string
): IContainer | undefined {
  for (const container of Object.values(containers)) {
    const foundContainer = container.findContainer(key);
    if (foundContainer) {
      return foundContainer === container ? owner : foundContainer;
    }
  }
  return undefined;
}

export function getPasteValue(
  jsonValue: JSONValue,
  containers: Record<string, IContainer>,
  nameGenerator: NameGenerator
): JSONValue {
  const containerPasteValueMap: Record<string, JSONValue> = {};
  Object.keys(containers).forEach((key) => {
    containerPasteValueMap[key] = containers[key].getPasteValue(nameGenerator);
  });
  return { ...(jsonValue as Record<string, JSONValue>), containers: containerPasteValueMap };
}

import {
  withExposingConfigs,
  NameConfigHidden,
  NameConfig,
  IContainer,
  NameGenerator,
  withViewFn,
  withPropertyViewFn,
  withMethodExposing,
  CompAction,
  CompDepsConfig,
} from 'lowcoder-sdk';
import { trans } from "./i18n/comps";
import { KanbanInitComp } from './kanbanTypes';
import { KanbanPropertyView } from './kanbanPropertyView';
import { KanbanCompView } from './kanbanCompView';
import * as datasource from './datasource.json';

type IContainer = typeof IContainer;
type NameGenerator = typeof NameGenerator;
type CompAction = typeof CompAction;

export class KanbanImplComp extends KanbanInitComp implements IContainer {
  private getSlotContainer() {
    return this.children.cardView?.children?.cardView?.getSelectedComp()?.getComp()?.children?.container;
  }

  findContainer(key: string) {
    return this.getSlotContainer()?.findContainer(key);
  }

  getCompTree() {
    return this.getSlotContainer()?.getCompTree();
  }

  getPasteValue(nameGenerator: NameGenerator) {
    return {
      ...this.toJsonValue(),
      cardView: this.children.cardView.getPasteValue(nameGenerator),
    };
  }

  realSimpleContainer(key?: string) {
    return this.getSlotContainer().realSimpleContainer(key);
  }

  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }

  override reduce(action: CompAction): this {
    let comp = super.reduce(action);
    const params = comp.children.cardView.children.cardView.getCachedParams('0');
    if (!Boolean(params)) {
      comp = comp.setChild(
        "cardView",
        comp.children.cardView.reduce(
          comp.children.cardView.setSelectionAction('0', params)
        )
      );
    }
    return comp;
  }
}

const KanbanRenderComp = withViewFn(KanbanImplComp, (comp: KanbanImplComp) => <KanbanCompView comp={comp} />);
let KanbanPropertyComp = withPropertyViewFn(KanbanRenderComp, (comp: KanbanImplComp) => {
  return <KanbanPropertyView comp={comp} />;
});

KanbanPropertyComp = withMethodExposing(KanbanPropertyComp, [
  {
    method: {
      name: "setData",
      description: "Set Kanban Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      const data = values;
      comp.children?.data.children.manual.children.manual.dispatch(
        comp.children?.data.children.manual.children.manual.setChildrensAction(
          data
        )
      );
      comp.children?.data.children.mapData.children.data.dispatchChangeValueAction(
        JSON.stringify(data)
      );
    },
  },
  {
    method: {
      name: "getData",
      description: "Get Kanban Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any) => {
      comp.children.data.getView()
    },
  },
  {
    method: {
      name: "resetData",
      description: "Reset Kanban Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any) => {
      comp.children?.data.children.manual.children.manual.dispatch(
        comp.children?.data.children.manual.children.manual.setChildrensAction(
          datasource.cardData
        )
      );
      comp.children?.data.children.mapData.children.data.dispatchChangeValueAction(
        JSON.stringify([])
      );
    },
  },
  {
    method: {
      name: "clearInsertedItems",
      description: "Clear Inserted Items",
      params: [],
    },
    execute: (comp: any) => {
      comp.children?.insertedItems.dispatch(
        comp.children?.insertedItems.changeValueAction([])
      );
    },
  },
  {
    method: {
      name: "clearUpdatedItems",
      description: "Clear Updated Items",
      params: [],
    },
    execute: (comp: any) => {
      comp.children?.updatedItems.dispatch(
        comp.children?.updatedItems.changeValueAction([])
      );
    },
  },
  {
    method: {
      name: "clearDeletedItems",
      description: "Clear Deleted Items",
      params: [],
    },
    execute: (comp: any) => {
      comp.children?.deletedItems.dispatch(
        comp.children?.deletedItems.changeValueAction([])
      );
    },
  },
]);

export default withExposingConfigs(KanbanPropertyComp, [
  new NameConfig("data", trans("component.data")),
  NameConfigHidden,
  new CompDepsConfig(
    "activeCardIndex",
    (comp) => {
      return {
        activeCardIndex: comp.children.activeCardIndex.node(),
      };
    },
    (input) => {
      return input.activeCardIndex;
    },
  ),
  new CompDepsConfig(
    "activeCardData",
    (comp) => {
      return {
        activeCardData: comp.children.activeCardData.node(),
      };
    },
    (input) => {
      return input.activeCardData;
    },
  ),
  new CompDepsConfig(
    "initialData",
    (comp) => {
      return {
        initialData: comp.children.initialData.node(),
      };
    },
    (input) => {
      return input.initialData;
    },
  ),
  new CompDepsConfig(
    "toUpdatedItems",
    (comp) => {
      return {
        updatedItems: comp.children.updatedItems.node(),
      };
    },
    (input) => {
      return input.updatedItems;
    },
  ),
  new CompDepsConfig(
    "toInsertedItems",
    (comp) => {
      return {
        insertedItems: comp.children.insertedItems.node(),
      };
    },
    (input) => {
      return input.insertedItems;
    },
  ),
  new CompDepsConfig(
    "toDeletedItems",
    (comp) => {
      return {
        deletedItems: comp.children.deletedItems.node(),
      };
    },
    (input) => {
      return input.deletedItems;
    },
  ),
]);

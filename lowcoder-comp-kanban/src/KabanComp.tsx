import {
  withExposingConfigs,
  NameConfigHidden,
  NameConfig,
  IContainer,
  NameGenerator,
  withViewFn,
  withPropertyViewFn,
  withMethodExposing,
} from 'lowcoder-sdk';
import { trans } from "./i18n/comps";
import { KanbanInitComp } from './kanbanTypes';
import { KanbanPropertyView } from './kanbanPropertyView';
import { KanbanCompView } from './kanbanCompView';
import * as datasource from './datasource.json';

type IContainer = typeof IContainer;
type NameGenerator = typeof NameGenerator;

export class KanbanImplComp extends KanbanInitComp implements IContainer {
  private getSlotContainer() {
    return this.children.cardView.children.cardView.getSelectedComp().getComp().children.container;
  }

  findContainer(key: string) {
    return this.getSlotContainer().findContainer(key);
  }

  getCompTree() {
    return this.getSlotContainer().getCompTree();
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

]);

export default withExposingConfigs(KanbanPropertyComp, [
  new NameConfig("data", trans("component.data")),
  NameConfigHidden,
]);

import {
  withExposingConfigs,
  NameConfigHidden,
  NameConfig,
  IContainer,
  NameGenerator,
  withViewFn,
  withPropertyViewFn,
} from 'lowcoder-sdk';
import { trans } from "./i18n/comps";
import { KanbanInitComp } from './kanbanTypes';
import { KanbanPropertyView } from './kanbanPropertyView';
import { KanbanCompView } from './kanbanCompView';

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
const KanbanPropertyComp = withPropertyViewFn(KanbanRenderComp, (comp: KanbanImplComp) => {
  return <KanbanPropertyView comp={comp} />;
});

export default withExposingConfigs(KanbanPropertyComp, [
  new NameConfig("data", trans("component.data")),
  NameConfigHidden,
]);

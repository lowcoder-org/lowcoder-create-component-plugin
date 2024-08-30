import {
  UICompBuilder,
  withDefault,
  eventHandlerControl,
  styleControl,
  AutoHeightControl,
  BoolControl,
  uiChildren,
  RecordConstructorToComp,
  RecordConstructorToView,
} from 'lowcoder-sdk';
import { trans } from "./i18n/comps";
import { KanbanOptionControl } from './kanbanOptionsControl';
import { CardViewControl } from './cardViewControl';

type RecordConstructorToComp<T> = typeof RecordConstructorToComp;
type RecordConstructorToView<T> = typeof RecordConstructorToView;

export const CardHeaderStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;

export const TagStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;

export const CompStyles = [
  {
    name: "margin",
    label: trans("style.margin"),
    margin: "margin",
  },
  {
    name: "padding",
    label: trans("style.padding"),
    padding: "padding",
  },
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },
  {
    name: "backgroundColor",
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",
  },
  {
    name: "border",
    label: trans("style.border"),
    border: "border",
  },
  {
    name: "radius",
    label: trans("style.borderRadius"),
    radius: "radius",
  },
  {
    name: "borderWidth",
    label: trans("style.borderWidth"),
    borderWidth: "borderWidth",
  },
  {
    name: "boxShadow",
    label: "boxShadow",
    boxShadow: "boxShadow",
  },
] as const;

export const BoardStyles = [
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },

  {
    name: "textColor",
    label: "Text Color",
    arrowColor: "textColor",
  },
] as const;


const childrenMap = {
  autoHeight: withDefault(AutoHeightControl, "fixed"),
  cardHeaderStyles: styleControl(CardHeaderStyles),
  tagStyles: styleControl(TagStyles),
  boardStyles: styleControl(BoardStyles),
  data: KanbanOptionControl,
  scrollbars: withDefault(BoolControl, false),
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "Triggers when Chart data changes",
    },
  ] as const),
  cardContentStyles: styleControl(CompStyles),
  cardView: CardViewControl,
  // data: jsonValueExposingStateControl("data", dataSource.cardData),
};

export const KanbanInitComp = (function () {
  return new UICompBuilder(childrenMap, () => {
    return <></>;
  })
    .setPropertyViewFn(() => <></>)
    .build();
})();

const uiChildrenMap = uiChildren(childrenMap);
export type KanbanChildrenType = RecordConstructorToComp<typeof uiChildrenMap>;
export type KanbanChildrenView = RecordConstructorToView<typeof uiChildrenMap>;

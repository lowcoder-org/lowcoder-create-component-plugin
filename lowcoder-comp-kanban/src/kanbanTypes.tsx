import {
  UICompBuilder,
  withDefault,
  eventHandlerControl,
  styleControl,
  AutoHeightControl,
  BoolControl,
  jsonControl,
  toJSONObjectArray,
  uiChildren,
  RecordConstructorToComp,
  RecordConstructorToView,
  dropdownControl,
  stateComp,
  RadiusControl,
} from 'lowcoder-sdk';
import { trans } from "./i18n/comps";
import { KanbanOptionControl } from './kanbanOptionsControl';
import { CardViewControl } from './cardViewControl';
import * as dataSource from "./datasource.json";
import { JSONObject } from 'i18n/comps/locales/types';

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

const cardViewOptions = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Custom",
    value: "custom",
  },
] as const;

const childrenMap = {
  autoHeight: withDefault(AutoHeightControl, "auto"),
  cardHeaderStyles: styleControl(CardHeaderStyles, 'cardHeaderStyles'),
  tagStyles: withDefault(styleControl(TagStyles, 'tagStyles'), {textSize: '12px'}),
  boardStyles: styleControl(BoardStyles, 'boardStyles'),
  data: KanbanOptionControl,
  scrollbars: withDefault(BoolControl, false),
  minCardWidth: withDefault(RadiusControl, ""),
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "Triggers when data changes",
    },
    {
      label: "onCardClick",
      value: "cardClick",
      description: "Triggers on card click",
    },
    {
      label: "onEdit",
      value: "onEdit",
      description: "Customize edit action",
    },
  ] as const),
  cardContentStyles: withDefault(styleControl(CompStyles, 'cardContentStyles'), {padding: '10px'}),
  statusOptions: jsonControl(toJSONObjectArray, dataSource.statusOptions),
  assigneeOptions: jsonControl(toJSONObjectArray, dataSource.assigneeOptions),
  cardViewOption: dropdownControl(cardViewOptions, "default"),
  cardView: CardViewControl,
  separateAssigneeSections: withDefault(BoolControl, false),
  activeCardIndex: stateComp<number>(0),
  activeCardData: stateComp<JSONObject>({}),
  initialData: stateComp<JSONObject>({}),
  updatedItems: stateComp<JSONObject>({}),
  insertedItems: stateComp<JSONObject>({}),
  deletedItems: stateComp<JSONObject>({}),
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

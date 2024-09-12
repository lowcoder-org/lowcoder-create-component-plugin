import {
  ContainerBaseProps,
  gridItemCompToGridItems,
  InnerGrid,
  BoolControl,
  SlotControl,
  withSelectedMultiContext,
  ControlItemCompBuilder,
  BackgroundColorContext,
  // trans,
  ConstructorToView,
  wrapChildAction,
  // useContext,
  tryToNumber,
  SimpleContainerComp,
  RecordType,
  NameGenerator,
  JSONValue,
  CompActionTypes,
} from "lowcoder-sdk";
import React from "react";

type ContainerBaseProps = typeof ContainerBaseProps;
type ConstructorToView<T> = typeof ConstructorToView;
type RecordType = typeof RecordType;
type NameGenerator = typeof NameGenerator;
type JSONValue = typeof JSONValue;

const ContextSlotControl = withSelectedMultiContext(SlotControl);

const ContainerView = React.memo((props: ContainerBaseProps) => {
  console.log('card grid -> ', props);
  return <InnerGrid {...props} emptyRows={8} autoHeight />;
});

const CardView = React.memo((props: { containerProps: ConstructorToView<typeof SimpleContainerComp> }) => {
  const { containerProps } = props;
  // const background = useContext(BackgroundColorContext);
  return (
    <ContainerView
      {...containerProps}
      isDroppable={false}
      isDraggable={false}
      isResizable={false}
      isSelectable={false}
      // bgColor={background}
      items={gridItemCompToGridItems(containerProps.items)}
      hintPlaceholder=""
      // containerPadding={[2, 2]}
    />
  );
}, (prev, next) => JSON.stringify(prev.containerProps) === JSON.stringify(next.containerProps));

const cardTemplate = (props: {
  data: Record<string, string>,
  index: number,
  cardView: any,
}) => {
  const slotControl = props.cardView.getView()(
    {
      currentRow: props.data,
      currentIndex: props.index,
      currentOriginalIndex: props.index,
    },
    String(props.index)
  );
  const containerProps = slotControl.children.container.getView();
  return <CardView key={`view-${props.index}`} containerProps={containerProps} />
};

let CardViewControlTmp = (function () {
  return new ControlItemCompBuilder(
    {
      cardView: ContextSlotControl,
    },
    () => ({ cardViewConfig: {}, cardModalView: null })
  )
    .setControlItemData({ filterText: '' })
    .setPropertyViewFn((children, dispatch) => {
      return (
        <> 
          {children.cardView
            .getSelectedComp()
            .getComp()
            .propertyView({ buttonText: "Customize Card View" })
          }
        </>
      );
    })
    .build();
})();

export class CardViewControl extends CardViewControlTmp {
  getView() {
    const selectedContainer = this.children.cardView.getSelectedComp();
    return {
      cardTemplate: (data: Record<string, string>, index: number) => {
        const cardView = this.children.cardView;
        return cardTemplate({
          data,
          index,
          cardView,
        });
      },
      cardModalView: selectedContainer.getView(),
    };
  }

  setSelectionAction(selection: string, params?: Record<string, unknown>) {
    return wrapChildAction("cardView", ContextSlotControl.setSelectionAction(selection, params));
  }

  getPasteValue(nameGenerator: NameGenerator): JSONValue {
    return {
      ...this.toJsonValue(),
      cardView: this.children.cardView.getSelectedComp().getComp().getPasteValue(nameGenerator),
    };
  }

  reduce(action: any) {
    if (action.type === CompActionTypes.CHANGE_VALUE && action.path[action.path.length - 1] === 'positionParams') return this;
    
    const comp = super.reduce(action);
    // console.info("CardViewControl reduce. action: ", action, "\nthis: ", this, "\ncomp: ", comp);
    return comp;
  }
}

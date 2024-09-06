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
} from "lowcoder-sdk";

type ContainerBaseProps = typeof ContainerBaseProps;
type ConstructorToView<T> = typeof ConstructorToView;
type RecordType = typeof RecordType;
type NameGenerator = typeof NameGenerator;
type JSONValue = typeof JSONValue;

const ContextSlotControl = withSelectedMultiContext(SlotControl);

const ContainerView = (props: ContainerBaseProps) => {
  return <InnerGrid {...props} emptyRows={30} autoHeight />;
};

function CardView(props: { containerProps: ConstructorToView<typeof SimpleContainerComp> }) {
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
      onMouseDown
      // containerPadding={[2, 2]}
    />
  );
}

let CardViewControlTmp = (function () {
  // const label = trans("table.expandable");
  return new ControlItemCompBuilder(
    {
      // expandable: BoolControl,
      cardView: ContextSlotControl,
    },
    () => ({ expandableConfig: {}, expandModalView: null })
    )
    .setControlItemData({ filterText: '' })
    .setPropertyViewFn((children, dispatch) => {
      return (
        <> 
          {children.cardView
            .getSelectedComp()
            .getComp()
            .propertyView({ buttonText: "Customize" })
          }
        </>
      );
    })
    .build();
})();

export class CardViewControl extends CardViewControlTmp {
  getView() {
    // if (!this.children.expandable.getView()) {
    //   return { expandableConfig: {}, expandModalView: null };
    // }
    const selectedContainer = this.children.cardView.getSelectedComp();
    return {
      cardViewConfig: {
        cardTemplate: (data: Record<string, string>, index: number) => {
          const slotControl = this.children.cardView.getView()(
            {
              currentRow: data,
              currentIndex: index,
              // currentOriginalIndex: tryToNumber(record[OB_ROW_ORI_INDEX]),
            },
            String(index)
          );
          const containerProps = slotControl.children.container.getView();
          return <CardView key={index} containerProps={containerProps} />;
        },
      },
      expandModalView: selectedContainer.getView(),
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
    const comp = super.reduce(action);
    // console.info("CardViewControl reduce. action: ", action, "\nthis: ", this, "\ncomp: ", comp);
    return comp;
  }
}

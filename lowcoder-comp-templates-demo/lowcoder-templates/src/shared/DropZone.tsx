import { ReactNode } from "react";
import {
  ContainerPlaceholder,
  DispatchType,
  gridItemCompToGridItems,
  HintPlaceHolder,
  InnerGrid,
  wrapDispatch,
} from "lowcoder-sdk";

type DropZoneProps = {
  containers: Record<string, any>;
  dispatch: DispatchType;
  zoneId: string;
  autoHeight?: boolean;
  horizontalGridCells?: number;
  emptyRows?: number;
  minHeight?: string;
  containerPadding?: [number, number];
  hint?: ReactNode;
  showName?: { top?: number; bottom?: number };
};

export function DropZone(props: DropZoneProps) {
  const containerProps = props.containers[props.zoneId]?.children;
  if (!containerProps) {
    return null;
  }

  const hintPlaceholder = props.hint ? (
    <ContainerPlaceholder>{props.hint}</ContainerPlaceholder>
  ) : (
    HintPlaceHolder
  );

  const stopOuterGridMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    document.dispatchEvent(new MouseEvent("mousedown"));
  };

  return (
    <div
      data-lowcoder-dropzone={props.zoneId}
      draggable={false}
      onMouseDown={stopOuterGridMouseDown}
      style={{
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.minHeight,
        margin: 0,
        padding: 0,
        overflow: props.autoHeight ? "visible" : "hidden",
      }}
    >
      <InnerGrid
        layout={containerProps.layout.getView()}
        items={gridItemCompToGridItems(containerProps.items.getView())}
        positionParams={containerProps.positionParams.getView()}
        dispatch={wrapDispatch(wrapDispatch(props.dispatch, "containers"), props.zoneId)}
        autoHeight={props.autoHeight}
        horizontalGridCells={props.horizontalGridCells}
        emptyRows={props.emptyRows ?? 15}
        minHeight={props.minHeight}
        containerPadding={props.containerPadding}
        hintPlaceholder={hintPlaceholder}
        showName={props.showName}
        overflow={props.autoHeight ? "visible" : "hidden"}
      />
    </div>
  );
}

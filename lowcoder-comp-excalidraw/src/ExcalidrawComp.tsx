import {
  UICompBuilder,
  Section,
  withExposingConfigs,
  AutoHeightControl,
  withDefault,
  NameConfig,
  jsonValueExposingStateControl,
} from "lowcoder-sdk";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useState, useRef } from "react";
import { trans} from "./i18n/comps";

import { useResizeDetector } from "react-resize-detector";
const defaultData = {
  elements: [
    {
      id: "kInUXcNd249GomID2BShG",
      type: "rectangle",
      x: 276.696533203125,
      y: 200.4761962890625,
      width: 291.8367919921875,
      height: 143.3603515625,
      angle: 0,
      strokeColor: "#1e1e1e",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: {
        type: 3,
      },
      seed: 944132607,
      version: 48,
      versionNonce: 310315999,
      isDeleted: false,
      boundElements: null,
      updated: 1717585540038,
      link: null,
      locked: false,
    },
  ],
  appState: {
    gridSize: null,
    viewBackgroundColor: "#ffffff",
  },
  files: {},
};
let ExcalidrawCompBase = (function () {
  const childrenMap = {
    autoHeight: withDefault(AutoHeightControl, "auto"),
    data: jsonValueExposingStateControl("data", defaultData)
  };

  return new UICompBuilder(childrenMap, (props: any) => {
    const previousDrawRef = useRef({});

    const [dimensions, setDimensions] = useState({ width: 480, height: 600 });
    const {
      width,
      height,
      ref: conRef,
    } = useResizeDetector({
      onResize: () => {
        const container = conRef.current;
        if (!container || !width || !height) return;

        if (props.autoHeight) {
          setDimensions({
            width,
            height: dimensions.height,
          });
          return;
        }

        setDimensions({
          width,
          height,
        });
      },
    });

    return (
      <div
        ref={conRef}
        style={{
          height: `100%`,
          width: `100%`,
        }}
      >
        <div style={{ height: dimensions.height, width: dimensions.width }}>
          <Excalidraw
            isCollaborating={false}
            initialData={props.data.value}
            onChange={(excalidrawElements, appState, files) => {
              let draw = {
                elements: excalidrawElements,
                appState: appState,
                files: files,
              };
              if (
                !previousDrawRef.current ||
                JSON.stringify(draw) !== JSON.stringify(previousDrawRef.current)
              ) {
                previousDrawRef.current = draw;
                props.data.onChange(draw);
              }
            }}
          />
        </div>
      </div>
    );
  })
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name="Basic">
            {children.data.propertyView({ label: "Data" })}
          </Section>
          <Section name="Styles">
            {children.autoHeight.getPropertyView()}
          </Section>
        </>
      );
    })
    .build();
})();

ExcalidrawCompBase = class extends ExcalidrawCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

export default withExposingConfigs(ExcalidrawCompBase, [
  new NameConfig("data", trans("component.data")),
]);

import {
  UICompBuilder,
  Section,
  withExposingConfigs,
  AutoHeightControl,
  withDefault,
  NameConfig,
  jsonValueExposingStateControl,
  withMethodExposing
} from 'lowcoder-sdk';
import {Excalidraw} from '@excalidraw/excalidraw';
import {useState, useRef, useEffect} from 'react';
import {trans} from './i18n/comps';
import isEqual from 'lodash/isEqual';

import {useResizeDetector} from 'react-resize-detector';
const defaultData = {
  elements: [
    {
      id: 'kInUXcNd249GomID2BShG',
      type: 'rectangle',
      x: 276.696533203125,
      y: 200.4761962890625,
      width: 291.8367919921875,
      height: 143.3603515625,
      angle: 0,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
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
    viewBackgroundColor: '#fff',
  },
  files: {},
};
let ExcalidrawCompBase = (function () {
  const childrenMap = {
    autoHeight: withDefault(AutoHeightControl, 'auto'),
    data: jsonValueExposingStateControl('data', defaultData),
  };

  return new UICompBuilder(childrenMap, (props: any) => {
    const previousDrawRef = useRef({});
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [dimensions, setDimensions] = useState({width: 480, height: 600});
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
    
    useEffect(() => {
      console.log("props.data.value", props.data.value)
      console.log("previousDrawRef.current, props.data.value", !isEqual(previousDrawRef.current, props.data.value))
      if (excalidrawAPI && !isEqual(previousDrawRef.current, props.data.value)) {
        excalidrawAPI.updateScene(props.data.value);
        previousDrawRef.current = props.data.value;
      }
    }, [props.data.value, excalidrawAPI]);
    
    return (
      <div
        ref={conRef}
        style={{
          height: `100%`,
          width: `100%`,
        }}
      >
        <div style={{height: dimensions.height, width: dimensions.width}}>
          <Excalidraw
            isCollaborating={false}
            initialData={props.data.value}
            excalidrawAPI={(api) => {
              if (!excalidrawAPI) {
                setExcalidrawAPI(api);
              }
            }}            
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
            {children.data.propertyView({label: 'Data'})}
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

ExcalidrawCompBase = withMethodExposing(ExcalidrawCompBase, [
  {
    method: {
      name: "setData",
      description: "Set Gantt Chart Data",
      params: [
        {
          name: "data",
          type: "JSON",
          description: "JSON value",
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      console.log("values", values)
      console.log("comp.children.data", comp.children.data)

      comp.children.data

      const newTasks = values[0];
      comp.children.data.dispatchChangeValueAction(JSON.stringify(newTasks, null, 2));
    },
  },
]);

export default withExposingConfigs(ExcalidrawCompBase, [
  new NameConfig('data', trans('component.data')),
]);

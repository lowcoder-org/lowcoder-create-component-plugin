import {
  UICompBuilder,
  Section,
  withExposingConfigs,
  AutoHeightControl,
  withDefault,
  NameConfig,
  jsonValueExposingStateControl,
  withMethodExposing,
  eventHandlerControl,
  styleControl,
  styled,
} from 'lowcoder-sdk';
import {Excalidraw, MainMenu} from '@excalidraw/excalidraw';
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
export const CompStyles = [
  {
    name: 'margin',
    label: trans('style.margin'),
    margin: 'margin',
  },
  {
    name: 'padding',
    label: trans('style.padding'),
    padding: 'padding',
  },
  {
    name: 'border',
    label: trans('style.border'),
    border: 'border',
  },
  {
    name: 'radius',
    label: trans('style.borderRadius'),
    radius: 'radius',
  },
  {
    name: 'borderWidth',
    label: trans('style.borderWidth'),
    borderWidth: 'borderWidth',
  },
  {
    name: 'borderStyle',
    label: trans('style.borderStyle'),
    borderStyle: 'borderStyle',
  },
  {
    name: 'boxShadow',
    label: trans('style.boxShadow'),
    boxShadow: 'boxShadow',
  },
] as const;
const Wrapper = styled.div<{$styles: any}>`
  ${(props: any) => props.$styles}
`;
let ExcalidrawCompBase = (function () {
  const childrenMap = {
    autoHeight: withDefault(AutoHeightControl, 'auto'),
    data: jsonValueExposingStateControl('data', defaultData),
    onEvent: eventHandlerControl([
      {
        label: 'onChange',
        value: 'change',
        description: 'Triggers when data changes',
      },
    ] as const),
    styles: styleControl(CompStyles),
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
const handleDataChange = () => {
  props.onEvent('change');
};
    useEffect(() => {
      if (
        excalidrawAPI &&
        !isEqual(previousDrawRef.current, props.data.value)
      ) {
        const timeoutId = setTimeout(() => {
          excalidrawAPI.updateScene(props.data.value);
          previousDrawRef.current = props.data.value;
        }, 1000);

        return () => clearTimeout(timeoutId);
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
        <Wrapper
          $styles={{
            height: dimensions.height,
            width: dimensions.width,
            margin: props.styles.margin,
            padding: props.styles.padding,
            boxShadow: props.styles.boxShadow,
            border: `${props.styles.borderWidth} ${props.styles.borderStyle} ${props.styles.border}`,
            borderRadius: props.styles.radius,
          }}
          onClick={handleDataChange}
        >
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
          >
            <MainMenu>
              <MainMenu.DefaultItems.LoadScene />
              <MainMenu.DefaultItems.ToggleTheme />
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
            </MainMenu>
          </Excalidraw>
        </Wrapper>
      </div>
    );
  })
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name="Basic">
            {children.data.propertyView({label: 'Data'})}
          </Section>
          <Section name="Interaction">
            {children.onEvent.propertyView()}
          </Section>
          <Section name="Styles">
            {children.autoHeight.getPropertyView()}
            {children.styles.getPropertyView()}
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
      name: 'setData',
      description: 'Set Excalidraw Data',
      params: [
        {
          name: 'data',
          type: 'JSON',
          description: 'JSON value',
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      comp.children.data;
      const newTasks = values[0];
      comp.children.data.dispatchChangeValueAction(
        JSON.stringify(newTasks, null, 2)
      );
    },
  },

  {
    method: {
      name: 'clearData',
      description: 'Clear Excalidraw Data',
      params: [
        {
          name: 'data',
          type: 'JSON',
          description: 'JSON value',
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      comp.children.data.dispatchChangeValueAction(
        JSON.stringify(
          {
            elements: [],
            appState: {
              gridSize: null,
              viewBackgroundColor: '#fff',
            },
            files: {},
          },
          null,
          2
        )
      );
    },
  },
  {
    method: {
      name: 'resetData',
      description: 'Reset Excalidraw Data',
      params: [
        {
          name: 'data',
          type: 'JSON',
          description: 'JSON value',
        },
      ],
    },
    execute: (comp: any, values: any[]) => {
      comp.children.data.dispatchChangeValueAction(
        JSON.stringify(defaultData, null, 2)
      );
    },
  },
]);

export default withExposingConfigs(ExcalidrawCompBase, [
  new NameConfig('data', trans('component.data')),
]);

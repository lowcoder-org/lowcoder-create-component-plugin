import {
  UICompBuilder,
  NameConfig,
  Section,
  withDefault,
  withExposingConfigs,
  withMethodExposing,
  styleControl,
  arrayStringExposingStateControl,
  AutoHeightControl,
  BoolControl,
  hiddenPropertyView, 
  ScannerEventHandlerControl,
  StringControl,
  NumberControl,
  styled,
  sectionNames,
} from "lowcoder-sdk";

import styles from "./styles.module.css";

import { trans } from "./i18n/comps";
import { useState, useEffect, useRef } from "react";
import { useZxing} from "react-zxing";

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
    name : "radius",
    label : trans("style.borderRadius"),
    radius : "radius",
  },
  {
    name : "borderWidth",
    label : trans("style.borderWidth"),
    borderWidth : "borderWidth",
  }
] as const;

const ScannerStyle = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 10;
  font-size: ${(props: { $style: { textSize: string; }; }) => props.$style.textSize};
  color: rgba(0, 0, 0, 0.45);
  min-height: 250px;
  margin: ${(props: { $style: { margin: string; }; }) => props.$style.margin};
  padding: ${(props: { $style: { padding: string; }; }) => props.$style.padding};
  background-color: ${(props: { $style: { backgroundColor: string; }; }) => props.$style.backgroundColor};
  border: ${(props: { $style: { borderWidth: string; }; }) => props.$style.borderWidth} solid ${(props: { $style: { border: string; }; }) => props.$style.border} !important;
  border-radius: ${(props: { $style: { radius: string; }; }) => props.$style.radius} !important;
`;

interface ScanResult {
  code: string;
  format: string;
  timestamp: number;
}

let ZxingScanCompBase = (function () {

  const childrenMap = {
    data: arrayStringExposingStateControl("data"),
    devices: arrayStringExposingStateControl("devices"),
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    onEvent: ScannerEventHandlerControl,
    continuous: withDefault(BoolControl, false),
    uniqueData: withDefault(BoolControl, false),
    scannerDevice: withDefault(StringControl, ""),
    scannerInterval: withDefault(NumberControl, "300"),
    scannerActiveText: withDefault(StringControl, trans("component.activeText")),
    scannerInactiveText: withDefault(StringControl, trans("component.inactiveText")),
    scannerState: withDefault(StringControl, "stop"),
  };

  return new UICompBuilder(childrenMap, (props) => {

    // const [devices, setDevices] = useState([]);
    const [scannerState, setScannerState] = useState(props.scannerState);
    const [scannerDevice, setScannerDevice] = useState(props.scannerDevice);
    const [timeBetweenDecodingAttempts, setTimeBetweenDecodingAttempts] = useState(props.scannerInterval);
    const continuousValue = useRef([]);

    const ZxingQrcodePlugin = (props) => {

      // to use later
      const [hints, setHints] = useState({});      

      const { ref } = useZxing({
        paused: scannerState === 'pause' || scannerState === 'stop',
        deviceId: props.scannerDevice,
        timeBetweenDecodingAttempts: timeBetweenDecodingAttempts,

        onDecodeResult(result) {
          const resultText = result.getText();
          const resultFormat = result.getBarcodeFormat();
          const resultTimestamp = result.getTimestamp();
          const resultJson = { code: resultText, format: resultFormat, timestamp: resultTimestamp };
          onNewScanResult(resultJson);
        },
        onDecodeError(error) {
          // console.error("Decode error", error);
        },
        onError(error) {
          console.error("General error", error);
        }
      });


      useEffect(() => {
        if (scannerState === 'stop') {
          const videoElement = ref.current as HTMLVideoElement;
          // this does not work
          console.log("videoElement", videoElement?.srcObject);
          if (videoElement && videoElement.srcObject) {
            const stream: MediaStream = videoElement.srcObject as MediaStream
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.srcObject = null;
          }
        }
      }, [scannerState, ref]);
  
      return (
        <>
          <video ref={ref} style={{ height: "100%", width: "100%", display: scannerState !== 'stop' ? 'pause' : 'none' }} />
        </>
      ); 
    };

    const onNewScanResult = async (resultJson: ScanResult) => { 
      if (props.continuous) {
        const isUnique = !continuousValue.current.some(r => 
          r.code === resultJson.code && r.format === resultJson.format
        );
        if (props.uniqueData && isUnique || !props.uniqueData) {
          continuousValue.current.push(resultJson);
          props.data.onChange([...continuousValue.current]);
          props.onEvent("success");
        }
      } else {
        props.data.onChange(resultJson);
        props.onEvent("success");
        setScannerState("pause");
      }
    };

    useEffect(() => {
      const fetchDevices = async () => {
        try {
          const availableDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = availableDevices.filter(device => device.kind === 'videoinput');
          console.log("Available video devices:", videoDevices);
          // setDevices(videoDevices);
          props.devices.onChange(videoDevices);
        } catch (error) {
          console.error("Error fetching devices:", error);
          // Handle any errors, such as updating the UI to inform the user
        }
      };
      fetchDevices();
    }, []); // Empty dependency array means this effect runs once on mount

    useEffect(() => {
      setScannerState(props.scannerState);
    }, [props.scannerState]);

    useEffect(() => {
      setScannerDevice(props.scannerDevice);
    }, [props.scannerDevice]);
    
    useEffect(() => {
      setTimeBetweenDecodingAttempts(props.scannerInterval);
    }, [props.scannerInterval]);
  
    return (
      <ScannerStyle $style={props.styles}>
        <ZxingQrcodePlugin
          timeBetweenDecodingAttempts={props.timeBetweenDecodingAttempts}
          hints={props.hints}
          constraints={props.constraints} 
          paused={props.paused}
          continuous={props.continuous}
          scannerState={props.scannerState}
        />
      </ScannerStyle>
    );
  })

  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name={sectionNames.basic}>
          {children.scannerDevice.propertyView({ label: trans("component.scannerDevice") })}
        </Section>
        <Section name={sectionNames.interaction}>
          {children.onEvent.propertyView()}
          {hiddenPropertyView(children)}
        </Section>
        <Section name={sectionNames.layout}>
          {children.autoHeight.propertyView()}
        </Section>
        <Section name={sectionNames.advanced}>
        {children.continuous.propertyView({ label: trans("component.continuous") })}
          {children.continuous.getView() &&
              children.uniqueData.propertyView({ label: trans("component.uniqueData") })}
        {children.scannerInterval.propertyView({ label: trans("component.interval") })}
        </Section>
        <Section name="Styles">
          {children.styles.getPropertyView()}
        </Section>
      </>
    );
  })
  .build();

})();

ZxingScanCompBase = class extends ZxingScanCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

ZxingScanCompBase = withMethodExposing(ZxingScanCompBase, [
  {
    method: {
      name: trans("component.activeText"),
      description: trans("component.activeText"),
      params: [{}],
    },
    execute: (comp: any) => {
      comp.children.scannerState.dispatchChangeValueAction("start");
    }
  },
  {
    method: {
      name: trans("component.inactiveText"),
      description: trans("component.inactiveText"),
      params: [{}],
    },
    execute: (comp: any) => {
      comp.children.scannerState.dispatchChangeValueAction("pause");
    }
  },
  {
    method: {
      name: trans("component.stopText"),
      description: trans("component.stopText"),
      params: [{}],
    },
    execute: (comp: any) => {
      comp.children.scannerState.dispatchChangeValueAction("stop");
    }
  },
  {
    method: {
      name: trans("component.setScannerDevice"),
      description: trans("component.setScannerDevice"),
      params: [{ name: "deviceId", type: "string" }],
    },
    execute: (comp: any, values: any) => {
      if (values[0]) {
        comp.children.scannerDevice.dispatchChangeValueAction(values[0] as string);
      }
    }
  },
]);

export default withExposingConfigs(ZxingScanCompBase, [
  new NameConfig("data", trans("component.data")),
  new NameConfig("devices", trans("component.devices")),
]);


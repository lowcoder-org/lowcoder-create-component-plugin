import {
  UICompBuilder,
  NameConfig,
  Section,
  withDefault,
  withExposingConfigs,
  withMethodExposing,
  eventHandlerControl,
  styleControl,
  arrayStringExposingStateControl,
  AutoHeightControl,
  BoolCodeControl,
  BoolControl,
  hiddenPropertyView, 
  ScannerEventHandlerControl,
  disabledPropertyView,
  StringControl,
  styled,
  valueComp,
  sectionNames,
} from "lowcoder-sdk";

import styles from "./styles.module.css";

import { i18nObjs, trans } from "./i18n/comps";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback, Html5QrcodeCameraScanConfig, Html5QrcodeScannerState } from 'html5-qrcode';

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

let ScanappCompBase = (function () {

  const childrenMap = {
    data: arrayStringExposingStateControl("data"),
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    onEvent: ScannerEventHandlerControl,
    showButtons: withDefault(BoolControl, true),
    disabled: BoolCodeControl,
    scannerActiveText: withDefault(StringControl, trans("component.activeText")),
    scannerInactiveText: withDefault(StringControl, trans("component.inactiveText")),
    scannerState: withDefault(StringControl, ""),
  };

  return new UICompBuilder(childrenMap, (props) => {

    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const qrcodeRegionId = "html5qr-code-scanner";
    const continuousValue = useRef<string[]>([]);
    const [scannerState, setScannerState] = useState("");

    const qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
      let minEdgePercentage = 0.7; // 70%
      let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
      let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
      return {
          width: qrboxSize,
          height: qrboxSize
      };
    }

    const scannerConfig = (props: { fps: number; qrbox: number; aspectRatio: number; disableFlip: boolean; facingMode : string}) => {
      let config : Html5QrcodeCameraScanConfig = {
        fps: props.fps,
        qrbox: qrboxFunction,
        aspectRatio: props.aspectRatio,
        disableFlip: props.disableFlip
      };
      return config;
    };

    const Html5QrcodePlugin = (props) => {
      
      useEffect(() => {
        const verbose = props.verbose === false;
        const config = scannerConfig(props);
        scannerRef.current = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        // cleanup function when component will unmount
        return () => {
          if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
              console.error("Failed to clear html5QrcodeScanner. ", error);
            });
          }
        };
      }, []);

      useEffect(() => {
        // Reacting to scannerState changes
        if (props.scannerState === "start") {
          scannerRef.current?.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
        }
        else {
          if (scannerRef && scannerRef.current.cameraScanImage !== null) {
            if (props.scannerState === "stop") {
              if (scannerRef && scannerRef.current?.getState() === Html5QrcodeScannerState.UNKNOWN || scannerRef.current?.getState() === Html5QrcodeScannerState.NOT_STARTED){
                scannerRef.current.clear().catch(error => {
                  console.error("Failed to clear html5QrcodeScanner. ", error);
                });
              }
            } 
            else if (props.scannerState === "resume") {
              if (scannerRef && scannerRef?.current?.getState() === Html5QrcodeScannerState.PAUSED) {
                scannerRef.current.resume();
              }
            }
            else if (props.scannerState === "pause") {
              console.log("pause");
              if (scannerRef && scannerRef?.current?.getState() === Html5QrcodeScannerState.SCANNING) {
                scannerRef.current.pause();
              }
            }
          }
        }
        
      }, [props.scannerState]);

      return (
        <>
          <div id={qrcodeRegionId} />
        </>
      );
    };

    const onNewScanResult = async (decodedText: any, decodedResult: any) => {    
        props.data.onChange(decodedResult);
        props.onEvent("success");
    };

    const onErrorScanResult: QrcodeErrorCallback = (errorMessage: any) => {
      // do nothing
    };

    const onStart = () => { 
      scannerRef.current?.render(onNewScanResult, onErrorScanResult);
    }
    const onPause = () => { 
      if (scannerRef && scannerRef.current.cameraScanImage !== null && scannerRef?.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.pause();
      }
    }

    return (
      <ScannerStyle $style={props.styles}>
        <Html5QrcodePlugin
          fps={props.fps}
          qrbox={props.qrbox}
          facingMode={"environment"}
          disableFlip={props.disableFlip}
          qrCodeSuccessCallback={onNewScanResult}
          qrCodeErrorCallback={onErrorScanResult}
          verbose={true}
          aspectRatio={0} 
          scannerState={props.scannerState}
          setScannerState={setScannerState}/>
          <div style={{ textAlign: "center", width: "100%", margin: "10px auto" }}>
            {props.showButtons && 
              <><button style={{ marginLeft: "auto", marginRight: "auto" }} onClick={() => {
              props.onEvent("click");
              onStart();
            } }
              disabled={props.disabled}>
              <span>{props.scannerActiveText}</span>
            </button><button style={{ textAlign: "center" }} onClick={() => {
              props.onEvent("click");
              onPause();
            } }
              disabled={props.disabled}>
                <span>{props.scannerInactiveText}</span>
              </button></>
            }
          </div>
      </ScannerStyle>
    );
  })

  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name={sectionNames.basic}>
          
        </Section>
        <Section name={sectionNames.interaction}>
          {children.onEvent.propertyView()}
          {disabledPropertyView(children)}
          {hiddenPropertyView(children)}
        </Section>
        <Section name={sectionNames.layout}>
          {children.autoHeight.propertyView()}
          {children.showButtons.propertyView({ label: trans("component.showButtons") })}
        </Section>
        {/* <Section name={sectionNames.advanced}>
        {children.continuous.propertyView({ label: trans("component.continuous") })}
          {children.continuous.getView() &&
              children.uniqueData.propertyView({ label: trans("component.uniqueData") })}
        </Section> */}
        <Section name="Styles">
          {children.styles.getPropertyView()}
        </Section>
      </>
    );
  })
  .build();

})();

ScanappCompBase = class extends ScanappCompBase {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

ScanappCompBase = withMethodExposing(ScanappCompBase, [
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
]);

export default withExposingConfigs(ScanappCompBase, [
  new NameConfig("data", trans("component.data")),
]);


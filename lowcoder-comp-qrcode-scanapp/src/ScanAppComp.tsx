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
} from "lowcoder-sdk";

import styles from "./styles.module.css";

import { i18nObjs, trans } from "./i18n/comps";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback, Html5QrcodeCameraScanConfig } from 'html5-qrcode';

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
  font-size: ${(props) => props.$style.textSize};
  color: rgba(0, 0, 0, 0.45);
  min-height: 250px;
  margin: ${(props) => props.$style.margin};
  padding: ${(props) => props.$style.padding};
  background-color: ${(props) => props.$style.backgroundColor};
  border: ${(props) => props.$style.borderWidth} solid ${(props) => props.$style.border} !important;
  border-radius: ${(props) => props.$style.radius} !important;
`;

let ScanappCompBase = (function () {

  const childrenMap = {
    data: arrayStringExposingStateControl("data"),
    styles: styleControl(CompStyles),
    autoHeight: withDefault(AutoHeightControl, "auto"),
    onEvent: ScannerEventHandlerControl,
    continuous: BoolControl,
    uniqueData: withDefault(BoolControl, true),
    disabled: BoolCodeControl,
    maskClosable: withDefault(BoolControl, true),
    scannerActiveText: withDefault(StringControl, trans("component.activeText")),
    scannerInactiveText: withDefault(StringControl, trans("component.inactiveText")),
    activeScanner: valueComp<boolean>(false),
  };
  
  return new UICompBuilder(childrenMap, (props) => {

    const qrcodeRegionId = "html5qr-code-scanner";
    const [isScannerActive, setIsScannerActive] = useState(false);
    const activeScanner = props.activeScanner;

    const toggleScanner = (active: boolean) => {
      setIsScannerActive(active);
    }

    useEffect(() => {
     toggleScanner(activeScanner);
    }, [activeScanner]);

    const scannerConfig = (props: { fps: number; qrbox: number; aspectRatio: number; disableFlip: boolean; facingMode : string}) => {
      let config : Html5QrcodeCameraScanConfig = {
        fps: props.fps,
        qrbox: props.qrbox,
        aspectRatio: props.aspectRatio,
        disableFlip: props.disableFlip
      };
      return config;
    };

    const Html5QrcodePlugin = (props: {
      verbose: boolean; 
      qrCodeSuccessCallback: QrcodeSuccessCallback; 
      qrCodeErrorCallback: QrcodeErrorCallback;
      fps: number;
      qrbox: number;
      aspectRatio: number;
      disableFlip: boolean 
      facingMode: string; }) => {

      // we want to control when the scanner gets activated

      let html5QrcodeScanner: Html5QrcodeScanner;

      useEffect(() => {
        if (isScannerActive) {
          const verbose = props.verbose === false;
          const config = scannerConfig(props);
          html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
          html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback)
        }
        // cleanup function when component will unmount
        return () => {
          if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => {
              console.error("Failed to clear html5QrcodeScanner. ", error);
            });
          }
        };
      }, [isScannerActive]);

      return (
        <>
          <div id={qrcodeRegionId} />
        </>
      );
    };

    const onNewScanResult = (decodedText: any, decodedResult: any) => {
      props.data.onChange(decodedResult);
      props.onEvent("success");
    };
    const onErrorScanResult = (error: any) => {
      // console.log("Scan error:", error);
    };

    return (
      <ScannerStyle $style={props.styles}>
        <Html5QrcodePlugin
          fps={10}
          qrbox={250}
          facingMode={"environment"}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
          qrCodeErrorCallback={onErrorScanResult} 
          verbose={true} 
          aspectRatio={0}/>
          <div style={{ textAlign: "center", width: "100%", margin: "10px auto" }}>
            <button style={{ marginLeft: "auto", marginRight: "auto" }} onClick={() => {
                props.onEvent("click");
                toggleScanner(true);
              }} 
              disabled={props.disabled}>
              <span>{props.scannerActiveText}</span>
            </button>
            <button style={{ textAlign: "center" }} onClick={() => {
                props.onEvent("click");
                toggleScanner(false);
              }} 
              disabled={props.disabled}>
              <span>{props.scannerInactiveText}</span>
            </button>
          </div>
      </ScannerStyle>
    );
  })
  .setPropertyViewFn((children: any) => {
    return (
      <>
        <Section name="Basic">
          {children.data.propertyView({ label: "Data" })}
        </Section>
        <Section name="Interaction">
          {children.onEvent.propertyView()}
          {disabledPropertyView(children)}
          {hiddenPropertyView(children)}
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
      comp.children.activeScanner.dispatchChangeValueAction(true);
    }
  },
  {
    method: {
      name: trans("component.inactiveText"),
      description: trans("component.inactiveText"),
      params: [{}],
    },
    execute: (comp: any) => {
      comp.children.activeScanner.dispatchChangeValueAction(false);
    }
  },
]);

export default withExposingConfigs(ScanappCompBase, [
  new NameConfig("data", trans("component.data")),
]);

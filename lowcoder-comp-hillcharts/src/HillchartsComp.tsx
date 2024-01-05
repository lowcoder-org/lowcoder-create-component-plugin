import {
  UICompBuilder,
  NameConfig,
  NumberControl,
  Section,
  withDefault,
  withExposingConfigs,
  eventHandlerControl,
  styleControl,
  toJSONObjectArray,
  jsonControl,
} from "lowcoder-sdk";

import styles from "./styles.module.css";

import { i18nObjs, trans } from "./i18n/comps";

import { Chart } from './vendors'
import { useRef } from "react";


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

const childrenMap = {
  styles: styleControl(CompStyles),
  data: jsonControl(toJSONObjectArray, i18nObjs.defaultData),
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "Triggers when Chart data changes",
    },
  ]),
};

const HillchartsCompBase = new UICompBuilder(childrenMap, (props: any) => {

  const handleDataChange = () => {
    props.onEvent("change");
  };

  const conRef = useRef<HTMLDivElement>(null);
  const container = conRef.current;

  return (
      <div className={styles.wrapper} style={{
          display: "flex",
          justifyContent: "center",
          height: `100%`,
          width: `100%`,
          backgroundColor: `${props.styles.backgroundColor}`,
          borderColor: `${props.styles.border}`,
          borderRadius: `${props.styles.radius}`,
          borderWidth: `${props.styles.borderWidth}`,
          margin: `${props.styles.margin}`,
          padding: `${props.styles.padding}`,
          fontSize: `${props.styles.textSize}`,
        }}>
        <Chart data={props.data} width={container?.clientWidth} height={container?.clientHeight} onDataChange={handleDataChange}/>
      </div>
    
  );
})
.setPropertyViewFn((children: any) => {
  return (
    <>
      <Section name="Basic">
        {children.data.propertyView({ label: "Data" })}
      </Section>
      <Section name="Interaction">{children.onEvent.propertyView()}</Section>
      <Section name="Styles">{children.styles.getPropertyView()}</Section>
    </>
  );
})
.build();

export default withExposingConfigs(HillchartsCompBase, [
  new NameConfig("data", ""),
]);

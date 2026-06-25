// @ts-nocheck
import React, { PropsWithChildren } from "react";

type LayoutFrameProps = PropsWithChildren<{
  styleConfig: any;
  autoHeight?: boolean;
  direction?: "row" | "column";
}>;

export function LayoutFrame(props: LayoutFrameProps) {
  const styleConfig = props.styleConfig || {};
  return (
    <div
      style={{
        display: "flex",
        flexDirection: props.direction ?? "column",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? "240px" : undefined,
        overflow: "hidden",
        background: styleConfig.background || "transparent",
        borderRadius: styleConfig.radius || "4px",
        borderWidth: styleConfig.borderWidth || "1px",
        borderStyle: styleConfig.borderStyle || "solid",
        borderColor: styleConfig.border || "#d7d9e0",
        padding: styleConfig.padding || "0px",
        margin: styleConfig.margin || "0px",
      }}
    >
      {props.children}
    </div>
  );
}

export function Region(props: PropsWithChildren<{
  border?: "bottom" | "right" | "top" | "left";
  width?: string | number;
  height?: string | number;
  flex?: number;
  minHeight?: string | number;
  minWidth?: string | number;
  background?: string;
  overflow?: string;
}>) {
  const borderStyles = {
    borderBottom: props.border === "bottom" ? "1px solid #d7d9e0" : undefined,
    borderRight: props.border === "right" ? "1px solid #d7d9e0" : undefined,
    borderTop: props.border === "top" ? "1px solid #d7d9e0" : undefined,
    borderLeft: props.border === "left" ? "1px solid #d7d9e0" : undefined,
  };

  return (
    <div
      style={{
        ...borderStyles,
        position: "relative",
        flex: props.flex,
        flexShrink: props.width || props.height ? 0 : undefined,
        width: typeof props.width === "number" ? `${props.width}px` : props.width,
        height: typeof props.height === "number" ? `${props.height}px` : props.height,
        minHeight: props.minHeight,
        minWidth: props.minWidth,
        overflow: props.overflow || "hidden",
        background: props.background || "transparent",
      }}
    >
      {props.children}
    </div>
  );
}

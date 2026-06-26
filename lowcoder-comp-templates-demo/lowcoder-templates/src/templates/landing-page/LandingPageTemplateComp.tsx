import { DropZone } from "../../shared/DropZone";
import { buildTemplateComp, TemplateViewProps } from "../../shared/buildTemplateComp";
import { LandingLayout, LandingFooter } from "./components/LandingLayout";

const PRIMARY_ZONE = "main_content";

function LandingPageView(props: TemplateViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? 720 : undefined,
        background: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <LandingLayout />

      <div style={{ flex: 1, minHeight: 250 }}>
        <DropZone
          containers={props.containers}
          dispatch={props.dispatch}
          zoneId={PRIMARY_ZONE}
          autoHeight
          horizontalGridCells={12}
          emptyRows={18}
          minHeight="250px"
          containerPadding={[32, 32]}
          hint="Drop content sections here"
        />
      </div>

      <LandingFooter />
    </div>
  );
}

export default buildTemplateComp(
  LandingPageView,
  { [PRIMARY_ZONE]: { layout: {}, items: {} } },
  PRIMARY_ZONE
);

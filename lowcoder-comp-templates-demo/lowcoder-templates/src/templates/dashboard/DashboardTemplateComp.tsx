import { DropZone } from "../../shared/DropZone";
import { buildTemplateComp, TemplateViewProps } from "../../shared/buildTemplateComp";
import { DashboardLayout } from "./components/DashboardLayout";

const PRIMARY_ZONE = "main_content";

function DashboardView(props: TemplateViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? 640 : undefined,
        background: "#f0f2f5",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <DashboardLayout />

      <div style={{ flex: 1, padding: "0 24px 24px", minHeight: 300 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            height: "100%",
            minHeight: 300,
            overflow: "hidden",
          }}
        >
          <DropZone
            containers={props.containers}
            dispatch={props.dispatch}
            zoneId={PRIMARY_ZONE}
            autoHeight
            horizontalGridCells={12}
            emptyRows={20}
            minHeight="300px"
            containerPadding={[16, 16]}
            hint="Drop charts, tables, or widgets here"
          />
        </div>
      </div>
    </div>
  );
}

export default buildTemplateComp(
  DashboardView,
  { [PRIMARY_ZONE]: { layout: {}, items: {} } },
  PRIMARY_ZONE
);

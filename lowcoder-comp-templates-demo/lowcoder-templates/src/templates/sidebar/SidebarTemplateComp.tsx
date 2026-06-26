import { DropZone } from "../../shared/DropZone";
import { buildTemplateComp, TemplateViewProps } from "../../shared/buildTemplateComp";
import { SidebarLayout } from "./components/SidebarLayout";

const PRIMARY_ZONE = "main_content";

function SidebarView(props: TemplateViewProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? 600 : undefined,
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <SidebarLayout />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background: "#f5f6fa",
        }}
      >
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #e8e8e8",
            background: "#fff",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>Dashboard</h2>
        </div>

        <div style={{ flex: 1, minHeight: 300 }}>
          <DropZone
            containers={props.containers}
            dispatch={props.dispatch}
            zoneId={PRIMARY_ZONE}
            autoHeight
            horizontalGridCells={12}
            emptyRows={20}
            minHeight="300px"
            containerPadding={[20, 20]}
            hint="Drop components into the main area"
          />
        </div>
      </main>
    </div>
  );
}

export default buildTemplateComp(
  SidebarView,
  { [PRIMARY_ZONE]: { layout: {}, items: {} } },
  PRIMARY_ZONE
);

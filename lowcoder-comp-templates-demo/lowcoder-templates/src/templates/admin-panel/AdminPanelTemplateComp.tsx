import { useState } from "react";
import { DropZone } from "../../shared/DropZone";
import { buildTemplateComp, TemplateViewProps } from "../../shared/buildTemplateComp";
import { AdminSidebar, AdminTopBar } from "./components/AdminPanelLayout";

const PRIMARY_ZONE = "main_content";

function AdminPanelView(props: TemplateViewProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? 680 : undefined,
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <AdminTopBar onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <AdminSidebar collapsed={collapsed} />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: "#f0f2f5",
          }}
        >
          <div style={{ padding: "18px 24px", fontSize: 13, color: "#999" }}>
            Admin / <strong style={{ color: "#333" }}>Dashboard</strong>
          </div>

          <div style={{ flex: 1, padding: "0 24px 24px", minHeight: 300 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
                hint="Drop admin widgets here"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default buildTemplateComp(
  AdminPanelView,
  { [PRIMARY_ZONE]: { layout: {}, items: {} } },
  PRIMARY_ZONE
);

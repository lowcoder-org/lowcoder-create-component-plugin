import { DropZone } from "../../shared/DropZone";
import { buildTemplateComp, TemplateViewProps } from "../../shared/buildTemplateComp";
import { CardGridLayout } from "./components/CardGridLayout";

const PRIMARY_ZONE = "main_content";

function CardGridView(props: TemplateViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: props.autoHeight ? "auto" : "100%",
        minHeight: props.autoHeight ? 600 : undefined,
        background: "#f8f9fc",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <CardGridLayout />

      <div style={{ flex: 1, padding: "24px 32px", minHeight: 250 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            height: "100%",
            minHeight: 250,
            overflow: "hidden",
          }}
        >
          <DropZone
            containers={props.containers}
            dispatch={props.dispatch}
            zoneId={PRIMARY_ZONE}
            autoHeight
            horizontalGridCells={12}
            emptyRows={18}
            minHeight="250px"
            containerPadding={[16, 16]}
            hint="Drop cards or list components here"
          />
        </div>
      </div>
    </div>
  );
}

export default buildTemplateComp(
  CardGridView,
  { [PRIMARY_ZONE]: { layout: {}, items: {} } },
  PRIMARY_ZONE
);

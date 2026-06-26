import { useState } from "react";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard", active: true },
  { icon: "👥", label: "Users" },
  { icon: "📦", label: "Products" },
  { icon: "📈", label: "Analytics" },
  { icon: "💬", label: "Messages" },
  { icon: "⚙️", label: "Settings" },
];

export function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        background: "#1a1a2e",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 12px" : "20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#4361ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          A
        </div>
        {!collapsed && <div style={{ fontSize: 16, fontWeight: 700 }}>My App</div>}
      </div>

      <nav style={{ padding: "16px 0", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "rgba(255,255,255,0.35)",
            padding: collapsed ? "0 12px" : "0 20px",
            marginBottom: 8,
          }}
        >
          {collapsed ? "•" : "Navigation"}
        </div>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: collapsed ? "10px 18px" : "10px 20px",
              margin: "2px 8px",
              borderRadius: 8,
              fontSize: 14,
              background: item.active ? "#4361ee" : "transparent",
              opacity: item.active ? 1 : 0.65,
            }}
          >
            <span style={{ width: 20, textAlign: "center" }}>{item.icon}</span>
            {!collapsed && item.label}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          padding: "16px 20px",
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "transparent",
          color: "#fff",
          fontSize: 13,
          opacity: 0.5,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {collapsed ? "→" : "← Collapse"}
      </button>
    </aside>
  );
}

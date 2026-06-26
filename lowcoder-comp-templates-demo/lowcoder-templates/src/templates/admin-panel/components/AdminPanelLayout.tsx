const MENU_GROUPS = [
  {
    label: "Main",
    items: [
      { icon: "🏠", label: "Dashboard", active: true },
      { icon: "📊", label: "Analytics" },
      { icon: "👥", label: "Users" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: "📦", label: "Products" },
      { icon: "🧾", label: "Orders" },
      { icon: "💳", label: "Billing" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: "⚙️", label: "Settings" },
      { icon: "🔐", label: "Security" },
    ],
  },
];

export function AdminTopBar({ onToggle }: { onToggle: () => void }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 52,
        padding: "0 20px",
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          onClick={onToggle}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: 32,
            height: 32,
            border: "none",
            borderRadius: 6,
            background: "transparent",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f6fa",
            borderRadius: 8,
            padding: "6px 14px",
            gap: 8,
            minWidth: 280,
            fontSize: 13,
            color: "#bbb",
          }}
        >
          🔍 Search anything...
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16 }}>🔔</span>
        <span style={{ fontSize: 16 }}>💬</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#4361ee",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          A
        </div>
      </div>
    </header>
  );
}

export function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      style={{
        width: collapsed ? 60 : 220,
        background: "#fafbfc",
        borderRight: "1px solid #e8e8e8",
        flexShrink: 0,
        paddingTop: 8,
        overflow: "hidden",
        transition: "width 0.2s ease",
      }}
    >
      {MENU_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#aaa",
              padding: collapsed ? "8px 12px" : "8px 16px",
            }}
          >
            {collapsed ? "•" : group.label}
          </div>
          {group.items.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "9px 19px" : "9px 16px",
                margin: "1px 6px",
                borderRadius: 6,
                fontSize: 13,
                color: item.active ? "#4361ee" : "#555",
                background: item.active ? "rgba(67,97,238,0.07)" : "transparent",
                fontWeight: item.active ? 600 : 400,
              }}
            >
              <span style={{ width: 20, textAlign: "center" }}>{item.icon}</span>
              {!collapsed && item.label}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

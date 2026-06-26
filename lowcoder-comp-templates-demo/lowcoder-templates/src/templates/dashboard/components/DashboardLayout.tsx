const STATS = [
  { label: "Total Users", value: "12,847", accent: "#4361ee" },
  { label: "Revenue", value: "$48.2K", accent: "#2ec4b6" },
  { label: "Orders", value: "1,024", accent: "#ff6b6b" },
  { label: "Conversion", value: "3.24%", accent: "#ffd166" },
];

export function DashboardLayout() {
  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 56,
          background: "#1a1a2e",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>My Dashboard</div>
        <nav style={{ display: "flex", gap: 24, fontSize: 14, opacity: 0.85 }}>
          {["Overview", "Analytics", "Reports", "Settings"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          padding: "20px 24px",
          flexShrink: 0,
        }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderLeft: `4px solid ${stat.accent}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#8c8c8c",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 6,
              }}
            >
              {stat.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

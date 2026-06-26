const TABS = ["All Items", "Recent", "Favorites", "Archived"];

export function CardGridLayout() {
  return (
    <>
      <header
        style={{
          background: "#fff",
          padding: "28px 32px",
          borderBottom: "1px solid #e8e8e8",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>
            Item Collection
          </h1>
          <span
            style={{
              background: "#4361ee",
              color: "#fff",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            12 Items
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#8c8c8c", margin: "8px 0 0" }}>
          Browse, search, and manage your collection of items in one place.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          gap: 0,
          padding: "0 32px",
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          flexShrink: 0,
        }}
      >
        {TABS.map((tab, i) => (
          <div
            key={tab}
            style={{
              padding: "12px 20px",
              fontSize: 14,
              fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? "#4361ee" : "#8c8c8c",
              borderBottom: i === 0 ? "2px solid #4361ee" : "2px solid transparent",
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </>
  );
}

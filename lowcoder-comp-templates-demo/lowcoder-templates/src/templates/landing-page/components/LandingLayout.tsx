export function LandingLayout() {
  return (
    <>
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          padding: "60px 48px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <h1 style={{ margin: "0 0 16px", fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>
          Build Something Amazing
        </h1>
        <p
          style={{
            margin: "0 auto 32px",
            maxWidth: 600,
            fontSize: 18,
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          A powerful platform to create, deploy, and scale your applications with ease.
        </p>
        <div
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#667eea",
            padding: "14px 36px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Get Started Free
        </div>
      </section>
    </>
  );
}

export function LandingFooter() {
  return (
    <footer
      style={{
        background: "#1a1a2e",
        color: "#fff",
        padding: "32px 48px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>YourBrand</div>
          <p style={{ fontSize: 13, opacity: 0.6, margin: 0, lineHeight: 1.6 }}>
            Making the world a better place through quality software and design.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Docs"] },
          { title: "Company", links: ["About", "Blog", "Careers"] },
          { title: "Support", links: ["Help", "Contact", "Status"] },
        ].map((col) => (
          <div key={col.title}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 12,
                opacity: 0.8,
              }}
            >
              {col.title}
            </div>
            {col.links.map((link) => (
              <div key={link} style={{ fontSize: 13, opacity: 0.5, marginBottom: 8 }}>
                {link}
              </div>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}

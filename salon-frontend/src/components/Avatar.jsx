export const Avatar=({ name = "Amit P", size = 50 })=> {
  // Extract first 2 initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "transparent",
        color: "var(--heading)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.4,
        border: "1px solid var(--border-dark)",
        cursor: "pointer",
        userSelect: "none",
        
      }}
    >
      {initials}
    </div>
  );
}

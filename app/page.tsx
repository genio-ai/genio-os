export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      background: "linear-gradient(135deg,#0a0f1c,#122240)",
      padding: "32px"
    }}>
      <img src="/genio-logo.png" alt="Genio Logo" width={220} style={{filter:"drop-shadow(0 2px 8px rgba(0,0,0,.3))"}} />
      <img src="/genio-mascot.png" alt="Genio Mascot" width={200} style={{filter:"drop-shadow(0 2px 8px rgba(0,0,0,.25))"}} />
      <h1 style={{margin:0, fontSize:"32px", color:"#facc15", letterSpacing:"0.5px"}}>Welcome to Genio OS</h1>
      <p style={{margin:0, opacity:.8, color:"#dbeafe", fontSize:"14px", textAlign:"center"}}>
        AI-built. AI-run. Money OS & KYC done right.
      </p>
    </main>
  )
}

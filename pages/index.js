// pages/index.js — Genio KYC OS (Colorful Landing)
// Works on Next.js Pages Router (no external deps)
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#08162e",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  header:{position:"sticky",top:0,zIndex:40,background:"rgba(8,22,46,0.85)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,.08)"},
  nav:{maxWidth:1120,margin:"0 auto",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  brand:{display:"flex",gap:8,alignItems:"baseline",fontWeight:900,fontSize:20,letterSpacing:.2},
  brandSub:{opacity:.9,fontWeight:700,fontSize:16},
  navUl:{display:"flex",gap:22,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,.92)",textDecoration:"none"},
  cta:{padding:"10px 14px",borderRadius:12,background:"linear-gradient(90deg,#2AF598,#009EFD)",color:"#001219",fontWeight:900,textDecoration:"none",border:"1px solid rgba(255,255,255,.2)"},
  wrap:{maxWidth:1120,margin:"0 auto",padding:"28px 16px 64px"},

  // cards/sections
  card:(bg)=>({borderRadius:28,padding:24,background:bg,border:"1px solid rgba(255,255,255,.08)",boxShadow:"0 16px 40px rgba(0,0,0,.35)"}),

  // hero
  hero:{display:"grid",gap:18,gridTemplateColumns:"1fr",paddingTop:10},
  heroBox:{borderRadius:32,padding:"28px 22px",background:"linear-gradient(135deg,#0b2a59 0%, #2c2a72 60%, #6e2b8f 100%)",border:"1px solid rgba(255,255,255,.12)"},
  h1:{fontSize:42,lineHeight:1.06,margin:"0 0 10px",fontWeight:900},
  p:{opacity:.92,lineHeight:1.6,margin:"0 0 16px",fontSize:16},
  btnRow:{display:"flex",gap:12,flexWrap:"wrap"},
  btnPri:{padding:"12px 16px",borderRadius:12,fontWeight:800,color:"#001219",background:"linear-gradient(90deg,#2AF598,#009EFD)",border:"none",textDecoration:"none"},
  btnSec:{padding:"12px 16px",borderRadius:12,fontWeight:800,color:"#fff",background:"transparent",border:"1px solid rgba(255,255,255,.35)",textDecoration:"none"},

  badges:{display:"flex",gap:10,flexWrap:"wrap",marginTop:10},
  badge:(bg)=>({display:"inline-flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:999,fontSize:13,fontWeight:700,background:bg,border:"1px solid rgba(255,255,255,.14)"}),

  grid2:{display:"grid",gap:16,gridTemplateColumns:"1fr",marginTop:18},

  // colorful info cards
  infoCard:(col)=>({borderRadius:20,padding:18,background:col,border:"1px solid rgba(255,255,255,.12)"}),
  infoTitle:{fontWeight:900,margin:"0 0 6px",fontSize:18},
  infoText:{opacity:.95,margin:0,lineHeight:1.6},

  // steps
  step:{borderRadius:20,padding:18,border:"1px solid rgba(255,255,255,.12)"},
  stepNum:(c)=>({display:"inline-flex",width:32,height:32,alignItems:"center",justifyContent:"center",borderRadius:9,background:c,fontWeight:900,marginRight:10}),
  stepTitle:{fontWeight:900,margin:"10px 0 8px",fontSize:18},

  // API section
  apiBox:{borderRadius:26,padding:20,background:"linear-gradient(135deg,#0b335a,#0d7a86)",border:"1px solid rgba(255,255,255,.12)"},
  code:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",background:"rgba(0,0,0,.35)",borderRadius:12,padding:"10px 12px",display:"block",whiteSpace:"pre",overflowX:"auto",fontSize:13,marginTop:10},

  // support
  support:{display:"grid",gap:16,gridTemplateColumns:"1fr",marginTop:18},
  input:{borderRadius:12,border:"1px solid rgba(255,255,255,.25)",background:"rgba(255,255,255,.06)",color:"#fff",padding:"10px 12px",width:"100%",outline:"none"},
  textarea:{borderRadius:12,border:"1px solid rgba(255,255,255,.25)",background:"rgba(255,255,255,.06)",color:"#fff",padding:"10px 12px",minHeight:120,width:"100%",outline:"none"},
  send:{padding:"12px 16px",borderRadius:12,fontWeight:900,color:"#001219",background:"linear-gradient(90deg,#21D4FD,#B721FF)",border:"none",width:"100%"},
  footer:{marginTop:36,opacity:.8,fontSize:13,textAlign:"center",padding:"18px 0",borderTop:"1px solid rgba(255,255,255,.08)"},
};

// responsive upgrades
const sectionTitle = {fontSize:26,margin:"0 0 12px",fontWeight:900};
const sectionSub = {margin:"0 0 10px",opacity:.9};

export default function Home(){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");

  const submit = (e)=>{
    e.preventDefault();
    // demo only
    setEmail(""); setMsg("");
    alert("Thanks! We'll get back to you shortly."); // client-only
  };

  return (
    <>
      <Head>
        <title>Genio KYC OS — Verified identity, portable & colorful</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={ui.page}>
        {/* Header */}
        <header style={ui.header}>
          <nav style={ui.nav}>
            <div style={ui.brand}>
              <span>Genio</span>
              <span style={ui.brandSub}>KYC OS</span>
            </div>
            <ul style={ui.navUl}>
              <li><Link href="/" style={ui.link}>Home</Link></li>
              <li><Link href="/kyc" style={ui.link}>KYC</Link></li>
              <li><Link href="/dashboard" style={ui.link}>Dashboard</Link></li>
              <li><Link href="/support" style={ui.link}>Support</Link></li>
              <li><Link href="/login" style={ui.link}>Login</Link></li>
            </ul>
            <Link href="/kyc" style={ui.cta}>Get Verified</Link>
          </nav>
        </header>

        <section style={ui.wrap}>
          {/* Hero */}
          <div style={ui.hero}>
            <div style={ui.heroBox}>
              <h1 style={ui.h1}>Verified identity. Portable. On-chain proof.</h1>
              <p style={ui.p}>
                Verify once with <b>multi-modal KYC</b>: documents + biometrics + liveness.
                We store only <b>hash-based attestations</b> on-chain — privacy by design.
              </p>
              <div style={ui.btnRow}>
                <Link href="/kyc" style={ui.btnPri}>Get Verified</Link>
                <a href="#how" style={ui.btnSec}>How it works</a>
              </div>
              <div style={ui.badges}>
                <span style={ui.badge("rgba(52, 211, 153, .15)")}>🔒 Privacy-first</span>
                <span style={ui.badge("rgba(56, 189, 248, .15)")}>⚡ Fast & modern</span>
                <span style={ui.badge("rgba(216, 180, 254, .18)")}>🌍 Vendor-agnostic</span>
                <span style={ui.badge("rgba(45, 212, 191, .18)")}>📱 Mobile-friendly</span>
              </div>
            </div>
          </div>

          {/* Why Genio (colorful info cards) */}
          <div style={{...ui.grid2, marginTop:20}}>
            <div style={ui.infoCard("linear-gradient(135deg,#1d4ed8,#0ea5e9)")}>
              <h3 style={ui.infoTitle}>Attestations, not raw data</h3>
              <p style={ui.infoText}>Only salted hashes are anchored on-chain. Your raw files stay local or with your chosen vendor.</p>
            </div>
            <div style={ui.infoCard("linear-gradient(135deg,#16a34a,#22c55e)")}>
              <h3 style={ui.infoTitle}>Strict file checks</h3>
              <p style={ui.infoText}>Corners, glare, size, type, &lt; 8MB. Guiding tips for clean captures.</p>
            </div>
            <div style={ui.infoCard("linear-gradient(135deg,#9333ea,#22d3ee)")}>
              <h3 style={ui.infoTitle}>Biometrics + Liveness</h3>
              <p style={ui.infoText}>Face match on-device (demo), liveness prompts, and a portable “Genio ID”.</p>
            </div>
            <div style={ui.infoCard("linear-gradient(135deg,#f43f5e,#f59e0b)")}>
              <h3 style={ui.infoTitle}>Developer-Friendly</h3>
              <p style={ui.infoText}>Simple client flow now; drop-in API later. Start on testnet, switch network anytime.</p>
            </div>
          </div>

          {/* How it works */}
          <div id="how" style={{marginTop:26}}>
            <h2 style={sectionTitle}>How it works</h2>
            <p style={sectionSub}>Three quick steps. Verify once, re-use anywhere.</p>
            <div style={{display:"grid",gap:16}}>
              <div style={{...ui.step, background:"linear-gradient(135deg,rgba(16,185,129,.18),rgba(20,184,166,.12))"}}>
                <span style={ui.stepNum("rgba(16,185,129,.8)")}>1</span>
                <b>Personal Info</b>
                <div style={ui.p}>Name, DOB, <b>Residence</b> & <b>Citizenship</b>. Contact optional.</div>
              </div>
              <div style={{...ui.step, background:"linear-gradient(135deg,rgba(59,130,246,.18),rgba(125,211,252,.12))"}}>
                <span style={ui.stepNum("rgba(59,130,246,.85)")}>2</span>
                <b>ID Upload</b>
                <div style={ui.p}>Passport (photo page) or National/Driver (front+back). Client-side checks before submit.</div>
              </div>
              <div style={{...ui.step, background:"linear-gradient(135deg,rgba(168,85,247,.18),rgba(20,184,166,.12))"}}>
                <span style={ui.stepNum("rgba(168,85,247,.85)")}>3</span>
                <b>Biometrics + Liveness</b>
                <div style={ui.p}>Selfie match (demo) and liveness cues. Device-only preview; no uploads in demo.</div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <Link href="/kyc" style={{...ui.btnPri, background:"linear-gradient(90deg,#ff7eb3,#ff758c)"}}>Start KYC</Link>
                <Link href="/dashboard" style={ui.btnSec}>Open Dashboard</Link>
              </div>
            </div>
          </div>

          {/* API / Dev box */}
          <div style={{marginTop:28}}>
            <h2 style={sectionTitle}>Developer-Friendly</h2>
            <div style={ui.apiBox}>
              <div style={ui.p}>Simple API: <b>/api/biometrics</b> to create a face embedding → <b>/api/attest</b> to anchor proofs on-chain (hash-only).</div>
              <code style={ui.code}>
{`POST /api/biometrics
- body: { selfieBase64 }
- returns: { embedding }

POST /api/attest
- body: { attestationHash, network: "sepolia" }
- returns: { txid }`}
              </code>
            </div>
          </div>

          {/* Support */}
          <div style={{marginTop:28}}>
            <h2 style={sectionTitle}>Support</h2>
            <div style={{display:"grid",gap:16,gridTemplateColumns:"1fr"}}>
              <div style={ui.card("linear-gradient(135deg, rgba(45,212,191,.10), rgba(147,51,234,.10))")}>
                <ul style={{margin:"0 0 14px 18px",lineHeight:1.8}}>
                  <li>Preparing passport / ID captures (corners, glare, size)</li>
                  <li>Biometrics & liveness best practices</li>
                  <li>Attestation & on-chain verification flows</li>
                </ul>
                <Link href="/kyc" style={ui.btnPri}>Start KYC</Link>
              </div>

              <form onSubmit={submit} style={ui.card("linear-gradient(135deg, rgba(37,99,235,.12), rgba(56,189,248,.12))")}>
                <div style={{display:"grid",gap:12}}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Email"
                    style={ui.input}
                  />
                  <textarea
                    value={msg}
                    onChange={(e)=>setMsg(e.target.value)}
                    placeholder="How can we help?"
                    style={ui.textarea}
                  />
                  <button type="submit" style={ui.send}>Send message</button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <footer style={ui.footer}>
            <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:8}}>
              <Link href="/support" style={ui.link}>Contact</Link>
              <span>•</span>
              <Link href="/terms" style={ui.link}>Terms</Link>
              <span>•</span>
              <Link href="/privacy" style={ui.link}>Privacy</Link>
            </div>
            © {new Date().getFullYear()} Genio Systems — All rights reserved.
          </footer>
        </section>
      </main>
    </>
  );
}

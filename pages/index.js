// pages/index.js — Genio KYC OS (Landing w/ Blockchain-ready story)
// Next.js Pages Router — no external deps. Pure inline styles, SSR-safe.

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  container:{maxWidth:1100,margin:"0 auto",padding:"24px 16px"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(14,35,68,0.9)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"12px 0"},
  brand:{display:"flex",alignItems:"baseline",gap:6,fontWeight:900,letterSpacing:.4},
  brandTiny:{fontWeight:700,opacity:.85,fontSize:14,marginLeft:4},
  navLinks:{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"},
  link:{color:"rgba(255,255,255,.92)",textDecoration:"none"},
  cta:{background:"linear-gradient(90deg,#27E38A,#27D4F0)",color:"#0b1d3a",padding:"10px 14px",borderRadius:12,fontWeight:800,textDecoration:"none"},

  hero:{display:"grid",gap:18,borderRadius:24,padding:24,background:"linear-gradient(135deg,#102A55,#0A1936)",border:"1px solid rgba(255,255,255,0.1)",marginTop:14},
  h1:{fontSize:42,lineHeight:1.1,margin:0,fontWeight:900},
  p:{margin:"6px 0 0",opacity:.9,lineHeight:1.6},
  heroBadges:{display:"flex",gap:10,flexWrap:"wrap",marginTop:14},
  badge:{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 10px",fontSize:13,borderRadius:999,border:"1px solid rgba(255,255,255,.18)",background:"rgba(255,255,255,.06)"},

  section:{marginTop:28},
  h2:{margin:"0 0 10px",fontSize:26,fontWeight:900},
  grid3:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14},
  card:{borderRadius:20,padding:20,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)"},
  mini:{fontSize:13,opacity:.85,marginTop:8},

  steps:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12},
  step:{padding:16,borderRadius:16,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.05)"},
  number:{width:28,height:28,borderRadius:8,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800,background:"rgba(39,227,138,.2)",border:"1px solid rgba(39,227,138,.5)",marginRight:10},

  apiRow:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14},
  code:{whiteSpace:"pre-wrap",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:12,background:"rgba(0,0,0,.25)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:12,marginTop:8},

  support:{display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:16},
  input:{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.06)",color:"#fff",outline:"none"},
  textarea:{width:"100%",minHeight:120,padding:"10px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.06)",color:"#fff",outline:"none"},

  footer:{marginTop:30,padding:"18px 0",borderTop:"1px solid rgba(255,255,255,.12)",opacity:.9,fontSize:14,display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}
};

export default function Home(){
  const [contact,setContact] = useState({name:"",email:"",msg:""});

  const onSend = (e)=>{
    e.preventDefault();
    const subject = encodeURIComponent("Genio — Contact");
    const body = encodeURIComponent(`Name: ${contact.name}\nEmail: ${contact.email}\n\n${contact.msg}`);
    // mailto كبداية بدون باك-إند
    if (typeof window !== "undefined") {
      window.location.href = `mailto:support@genio.systems?subject=${subject}&body=${body}`;
    }
  };

  return (
    <>
      <Head>
        <title>Genio KYC OS — Multi-Modal KYC with On-Chain Attestation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>

      <main style={ui.page}>
        {/* NAVBAR */}
        <header style={ui.header}>
          <div style={ui.container}>
            <nav style={ui.nav}>
              <div style={ui.brand}>
                <span style={{fontSize:18}}>Genio</span>
                <span style={ui.brandTiny}>KYC&nbsp;OS</span>
              </div>
              <div style={ui.navLinks}>
                <Link href="/" style={ui.link}>Home</Link>
                <Link href="/kyc" style={ui.link}>KYC</Link>
                <Link href="/dashboard" style={ui.link}>Dashboard</Link>
                <Link href="/support" style={ui.link}>Support</Link>
                <Link href="/login" style={ui.link}>Login</Link>
                {/* CTA مرة واحدة فقط بالهبوط وليس مكرر */}
              </div>
            </nav>
          </div>
        </header>

        <div style={ui.container}>
          {/* HERO */}
          <section style={ui.hero}>
            <div>
              <h1 style={ui.h1}>Verified identity. Portable. On-chain proof.</h1>
              <p style={ui.p}>
                Verify once with <b>multi-modal KYC</b>: documents + biometrics + liveness.
                We store only <b>hash-based attestations</b> on-chain — privacy by design.
              </p>
              <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
                <Link href="/kyc" style={ui.cta}>Get Verified</Link>
                <a href="#how" style={{...ui.link,border:"1px solid rgba(255,255,255,.2)",padding:"10px 14px",borderRadius:12}}>How it works</a>
              </div>
              <div style={ui.heroBadges}>
                <span style={ui.badge}>🧩 Multi-Modal KYC</span>
                <span style={ui.badge}>🔗 On-Chain Attestation</span>
                <span style={ui.badge}>🛡️ Privacy-First</span>
                <span style={ui.badge}>📱 Mobile-Ready</span>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section style={ui.section}>
            <h2 style={ui.h2}>Why Genio KYC OS?</h2>
            <div style={ui.grid3}>
              <div style={ui.card}>
                <h3 style={{margin:"0 0 6px"}}>Multi-Modal Identity</h3>
                <p style={ui.p}>Official ID, facial biometrics, liveness, and proof of residence. Stronger than single-factor checks.</p>
                <div style={ui.mini}>Residence ≠ Citizenship captured separately to avoid false rejections.</div>
              </div>
              <div style={ui.card}>
                <h3 style={{margin:"0 0 6px"}}>On-Chain, Not On-Display</h3>
                <p style={ui.p}>Only salted hashes & attestations go on-chain. No raw images or PII on public networks.</p>
                <div style={ui.mini}>Portable Genio ID others can verify without re-uploading your documents.</div>
              </div>
              <div style={ui.card}>
                <h3 style={{margin:"0 0 6px"}}>Developer-Friendly</h3>
                <p style={ui.p}>Simple API: /api/biometrics for face embedding → /api/attest to anchor proofs on-chain.</p>
                <div style={ui.mini}>Start on testnet; switch network later without changing your client flow.</div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" style={ui.section}>
            <h2 style={ui.h2}>How it works</h2>
            <div style={ui.steps}>
              <div style={ui.step}>
                <div><span style={ui.number}>1</span><b>Personal Info</b></div>
                <p style={ui.p}>Name, DOB, <b>Residence</b> & <b>Citizenship</b>. Contact optional.</p>
              </div>
              <div style={ui.step}>
                <div><span style={ui.number}>2</span><b>ID Upload</b></div>
                <p style={ui.p}>Passport (photo page) or National/Driver (front+back). Client-side checks before submit.</p>
              </div>
              <div style={ui.step}>
                <div><span style={ui.number}>3</span><b>Biometrics + Liveness</b></div>
                <p style={ui.p}>Selfie → server extracts a face embedding and returns <b>HMAC hash</b> (no raw face stored).</p>
              </div>
              <div style={ui.step}>
                <div><span style={ui.number}>4</span><b>On-Chain Attestation</b></div>
                <p style={ui.p}>We anchor salted hashes on-chain. Relying parties verify your Genio ID without re-KYC.</p>
              </div>
            </div>
          </section>

          {/* API PREVIEW (شرح فقط) */}
          <section style={ui.section}>
            <h2 style={ui.h2}>API preview</h2>
            <div style={ui.apiRow}>
              <div style={ui.card}>
                <b>/api/biometrics</b>
                <div style={ui.code}>
{`POST multipart/form-data
- selfie: image/jpeg|png

Response:
{ "embeddingHash": "base64-HMAC-SHA256(embedding)" }`}
                </div>
              </div>
              <div style={ui.card}>
                <b>/api/attest</b>
                <div style={ui.code}>
{`POST application/json
{
  "payloadHash": "...",
  "frontHash": "...",
  "backHash": "...",
  "selfieHash": "...",
  "embeddingHash": "...",
  "salt": "base64",
  "meta": { "idType": "passport", "ts": 1710000000 }
}

Response:
{ "attestationId": "att-xyz" }  // or { "txHash": "0x..." }`}
                </div>
              </div>
            </div>
          </section>

          {/* SUPPORT & CONTACT */}
          <section style={ui.section}>
            <div style={{display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:16}}>
              <div style={ui.card}>
                <h2 style={ui.h2}>Support</h2>
                <p style={ui.p}>Need help with verification, integration, or testnet setup?</p>
                <ul style={{lineHeight:1.8,marginTop:6,paddingLeft:18}}>
                  <li>Preparing passport / ID captures (corners, glare, size)</li>
                  <li>Biometrics & liveness best practices</li>
                  <li>Attestation & on-chain verification flows</li>
                </ul>
                <div style={{marginTop:12}}>
                  <Link href="/kyc" style={ui.cta}>Start KYC</Link>
                </div>
              </div>
              <div style={ui.card}>
                <h2 style={ui.h2}>Contact us</h2>
                <form onSubmit={onSend}>
                  <div style={{display:"grid",gap:10}}>
                    <input
                      style={ui.input}
                      placeholder="Your name"
                      value={contact.name}
                      onChange={(e)=>setContact({...contact,name:e.target.value})}
                    />
                    <input
                      style={ui.input}
                      placeholder="Email"
                      value={contact.email}
                      onChange={(e)=>setContact({...contact,email:e.target.value})}
                    />
                    <textarea
                      style={ui.textarea}
                      placeholder="How can we help?"
                      value={contact.msg}
                      onChange={(e)=>setContact({...contact,msg:e.target.value})}
                    />
                    <button type="submit" style={{...ui.cta,border:"none",cursor:"pointer",textAlign:"center"}}>
                      Send message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={ui.footer}>
            <div>© {new Date().getFullYear()} Genio KYC OS</div>
            <div style={{display:"flex",gap:14}}>
              <Link href="/privacy" style={ui.link}>Privacy</Link>
              <Link href="/terms" style={ui.link}>Terms</Link>
              <a href="mailto:support@genio.systems" style={ui.link}>support@genio.systems</a>
              <Link href="/kyc" style={ui.link}>Get Verified</Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

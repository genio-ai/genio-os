// pages/index.js — Genio KYC OS: Home + KYC + Support + FAQ + Footer (SSR-safe)

import Head from "next/head";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

/* ================= UI ================= */
const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(11,29,58,0.85)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.08)"},
  nav:{maxWidth:1200,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  brand:{fontWeight:800,fontSize:18,letterSpacing:.4},
  navUl:{display:"flex",gap:18,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,0.9)",textDecoration:"none"},
  cta:{padding:"8px 12px",borderRadius:10,fontWeight:700,background:"linear-gradient(90deg,#27E38A,#27D4F0)",color:"#022",border:"none"},

  heroWrap:{maxWidth:1200,margin:"0 auto",padding:"42px 16px 8px"},
  hero:{border:"1px solid rgba(255,255,255,0.08)",background:"linear-gradient(160deg,#0F2951,#0B1D3A)",borderRadius:24,padding:"28px 24px"},
  h0:{fontSize:40,fontWeight:900,margin:"0 0 8px"},
  sub:{opacity:.9,margin:"0 0 14px",lineHeight:1.6},
  bullets:{display:"flex",gap:10,flexWrap:"wrap",marginTop:6},
  chip:{padding:"6px 10px",borderRadius:999,border:"1px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.06)",fontSize:12},

  wrap:{maxWidth:980,margin:"0 auto",padding:"18px 16px 56px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:28,fontWeight:900,margin:"0 0 6px"},
  p:{opacity:.9,lineHeight:1.6,margin:"0 0 14px"},

  steps:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"6px 0 10px"},
  step:{textAlign:"center",padding:"10px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",opacity:.65,display:"flex",alignItems:"center",justifyContent:"center",gap:8},
  stepAct:{opacity:1,background:"rgba(255,255,255,0.08)"},
  progBarWrap:{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",margin:"8px 0 18px"},
  progBarFill:(w)=>({height:"100%",width:`${w}%`,background:"linear-gradient(90deg,#27E38A,#27D4F0)"}),

  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:12},
  field:{display:"flex",flexDirection:"column",gap:6,position:"relative"},
  label:{fontWeight:700,fontSize:14,opacity:.9},
  req:{position:"absolute",right:10,top:-8,background:"#7d2330",border:"1px solid #b84a5d",color:"#fff",fontSize:12,padding:"4px 8px",borderRadius:999},
  optional:{position:"absolute",right:10,top:-8,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",fontSize:12,padding:"4px 8px",borderRadius:999},

  input:{borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"#fff",padding:"10px 12px",outline:"none"},
  select:{borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"#fff",padding:"10px 12px",outline:"none"},

  dz:(isDrag)=>({borderRadius:12,padding:"18px",border:`2px dashed ${isDrag? "#27E38A":"rgba(255,255,255,.35)"}`,background:isDrag? "rgba(39,227,138,.08)":"rgba(255,255,255,.05)",textAlign:"center",cursor:"pointer"}),
  note:{fontSize:12,opacity:.72,marginTop:6},
  preview:{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"},
  img:{width:140,height:94,objectFit:"cover",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)"},
  row:{display:"flex",gap:12,flexWrap:"wrap",marginTop:18},
  btnPri:{borderRadius:12,padding:"10px 16px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",border:"none",cursor:"pointer"},
  btn:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer"},
  btnDis:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",cursor:"not-allowed"},
  err:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  ok:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},

  contact:{maxWidth:980,margin:"36px auto 0",padding:"0 16px"},
  contactGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14},
  contactCard:{border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",borderRadius:16,padding:"14px 16px"},
  contactBtn:{display:"inline-block",marginTop:10,padding:"10px 14px",borderRadius:10,fontWeight:700,background:"linear-gradient(90deg,#27E38A,#27D4F0)",color:"#022",textDecoration:"none"},

  faq:{maxWidth:980,margin:"24px auto 0",padding:"0 16px"},
  faqItem:{border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",marginTop:10},

  policies:{maxWidth:980,margin:"36px auto 0",padding:"0 16px"},
  policyCard:{border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",marginTop:10},

  foot:{maxWidth:1200,margin:"36px auto 0",padding:"18px 16px",opacity:.7,borderTop:"1px solid rgba(255,255,255,0.08)"}
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

/* ============== Helpers ============== */
const countries = [
  {code:"AE", name:"United Arab Emirates 🇦🇪"},{code:"SA", name:"Saudi Arabia 🇸🇦"},
  {code:"QA", name:"Qatar 🇶🇦"},{code:"KW", name:"Kuwait 🇰🇼"},{code:"BH", name:"Bahrain 🇧🇭"},
  {code:"OM", name:"Oman 🇴🇲"},{code:"JO", name:"Jordan 🇯🇴"},{code:"EG", name:"Egypt 🇪🇬"},
  {code:"MA", name:"Morocco 🇲🇦"},{code:"LB", name:"Lebanon 🇱🇧"},
  {code:"GB", name:"United Kingdom 🇬🇧"},{code:"IE", name:"Ireland 🇮🇪"},
  {code:"FR", name:"France 🇫🇷"},{code:"DE", name:"Germany 🇩🇪"},{code:"ES", name:"Spain 🇪🇸"},
  {code:"IT", name:"Italy 🇮🇹"},{code:"NL", name:"Netherlands 🇳🇱"},{code:"SE", name:"Sweden 🇸🇪"},
  {code:"US", name:"United States 🇺🇸"},{code:"CA", name:"Canada 🇨🇦"},{code:"BR", name:"Brazil 🇧🇷"},
  {code:"TR", name:"Türkiye 🇹🇷"},{code:"IN", name:"India 🇮🇳"},{code:"PK", name:"Pakistan 🇵🇰"},
  {code:"SG", name:"Singapore 🇸🇬"},{code:"MY", name:"Malaysia 🇲🇾"},{code:"PH", name:"Philippines 🇵🇭"},
  {code:"ZA", name:"South Africa 🇿🇦"},{code:"KE", name:"Kenya 🇰🇪"},{code:"NG", name:"Nigeria 🇳🇬"},
];

const tooBig = (f)=> f && f.size>MAX_SIZE ? "File too large (8MB max)" : "";

/* ============= DropZone ============= */
function DropZone({ label, required, onFile, accept = "image/jpeg,image/png,application/pdf", previewUrl }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const handlePick = () => { inputRef.current?.click(); };
  const handleDrop = (e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer?.files?.[0]; if (f) onFile?.(f); };
  const handleChange = (e) => { const f = e.target.files?.[0] || null; onFile?.(f); };
  const acceptLabel = (accept || "").split(",").join(", ");

  return (
    <div className="dz">
      <div style={ui.field}>
        <label style={ui.label}>{label}</label>
        {required ? <span style={ui.req}>Required</span> : <span style={ui.optional}>Optional</span>}
      </div>
      <div
        onDragOver={(e)=>{e.preventDefault(); setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={handleDrop}
        onClick={handlePick}
        role="button" tabIndex={0}
        onKeyDown={(e)=>{ if(e.key==="Enter" || e.key===" ") handlePick(); }}
        style={ui.dz(drag)}
      >
        Drop file here or click to upload
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} style={{display:"none"}}/>
      {previewUrl && <div style={ui.preview}><img src={previewUrl} style={ui.img} alt="preview"/></div>}
      <div style={ui.note}>Max 8MB. Allowed: {acceptLabel}</div>
    </div>
  );
}

/* ============== Page ============== */
export default function Home(){
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({
    fullName:"", dob:"", residence:"", citizenship:"", phone:"", email:"", address:"",
    idType:"passport", consent:false
  });
  const [idFront,setIdFront] = useState(null);
  const [idBack,setIdBack]   = useState(null);
  const [selfie,setSelfie]   = useState(null);
  const [msg,setMsg] = useState({ok:false,text:""});

  const preview = useMemo(()=>({
    idFront: idFront ? URL.createObjectURL(idFront) : "",
    idBack : idBack  ? URL.createObjectURL(idBack)  : "",
    selfie : selfie  ? URL.createObjectURL(selfie)  : "",
  }),[idFront,idBack,selfie]);

  const need = (x)=>!x || String(x).trim()==="";
  const validStep = ()=>{
    if(step===1){
      if(need(form.fullName) || need(form.dob) || need(form.residence) || need(form.citizenship))
        return "Full name, date of birth, residence and citizenship are required";
      if(form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format";
      if(form.phone && !/^\+?[0-9()\-\s]{7,}$/.test(form.phone)) return "Invalid phone number";
      return "";
    }
    if(step===2){
      if(!idFront) return "ID (front) is required";
      if(form.idType!=="passport" && !idBack) return "ID (back) is required";
      return tooBig(idFront) || tooBig(idBack) || "";
    }
    if(step===3){
      if(!selfie) return "Selfie with the same ID is required";
      if(!form.consent) return "You must accept the consent";
      return tooBig(selfie) || "";
    }
    return "";
  };

  const canSubmit = !!(
    form.fullName && form.dob && form.residence && form.citizenship &&
    idFront && (form.idType==="passport" || idBack) &&
    selfie && form.consent
  );
  const stepPct = step===1? 20 : step===2? 60 : 100;

  const onChange = (e)=>{
    const {name,value,type,checked} = e.target;
    setForm((p)=>({...p,[name]: type==="checkbox"? checked : value}));
  };
  const next = ()=>{
    const e = validStep();
    if(e){ setMsg({ok:false,text:e}); return; }
    setMsg({ok:true,text:"Looks good"}); setStep((s)=>Math.min(3,s+1));
  };
  const back = ()=>{ setMsg({ok:false,text:""}); setStep((s)=>Math.max(1,s-1)); };
  const handleSubmit = (e)=>{
    e.preventDefault();
    const eMsg = validStep();
    if(eMsg){ setMsg({ok:false,text:eMsg}); return; }
    const ref = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2,8)}`;
    setMsg({ok:true,text:`Submitted successfully. Reference: ${ref}. (Demo – no backend yet)`});
  };
  const stepDone = (n)=> (n<step);

  return (
    <>
      <Head><title>Genio KYC OS — Identity Verification</title></Head>

      <main style={ui.page}>
        {/* NAV */}
        <header style={ui.header}>
          <nav style={ui.nav}>
            <div style={ui.brand}>Genio KYC OS</div>
            <ul style={ui.navUl}>
              <li><Link href="/" style={ui.link}>Home</Link></li>
              <li><a href="#start" style={ui.link}>KYC</a></li>
              <li><a href="#support" style={ui.link}>Support</a></li>
              <li><Link href="/dashboard" style={ui.link}>Dashboard</Link></li>
              <li><Link href="/login" style={ui.link}>Login</Link></li>
            </ul>
            <a href="#start" style={ui.cta}>Get Verified</a>
          </nav>
        </header>

        {/* HERO */}
        <section style={ui.heroWrap}>
          <div style={ui.hero}>
            <h1 style={ui.h0}>Identity Verification, simplified.</h1>
            <p style={ui.sub}>
              Verify once in three quick steps. Separate <b>Residence</b> and <b>Citizenship</b>.
              Strict file checks. Clean, mobile-first UX.
            </p>
            <div style={{textAlign:"center",marginTop:16}}>
              <a href="#start"
                 style={{display:"inline-block",padding:"14px 28px",borderRadius:12,fontWeight:800,fontSize:16,color:"#022",
                         background:"linear-gradient(90deg,#27E38A,#27D4F0)",textDecoration:"none"}}>
                Get Verified
              </a>
            </div>
            <div style={ui.bullets}>
              <span style={ui.chip}>🔒 Privacy-first</span>
              <span style={ui.chip}>⚡ Fast & modern</span>
              <span style={ui.chip}>🧩 Vendor-agnostic</span>
              <span style={ui.chip}>📱 Mobile-friendly</span>
            </div>
          </div>
        </section>

        {/* KYC BODY */}
        <section id="start" style={ui.wrap}>
          <div style={ui.card}>
            <h2 style={ui.h1}>Begin Verification</h2>
            <p style={ui.p}>Complete the required checks. Your files are validated locally before submission (demo).</p>

            {/* Steps */}
            <div style={ui.steps}>
              <div style={{...ui.step, ...(step===1?ui.stepAct:{} )}}>
                {stepDone(1) ? "✔️" : "1."} Personal Info
              </div>
              <div style={{...ui.step, ...(step===2?ui.stepAct:{} )}}>
                {stepDone(2) ? "✔️" : "2."} ID Upload
              </div>
              <div style={{...ui.step, ...(step===3?ui.stepAct:{} )}}>
                {stepDone(3) ? "✔️" : "3."} Selfie & Consent
              </div>
            </div>
            <div style={ui.progBarWrap}><div style={ui.progBarFill(stepPct)} /></div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step===1 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>Full name</label>
                      <span style={ui.req}>Required</span>
                      <input style={ui.input} name="fullName" value={form.fullName} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Date of birth</label>
                      <span style={ui.req}>Required</span>
                      <input style={ui.input} type="date" name="dob" value={form.dob} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Country of Residence</label>
                      <span style={ui.req}>Required</span>
                      <select style={ui.select} name="residence" value={form.residence} onChange={onChange}>
                        <option value="">Select residence…</option>
                        {countries.map(c=>(<option key={"r-"+c.code} value={c.name}>{c.name}</option>))}
                      </select>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Citizenship</label>
                      <span style={ui.req}>Required</span>
                      <select style={ui.select} name="citizenship" value={form.citizenship} onChange={onChange}>
                        <option value="">Select citizenship…</option>
                        {countries.map(c=>(<option key={"c-"+c.code} value={c.name}>{c.name}</option>))}
                      </select>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Phone</label>
                      <input style={ui.input} name="phone" placeholder="+971…" value={form.phone} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Email</label>
                      <input style={ui.input} name="email" placeholder="you@company.com" value={form.email} onChange={onChange}/>
                    </div>
                    <div style={{...ui.field, gridColumn:"1 / -1"}}>
                      <label style={ui.label}>Address</label>
                      <span style={ui.optional}>Optional</span>
                      <input style={ui.input} name="address" value={form.address} onChange={onChange}/>
                    </div>
                  </div>
                  <div style={ui.row}>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                    <button type="button" onClick={()=>setForm({fullName:"",dob:"",residence:"",citizenship:"",phone:"",email:"",address:"",idType:"passport",consent:false})} style={ui.btn}>Clear</button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step===2 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>ID type</label>
                      <select name="idType" value={form.idType} onChange={onChange} style={ui.select}>
                        <option value="passport">Passport</option>
                        <option value="nid">National ID</option>
                        <option value="dl">Driver License</option>
                        <option value="rp">Resident Permit</option>
                      </select>
                      <div style={ui.note}>Passport: one photo. Others: front + back.</div>
                    </div>
                    <DropZone label="Upload ID (front)" required onFile={setIdFront} accept="image/jpeg,image/png,application/pdf" previewUrl={preview.idFront}/>
                    {form.idType!=="passport" && (
                      <DropZone label="Upload ID (back)" required onFile={setIdBack} accept="image/jpeg,image/png,application/pdf" previewUrl={preview.idBack}/>
                    )}
                  </div>
                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step===3 && (
                <>
                  <div style={ui.grid}>
                    <DropZone label="Upload selfie holding your ID" required onFile={setSelfie} accept="image/jpeg,image/png" previewUrl={preview.selfie}/>
                  </div>
                  <div style={{marginTop:12}}>
                    <label style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                      <span>I confirm the information is accurate and I consent to verification & secure processing.</span>
                    </label>
                    <div style={ui.note}>By submitting, you agree to our <a href="#privacy" style={ui.link}>Privacy</a> and <a href="#terms" style={ui.link}>Terms</a>.</div>
                  </div>
                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="submit" disabled={!canSubmit} style={canSubmit?ui.btnPri:ui.btnDis}>Submit for Verification</button>
                  </div>
                </>
              )}
            </form>

            {msg.text && <div style={msg.ok?ui.ok:ui.err}>{msg.text}</div>}
          </div>
        </section>

        {/* CONTACT & SUPPORT */}
        <section id="support" style={ui.contact}>
          <h2 style={ui.h1}>Contact & Support</h2>
          <p style={ui.p}>Need help? Reach us anytime. We usually reply within a few hours.</p>
          <div style={ui.contactGrid}>
            <div style={ui.contactCard}>
              <b>Email</b>
              <div style={ui.p}>For general questions, onboarding, or reporting issues.</div>
              <a href="mailto:support@genio.systems?subject=Support%20Request" style={ui.contactBtn}>Email support@genio.systems</a>
              <div style={ui.note}>Hours: Sun–Thu 9:00–18:00 (GMT+3)</div>
            </div>
            <div style={ui.contactCard}>
              <b>Live Chat</b>
              <div style={ui.p}>Prefer quick chat? Use WhatsApp or Telegram.</div>
              <a href="https://wa.me/000000000000" target="_blank" rel="noreferrer" style={ui.contactBtn}>WhatsApp</a>
              <a href="https://t.me/genio_support" target="_blank" rel="noreferrer" style={{...ui.contactBtn,marginLeft:8}}>Telegram</a>
              <div style={ui.note}>In-app chat widget coming soon.</div>
            </div>
            <div style={ui.contactCard}>
              <b>Status & Incidents</b>
              <div style={ui.p}>Check availability and any ongoing incidents.</div>
              <a href="https://status.genio.systems" target="_blank" rel="noreferrer" style={ui.contactBtn}>Status page</a>
              <div style={ui.note}>Subscribe for updates & maintenance windows.</div>
            </div>
            <div style={ui.contactCard}>
              <b>Security</b>
              <div style={ui.p}>Found a vulnerability? Report responsibly.</div>
              <a href="mailto:security@genio.systems?subject=Security%20Report" style={ui.contactBtn}>security@genio.systems</a>
              <div style={ui.note}>PGP key & policy coming soon.</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={ui.faq}>
          <h3 style={ui.h1}>FAQ</h3>
          <div style={ui.faqItem}><b>Is this a production KYC?</b><div style={ui.p}>This is a demo flow. No live provider is connected yet.</div></div>
          <div style={ui.faqItem}><b>Which documents are accepted?</b><div style={ui.p}>Passport, National ID, Driver License, or Residence Permit. Max 8MB; JPG/PNG/PDF.</div></div>
          <div style={ui.faqItem}><b>What personal data do you collect?</b><div style={ui.p}>Name, DOB, residence, citizenship, contact info, and the images you upload for verification.</div></div>
        </section>

        {/* PRIVACY & TERMS */}
        <section id="privacy" style={ui.policies}>
          <h3 style={ui.h1}>Privacy Policy (Summary)</h3>
          <div style={ui.policyCard}>
            <div style={ui.p}>
              In this demo, files are validated client-side only. No data is sent to a backend.
              Production setup will follow applicable regulations and our full privacy policy.
            </div>
          </div>
        </section>

        <section id="terms" style={ui.policies}>
          <h3 style={ui.h1}>Terms of Service (Summary)</h3>
          <div style={ui.policyCard}>
            <div style={ui.p}>
              This demo is provided “as is” without warranties. You are responsible for the accuracy of your information.
              We may change or discontinue the service at any time.
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={ui.foot}>
          © {new Date().getFullYear()} Genio KYC OS —
          <a href="#privacy" style={ui.link}> Privacy</a> ·
          <a href="#terms" style={ui.link}> Terms</a> ·
          <a href="#support" style={ui.link}> Contact</a>
        </footer>
      </main>
    </>
  );
}

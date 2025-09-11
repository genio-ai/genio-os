// pages/kyc.js — Genio KYC OS (Enhanced Demo)
// No external deps. Works on Next.js Pages Router.
import Head from "next/head";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";

/* ---------------------- UI ---------------------- */
const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(14,35,68,0.9)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  nav:{maxWidth:1100,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  brand:{fontWeight:800,fontSize:18},
  navUl:{display:"flex",gap:18,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,0.9)",textDecoration:"none"},
  wrap:{maxWidth:980,margin:"0 auto",padding:"56px 16px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:34,fontWeight:900,margin:"0 0 6px"},
  p:{opacity:.9,lineHeight:1.6,margin:"0 0 14px"},
  tips:{borderRadius:14,padding:"12px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",fontSize:14,marginBottom:16},
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

  dz:(isDrag)=>({
    borderRadius:12,
    padding:"18px",
    border:`2px dashed ${isDrag? "#27E38A":"rgba(255,255,255,.35)"}`,
    background:isDrag? "rgba(39,227,138,.08)":"rgba(255,255,255,.05)",
    textAlign:"center",
    cursor:"pointer"
  }),
  note:{fontSize:12,opacity:.72,marginTop:6},
  preview:{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"},
  img:{width:140,height:94,objectFit:"cover",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)"},
  row:{display:"flex",gap:12,flexWrap:"wrap",marginTop:18},
  btnPri:{borderRadius:12,padding:"10px 16px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",border:"none",cursor:"pointer"},
  btn:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer"},
  err:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  ok:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
  scoreWrap:{marginTop:8},
  scoreBar:(v)=>({height:10,borderRadius:99,overflow:"hidden",background:"rgba(255,255,255,.12)",position:"relative"}),
  scoreFill:(v)=>({height:"100%",width:`${v}%`,background:`linear-gradient(90deg, ${v<50?"#ff5b5b":v<75?"#ffc857":"#2ee6a1"}, #27D4F0)`}),
  badge:{display:"inline-block",padding:"6px 10px",borderRadius:999,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.06)",fontSize:12,marginRight:8}
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const DRAFT_KEY = "genio_kyc_draft";
const SUBMIT_KEY = "genio_kyc_submissions";

/* ------------------ Helpers ------------------ */
const countries = [
  {code:"JO", name:"Jordan 🇯🇴"},
  {code:"AE", name:"United Arab Emirates 🇦🇪"},
  {code:"SA", name:"Saudi Arabia 🇸🇦"},
  {code:"QA", name:"Qatar 🇶🇦"},
  {code:"EG", name:"Egypt 🇪🇬"},
  {code:"US", name:"United States 🇺🇸"},
  {code:"GB", name:"United Kingdom 🇬🇧"}
];

function maskPhone(p){ if(!p) return ""; return p.replace(/.(?=.{2})/g,"*"); }

/* --------------- Drag & Drop box --------------- */
function DropZone({label,required,onFile,accept="image/*,application/pdf",previewUrl}) {
  const [drag,setDrag] = useState(false);
  return (
    <div className="dz">
      <div style={ui.field}>
        <label style={ui.label}>{label}</label>
        {required ? <span style={ui.req}>Required</span> : null}
      </div>
      <div
        onDragOver={(e)=>{e.preventDefault(); setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={(e)=>{e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; f && onFile(f);}}
        onClick={()=>document.getElementById(label).click()}
        style={ui.dz(drag)}
      >
        Drop file here or click to upload
      </div>
      <input id={label} type="file" accept={accept} onChange={(e)=>onFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
      {previewUrl && <div style={ui.preview}><img src={previewUrl} style={ui.img} alt="preview"/></div>}
      <div style={ui.note}>Max 8MB. JPG/PNG/PDF are accepted.</div>
    </div>
  );
}

/* ------------------ Main Page ------------------ */
export default function KYC(){
  const [step,setStep] = useState(1);

  // form state
  const [form,setForm] = useState({
    fullName:"", dob:"", country:"", phone:"", email:"", address:"",
    idType:"passport", consent:false
  });

  // files
  const [idFront,setIdFront] = useState(null);
  const [idBack,setIdBack]   = useState(null);
  const [selfie,setSelfie]   = useState(null);

  // messages
  const [msg,setMsg] = useState({ok:false,text:""});

  // previews
  const preview = useMemo(()=>({
    idFront: idFront ? URL.createObjectURL(idFront) : "",
    idBack : idBack  ? URL.createObjectURL(idBack)  : "",
    selfie : selfie  ? URL.createObjectURL(selfie)  : "",
  }),[idFront,idBack,selfie]);

  // draft: load once
  useEffect(()=>{
    try{
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY)||"{}");
      if(d && Object.keys(d).length){ setForm((p)=>({...p,...d})); }
    }catch{}
  },[]);
  // draft: save text fields automatically
  useEffect(()=>{
    const toSave = {...form}; // files لا تُحفظ
    localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
  },[form]);

  // simple checks
  const tooBig = (f)=> f && f.size>MAX_SIZE ? "File too large (8MB max)" : "";
  const need = (x)=>!x || String(x).trim()==="";
  const validStep = ()=>{
    if(step===1){
      if(need(form.fullName) || need(form.dob) || need(form.country)) return "Name, date of birth and country are required";
      if(form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format";
      if(form.phone && !/^\+?[0-9\-() ]{7,}$/.test(form.phone)) return "Invalid phone number";
      return "";
    }
    if(step===2){
      if(!idFront) return "ID (front) is required";
      if(form.idType!=="passport" && !idBack) return "ID (back) is required";
      return tooBig(idFront) || tooBig(idBack);
    }
    if(step===3){
      if(!selfie) return "Selfie with the same ID is required";
      if(!form.consent) return "You must accept the consent";
      return tooBig(selfie);
    }
    return "";
  };

  // AI score (demo): يحسب 0..100 حسب اكتمال الحقول والملفات
  const score = useMemo(()=>{
    let s = 0;
    if(form.fullName) s+=10;
    if(form.dob) s+=10;
    if(form.country) s+=10;
    if(form.phone) s+=5;
    if(form.email) s+=5;
    if(idFront) s+=25;
    if(form.idType!=="passport" && idBack) s+=15;
    if(selfie) s+=20;
    if(form.consent) s+=5;
    s = Math.min(100, Math.max(0, s));
    return s;
  },[form,idFront,idBack,selfie]);

  // progress percent
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

    // Decision (demo)
    let status = "pending";
    if(score>=85) status="approved";
    if(score<50) status="rejected";

    const rec = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      status, score,
      submittedAt: new Date().toISOString(),
      ...form,
      phoneMasked: maskPhone(form.phone || "")
    };

    try{
      const list = JSON.parse(localStorage.getItem(SUBMIT_KEY)||"[]");
      list.push(rec);
      localStorage.setItem(SUBMIT_KEY, JSON.stringify(list));
      setMsg({ok:true,text:`Submitted. Status: ${status.toUpperCase()} (score ${score}%). View it in Dashboard.`});
      // clear draft but احتفظ بالبلد والنوع
      localStorage.setItem(DRAFT_KEY, JSON.stringify({country:form.country,idType:form.idType}));
    }catch{
      setMsg({ok:false,text:"Unexpected error while saving"});
    }
  };

  const exportCSV = ()=>{
    const rows = JSON.parse(localStorage.getItem(SUBMIT_KEY)||"[]");
    if(!rows.length){ alert("No submissions yet"); return; }
    const cols = ["id","status","score","fullName","dob","country","phoneMasked","email","submittedAt"];
    const csv = [cols.join(",")]
      .concat(rows.map(r=>cols.map(k=>`"${(r[k]??"").toString().replace(/"/g,'""')}"`).join(",")))
      .join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="genio-kyc-submissions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = ()=>{
    const now = new Date().toLocaleString();
    const html = `
      <html><head><meta charset="utf-8"><title>Genio KYC Report</title>
      <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:24px}
      h1{margin:0 0 6px} .b{font-weight:700} table{border-collapse:collapse;margin-top:12px}
      td,th{border:1px solid #ccc;padding:8px 10px}</style></head>
      <body>
        <h1>Genio KYC OS — Verification Report</h1>
        <div>Generated: ${now}</div>
        <table>
          <tr><th>Full name</th><td>${form.fullName||"-"}</td></tr>
          <tr><th>DOB</th><td>${form.dob||"-"}</td></tr>
          <tr><th>Country</th><td>${form.country||"-"}</td></tr>
          <tr><th>Phone</th><td>${maskPhone(form.phone||"")}</td></tr>
          <tr><th>Email</th><td>${form.email||"-"}</td></tr>
          <tr><th>ID Type</th><td>${form.idType}</td></tr>
          <tr><th>AI Score</th><td>${score}%</td></tr>
        </table>
        <p style="margin-top:12px;font-size:12px">This is a demo, not a legal verification. Images are not embedded.</p>
        <script>window.print()</script>
      </body></html>`;
    const blob = new Blob([html],{type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="genio-kyc-report.html"; a.click();
    URL.revokeObjectURL(url);
  };

  const stepDone = (n)=> (n<step);

  return (
    <>
      <Head><title>KYC — Genio KYC OS</title></Head>

      <main style={ui.page}>
        {/* Nav */}
        <header style={ui.header}>
          <nav style={ui.nav}>
            <div style={ui.brand}>Genio KYC OS</div>
            <ul style={ui.navUl}>
              <li><Link href="/" style={ui.link}>Home</Link></li>
              <li><Link href="/kyc" style={ui.link}>KYC</Link></li>
              <li><Link href="/dashboard" style={ui.link}>Dashboard</Link></li>
              <li><Link href="/login" style={ui.link}>Login</Link></li>
            </ul>
          </nav>
        </header>

        {/* Body */}
        <section style={ui.wrap}>
          <div style={ui.card}>
            <h1 style={ui.h1}>Begin Verification</h1>
            <p style={ui.p}>Advanced demo flow (no provider connected yet). Draft is saved automatically (text fields only).</p>

            {/* Quick tips */}
            <div style={ui.tips}>
              <span style={ui.badge}>📸 Good lighting</span>
              <span style={ui.badge}>🪪 All corners visible</span>
              <span style={ui.badge}>🤳 Selfie with same ID</span>
              <span style={ui.badge}>🛂 Passport: photo page</span>
              <span style={ui.badge}>🪪 National/Driver: front + back</span>
            </div>

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

            {/* AI Score */}
            <div style={ui.scoreWrap}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{opacity:.8}}>AI Readiness Score</div>
                <div style={{fontWeight:700}}>{score}%</div>
              </div>
              <div style={ui.scoreBar(score)}><div style={ui.scoreFill(score)} /></div>
            </div>

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
                      <label style={ui.label}>Country</label>
                      <span style={ui.req}>Required</span>
                      <select style={ui.select} name="country" value={form.country} onChange={onChange}>
                        <option value="">Select country…</option>
                        {countries.map(c=>(<option key={c.code} value={c.name}>{c.name}</option>))}
                      </select>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Phone</label>
                      <input style={ui.input} name="phone" placeholder="+962…" value={form.phone} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Email</label>
                      <input style={ui.input} name="email" placeholder="you@company.com" value={form.email} onChange={onChange}/>
                    </div>
                    <div style={{...ui.field, gridColumn:"1 / -1"}}>
                      <label style={ui.label}>Address</label>
                      <span style={ui.optional}>(optional)</span>
                      <input style={ui.input} name="address" value={form.address} onChange={onChange}/>
                    </div>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                    <button type="button" onClick={()=>localStorage.setItem(DRAFT_KEY, JSON.stringify(form))} style={ui.btn}>Save Draft</button>
                    <button type="button" onClick={()=>{localStorage.removeItem(DRAFT_KEY); setForm({fullName:"",dob:"",country:"",phone:"",email:"",address:"",idType:"passport",consent:false});}} style={ui.btn}>Clear Draft</button>
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

                    <DropZone label="Upload ID (front)" required onFile={setIdFront} previewUrl={preview.idFront}/>
                    {form.idType!=="passport" && (
                      <DropZone label="Upload ID (back)" required onFile={setIdBack} previewUrl={preview.idBack}/>
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
                    <DropZone label="Upload selfie holding your ID" required accept="image/*" onFile={setSelfie} previewUrl={preview.selfie}/>
                  </div>

                  <div style={{marginTop:12}}>
                    <label style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                      <span>I confirm information is accurate and I consent to verification & secure sharing with licensed providers.</span>
                    </label>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="submit" style={ui.btnPri}>Submit for Review</button>
                    <button type="button" onClick={exportCSV} style={ui.btn}>Export CSV</button>
                    <button type="button" onClick={downloadReport} style={ui.btn}>Download Report (HTML)</button>
                    <Link href="/dashboard" style={ui.link}><button type="button" style={ui.btn}>Go to Dashboard</button></Link>
                  </div>
                </>
              )}
            </form>

            {msg.text && <div style={msg.ok?ui.ok:ui.err}>{msg.text}</div>}
          </div>
        </section>
      </main>
    </>
  );
}

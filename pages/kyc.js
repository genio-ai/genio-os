// pages/kyc.js — Genio KYC OS (Pro KYC Flow)
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(14,35,68,0.9)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  nav:{maxWidth:1100,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  brand:{fontWeight:800,fontSize:18},
  navUl:{display:"flex",gap:18,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,0.9)",textDecoration:"none"},
  wrap:{maxWidth:950,margin:"0 auto",padding:"56px 16px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:32,fontWeight:900,margin:"0 0 8px"},
  p:{opacity:.9,lineHeight:1.6,margin:"0 0 16px"},
  tips:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,margin:"10px 0 18px"},
  tip:{borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",padding:"10px 12px",fontSize:14,display:"flex",gap:8,alignItems:"center"},
  steps:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"6px 0 14px"},
  step:{textAlign:"center",padding:"8px 10px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",opacity:.55},
  stepAct:{opacity:1,background:"rgba(255,255,255,0.08)"},
  bar:{height:6,background:"rgba(255,255,255,0.18)",borderRadius:999,overflow:"hidden",margin:"6px 0 16px"},
  barFill:(w)=>({height:"100%",width:w,background:"linear-gradient(90deg,#27E38A,#27D4F0)"}),
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:12},
  field:{display:"flex",flexDirection:"column",gap:6},
  label:{fontWeight:700,fontSize:14,opacity:.9,display:"flex",justifyContent:"space-between"},
  hint:{fontSize:12,opacity:.7},
  input:{borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"#fff",padding:"10px 12px",outline:"none"},
  file:{borderRadius:12,border:"1px dashed rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",color:"#fff",padding:"14px 12px"},
  row:{display:"flex",gap:12,flexWrap:"wrap",marginTop:16},
  btnPri:{borderRadius:12,padding:"10px 16px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",border:"none",cursor:"pointer"},
  btn:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer",textDecoration:"none"},
  err:{marginTop:10,padding:"10px 12px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  ok:{marginTop:10,padding:"10px 12px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
  preview:{marginTop:8,display:"flex",gap:10,flexWrap:"wrap"},
  img:{width:120,height:84,objectFit:"cover",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)"},
  chip:(ok)=>({fontSize:12,borderRadius:8,padding:"2px 8px",marginLeft:8,background: ok?"rgba(39,227,138,.2)":"rgba(227,55,55,.2)",border:`1px solid ${ok?"rgba(39,227,138,.45)":"rgba(227,55,55,.45)"}`}),
  note:{fontSize:12,opacity:.72,marginTop:4},
};

const MAX_SIZE = 8*1024*1024; // 8MB
const DRAFT_KEY = "genio_kyc_draft";
const LIST_KEY  = "genio_kyc";

export default function KYC(){
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({
    fullName:"", dob:"", country:"", phone:"", email:"", address:"",
    idType:"passport", consent:false, livenessOk:false
  });
  const [idFront,setIdFront] = useState(null);
  const [idBack,setIdBack]   = useState(null);
  const [selfie,setSelfie]   = useState(null);
  const [msg,setMsg]         = useState({ok:false,text:""});

  // restore draft
  useEffect(()=>{
    try{
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
      if(d){ setForm((f)=>({...f,...d.form})); setMsg({ok:true,text:"Draft restored"}); }
    }catch{}
  },[]);
  // autosave draft
  useEffect(()=>{
    try{ localStorage.setItem(DRAFT_KEY, JSON.stringify({form})); }catch{}
  },[form]);

  const onChange = (e)=>{
    const {name,value,type,checked} = e.target;
    setForm(prev=>({...prev,[name]: type==="checkbox"? checked : value}));
  };
  const clearDraft = ()=>{ localStorage.removeItem(DRAFT_KEY); setMsg({ok:true,text:"Draft cleared"}); };

  const preview = useMemo(()=>({
    idFront: idFront ? URL.createObjectURL(idFront) : "",
    idBack : idBack  ? URL.createObjectURL(idBack)  : "",
    selfie : selfie  ? URL.createObjectURL(selfie)  : "",
  }),[idFront,idBack,selfie]);

  // live validation
  const validName   = form.fullName.trim().length>=3;
  const validDOB    = !!form.dob;
  const validCountry= !!form.country.trim();
  const validEmail  = !form.email || /^\S+@\S+\.\S+$/.test(form.email);
  const validPhone  = !form.phone || /^\+?[0-9\-() ]{7,}$/.test(form.phone);

  const checkFile = (f, imgOnly=false)=>{
    if(!f) return false;
    if(f.size>MAX_SIZE) return false;
    if(imgOnly && !f.type.startsWith("image/")) return false;
    return true;
  };

  const stepError = ()=>{
    if(step===1){
      if(!validName||!validDOB||!validCountry) return "Name, DOB and Country are required";
      if(!validEmail) return "Invalid email format";
      if(!validPhone) return "Invalid phone number";
      return "";
    }
    if(step===2){
      if(!checkFile(idFront)) return "ID (front) is required";
      if(form.idType!=="passport" && !checkFile(idBack)) return "ID (back) is required";
      return "";
    }
    if(step===3){
      if(!checkFile(selfie,true)) return "Selfie holding the ID is required";
      if(!form.livenessOk) return "Liveness check not confirmed";
      if(!form.consent) return "Consent is required";
      return "";
    }
    return "";
  };

  const next = ()=>{
    const e = stepError();
    if(e){ setMsg({ok:false,text:e}); return; }
    setMsg({ok:true,text:"Looks good"}); setStep(s=>Math.min(3,s+1));
  };
  const back = ()=>{ setMsg({ok:false,text:""}); setStep(s=>Math.max(1,s-1)); };

  const submit = (e)=>{
    e.preventDefault();
    const eMsg = stepError();
    if(eMsg){ setMsg({ok:false,text:eMsg}); return; }

    // simple decision rules (demo)
    let status = "pending";
    if(form.idType!=="passport" && !idBack) status="rejected";
    if(!form.country) status="rejected";
    if(form.livenessOk && checkFile(selfie,true)) status = status==="rejected"?"rejected":"pending";

    const record = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      status,
      ...form,
      idFrontName:idFront?.name, idBackName:idBack?.name, selfieName:selfie?.name,
      submittedAt: new Date().toISOString()
    };
    try{
      const list = JSON.parse(localStorage.getItem(LIST_KEY)||"[]");
      list.push(record);
      localStorage.setItem(LIST_KEY, JSON.stringify(list));
      localStorage.removeItem(DRAFT_KEY);
      setMsg({ok:true,text:`Submitted. Status: ${status}. You can review it in Dashboard.`});
    }catch{
      setMsg({ok:false,text:"Unexpected error. Try again."});
    }
  };

  const progress = `${(step/3)*100}%`;

  return (
    <>
      <Head><title>KYC — Genio KYC OS</title></Head>

      <main style={ui.page}>
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

        <section style={ui.wrap}>
          <div style={ui.card}>
            <h1 style={ui.h1}>Begin Verification</h1>
            <p style={ui.p}>Advanced demo flow (no provider connected yet). Draft is saved automatically.</p>

            {/* tips */}
            <div style={ui.tips}>
              <div style={ui.tip}>📸 Good lighting</div>
              <div style={ui.tip}>🪪 All corners visible</div>
              <div style={ui.tip}>🤳 Selfie with same ID</div>
              <div style={ui.tip}>🛂 Passport: photo page</div>
              <div style={ui.tip}>🪪 National/Driver: front + back</div>
            </div>

            {/* steps + progress */}
            <div style={ui.steps}>
              <div style={{...ui.step,...(step===1?ui.stepAct:{})}}>1. Personal Info</div>
              <div style={{...ui.step,...(step===2?ui.stepAct:{})}}>2. ID Upload</div>
              <div style={{...ui.step,...(step===3?ui.stepAct:{})}}>3. Selfie & Consent</div>
            </div>
            <div style={ui.bar}><div style={ui.barFill(progress)} /></div>

            <form onSubmit={submit}>
              {step===1 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>
                        Full name * {form.fullName.trim().length>=3?<span style={ui.chip(true)}>OK</span>:<span style={ui.chip(false)}>Required</span>}
                      </label>
                      <input style={ui.input} name="fullName" value={form.fullName} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>
                        Date of birth * {form.dob?<span style={ui.chip(true)}>OK</span>:<span style={ui.chip(false)}>Required</span>}
                      </label>
                      <input style={ui.input} type="date" name="dob" value={form.dob} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>
                        Country * {form.country.trim()?<span style={ui.chip(true)}>OK</span>:<span style={ui.chip(false)}>Required</span>}
                      </label>
                      <input style={ui.input} name="country" value={form.country} onChange={onChange} placeholder="e.g., Jordan"/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Phone</label>
                      <input style={ui.input} name="phone" value={form.phone} onChange={onChange} placeholder="+962..."/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Email</label>
                      <input style={ui.input} name="email" value={form.email} onChange={onChange} placeholder="you@company.com"/>
                    </div>
                    <div style={{...ui.field,gridColumn:"1/-1"}}>
                      <label style={ui.label}>Address <span style={ui.hint}>(optional)</span></label>
                      <input style={ui.input} name="address" value={form.address} onChange={onChange}/>
                    </div>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                    <button type="button" onClick={clearDraft} style={ui.btn}>Clear Draft</button>
                  </div>
                </>
              )}

              {step===2 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>ID type *</label>
                      <select name="idType" value={form.idType} onChange={onChange} style={ui.input}>
                        <option value="passport">Passport</option>
                        <option value="nid">National ID</option>
                        <option value="dl">Driver License</option>
                      </select>
                      <div style={ui.note}>Passport: one photo. National/Driver: front + back.</div>
                    </div>

                    <div style={ui.field}>
                      <label style={ui.label}>Upload ID (front) *</label>
                      <input type="file" accept="image/*,application/pdf" onChange={(e)=>setIdFront(e.target.files?.[0]||null)} style={ui.file}/>
                      {preview.idFront && <div style={ui.preview}><img src={preview.idFront} style={ui.img} alt="id-front"/></div>}
                    </div>

                    {form.idType!=="passport" && (
                      <div style={ui.field}>
                        <label style={ui.label}>Upload ID (back) *</label>
                        <input type="file" accept="image/*,application/pdf" onChange={(e)=>setIdBack(e.target.files?.[0]||null)} style={ui.file}/>
                        {preview.idBack && <div style={ui.preview}><img src={preview.idBack} style={ui.img} alt="id-back"/></div>}
                      </div>
                    )}
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                  </div>
                </>
              )}

              {step===3 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>Upload selfie with the same ID *</label>
                      <input type="file" accept="image/*" onChange={(e)=>setSelfie(e.target.files?.[0]||null)} style={ui.file}/>
                      {preview.selfie && <div style={ui.preview}><img src={preview.selfie} style={{...ui.img,height:120}} alt="selfie"/></div>}
                      <div style={ui.note}>No sunglasses • face fully visible • hold the ID next to your face.</div>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Liveness (demo)</label>
                      <label style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="checkbox" name="livenessOk" checked={form.livenessOk} onChange={onChange}/>
                        <span>I confirm I blinked and moved my head slowly.</span>
                      </label>
                    </div>
                    <div style={{...ui.field,gridColumn:"1/-1"}}>
                      <label style={ui.label}>Consent *</label>
                      <label style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                        <span>I consent to identity verification and processing of my data.</span>
                      </label>
                    </div>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="submit" style={ui.btnPri}>Submit for Review</button>
                    <Link href="/dashboard" style={ui.btn}>Go to Dashboard</Link>
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

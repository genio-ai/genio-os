// pages/index.js — Genio ID (KYC) — single page replacement
"use client";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  wrap:{maxWidth:980,margin:"0 auto",padding:"56px 16px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:34,fontWeight:900,margin:"0 0 6px"},
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
  err:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  ok:{marginTop:12,padding:"10px 12px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const DRAFT_KEY = "genio_kyc_draft"; // text only
const countries = [
  {code:"JO", name:"Jordan 🇯🇴"}, {code:"AE", name:"United Arab Emirates 🇦🇪"},
  {code:"SA", name:"Saudi Arabia 🇸🇦"}, {code:"QA", name:"Qatar 🇶🇦"},
  {code:"EG", name:"Egypt 🇪🇬"}, {code:"US", name:"United States 🇺🇸"},
  {code:"GB", name:"United Kingdom 🇬🇧"}, {code:"CA", name:"Canada 🇨🇦"},
  {code:"DE", name:"Germany 🇩🇪"}, {code:"FR", name:"France 🇫🇷"}, {code:"TR", name:"Türkiye 🇹🇷"}
];

const maskPhone = (p)=>!p?"":p.replace(/.(?=.{2})/g,"*");

function DropZone({label,required,onFile,accept="image/jpeg,image/png,application/pdf",previewUrl}) {
  const [drag,setDrag]=useState(false);
  const ref=useRef(null);
  return (
    <div className="dz">
      <div style={ui.field}>
        <label style={ui.label}>{label}</label>
        {required ? <span style={ui.req}>Required</span> : null}
      </div>
      <div
        onDragOver={(e)=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={(e)=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files?.[0]; f && onFile(f);}}
        onClick={()=>ref.current?.click()}
        style={ui.dz(drag)}
        role="button" tabIndex={0}
        onKeyDown={(e)=>{if(e.key==="Enter"||e.key===" ") ref.current?.click();}}
      >Drop file here or click to upload</div>
      <input ref={ref} type="file" accept={accept} onChange={(e)=>onFile(e.target.files?.[0]||null)} style={{display:"none"}}/>
      {previewUrl && <div style={ui.preview}><img src={previewUrl} style={ui.img} alt="preview"/></div>}
      <div style={ui.note}>Max 8MB. JPG/PNG/PDF only.</div>
    </div>
  );
}

export default function Home(){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({fullName:"",dob:"",country:"",phone:"",email:"",address:"",idType:"passport",consent:false});
  const [idFront,setIdFront]=useState(null);
  const [idBack,setIdBack]=useState(null);
  const [selfie,setSelfie]=useState(null);
  const [msg,setMsg]=useState({ok:false,text:""});

  const preview = useMemo(()=>({
    idFront: idFront? URL.createObjectURL(idFront):"",
    idBack : idBack ? URL.createObjectURL(idBack) :"",
    selfie : selfie ? URL.createObjectURL(selfie) :"",
  }),[idFront,idBack,selfie]);

  useEffect(()=>{ // load draft
    try{ const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"{}");
      if(d && Object.keys(d).length) setForm(p=>({...p,...d}));
    }catch{}
  },[]);
  useEffect(()=>{ // save draft (text only)
    const {fullName,dob,country,phone,email,address,idType,consent}=form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({fullName,dob,country,phone,email,address,idType,consent}));
  },[form]);

  const tooBig = (f)=> f && f.size>MAX_SIZE ? "File too large (8MB max)" : "";
  const need = (x)=>!x || String(x).trim()==="";
  const checkStep = ()=>{
    if(step===1){
      if(need(form.fullName)||need(form.dob)||need(form.country)) return "Name, date of birth and country are required";
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

  const canSubmit = !!(form.fullName && form.dob && form.country && idFront && (form.idType==="passport" || idBack) && selfie && form.consent);
  const stepPct = step===1? 20 : step===2? 60 : 100;

  const onChange = (e)=>{
    const {name,value,type,checked}=e.target;
    setForm(p=>({...p,[name]: type==="checkbox"? checked : value}));
  };

  const next=()=>{
    const e=checkStep();
    if(e){setMsg({ok:false,text:e});return;}
    setMsg({ok:true,text:"Looks good"}); setStep(s=>Math.min(3,s+1));
  };
  const back=()=>{ setMsg({ok:false,text:""}); setStep(s=>Math.max(1,s-1)); };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const eMsg=checkStep(); if(eMsg){ setMsg({ok:false,text:eMsg}); return; }

    const rec={
      idType:form.idType, fullName:form.fullName, dob:form.dob, country:form.country,
      phoneMasked:maskPhone(form.phone||""), email:form.email||"", address:form.address||"",
      submittedAt:new Date().toISOString()
    };
    try{
      const res=await fetch("/api/kyc",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(rec)});
      const out=await res.json();
      if(!res.ok) throw new Error(out?.error||"Server error");
      setMsg({ok:true,text:`Submitted. Reference: ${out.requestId}.`});
      setStep(3);
    }catch(err){
      setMsg({ok:false,text:String(err.message||err)});
    }
  };

  const stepDone=(n)=> (n<step);

  return (
    <>
      <Head><title>Genio ID — KYC</title></Head>
      <main style={ui.page}>
        <section style={ui.wrap}>
          <div style={ui.card}>
            <h1 style={ui.h1}>Identity Verification</h1>
            <p style={ui.p}>Complete the checks below. Your request will be submitted to the server for review.</p>

            <div style={ui.steps}>
              <div style={{...ui.step, ...(step===1?ui.stepAct:{} )}}>{stepDone(1)?"✔️":"1."} Personal Info</div>
              <div style={{...ui.step, ...(step===2?ui.stepAct:{} )}}>{stepDone(2)?"✔️":"2."} ID Upload</div>
              <div style={{...ui.step, ...(step===3?ui.stepAct:{} )}}>{stepDone(3)?"✔️":"3."} Selfie & Consent</div>
            </div>
            <div style={ui.progBarWrap}><div style={ui.progBarFill(stepPct)} /></div>

            {/* Checklist summary */}
            <div style={{marginTop:8}}>
              <div style={{opacity:.8,fontWeight:700,marginBottom:6}}>Verification Checklist</div>
              <div style={{fontSize:14,opacity:.9}}>
                {(form.fullName && form.dob && form.country) ? "✓ Personal info" : "• Personal info"} &nbsp;|&nbsp;
                {(idFront && (form.idType==="passport" || idBack)) ? "✓ ID uploaded" : "• ID uploaded"} &nbsp;|&nbsp;
                {selfie ? "✓ Selfie" : "• Selfie"} &nbsp;|&nbsp;
                {form.consent ? "✓ Consent" : "• Consent"}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
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

              {step===3 && (
                <>
                  <div style={ui.grid}>
                    <DropZone label="Upload selfie holding your ID" required accept="image/jpeg,image/png" onFile={setSelfie} previewUrl={preview.selfie}/>
                  </div>

                  <div style={{marginTop:12}}>
                    <label style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                      <span>I confirm information is accurate and I consent to verification & secure processing.</span>
                    </label>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={back} style={ui.btn}>Back</button>
                    <button type="submit" style={{...ui.btnPri, opacity: canSubmit?1:.6}} disabled={!canSubmit}>Submit for Verification</button>
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

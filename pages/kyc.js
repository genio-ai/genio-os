// pages/kyc.js  — Genio KYC OS (advanced demo)
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  tips:{borderRadius:14,padding:"12px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",fontSize:14,marginBottom:16},
  steps:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"6px 0 18px"},
  step:{textAlign:"center",padding:"8px 10px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",opacity:.6},
  stepAct:{opacity:1,background:"rgba(255,255,255,0.08)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:12},
  field:{display:"flex",flexDirection:"column",gap:6},
  label:{fontWeight:700,fontSize:14,opacity:.9},
  input:{borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"#fff",padding:"10px 12px",outline:"none"},
  file:{borderRadius:12,border:"1px dashed rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",color:"#fff",padding:"14px 12px"},
  note:{fontSize:12,opacity:.72,marginTop:4},
  row:{display:"flex",gap:12,flexWrap:"wrap",marginTop:16},
  btnPri:{borderRadius:12,padding:"10px 16px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",border:"none",cursor:"pointer"},
  btn:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer"},
  err:{marginTop:10,padding:"10px 12px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  ok:{marginTop:10,padding:"10px 12px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
  preview:{marginTop:8,display:"flex",gap:10,flexWrap:"wrap"},
  img:{width:120,height:80,objectFit:"cover",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)"},
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export default function KYC(){
  const [step,setStep] = useState(1);

  // بيانات المستخدم
  const [form,setForm] = useState({
    fullName:"", dob:"", country:"",
    phone:"", email:"", address:"",
    idType:"passport", consent:false
  });

  // ملفات
  const [idFront,setIdFront]   = useState(null);   // لكل الأنواع
  const [idBack,setIdBack]     = useState(null);   // للهوية الوطنية/رخصة
  const [selfie,setSelfie]     = useState(null);   // سيلفي حامل الهوية

  // رسائل النظام
  const [msg,setMsg] = useState({ok:false, text:""});

  // معاينة
  const preview = useMemo(()=>({
    idFront: idFront ? URL.createObjectURL(idFront) : "",
    idBack : idBack  ? URL.createObjectURL(idBack)  : "",
    selfie : selfie  ? URL.createObjectURL(selfie)  : "",
  }),[idFront,idBack,selfie]);

  const onChange = (e)=>{
    const {name,value,type,checked} = e.target;
    setForm(prev=>({...prev,[name]: type==="checkbox"? checked : value}));
  };

  const checkFile = (f, acceptImageOnly=false)=>{
    if(!f) return "Missing file";
    if(f.size > MAX_SIZE) return "File too large (max 8MB)";
    if(acceptImageOnly && !f.type.startsWith("image/")) return "Image required";
    return "";
  };

  // تحقق لكل خطوة
  const validateStep = ()=>{
    if(step===1){
      if(!form.fullName || !form.dob || !form.country) return "Name, date of birth and country are required";
      if(form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format";
      if(form.phone && !/^\+?[0-9\-() ]{7,}$/.test(form.phone)) return "Invalid phone number";
      return "";
    }
    if(step===2){
      const e1 = checkFile(idFront,false);
      if(e1) return "ID (front) is required";
      if(form.idType!=="passport"){
        const e2 = checkFile(idBack,false);
        if(e2) return "ID (back) is required";
      }
      return "";
    }
    if(step===3){
      const e3 = checkFile(selfie,true);
      if(e3) return "Selfie holding the ID is required";
      if(!form.consent) return "You must accept consent";
      return "";
    }
    return "";
  };

  const next = ()=>{
    const err = validateStep();
    if(err){ setMsg({ok:false,text:err}); return; }
    setMsg({ok:true,text:"Looks good"}); setStep(s=>Math.min(s+1,3));
  };
  const back = ()=>{ setMsg({ok:false,text:""}); setStep(s=>Math.max(s-1,1)); };

  const handleSubmit = (e)=>{
    e.preventDefault();
    const err = validateStep();
    if(err){ setMsg({ok:false,text:err}); return; }

    // قواعد قبول/رفض بسيطة (demo “smart rules”)
    // - رفض إن كان البلد فاضي
    // - رفض ID Back مفقود لما النوع ليس جواز
    // - غير ذلك pending
    let status = "pending";
    if(!form.country) status = "rejected";
    if(form.idType!=="passport" && !idBack) status = "rejected";

    const record = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      status,
      ...form,
      idFrontName: idFront?.name,
      idBackName : idBack?.name,
      selfieName : selfie?.name,
      submittedAt: new Date().toISOString()
    };

    try{
      const list = JSON.parse(localStorage.getItem("genio_kyc")||"[]");
      list.push(record);
      localStorage.setItem("genio_kyc", JSON.stringify(list));
      setMsg({ok:true,text:`Submitted. Status: ${status}. View it in Dashboard.`});
    }catch{
      setMsg({ok:false,text:"Unexpected error while saving. Try again."});
    }
  };

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
            <p style={ui.p}>This is an advanced demo flow (no third-party provider connected yet).</p>

            {/* تعليمات */}
            <div style={ui.tips}>
              <b>Tips:</b> good lighting • no glare • all corners visible • selfie holding the same ID • passport: open photo page • national ID/driver license: front + back.
            </div>

            {/* شريط الخطوات */}
            <div style={ui.steps}>
              <div style={{...ui.step, ...(step===1?ui.stepAct:{})}}>1. Personal Info</div>
              <div style={{...ui.step, ...(step===2?ui.stepAct:{})}}>2. ID Upload</div>
              <div style={{...ui.step, ...(step===3?ui.stepAct:{})}}>3. Selfie & Consent</div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              {step===1 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>Full name *</label>
                      <input style={ui.input} name="fullName" value={form.fullName} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Date of birth *</label>
                      <input style={ui.input} type="date" name="dob" value={form.dob} onChange={onChange}/>
                    </div>
                    <div style={ui.field}>
                      <label style={ui.label}>Country *</label>
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
                    <div style={ui.field} style={{gridColumn:"1/-1"}}>
                      <label style={ui.label}>Address</label>
                      <input style={ui.input} name="address" value={form.address} onChange={onChange}/>
                    </div>
                  </div>

                  <div style={ui.row}>
                    <button type="button" onClick={next} style={ui.btnPri}>Continue</button>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step===2 && (
                <>
                  <div style={ui.grid}>
                    <div className="idType" style={ui.field}>
                      <label style={ui.label}>ID type *</label>
                      <select name="idType" value={form.idType} onChange={onChange} style={ui.input}>
                        <option value="passport">Passport</option>
                        <option value="nid">National ID</option>
                        <option value="dl">Driver License</option>
                      </select>
                      <div style={ui.note}>
                        Passport: one photo. National ID / Driver License: front + back.
                      </div>
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

              {/* STEP 3 */}
              {step===3 && (
                <>
                  <div style={ui.grid}>
                    <div style={ui.field}>
                      <label style={ui.label}>Upload selfie holding your ID *</label>
                      <input type="file" accept="image/*" onChange={(e)=>setSelfie(e.target.files?.[0]||null)} style={ui.file}/>
                      {preview.selfie && <div style={ui.preview}><img src={preview.selfie} style={{...ui.img,height:120}} alt="selfie"/></div>}
                      <div style={ui.note}>Face and ID must be fully visible. No sunglasses or heavy filters.</div>
                    </div>
                  </div>

                  <div style={{marginTop:12}}>
                    <label style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                      <span>I confirm the information is accurate and I consent to verification.</span>
                    </label>
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

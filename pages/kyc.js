// pages/kyc.js  (pure CSS-in-JS MVP)
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  wrap:{maxWidth:900,margin:"0 auto",padding:"56px 16px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:32,fontWeight:900,margin:"0 0 8px"},
  p:{opacity:.9,lineHeight:1.6,margin:"0 0 16px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:12},
  field:{display:"flex",flexDirection:"column",gap:6},
  label:{fontWeight:700,fontSize:14,opacity:.9},
  input:{borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.06)",color:"#fff",padding:"10px 12px",outline:"none"},
  file:{borderRadius:12,border:"1px dashed rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",color:"#fff",padding:"14px 12px"},
  row:{display:"flex",gap:12,flexWrap:"wrap",marginTop:16},
  btnPrimary:{borderRadius:12,padding:"10px 16px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",textDecoration:"none",border:"none",cursor:"pointer"},
  btnGhost:{borderRadius:12,padding:"10px 16px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",textDecoration:"none",color:"#fff"},
  note:{fontSize:12,opacity:.75,marginTop:6},
  ok:{marginTop:16,padding:"12px 14px",borderRadius:12,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
  err:{marginTop:16,padding:"12px 14px",borderRadius:12,background:"rgba(227,55,55,0.15)",border:"1px solid rgba(227,55,55,0.35)"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(14,35,68,0.9)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  nav:{maxWidth:1100,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  brand:{fontWeight:800,fontSize:18},
  navUl:{display:"flex",gap:18,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,0.9)",textDecoration:"none"},
};

export default function KYC(){
  const [form,setForm] = useState({
    fullName:"", dob:"", country:"", idType:"passport", address:"",
    consent:false
  });
  const [idFile,setIdFile] = useState(null);
  const [selfieFile,setSelfieFile] = useState(null);
  const [status,setStatus] = useState({ok:false,msg:""});

  const onChange = (e)=> setForm({...form,[e.target.name]:
    e.target.type==="checkbox"? e.target.checked : e.target.value });

  const handleSubmit = async (e)=>{
    e.preventDefault();
    // basic validation
    if(!form.fullName || !form.dob || !form.country || !idFile || !selfieFile || !form.consent){
      setStatus({ok:false,msg:"Please complete all required fields, upload ID and selfie, and accept consent."});
      return;
    }
    // mock persist (localStorage)
    try{
      const payload = {
        ...form,
        idFileName:idFile?.name,
        selfieFileName:selfieFile?.name,
        submittedAt:new Date().toISOString()
      };
      if (typeof window !== "undefined") {
        const list = JSON.parse(localStorage.getItem("genio_kyc")||"[]");
        list.push(payload);
        localStorage.setItem("genio_kyc", JSON.stringify(list));
      }
      setStatus({ok:true,msg:"Submitted. Your verification is being reviewed (demo)."});
      // optional: redirect later -> /dashboard
      // setTimeout(()=>window.location.href="/dashboard",1000);
    }catch(err){
      setStatus({ok:false,msg:"Unexpected error. Please try again."});
    }
  };

  return (
    <>
      <Head>
        <title>KYC — Genio KYC OS</title>
        <meta name="google" content="notranslate"/>
        <meta httpEquiv="Content-Language" content="en"/>
      </Head>

      <main style={ui.page}>
        {/* Top bar */}
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
            <p style={ui.p}>
              Upload your document and a selfie holding the same document. This is a demo-only flow
              (no third-party provider connected yet).
            </p>

            <form onSubmit={handleSubmit}>
              <div style={ui.grid}>
                <div style={ui.field}>
                  <label style={ui.label}>Full name *</label>
                  <input name="fullName" value={form.fullName} onChange={onChange} style={ui.input} />
                </div>
                <div style={ui.field}>
                  <label style={ui.label}>Date of birth *</label>
                  <input type="date" name="dob" value={form.dob} onChange={onChange} style={ui.input}/>
                </div>
                <div style={ui.field}>
                  <label style={ui.label}>Country *</label>
                  <input name="country" value={form.country} onChange={onChange} style={ui.input}/>
                </div>
                <div style={ui.field}>
                  <label style={ui.label}>ID type *</label>
                  <select name="idType" value={form.idType} onChange={onChange} style={ui.input}>
                    <option value="passport">Passport</option>
                    <option value="nid">National ID</option>
                    <option value="dl">Driver License</option>
                  </select>
                </div>
              </div>

              <div style={ui.grid}>
                <div style={ui.field}>
                  <label style={ui.label}>Upload ID photo (front) *</label>
                  <input type="file" accept="image/*,application/pdf" onChange={(e)=>setIdFile(e.target.files?.[0]||null)} style={ui.file}/>
                  <span style={ui.note}>Accepted: JPG/PNG/PDF</span>
                </div>
                <div style={ui.field}>
                  <label style={ui.label}>Upload selfie holding the ID *</label>
                  <input type="file" accept="image/*" onChange={(e)=>setSelfieFile(e.target.files?.[0]||null)} style={ui.file}/>
                  <span style={ui.note}>Make sure your face and the ID are clearly visible.</span>
                </div>
              </div>

              <div style={{marginTop:12}}>
                <label style={{display:"flex",alignItems:"center",gap:8}}>
                  <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/>
                  <span>I confirm the information is accurate and I consent to verification.</span>
                </label>
              </div>

              <div style={ui.row}>
                <button type="submit" style={ui.btnPrimary}>Submit for Review</button>
                <Link href="/" style={ui.btnGhost}>Cancel</Link>
              </div>
            </form>

            {status.msg && (
              <div style={status.ok ? ui.ok : ui.err}>
                {status.msg}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

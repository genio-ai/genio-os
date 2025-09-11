// pages/dashboard.js  (pure CSS-in-JS)
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const ui = {
  page:{minHeight:"100vh",background:"#0B1D3A",color:"#fff",fontFamily:"-apple-system, Segoe UI, Roboto, Arial, sans-serif"},
  header:{position:"sticky",top:0,zIndex:50,background:"rgba(14,35,68,0.9)",backdropFilter:"blur(6px)",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  nav:{maxWidth:1100,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  brand:{fontWeight:800,fontSize:18},
  navUl:{display:"flex",gap:18,listStyle:"none",margin:0,padding:0},
  link:{color:"rgba(255,255,255,0.9)",textDecoration:"none"},
  wrap:{maxWidth:1100,margin:"0 auto",padding:"56px 16px"},
  card:{border:"1px solid rgba(255,255,255,0.1)",background:"linear-gradient(135deg,#102A55,#0A1936)",borderRadius:24,padding:24,boxShadow:"0 12px 30px rgba(0,0,0,0.35)"},
  h1:{fontSize:28,fontWeight:900,margin:"0 0 8px"},
  p:{opacity:.9,lineHeight:1.6,margin:"0 0 16px"},
  row:{display:"flex",gap:12,flexWrap:"wrap",margin:"10px 0 16px"},
  btn:{borderRadius:10,padding:"8px 12px",fontWeight:700,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"#fff",cursor:"pointer"},
  btnPrime:{borderRadius:10,padding:"8px 12px",fontWeight:700,color:"#000",background:"linear-gradient(90deg,#27E38A,#27D4F0)",border:"none",cursor:"pointer"},
  tableWrap:{overflowX:"auto",borderRadius:16,border:"1px solid rgba(255,255,255,0.12)"},
  table:{width:"100%",borderCollapse:"separate",borderSpacing:0},
  th:{textAlign:"left",padding:"12px 14px",fontSize:12,opacity:.9,background:"rgba(255,255,255,0.06)"},
  td:{padding:"12px 14px",fontSize:14,borderTop:"1px solid rgba(255,255,255,0.1)"},
  tagOk:{padding:"4px 8px",borderRadius:8,background:"rgba(39,227,138,0.15)",border:"1px solid rgba(39,227,138,0.35)"},
  empty:{opacity:.8,background:"rgba(255,255,255,0.04)",border:"1px dashed rgba(255,255,255,0.2)",borderRadius:14,padding:"16px 14px",textAlign:"center"},
};

export default function Dashboard(){
  const [items,setItems] = useState([]);

  useEffect(()=> {
    if (typeof window === "undefined") return;
    try{
      const list = JSON.parse(localStorage.getItem("genio_kyc")||"[]");
      setItems(list.reverse()); // الأحدث أولاً
    }catch(e){ setItems([]); }
  },[]);

  const exportCSV = ()=>{
    const header = ["Full Name","DOB","Country","ID Type","ID File","Selfie File","Submitted At"];
    const rows = items.map(x=>[
      x.fullName, x.dob, x.country, x.idType, x.idFileName||"", x.selfieFileName||"", x.submittedAt
    ]);
    const csv = [header, ...rows].map(r=>r.map(v=>`"${(v??"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "genio-kyc-submissions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = ()=>{
    if (!confirm("Delete all demo submissions?")) return;
    localStorage.removeItem("genio_kyc");
    setItems([]);
  };

  return (
    <>
      <Head>
        <title>Dashboard — Genio KYC OS</title>
        <meta name="google" content="notranslate"/><meta httpEquiv="Content-Language" content="en"/>
      </Head>

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
            <h1 style={ui.h1}>Overview</h1>
            <p style={ui.p}>Demo submissions collected locally on this device.</p>

            <div style={ui.row}>
              <button style={ui.btnPrime} onClick={exportCSV}>Export CSV</button>
              <button style={ui.btn} onClick={clearAll}>Clear All</button>
              <Link href="/kyc" style={{...ui.btn, textDecoration:"none"}}>Add Test Submission</Link>
            </div>

            {items.length === 0 ? (
              <div style={ui.empty}>No submissions yet.</div>
            ) : (
              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead>
                    <tr>
                      <th style={ui.th}>Name</th>
                      <th style={ui.th}>DOB</th>
                      <th style={ui.th}>Country</th>
                      <th style={ui.th}>ID Type</th>
                      <th style={ui.th}>Files</th>
                      <th style={ui.th}>Status</th>
                      <th style={ui.th}>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((x,i)=>(
                      <tr key={i}>
                        <td style={ui.td}>{x.fullName}</td>
                        <td style={ui.td}>{x.dob}</td>
                        <td style={ui.td}>{x.country}</td>
                        <td style={ui.td}>{x.idType}</td>
                        <td style={ui.td}>{[x.idFileName,x.selfieFileName].filter(Boolean).join(" · ")}</td>
                        <td style={ui.td}><span style={ui.tagOk}>received</span></td>
                        <td style={ui.td}>{new Date(x.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

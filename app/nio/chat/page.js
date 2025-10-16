// File: app/nio/chat/page.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const NEO_ENDPOINT = "/api/neo-chat";

export default function NeoChatPage() {
  const [messages, setMessages] = useState(() => [
    { role: "assistant",
      content:
`مرحبًا! أنا نيو الغزّاوي — دليلك عن غزة.
أشرح عن شعب غزة، لمحة تاريخية، وكيف توصل التبرعات عبر مؤسسات رسمية مرخَّصة.
Hi! I’m Neo al-Ghazawi — your Gaza info guide. Ask me anything.`}
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(()=>{ if(listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight; },[messages]);

  const timeStr = useMemo(()=>new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),[]);

  async function send(){
    const msg=input.trim(); if(!msg||sending) return;
    setMessages(m=>[...m,{role:"user",content:msg}]); setInput(""); setSending(true);
    try{
      const res=await fetch(NEO_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[
          {role:"system",content:"You are Neo al-Ghazawi: a concise, kind, bilingual (Arabic+English) Gaza info guide. Be factual, people-first, non-political. Mention that donations are delivered via official, licensed humanitarian organizations in Gaza when relevant."},
          ...messages.map(m=>({role:m.role,content:m.content})),
          {role:"user",content:msg}
        ]})});
      const data=await res.json();
      setMessages(m=>[...m,{role:"assistant",content:data?.answer||"…"}]);
    }catch(e){
      setMessages(m=>[...m,{role:"assistant",content:"عذرًا، صار خطأ لحظي. جرّب مرة ثانية.\nSorry, something went wrong."}]);
    }finally{ setSending(false); }
  }
  function onKeyDown(e){ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }

  return (
    <div style={sx.page}>
      <header style={sx.nav}>
        <div style={sx.brand}>🤖 Neo al-Ghazawi <span style={sx.sub}>— Gaza AI Guide • الدليل الذكي لغزة</span></div>
        <div style={sx.right}><span style={sx.pill}>Active • {timeStr}</span></div>
      </header>

      <main style={sx.dock}>
        <section style={sx.panel}>
          <div ref={listRef} style={sx.list}>
            {messages.map((m,i)=><Message key={i} role={m.role} content={m.content}/>)}
          </div>
          <div style={sx.inputWrap}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKeyDown}
              placeholder="اكتب سؤالك هنا… / Ask your question…" style={sx.textarea}/>
            <button onClick={send} disabled={sending||!input.trim()} style={sx.sendBtn}>
              {sending? "Sending…" : "Send • أرسل"}
            </button>
          </div>
          <div style={sx.note}>Neo answers in Arabic & English • <span dir="rtl">نيو يجيب بالعربية والإنجليزية</span></div>
        </section>
      </main>
    </div>
  );
}

function Message({role,content}){
  const isUser=role==="user";
  return (
    <div style={{...sx.msg,justifyContent:isUser?"flex-end":"flex-start"}}>
      <div style={{...sx.bubble,...(isUser?sx.userBubble:sx.aiBubble)}}>
        {!isUser && <div style={sx.aiName}>Neo</div>}
        <pre style={sx.pre}>{content}</pre>
      </div>
    </div>
  );
}

const sx={
  page:{minHeight:"100vh",background:"radial-gradient(1200px 700px at 50% -20%, rgba(191,234,255,.22), transparent 60%), linear-gradient(135deg, #00AEEF, #008DCB)",color:"#E1F3FF",fontFamily:"Inter, Noto Sans Arabic, system-ui, sans-serif"},
  nav:{position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"14px 18px",
    background:"linear-gradient(180deg, rgba(0,90,140,.45), rgba(0,90,140,.2))",borderBottom:"1px solid rgba(54,212,255,.35)",backdropFilter:"blur(8px)"},
  brand:{fontWeight:900,letterSpacing:.3,fontSize:16}, sub:{opacity:.9,fontWeight:500},
  right:{display:"flex",alignItems:"center",gap:8},
  pill:{padding:"6px 10px",borderRadius:999,background:"linear-gradient(135deg, #36D4FF, #00AEEF)",color:"#003A60",fontWeight:800,
    border:"1px solid rgba(191,234,255,.25)",boxShadow:"0 8px 24px rgba(31,216,255,.35)",fontSize:12},
  dock:{display:"grid",placeItems:"center",padding:18},
  panel:{width:"min(900px,96vw)",background:"linear-gradient(180deg, rgba(0,36,64,.52), rgba(0,36,64,.36))",
    border:"1px solid rgba(54,212,255,.38)",borderRadius:20,boxShadow:"0 16px 40px rgba(0,174,239,.28)",padding:14},
  list:{height:"min(58vh,560px)",overflowY:"auto",padding:"8px 6px",display:"flex",flexDirection:"column",gap:10},
  msg:{display:"flex"},
  bubble:{maxWidth:"78%",borderRadius:16,padding:"10px 12px",border:"1px solid rgba(92,200,245,.45)",boxShadow:"0 8px 22px rgba(0,174,239,.18)",whiteSpace:"pre-wrap",wordBreak:"break-word"},
  aiBubble:{background:"linear-gradient(180deg, rgba(0,36,64,.55), rgba(0,36,64,.38))",color:"#E1F3FF"},
  userBubble:{background:"linear-gradient(135deg, #36D4FF, #00AEEF)",color:"#003A60",fontWeight:700},
  aiName:{fontSize:11,opacity:.9,marginBottom:4}, pre:{margin:0,fontFamily:"inherit",lineHeight:1.55},
  inputWrap:{display:"flex",gap:10,marginTop:12,alignItems:"stretch"},
  textarea:{flex:1,minHeight:52,maxHeight:140,padding:"12px 12px",resize:"vertical",borderRadius:14,color:"#E1F3FF",
    background:"linear-gradient(180deg, rgba(0,36,64,.42), rgba(0,36,64,.30))",border:"1px solid rgba(92,200,245,.45)"},
  sendBtn:{padding:"0 18px",borderRadius:14,background:"linear-gradient(135deg, #36D4FF, #00AEEF)",color:"#003A60",fontWeight:900,
    border:"1px solid rgba(191,234,255,.25)",boxShadow:"0 12px 28px rgba(31,216,255,.35)",cursor:"pointer"},
  note:{marginTop:8,fontSize:12,color:"#BFEAFF"},
};

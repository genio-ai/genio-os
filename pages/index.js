import { useEffect, useRef } from "react";

export default function Home() {
  const boxRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const blinkRef = useRef(null);

  // تحريك البؤبؤ مع الماوس
  useEffect(() => {
    function onMove(e) {
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      const rangeX = 10, rangeY = 10;
      const lx = Math.max(-rangeX, Math.min(rangeX, dx * 30));
      const ly = Math.max(-rangeY, Math.min(rangeY, dy * 30));

      if (leftRef.current) leftRef.current.style.transform = `translate(${lx}px, ${ly}px)`;
      if (rightRef.current) rightRef.current.style.transform = `translate(${lx}px, ${ly}px)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // رمشة
  useEffect(() => {
    const interval = setInterval(() => {
      if (!blinkRef.current) return;
      blinkRef.current.classList.add("blink");
      setTimeout(() => blinkRef.current?.classList.remove("blink"), 160);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui"}}>
      <div style={{textAlign:"center"}}>
        <div className="mascot" ref={boxRef}>
          <img src="/genio-mascot.png" alt="Genio Mascot" draggable="false"/>

          {/* جفن */}
          <div ref={blinkRef} className="eyelids" aria-hidden="true" />

          {/* البؤبؤين */}
          <div className="eye left"><span ref={leftRef} /></div>
          <div className="eye right"><span ref={rightRef} /></div>
        </div>

        <h1 style={{marginTop:"24px"}}>Welcome to Genio OS</h1>
        <p><a href="/test">Go to /test</a></p>
      </div>

      <style jsx>{`
        .mascot { position:relative; width:320px; margin:0 auto; }
        .mascot img { width:100%; height:auto; display:block; }

        .eye { position:absolute; width:48px; height:48px; }
        .eye.left  { left:36%; top:33%; transform:translate(-50%,-50%); }
        .eye.right { left:62%; top:33%; transform:translate(-50%,-50%); }

        .eye span {
          position:absolute;
          left:50%; top:50%;
          width:18px; height:18px;
          background:#121212;
          border-radius:50%;
          transform:translate(-50%,-50%);
          transition:transform 80ms linear;
        }

        .eyelids {
          position:absolute;
          left:0; top:0; right:0; height:45%;
          pointer-events:none;
          transform-origin: top;
          transform: scaleY(0);
          background:rgba(0,0,0,.35);
        }
        .eyelids.blink { animation: blinkAnim 160ms ease-in-out; }
        @keyframes blinkAnim {
          0% { transform: scaleY(0); }
          40% { transform: scaleY(1); }
          100% { transform: scaleY(0); }
        }
      `}</style>
    </main>
  );
}

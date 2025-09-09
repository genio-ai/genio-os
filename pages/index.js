export default function Home() {
  return (
    <div style={{padding:24,fontFamily:'system-ui'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <img src="/genio-logo.svg" alt="Genio Logo" style={{height:80}} />
        <img src="/genio-mascot.svg" alt="Genio Mascot" style={{height:80}} />
      </header>

      <main style={{marginTop:60,textAlign:'center'}}>
        <h1>Welcome to Genio OS</h1>
        <p>Logo left + Mascot right.</p>
        <p><a href="/test">Go to /test</a></p>
      </main>
    </div>
  );
}

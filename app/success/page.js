export default function SuccessPage() {
  return (
    <main style={{maxWidth:720, margin:"48px auto", padding:"0 16px", fontFamily:"Inter, system-ui, sans-serif"}}>
      <h1 style={{marginTop:0}}>Thank you!</h1>
      <p>Your payment was received. A delivery proof will be shared soon.</p>
      <a href="/" style={{textDecoration:"underline", fontWeight:700}}>Back to home</a>
    </main>
  );
}

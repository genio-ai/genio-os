export default function LogoTest() {
  return (
    <div style={{padding: 24}}>
      <h1 style={{fontWeight: 700, marginBottom: 16}}>اختبار الشعار والماسكوت</h1>
      <div style={{display: 'flex', gap: 24}}>
        <div style={{border: '1px solid #ddd', padding: 12}}>
          <img src="/genio-logo.png" alt="شعار Genio" style={{height: 60}} />
        </div>
        <div style={{border: '1px solid #ddd', padding: 12}}>
          <img src="/genio-mascot.png" alt="شخصية جينيو" style={{height: 80}} />
        </div>
      </div>
    </div>
  );
}

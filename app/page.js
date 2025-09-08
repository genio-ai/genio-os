export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white flex flex-col items-center justify-center p-8">
      
      {/* شعار و ماسكوت */}
      <div className="flex flex-col items-center space-y-4 mb-12">
        <img 
          src="/genio-logo.png" 
          alt="Genio Logo" 
          className="w-32 h-32"
        />
        <img 
          src="/genio-mascot.png" 
          alt="Genio Mascot" 
          className="w-40 h-40"
        />
        <h1 className="text-5xl font-bold">Genio OS</h1>
        <p className="text-lg text-blue-200">The Future of AI Money & Services</p>
      </div>

      {/* الشركات */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-10">
        
        <div className="flex flex-col items-center space-y-2">
          <img src="/wise.png" alt="Wise Logo" className="w-20 h-20" />
          <span className="text-xl font-semibold">Wise</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <img src="/stripe.png" alt="Stripe Logo" className="w-20 h-20" />
          <span className="text-xl font-semibold">Stripe</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <img src="/flutterwave.png" alt="Flutterwave Logo" className="w-20 h-20" />
          <span className="text-xl font-semibold">Flutterwave</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <img src="/paygate.png" alt="PayGate Logo" className="w-20 h-20" />
          <span className="text-xl font-semibold">PayGate</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <img src="/crypto.png" alt="Crypto Logo" className="w-20 h-20" />
          <span className="text-xl font-semibold">Crypto</span>
        </div>

      </div>
    </main>
  )
}

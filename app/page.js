export default function Home() {
  const providers = [
    { name: "Wise", fee: "$6.00", spread: "$1.00", logo: "https://seeklogo.com/images/W/wise-logo-8F1E1DB97C-seeklogo.com.png" },
    { name: "PayGate", fee: "$9.00", spread: "$2.50", logo: "https://paygate.co.za/wp-content/uploads/2020/04/paygate-logo.png" },
    { name: "Flutterwave", fee: "$12.00", spread: "$2.00", logo: "https://flutterwave.com/images/logo.png" },
    { name: "Stripe", fee: "$14.00", spread: "$1.50", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.svg" },
  ];

  return (
    <div className="space-y-8">
      <section className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Genio Money OS Dashboard</h2>
        <p className="text-gray-400">Route payments smartly. We simulate fees & FX spreads and suggest the best provider.</p>

        <div className="mt-6 bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Money Router</h3>
          <form className="space-y-3">
            <input type="number" placeholder="Amount" className="w-full p-2 rounded bg-gray-700" defaultValue="1000" />
            <select className="w-full p-2 rounded bg-gray-700">
              <option>USD</option>
              <option>EUR</option>
              <option>ZAR</option>
            </select>
            <select className="w-full p-2 rounded bg-gray-700">
              <option>EUR</option>
              <option>USD</option>
              <option>ZAR</option>
            </select>
            <button className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold">USD → EUR</button>
          </form>
        </div>
      </section>

      <section className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Provider Comparison</h3>
        <ul className="space-y-4">
          {providers.map((p, i) => (
            <li key={i} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={p.logo} alt={p.name} className="w-8 h-8" />
                <span className="font-semibold">{p.name}</span>
              </div>
              <div className="text-gray-300">
                Fee: {p.fee} | Spread: {p.spread}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

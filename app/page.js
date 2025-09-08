import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Genio Dashboard is working 🎉</h1>
      </main>
    </>
  );
}

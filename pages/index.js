import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#0a0a23] text-white">
      <div className="flex items-center space-x-6">
        {/* الشعار */}
        <Image 
          src="/logo.png" 
          alt="Genio Logo" 
          width={120} 
          height={120} 
          priority
        />

        {/* اسم النظام */}
        <h1 className="text-5xl font-bold">Genio OS</h1>
      </div>
    </main>
  );
}

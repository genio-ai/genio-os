import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#0a0a23] text-white">
      <div className="flex items-center space-x-4">
        {/* الشعار */}
        <Image 
          src="/logo.png" 
          alt="Genio Logo" 
          width={80} 
          height={80} 
          priority
        />

        {/* اسم النظام */}
        <h1 className="text-4xl font-bold">Genio OS</h1>
      </div>
    </main>
  );
}

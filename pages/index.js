// pages/index.js
import Head from "next/head";
import Hero from "../components/home/hero";
import Features from "../components/home/features";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio Twin Studio</title>
        <meta name="description" content="Create your smart AI Twin" />
      </Head>

      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
}

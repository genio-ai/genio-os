import Head from "next/head";
import Hero from "../components/home/Hero";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Genio — Create your smart twin</title>
        <meta
          name="description"
          content="Build your smart twin that writes, speaks, appears, and responds for you — 24/7."
        />
      </Head>

      <Hero />
    </>
  );
}

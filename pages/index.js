// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import ChatWidget from "../components/ChatWidget";
import styles from "../styles/hero.module.css";

export default function Home() {
  const [lang, setLang] = useState("en"); // "en" | "ar"

  const t = {
    en: {
      title1: "Create your smart twin",
      subtitle:
        "It writes, speaks, appears, and responds for you — 24/7. Built from your style, voice, and preferences.",
      cta: "Create My Twin",
      how: "How it works",
      needHelp: "Need help?",
      brand: "Genio",
      about: "About",
      support: "Support",
      login: "Log in",
      signup: "Sign up",
      lang: "العربية",
    },
    ar: {
      title1: "أنشئ توأمك الذكي",
      subtitle:
        "يكتب ويتحدث ويظهر ويرد عنك — 24/7. مبني من أسلوبك وصوتك وتفضيلاتك.",
      cta: "أنشئ توأمي",
      how: "كيف يعمل",
      needHelp: "تحتاج مساعدة؟",
      brand: "Genio",
      about: "حول",
      support: "الدعم",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      lang: "EN",
    },
  }[lang];

  return (
    <>
      <Head>
        <title>Genio — Create your AI Twin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>{t.brand}</div>
          <nav className={styles.nav}>
            <Link href="/about"> {t.about} </Link>
            <Link href="/support"> {t.support} </Link>
            <Link href="/auth/login" className={styles.linkBtn}>
              {t.login}
            </Link>
            <Link href="/auth/signup" className={styles.primaryBtn}>
              {t.signup}
            </Link>
            <button
              className={styles.langSwitch}
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              aria-label="Switch language"
            >
              {t.lang}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className={styles.heroWrap}>
        {/* Background image (put your model image at /public/hero-model.jpg) */}
        <div className={styles.bg}>
          <picture>
            <source srcSet="/hero-model.webp" type="image/webp" />
            <img
              src="/hero-model.jpg"
              alt="AI Twin model"
              className={styles.bgImg}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <div className={styles.overlay} />
        </div>

        {/* Glass card */}
        <section className={styles.heroCard}>
          <h1 className={styles.title}>{t.title1}</h1>
          <p className={styles.sub}>{t.subtitle}</p>
          <div className={styles.ctaRow}>
            <Link href="/twin" className={styles.primaryLg}>
              {t.cta}
            </Link>
            <Link href="/about" className={styles.ghostLg}>
              {t.how}
            </Link>
          </div>
          <div className={styles.trustLine}>
            Private by design · Your data stays inside Genio.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>© {new Date().getFullYear()} Genio Systems. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* Chat (system brain) */}
      <ChatWidget welcome="Hi, I'm your AI Twin. Ask me anything before you sign up." />
    </>
  );
}

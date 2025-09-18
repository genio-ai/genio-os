// config/site.js
const siteConfig = {
  name: "Genio AI Studio",
  nav: [
    { label: { en: "Home", ar: "الرئيسية" }, href: "/" },
    { label: { en: "About", ar: "حول" }, href: "/about" },
    { label: { en: "Support", ar: "الدعم" }, href: "/support" },
    { label: { en: "Chat", ar: "الدردشة" }, href: "/chat" },
    { label: { en: "Login", ar: "تسجيل الدخول" }, href: "/login" },
    { label: { en: "Signup", ar: "إنشاء حساب" }, href: "/signup" },
  ],
  hero: {
    en: {
      title: "Genio AI Studio",
      tagline: "Build, train, and launch your AI twins at scale.",
      cta1: "Launch a Twin",
      cta2: "View Demos",
    },
    ar: {
      title: "Genio AI Studio",
      tagline: "ابنِ ودرّب واطلق توائمك الذكية على نطاق واسع.",
      cta1: "إطلاق توأم",
      cta2: "عرض النماذج",
    },
  },
};

export default siteConfig;

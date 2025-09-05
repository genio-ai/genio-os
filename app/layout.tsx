export const metadata = {
  title: "Genio Money OS",
  description: "AI-powered cross-border payouts.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0,fontFamily:"-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif",background:"#0a0f1c",color:"#fff" }}>
        {children}
      </body>
    </html>
  );
}

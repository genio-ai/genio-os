import './globals.css';

export const metadata = {
  title: 'Genio OS',
  description: 'Next.js + Tailwind starter project',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

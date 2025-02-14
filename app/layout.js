import "./globals.css";

export const metadata = {
  title: "E-commerce App",
  description: "My Next.js E-commerce Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}

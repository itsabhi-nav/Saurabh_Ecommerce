import "./globals.css";

export const metadata = {
  title: "Saurabh Trading",
  description: "Saurabh Trading E-commerce Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}

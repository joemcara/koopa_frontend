// app/layout.jsx
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "../app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "KOOPA",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable}`}
    >
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

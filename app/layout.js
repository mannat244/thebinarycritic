import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Binary Critic",
  description: "Honest movie reviews, updates, and entertainment news from The Binary Critic.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to the manifest file */}
        <link rel="manifest" href="/manifest.json" />
        <script src="https://kulroakonsu.net/88/tag.min.js" data-zone="140092" async data-cfasync="false"></script>
        {/* Other meta tags can go here */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

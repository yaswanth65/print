import type {Metadata} from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Print simulator - Professional Document Editor',
  description: 'Live preview legal document editor',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}

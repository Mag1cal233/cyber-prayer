import type { Metadata } from 'next';
import { Noto_Sans_SC, Space_Mono } from 'next/font/google';
import './globals.css';

const sans = Noto_Sans_SC({ variable: '--font-sans-source', subsets: ['latin'], weight: ['400','500','700','900'] });
const mono = Space_Mono({ variable: '--font-mono-source', subsets: ['latin'], weight: ['400','700'] });

export const metadata: Metadata = {
  title: '赛博祈福管理局',
  description: '画技、功德、GPA、金光与私募狗峰——今日愿望，点击生效。',
  openGraph: { title: '赛博祈福管理局', description: '今日不靠运气，靠点击。', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

import './globals.css';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: "A91X",
  description: "Rapid Beam Booster",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

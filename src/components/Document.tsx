import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  locale: string;
  bodyClassName?: string;
};

export default function Document({ children, locale, bodyClassName }: Props) {
  return (
    <html className={inter.className} lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        {/* SEO Keywords */}
        <meta name="keywords" content="简历制作,在线简历,免费简历模板,个人简历,求职简历,resume builder,cv maker,free resume templates" />
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2634092855285462" 
          crossOrigin="anonymous"
        />
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}

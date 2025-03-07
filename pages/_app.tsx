import type { AppProps } from 'next/app';
import GoogleAnalytics from '../components/GoogleAnalytics';
import GoogleAdSense from '../components/GoogleAdSense';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // 替换为您的实际ID
  const gaId = 'G-XXXXXXXXXX'; 
  const adSenseId = 'ca-pub-2634092855285462';
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        {/* 其他元数据 */}
      </Head>
      <GoogleAnalytics measurementId={gaId} />
      <GoogleAdSense adClientId={adSenseId} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 
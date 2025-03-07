import Script from 'next/script';

const GoogleAdSense = ({ adClientId }: { adClientId: string }) => {
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
      crossOrigin="anonymous"
    />
  );
};

export default GoogleAdSense; 
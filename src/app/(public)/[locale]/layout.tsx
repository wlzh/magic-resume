import { ReactNode } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale
} from "next-intl/server";
import Document from "@/components/Document";
import { locales } from "@/i18n/config";
import { Providers } from "@/app/providers";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const baseUrl = "https://jianli.869hr.uk";

  const keywords = locale === "zh" 
    ? "简历制作,在线简历,免费简历模板,个人简历,求职简历,简历生成器,魔方简历,专业简历,简历设计,简历工具"
    : "resume builder,cv maker,free resume templates,professional resume,job application,resume design,magic resume,resume tool,online resume,career";

  return {
    title: t("title") + " - " + t("subtitle"),
    description: t("description"),
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale,
      alternateLocale: locale === "en" ? ["zh"] : ["en"]
    },
    verification: {
      google: "ca-pub-2634092855285462"
    },
    other: {
      "google-adsense-account": "ca-pub-2634092855285462"
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  setRequestLocale(locale);

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <Document locale={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </Document>
  );
}

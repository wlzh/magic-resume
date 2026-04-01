import { useTranslations } from "@/i18n/compat/client";
import Logo from "@/components/shared/Logo";
import { Youtube, Twitter, Globe, BookOpen, Send, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: "https://youtube.com/@gxjdian",
    icon: Youtube,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/gxjdian",
    icon: Twitter,
  },
  {
    label: "博客",
    href: "https://869hr.uk",
    icon: Globe,
  },
  {
    label: "大坝资源站",
    href: "https://doc.869hr.uk",
    icon: BookOpen,
  },
  {
    label: "Telegram",
    href: "https://t.me/tgmShareAI",
    icon: Send,
  },
  {
    label: "微信群",
    href: "https://qr.869hr.uk/aitech",
    icon: MessageCircle,
  },
];

export default function Footer() {
  const t = useTranslations("home");

  return (
    <footer className="py-16 md:py-24 border-t border-border/50 bg-secondary/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-serif font-semibold text-lg text-foreground/80">大坝简历</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-foreground/80 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground/60 font-light">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useLocation } from "react-router-dom";
import { WHATSAPP_URL, EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "../config";

const MaskIcon = ({ src }: { src: string }) => (
  <div
    className="bg-current shrink-0 w-5 h-5 sm:w-4 sm:h-4"
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }}
  />
);

const FooterLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? undefined : "_blank"}
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
  >
    <MaskIcon src={icon} />
    <span className="tracking-wide hidden sm:inline">{children}</span>
  </a>
);

export default function Footer() {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 bg-brand text-white shadow-[0_-2px_8px_rgba(0,0,0,0.15)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center justify-center px-4 py-4 sm:py-2.5 gap-8 sm:gap-10">
        <FooterLink href={INSTAGRAM_URL} icon="instagram.svg">
          {INSTAGRAM_HANDLE}
        </FooterLink>
        <FooterLink href={WHATSAPP_URL} icon="whatsapp.svg">
          +351 915 204 911
        </FooterLink>
        <FooterLink href={`mailto:${EMAIL}`} icon="email.svg">
          {EMAIL}
        </FooterLink>
      </div>
    </footer>
  );
}

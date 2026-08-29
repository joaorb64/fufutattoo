import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, LANG_LABELS, resolveLocale } from "../i18n";

const TopBar = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const showTopBar = location.pathname !== "/";

  if (!showTopBar) return null;

  const navLinks = [
    { to: "/", key: "nav.home" },
    { to: "/about", key: "nav.about" },
    { to: "/flashes", key: "nav.flashes" },
    { to: "/info", key: "nav.info" },
    { to: "/studio", key: "nav.studio" },
  ];

  const LangSwitcher = ({ className = "" }: { className?: string }) => (
    <select
      value={resolveLocale(i18n.language)}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className={`bg-white/10 border border-white rounded px-2 py-1 text-white text-sm font-[Quicksand] cursor-pointer focus:outline-none focus:ring-1 focus:ring-white ${className}`}
      aria-label={t("topbar.language")}
    >
      {SUPPORTED_LANGS.map((lang) => (
        <option key={lang} value={lang} className="text-zinc-900">
          {LANG_LABELS[lang]}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {/* Mobile topbar */}
      <header
        className="fixed sm:hidden inset-x-0 top-0 z-50 bg-brand text-white shadow-lg"
        style={{ WebkitTextStroke: "0.4px currentColor" }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-[BohoSans] text-3xl tracking-widest hover:text-teal-200 transition-colors">
            {t("topbar.title")}
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              aria-label={menuOpen ? t("topbar.closeMenu") : t("topbar.openMenu")}
            >
              {menuOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop nav — brand left, links centered, language switcher right */}
      <nav
        className="fixed w-full top-0 left-0 z-50 py-4 bg-brand text-white shadow-lg hidden sm:flex items-center justify-center gap-3 md:gap-4 lg:gap-8 xl:gap-12 font-[BohoSans] text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wider"
        style={{ WebkitTextStroke: "0.4px currentColor" }}
      >
        <Link to="/" className="absolute left-4 text-xl md:text-xl lg:text-2xl xl:text-3xl tracking-widest hover:text-teal-200 transition-colors">
          {t("topbar.title")}
        </Link>

        {navLinks.map(({ to, key }) =>
          to === "/flashes" ? (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative ${isActive ? "opacity-80" : ""}`
              }
            >
              <div className="px-3 md:px-4 lg:px-5 xl:px-6 bg-linear-to-r from-pink-200 via-amber-100 to-teal-200 rounded-full text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-zinc-900 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-110 transform">
                {t(key)}
              </div>
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group relative ${isActive ? "text-[#18594E]" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {t(key)}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </>
              )}
            </NavLink>
          ),
        )}

        {/* Absolutely positioned so it doesn't push the centered links */}
        <LangSwitcher className="absolute right-4" />
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} sm:hidden`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand text-white pt-16 shadow-xl transform transition-transform duration-300 sm:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col p-4 space-y-2">
          {navLinks.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-lg font-semibold hover:bg-teal-700 ${isActive ? "bg-brand-dark" : ""}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default TopBar;

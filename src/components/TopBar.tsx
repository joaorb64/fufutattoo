import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => i18n.changeLanguage("pt")}
        className={`px-2 py-1 border border-white rounded hover:bg-white/20 text-white text-sm cursor-pointer ${i18n.language.startsWith("pt") ? "bg-white/30 font-bold" : ""}`}
        aria-label="Português"
      >
        PT
      </button>
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`px-2 py-1 border border-white rounded hover:bg-white/20 text-white text-sm cursor-pointer ${i18n.language.startsWith("en") ? "bg-white/30 font-bold" : ""}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile topbar */}
      <header className="fixed sm:hidden inset-x-0 top-0 z-50 bg-red-800 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-[BohoSans] text-2xl tracking-widest hover:text-red-200 transition-colors">
            {t("topbar.title")}
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
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
      <nav className="fixed w-full top-0 left-0 z-50 py-4 bg-red-800 text-white shadow-lg hidden sm:flex items-center justify-center gap-12 font-[BohoSans] text-2xl tracking-wider">
        <Link to="/" className="absolute left-4 tracking-widest hover:text-red-200 transition-colors">
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
              <div className="px-6 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full text-2xl font-bold text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-110 transform">
                {t(key)}
              </div>
            </NavLink>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group relative ${isActive ? "text-red-200" : ""}`
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-red-800 text-white pt-16 shadow-xl transform transition-transform duration-300 sm:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col p-4 space-y-2">
          {navLinks.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-lg font-semibold hover:bg-red-700 ${isActive ? "bg-red-900" : ""}`
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

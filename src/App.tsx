import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { SplashDefs } from "./components/SplashImage";
import { SiteStructuredData } from "./components/StructuredData";
import { Outlet } from "react-router-dom";

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E`;

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col w-full">
      <SplashDefs />
      {/* Paper grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-9998 mix-blend-overlay opacity-[0.055]"
        style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: "200px 200px" }}
      />
      <SiteStructuredData />
      <ScrollToTop />
      <TopBar />
      <div className="flex-1 flex justify-center max-w-6xl mx-auto w-full pt-20 pb-14">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

import React, { useState } from "react";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Hero from "./components/Hero.jsx";
import ReactDOM from "react-dom/client";
import Flashes from "./pages/flashes/index.js";
import FlashDetail from "./pages/flashes/flashDetail";
import AboutMe from "./pages/aboutme/index.js";
import Information from "./pages/information/index.js";
import Studio from "./pages/studio/index.js";
import FlashEditor from "./pages/flashEditor";
import LanguageSplash, { hasChosenLanguage } from "./components/LanguageSplash";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Hero />,
        },
        {
          path: "/flashes",
          element: <Flashes />,
        },
        {
          path: "/flashes/:flashId",
          element: <FlashDetail />,
        },
        {
          path: "/about",
          element: <AboutMe />,
        },
        {
          path: "/prep-care",
          element: <Information />,
        },
        {
          path: "/info",
          element: <Navigate to="/prep-care" replace />,
        },
        {
          path: "/studio",
          element: <Studio />,
        },
      ],
    },
    // Unlinked internal tool — not part of the App shell (no topbar/footer),
    // reachable only by knowing the URL.
    {
      path: "/flash-editor",
      element: <FlashEditor />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

function Root() {
  const [langChosen, setLangChosen] = useState(hasChosenLanguage);
  // The editor is an internal tool, not part of the multi-language visitor
  // experience — never gate it behind the language choice screen.
  const isEditorRoute = window.location.pathname.endsWith("/flash-editor");

  return (
    <>
      {!langChosen && !isEditorRoute && (
        <LanguageSplash onDone={() => setLangChosen(true)} />
      )}
      <RouterProvider router={router} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

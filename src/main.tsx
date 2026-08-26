import React, { useState } from "react";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Hero from "./components/Hero.jsx";
import ReactDOM from "react-dom/client";
import Flashes from "./pages/flashes/index.js";
import FlashDetail from "./pages/flashes/flashDetail";
import AboutMe from "./pages/aboutme/index.js";
import Information from "./pages/information/index.js";
import Studio from "./pages/studio/index.js";
import LanguageSplash, { hasChosenLanguage } from "./components/LanguageSplash";

const router = createBrowserRouter([
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
        path: "/info",
        element: <Information />,
      },
      {
        path: "/studio",
        element: <Studio />,
      },
    ],
  },
]);

function Root() {
  const [langChosen, setLangChosen] = useState(hasChosenLanguage);

  return (
    <>
      {!langChosen && <LanguageSplash onDone={() => setLangChosen(true)} />}
      <RouterProvider router={router} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

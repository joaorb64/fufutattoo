import { ScrollRestoration } from "react-router-dom";

// New pages start at the top; going back/forward returns to where the visitor
// was (e.g. the same spot in the flash list after viewing a flash).
export default function ScrollToTop() {
  return <ScrollRestoration />;
}

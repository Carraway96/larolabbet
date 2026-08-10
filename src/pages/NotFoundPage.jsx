import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="empty-area">
      <span className="error-code">404</span>
      <span className="eyebrow">Sidan hittades inte</span>
      <h1>Här var det tomt i labbet.</h1>
      <p>Länken kan vara gammal eller så har sidan flyttat.</p>
      <Link className="button primary" to="/"><ArrowLeft size={18} /> Till startsidan</Link>
    </section>
  );
}

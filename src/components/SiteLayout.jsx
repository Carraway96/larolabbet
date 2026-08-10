import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUp, Menu, X } from "lucide-react";
import { subjects } from "../data/content";
import Icon from "./Icon";

const logoUrl = `${import.meta.env.BASE_URL}assets/larolabbet-logo.png`;

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const focusMain = () => {
    const main = document.getElementById("main-content");
    main?.setAttribute("tabindex", "-1");
    main?.focus();
    main?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <button className="skip-link" type="button" onClick={focusMain}>Hoppa till innehållet</button>

      <header className="mobile-header">
        <Link className="mobile-brand" to="/" aria-label="Lärolabbet – startsida" onClick={() => setMenuOpen(false)}>
          <img src={logoUrl} alt="" />
          <span>Lärolabbet</span>
        </Link>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="subject-navigation">
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>{menuOpen ? "Stäng" : "Ämnen"}</span>
        </button>
      </header>

      <aside className={`side-rail ${menuOpen ? "is-open" : ""}`} id="subject-navigation">
        <Link className="brand" to="/" aria-label="Lärolabbet – startsida" onClick={() => setMenuOpen(false)}>
          <img src={logoUrl} alt="Lärolabbets logotyp" />
          <span className="brand-name">Lärolabbet</span>
          <span className="brand-tagline">Upptäck SO, steg för steg.</span>
        </Link>
        <nav className="subject-nav" aria-label="Ämnen">
          <p className="nav-label">Välj ämne</p>
          {subjects.map((subject) => (
            <NavLink key={subject.id} to={`/amne/${subject.id}`} onClick={() => setMenuOpen(false)} className={({ isActive }) => `subject-nav-link tone-${subject.tone}${isActive ? " active" : ""}`}>
              <span className="nav-icon"><Icon name={subject.icon} size={20} /></span>
              <span>{subject.shortTitle}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-note">
          <span className="rail-note-icon"><Icon name="book" size={18} /></span>
          <p><strong>Allt på samma plats.</strong><br />Film, bildspel, text och dokument.</p>
        </div>
      </aside>

      {menuOpen && <button className="menu-scrim" type="button" aria-label="Stäng ämnesmenyn" onClick={() => setMenuOpen(false)} />}

      <div className="page-shell">
        <main id="main-content"><Outlet /></main>
        <footer className="site-footer">
          <div>
            <img src={logoUrl} alt="" />
            <p><strong>Lärolabbet</strong><br />Undervisningsmaterial i SO.</p>
          </div>
          <p>Skapat för nyfikna elever · © {new Date().getFullYear()} Roger Ljunggren</p>
          <button type="button" className="footer-top-button" onClick={focusMain}><ArrowUp size={16} aria-hidden="true" /> Till toppen</button>
        </footer>
      </div>
    </div>
  );
}

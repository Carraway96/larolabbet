import { ArrowRight, CheckCircle2, FlaskConical, Layers3, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import { subjects } from "../data/content";

const logoUrl = `${import.meta.env.BASE_URL}assets/larolabbet-logo.png`;

export default function HomePage() {
  const scrollToSubjects = () => document.getElementById("amnen")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">SO som väcker nyfikenhet</span>
          <h1>Välkommen till<br /><em>Lärolabbet.</em></h1>
          <p>Här hittar du tydligt och samlat material i samhällskunskap, geografi, historia och religion.</p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={scrollToSubjects}>Välj ämne <ArrowRight size={18} aria-hidden="true" /></button>
            <Link className="button secondary" to="/arbetsomrade/lag-och-ratt"><PlayCircle size={18} aria-hidden="true" /> Börja med Lag & rätt</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <div className="logo-disc"><img src={logoUrl} alt="" /></div>
          <span className="floating-note note-one">Upptäck</span>
          <span className="floating-note note-two">Förstå</span>
          <span className="floating-note note-three">Resonera</span>
        </div>
      </section>

      <section className="section subjects-section" id="amnen">
        <div className="section-heading">
          <div><span className="eyebrow">Fyra ämnen</span><h2>Vad vill du lära dig idag?</h2></div>
          <p>Välj ett ämne för att se alla arbetsområden. Materialet är samlat så att du kan arbeta i din egen takt.</p>
        </div>
        <div className="subject-grid">
          {subjects.map((subject, index) => <SubjectCard key={subject.id} subject={subject} index={index} />)}
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-copy">
          <span className="eyebrow light">Nytt i labbet</span>
          <h2>Lag & rätt</h2>
          <p>Följ rättskedjan från brott till dom. Arbetsområdet innehåller en introduktionsfilm, en presentation med 25 bilder och en checklista inför provet.</p>
          <ul className="feature-list">
            <li><CheckCircle2 /> Film med introduktion</li>
            <li><CheckCircle2 /> Bläddringsbar presentation</li>
            <li><CheckCircle2 /> Checklista för repetition</li>
          </ul>
          <Link className="button cream" to="/arbetsomrade/lag-och-ratt">Öppna arbetsområdet <ArrowRight size={18} /></Link>
        </div>
        <div className="featured-card" aria-hidden="true">
          <span className="featured-index">01</span>
          <div className="featured-symbol"><FlaskConical /></div>
          <div><span>Samhällskunskap</span><strong>Lag<br />& rätt</strong></div>
          <Layers3 className="featured-layers" />
        </div>
      </section>

      <section className="section method-section">
        <div className="section-heading compact"><div><span className="eyebrow">En enkel väg genom materialet</span><h2>Se. Utforska. Repetera.</h2></div></div>
        <ol className="method-grid">
          <li><span>1</span><h3>Se introduktionen</h3><p>Få en snabb överblick och aktivera dina förkunskaper.</p></li>
          <li><span>2</span><h3>Utforska innehållet</h3><p>Bläddra i presentationen och stanna där du behöver.</p></li>
          <li><span>3</span><h3>Repetera</h3><p>Använd checklistan och försäkra dig om att begreppen sitter.</p></li>
        </ol>
      </section>
    </>
  );
}

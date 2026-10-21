import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Link2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import AreaNavigation from "../components/AreaNavigation";
import { cases, concepts, countries, scaleLabels } from "../data/conceptTraining";

const activities = [
  { id: "detective", title: "Begreppsdetektiven", short: "Hitta begreppet i en händelse", icon: Search },
  { id: "scale", title: "Demokratiskalan", short: "Undersök hur ett land styrs", icon: SlidersHorizontal },
  { id: "match", title: "Para ihop", short: "Koppla ord till förklaring", icon: Link2 },
];

function Progress({ current, total, label }) {
  return <div className="training-progress"><span>{label} {current} av {total}</span><progress aria-label={label} value={current} max={total} /></div>;
}

function Feedback({ correct, children }) {
  return <div className={`training-feedback ${correct ? "is-correct" : "is-retry"}`} role="status"><strong>{correct ? "Precis!" : "Titta på ledtrådarna"}</strong><p>{children}</p></div>;
}

function Completion({ title, children, onRestart }) {
  return <div className="training-completion"><span className="completion-icon"><Check size={32} /></span><span className="eyebrow">Omgången klar</span><h2>{title}</h2><p>{children}</p><button className="button primary" onClick={onRestart}><RotateCcw size={17} />Träna igen</button></div>;
}

function Detective() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [done, setDone] = useState(false);
  const [firstCorrect, setFirstCorrect] = useState(0);
  const [attempted, setAttempted] = useState(false);
  if (done) return <Completion title="Alla fall lösta!" onRestart={() => { setIndex(0); setChoice(null); setDone(false); setFirstCorrect(0); setAttempted(false); }}>Du hittade rätt direkt i {firstCorrect} av {cases.length} fall. Alla begrepp är nu genomgångna. Prova gärna en annan övning.</Completion>;
  const item = cases[index];
  const correct = choice === item.answer;
  const choose = (value) => {
    if (!attempted && value === item.answer) setFirstCorrect((score) => score + 1);
    setAttempted(true);
    setChoice(value);
  };
  return <>
    <Progress current={index + 1} total={cases.length} label="Fall" />
    <h2>Vilket begrepp gömmer sig här?</h2>
    <p className="training-instruction">Läs händelsen och välj det begrepp som passar bäst.</p>
    <blockquote className="scenario-card"><Search size={24} aria-hidden="true" /><p>{item.text}</p></blockquote>
    <div className="detective-options">{item.options.map((option, i) => <button key={option} aria-pressed={choice === option} disabled={correct} className={`answer-option ${choice === option ? (correct ? "correct" : "incorrect") : ""}`} onClick={() => choose(option)}><span>{String.fromCharCode(65 + i)}</span>{option}{choice === option && correct && <Check size={20} />}</button>)}</div>
    {choice && <Feedback correct={correct}>{correct ? item.why : "Läs händelsen en gång till. Vilket av orden beskriver det som händer? Du kan välja ett annat svar."}</Feedback>}
    {correct && <button className="button primary training-next" onClick={() => { if (index === cases.length - 1) setDone(true); else { setIndex(index + 1); setChoice(null); setAttempted(false); } }}>{index === cases.length - 1 ? "Visa resultat" : "Nästa fall"}<ArrowRight size={17} /></button>}
  </>;
}

function DemocracyScale() {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(2);
  const [touched, setTouched] = useState(false);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <Completion title="Du har undersökt fem länder!" onRestart={() => { setIndex(0); setPosition(2); setTouched(false); setChecked(false); setDone(false); }}>Fundera: vilka ledtrådar säger mest om folkets möjlighet att påverka och välja bort dem som styr?</Completion>;
  const item = countries[index];
  const change = (value) => { setPosition(value); setTouched(true); setChecked(false); };
  return <>
    <Progress current={index + 1} total={countries.length} label="Land" />
    <h2>Hur mycket får folket påverka?</h2>
    <p className="training-instruction">Läs om landet. Flytta markören till den plats du tycker passar.</p>
    <div className="scenario-card scale-scenario"><span className="country-symbol" aria-hidden="true">{String.fromCharCode(65 + index)}</span><div><h3>{item.name}</h3><p>{item.text}</p></div></div>
    <div className="democracy-scale">
      <div className="scale-endpoints"><strong>Diktatur</strong><strong>Demokrati</strong></div>
      <input aria-label="Placera landet mellan diktatur och demokrati" aria-valuetext={scaleLabels[position]} type="range" min="0" max="4" step="1" value={position} onChange={(event) => change(Number(event.target.value))} />
      <div className="scale-stops">{scaleLabels.map((label, i) => <button key={label} aria-pressed={touched && position === i} onClick={() => change(i)}><span aria-hidden="true">{i + 1}</span>{label}</button>)}</div>
      <p className="scale-selection" aria-live="polite">{touched ? `Din placering: ${scaleLabels[position]}` : "Välj en plats på skalan"}</p>
    </div>
    <button className="button primary" disabled={!touched || checked} onClick={() => setChecked(true)}>Jämför med förklaringen<ArrowRight size={17} /></button>
    {checked && <div className="training-feedback is-correct" role="status"><strong>{position === item.position ? "Din placering stämmer med övningens förslag." : `Övningens förslag: ${scaleLabels[item.position].toLowerCase()}.`}</strong><p>{item.why}</p><span className="concept-connection">Begrepp att koppla till: {item.terms}</span></div>}
    {checked && <button className="button secondary training-next" onClick={() => { if (index === countries.length - 1) setDone(true); else { setIndex(index + 1); setPosition(2); setTouched(false); setChecked(false); } }}>{index === countries.length - 1 ? "Avsluta övningen" : "Nästa land"}<ArrowRight size={17} /></button>}
    <p className="scale-note">Länderna är påhittade. Skalan är ett stöd för resonemang, inte ett exakt mått. Monarki och republik beskriver statschefens roll och är inga steg på skalan.</p>
  </>;
}

function Matching() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState("");
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);
  const items = concepts.slice(round * 5, round * 5 + 5);
  const definitions = [items[2], items[4], items[0], items[3], items[1]];
  const check = (id) => {
    if (selected === null) { setMessage("Välj ett begrepp först och sedan en förklaring."); setWrong(false); return; }
    if (selected === id) {
      setMatched([...matched, id]); setSelected(null); setWrong(false);
      setMessage(`${concepts[id].term} – rätt ihopparat!`);
    } else { setWrong(true); setMessage("De hör inte ihop. Prova en annan förklaring eller välj ett nytt begrepp."); }
  };
  if (done) return <Completion title="25 begrepp ihopparade!" onRestart={() => { setRound(0); setSelected(null); setMatched([]); setMessage(""); setWrong(false); setDone(false); }}>Du har tränat på hela begreppslistan. Utmana dig själv genom att förklara några av orden utan att läsa förklaringen.</Completion>;
  return <>
    <Progress current={round + 1} total={5} label="Omgång" />
    <h2>Vilka hör ihop?</h2>
    <p className="training-instruction">Tryck på ett begrepp och sedan på dess förklaring. {matched.length} av 5 par klara.</p>
    <div className="matching-board">
      <div className="matching-terms"><h3>Begrepp</h3>{items.map((item) => <button key={item.id} className={`match-card ${selected === item.id ? "selected" : ""} ${matched.includes(item.id) ? "matched" : ""}`} disabled={matched.includes(item.id)} aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setMessage(""); }}>{matched.includes(item.id) && <Check size={18} />}<span>{item.term}</span></button>)}</div>
      <div><h3>Förklaring</h3>{definitions.map((item) => <button key={item.id} className={`match-card definition-card ${matched.includes(item.id) ? "matched" : ""}`} disabled={matched.includes(item.id)} onClick={() => check(item.id)}>{matched.includes(item.id) && <Check size={18} />}<span>{item.definition}</span></button>)}</div>
    </div>
    <div className={`match-status ${wrong ? "retry" : ""}`} role="status">{message || (selected !== null ? `Valt: ${concepts[selected].term}. Välj en förklaring.` : "Börja med att välja ett begrepp.")}</div>
    {matched.length === 5 && <button className="button primary training-next" onClick={() => { if (round === 4) setDone(true); else { setRound(round + 1); setSelected(null); setMatched([]); setMessage(""); setWrong(false); } }}>{round === 4 ? "Avsluta övningen" : "Nästa fem begrepp"}<ArrowRight size={17} /></button>}
  </>;
}

export default function ConceptTrainingPage() {
  const [active, setActive] = useState("detective");
  const [session, setSession] = useState(0);
  return <>
    <header className="training-hero">
      <Link className="back-link" to="/arbetsomrade/demokrati-diktatur-medier"><ArrowLeft size={16} />Demokrati, diktatur & medier</Link>
      <div className="training-title-row"><div><span className="eyebrow">Tänk · koppla · förstå</span><h1>Begreppsträning</h1><p>Små övningar. Stora samband. Träna i din egen takt.</p></div><span className="training-badge">25<span>begrepp att upptäcka</span></span></div>
    </header>
    <AreaNavigation />
    <div className="training-body">
      <nav className="activity-picker" aria-label="Välj övning">{activities.map(({ id, title, short, icon: Icon }, i) => <button key={id} className={active === id ? "active" : ""} aria-pressed={active === id} onClick={() => setActive(id)}><span className="activity-icon"><Icon size={22} aria-hidden="true" /></span><span><small>Övning 0{i + 1}</small><strong>{title}</strong><span>{short}</span></span><ArrowRight className="activity-arrow" size={18} aria-hidden="true" /></button>)}</nav>
      <section className="exercise-panel" aria-label={activities.find((activity) => activity.id === active).title}>
        <div className="exercise-toolbar"><span className="eyebrow">{activities.find((activity) => activity.id === active).title}</span><button onClick={() => setSession(session + 1)} className="restart-button"><RotateCcw size={15} />Börja om</button></div>
        <div key={session}>
          <div hidden={active !== "detective"}><Detective /></div>
          <div hidden={active !== "scale"}><DemocracyScale /></div>
          <div hidden={active !== "match"}><Matching /></div>
        </div>
      </section>
      <p className="training-footnote">Ingen tidspress. Du kan försöka flera gånger och byta övning när du vill. Dina framsteg finns kvar tills du lämnar sidan.</p>
    </div>
  </>;
}

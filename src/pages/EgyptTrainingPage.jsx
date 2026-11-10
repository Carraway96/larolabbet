import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, GitBranch, History, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import AreaNavigation from "../components/AreaNavigation";
import { connections, journeys, kingdoms, nileChain, timelineEvents } from "../data/egyptTraining";
import "../egypt-training.css";

const activities = [
  { id: "journey", title: "Tidsresenären", short: "Upptäck vilket rike du har hamnat i", icon: Compass },
  { id: "timeline", title: "Bygg tidslinjen", short: "Ordna rikena och placera händelser", icon: History },
  { id: "connections", title: "Sambandsjakten", short: "Koppla orsaker till följder", icon: GitBranch },
];

function Progress({ current, total, label }) {
  return <div className="training-progress"><span>{label} {current} av {total}</span><progress aria-label={label} value={current} max={total} /></div>;
}

function Feedback({ correct, children }) {
  return <div className={`training-feedback ${correct ? "is-correct" : "is-retry"}`} role="status"><strong>{correct ? "Precis!" : "Försök igen"}</strong><p>{children}</p></div>;
}

function Completion({ title, children, restart }) {
  return <div className="training-completion"><span className="completion-icon"><Check size={32} /></span><span className="eyebrow">Omgången klar</span><h2 tabIndex={-1} ref={(node) => node?.focus()}>{title}</h2><p>{children}</p><button className="button primary" onClick={restart}><RotateCcw size={17} />Spela igen</button></div>;
}

function Next({ onClick, children = "Nästa" }) {
  return <button className="button primary training-next" onClick={onClick}>{children}<ArrowRight size={17} /></button>;
}

function TimeTraveller() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [score, setScore] = useState(0);
  const restart = () => { setIndex(0); setChoice(null); setAttempted(false); setScore(0); };
  if (index === journeys.length) return <Completion title="Alla tidsresor klara!" restart={restart}>Du hittade rätt rike på första försöket i {score} av {journeys.length} resor. Du har övat på alla tre rikenas kännetecken.</Completion>;
  const item = journeys[index];
  const correct = choice === item.kingdom;
  return <>
    <Progress current={index + 1} total={journeys.length} label="Resa" />
    <h2>Vilket rike har du hamnat i?</h2>
    <p className="training-instruction">Läs scenen. Leta efter ledtrådar och välj ett rike.</p>
    <blockquote className="scenario-card"><Compass size={24} aria-hidden="true" /><p>{item.text}</p></blockquote>
    <div className="detective-options">{kingdoms.map((kingdom, i) => <button key={kingdom.id} className={`answer-option ${choice === kingdom.id ? (correct ? "correct" : "incorrect") : ""}`} aria-pressed={choice === kingdom.id} disabled={correct} onClick={() => { if (!attempted && kingdom.id === item.kingdom) setScore(score + 1); setAttempted(true); setChoice(kingdom.id); }}><span>{String.fromCharCode(65 + i)}</span>{kingdom.name}{correct && choice === kingdom.id && <Check size={20} />}</button>)}</div>
    {choice && <Feedback correct={correct}>{correct ? item.why : "Läs scenen en gång till. Vilka händelser beskrivs och vad har hänt före dem? Välj ett annat rike."}</Feedback>}
    {correct && <Next onClick={() => { setIndex(index + 1); setChoice(null); setAttempted(false); }}>{index === journeys.length - 1 ? "Visa resultat" : "Nästa resa"}</Next>}
  </>;
}

function Timeline() {
  const [order, setOrder] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState("order");
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const restart = () => { setOrder([]); setSelected(null); setStage("order"); setIndex(0); setPlaced([]); setFeedback(null); };
  if (stage === "done") return <Completion title="Du har byggt Egyptens tidslinje!" restart={restart}>Du har ordnat de tre rikena och placerat {timelineEvents.length} händelser. Mellan rikena fanns perioder av splittring eller främmande styre.</Completion>;
  const placeKingdom = (slot) => {
    if (!selected) { setFeedback({ correct: false, text: "Välj först ett rike bland korten. Tryck sedan på nästa lediga plats." }); return; }
    if (slot !== order.length) { setFeedback({ correct: false, text: "Börja med den tidigaste platsen och fortsätt åt höger, en plats i taget." }); return; }
    if (selected !== kingdoms[slot].id) { setFeedback({ correct: false, text: slot === 0 ? "Vilket rike kommer först? Namnet ger dig en ledtråd." : "Tänk på ordningen: gamla, mellersta, nya. Välj ett annat kort." }); return; }
    setOrder([...order, selected]); setSelected(null); setFeedback({ correct: true, text: `${kingdoms[slot].name} är på rätt plats. ${kingdoms[slot].summary}` });
  };
  const placeEvent = (kingdom) => {
    const item = timelineEvents[index];
    if (item.kingdom !== kingdom) { setFeedback({ correct: false, text: "Den händelsen hör till en annan period. Leta efter ledtrådar om pyramidbyggen, hyksos eller erövringar." }); return; }
    setPlaced([...placed, index]); setFeedback({ correct: true, text: item.why });
  };
  const answered = placed.includes(index);
  return <>
    <Progress current={stage === "order" ? order.length : index + 1} total={stage === "order" ? 3 : timelineEvents.length} label={stage === "order" ? "Riken placerade" : "Händelse"} />
    <h2>{stage === "order" ? "Vilket rike kom först?" : "Var på tidslinjen hör händelsen hemma?"}</h2>
    <p className="training-instruction">{stage === "order" ? "Välj ett rike och tryck på nästa lediga plats. Börja med det äldsta. Du behöver inte kunna exakta årtal." : "Läs händelsekortet och tryck på det rike som passar. Tidslinjen hjälper dig att se ordningen."}</p>
    {stage === "order" && <div className="egypt-card-bank" aria-label="Riken att placera">{[kingdoms[1], kingdoms[2], kingdoms[0]].map((kingdom) => <button key={kingdom.id} className={`match-card ${selected === kingdom.id ? "selected" : ""}`} disabled={order.includes(kingdom.id)} aria-pressed={selected === kingdom.id} onClick={() => { setSelected(kingdom.id); setFeedback(null); }}>{order.includes(kingdom.id) && <Check size={18} />}{kingdom.name}</button>)}</div>}
    {stage === "events" && <blockquote className="scenario-card"><History size={24} aria-hidden="true" /><p>{timelineEvents[index].text}</p></blockquote>}
    <p className="egypt-time-direction">Äldst → Yngst · årtal före Kristus räknas nedåt</p>
    <div className="egypt-timeline">{kingdoms.map((kingdom, slot) => <div key={kingdom.id} className="egypt-era-group">
      <button className={`egypt-era ${stage === "order" && !order[slot] ? "empty" : ""}`} disabled={stage === "order" ? Boolean(order[slot]) : answered} onClick={() => stage === "order" ? placeKingdom(slot) : placeEvent(kingdom.id)} aria-label={stage === "order" ? (order[slot] ? kingdom.name : `Plats ${slot + 1}: ${slot === 0 ? "tidigast" : slot === 1 ? "i mitten" : "senast"}`) : `Placera händelsen i ${kingdom.name.toLowerCase()}`}>
        <span className="eyebrow">{slot + 1}</span><strong>{stage === "order" && !order[slot] ? "Placera ett rike här" : kingdom.name}</strong>
        {(stage !== "order" || order[slot]) && <><span>{kingdom.years}</span><small>{kingdom.summary}</small></>}
      </button>
      {kingdom.gap && (stage !== "order" || order.length === 3) && <p className="egypt-gap"><span aria-hidden="true">↳</span> Mellanperiod: {kingdom.gap}</p>}
      {stage === "events" && <ul className="egypt-placed-events">{placed.filter((eventIndex) => timelineEvents[eventIndex].kingdom === kingdom.id).map((eventIndex) => <li key={eventIndex}><Check size={15} aria-hidden="true" />{timelineEvents[eventIndex].text}</li>)}</ul>}
    </div>)}</div>
    {feedback && <Feedback correct={feedback.correct}>{feedback.text}</Feedback>}
    {stage === "order" && order.length === 3 && <Next onClick={() => { setStage("events"); setFeedback(null); }}>Placera händelser</Next>}
    {stage === "events" && answered && <Next onClick={() => { if (index === timelineEvents.length - 1) setStage("done"); else setIndex(index + 1); setFeedback(null); }}>{index === timelineEvents.length - 1 ? "Avsluta tidslinjen" : "Nästa händelse"}</Next>}
    <p className="scale-note">Tidslinjen visar ordningen. Avstånd och periodernas längd är inte skalenliga. Årtalen är ungefärliga och följer undervisningsmaterialet.</p>
  </>;
}

function ConnectionHunt() {
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [stage, setStage] = useState("pairs");
  const [chain, setChain] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const restart = () => { setSelected(null); setMatched([]); setStage("pairs"); setChain([]); setFeedback(null); };
  if (stage === "done") return <Completion title="Du har hittat sambanden!" restart={restart}>Du har kopplat ihop fyra orsaker med deras följder och byggt en kedja från Nilens vatten till arbetarnas strejk. Öva gärna på att förklara sambanden med egna ord.</Completion>;
  const match = (id) => {
    if (selected === null) { setFeedback({ correct: false, text: "Välj först en orsak och sedan den följd som passar." }); return; }
    if (selected !== id) { setFeedback({ correct: false, text: "De hör inte ihop i den här övningen. Tänk på vad just den valda orsaken leder till och välj en annan följd." }); return; }
    setMatched([...matched, id]); setSelected(null); setFeedback({ correct: true, text: connections[id].why });
  };
  const addChain = (id) => {
    if (id !== chain.length) { setFeedback({ correct: false, text: chain.length === 0 ? "Börja med förändringen i Nilen. Vad händer med vattnet?" : "Tänk ett steg i taget: vad blir den direkta följden av det sista kortet i kedjan?" }); return; }
    setChain([...chain, id]); setFeedback({ correct: true, text: id === 3 ? "Kedjan är klar! Mindre vatten gav mindre skördar. När matbetalningen uteblev strejkade arbetarna." : "Rätt steg! Vilken följd kommer härnäst?" });
  };
  return <>
    <Progress current={stage === "pairs" ? matched.length : chain.length} total={4} label={stage === "pairs" ? "Samband klara" : "Steg i kedjan"} />
    <h2>{stage === "pairs" ? "Vad leder det till?" : "Från Nilens vatten till strejk"}</h2>
    <p className="training-instruction">{stage === "pairs" ? "Välj en orsak och sedan den följd som passar. Du kan byta orsak innan du svarar." : "Bygg en kedja med fyra steg. Tryck på korten i den ordning som förklarar hur mindre vatten kunde leda till strejk."}</p>
    {stage === "pairs" ? <div className="matching-board">
      <div className="matching-terms"><h3>Orsak</h3>{connections.map((item, id) => <button key={id} className={`match-card ${selected === id ? "selected" : ""} ${matched.includes(id) ? "matched" : ""}`} aria-pressed={selected === id} disabled={matched.includes(id)} onClick={() => { setSelected(id); setFeedback(null); }}>{matched.includes(id) && <Check size={18} />}<span>{item.cause}</span></button>)}</div>
      <div><h3>Följd</h3>{[2, 0, 3, 1].map((id) => <button key={id} className={`match-card definition-card ${matched.includes(id) ? "matched" : ""}`} disabled={matched.includes(id)} onClick={() => match(id)}>{matched.includes(id) && <Check size={18} />}<span>{connections[id].effect}</span></button>)}</div>
    </div> : <>
      <ol className="egypt-chain" aria-label="Din orsakskedja">{nileChain.map((text, id) => <li key={id} className={chain.includes(id) ? "filled" : ""}><span>{id + 1}</span>{chain.includes(id) ? text : "Nästa steg …"}</li>)}</ol>
      <div className="egypt-chain-options" aria-label="Steg att välja">{[2, 0, 3, 1].map((id) => <button className={`match-card ${chain.includes(id) ? "matched" : ""}`} key={id} disabled={chain.includes(id)} onClick={() => addChain(id)}>{chain.includes(id) && <Check size={18} />}{nileChain[id]}</button>)}</div>
    </>}
    <p className="egypt-selection" role="status">{stage === "pairs" && selected !== null ? `Vald orsak: ${connections[selected].cause}` : ""}</p>
    {feedback && <Feedback correct={feedback.correct}>{feedback.text}</Feedback>}
    {stage === "pairs" && matched.length === connections.length && <Next onClick={() => { setStage("chain"); setFeedback(null); }}>Bygg en orsakskedja</Next>}
    {stage === "chain" && chain.length === nileChain.length && <Next onClick={() => setStage("done")}>Avsluta sambandsjakten</Next>}
    {stage === "chain" && <p className="scale-note">Kedjan följer förklaringen i undervisningsmaterialet och förenklar ett historiskt förlopp som hade flera orsaker.</p>}
  </>;
}

export default function EgyptTrainingPage() {
  const [active, setActive] = useState("journey");
  const [sessions, setSessions] = useState({ journey: 0, timeline: 0, connections: 0 });
  const activity = activities.find((item) => item.id === active);
  return <>
    <header className="training-hero egypt-hero">
      <Link className="back-link" to="/arbetsomrade/flodkulturen-i-egypten"><ArrowLeft size={16} />Flodkulturen i Egypten</Link>
      <div className="training-title-row"><div><span className="eyebrow">Upptäck · ordna · förklara</span><h1>Egyptens tre riken</h1><p>Res genom historien, bygg en tidslinje och upptäck hur händelser hänger ihop.</p></div><span className="training-badge">3<span>riken att upptäcka</span></span></div>
    </header>
    <AreaNavigation areaId="flodkulturen-i-egypten" trainingLabel="Egyptens tre riken – spel" trainingPath="spel" />
    <div className="training-body egypt-training">
      <nav className="activity-picker" aria-label="Välj spel">{activities.map(({ id, title, short, icon: Icon }, i) => <button key={id} aria-pressed={active === id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><span className="activity-icon"><Icon size={22} aria-hidden="true" /></span><span><small>Spel 0{i + 1}</small><strong>{title}</strong><span>{short}</span></span><ArrowRight className="activity-arrow" size={18} aria-hidden="true" /></button>)}</nav>
      <section className="exercise-panel" aria-label={activity.title}>
        <div className="exercise-toolbar"><span className="eyebrow">{activity.title}</span><button className="restart-button" onClick={() => setSessions({ ...sessions, [active]: sessions[active] + 1 })}><RotateCcw size={15} />Börja om spelet</button></div>
        <div hidden={active !== "journey"}><TimeTraveller key={sessions.journey} /></div>
        <div hidden={active !== "timeline"}><Timeline key={sessions.timeline} /></div>
        <div hidden={active !== "connections"}><ConnectionHunt key={sessions.connections} /></div>
      </section>
      <p className="training-footnote">Ingen tidspress. Försök flera gånger och byt spel när du vill. Dina framsteg finns kvar tills du lämnar sidan. Börja om startar bara om det valda spelet.</p>
    </div>
  </>;
}

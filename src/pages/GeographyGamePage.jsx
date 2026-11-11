import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Flag, Globe2, LockKeyhole, Map, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import AreaNavigation from "../components/AreaNavigation";
import GeographyMap from "../components/GeographyMap";
import map from "../data/geographyMap.json";
import { countries, countryById, levels } from "../data/geographyGame";
import { answerQuestion, freshProgress, nextQuestion, parseProgress, startRound, STORAGE_KEY } from "../data/geographyEngine";
import "../geography-game.css";

const areaId = "jordens-inre-och-yttre-krafter";
const icons = [Compass, Globe2, Map, Flag];
const mapById = Object.fromEntries(map.countries.map(country => [country.id, country]));

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? parseProgress(raw) : null;
    return { progress: stored || freshProgress(), warning: raw && !stored ? "Den tidigare sparningen kunde inte läsas. Du börjar med en ny spelomgång." : "" };
  } catch { return { progress: freshProgress(), warning: "Webbläsaren tillåter inte sparning. Du kan spela, men framstegen försvinner när sidan stängs." }; }
}

function Navigation() {
  return <AreaNavigation areaId={areaId} trainingLabel="Världskollen – geografispel" trainingPath="geografispel" />;
}

export default function GeographyGamePage() {
  const [session, setSession] = useState(readSession);
  const [overview, setOverview] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const heading = useRef(null);
  const { progress, warning } = session;
  const round = progress.round;
  const level = levels[round?.levelId || 0];
  const finished = round && round.index >= round.questions.length;
  const question = !finished && round?.questions[round.index];
  const country = question && countryById[question.countryId];
  const answer = question && round.answers[round.index];
  const isContinent = level.mode === "continent";
  const score = round?.answers.filter(item => item.correct).length || 0;
  const playing = !overview && round && !finished;

  function openRound() {
    setSelected(null); setOverview(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  }

  function commit(next) {
    let nextWarning = warning;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { nextWarning = "Framstegen kunde inte sparas. Spelet fungerar, men håll sidan öppen om du vill behålla denna omgång."; }
    setSession({ progress: next, warning: nextWarning });
  }
  function start(levelId, review = false) {
    commit(startRound(progress, levelId, review));
    openRound();
  }
  function advance() {
    commit(nextQuestion(progress)); setSelected(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }
  const roundMisses = round ? progress.misses.filter(miss => miss.levelId === round.levelId) : [];
  const resultMisses = round?.questions.filter((_, index) => !round.answers[index]?.correct) || [];
  const completedLevels = progress.best.filter((best, index) => best >= levels[index].required).length;

  return <div className={`geo-page ${playing ? "is-playing" : ""}`}>
    <header className="training-hero geo-hero">
      <Link className="back-link" to={`/arbetsomrade/${areaId}`}><ArrowLeft size={16} />Jordens inre och yttre krafter</Link>
      <div className="training-title-row"><div><span className="eyebrow">Geografi · länder & världsdelar</span><h1>Världskollen</h1><p>Från Sverige i Europa till länder över hela världen. En plats i taget.</p></div><span className="geo-hero-symbol" aria-hidden="true"><Globe2 size={72} /></span></div>
    </header>
    <Navigation />
    <div className="geo-body">
      {warning && <p className="geo-storage-warning" role="status">{warning}</p>}
      {overview ? <>
        <section className="geo-intro" aria-label="Så fungerar spelet">
          <div><span className="eyebrow">Titta. Tänk. Placera.</span><h2>En värld att lära känna</h2><p>Börja med Sverige. Lär dig sedan världsdelarna, upptäck fler länder och hitta deras platser på kartan.</p>
            <ul className="geo-rules"><li><Check size={18} />Välj först. Lås svaret när du har tänkt klart.</li><li><Check size={18} />Ett försök per fråga. Se rätt plats och lär av svaret.</li><li><Check size={18} />Missade länder kommer tillbaka i repetitionen.</li></ul>
            {round && !finished ? <><button className="button primary" onClick={openRound}>Fortsätt omgången <ArrowRight size={17} /></button><p className="geo-small">Nivå {round.levelId + 1} · {round.index} av {round.questions.length} frågor genomgångna</p></> : <button className="button primary" onClick={() => start(progress.unlocked)}>{progress.unlocked ? `Spela nivå ${progress.unlocked + 1}` : "Börja med Sverige"}<ArrowRight size={17} /></button>}
            <p className="geo-small">Ingen tidspress. Dina framsteg sparas i den här webbläsaren på den här enheten.</p>
          </div><GeographyMap showLabels />
        </section>
        <div className="geo-journey-heading"><h2>Din väg över kartan</h2><span>{completedLevels} av 4 nivåer klarade</span></div>
        <div className="geo-levels">{levels.map((item, index) => {
          const Icon = icons[index];
          const locked = index > progress.unlocked;
          const passed = progress.best[index] >= item.required;
          const misses = progress.misses.filter(m => m.levelId === index).length;
          return <section className={`geo-level ${locked ? "is-locked" : ""}`} key={item.id}>
            <div className="geo-level-top"><span className="geo-level-number">0{index + 1}</span>{locked ? <LockKeyhole size={20} /> : passed ? <Check size={22} /> : <Icon size={23} />}</div>
            <h3>{item.title}</h3><span className="geo-level-subtitle">{item.subtitle}</span><p>{item.description}</p>
            <p className="geo-level-goal">{locked ? `Klara nivå ${index} för att låsa upp` : `Klara ${item.required} av ${item.count} för att ${index === 3 ? "klara nivån" : "gå vidare"}`}</p>
            {!locked && <><span className="geo-best">Bästa resultat: {progress.best[index]} / {item.count}</span><button type="button" className="button secondary" onClick={() => start(index)}>{passed ? "Spela igen" : "Spela nivån"}<ArrowRight size={16} /></button>{misses > 0 && <button className="geo-text-button" onClick={() => start(index, true)}>Repetera {misses} missade länder</button>}</>}
          </section>;
        })}</div>
        {round && !finished && <p className="geo-small">Om du startar en ny omgång ersätts den pågående. Dina tidigare resultat finns kvar.</p>}
        <details className="geo-teacher"><summary>För dig som undervisar</summary><p>Förslag: låt eleven säga världsdel och beskriva platsen med ett väderstreck eller ett grannland innan svaret låses. Återkom till missade länder vid nästa lektion. Rätt på första försöket räknas; omspel är nya omgångar.</p><p>Steg 1 har kända länder och tre svarsalternativ. Steg 2 ger fler länder och sex svarsalternativ. Steg 3 och 4 tränar läget utan landsnamn på kartan. Landets plats markeras först efter rätt svar. Repetition låser inte upp nivåer. Spelet innehåller {countries.length} målländer; småstater och länder i flera världsdelar ingår inte i frågorna om världsdelar.</p><p>Här används sju världsdelar: Europa, Asien, Afrika, Nordamerika, Sydamerika, Oceanien och Antarktis. Antarktis visas på kartan men har inga självständiga länder att placera. Kartan är en förenklad översikt och ytorna är inte exakta.</p></details>
        <div className="geo-reset">{confirmReset ? <div role="alertdialog" aria-label="Nollställ sparade framsteg"><p>Vill du ta bort alla sparade resultat och börja från nivå 1?</p><button className="button secondary" onClick={() => setConfirmReset(false)}>Behåll framstegen</button><button className="geo-text-button" onClick={() => { commit(freshProgress()); setConfirmReset(false); }}>Ja, nollställ</button></div> : <button className="geo-text-button" onClick={() => setConfirmReset(true)}><RotateCcw size={14} />Nollställ framsteg</button>}</div>
      </> : finished ? <section className="geo-results">
        <span className="geo-result-icon"><Trophy size={36} /></span><span className="eyebrow">{round.review ? "Repetitionen klar" : `Nivå ${level.id + 1} · omgången klar`}</span>
        <h2 tabIndex={-1} ref={node => node?.focus()}>{round.review ? "Varje repetition hjälper" : score >= level.required ? (level.id === 3 ? "Du har klarat världskartan!" : "Nästa steg är upplåst!") : "Du är på väg"}</h2>
        <p className="geo-result-score"><strong>{score}</strong> / {round.questions.length}<span>rätt på första försöket i den här omgången</span></p>
        <p>{round.review ? "Repetition tränar minnet. Spela en vanlig nivåomgång när du vill gå vidare." : score >= level.required ? `Du klarade nivån. ${resultMisses.length ? "Repetera gärna de länder du missade innan du fortsätter." : "Prova att beskriva ländernas lägen med egna ord."}` : `Du behöver ${level.required} av ${level.count} rätt för att gå vidare. Öva på platserna nedan och prova sedan en ny omgång.`}</p>
        {resultMisses.length > 0 && <div className="geo-review-list"><h3>Ta med dig till nästa omgång</h3>{resultMisses.map(item => <p key={item.countryId}><strong>{countryById[item.countryId].name} · {countryById[item.countryId].continent}</strong><span>{countryById[item.countryId].clue}</span></p>)}</div>}
        <div className="geo-result-actions">{!round.review && score >= level.required && level.id < 3 && <button className="button primary" onClick={() => start(level.id + 1)}>Vidare till nivå {level.id + 2}<ArrowRight size={17} /></button>}{roundMisses.length > 0 && <button className="button secondary" onClick={() => start(level.id, true)}>Repetera missade länder<RotateCcw size={17} /></button>}<button className="button secondary" onClick={() => start(level.id)}>Ny nivåomgång</button><button className="geo-text-button" onClick={() => setOverview(true)}>Alla nivåer</button></div>
      </section> : <section className="geo-play" aria-label="Spelomgång">
        <div className="geo-play-top"><button className="geo-text-button" onClick={() => setOverview(true)}><ArrowLeft size={16} />Alla nivåer</button><span>{round.review ? "Repetition" : `Nivå ${level.id + 1}`} · {level.title}</span></div>
        <div className="geo-round-progress"><span>Fråga {round.index + 1} av {round.questions.length}</span><progress value={round.index} max={round.questions.length} aria-label="Genomgångna frågor" /><span>{score} rätt</span></div>
        <div className="geo-game-layout">
        <div className="geo-question-card">
          <span className="eyebrow">{isContinent ? "Vilken världsdel ligger landet i?" : "Hitta landet på kartan"}</span>
          <div className="geo-country"><img className="geo-country-flag" src={`${import.meta.env.BASE_URL}assets/flags/${country.flag}.svg`} alt={`${country.name}s flagga`} width="48" height="36" /><h2 tabIndex={-1} ref={heading}>{country.name}</h2></div>
          <p className="geo-instruction">{isContinent ? "Välj en världsdel och lås ditt svar." : `Välj en numrerad plats och lås ditt svar.${level.mode === "regional" ? ` Kartan visar ${country.continent}.` : ""}`}</p>
        </div>
        <div className="geo-board">
        <GeographyMap key={`${round.index}-${level.id}-${round.review}`} region={level.mode === "regional" ? country.continent : undefined}
          options={isContinent ? [] : question.options} selected={answer ? answer.choice : selected} onSelect={setSelected} disabled={Boolean(answer)}
          revealId={answer?.correct ? country.id : undefined} correctId={answer?.correct && !isContinent ? country.id : undefined} showLabels={level.id === 0} />
        </div>
        <div className="geo-answer-panel">
        <div className={`geo-options ${isContinent ? "is-continent" : "is-places"}`} role="group" aria-label={isContinent ? "Välj världsdel" : "Välj numrerad plats"}>{question.options.map((option, index) => {
          const expected = isContinent ? country.continent : country.id;
          const choice = answer ? answer.choice : selected;
          return <button key={option} type="button" disabled={Boolean(answer)} aria-pressed={choice === option} className={`${choice === option ? "is-selected" : ""} ${answer?.correct && option === expected ? "is-correct" : ""} ${answer && choice === option && !answer.correct ? "is-wrong" : ""}`} onClick={() => setSelected(option)}>{!isContinent && <span aria-hidden="true">{index + 1}</span>}{isContinent ? option : `Plats ${index + 1}`}{answer?.correct && option === expected && <Check size={17} aria-hidden="true" />}</button>;
        })}</div>
        {!answer ? <div className="geo-lock-row"><button className="button primary" disabled={!selected} onClick={() => commit(answerQuestion(progress, selected))}><LockKeyhole size={17} />Lås mitt svar</button><button className="geo-text-button" onClick={() => commit(answerQuestion(progress, null))}>Jag vet inte ännu</button><span className="geo-small" aria-live="polite">{selected ? `${isContinent ? selected : `Plats ${question.options.indexOf(selected) + 1}`} vald. Du kan ändra innan du låser.` : "Välj ett svar först."}</span></div> : <>
          <div className={`geo-feedback ${answer.correct ? "is-correct" : "is-learning"}`} role="status"><strong>{answer.correct ? "Rätt! Landet visas på kartan." : answer.choice === null ? "Vi övar på landet igen" : "Inte riktigt – landet kommer tillbaka"}</strong><p><strong>{country.name} ligger i {country.continent}.</strong></p><details><summary>Visa förklaringen</summary><p>{!answer.correct && answer.choice !== null && `Du valde ${isContinent ? answer.choice : mapById[answer.choice].name}. `}{country.clue}</p>{!isContinent && answer.correct && <p>Rätt plats är <strong>{question.options.indexOf(country.id) + 1}</strong>, markerad i grönt.</p>}{!answer.correct && <p>Landet är sparat för repetition.</p>}</details></div>
          <button className="button primary geo-next" onClick={advance}>{round.index === round.questions.length - 1 ? "Visa resultat" : "Nästa land"}<ArrowRight size={17} /></button>
        </>}
        </div>
        </div>
      </section>}
      <p className="geo-source">Kartunderlag: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> (public domain).</p>
    </div>
  </div>;
}

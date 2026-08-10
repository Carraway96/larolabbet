import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ContentBlock from "../components/ContentBlocks";
import Icon from "../components/Icon";
import { getTopic, workAreas } from "../data/content";

export default function WorkAreaPage() {
  const { areaId } = useParams();
  const area = workAreas[areaId];
  const topicData = getTopic(areaId);
  if (!topicData) return <Navigate to="/hittades-inte" replace />;

  const { topic, subject } = topicData;
  const scrollToBlock = (blockId) => document.getElementById(blockId)?.scrollIntoView({ behavior: "smooth" });

  if (!area) {
    return (
      <section className="empty-area">
        <div className={`empty-area-icon tone-${subject.tone}`}><Icon name={topic.icon} size={48} /></div>
        <span className="eyebrow">Mallplats</span>
        <h1>{topic.title}</h1>
        <p>Det här arbetsområdet är förberett i strukturen men har ännu inget publicerat innehåll.</p>
        <Link className="button primary" to={`/amne/${subject.id}`}><ArrowLeft size={18} /> Tillbaka till {subject.title}</Link>
      </section>
    );
  }

  return (
    <>
      <section className={`work-hero tone-${subject.tone}`}>
        <div className="breadcrumbs"><Link to="/">Start</Link><span>/</span><Link to={`/amne/${subject.id}`}>{subject.title}</Link><span>/</span><span>{area.title}</span></div>
        <div className="work-hero-grid">
          <div>
            <span className="eyebrow">{area.kicker}</span>
            <h1>{area.title}</h1>
            <p>{area.lead}</p>
            <div className="work-meta"><span>{area.duration}</span><span>{area.updated}</span></div>
          </div>
          <div className="goal-card">
            <span className="goal-label">Efter området kan du</span>
            <ul>{area.goals.map((goal) => <li key={goal}><CheckCircle2 size={19} />{goal}</li>)}</ul>
          </div>
        </div>
      </section>

      <nav className="on-page-nav" aria-label="På den här sidan">
        <span>På sidan</span>
        {area.blocks.map((block, index) => <button key={block.id} type="button" onClick={() => scrollToBlock(block.id)}><b>0{index + 1}</b>{block.title}</button>)}
      </nav>

      <div className="content-stack">
        {area.blocks.map((block) => <ContentBlock key={block.id} block={block} />)}
      </div>

      <section className="next-step">
        <div><span className="eyebrow light">Klar?</span><h2>Bra jobbat!</h2><p>Gå tillbaka till ämnessidan när du vill välja nästa arbetsområde.</p></div>
        <Link className="button cream" to={`/amne/${subject.id}`}>Fler områden i {subject.title}</Link>
      </section>
    </>
  );
}

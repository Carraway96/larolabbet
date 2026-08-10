import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import TopicCard from "../components/TopicCard";
import { getSubject } from "../data/content";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  if (!subject) return <Navigate to="/hittades-inte" replace />;

  return (
    <>
      <section className={`subject-hero tone-${subject.tone}`}>
        <div>
          <Link className="back-link" to="/"><ArrowLeft size={17} /> Alla ämnen</Link>
          <span className="eyebrow">Ämnessida</span>
          <h1>{subject.title}</h1>
          <p>{subject.description}</p>
        </div>
        <div className="subject-hero-icon"><Icon name={subject.icon} size={74} /></div>
      </section>

      <section className="section topic-section">
        <div className="section-heading">
          <div><span className="eyebrow">Arbetsområden</span><h2>Välj ett område</h2></div>
          <p>Varje arbetsområde samlar film, presentation, text och dokument på en och samma sida.</p>
        </div>
        <div className="topic-grid">
          {subject.topics.map((topic) => <TopicCard key={topic.id} topic={topic} tone={subject.tone} />)}
        </div>
      </section>
    </>
  );
}

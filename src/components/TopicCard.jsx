import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function TopicCard({ topic, tone }) {
  const isPublished = topic.status === "published";
  return (
    <Link className={`topic-card tone-${tone}`} to={`/arbetsomrade/${topic.id}`}>
      <span className="topic-icon"><Icon name={topic.icon} size={25} /></span>
      <span className="topic-content">
        <span className="topic-status">{isPublished ? "Redo att använda" : "Mallplats"}</span>
        <span className="topic-title">{topic.title}</span>
        <span className="topic-description">{topic.description}</span>
        {topic.meta && <span className="topic-meta">{topic.meta}</span>}
      </span>
      <span className="topic-arrow" aria-hidden="true">{isPublished ? <ArrowRight /> : <Clock3 />}</span>
    </Link>
  );
}

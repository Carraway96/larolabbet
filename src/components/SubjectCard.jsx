import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function SubjectCard({ subject, index }) {
  return (
    <Link className={`subject-card tone-${subject.tone}`} to={`/amne/${subject.id}`}>
      <span className="subject-card-number">0{index + 1}</span>
      <span className="subject-card-icon"><Icon name={subject.icon} size={34} /></span>
      <span className="subject-card-content">
        <span className="subject-card-title">{subject.title}</span>
        <span className="subject-card-description">{subject.description}</span>
        <span className="subject-card-link">Utforska ämnet <ArrowUpRight size={18} aria-hidden="true" /></span>
      </span>
    </Link>
  );
}

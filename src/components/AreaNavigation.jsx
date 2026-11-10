import { BookOpen, Puzzle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AreaNavigation({ areaId = "demokrati-diktatur-medier", trainingLabel = "Begreppsträning", trainingPath = "begreppstraning" }) {
  const base = `/arbetsomrade/${areaId}`;
  return <nav className="area-navigation" aria-label="Delar i arbetsområdet">
    <NavLink end to={base}><BookOpen size={18} aria-hidden="true" />Genomgång & material</NavLink>
    <NavLink to={`${base}/${trainingPath}`}><Puzzle size={18} aria-hidden="true" />{trainingLabel}</NavLink>
  </nav>;
}

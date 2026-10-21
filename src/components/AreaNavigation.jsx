import { BookOpen, Puzzle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AreaNavigation() {
  const base = "/arbetsomrade/demokrati-diktatur-medier";
  return <nav className="area-navigation" aria-label="Delar i arbetsområdet">
    <NavLink end to={base}><BookOpen size={18} aria-hidden="true" />Genomgång & material</NavLink>
    <NavLink to={`${base}/begreppstraning`}><Puzzle size={18} aria-hidden="true" />Begreppsträning</NavLink>
  </nav>;
}

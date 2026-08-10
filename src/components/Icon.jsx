import {
  BookOpen,
  Building2,
  Castle,
  CheckCircle2,
  CloudSun,
  Columns3,
  Earth,
  Fingerprint,
  Globe2,
  HeartHandshake,
  History,
  Landmark,
  Leaf,
  Map,
  Newspaper,
  Scale,
  ScrollText,
  Sparkles,
  Users,
  Vote,
  WalletCards,
} from "lucide-react";

const icons = {
  book: BookOpen,
  building: Building2,
  castle: Castle,
  check: CheckCircle2,
  "cloud-sun": CloudSun,
  columns: Columns3,
  earth: Earth,
  fingerprint: Fingerprint,
  globe: Globe2,
  "heart-handshake": HeartHandshake,
  history: History,
  landmark: Landmark,
  leaf: Leaf,
  lotus: Sparkles,
  map: Map,
  newspaper: Newspaper,
  scale: Scale,
  scroll: ScrollText,
  sparkles: Sparkles,
  users: Users,
  vote: Vote,
  wallet: WalletCards,
};

export default function Icon({ name, ...props }) {
  const Component = icons[name] || BookOpen;
  return <Component aria-hidden="true" {...props} />;
}

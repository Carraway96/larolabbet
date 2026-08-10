export const subjects = [
  {
    id: "samhallskunskap",
    title: "Samhällskunskap",
    shortTitle: "Samhälle",
    icon: "landmark",
    tone: "coral",
    description: "Demokrati, lagar, ekonomi och hur samhället fungerar.",
    topics: [
      {
        id: "lag-och-ratt",
        title: "Lag & rätt",
        description: "Rättsstaten, brott, straff och vägen genom en rättegång.",
        meta: "Film · 25 bilder · checklista",
        status: "published",
        icon: "scale",
      },
      { id: "demokrati-och-politik", title: "Demokrati & politik", description: "Beslut, makt och påverkan i Sverige och världen.", status: "planned", icon: "vote" },
      { id: "ekonomi-och-arbetsliv", title: "Ekonomi & arbetsliv", description: "Privatekonomi, samhällsekonomi och arbetsmarknad.", status: "planned", icon: "wallet" },
      { id: "medier-och-information", title: "Medier & information", description: "Källkritik, nyheter och det digitala samhället.", status: "planned", icon: "newspaper" },
    ],
  },
  {
    id: "geografi",
    title: "Geografi",
    shortTitle: "Geografi",
    icon: "globe",
    tone: "sage",
    description: "Platser, landskap, resurser och människans livsmiljöer.",
    topics: [
      { id: "kartan-och-varlden", title: "Kartan & världen", description: "Kartor, koordinater och geografiska mönster.", status: "planned", icon: "map" },
      { id: "klimat-och-vegetation", title: "Klimat & vegetation", description: "Klimatzoner, väder och jordens ekosystem.", status: "planned", icon: "cloud-sun" },
      { id: "resurser-och-hallbarhet", title: "Resurser & hållbarhet", description: "Naturresurser, konsumtion och hållbar utveckling.", status: "planned", icon: "leaf" },
      { id: "befolkning-och-migration", title: "Befolkning & migration", description: "Var människor bor, flyttar och formar samhällen.", status: "planned", icon: "users" },
    ],
  },
  {
    id: "historia",
    title: "Historia",
    shortTitle: "Historia",
    icon: "scroll",
    tone: "gold",
    description: "Människor, förändring och spår från dåtid till nutid.",
    topics: [
      { id: "forntiden-och-antiken", title: "Forntiden & antiken", description: "De första samhällena och antikens värld.", status: "planned", icon: "columns" },
      { id: "medeltiden", title: "Medeltiden", description: "Makt, tro och vardag i det medeltida samhället.", status: "planned", icon: "castle" },
      { id: "revolutioner", title: "Revolutioner", description: "Idéer och omvälvningar som förändrade världen.", status: "planned", icon: "sparkles" },
      { id: "varldskrigen", title: "Världskrigen", description: "Konflikt, konsekvenser och vägen till vår egen tid.", status: "planned", icon: "history" },
    ],
  },
  {
    id: "religion",
    title: "Religion",
    shortTitle: "Religion",
    icon: "lotus",
    tone: "blue",
    description: "Tro, etik, livsfrågor och religionens roll i världen.",
    topics: [
      { id: "varldsreligionerna", title: "Världsreligionerna", description: "Traditioner, tankar och praktiker i världens religioner.", status: "planned", icon: "earth" },
      { id: "etik-och-livsfragor", title: "Etik & livsfrågor", description: "Att resonera om rätt, fel, mening och ansvar.", status: "planned", icon: "heart-handshake" },
      { id: "religion-och-samhalle", title: "Religion & samhälle", description: "Hur religion och samhälle påverkar varandra.", status: "planned", icon: "building" },
      { id: "identitet-och-livsaskadning", title: "Identitet & livsåskådning", description: "Identitet, sekulära synsätt och personliga frågor.", status: "planned", icon: "fingerprint" },
    ],
  },
];

const lessonSlides = Array.from(
  { length: 25 },
  (_, index) => `content/lag-och-ratt/slides/slide-${String(index + 1).padStart(2, "0")}.webp`,
);

export const workAreas = {
  "lag-och-ratt": {
    id: "lag-och-ratt",
    subjectId: "samhallskunskap",
    title: "Lag & rätt",
    kicker: "Samhällskunskap",
    lead: "Utforska varför vi har lagar, vad som händer när ett brott begås och hur rättssystemet ska skydda både individen och samhället.",
    duration: "Arbetsområde",
    updated: "Uppdaterat augusti 2026",
    goals: [
      "Förstå vad en rättsstat och rättssäkerhet innebär",
      "Beskriva vägen från brott till dom",
      "Resonera om varför samhället straffar",
    ],
    blocks: [
      {
        id: "oversikt",
        type: "text",
        eyebrow: "Start",
        title: "Det här ska vi undersöka",
        paragraphs: [
          "Lagar påverkar oss varje dag, men hur skapas de och vem ser till att de följs? I det här arbetsområdet möter du centrala begrepp och följer ett brott genom rättssystemet.",
          "Arbeta gärna i ordning: börja med filmen, följ presentationen och använd checklistan när du repeterar.",
        ],
        callout: "Tips: skriv upp nya begrepp medan du arbetar. I checklistan längst ned finns orden du behöver kunna.",
      },
      {
        id: "film",
        type: "video",
        eyebrow: "Se",
        title: "Introduktion till lag och rätt",
        description: "En kort introduktion som ger dig en överblick innan du går vidare till presentationen.",
        youtubeId: "M7AI-0y852A",
      },
      {
        id: "presentation",
        type: "slideshow",
        eyebrow: "Bläddra",
        title: "Presentation: Lag och rätt",
        description: "Använd pilarna eller tangentbordets höger- och vänsterpil. Du kan också hoppa direkt till en bild via miniatyrerna.",
        images: lessonSlides,
      },
      {
        id: "checklista",
        type: "document",
        eyebrow: "Repetera",
        title: "Checklista inför prov",
        description: "Använd checklistan för att kontrollera att du kan områdets frågor och viktigaste begrepp.",
        images: ["content/lag-och-ratt/documents/checklista-01.webp"],
      },
    ],
  },
};

export function getSubject(subjectId) {
  return subjects.find((subject) => subject.id === subjectId);
}

export function getTopic(areaId) {
  for (const subject of subjects) {
    const topic = subject.topics.find((item) => item.id === areaId);
    if (topic) return { topic, subject };
  }
  return undefined;
}

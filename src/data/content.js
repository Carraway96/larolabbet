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
      {
        id: "demokrati-diktatur-medier",
        title: "Demokrati, diktatur & medier",
        description: "Demokratiska principer, diktaturer, fria medier, censur och mänskliga rättigheter.",
        meta: "Film · 29 bilder · checklista",
        status: "published",
        icon: "vote",
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
      {
        id: "forsta-varldskriget",
        title: "Första världskriget",
        description: "Orsakerna, fronterna, nya vapen och krigets följder.",
        meta: "Film · 28 bilder · checklista",
        status: "published",
        icon: "history",
      },
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
      {
        id: "islam",
        title: "Islam",
        description: "Muhammeds liv, islams grunder, inriktningar och de abrahamitiska religionerna.",
        meta: "Film · 27 bilder · checklista",
        status: "published",
        icon: "earth",
      },
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

const democracyDictatorshipMediaSlides = Array.from(
  { length: 29 },
  (_, index) => `content/demokrati-diktatur-medier/slides/slide-${String(index + 1).padStart(2, "0")}.webp`,
);

const firstWorldWarSlides = Array.from(
  { length: 28 },
  (_, index) => `content/forsta-varldskriget/slides/slide-${String(index + 1).padStart(2, "0")}.webp`,
);

const islamSlides = Array.from(
  { length: 27 },
  (_, index) => `content/islam/slides/slide-${String(index + 1).padStart(2, "0")}.webp`,
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
  "demokrati-diktatur-medier": {
    id: "demokrati-diktatur-medier",
    subjectId: "samhallskunskap",
    title: "Demokrati, diktatur & medier",
    kicker: "Samhällskunskap",
    lead: "Undersök vad som kännetecknar demokrati och diktatur, hur olika statsskick fungerar och varför fria medier och mänskliga rättigheter är viktiga.",
    duration: "Arbetsområde",
    updated: "Uppdaterat augusti 2026",
    goals: [
      "Förklara skillnaden mellan direkt och representativ demokrati",
      "Beskriva grundlagar, statsskick och hur en diktatur fungerar",
      "Resonera om mediernas roll, censur och propaganda",
      "Beskriva mänskliga rättigheter och barnkonventionen",
    ],
    blocks: [
      {
        id: "oversikt",
        type: "text",
        eyebrow: "Start",
        title: "Det här ska vi undersöka",
        paragraphs: [
          "Vad gör ett land demokratiskt, och vad händer när en diktator samlar all makt? I det här arbetsområdet jämför du direkt och representativ demokrati, lär dig om grundlagar och möter statsskick som monarki, republik och teokrati.",
          "Du undersöker också mediernas roll i en demokrati, hur censur och propaganda används i diktaturer samt hur mänskliga rättigheter och barnkonventionen hänger samman med hur ett land styrs.",
        ],
        callout: "Arbeta gärna i ordning: börja med filmen, följ presentationen och använd checklistan när du repeterar inför provet.",
      },
      {
        id: "film",
        type: "video",
        eyebrow: "Se",
        title: "Introduktion till demokrati, diktatur och medier",
        description: "En introduktionsfilm som ger dig en överblick innan du går vidare till presentationen.",
        youtubeId: "pZs7Qqb5AnE",
      },
      {
        id: "presentation",
        type: "slideshow",
        eyebrow: "Bläddra",
        title: "Presentation: Demokrati, diktatur och medier",
        description: "Använd pilarna eller tangentbordets höger- och vänsterpil. Du kan också hoppa direkt till en bild via miniatyrerna.",
        images: democracyDictatorshipMediaSlides,
      },
      {
        id: "checklista",
        type: "document",
        eyebrow: "Repetera",
        title: "Checklista inför prov",
        description: "Använd checklistan för att kontrollera att du kan områdets frågor och viktigaste begrepp.",
        images: ["content/demokrati-diktatur-medier/documents/checklista-01.webp"],
      },
    ],
  },
  "forsta-varldskriget": {
    id: "forsta-varldskriget",
    subjectId: "historia",
    title: "Första världskriget",
    kicker: "Historia",
    lead: "Undersök varför första världskriget bröt ut, hur kriget förändrades av nya vapen och vilka följder konflikten fick för Europa och världen.",
    duration: "Arbetsområde",
    updated: "Uppdaterat augusti 2026",
    goals: [
      "Förklara orsakerna till första världskriget",
      "Jämföra kriget på västfronten och östfronten",
      "Beskriva hur nya vapen förändrade krigföringen",
      "Resonera om hur kriget slutade och vilka följder det fick",
    ],
    blocks: [
      {
        id: "oversikt",
        type: "text",
        eyebrow: "Start",
        title: "Det här ska vi undersöka",
        paragraphs: [
          "Första världskriget pågick mellan 1914 och 1918. I det här arbetsområdet undersöker du orsakerna till kriget, skotten i Sarajevo och hur allianserna drog in stora delar av världen i konflikten.",
          "Du får också jämföra västfronten och östfronten, se hur nya vapen förändrade krigföringen och följa vägen fram till vapenstilleståndet och Versaillesfreden.",
        ],
        callout: "Arbeta gärna i ordning: börja med filmen, följ presentationen och använd checklistan när du repeterar inför provet.",
      },
      {
        id: "film",
        type: "video",
        eyebrow: "Se",
        title: "Introduktion till första världskriget",
        description: "En introduktionsfilm som ger dig en överblick innan du går vidare till presentationen.",
        youtubeId: "pFb3Ysi7oRU",
      },
      {
        id: "presentation",
        type: "slideshow",
        eyebrow: "Bläddra",
        title: "Presentation: Första världskriget",
        description: "Använd pilarna eller tangentbordets höger- och vänsterpil. Du kan också hoppa direkt till en bild via miniatyrerna.",
        images: firstWorldWarSlides,
      },
      {
        id: "checklista",
        type: "document",
        eyebrow: "Repetera",
        title: "Checklista inför prov",
        description: "Använd checklistan för att kontrollera att du kan områdets frågor och viktigaste begrepp.",
        images: ["content/forsta-varldskriget/documents/checklista-01.webp"],
      },
    ],
  },
  islam: {
    id: "islam",
    subjectId: "religion",
    title: "Islam",
    kicker: "Religion",
    lead: "Lär dig om Muhammeds liv, islams heliga texter och handlingar samt hur islam hänger samman med de andra abrahamitiska religionerna.",
    duration: "Arbetsområde",
    updated: "Uppdaterat augusti 2026",
    goals: [
      "Beskriva viktiga händelser i Muhammeds liv",
      "Förklara islams fem pelare och centrala begrepp",
      "Jämföra sunni och shia",
      "Resonera om likheter och skillnader mellan de abrahamitiska religionerna",
    ],
    blocks: [
      {
        id: "oversikt",
        type: "text",
        eyebrow: "Start",
        title: "Det här ska vi undersöka",
        paragraphs: [
          "Islam är en monoteistisk och abrahamitisk religion. I det här arbetsområdet följer du viktiga händelser i Muhammeds liv och lär dig om Koranen, haditherna och islams fem pelare.",
          "Du får också möta den muslimska kalendern, ramadan och eid al-fitr, jämföra sunni och shia samt undersöka likheter och skillnader mellan islam, judendom och kristendom.",
        ],
        callout: "Arbeta gärna i ordning: börja med filmen, följ presentationen och använd checklistan när du repeterar inför provet.",
      },
      {
        id: "film",
        type: "video",
        eyebrow: "Se",
        title: "Introduktion till islam",
        description: "En introduktionsfilm som ger dig en överblick innan du går vidare till presentationen.",
        youtubeId: "QNubbSHiaWw",
      },
      {
        id: "presentation",
        type: "slideshow",
        eyebrow: "Bläddra",
        title: "Presentation: Islam",
        description: "Använd pilarna eller tangentbordets höger- och vänsterpil. Du kan också hoppa direkt till en bild via miniatyrerna.",
        images: islamSlides,
      },
      {
        id: "checklista",
        type: "document",
        eyebrow: "Repetera",
        title: "Checklista inför prov: Islam",
        description: "Använd checklistan för att kontrollera att du kan områdets frågor och viktigaste begrepp.",
        images: ["content/islam/documents/checklista-01.webp"],
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

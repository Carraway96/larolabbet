export const kingdoms = [
  { id: "old", name: "Gamla riket", years: "cirka 2700–2200 f.Kr.", summary: "Memphis, pyramidbyggen och faraons makt.", gap: "Splittring, inbördesstrider och hungersnöd." },
  { id: "middle", name: "Mellersta riket", years: "cirka 2050–1650 f.Kr.", summary: "Egypten enas igen. Thebe blir huvudstad.", gap: "Hyksos styr delar av Egypten före nya riket." },
  { id: "new", name: "Nya riket", years: "cirka 1550–1050 f.Kr.", summary: "Riket växer genom erövringar. Senare försvagas det." },
];

export const journeys = [
  { kingdom: "old", text: "Du ser enorma pyramider byggas som gravar åt faraoner. Huvudstaden heter Memphis.", why: "Pyramidbyggena och huvudstaden Memphis är ledtrådar till gamla riket." },
  { kingdom: "middle", text: "Efter en tid av splittring enas landet igen. Thebe blir den nya huvudstaden.", why: "Återföreningen efter gamla rikets splittring och den nya huvudstaden Thebe hör till början av mellersta riket." },
  { kingdom: "new", text: "Faraons arméer utvidgar Egyptens gränser. Erövrade områden måste betala skatter till Egypten.", why: "De stora erövringarna är ett kännetecken för nya riket." },
  { kingdom: "middle", text: "Du kommer till slutet av en storhetsperiod. Hyksos tränger in från nordöst. Egyptierna lär sig att använda stridsvagnar genom mötet med dem.", why: "Hyksos maktövertagande markerar slutet av mellersta riket i underlaget. Stridsvagnarna får betydelse senare." },
  { kingdom: "old", text: "Du står vid Cheops stora pyramid. Byggnaden ska vara faraons grav och är uppförd av miljontals stenblock.", why: "Cheopspyramiden byggdes under gamla riket. Pyramiderna var gravar åt faraoner." },
  { kingdom: "new", text: "Du möter arbetare som vägrar arbeta eftersom de inte har fått maten som de ska få som betalning. Riket har försvagats efter kostsamma krig.", why: "Arbetarnas strejk och rikets försvagning hör till den senare delen av nya riket i texten." },
  { kingdom: "old", text: "Pyramidernas storhetstid går mot sitt slut. Inbördesstrider och hungersnöd drabbar landet.", why: "Texten beskriver inbördeskrig och hungersnöd i slutet av gamla riket." },
  { kingdom: "new", text: "Egypten har återhämtat sig efter hyksos styre. Thebe är åter huvudstad och faraonerna gör landet till en stormakt.", why: "Thebe fanns som huvudstad under flera perioder. Här är återhämtningen efter hyksos och stormakten ledtrådarna till nya riket." },
  { kingdom: "middle", text: "Du har rest framåt från pyramidernas storhetstid. Landet har återförenats med Thebe som huvudstad, men hyksos invasion ligger fortfarande framför dig.", why: "Mellersta riket ligger mellan gamla rikets pyramidbyggen och hyksos styre före nya riket." },
];

export const timelineEvents = [
  { kingdom: "new", text: "Egyptens gränser utvidgas genom erövringar.", why: "Under nya riket växer Egypten till en stormakt." },
  { kingdom: "old", text: "Cheopspyramiden byggs som faraons grav.", why: "De stora pyramidbyggena hör till gamla riket." },
  { kingdom: "middle", text: "Landet återförenas efter gamla rikets splittring. Thebe blir huvudstad.", why: "Återföreningen inleder mellersta rikets storhetsperiod." },
  { kingdom: "old", text: "Memphis är huvudstad under pyramidernas storhetstid.", why: "Memphis och pyramidbyggena hör till gamla riket." },
  { kingdom: "new", text: "Krig kostar mycket och försvagar armén och statskassan.", why: "Texten beskriver hur kostsamma krig bidrar till nya rikets försvagning." },
  { kingdom: "middle", text: "Perioden avslutas när hyksos tar makten i delar av Egypten.", why: "Hyksos maktövertagande placeras i slutet av mellersta riket. Därefter följer ett avbrott före nya riket." },
  { kingdom: "new", text: "Arbetare strejkar när de inte får mat som betalning.", why: "Strejken hör till den senare delen av nya riket i underlaget." },
  { kingdom: "old", text: "Pyramidernas storhetstid slutar i inbördesstrider och hungersnöd.", why: "Detta beskriver gamla rikets slut och övergången till en tid av splittring." },
  { kingdom: "middle", text: "Egyptierna möter hyksos och lär sig att använda stridsvagnar.", why: "Mötet hör till övergången från mellersta riket till hyksos styre. Kunskapen kommer till användning senare." },
];

export const connections = [
  { cause: "Öknar och naturliga hinder omger Egypten.", effect: "Det blir svårare för fiender att anfalla landet.", why: "Landskapet gör det svårt för anfallare att ta sig fram. Skyddet bidrar till långa perioder av stabilitet, men stoppar inte alla invasioner." },
  { cause: "Egyptierna möter hyksos, som använder stridsvagnar.", effect: "Egyptierna lär sig att använda stridsvagnar i krig.", why: "Mötet med hyksos ger egyptierna militär kunskap som kommer till användning senare." },
  { cause: "Faraonerna erövrar nya områden under nya riket.", effect: "Egypten får inkomster från skatter i de erövrade områdena.", why: "Erövringarna gör att Egypten kan kräva skatter från fler områden." },
  { cause: "Armén utkämpar kostsamma krig.", effect: "Armén och statskassan försvagas även när Egypten vinner.", why: "En seger kan ändå kosta soldater och resurser. Därför behöver en vunnen strid inte göra landet starkare." },
];

export const nileChain = [
  "Nilen svämmar över mindre.",
  "Skördarna blir mindre och det finns mindre mat.",
  "Arbetarna får inte maten som de ska få som betalning.",
  "Arbetarna vägrar arbeta och strejkar.",
];

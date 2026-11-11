export const continents = ["Europa", "Afrika", "Asien", "Nordamerika", "Sydamerika", "Oceanien"];

// Avoid transcontinental countries in continent questions. All targets have
// recognisable geometry in the locally bundled Natural Earth map.
const entries = [
  ["SWE", "Sverige", "Europa", "I norra Europa, öster om Norge och väster om Finland."],
  ["NOR", "Norge", "Europa", "I norra Europa, längs Atlantkusten väster om Sverige."],
  ["FIN", "Finland", "Europa", "I norra Europa, öster om Sverige och norr om Östersjön."],
  ["DEU", "Tyskland", "Europa", "I mellersta Europa, söder om Danmark och norr om Alperna."],
  ["ESP", "Spanien", "Europa", "I sydvästra Europa, öster om Portugal på Iberiska halvön."],
  ["PRT", "Portugal", "Europa", "Vid Atlantkusten i sydvästra Europa, väster om Spanien."],
  ["GBR", "Storbritannien", "Europa", "På öar nordväst om det europeiska fastlandet, öster om Irland."],
  ["ITA", "Italien", "Europa", "Den stövelformade halvön i Medelhavet, söder om Alperna."],
  ["POL", "Polen", "Europa", "I Europa, öster om Tyskland och söder om Östersjön."],
  ["GRC", "Grekland", "Europa", "I sydöstra Europa, vid Medelhavet och söder om Balkanhalvöns inre."],
  ["JPN", "Japan", "Asien", "Öriket i östra Asien, öster om Kina och Koreahalvön."],
  ["CHN", "Kina", "Asien", "I östra Asien, söder om Mongoliet och väster om Japan."],
  ["IND", "Indien", "Asien", "Den stora halvön i södra Asien, söder om Himalaya."],
  ["KOR", "Sydkorea", "Asien", "På södra delen av Koreahalvön, mellan Kina och Japan."],
  ["THA", "Thailand", "Asien", "I Sydostasien, väster om Kambodja och söder om Myanmar och Laos."],
  ["VNM", "Vietnam", "Asien", "Det långsmala landet längs östra kusten av Sydostasiens fastland."],
  ["SAU", "Saudiarabien", "Asien", "På Arabiska halvön i västra Asien, öster om Röda havet."],
  ["MNG", "Mongoliet", "Asien", "I Asiens inland, mellan Ryssland i norr och Kina i söder."],
  ["PAK", "Pakistan", "Asien", "I södra Asien, väster om Indien och öster om Iran och Afghanistan."],
  ["ZAF", "Sydafrika", "Afrika", "Längst i söder på den afrikanska kontinenten."],
  ["MAR", "Marocko", "Afrika", "I nordvästra Afrika, söder om Spanien på andra sidan Gibraltar sund."],
  ["DZA", "Algeriet", "Afrika", "I norra Afrika vid Medelhavet, öster om Marocko."],
  ["KEN", "Kenya", "Afrika", "I östra Afrika vid Indiska oceanen, norr om Tanzania."],
  ["TZA", "Tanzania", "Afrika", "I östra Afrika vid Indiska oceanen, söder om Kenya."],
  ["NGA", "Nigeria", "Afrika", "I västra Afrika vid Guineabukten, väster om Kamerun."],
  ["ETH", "Etiopien", "Afrika", "I östra Afrika, väster om Somalia och norr om Kenya."],
  ["GHA", "Ghana", "Afrika", "I västra Afrika vid Guineabukten, mellan Elfenbenskusten och Togo."],
  ["CAN", "Kanada", "Nordamerika", "I norra Nordamerika, norr om USA:s sammanhängande fastland."],
  ["USA", "USA", "Nordamerika", "I Nordamerika. Huvuddelen ligger mellan Kanada och Mexiko; Alaska ligger längre nordväst."],
  ["MEX", "Mexiko", "Nordamerika", "I södra Nordamerika, söder om USA och norr om Guatemala och Belize."],
  ["CUB", "Kuba", "Nordamerika", "Den långa ön i Karibien, söder om Florida. Karibien hör till Nordamerika."],
  ["GTM", "Guatemala", "Nordamerika", "I Centralamerika, söder om Mexiko. Centralamerika hör till Nordamerika."],
  ["PAN", "Panama", "Nordamerika", "I Centralamerika, på landbryggan mellan Costa Rica och Colombia."],
  ["BRA", "Brasilien", "Sydamerika", "Det stora landet i östra Sydamerika, med en lång kust mot Atlanten."],
  ["ARG", "Argentina", "Sydamerika", "I södra Sydamerika, öster om Chile och söder om Bolivia och Paraguay."],
  ["CHL", "Chile", "Sydamerika", "Det långa, smala landet vid Sydamerikas västkust, väster om Anderna."],
  ["PER", "Peru", "Sydamerika", "Vid Sydamerikas västkust, söder om Ecuador och norr om Chile."],
  ["COL", "Colombia", "Sydamerika", "I nordvästra Sydamerika, söder om Panama och väster om Venezuela."],
  ["BOL", "Bolivia", "Sydamerika", "I Sydamerikas inland, öster om Peru och norr om Argentina."],
  ["ECU", "Ecuador", "Sydamerika", "Vid ekvatorn på Sydamerikas västkust, mellan Colombia och Peru."],
  ["URY", "Uruguay", "Sydamerika", "Vid Sydamerikas östkust, mellan Brasilien och Argentina."],
  ["AUS", "Australien", "Oceanien", "Det stora landet söder om Asien, mellan Indiska oceanen och Stilla havet."],
  ["NZL", "Nya Zeeland", "Oceanien", "Öriket i Stilla havet, sydost om Australien."],
  ["PNG", "Papua Nya Guinea", "Oceanien", "På östra delen av ön Nya Guinea och närliggande öar, norr om Australien."],
];

const flagCodes = Object.fromEntries("SWE:se NOR:no FIN:fi DEU:de ESP:es PRT:pt GBR:gb ITA:it POL:pl GRC:gr JPN:jp CHN:cn IND:in KOR:kr THA:th VNM:vn SAU:sa MNG:mn PAK:pk ZAF:za MAR:ma DZA:dz KEN:ke TZA:tz NGA:ng ETH:et GHA:gh CAN:ca USA:us MEX:mx CUB:cu GTM:gt PAN:pa BRA:br ARG:ar CHL:cl PER:pe COL:co BOL:bo ECU:ec URY:uy AUS:au NZL:nz PNG:pg".split(" ").map(pair => pair.split(":")));
export const countries = entries.map(([id, name, continent, clue]) => ({ id, name, continent, clue, flag: flagCodes[id] }));
export const countryById = Object.fromEntries(countries.map(country => [country.id, country]));
export const starterIds = ["SWE", "BRA", "JPN", "ZAF", "AUS", "CAN"];
export const levels = [
  { id: 0, title: "Börja i världen", subtitle: "Kända länder · tre världsdelar", mode: "continent", count: 6, required: 5, description: "Vilken världsdel ligger landet i? Vi börjar med Sverige. Landets plats visas när du svarar rätt.", icon: "compass" },
  { id: 1, title: "Fler länder", subtitle: "Utan markering · sex världsdelar", mode: "continent", count: 8, required: 6, description: "Nu får du fler länder och väljer bland alla sex bebodda världsdelar. Platsen visas när du har svarat.", icon: "globe" },
  { id: 2, title: "Hitta på delkartan", subtitle: "Förstorad karta · sex platser", mode: "regional", count: 8, required: 6, description: "Du vet världsdel. Nu ska du hitta själva landet bland numrerade platser på en förstorad karta.", icon: "map" },
  { id: 3, title: "Hela världskartan", subtitle: "Världskarta · åtta platser", mode: "world", count: 10, required: 8, description: "Hitta länder över hela världen. Nu finns åtta möjliga platser och ingen världsdel som ledtråd.", icon: "flag" },
];

export const regionalCandidates = {
  Europa: ["SWE", "NOR", "FIN", "DEU", "ESP", "PRT", "GBR", "ITA", "POL", "GRC"],
  Asien: ["JPN", "CHN", "IND", "KOR", "THA", "VNM", "SAU", "MNG", "PAK"],
  Afrika: ["ZAF", "MAR", "DZA", "KEN", "TZA", "NGA", "ETH", "GHA"],
  Nordamerika: ["CAN", "USA", "MEX", "CUB", "GTM", "PAN"],
  Sydamerika: ["BRA", "ARG", "CHL", "PER", "COL", "BOL", "ECU", "URY"],
  // Nearby Asian countries provide distractors on the Oceania regional map.
  Oceanien: ["AUS", "NZL", "PNG", "IDN", "MYS", "PHL"],
};

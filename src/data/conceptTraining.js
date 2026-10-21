export const concepts = [
  ["Demokrati", "Folket har makten och kan påverka hur landet styrs."],
  ["Diktatur", "En person eller en liten grupp styr utan att folket kan välja bort dem i fria val."],
  ["Representativ demokrati", "Folket väljer politiker som fattar beslut åt dem."],
  ["Direkt demokrati", "Folket röstar själva om politiska beslut."],
  ["Parlamentarism", "Regeringen är beroende av riksdagens stöd för att styra landet."],
  ["Rösträtt", "Rätten att rösta i politiska val."],
  ["Monarki", "Ett land med en kung eller drottning som statschef."],
  ["Republik", "Ett land där statschefen inte ärver sin position som monark."],
  ["Teokrati", "Ett land där religionen ligger till grund för den politiska makten."],
  ["Grundlag", "En av landets viktigaste lagar som är svårare att ändra."],
  ["Regeringsformen", "Grundlagen som beskriver hur Sverige styrs och vilka rättigheter vi har."],
  ["Successionsordningen", "Grundlagen som bestämmer vem som ärver Sveriges tron."],
  ["Tryckfrihetsförordningen", "Grundlagen som skyddar rätten att uttrycka sig i tryckta skrifter."],
  ["Yttrandefrihetsgrundlagen", "Grundlagen som skyddar yttrandefriheten i exempelvis radio, tv och vissa digitala medier."],
  ["Yttrandefrihet", "Rätten att uttrycka sina tankar och åsikter inom lagens gränser."],
  ["Diktator", "En ledare som styr ett land med mycket stor makt utan demokratisk kontroll."],
  ["Opposition", "Partier eller grupper som är emot de styrandes politik."],
  ["Censur", "När staten kontrollerar, stoppar eller förbjuder information och åsikter."],
  ["Massmedier", "Medier som når många människor, exempelvis tv, radio och tidningar."],
  ["Propaganda", "Information som sprids för att påverka människors åsikter och känslor."],
  ["Fria medier", "Medier som kan granska makthavare utan att styras av staten."],
  ["Mänskliga rättigheter", "Grundläggande rättigheter som alla människor har."],
  ["FN:s deklaration om de mänskliga rättigheterna", "Ett dokument som beskriver vilka rättigheter alla människor ska ha."],
  ["Barnkonventionen", "En internationell överenskommelse om barns rättigheter."],
  ["HBTQ+", "Ett samlingsbegrepp för bland annat homosexuella, bisexuella, transpersoner och queera personer."],
].map(([term, definition], id) => ({ id, term, definition }));

export const cases = [
  { text: "En tidning vill publicera kritik mot landets ledare. Myndigheterna stoppar artikeln innan den trycks.", options: ["Opposition", "Censur", "Rösträtt"], answer: "Censur", why: "Ledtråden är att myndigheterna stoppar publiceringen. Opposition handlar om dem som motsätter sig de styrandes politik." },
  { text: "Invånarna väljer politiker. Politikerna fattar sedan beslut om exempelvis skolor och vägar.", options: ["Representativ demokrati", "Direkt demokrati", "Teokrati"], answer: "Representativ demokrati", why: "Invånarna väljer representanter som fattar besluten åt dem. Vid direkt demokrati röstar folket själva om beslutet." },
  { text: "En ledare använder affischer och filmer som väcker starka känslor. Alla upprepar budskapet att bara ledaren kan rädda landet.", options: ["Fria medier", "Grundlag", "Propaganda"], answer: "Propaganda", why: "Budskapet är utformat för att påverka människors åsikter och känslor till ledarens fördel." },
  { text: "I en omröstning får invånarna själva säga ja eller nej till ett politiskt förslag.", options: ["Parlamentarism", "Direkt demokrati", "Representativ demokrati"], answer: "Direkt demokrati", why: "Folket röstar direkt om en sakfråga i stället för att låta valda politiker fatta just det beslutet." },
  { text: "Reportrar avslöjar att en minister har missbrukat sin makt. Regeringen kan inte bestämma vad redaktionen ska skriva.", options: ["Fria medier", "Censur", "Successionsordningen"], answer: "Fria medier", why: "Redaktionen kan självständigt granska en makthavare utan att styras av regeringen." },
  { text: "Flera partier kritiserar regeringens förslag och presenterar en annan politik.", options: ["Diktator", "Massmedier", "Opposition"], answer: "Opposition", why: "Partierna motsätter sig de styrandes politik och erbjuder alternativ." },
  { text: "En svensk regering förlorar riksdagens förtroende och kan därför inte fortsätta styra som tidigare.", options: ["Monarki", "Parlamentarism", "Teokrati"], answer: "Parlamentarism", why: "Regeringens möjlighet att styra är beroende av riksdagens stöd." },
  { text: "En elev letar efter en internationell överenskommelse som särskilt handlar om barns rättigheter.", options: ["Barnkonventionen", "Regeringsformen", "Tryckfrihetsförordningen"], answer: "Barnkonventionen", why: "Barnkonventionen handlar särskilt om barns rättigheter. Mänskliga rättigheter gäller alla, även barn." },
  { text: "Landets statschef är en drottning. Det är hennes roll som statschef som beskrivs, inte hur mycket makt folket har.", options: ["Republik", "Diktatur", "Monarki"], answer: "Monarki", why: "En monarki har en kung eller drottning som statschef. Det säger i sig inte om landet är demokratiskt eller en diktatur." },
  { text: "En elev söker namnet på den svenska grundlag som bestämmer vem som ärver tronen.", options: ["Yttrandefrihetsgrundlagen", "Successionsordningen", "Regeringsformen"], answer: "Successionsordningen", why: "Successionsordningen bestämmer tronföljden, alltså vem som ärver Sveriges tron." },
];

export const scaleLabels = ["Tydlig diktatur", "Nära diktatur", "Blandade drag", "Nära demokrati", "Tydlig demokrati"];
export const countries = [
  { name: "Land A: Den enda ledaren", text: "Ledaren har all makt. Inga fria val hålls. Opposition är förbjuden och staten stoppar kritik i medierna.", position: 0, terms: "Diktatur · diktator · censur", why: "Folket kan inte välja bort ledaren. Opposition förbjuds och medier censureras. Alla ledtrådar pekar mot diktatur." },
  { name: "Land B: Makten kan bytas ut", text: "Invånarna väljer politiker i fria val. Oppositionen får arbeta öppet och oberoende medier granskar regeringen. Rättigheter skyddas.", position: 4, terms: "Demokrati · representativ demokrati · fria medier", why: "Fria val, politiska alternativ, oberoende granskning och skyddade rättigheter ger tydliga demokratiska drag." },
  { name: "Land C: Val utan rättvis konkurrens", text: "Val hålls, men de starkaste oppositionspartierna förbjuds. Regeringen styr de stora medierna och kritiker hotas.", position: 1, terms: "Opposition · censur · diktatur", why: "Att hålla val räcker inte. När oppositionen hindras och kritiker hotas kan folket inte fritt välja mellan politiska alternativ." },
  { name: "Land D: Friheter under press", text: "Valen är fria och regeringen kan förlora makten. Oppositionen arbetar öppet. Men regeringen har börjat pressa oberoende redaktioner att undvika kritik.", position: 3, terms: "Demokrati · fria medier · yttrandefrihet", why: "Fria val och fungerande opposition är demokratiska drag. Pressen på medierna försvagar samtidigt möjligheten att granska makten." },
  { name: "Land E: Två bilder av samma land", text: "Flera partier kan delta i val och några oberoende tidningar kan granska makten. Samtidigt förbjuds vissa fredliga protester och några regeringskritiker fängslas.", position: 2, terms: "Opposition · fria medier · mänskliga rättigheter", why: "Beskrivningen innehåller både möjligheter att påverka och allvarliga inskränkningar av rättigheter. Därför placerar övningen situationen i mitten." },
];

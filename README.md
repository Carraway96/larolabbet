# Lärolabbet

En responsiv, datadriven webbplats för undervisningsmaterial i SO. Webbplatsen innehåller tre återanvändbara sidmallar:

1. **Startsida** – presenterar de fyra SO-ämnena.
2. **Ämnessida** – listar arbetsområden inom ett ämne.
3. **Arbetsområdessida** – kan kombinera text, YouTube-film, bildspel, dokumentvisare och inbäddad PDF på samma sida.

Det första kompletta arbetsområdet är **Samhällskunskap → Lag & rätt**.

## Starta lokalt

Du behöver Node.js 20 eller senare.

```bash
npm install
npm run dev
```

Öppna adressen som Vite visar, vanligtvis `http://localhost:5173`.

Bygg produktionsversionen med:

```bash
npm run build
```

Den färdiga statiska webbplatsen skapas i `dist/`. Routing använder hash-länkar (`#/...`), vilket gör bygget kompatibelt med bland annat GitHub Pages utan specialregler för omdirigering.

## Filstruktur

```text
Lärolabbet/
├─ public/
│  ├─ assets/                         # Huvudlogga och gemensamma bilder
│  └─ content/
│     └─ lag-och-ratt/
│        ├─ slides/                   # Presentationens webbilder
│        └─ documents/                # Checklistans webbsidor
├─ scripts/
│  └─ prepare_pdf_assets.py           # Gör WebP-sidor av en PDF
├─ src/
│  ├─ components/                     # Meny, kort och innehållsvisare
│  ├─ data/content.js                 # All navigation och allt sidinnehåll
│  ├─ pages/                          # De tre sidmallarna
│  ├─ App.jsx                         # Sidvägar
│  ├─ main.jsx                        # Startpunkt
│  └─ styles.css                      # Design och responsivitet
├─ index.html
├─ package.json
└─ vite.config.js
```

## Det viktigaste: ändra innehåll

All navigation och allt redaktionellt innehåll finns i `src/data/content.js`. I normalfallet behöver du inte ändra komponenterna.

### Lägg till ett arbetsområde i ämneslistan

Leta upp rätt ämne i `subjects` och lägg till ett objekt i dess `topics`-lista:

```js
{
  id: "demokrati",
  title: "Demokrati",
  description: "Så fattas beslut och så kan du påverka.",
  status: "published",
  icon: "vote",
}
```

`id` används i sidans adress. Använd små bokstäver, bindestreck och helst inga å, ä eller ö.

### Skapa arbetsområdessidan

Lägg sedan till samma `id` i `workAreas`:

```js
"demokrati": {
  id: "demokrati",
  subjectId: "samhallskunskap",
  title: "Demokrati",
  kicker: "Samhällskunskap",
  lead: "En kort introduktion till området.",
  duration: "Arbetsområde",
  updated: "Uppdaterat augusti 2026",
  goals: ["Förklara vad demokrati betyder"],
  blocks: [
    // Lägg innehållsblock här i den ordning de ska visas.
  ],
}
```

Sidan och länken skapas automatiskt. Ett ämne som bara finns under `topics` visas som en tydlig tom mallplats tills motsvarande post läggs till i `workAreas`.

## Innehållsblock

Blocken ligger i `blocks` och visas i samma ordning på samma arbetsområdessida.

### Text

```js
{
  id: "introduktion",
  type: "text",
  eyebrow: "Start",
  title: "Introduktion",
  paragraphs: ["Första stycket.", "Andra stycket."],
  callout: "En extra viktig sak att komma ihåg.",
}
```

### YouTube

Använd bara filmens ID, alltså delen efter `youtu.be/` eller `watch?v=`.

```js
{
  id: "film",
  type: "video",
  eyebrow: "Se",
  title: "Introduktionsfilm",
  description: "Kort beskrivning.",
  youtubeId: "M7AI-0y852A",
}
```

Filmen bäddas in via YouTubes integritetsförbättrade domän.

### Bildspel

Lägg bilderna i exempelvis `public/content/demokrati/slides/` och ange sökvägarna utan inledande snedstreck:

```js
{
  id: "presentation",
  type: "slideshow",
  eyebrow: "Bläddra",
  title: "Presentation",
  description: "Använd pilarna för att byta bild.",
  images: [
    "content/demokrati/slides/slide-01.webp",
    "content/demokrati/slides/slide-02.webp",
  ],
}
```

### Dokument utan nedladdningsknapp

Det här är den rekommenderade modellen. PDF-sidorna görs om till webbilder, så originalfilen behöver inte publiceras:

```js
{
  id: "checklista",
  type: "document",
  eyebrow: "Repetera",
  title: "Checklista",
  description: "Det viktigaste inför provet.",
  images: ["content/demokrati/documents/checklista-01.webp"],
}
```

Konvertera en PDF med det medföljande skriptet:

```bash
python -m pip install pymupdf pillow
python scripts/prepare_pdf_assets.py "min-fil.pdf" "public/content/demokrati/documents" --prefix checklista
```

### Inbäddad PDF

Om du hellre vill använda webbläsarens PDF-visare lägger du PDF-filen i `public/content/...` och använder:

```js
{
  id: "dokument",
  type: "pdf",
  eyebrow: "Läs",
  title: "Fördjupning",
  src: "content/demokrati/dokument.pdf",
}
```

Webbplatsen döljer visningsprogrammets verktygsfält där webbläsaren tillåter det. Viktigt: material som en besökare kan se i en webbläsare kan aldrig skyddas helt från kopiering eller nedladdning. Webbildsmodellen ovan gör däremot att original-PDF-filen inte behöver exponeras.

## Byt eller lägg till logotyper

Huvudloggan ligger i `public/assets/larolabbet-logo.png`. Ersätt filen med en ny bild med samma namn för att byta den överallt.

Ämnen och arbetsområden använder i nuläget enhetliga linjeikoner. När separata ämnesloggor finns kan de läggas i `public/assets/subjects/` och visas genom en liten ändring i `Icon.jsx` eller kortkomponenterna.

## Responsivitet och tillgänglighet

- Fast vertikal ämnesmeny på större skärmar och utfällbar ämnesmeny på mobil.
- Tangentbordsnavigering och tydliga fokusmarkeringar.
- Bildspelet stöder vänster- och högerpil när visaren har fokus.
- Layouten växlar från två kolumner till en kolumn på mindre skärmar.
- Rörelse minimeras automatiskt om användaren har aktiverat reducerad rörelse.

## Publicera på GitHub Pages

Projektet använder relativa produktionssökvägar och hash-routing. Det kan därför publiceras från innehållet i `dist/` eller med ett vanligt GitHub Actions-flöde för Vite. Kör alltid `npm run build` före publicering.

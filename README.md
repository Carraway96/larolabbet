# Lärolabbet – mall för SO-sida

Detta är en skalbar webbplatsmall där **allt innehåll ligger i en gemensam datastruktur** i `assets/js/content.js`.

## Sidor (mallar)
1. **Startsida** (`index.html`) – visar alla ämnen.
2. **Ämnessida** (`subject.html`) – visar lista av ämnesområden för valt ämne.
3. **Områdessida** (`topic.html`) – visar text, Youtube, slideshow och PDF för valt område.

## Filstruktur

```text
larolabbet/
├── index.html
├── subject.html
├── topic.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── app.js
    │   └── content.js
    └── images/
        └── loggor/
            └── (lägg dina loggor här)
```

## Så lägger du till/ändrar innehåll

### 1) Byt loggor
Lägg dina loggofiler i `assets/images/loggor/` och uppdatera sökvägar i `content.js`.

Exempel:
```js
logo: "assets/images/loggor/historia-logo.png"
```

### 2) Lägg till nytt ämne
I `assets/js/content.js`, lägg till ett nytt objekt i `subjects`:

```js
{
  id: "nytt-amne",
  name: "Nytt ämne",
  logo: "assets/images/loggor/nytt-amne-logo.png",
  description: "Kort beskrivning",
  areas: []
}
```

### 3) Lägg till nytt ämnesområde
I rätt ämnes `areas`, lägg till:

```js
{
  id: "nytt-omrade",
  title: "Nytt område",
  logo: "assets/images/loggor/nytt-omrade-logo.png",
  summary: "Kort beskrivning",
  content: {
    textBlocks: [],
    youtubeEmbeds: [],
    slideshowImages: [],
    pdfEmbeds: []
  }
}
```

### 4) Lägg till text
Under `textBlocks`:

```js
textBlocks: [
  {
    heading: "Rubrik",
    body: "Din text här"
  }
]
```

### 5) Lägg till Youtube (inbäddad)
Under `youtubeEmbeds` (använd embed-länk):

```js
youtubeEmbeds: [
  {
    title: "Film om demokrati",
    embedUrl: "https://www.youtube.com/embed/VIDEO_ID"
  }
]
```

### 6) Lägg till slideshow
Under `slideshowImages`:

```js
slideshowImages: [
  { src: "assets/images/loggor/bild1.jpg", alt: "Bild 1" },
  { src: "assets/images/loggor/bild2.jpg", alt: "Bild 2" }
]
```

### 7) Lägg till PDF
Skapa t.ex. mappen `assets/pdfs/` och lägg filer där. Lägg sedan till i `pdfEmbeds`:

```js
pdfEmbeds: [
  {
    title: "Arbetsblad",
    url: "assets/pdfs/arbetsblad.pdf"
  }
]
```

## Navigation
- Den vågräta ämnesmenyn finns högst upp på alla sidor.
- Menyn genereras automatiskt från `subjects` i `content.js`.

## Skalbarhet
- Inga hårdkodade ämnen i HTML.
- Alla ämnen, områden och innehållstyper styrs av `content.js`.
- För fler ämnen/områden räcker det att lägga till dataobjekt.

## Köra lokalt

```bash
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000`.


## Om du inte kan skapa PR

Om du arbetar i Codex-miljön kan PR skapas automatiskt med verktyget `make_pr` efter att en commit har gjorts.

Kort checklista:
1. `git status` ska vara rent eller endast innehålla avsedda ändringar.
2. Kör `git add .` och `git commit -m "Din ändring"`.
3. Skapa därefter PR med tydlig titel och beskrivning.


## Om "binärfiler stöds inte"

Om din miljö/PR-visning inte hanterar binärfiler (t.ex. `.png` eller `.pdf`) visar mallen nu inga incheckade exempelbinärer.
Lägg istället in dina egna filer lokalt i:
- `assets/images/loggor/`
- `assets/pdfs/`

Och uppdatera sökvägarna i `assets/js/content.js`.


## Om sidan visar "Not Found"

Om du öppnar `subject.html` eller `topic.html` direkt utan korrekta parametrar i länken kan sidan tidigare visa "Not Found"/"hittades inte".
Mallen visar nu automatiskt första tillgängliga ämnet/området i sådana fall.

Tips:
- Öppna alltid från `index.html` först.
- Kontrollera att `subject` och `topic` i URL motsvarar `id`-värden i `assets/js/content.js`.


## Färgtema

Färgpaletten i kort och knappar är anpassad för att harmoniera med ämnesikonerna (pastelltoner per ämne).
Du kan justera färgerna i `subjectPalette` i `assets/js/app.js`.

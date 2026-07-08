# Umkreis

Landingpage für Premium-Webseiten und digitale Sichtbarkeit. Gebaut mit Astro 7,
Tailwind CSS 4, GSAP und Lenis. Die Seite wird statisch ausgegeben und verwendet
keine Cookies oder extern geladenen Schriftarten.

## Entwicklung

Node.js 22.12 oder neuer ist erforderlich.

```sh
npm install
npx astro dev --background
```

Den Hintergrundserver mit `npx astro dev status`, `npx astro dev logs` und
`npx astro dev stop` verwalten.

```sh
npm run build
npm run preview
```

## Struktur

- `src/pages/index.astro`: Landingpage und Inhalte
- `src/components/`: Logo, bewegte Media-Wall und Produkt-Mockups
- `src/scripts/app.js`: GSAP-/Scroll-Interaktionen
- `src/styles/global.css`: Schriften, Tokens und globale Effekte
- `src/layouts/Base.astro`: SEO-, Open-Graph- und Schema-Metadaten
- `public/assets/og.png`: Social-Sharing-Bild (1200 × 630)

## Vor Veröffentlichung

Impressum und Datenschutz bleiben per `noindex` aus Suchmaschinen und werden aus
der Sitemap ausgeschlossen, bis Name, ladungsfähige Anschrift und steuerliche
Angaben final ergänzt und rechtlich geprüft wurden.

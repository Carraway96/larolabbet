import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Maximize2, Minus, Plus, Presentation, Video } from "lucide-react";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

function BlockHeader({ block, icon: HeaderIcon }) {
  return (
    <div className="block-header">
      <span className="block-icon"><HeaderIcon aria-hidden="true" size={22} /></span>
      <div>
        <span className="eyebrow">{block.eyebrow}</span>
        <h2>{block.title}</h2>
        {block.description && <p>{block.description}</p>}
      </div>
    </div>
  );
}

export function TextBlock({ block }) {
  return (
    <section className="content-block text-block" id={block.id}>
      <BlockHeader block={block} icon={FileText} />
      <div className="rich-text">
        {block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {block.callout && <aside className="callout"><strong>Bra att veta</strong><span>{block.callout}</span></aside>}
      </div>
    </section>
  );
}

export function VideoBlock({ block }) {
  return (
    <section className="content-block" id={block.id}>
      <BlockHeader block={block} icon={Video} />
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}?rel=0`}
          title={block.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export function SlideshowBlock({ block }) {
  const [current, setCurrent] = useState(0);
  const figureRef = useRef(null);
  const last = block.images.length - 1;
  const move = (direction) => setCurrent((value) => Math.min(last, Math.max(0, value + direction)));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!figureRef.current?.contains(document.activeElement)) return;
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const enterFullscreen = () => figureRef.current?.requestFullscreen?.();

  return (
    <section className="content-block" id={block.id}>
      <BlockHeader block={block} icon={Presentation} />
      <figure className="slideshow" ref={figureRef} tabIndex="0" aria-label={`${block.title}, bild ${current + 1} av ${block.images.length}`}>
        <div className="slide-stage">
          <img src={assetUrl(block.images[current])} alt={`Lag och rätt – presentationsbild ${current + 1}`} draggable="false" />
          <button className="slide-arrow previous" onClick={() => move(-1)} disabled={current === 0} aria-label="Föregående bild"><ChevronLeft /></button>
          <button className="slide-arrow next" onClick={() => move(1)} disabled={current === last} aria-label="Nästa bild"><ChevronRight /></button>
        </div>
        <figcaption className="slide-toolbar">
          <span aria-live="polite"><strong>{current + 1}</strong> / {block.images.length}</span>
          <div className="slide-progress" aria-hidden="true"><span style={{ width: `${((current + 1) / block.images.length) * 100}%` }} /></div>
          <button type="button" onClick={enterFullscreen}><Maximize2 size={17} aria-hidden="true" /> Helskärm</button>
        </figcaption>
        <div className="slide-thumbnails" aria-label="Välj presentationsbild">
          {block.images.map((image, index) => (
            <button key={image} type="button" className={current === index ? "active" : ""} onClick={() => setCurrent(index)} aria-label={`Visa bild ${index + 1}`} aria-current={current === index ? "true" : undefined}>
              <img src={assetUrl(image)} alt="" loading="lazy" draggable="false" />
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </figure>
    </section>
  );
}

export function DocumentBlock({ block }) {
  const [zoom, setZoom] = useState(100);
  return (
    <section className="content-block" id={block.id}>
      <BlockHeader block={block} icon={FileText} />
      <div className="document-viewer">
        <div className="document-toolbar">
          <span><FileText size={17} aria-hidden="true" /> Dokumentvisare</span>
          <div>
            <button type="button" onClick={() => setZoom((value) => Math.max(70, value - 10))} aria-label="Zooma ut"><Minus /></button>
            <output aria-live="polite">{zoom}%</output>
            <button type="button" onClick={() => setZoom((value) => Math.min(160, value + 10))} aria-label="Zooma in"><Plus /></button>
          </div>
        </div>
        <div className="document-canvas">
          {block.images.map((image, index) => (
            <img key={image} src={assetUrl(image)} alt={`${block.title}, sida ${index + 1}`} style={{ width: `${zoom}%` }} draggable="false" />
          ))}
        </div>
      </div>
      <p className="content-protection-note">Materialet visas direkt på sidan utan nedladdningsknapp.</p>
    </section>
  );
}

export function PdfBlock({ block }) {
  return (
    <section className="content-block" id={block.id}>
      <BlockHeader block={block} icon={FileText} />
      <object className="pdf-embed" data={`${assetUrl(block.src)}#toolbar=0&navpanes=0`} type="application/pdf">
        <p>PDF-visning stöds inte i den här webbläsaren.</p>
      </object>
    </section>
  );
}

export default function ContentBlock({ block }) {
  const components = { text: TextBlock, video: VideoBlock, slideshow: SlideshowBlock, document: DocumentBlock, pdf: PdfBlock };
  const Component = components[block.type];
  return Component ? <Component block={block} /> : null;
}

import { useEffect, useId, useRef, useState } from "react";
import { Copy, Download, X } from "lucide-react";
import { drawGeographyResult, geographyResultPng, summarizeGeographyRound } from "../data/geographyResult";

export default function GeographyResultCard({ round, nextAction }) {
  const [name, setName] = useState("");
  const [createdAt] = useState(() => new Date().toISOString());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const canvas = useRef(null);
  const dialog = useRef(null);
  const dialogTitleId = useId();
  const nameId = useId();
  const summary = summarizeGeographyRound(round);

  useEffect(() => {
    const result = summarizeGeographyRound(round);
    if (canvas.current && result) drawGeographyResult(canvas.current, result, name, createdAt);
  }, [round, name, createdAt]);

  if (!summary) return null;

  async function copyImage() {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined" || !window.isSecureContext) {
      setMessage("Bildkopiering stöds inte här. Välj Spara bilden och bifoga den till din lärare i stället.");
      return;
    }
    setBusy(true); setMessage("");
    try {
      // Call write during the click gesture, including when PNG encoding is async.
      await navigator.clipboard.write([new ClipboardItem({ "image/png": geographyResultPng(canvas.current) })]);
      setMessage("Bilden är kopierad! Klistra in den i meddelandet till din lärare, till exempel med Ctrl+V.");
    } catch {
      setMessage("Bilden kunde inte kopieras. Välj Spara bilden och bifoga den till din lärare i stället.");
    } finally { setBusy(false); }
  }

  async function saveImage() {
    setBusy(true); setMessage("");
    try {
      const blob = await geographyResultPng(canvas.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `varldskollen-niva-${summary.levelId + 1}${summary.review ? "-repetition" : ""}.png`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Resultatbilden är sparad som PNG. Bifoga den i ett meddelande till din lärare.");
    } catch { setMessage("Bilden kunde inte sparas. Försök igen eller ta en skärmbild av förhandsvisningen."); }
    finally { setBusy(false); }
  }

  return <section className="geo-result-share" aria-label="Fortsätt eller dela resultatet">
    <div className="geo-share-actions">
      {nextAction}
      <button className="button secondary" aria-haspopup="dialog" onClick={() => { setMessage(""); dialog.current.showModal(); }}>
        <Copy size={17} aria-hidden="true" />Kopiera resultatbild
      </button>
    </div>
    <dialog ref={dialog} className="geo-share-dialog" aria-labelledby={dialogTitleId}>
      <header className="geo-share-dialog-header">
        <h3 id={dialogTitleId}>Resultatbild till läraren</h3>
        <button className="geo-share-close" aria-label="Stäng resultatbilden" onClick={() => dialog.current.close()}><X size={22} aria-hidden="true" /></button>
      </header>
      <div className="geo-share-dialog-body">
        <label htmlFor={nameId}>Ditt namn <span>(valfritt, visas bara i bilden)</span></label>
        <input id={nameId} type="text" value={name} maxLength={60} autoComplete="off" onChange={event => { setName(event.target.value); setMessage(""); }} disabled={busy} />
        <canvas ref={canvas} role="img" aria-label={`${summary.review ? "Repetition" : "Resultat"}, nivå ${summary.levelId + 1}: ${summary.title}. ${summary.score} av ${summary.total} rätt. ${summary.status}. Rätt: ${summary.correct.map(c => c.name).join(", ") || "inga länder"}. Öva mer: ${summary.practice.map(c => c.name).join(", ") || "alla blev rätt"}.`} />
      </div>
      <footer className="geo-share-dialog-footer">
        <div className="geo-share-actions">
          <button className="button primary" disabled={busy} onClick={copyImage}><Copy size={17} aria-hidden="true" />Kopiera bilden</button>
          <button className="button secondary" disabled={busy} onClick={saveImage}><Download size={17} aria-hidden="true" />Spara bilden</button>
        </div>
        <p className="geo-share-message" role="status">{message}</p>
      </footer>
    </dialog>
  </section>;
}

import { countryById, levels } from "./geographyGame.js";

export function summarizeGeographyRound(round) {
  if (!round || round.index !== round.questions.length || !round.questions.length || round.answers.length !== round.questions.length) return null;
  const level = levels[round.levelId];
  if (!level) return null;
  const correct = [];
  const practice = [];
  round.questions.forEach((question, index) => {
    const country = countryById[question.countryId];
    (round.answers[index].correct ? correct : practice).push(country);
  });
  return {
    levelId: level.id, title: level.title, review: round.review,
    activity: level.mode === "continent" ? "Koppla länder till rätt världsdel" : level.mode === "regional" ? "Hitta länder på en delkarta" : "Hitta länder på världskartan",
    score: correct.length, total: round.questions.length,
    status: round.review ? "Repetition genomförd" : correct.length >= level.required ? "Nivån klarad" : "Nivån behöver övas mer",
    correct, practice,
  };
}

// The canvas is both the preview and the PNG source, so copied and saved images
// always contain the same names, counts and skill description as the preview.
export function drawGeographyResult(canvas, summary, studentName, createdAt) {
  const width = 1200;
  const commands = [];
  canvas.width = width;
  let ctx = canvas.getContext("2d");
  let y = 62;
  const write = (text, size = 28, color = "#254038", weight = "normal", x = 66) => {
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    const maxWidth = width - x - 66;
    const words = text.split(/\s+/).flatMap(word => {
      const parts = [];
      let part = "";
      for (const character of word) {
        if (part && ctx.measureText(part + character).width > maxWidth) { parts.push(part); part = ""; }
        part += character;
      }
      parts.push(part);
      return parts;
    });
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        commands.push({ text: line, size, color, weight, x, y });
        y += size * 1.4; line = word;
      } else line = candidate;
    }
    commands.push({ text: line, size, color, weight, x, y });
    y += size * 1.4;
  };
  write("LÄROLABBET · VÄRLDSKOLLEN", 23, "#407960", "bold");
  y += 16;
  write("Mitt resultat i geografi", 52, "#18344a", "bold");
  write(`${summary.review ? "Repetition · " : ""}Nivå ${summary.levelId + 1}: ${summary.title}`, 30, "#18344a", "bold");
  write(summary.activity, 26, "#526675");
  const name = studentName.trim().replace(/\s+/g, " ");
  if (name) { y += 9; write(`Namn: ${name}`, 28, "#18344a", "bold"); }
  y += 25;
  const scoreTop = y;
  y += 20;
  write(`${summary.score} av ${summary.total} rätt`, 58, "#285f43", "bold", 90);
  write(summary.review ? "Rätt i denna repetitionsomgång" : "Rätt på första försöket i denna omgång", 24, "#315a45", "normal", 90);
  write(summary.status, 27, "#315a45", "bold", 90);
  const scoreBottom = y + 14;
  y = scoreBottom + 33;
  write(summary.review ? "Jag har repeterat följande länder:" : "Det här visade jag i omgången:", 28, "#18344a", "bold");
  write(summary.levelId < 2 ? "Rätt koppling till världsdel" : "Rätt placering på kartan", 23, "#526675");
  y += 9;
  if (!summary.correct.length) write("Inga rätta svar i den här omgången ännu.", 26, "#526675");
  for (const country of summary.correct) write(`${country.name} · ${country.continent}`, 28, "#285f43");
  y += 24;
  write("Att fortsätta öva på", 28, "#18344a", "bold");
  if (!summary.practice.length) write("Alla länder blev rätt i den här omgången.", 26, "#526675");
  for (const country of summary.practice) write(`${country.name} · ${country.continent}`, 28, "#86582f");
  y += 30;
  const footerTop = y;
  write("Bilden sammanfattar den här omgången, inte alla länder på nivån.", 22, "#526675");
  write(`Skapad ${new Date(createdAt).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "medium", timeStyle: "short" })}`, 22, "#526675");
  canvas.height = Math.ceil(y + 35);
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, canvas.height);
  ctx.fillStyle = "#407960";
  ctx.fillRect(0, 0, width, 12);
  ctx.fillStyle = "#e8f2e5";
  ctx.fillRect(66, scoreTop, width - 132, scoreBottom - scoreTop);
  ctx.strokeStyle = "#d9ded5";
  ctx.beginPath(); ctx.moveTo(66, footerTop - 15); ctx.lineTo(width - 66, footerTop - 15); ctx.stroke();
  ctx.textBaseline = "top";
  for (const command of commands) {
    ctx.fillStyle = command.color;
    ctx.font = `${command.weight} ${command.size}px Arial, sans-serif`;
    ctx.fillText(command.text, command.x, command.y);
  }
}

export function geographyResultPng(canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas) { reject(new Error("Resultatbilden saknas")); return; }
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Resultatbilden kunde inte skapas")), "image/png");
  });
}

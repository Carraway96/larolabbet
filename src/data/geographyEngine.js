import { continents, countries, countryById, levels, regionalCandidates, starterIds } from "./geographyGame.js";

export const STORAGE_KEY = "larolabbet-geography-v1";
export const freshProgress = () => ({ version: 1, unlocked: 0, best: [0, 0, 0, 0], misses: [], round: null });

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function balancedCountries(pool, count, random) {
  const first = shuffle(continents, random).flatMap(continent => shuffle(pool.filter(c => c.continent === continent), random).slice(0, 1));
  const ids = new Set(first.map(c => c.id));
  return shuffle([...first, ...shuffle(pool.filter(c => !ids.has(c.id)), random).slice(0, count - first.length)], random).slice(0, count);
}

export function createQuestion(id, levelId, random = Math.random) {
  const country = countryById[id];
  const level = levels[levelId];
  let options;
  if (level.mode === "continent") {
    options = levelId === 0
      ? shuffle([country.continent, ...shuffle(continents.filter(c => c !== country.continent), random).slice(0, 2)], random)
      : shuffle(continents, random);
  } else {
    const pool = level.mode === "regional" ? regionalCandidates[country.continent] : countries.map(c => c.id);
    const distractors = level.mode === "world"
      ? balancedCountries(countries.filter(c => c.id !== id), 7, random).map(c => c.id)
      : shuffle(pool.filter(candidate => candidate !== id), random).slice(0, 5);
    options = shuffle([id, ...distractors], random);
  }
  return { countryId: id, levelId, options };
}

export function startRound(progress, levelId, review = false, random = Math.random) {
  if (!levels[levelId] || levelId > progress.unlocked) return progress;
  const level = levels[levelId];
  const misses = progress.misses.filter(m => m.levelId === levelId);
  if (review && misses.length === 0) return progress;
  let ids;
  if (review) {
    // Mix retrieval with known countries; a miss is never immediately replayed.
    const missedIds = shuffle(misses.map(m => m.countryId), random).slice(0, level.count);
    const pool = levelId === 0 ? starterIds.map(id => countryById[id]) : countries;
    const fillers = shuffle(pool.filter(c => !missedIds.includes(c.id)), random).slice(0, Math.max(0, Math.min(level.count, missedIds.length + 2) - missedIds.length));
    ids = missedIds.length === 1 ? [...fillers.map(c => c.id), ...missedIds] : shuffle([...missedIds, ...fillers.map(c => c.id)], random);
    const previous = progress.round?.questions[progress.round.answers.length - 1]?.countryId;
    if (ids[0] === previous && ids.length > 1) [ids[0], ids[1]] = [ids[1], ids[0]];
  } else if (levelId === 0) {
    ids = ["SWE", ...shuffle(starterIds.filter(id => id !== "SWE"), random)];
  } else {
    const pool = levelId === 1 ? countries.filter(c => !starterIds.includes(c.id)) : countries;
    ids = balancedCountries(pool, level.count, random).map(c => c.id);
    // Include recent misses without letting one continent take over the round.
    for (const miss of misses.slice(0, 2)) {
      if (!ids.includes(miss.countryId)) {
        const replace = ids.findIndex(id => countryById[id].continent === countryById[miss.countryId].continent);
        if (replace >= 0) ids[replace] = miss.countryId;
      }
    }
  }
  return { ...progress, round: { levelId, review, questions: ids.map(id => createQuestion(id, levelId, random)), index: 0, answers: [] } };
}

export function answerQuestion(progress, choice) {
  const round = progress.round;
  if (!round || round.index >= round.questions.length || round.answers[round.index]) return progress;
  const question = round.questions[round.index];
  if (choice !== null && !question.options.includes(choice)) return progress;
  const country = countryById[question.countryId];
  const expected = levels[question.levelId].mode === "continent" ? country.continent : country.id;
  const correct = choice === expected;
  let misses = progress.misses.filter(m => !(m.countryId === country.id && m.levelId === question.levelId));
  if (!correct) misses = [...misses, { countryId: country.id, levelId: question.levelId }];
  return { ...progress, misses, round: { ...round, answers: [...round.answers, { choice, correct }] } };
}

export function nextQuestion(progress) {
  const round = progress.round;
  if (!round || !round.answers[round.index] || round.index >= round.questions.length) return progress;
  const index = round.index + 1;
  let { unlocked } = progress;
  const best = [...progress.best];
  if (index === round.questions.length && !round.review) {
    const score = round.answers.filter(a => a.correct).length;
    best[round.levelId] = Math.max(best[round.levelId], score);
    if (score >= levels[round.levelId].required) unlocked = Math.max(unlocked, Math.min(3, round.levelId + 1));
  }
  return { ...progress, unlocked, best, round: { ...round, index } };
}

export function parseProgress(raw) {
  try {
    const p = JSON.parse(raw);
    if (p?.version !== 1 || !Number.isInteger(p.unlocked) || p.unlocked < 0 || p.unlocked > 3 ||
      !Array.isArray(p.best) || p.best.length !== 4 || p.best.some((n, i) => !Number.isInteger(n) || n < 0 || n > levels[i].count) ||
      !Array.isArray(p.misses) || p.misses.length > countries.length * 4 || p.misses.some(m => !countryById[m.countryId] || !levels[m.levelId])) return null;
    const r = p.round;
    if (r !== null) {
      if (!r || !levels[r.levelId] || r.levelId > p.unlocked || typeof r.review !== "boolean" ||
        !Array.isArray(r.questions) || !r.questions.length || r.questions.length > 10 ||
        !Number.isInteger(r.index) || r.index < 0 || r.index > r.questions.length ||
        !Array.isArray(r.answers) || r.answers.length < r.index || r.answers.length > Math.min(r.index + 1, r.questions.length)) return null;
      for (const [index, q] of r.questions.entries()) {
        const country = countryById[q.countryId];
        if (!country || q.levelId !== r.levelId || !Array.isArray(q.options) || q.options.length < 3 || q.options.length > 8 || new Set(q.options).size !== q.options.length) return null;
        const isContinent = levels[q.levelId].mode === "continent";
        const pool = isContinent ? continents : [...countries.map(c => c.id), "IDN", "MYS", "PHL"];
        const expected = isContinent ? country.continent : country.id;
        if (!q.options.includes(expected) || q.options.some(o => !pool.includes(o))) return null;
        const a = r.answers[index];
        if (index < r.answers.length && (!a || typeof a.correct !== "boolean" || (a.choice !== null && !q.options.includes(a.choice)) || a.correct !== (a.choice === expected))) return null;
      }
    }
    return p;
  } catch { return null; }
}

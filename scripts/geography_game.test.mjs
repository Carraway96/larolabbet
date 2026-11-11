import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { answerQuestion, freshProgress, nextQuestion, parseProgress, startRound } from '../src/data/geographyEngine.js';
import { countries, countryById, continents, levels, regionalCandidates } from '../src/data/geographyGame.js';

const map = JSON.parse(await readFile(new URL('../src/data/geographyMap.json', import.meta.url), 'utf8'));
const random = () => 0.314159;
const expected = q => levels[q.levelId].mode === 'continent' ? countryById[q.countryId].continent : q.countryId;
function complete(progress, correctCount = 100) {
  while (progress.round.index < progress.round.questions.length) {
    const q = progress.round.questions[progress.round.index];
    const choice = progress.round.index < correctCount ? expected(q) : q.options.find(o => o !== expected(q));
    progress = nextQuestion(answerQuestion(progress, choice));
  }
  return progress;
}

test('first round starts with Sweden and covers all six inhabited continents', () => {
  const p = startRound(freshProgress(), 0, false, random);
  assert.equal(p.round.questions[0].countryId, 'SWE');
  assert.equal(p.round.questions.length, 6);
  assert.equal(new Set(p.round.questions.map(q => countryById[q.countryId].continent)).size, 6);
  assert.equal(p.round.questions[0].options.length, 3);
  const locked = freshProgress();
  assert.equal(startRound(locked, 3), locked);
});

test('one locked answer, including skip, cannot be changed or clicked past', () => {
  const p = startRound(freshProgress(), 0, false, random);
  assert.equal(nextQuestion(p), p);
  const wrong = p.round.questions[0].options.find(option => option !== 'Europa');
  const answered = answerQuestion(p, wrong);
  assert.equal(answered.round.answers[0].correct, false);
  assert.equal(answerQuestion(answered, 'Europa'), answered);
  assert.equal(answered.misses[0].countryId, 'SWE');
  assert.equal(answerQuestion(p, 'not an option'), p);
  assert.equal(answerQuestion(p, null).round.answers[0].correct, false);
});

test('progression requires the threshold in a normal completed round', () => {
  for (const level of levels) {
    const base = { ...freshProgress(), unlocked: level.id };
    const failed = complete(startRound(base, level.id, false, random), level.required - 1);
    assert.equal(failed.unlocked, level.id);
    assert.equal(failed.best[level.id], level.required - 1);
    const passed = complete(startRound(base, level.id, false, random), level.required);
    assert.equal(passed.unlocked, Math.min(3, level.id + 1));
    assert.equal(passed.best[level.id], level.required);
    assert.equal(nextQuestion(passed), passed);
  }
});

test('review mixes countries, clears learned misses, and never unlocks a level', () => {
  const base = { ...freshProgress(), misses: [{ countryId: 'SWE', levelId: 0 }] };
  const review = startRound(base, 0, true, random);
  assert.equal(review.round.questions.length, 3);
  assert.equal(review.round.questions.some(q => q.countryId === 'SWE'), true);
  assert.equal(review.round.questions[2].countryId, 'SWE');
  const completed = complete(review);
  assert.equal(completed.misses.length, 0);
  assert.equal(completed.unlocked, 0);
  assert.equal(completed.best[0], 0);
});

test('saved progress resumes a locked question and rejects corrupt data', () => {
  const p = answerQuestion(startRound(freshProgress(), 0, false, random), null);
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  assert.deepEqual(parseProgress(JSON.stringify(complete(startRound(freshProgress(), 0, false, random)))), complete(startRound(freshProgress(), 0, false, random)));
  for (const raw of ['no json', 'null', '{}', JSON.stringify({ ...p, unlocked: 99 }), JSON.stringify({ ...p, round: { ...p.round, index: -1 } })]) assert.equal(parseProgress(raw), null);
  const corrupted = structuredClone(p);
  corrupted.round.questions[0].options = ['not a continent'];
  assert.equal(parseProgress(JSON.stringify(corrupted)), null);
  const missingAnswer = structuredClone(p);
  missingAnswer.round.answers[0] = null;
  assert.equal(parseProgress(JSON.stringify(missingAnswer)), null);
});

test('every target and distractor has real map geometry; candidates and correct answers are unique', () => {
  const mapped = new Map(map.countries.map(c => [c.id, c]));
  assert.equal(mapped.size, 177);
  for (const id of [...countries.map(c => c.id), ...Object.values(regionalCandidates).flat()]) {
    assert.ok(mapped.has(id), `Missing geometry: ${id}`);
    assert.ok(mapped.get(id).path.startsWith('M'));
    assert.ok(mapped.get(id).point.every(Number.isFinite));
  }
  for (const country of countries) assert.equal(mapped.get(country.id).continent, country.continent);
  for (const level of levels) for (let iteration = 0; iteration < 20; iteration++) {
    const p = startRound({ ...freshProgress(), unlocked: 3 }, level.id);
    assert.equal(p.round.questions.length, level.count);
    assert.equal(new Set(p.round.questions.map(q => q.countryId)).size, level.count);
    for (const q of p.round.questions) {
      assert.equal(q.options.length, level.id === 0 ? 3 : level.id === 3 ? 8 : 6);
      assert.equal(q.options.includes(expected(q)), true);
      assert.equal(new Set(q.options).size, q.options.length);
      for (const option of q.options) assert.ok(level.mode === 'continent' ? continents.includes(option) : mapped.has(option));
    }
    assert.ok(parseProgress(JSON.stringify(p)));
  }
});

// ===================================================================
//  Java Prog 4. KisZH – gyakorló felület logikája
// ===================================================================

// --- állapot ---
const state = {
  mode: "flash",          // "flash" | "quiz"
  selectedTopics: new Set(TOPICS),
  shuffle: true,
  count: "all",
  deck: [],               // az aktuális kérdéslista
  idx: 0,
  score: 0,               // helyes válaszok száma
  answered: [],           // {q, correct:bool|null} tételenként
};

// --- DOM gyorsérők ---
const $ = (id) => document.getElementById(id);
const screens = { home: $("home"), practice: $("practice"), result: $("result") };

function show(screen) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[screen].classList.remove("hidden");
  window.scrollTo(0, 0);
}

// =============== HOME: témakör chipek ===============
function buildTopicFilters() {
  const wrap = $("topicFilters");
  wrap.innerHTML = "";
  TOPICS.forEach((t) => {
    const n = QUESTIONS.filter((q) => q.topic === t).length;
    const chip = document.createElement("div");
    chip.className = "topic-chip active";
    chip.textContent = `${t} (${n})`;
    chip.dataset.topic = t;
    chip.addEventListener("click", () => {
      if (state.selectedTopics.has(t)) {
        state.selectedTopics.delete(t);
        chip.classList.remove("active");
      } else {
        state.selectedTopics.add(t);
        chip.classList.add("active");
      }
      updateAvailable();
    });
    wrap.appendChild(chip);
  });
  updateAvailable();
}

function pool() {
  return QUESTIONS.filter((q) => state.selectedTopics.has(q.topic));
}

function updateAvailable() {
  const n = pool().length;
  $("availableInfo").textContent = `Elérhető kérdés a kiválasztott témákból: ${n}`;
  $("startBtn").disabled = n === 0;
}

// =============== DECK összeállítás ===============
function shuffleArr(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  let d = pool();
  if (state.shuffle) d = shuffleArr(d);
  if (state.count !== "all") d = d.slice(0, parseInt(state.count, 10));
  state.deck = d;
  state.idx = 0;
  state.score = 0;
  state.answered = [];
}

// =============== egy kérdés megjelenítése ===============
function renderQuestion() {
  const q = state.deck[state.idx];
  const total = state.deck.length;

  $("progressFill").style.width = `${(state.idx / total) * 100}%`;
  $("counter").textContent = `${state.idx + 1} / ${total}`;
  $("topicBadge").textContent = q.topic;
  $("questionText").textContent = q.q;

  const fb = $("feedback");
  fb.className = "feedback hidden";
  fb.innerHTML = "";

  const area = $("answerArea");
  area.innerHTML = "";

  // gombok alaphelyzet
  $("showBtn").classList.toggle("hidden", state.mode === "quiz");
  $("checkBtn").classList.add("hidden");
  $("nextBtn").disabled = false;
  $("scoreBox").classList.toggle("hidden", state.mode !== "quiz");
  $("scoreVal").textContent = state.score;

  if (q.type === "truefalse") {
    renderChoice(q, ["Igaz", "Hamis"], [true, false]);
  } else if (q.type === "single") {
    renderChoice(q, q.options, q.options.map((_, i) => i));
  } else if (q.type === "text") {
    renderText(q);
  }
}

// választós (truefalse + single)
function renderChoice(q, labels, values) {
  const area = $("answerArea");
  area._selected = null;
  labels.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.textContent = label;
    btn.dataset.value = JSON.stringify(values[i]);
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      [...area.children].forEach((c) => c.classList.remove("selected"));
      btn.classList.add("selected");
      area._selected = values[i];
      if (state.mode === "quiz") $("checkBtn").classList.remove("hidden");
    });
    area.appendChild(btn);
  });

  if (state.mode === "quiz") {
    // kvízben: Ellenőrzés gomb, Next tiltva amíg nincs ellenőrizve
    $("nextBtn").disabled = true;
    $("checkBtn").classList.add("hidden"); // amíg nincs kiválasztva
  }
}

// szöveges (kódfeladat)
function renderText(q) {
  const area = $("answerArea");
  const ta = document.createElement("textarea");
  ta.className = "text-answer";
  ta.placeholder = "Írd ide a válaszod...";
  area.appendChild(ta);
  area._textarea = ta;
  if (state.mode === "quiz") $("nextBtn").disabled = true;
}

// =============== VÁLASZ MUTATÁSA (flashcard) ===============
function showAnswer() {
  const q = state.deck[state.idx];
  const fb = $("feedback");
  fb.className = "feedback ok";
  let html = `<span class="verdict">Helyes válasz</span>`;
  html += `<div>${correctAnswerText(q)}</div>`;
  html += `<div class="model-answer">${escapeHtml(q.explain)}</div>`;
  fb.innerHTML = html;

  // flashben a választós opciókat is színezzük
  highlightCorrect(q);
  $("showBtn").classList.add("hidden");
}

// =============== ELLENŐRZÉS (kvíz) ===============
function checkAnswer() {
  const q = state.deck[state.idx];
  let correct = false;
  const fb = $("feedback");

  if (q.type === "truefalse" || q.type === "single") {
    const sel = $("answerArea")._selected;
    if (sel === null || sel === undefined) return;
    correct = sel === q.answer;
    // opciók tiltása + színezés
    const area = $("answerArea");
    [...area.children].forEach((btn) => {
      btn.disabled = true;
      const val = JSON.parse(btn.dataset.value);
      if (val === q.answer) btn.classList.add("correct");
      if (val === sel && sel !== q.answer) btn.classList.add("wrong");
    });
  } else if (q.type === "text") {
    // szöveges: önértékelés (nem lehet megbízhatóan automatikusan)
    showSelfGrade(q);
    return; // a self-grade gombok rögzítik a pontot
  }

  recordAndFeedback(q, correct);
}

// szöveges feladat önértékelő
function showSelfGrade(q) {
  const area = $("answerArea");
  if (area._textarea) area._textarea.disabled = true;

  const fb = $("feedback");
  fb.className = "feedback";
  fb.innerHTML =
    `<span class="verdict">Minta-megoldás:</span>` +
    `<div class="model-answer">${escapeHtml(q.answer.join("\n— vagy —\n"))}</div>` +
    `<div class="model-answer">${escapeHtml(q.explain)}</div>` +
    `<div class="self-grade">
       <button class="btn primary" id="sgOk">Eltaláltam ✓</button>
       <button class="btn ghost" id="sgNo">Nem talált ✗</button>
     </div>`;
  $("checkBtn").classList.add("hidden");

  $("sgOk").addEventListener("click", () => recordAndFeedback(q, true, true));
  $("sgNo").addEventListener("click", () => recordAndFeedback(q, false, true));
}

// pont rögzítése + visszajelzés megjelenítése
function recordAndFeedback(q, correct, isText = false) {
  state.answered.push({ q, correct });
  if (correct) state.score++;
  $("scoreVal").textContent = state.score;

  const fb = $("feedback");
  if (!isText) {
    fb.className = "feedback " + (correct ? "ok" : "bad");
    fb.innerHTML =
      `<span class="verdict">${correct ? "Helyes! ✓" : "Nem jó ✗"}</span>` +
      `<div>Helyes válasz: ${correctAnswerText(q)}</div>` +
      `<div class="model-answer">${escapeHtml(q.explain)}</div>`;
  } else {
    // szövegesnél már látszik a minta; csak a verdict frissül
    const verdict = fb.querySelector(".verdict");
    if (verdict) verdict.textContent = correct ? "Eltaláltad ✓" : "Legközelebb sikerül ✗";
    const sg = fb.querySelector(".self-grade");
    if (sg) sg.remove();
  }

  $("checkBtn").classList.add("hidden");
  $("nextBtn").disabled = false;
}

// =============== segéd ===============
function correctAnswerText(q) {
  if (q.type === "truefalse") return q.answer ? "Igaz" : "Hamis";
  if (q.type === "single") return escapeHtml(q.options[q.answer]);
  if (q.type === "text") return escapeHtml(q.answer[0]);
  return "";
}

function highlightCorrect(q) {
  if (q.type !== "truefalse" && q.type !== "single") return;
  const area = $("answerArea");
  [...area.children].forEach((btn) => {
    const val = JSON.parse(btn.dataset.value);
    if (val === q.answer) btn.classList.add("correct");
    btn.disabled = true;
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// =============== NAVIGÁCIÓ ===============
function next() {
  // flashcardban a "meg nem válaszolt" eseteket is lépni hagyjuk
  if (state.mode === "flash" && state.answered.length <= state.idx) {
    state.answered.push({ q: state.deck[state.idx], correct: null });
  }
  state.idx++;
  if (state.idx >= state.deck.length) {
    finish();
  } else {
    renderQuestion();
  }
}

function finish() {
  $("progressFill").style.width = "100%";
  const total = state.deck.length;

  if (state.mode === "quiz") {
    const pct = Math.round((state.score / total) * 100);
    $("resultScore").textContent = `${state.score} / ${total}`;
    $("resultScore").style.color =
      pct >= 75 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
    $("resultMsg").textContent =
      pct >= 75 ? "Szép munka! Ez vizsgaérett. 🎉"
      : pct >= 50 ? "Nem rossz, de van még mit csiszolni. 💪"
      : "Érdemes átnézni a puskát és újrapróbálni. 📚";

    // témakörönkénti bontás
    const byTopic = {};
    state.answered.forEach(({ q, correct }) => {
      if (!byTopic[q.topic]) byTopic[q.topic] = { ok: 0, all: 0 };
      byTopic[q.topic].all++;
      if (correct) byTopic[q.topic].ok++;
    });
    const bd = $("resultBreakdown");
    bd.innerHTML = "";
    Object.entries(byTopic).forEach(([t, s]) => {
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `<span>${t}</span><strong>${s.ok} / ${s.all}</strong>`;
      bd.appendChild(row);
    });
  } else {
    $("resultScore").textContent = "✓";
    $("resultScore").style.color = "var(--ok)";
    $("resultMsg").textContent = `Végignézted mind a ${total} kártyát. 👏`;
    $("resultBreakdown").innerHTML = "";
  }

  show("result");
}

// =============== ESEMÉNYEK ===============
function init() {
  buildTopicFilters();

  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", (e) => (state.mode = e.target.value))
  );
  $("shuffleChk").addEventListener("change", (e) => (state.shuffle = e.target.checked));
  $("countSel").addEventListener("change", (e) => (state.count = e.target.value));

  $("startBtn").addEventListener("click", () => {
    buildDeck();
    if (state.deck.length === 0) return;
    show("practice");
    renderQuestion();
  });

  $("showBtn").addEventListener("click", showAnswer);
  $("checkBtn").addEventListener("click", checkAnswer);
  $("nextBtn").addEventListener("click", next);
  $("quitBtn").addEventListener("click", () => show("home"));

  $("retryBtn").addEventListener("click", () => {
    buildDeck();
    show("practice");
    renderQuestion();
  });
  $("homeBtn").addEventListener("click", () => show("home"));
}

document.addEventListener("DOMContentLoaded", init);

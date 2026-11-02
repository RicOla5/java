// ===================================================================
//  Java Prog KisZH – gyakorló felület logikája
// ===================================================================

// --- állapot ---
const state = {
  mode: "flash",          // "flash" | "quiz"
  selectedTopics: new Set(TOPICS),
  shuffle: true,
  onlyOriginal: false,    // csak hivatalos (nem generált) kérdések
  count: "all",
  deck: [],               // az aktuális kérdéslista
  idx: 0,
  // kérdésenkénti állapot, INDEX szerint (nem push!), hogy vissza/előre lépésnél
  // helyreállítható legyen. elem: { revealed, selected, correct, graded }
  results: [],
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

// a szűrőknek megfelelő kérdéshalmaz
function pool() {
  return QUESTIONS.filter((q) =>
    state.selectedTopics.has(q.topic) && (!state.onlyOriginal || !q.generated)
  );
}

function updateAvailable() {
  const n = pool().length;
  const suffix = state.onlyOriginal ? " (csak eredeti)" : "";
  $("availableInfo").textContent = `Elérhető kérdés${suffix}: ${n}`;
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
  state.results = d.map(() => null);   // minden kérdéshez üres állapot
}

// aktuális pontszám (az összes rögzített helyes válasz)
function currentScore() {
  return state.results.filter((r) => r && r.correct === true).length;
}

// =============== egy kérdés megjelenítése ===============
function renderQuestion() {
  const q = state.deck[state.idx];
  const total = state.deck.length;
  const res = state.results[state.idx];   // lehet null (még nem láttuk)

  $("progressFill").style.width = `${((state.idx) / total) * 100}%`;
  $("counter").textContent = `${state.idx + 1} / ${total}`;
  $("topicBadge").textContent = q.generated ? `${q.topic} · GYAKORLÓ` : q.topic;
  $("topicBadge").classList.toggle("generated", !!q.generated);
  $("questionText").textContent = q.q;

  const fb = $("feedback");
  fb.className = "feedback hidden";
  fb.innerHTML = "";

  const area = $("answerArea");
  area.innerHTML = "";

  // gombok alaphelyzet
  $("prevBtn").disabled = state.idx === 0;
  $("scoreBox").classList.toggle("hidden", state.mode !== "quiz");
  $("scoreVal").textContent = currentScore();
  $("nextBtn").textContent =
    state.idx === total - 1 ? (state.mode === "quiz" ? "Befejezés ✓" : "Vége ✓") : "Következő →";

  // válasz-terület felépítése
  if (q.type === "truefalse") {
    renderChoice(q, ["Igaz", "Hamis"], [true, false]);
  } else if (q.type === "single") {
    renderChoice(q, q.options, q.options.map((_, i) => i));
  } else if (q.type === "text") {
    renderText(q);
  }

  // ha már volt válasz ezen a kérdésen → állítsuk vissza a nézetet
  if (res) {
    restoreAnswered(q, res);
  } else {
    // friss kérdés
    $("showBtn").classList.toggle("hidden", state.mode === "quiz");
    $("checkBtn").classList.add("hidden");
    // kvízben a Következő csak ellenőrzés után; flashben szabadon léphet
    $("nextBtn").disabled = state.mode === "quiz";
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
}

// szöveges (kódfeladat)
function renderText(q) {
  const area = $("answerArea");
  const ta = document.createElement("textarea");
  ta.className = "text-answer";
  ta.placeholder = "Írd ide a válaszod...";
  area.appendChild(ta);
  area._textarea = ta;
}

// =============== egy már megválaszolt kérdés nézetének helyreállítása ===============
function restoreAnswered(q, res) {
  const area = $("answerArea");
  $("showBtn").classList.add("hidden");
  $("checkBtn").classList.add("hidden");
  $("nextBtn").disabled = false;

  if (q.type === "truefalse" || q.type === "single") {
    [...area.children].forEach((btn) => {
      btn.disabled = true;
      const val = JSON.parse(btn.dataset.value);
      if (val === q.answer) btn.classList.add("correct");
      if (res.graded && res.selected !== null && val === res.selected && res.selected !== q.answer) {
        btn.classList.add("wrong");
      }
    });
  } else if (q.type === "text") {
    if (area._textarea) {
      if (res.textValue != null) area._textarea.value = res.textValue;
      area._textarea.disabled = true;
    }
  }

  // feedback doboz visszaállítása
  const fb = $("feedback");
  if (state.mode === "quiz" && res.graded) {
    renderFeedback(q, res.correct);
  } else {
    // flashcard: csak a válasz felfedése
    fb.className = "feedback ok";
    fb.innerHTML =
      `<span class="verdict">Helyes válasz</span>` +
      `<div>${correctAnswerText(q)}</div>` +
      `<div class="model-answer">${escapeHtml(q.explain)}</div>`;
  }
}

// =============== VÁLASZ MUTATÁSA (flashcard) ===============
function showAnswer() {
  const q = state.deck[state.idx];
  state.results[state.idx] = { revealed: true, selected: null, correct: null, graded: false };

  const fb = $("feedback");
  fb.className = "feedback ok";
  fb.innerHTML =
    `<span class="verdict">Helyes válasz</span>` +
    `<div>${correctAnswerText(q)}</div>` +
    `<div class="model-answer">${escapeHtml(q.explain)}</div>`;

  highlightCorrect(q);
  $("showBtn").classList.add("hidden");
}

// =============== ELLENŐRZÉS (kvíz) ===============
function checkAnswer() {
  const q = state.deck[state.idx];

  if (q.type === "truefalse" || q.type === "single") {
    const sel = $("answerArea")._selected;
    if (sel === null || sel === undefined) return;
    const correct = sel === q.answer;

    const area = $("answerArea");
    [...area.children].forEach((btn) => {
      btn.disabled = true;
      const val = JSON.parse(btn.dataset.value);
      if (val === q.answer) btn.classList.add("correct");
      if (val === sel && sel !== q.answer) btn.classList.add("wrong");
    });

    state.results[state.idx] = { revealed: true, selected: sel, correct, graded: true };
    $("scoreVal").textContent = currentScore();
    renderFeedback(q, correct);
    $("checkBtn").classList.add("hidden");
    $("nextBtn").disabled = false;
  } else if (q.type === "text") {
    showSelfGrade(q);
  }
}

// szöveges feladat önértékelő
function showSelfGrade(q) {
  const area = $("answerArea");
  const textValue = area._textarea ? area._textarea.value : "";
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

  $("sgOk").addEventListener("click", () => gradeText(q, true, textValue));
  $("sgNo").addEventListener("click", () => gradeText(q, false, textValue));
}

function gradeText(q, correct, textValue) {
  state.results[state.idx] = { revealed: true, selected: null, correct, graded: true, textValue };
  $("scoreVal").textContent = currentScore();

  const fb = $("feedback");
  const verdict = fb.querySelector(".verdict");
  if (verdict) verdict.textContent = correct ? "Eltaláltad ✓" : "Legközelebb sikerül ✗";
  const sg = fb.querySelector(".self-grade");
  if (sg) sg.remove();
  fb.className = "feedback " + (correct ? "ok" : "bad");

  $("nextBtn").disabled = false;
}

// kvíz visszajelző doboz (választósokra)
function renderFeedback(q, correct) {
  const fb = $("feedback");
  if (q.type === "text") {
    fb.className = "feedback " + (correct ? "ok" : "bad");
    fb.innerHTML =
      `<span class="verdict">${correct ? "Eltaláltad ✓" : "Nem talált ✗"}</span>` +
      `<div class="model-answer">${escapeHtml(q.answer.join("\n— vagy —\n"))}</div>` +
      `<div class="model-answer">${escapeHtml(q.explain)}</div>`;
    return;
  }
  fb.className = "feedback " + (correct ? "ok" : "bad");
  fb.innerHTML =
    `<span class="verdict">${correct ? "Helyes! ✓" : "Nem jó ✗"}</span>` +
    `<div>Helyes válasz: ${correctAnswerText(q)}</div>` +
    `<div class="model-answer">${escapeHtml(q.explain)}</div>`;
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
function prev() {
  if (state.idx === 0) return;
  state.idx--;
  renderQuestion();
}

function next() {
  const total = state.deck.length;

  // flashcardban a "meg nem válaszolt" (fel nem fedett) kérdést is továbbléphet,
  // de jelöljük, hogy láttuk (null correct)
  if (state.mode === "flash" && !state.results[state.idx]) {
    state.results[state.idx] = { revealed: false, selected: null, correct: null, graded: false };
  }

  if (state.idx >= total - 1) {
    finish();
  } else {
    state.idx++;
    renderQuestion();
  }
}

function finish() {
  $("progressFill").style.width = "100%";
  const total = state.deck.length;

  if (state.mode === "quiz") {
    const score = currentScore();
    const pct = Math.round((score / total) * 100);
    $("resultScore").textContent = `${score} / ${total}`;
    $("resultScore").style.color =
      pct >= 75 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
    $("resultMsg").textContent =
      pct >= 75 ? "Szép munka! Ez vizsgaérett. 🎉"
      : pct >= 50 ? "Nem rossz, de van még mit csiszolni. 💪"
      : "Érdemes átnézni a puskát és újrapróbálni. 📚";

    // témakörönkénti bontás
    const byTopic = {};
    state.deck.forEach((q, i) => {
      const r = state.results[i];
      if (!byTopic[q.topic]) byTopic[q.topic] = { ok: 0, all: 0 };
      byTopic[q.topic].all++;
      if (r && r.correct === true) byTopic[q.topic].ok++;
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

// a state szinkronizálása a TÉNYLEGES DOM-állapotból (védelem a böngésző
// form-memóriája ellen: ha a pipa vizuálisan be van kattintva, de a change
// event nem sült el, start előtt akkor is a valós állapotot vesszük)
function syncSettingsFromDOM() {
  const modeEl = document.querySelector('input[name="mode"]:checked');
  state.mode = modeEl ? modeEl.value : "flash";
  state.shuffle = $("shuffleChk").checked;
  state.onlyOriginal = $("originalChk").checked;
  state.count = $("countSel").value;
}

function startPractice() {
  syncSettingsFromDOM();       // mindig a valós beállításokból indulunk
  buildDeck();
  if (state.deck.length === 0) return;
  show("practice");
  renderQuestion();
}

// =============== ESEMÉNYEK ===============
function init() {
  buildTopicFilters();

  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", (e) => (state.mode = e.target.value))
  );
  $("shuffleChk").addEventListener("change", (e) => (state.shuffle = e.target.checked));
  $("originalChk").addEventListener("change", (e) => {
    state.onlyOriginal = e.target.checked;
    updateAvailable();
  });
  $("countSel").addEventListener("change", (e) => (state.count = e.target.value));

  // induláskor is olvassuk be a valós DOM-állapotot
  syncSettingsFromDOM();
  updateAvailable();

  $("startBtn").addEventListener("click", startPractice);

  $("prevBtn").addEventListener("click", prev);
  $("showBtn").addEventListener("click", showAnswer);
  $("checkBtn").addEventListener("click", checkAnswer);
  $("nextBtn").addEventListener("click", next);

  // gyakorlás közbeni "Menü" gomb (vissza a főoldalra)
  $("menuBtn").addEventListener("click", () => show("home"));

  $("retryBtn").addEventListener("click", startPractice);
  $("homeBtn").addEventListener("click", () => show("home"));
}

document.addEventListener("DOMContentLoaded", init);

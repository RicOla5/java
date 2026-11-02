# Java Prog 4. KisZH – Gyakorló

Webes gyakorló felület a 4. KisZH anyagához (**szálkezelés · JUnit5 · lambda**),
plusz a hozzá tartozó jegyzetek/cheatsheetek.

## 🌐 Élő felület (GitHub Pages)

A `kzh4` branch Pages-re állítása után:
`https://<felhasználónév>.github.io/java/`

### Funkciók
- **🃏 Flashcard mód** – kérdés → válasz felfedése, tempó nélkül.
- **📝 Teszt (kvíz) mód** – pontozás, a végén témakörönkénti bontás.
- **Témakör-szűrés** (Szálkezelés / Wrapper / JUnit5 / Lambda).
- **Keverés** és **kérdésszám** állítható.
- Igaz/hamis és feleletválasztós kérdések automatikus pontozással.
- Kódfeladatoknál (lambda/wrapper) minta-megoldás + önértékelés.

## 📂 Fájlok

| Fájl | Tartalom |
|---|---|
| `index.html` | A gyakorló felület |
| `style.css` | Stílus |
| `app.js` | Logika (módok, pontozás, eredmény) |
| `questions.js` | Kérdésadatbázis (minden kérdés + válasz + magyarázat) |
| `docs/giga-mega-ultimate-cheatsheet.md` | Teljes, deduplikált kérdés-válasz lista |
| `docs/cheatsheet.md` | Gyors cheatsheet |
| `docs/java-szalkezeles-puska.md` | Részletes, magyarázatos puska |

## 🚀 GitHub Pages beállítása

1. GitHub → a repó **Settings → Pages**.
2. **Source:** Deploy from a branch.
3. **Branch:** `kzh4`, mappa: `/ (root)`. Mentés.
4. Pár perc múlva elérhető a fenti URL-en.

## 🖥 Helyi futtatás

Nincs build, statikus oldal. Elég megnyitni az `index.html`-t böngészőben
(vagy `python3 -m http.server` a repó gyökerében, majd `http://localhost:8000`).

## ✅ A JUnit5 eredmények ellenőrizve

A kérdésbankban szereplő összes "mi lesz a teszt eredménye?" típusú JUnit5 feladat
(SUCCESS / FAILURE / ERROR / ABORTED) **valódi JUnit5-tel (junit-jupiter 5.11, Java 25) le lett futtatva**,
és a megadott válaszok egyeznek a tényleges futási eredménnyel:
`13 SUCCESS · 16 failed (FAILURE+ERROR) · 2 ABORTED`.

> Megjegyzés JUnit4 → JUnit5: az `assumeTrue(false)` JUnit5-ben **ABORTED** (JUnit4-ben IGNORE/SKIPPED).

## ✍️ Új kérdés hozzáadása

A `questions.js`-ben vegyél fel egy új objektumot a `QUESTIONS` tömbbe:
```js
{ topic: "JUnit5", type: "single",
  q: "A kérdés szövege?",
  options: ["A", "B", "C"], answer: 1,   // a helyes index
  explain: "Miért ez a jó válasz." }
```
Típusok: `truefalse` (`answer: true/false`), `single` (`options[]`, `answer: index`),
`text` (`answer: [minta1, minta2]` – önértékeléssel).

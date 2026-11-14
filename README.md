# Java Prog 4. KisZH – Gyakorló

# Java Prog 5. KisZH – Szálkezelés Gyakorló (kzh5 branch)

Webes gyakorló felület a **szálkezelés** anyagához (threads, synchronized,
wait/notify, szálbiztos wrapper osztályok), ugyanazzal a működéssel, mint a
`kzh4` (JUnit5+Lambda) felület.

> **Branch-ek:**
> - `kzh4` → JUnit5 + Lambda gyakorló
> - `kzh5` → Szálkezelés gyakorló (ez a branch)

## 🌐 Élő felület (GitHub Pages)

A `kzh5` branch Pages-re állítása után:
`https://<felhasználónév>.github.io/java/`

### Funkciók
- **🃏 Flashcard mód** – kérdés → válasz felfedése, tempó nélkül.
- **📝 Teszt (kvíz) mód** – pontozás, a végén témakörönkénti bontás.
- **◀ Vissza / Következő ▶** – oda-vissza lépkedés; a megadott válaszok és a
  pontszám megmaradnak lépkedésnél.
- **🏠 Menü** – bármikor vissza a kezdőképernyőre.
- **Témakör-szűrés** (Szálkezelés / Wrapper).
- **Keverés** és **kérdésszám** állítható.
- Igaz/hamis és feleletválasztós kérdések automatikus pontozással.
- Kódfeladatoknál (wrapper) minta-megoldás + önértékelés.

**Kérdések száma:** 37 (Szálkezelés: 34, Wrapper: 3).

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
3. **Branch:** `kzh5`, mappa: `/ (root)`. Mentés.
4. Pár perc múlva elérhető a fenti URL-en.

## 🖥 Helyi futtatás

Nincs build, statikus oldal. Elég megnyitni az `index.html`-t böngészőben
(vagy `python3 -m http.server` a repó gyökerében, majd `http://localhost:8000`).

## ✍️ Új kérdés hozzáadása

A `questions.js`-ben vegyél fel egy új objektumot a `QUESTIONS` tömbbe:
```js
{ topic: "Szálkezelés", type: "single",
  q: "A kérdés szövege?",
  options: ["A", "B", "C"], answer: 1,   // a helyes index
  explain: "Miért ez a jó válasz." }
```
Típusok: `truefalse` (`answer: true/false`), `single` (`options[]`, `answer: index`),
`text` (`answer: [minta1, minta2]` – önértékeléssel).

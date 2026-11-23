# Java Prog 4. KisZH – Gyakorló

# Java Prog 6. KisZH – Swing GUI Gyakorló (kzh6 branch)

Webes gyakorló felület a **Swing GUI** anyagához (JFrame, JButton, JTextField,
ActionListener, eseménykezelés), ugyanazzal a működéssel, mint a korábbi
gyakorló felületek.

> **Branch-ek:**
> - `kzh4` → JUnit5 + Lambda gyakorló
> - `kzh5` → Szálkezelés gyakorló
> - `kzh6` → Swing GUI gyakorló (ez a branch)

**Kérdések száma:** 13 (Swing igaz/hamis + fogalmak: 11, Swing kódfeladat: 2).

## 🌐 Élő felület (GitHub Pages)

A `kzh6` branch Pages-re állítása után:
`https://<felhasználónév>.github.io/java/`

### Funkciók
- **🃏 Flashcard mód** – kérdés → válasz felfedése, tempó nélkül.
- **📝 Teszt (kvíz) mód** – pontozás, a végén témakörönkénti bontás.
- **◀ Vissza / Következő ▶** – oda-vissza lépkedés; a megadott válaszok és a
  pontszám megmaradnak lépkedésnél.
- **🏠 Menü** – bármikor vissza a kezdőképernyőre.
- **Témakör-szűrés** (Swing / Swing kód).
- **Keverés** és **kérdésszám** állítható.
- Igaz/hamis és feleletválasztós kérdések automatikus pontozással.
- Kódfeladatoknál (wrapper) minta-megoldás + önértékelés.

**Kérdések száma:** 13 (Swing: 11, Swing kód: 2).

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
3. **Branch:** `kzh6`, mappa: `/ (root)`. Mentés.
4. Pár perc múlva elérhető a fenti URL-en.

## 🖥 Helyi futtatás

Nincs build, statikus oldal. Elég megnyitni az `index.html`-t böngészőben
(vagy `python3 -m http.server` a repó gyökerében, majd `http://localhost:8000`).

## ✍️ Új kérdés hozzáadása

A `questions.js`-ben vegyél fel egy új objektumot a `QUESTIONS` tömbbe:
```js
{ topic: "Swing", type: "single",
  q: "A kérdés szövege?",
  options: ["A", "B", "C"], answer: 1,   // a helyes index
  explain: "Miért ez a jó válasz." }
```
Típusok: `truefalse` (`answer: true/false`), `single` (`options[]`, `answer: index`),
`text` (`answer: [minta1, minta2]` – önértékeléssel).

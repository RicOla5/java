// ===================================================================
//  codeblock.js — könnyű, függőség nélküli Java kód-megjelenítő
//  - megőrzi a sortöréseket (<pre>)
//  - egyszerű Java szintaxiskiemelés (kulcsszavak, típusok, string, szám,
//    komment, annotáció)
//  - "— vagy —" elválasztóval több alternatív megoldást is kezel
// ===================================================================

const JAVA_KEYWORDS = new Set([
  "public","private","protected","class","interface","extends","implements",
  "void","int","long","short","double","float","boolean","char","byte",
  "return","if","else","while","for","do","switch","case","break","continue",
  "new","this","super","static","final","synchronized","throws","throw",
  "try","catch","finally","import","package","abstract","default","volatile",
  "transient","instanceof","null","true","false","enum"
]);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// egy Java kódsor/részlet tokenizálása és kiemelése (HTML-t ad vissza)
function highlightJava(code) {
  let out = "";
  let i = 0;
  const n = code.length;

  while (i < n) {
    const c = code[i];

    // sorkomment //...
    if (c === "/" && code[i + 1] === "/") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      out += `<span class="tok-com">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // blokk-komment /* ... */
    if (c === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(code[j] === "*" && code[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      out += `<span class="tok-com">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // string "..."
    if (c === '"') {
      let j = i + 1;
      while (j < n && code[j] !== '"') { if (code[j] === "\\") j++; j++; }
      j = Math.min(j + 1, n);
      out += `<span class="tok-str">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // karakter '...'
    if (c === "'") {
      let j = i + 1;
      while (j < n && code[j] !== "'") { if (code[j] === "\\") j++; j++; }
      j = Math.min(j + 1, n);
      out += `<span class="tok-str">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // annotáció @Name
    if (c === "@" && /[A-Za-z]/.test(code[i + 1] || "")) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(code[j])) j++;
      out += `<span class="tok-ann">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // szám
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9._xXa-fA-F]/.test(code[j])) j++;
      out += `<span class="tok-num">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    // azonosító / kulcsszó
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (JAVA_KEYWORDS.has(word)) {
        out += `<span class="tok-kw">${escapeHtml(word)}</span>`;
      } else if (/^[A-Z]/.test(word)) {
        // nagybetűvel kezdődő → valószínű típusnév
        out += `<span class="tok-type">${escapeHtml(word)}</span>`;
      } else {
        out += escapeHtml(word);
      }
      i = j;
      continue;
    }
    // egyéb karakter
    out += escapeHtml(c);
    i++;
  }
  return out;
}

// egy KÓD-megoldás(ok) HTML blokkja. answers lehet string vagy string[].
function renderCodeBlock(answers) {
  const list = Array.isArray(answers) ? answers : [answers];
  return list
    .map((code) => `<pre class="code-block"><code>${highlightJava(code)}</code></pre>`)
    .join(`<div class="code-or">— vagy —</div>`);
}

// böngészőben globál, Node alatt export (teszthez)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { highlightJava, renderCodeBlock };
}

# Java Swing labor — Caesar-kódoló

A BME Programozás alapjai 3. Java Swing labor megoldása (1–7. feladat).

## Fájlok

- `Caesar.java` — a Caesar-kódolás/dekódolás logikája, a GUI-tól elkülönítve
  (7. feladat: a felelősségek szétválasztása). `caesarCode(String, char)` és
  `caesarDecode(String, char)`.
- `CaesarFrame.java` — a Swing ablak (`JFrame` leszármazott), a 2–7. feladat.
- `CaesarTest.java` — a kódolás egyszerű tesztje (1. feladat).

## Fordítás és futtatás

```bash
# a java mappából
javac -d out src/caesar/*.java

# teszt (1. feladat)
java -cp out caesar.CaesarTest

# GUI alkalmazás (2–7. feladat)
java -cp out caesar.CaesarFrame
```

## Feladatonként

1. **Caesar-kódolás** — `Caesar.caesarCode(String input, char offset)`. Csak az
   angol ábécé nagybetűivel dolgozik, a kisbetűs bemenetet nagybetűssé alakítja,
   `'Z'` után `'A'` következik. Pl. `'K'` eltolás esetén `A -> K`.
2. **JFrame** — `CaesarFrame` a `JFrame`-ből származik: `EXIT_ON_CLOSE`,
   „SwingLab” cím, 400×110 kezdőméret, a `main` láthatóvá teszi az ablakot.
3. **Elrendezés** — `BorderLayout` + két `JPanel` (`FlowLayout`). Felső panel:
   `JComboBox` (A–Z), 20 karakteres bemeneti `JTextField`, „Code!” `JButton`.
   Alsó panel: „Output:” `JLabel` és a kimeneti `JTextField`. Átméretezhető.
4. **Listener** — `OkButtonActionListener` belső osztály (`ActionListener`): a
   gomb a felső mezőt a kiválasztott eltolással kódolja az alsó mezőbe.
5. **Adapter** — `InputFieldKeyListener` (`KeyAdapter`).
   **Tapasztalt hiba:** a billentyűesemény lefutásakor a `JTextField` modellje
   még nem tartalmazza az épp leütött karaktert, ezért a kódolás egy karakterrel
   lemaradva, a legutóbbi betű nélkül történik. Emiatt ezt az osztályt nem
   regisztráljuk — helyette a 6. feladat megoldása él.
6. **DocumentListener** — `FieldDocumentListener` a bemeneti mező `Document`
   modelljének változására reagál, így a legutóbbi karakter is benne van a
   kódolt szövegben. Ez a helyes, élő megoldás.
7. **Másik irányba kódolás** — az alsó mező szerkeszthető; `FieldFocusListener`
   jegyzi, melyik mezőben dolgoztunk utoljára. A „Code!” gomb a bemeneti mezőt
   kódolja, az kimeneti mezőt pedig `caesarDecode`-dal visszafejti.

# Java Thread labor (BME, A programozás alapjai 3.)

Termelő–fogyasztó (producer–consumer) megoldás szálakkal és konkurens FIFO
pufferrel. A feladatok egymásra épülnek, ezért az osztályok a **kumulatív,
végső** állapotukban szerepelnek, amely mind a 8 feladatot kielégíti.

## Futtatás

Java 21 (vagy újabb) környezet szükséges.

```bash
javac --release 21 -d out src/threadlab/*.java
java -cp out threadlab.Application
```

A program végtelen ciklusban fut (a termelők/fogyasztók soha nem állnak le),
ezért `Ctrl+C`-vel lehet leállítani.

## Osztályok és feladatok

| Osztály | Lefedett feladatok |
|---|---|
| `Producer` | 1. (`go()`, formátum, `sleep`), 2. (önálló szál), 3. (FIFO `put`, `produced ...`), 5. (konfigurálható várakozás), 6. (`Runnable` delegálással) |
| `Fifo` | 3. (max. 10 elem, szálbiztos `put`/`get`, korlátlan várakozás, kivétel továbbadása), 8. (metódusnév + szál azonosító kiírása) |
| `Consumer` | 4. (önálló szál, `get`, `consumed ...`, `n` ms alvás) |
| `Application` | 1./2./4. demók külön metódusokban, 7. (`main`: 3 termelő 1000 ms, 4 fogyasztó 100 ms) |

## Megjegyzések a feladatok tanulságaihoz

- **5. feladat (sebességarányok):** eltérő termelő/fogyasztó sebességeknél a
  `Fifo` korlátlan várakozása (`wait()`) és a kapacitáskorlát biztosítja, hogy
  gyors termelő mellett a puffer ne nőjön korlátlanul, gyors fogyasztó mellett
  pedig a fogyasztó üres puffernél várakozzon – nincs foglalt várakozás.
- **7. feladat (több termelő és fogyasztó):** a klasszikus hiba az `if` +
  `notify()` páros. Itt a várakozás **`while` ciklusban** történik (véd a hamis
  ébredés és a több várakozó szál ellen), és minden tartalomváltozásnál
  **`notifyAll()`** ébreszt, így több termelő/fogyasztó esetén sem alakul ki
  holtpont vagy elveszett ébresztés.

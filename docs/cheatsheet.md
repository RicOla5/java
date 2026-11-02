# 🎯 Java Prog 4. KisZH – CHEATSHEET

> **Minden kérdés + válasz egy helyen.** Gyors átnézéshez vizsga előtt.
> Jelölés: ✅ = igaz/helyes, ❌ = hamis. Részletes magyarázat: lásd `java-szalkezeles-puska.md`.
> *(IMSC feladatok kihagyva.)*

---

## 🔵 SZÁLKEZELÉS – Igaz/Hamis

| # | Állítás | Válasz |
|---|---|---|
| 1 | Nincs olyan várakozó szál, amelyik egyből RUNNABLE lesz a `notifyAll()` hatására | **IGAZ** |
| 2 | Előfordulhat: két szál (T1,T2) sorrendben lép be, (T2,T1) sorrendben lép ki ugyanazon synchronized metódusba | **IGAZ** |
| 3 | Nem fordulhat elő: (T1,T2) belép, (T2,T1) kilép | **HAMIS** |
| 4 | Szálak képesek saját magukat waiting-ből `notify()`-jal felébreszteni | **HAMIS** |
| 5 | Szálak **nem** képesek saját magukat waiting-ből notify-jal felébreszteni | **IGAZ** |
| 6 | `wait()` hívásakor a szálnak **nem kell** az objektum monitorában lennie | **HAMIS** |
| 7 | `wait()` hívásakor a szálnak **az** objektum monitorában **kell** lennie | **IGAZ** |
| 8 | `wait()` csak azon az objektumon hívható, aminek a monitorában a hívó szál van | **IGAZ** |
| 9 | `wait()` csak olyan objektumon hívható, amelyre rászinkronizáltunk | **IGAZ** |
| 10 | `notify()` hívásakor a szálnak **nem kell** a monitorban lennie | **HAMIS** |
| 11 | `notify()` hívásakor a szálnak **a** monitorban **kell** lennie | **IGAZ** |
| 12 | `notifyAll()` hívásakor a szál kilép az objektum monitorából | **HAMIS** |
| 13 | `synchronized` metódusban nem lehet `wait()`-et hívni | **HAMIS** |
| 14 | `synchronized` blokkok nem ágyazhatók egymásba | **HAMIS** |
| 15 | `synchronized` blokkok egymásba ágyazhatók | **IGAZ** |
| 16 | Egy szál egyszerre csak egy objektum monitorában tartózkodhat | **HAMIS** |
| 17 | Egy szál egy időben több objektum monitorában is tartózkodhat | **IGAZ** |
| 18 | `t` szál belépett `x` synchronized `foo`-jába → semmilyen körülmény közt nem futtathatja más szál, amíg `t` vissza nem tér | **HAMIS** |
| 19 | Minden objektumnak van `wait()` metódusa | **IGAZ** |
| 20 | Ha egy szál véget ért, nem lehet újraindítani | **IGAZ** |
| 21 | Szálat a `run()` metódus hívásával indíthatunk | **HAMIS** |
| 22 | Szálat csak `start()`-tal indítani és csak `stop()`-pal leállítani szabad | **HAMIS** |
| 23 | Két szálnál a `join()`-okat csak az indítás sorrendjében szabad hívni | **HAMIS** |
| 24 | Véget ért szálnál a `start()` újrahívása kivételt dob | **IGAZ** |
| 25 | Véget ért szálnál **bármely** metódus hívása kivételt dob | **HAMIS** |

---

## 🔵 SZÁLKEZELÉS – Állapotok

| Kérdés | Válasz |
|---|---|
| `wait()` metódus állapot-sorrendje (hívástól visszatérésig) | **WAITING/TIMED_WAITING → BLOCKED → ---** |
| `notify`/`notifyAll` mely állapotú szálra hat? | **WAITING / TIMED_WAITING** |
| `Thread.currentThread().getState()` visszatérési értéke | **RUNNABLE** |
| `notifyAll()` osztálya (hol van definiálva) | **java.lang.Object** |
| `sleep()` osztálya | **java.lang.Thread** |

**A 6 szálállapot:** NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → RUNNABLE → TERMINATED

**notify vs notifyAll:** `notify()` = egy (véletlen) várakozó szálat ébreszt; `notifyAll()` = az összeset.

---

## 🔵 SZÁLKEZELÉS – Kódfeladatok

**Két szál párhuzamos futtatása + bevárás (start/join javítás):**
```java
m1.start();  m2.start();   // előbb MINDKETTŐT indítjuk
m1.join();   m2.join();    // utána várjuk be
```
❌ Tilos: `run()` hívás, vagy `start–join–start–join`.

**Hibás puffer – mi a hiba?** → A `put()`-ból **hiányzik a `notify()`/`notifyAll()`** (a `get()` örökre várna).

**Runnable nem indul el – mi a hiba?** → A `Runnable`-nek nincs `start()`-ja; Thread kell köré:
```java
Thread th = new Thread(t);  th.start();
```

**Map védelme konkurens hozzáféréstől (sameOwner):** `synchronized (owners) { ... }` (a Map-re!) + `equals()` az összehasonlításra.

---

## 🔵 SZÁLBIZTOS WRAPPER osztályok (delegálás)

> **Közös sablon:** megvalósítja az interfészt, konstruktorban kapja a belső objektumot, minden metódus **delegál** + szinkronizál.

**A) `synchronized` metódus** (this-en) – ha "az adott objektumot egy szál használja, más monitort ne befolyásoljon":
```java
public class ConcurrentStack<T> implements Stack<T> {
    private Stack<T> stack;
    public ConcurrentStack(Stack<T> s) { stack = s; }
    public synchronized void push(T t) { stack.push(t); }
    public synchronized T pop()        { return stack.pop(); }
}
```
Ugyanez: **ConcurrentMorph** (`put(k,v)`/`get(k)`), **ConcurrentBuffer** (`put`/`get`).

**B) `synchronized(belső)` blokk** – ha "több wrapper **ugyanazt a belső** objektumot kapja, a belsőhöz csak egy szál férjen":
```java
public class SynchedBuffer<T> implements Buffer<T> {
    Buffer<T> buff;
    public SynchedBuffer(Buffer<T> b) { buff = b; }
    public void put(T t) { synchronized (buff) { buff.put(t); } }
    public T get()       { synchronized (buff) { return buff.get(); } }
}
```

| Feladat szövege | Megoldás |
|---|---|
| "adott objektumot csak egy szál / más monitort ne" | `synchronized` **metódus** |
| "több wrapper ugyanazt a belső objektumot kapja" | `synchronized(belső)` **blokk** |

---

## 🟢 JUNIT5 – "Mi lesz a teszt eredménye?"

> ZH osztály: `foo(i)→i`, **`bar(i)→ throw Exception`**, `qux(s)→ s+"zh"`.
> 4 kimenetel: **SUCCESS** (assert igaz), **FAILURE** (assert bukik), **ERROR** (kivétel dobódik), **SKIPPED** (assume hamis / @Disabled).

| Teszt sora | Eredmény |
|---|---|
| `assertEquals("xzh", zh.qux("x"))` | **SUCCESS** |
| `assertNotEquals("xzh", zh.qux("x"))` | **FAILURE** |
| `assertSame("xzh", zh.qux("x"))` | **FAILURE** (referencia ≠) |
| `assertEquals(2, zh.foo(1))` | **FAILURE** (1≠2) |
| `assertEquals(1, zh.foo(1))` | **SUCCESS** |
| `assumeTrue(1 == zh.foo(1))` | **SUCCESS** |
| `assumeTrue(2 == zh.foo(1))` | **SKIPPED** |
| `assumeTrue(2 == zh.bar(1))` | **ERROR** (bar dob) |
| `assertEquals(1, zh.bar(1))` | **ERROR** (bar dob) |

**assertEquals double-ra (`assertEquals(a, b, delta)`):** akkor SUCCESS, ha `|a-b| <= delta`.
| a | b | delta | \|a-b\| | Eredmény |
|---|---|---|---|---|
| 3.0 | 3.1 | 0.01 | 0.1 | **FAILURE** (0.1 > 0.01) |
| 3.00 | 3.01 | 0.1 | 0.01 | **SUCCESS** (0.01 ≤ 0.1) |
| 3.00 | 3.01 | 0.1 | 0.01 | **SUCCESS** |

**Emlékeztető:**
- `assertEquals`/`assertNotEquals` → **tartalom** (`equals`)
- `assertSame`/`assertNotSame` → **referencia** (`==`)
- `assertTrue(false)` → FAILURE, de `assumeTrue(false)` → **SKIPPED**
- bármilyen kivétel a tesztben → **ERROR**

---

## 🟢 JUNIT5 – Életciklus (mit ír ki?)

**Sorrend-szabály:**
```
@BeforeAll            (1×, static, legelöl)
  ┌─ minden @BeforeEach   (ŐS előbb, mint leszármazott)
  │  @Test
  └─ minden @AfterEach    ] ← ez ismétlődik MINDEN tesztre
@AfterAll             (1×, static, legvégül)
```
> Ami nincs a kódban (pl. nincs `@AfterAll`), az **nem íródik ki**.
> Ha több `@BeforeEach`/`@AfterEach` van, **mindegyik** lefut.
> Az **ős** `@BeforeEach`-e előbb fut, mint a leszármazotté.

**Annotációk:**
| Annotáció | Mikor |
|---|---|
| `@BeforeAll` | egyszer, legelöl (static) |
| `@BeforeEach` | minden teszt előtt |
| `@Test` | a teszt |
| `@AfterEach` | minden teszt után |
| `@AfterAll` | egyszer, legvégül (static) |

---

## 🟣 LAMBDA / FUNKCIONÁLIS INTERFÉSZEK

| Kérdés | Válasz |
|---|---|
| Default metódust a megvalósító osztály **nem** definiálhatja felül | **HAMIS** (felülírható) |
| A default metódus megvalósításának **nem kell szerepelnie** a megvalósító osztályban | **IGAZ** |
| Lambda **csak egyparaméteres** metódusú függvény-interfész helyén állhat | **HAMIS** |
| Lambda **többparaméteres** metódusú interfész helyén **is** állhat | **IGAZ** |
| Lambdában **csak** a paraméterei objektum-referenciáit érhetjük el | **HAMIS** (lát külső változókat, mezőket is) |
| `Zoo { int foo(x); default int bar(x){...} }` → nem adható meg lambda paraméterként | **IGAZ** *(a megadott válasz; trükkös eset)* |

**Lambda-írás feladatok:**

| Feladat | Megoldás |
|---|---|
| Két ref közül az elsőt, ha nem null, különben a másodikat | `(x, y) -> x != null ? x : y` |
| Két szám közül a nagyobbat | `(a, b) -> a > b ? a : b` |
| Egy szám: nem-negatívnál `a²`, negatívnál `-a²` (előjeltartó négyzet; -2→-4, 3→9) | `a -> a >= 0 ? a*a : -(a*a)` |

> 💡 **Funkcionális interfész** = pontosan **1 absztrakt** metódus (a paraméterszám mindegy). A lambda ennek a helyén áll.

---

## ⚡ VÉSZHELYZETI TOP-LISTA (ha csak 5 percet olvasol)

1. **JUnit eredmény:** assert bukik=FAILURE, kivétel=ERROR, assume hamis=SKIPPED, `bar()`=mindig ERROR.
2. **assertSame=referencia(==), assertEquals=tartalom(equals).**
3. **Életciklus:** BeforeAll → (BeforeEach→Test→AfterEach)× → AfterAll; ős BeforeEach előbb.
4. **start/join:** start, start, join, join (soha run()!).
5. **Wrapper:** `synchronized` metódus = this; `synchronized(belső)` blokk = ha megosztott belső.
6. **notifyAll után a szál előbb BLOCKED, nem egyből RUNNABLE.**
7. **wait/notify csak synchronized-en belül; a szál nem ébreszti fel saját magát.**
8. **wait/notify/notifyAll → Object; sleep/start/join → Thread.**
9. **Lambda = 1 absztrakt metódusú interfész, akárhány paraméterrel.**

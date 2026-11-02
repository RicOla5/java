# 🏆 GIGA-MEGA-ULTIMATE CHEATSHEET — Java Prog 4. KisZH

> **Az ÖSSZES eddig megjelent kérdés + válasz, duplikátumok nélkül.**
> Minden kérdés egyszer szerepel; az azonos kérdések különböző megfogalmazásai/variánsai egy helyen.
> ✅ = Igaz/helyes · ❌ = Hamis · *(IMSC feladatok kihagyva)*

---

# 🧵 I. SZÁLKEZELÉS

## I/A. Igaz–Hamis állítások

### Monitor / wait / notify szabályok
| # | Állítás | Válasz |
|---|---|---|
| 1 | `wait()` hívásakor a szálnak **az** objektum monitorában **kell** lennie | ✅ IGAZ |
| 2 | `wait()` hívásakor a szálnak **nem kell** az objektum monitorában lennie | ❌ HAMIS |
| 3 | `wait()` csak azon az objektumon hívható, aminek a monitorában a hívó szál van | ✅ IGAZ |
| 4 | `wait()` csak olyan objektumon hívható, amelyre rászinkronizáltunk | ✅ IGAZ |
| 5 | Minden objektumnak van `wait()` metódusa | ✅ IGAZ |
| 6 | `notify()` hívásakor a szálnak **a** monitorban **kell** lennie | ✅ IGAZ |
| 7 | `notify()` hívásakor a szálnak **nem kell** a monitorban lennie | ❌ HAMIS |
| 8 | `notifyAll()` hívásakor a szál kilép az objektum monitorából | ❌ HAMIS |
| 9 | `synchronized` metódusban **nem** lehet `wait()`-et hívni | ❌ HAMIS |
| 10 | Szálak **nem** képesek saját magukat waiting-ből `notify()`-jal felébreszteni | ✅ IGAZ |
| 11 | Szálak képesek saját magukat waiting-ből `notify()`-jal felébreszteni | ❌ HAMIS |
| 12 | Nincs olyan várakozó szál, amelyik **egyből RUNNABLE** lesz `notifyAll()`-ra | ✅ IGAZ |

### synchronized / monitor birtoklás
| # | Állítás | Válasz |
|---|---|---|
| 13 | `synchronized` blokkok egymásba ágyazhatók | ✅ IGAZ |
| 14 | `synchronized` blokkok **nem** ágyazhatók egymásba | ❌ HAMIS |
| 15 | Egy szál egy időben **több** objektum monitorában is tartózkodhat | ✅ IGAZ |
| 16 | Egy szál egyszerre **csak egy** objektum monitorában tartózkodhat | ❌ HAMIS |
| 17 | Előfordulhat: két szál (T1,T2) sorrendben lép **be**, (T2,T1) sorrendben lép **ki** ugyanazon synchronized metódusba | ✅ IGAZ |
| 18 | **Nem** fordulhat elő a fenti (T1,T2) be / (T2,T1) ki eset | ❌ HAMIS |
| 19 | `t` belépett `x` synchronized `foo`-jába → semmilyen körülmény közt nem futtathatja más szál, amíg `t` vissza nem tér | ❌ HAMIS *(wait() elengedi a lockot)* |

### Szál életciklus / indítás
| # | Állítás | Válasz |
|---|---|---|
| 20 | Ha egy szál véget ért, nem lehet újraindítani | ✅ IGAZ |
| 21 | Véget ért szálnál a `start()` újrahívása kivételt dob | ✅ IGAZ |
| 22 | Véget ért szálnál **bármely** metódus hívása kivételt dob | ❌ HAMIS *(csak a start())* |
| 23 | Szálat a `run()` metódus hívásával indíthatunk | ❌ HAMIS *(start() kell)* |
| 24 | Szálat csak `start()`-tal indítani és csak `stop()`-pal leállítani szabad | ❌ HAMIS *(stop() tiltott)* |
| 25 | Két szálnál a `join()`-okat csak az indítás sorrendjében szabad hívni | ❌ HAMIS |

## I/B. Szálállapotok (Thread.State)

**A 6 állapot:** `NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → RUNNABLE → TERMINATED`

| Kérdés | Válasz |
|---|---|
| `wait()` metódus állapot-sorrendje (hívástól visszatérésig, 3 mező) | **WAITING/TIMED_WAITING → BLOCKED → ---** |
| Mely állapotú szálra hat a `notify` / `notifyAll`? | **WAITING / TIMED_WAITING** |
| `Thread.currentThread().getState()` visszatérési értéke | **RUNNABLE** |

> Felébredés után a szál **előbb BLOCKED** (vissza kell szereznie a lockot), nem egyből RUNNABLE.

## I/C. Osztályhierarchia – hol van definiálva?

| Metódus | Osztály |
|---|---|
| `wait()`, `notify()`, `notifyAll()` | **java.lang.Object** |
| `sleep()`, `start()`, `join()`, `run()`, `interrupt()`, `getState()`, `currentThread()` | **java.lang.Thread** |

> ⚠️ Ha teljes nevet kérnek: pontos írásmód, kis/nagybetű számít! (`java.lang.Object`)

## I/D. notify vs notifyAll (szöveges)

- **`notify()`**: egyetlen (nem determinisztikus, hogy melyik) várakozó szálat ébreszt; a többi vár tovább. Akkor jó, ha mindegy, melyik indul.
- **`notifyAll()`**: minden várakozó szálat értesít.
- **Mely állapotra hatnak:** WAITING (/ TIMED_WAITING).

## I/E. Kódfeladatok

**1) Két szál párhuzamos futtatása + bevárás (javítás):**
```java
m1.start();  m2.start();   // ELŐBB mindkettőt indítjuk
m1.join();   m2.join();    // UTÁNA várjuk be
```
❌ Tilos: `run()` hívás start helyett; ❌ `start–join–start–join` (az nem párhuzamos).

**2) Hibás szálbiztos puffer – mi a hiba?**
→ A `put()`-ból **hiányzik a `notify()` / `notifyAll()`** → a `get()` örökre `wait()`-ben ragad.

**3) Runnable program – mi a hiba?**
→ A `Runnable`-nek **nincs `start()`-ja**; Thread kell köré:
```java
Thread th = new Thread(t);  th.start();
```

**4) Map védelme konkurens hozzáféréstől (`sameOwner`):**
```java
public int sameOwner(String plate, Map<String, Person> owners) {
    int n = 0;
    Person p = owners.get(plate);
    synchronized (owners) {                       // a MAP-re szinkronizálunk!
        for (String s : owners.keySet())
            if (owners.get(s).equals(p)) n++;     // equals(), nem ==
    }
    return n;
}
```

## I/F. Szálbiztos wrapper osztályok (delegálás)

> **Közös sablon:** implementálja az interfészt · konstruktorban kapja a belső objektumot · minden metódus **delegál** + szinkronizál.

**A) `synchronized` metódus (this-en)** — "az adott objektumot egy szál használja, más monitort ne befolyásoljon":
```java
public class ConcurrentStack<T> implements Stack<T> {
    private Stack<T> stack;
    public ConcurrentStack(Stack<T> s) { stack = s; }
    public synchronized void push(T t) { stack.push(t); }
    public synchronized T pop()        { return stack.pop(); }
}
```
Ugyanez a minta: **ConcurrentMorph** (`put(k,v)`/`get(k)`), **ConcurrentBuffer** (`put`/`get`).

**B) `synchronized(belső)` blokk** — "több wrapper **ugyanazt a belső** objektumot kapja, a belsőhöz csak egy szál férjen":
```java
public class SynchedBuffer<T> implements Buffer<T> {
    Buffer<T> buff;
    public SynchedBuffer(Buffer<T> b) { buff = b; }
    public void put(T t) { synchronized (buff) { buff.put(t); } }
    public T get()       { synchronized (buff) { return buff.get(); } }
}
```

| Feladat szövege | Melyik kell |
|---|---|
| "adott objektumot egy szál / más monitort ne" | `synchronized` **metódus** |
| "több wrapper ugyanazt a belső objektumot kapja" | `synchronized(belső)` **blokk** |

---

# 🧪 II. JUNIT5 TESZTELÉS

## II/A. "Mi lesz a teszt eredménye?"

> ZH osztály: `foo(i)→i` · **`bar(i)→ throw new Exception()`** · `qux(s)→ s+"zh"` (pl. `qux("x")="xzh"`).
> **Kimenetelek:** SUCCESS (assert igaz) · FAILURE (assert bukik) · ERROR (kivétel dobódik) · **ABORTED** (assume hamis — JUnit5) / SKIPPED (@Disabled).
>
> ⚠️ **JUnit4 → JUnit5:** az `assumeTrue(false)` JUnit4-ben IGNORE/SKIPPED volt, **JUnit5-ben ABORTED**. (Ezek a táblázat eredményei valódi JUnit5-tel ellenőrizve.)

| Teszt sora | Eredmény |
|---|---|
| `assertEquals("xzh", zh.qux("x"))` | **SUCCESS** |
| `assertNotEquals("xzh", zh.qux("x"))` | **FAILURE** |
| `assertSame("xzh", zh.qux("x"))` | **FAILURE** *(referencia ≠)* |
| `assertEquals(2, zh.foo(1))` | **FAILURE** *(1 ≠ 2)* |
| `assertEquals(1, zh.foo(1))` | **SUCCESS** |
| `assumeTrue(1 == zh.foo(1))` | **SUCCESS** |
| `assumeTrue(2 == zh.foo(1))` | **ABORTED** *(JUnit4: SKIPPED)* |
| `assumeTrue(2 == zh.bar(1))` | **ERROR** *(bar dob)* |
| `assertEquals(1, zh.bar(1))` | **ERROR** *(bar dob)* |

**double hasonlítás — `assertEquals(a, b, delta)`:** SUCCESS, ha `|a - b| <= delta`.
| a | b | delta | \|a−b\| | Eredmény |
|---|---|---|---|---|
| 3.0 | 3.1 | 0.01 | 0.1 | **FAILURE** |
| 3.00 | 3.01 | 0.1 | 0.01 | **SUCCESS** |

**Szabályok:**
- `assertEquals`/`assertNotEquals` → **tartalom** (`equals`)
- `assertSame`/`assertNotSame` → **referencia** (`==`)
- `assertTrue(false)` → FAILURE **DE** `assumeTrue(false)` → **ABORTED** (JUnit5) / SKIPPED (JUnit4)
- bármilyen **kivétel** a tesztben → **ERROR**
- **JUnit5 assume-ok:** `org.junit.jupiter.api.Assumptions` (az assertek: `Assertions`)
- `assertEquals(exp, act, delta)` — a 3. param a **delta** (nem üzenet); üzenet JUnit5-ben hátul

## II/B. Életciklus — "mit ír ki?"

```
@BeforeAll                     (1×, static, legelöl)
  ┌─ minden @BeforeEach        (ŐS előbb, mint leszármazott)
  │  @Test
  └─ minden @AfterEach         ] ← ismétlődik MINDEN tesztre
@AfterAll                      (1×, static, legvégül)
```
| Annotáció | Mikor | Hányszor |
|---|---|---|
| `@BeforeAll` | legelöl | 1× (static) |
| `@BeforeEach` | minden teszt előtt | tesztenként |
| `@Test` | a teszt | tesztenként |
| `@AfterEach` | minden teszt után | tesztenként |
| `@AfterAll` | legvégül | 1× (static) |

> • Ami nincs a kódban, az **nem íródik ki**.
> • Ha több `@BeforeEach`/`@AfterEach` van, **mindegyik** lefut.
> • Az **ős** `@BeforeEach`-e **előbb** fut, mint a leszármazotté.

---

# λ III. LAMBDA / FUNKCIONÁLIS INTERFÉSZEK

## III/A. Igaz–Hamis

| Állítás | Válasz |
|---|---|
| A default metódust a megvalósító osztály **nem** definiálhatja felül | ❌ HAMIS *(felülírható)* |
| A default metódus megvalósításának **nem kell szerepelnie** a megvalósító osztályban | ✅ IGAZ |
| Lambda **csak egyparaméteres** metódusú függvény-interfész helyén állhat | ❌ HAMIS |
| Lambda **többparaméteres** metódusú interfész helyén **is** állhat | ✅ IGAZ |
| Lambdában **csak** a paraméterei objektum-referenciáit érhetjük el | ❌ HAMIS *(külső final változókat, mezőket is lát)* |
| `Zoo { int foo(x); default int bar(x){2*foo(x)} }` → metódushívásnál **nem adható meg** lambda e paraméter helyén | ✅ IGAZ *(a megadott válasz; trükkös eset)* |

> **Funkcionális interfész** = pontosan **1 absztrakt** metódus (a paraméterszám mindegy). A lambda ennek a helyén áll.

## III/B. Lambda-írás feladatok

| Feladat | Megoldás |
|---|---|
| Két ref: az elsőt ha nem null, különben a másodikat | `(x, y) -> x != null ? x : y` |
| Két szám közül a nagyobbat | `(a, b) -> a > b ? a : b` |
| Egy szám: nem-negatívnál `a²`, negatívnál `−a²` (−2→−4, 3→9) | `a -> a >= 0 ? a*a : -(a*a)` |

---

# ⚡ VÉSZHELYZETI TOP-LISTA (5 perces átnézés)

1. **JUnit eredmény:** assert bukik = FAILURE · kivétel = ERROR · assume hamis = SKIPPED · **`bar()` mindig ERROR**.
2. **assertSame = referencia (==)** · **assertEquals = tartalom (equals)**.
3. **Életciklus:** BeforeAll → (BeforeEach → Test → AfterEach)× → AfterAll; **ős BeforeEach előbb**; ami nincs, nem íródik ki.
4. **start/join:** `start, start, join, join` (soha `run()`!).
5. **Wrapper:** `synchronized` metódus = this · `synchronized(belső)` blokk = ha megosztott belső.
6. **notifyAll után a szál előbb BLOCKED**, nem egyből RUNNABLE.
7. **wait/notify csak synchronized-en belül**; a szál **nem** ébreszti fel saját magát.
8. **wait/notify/notifyAll → Object** · **sleep/start/join → Thread**.
9. **Lambda = 1 absztrakt metódusú interfész**, akárhány paraméterrel; lát külső final változókat is.
10. **wait() állapotsor:** WAITING/TIMED_WAITING → BLOCKED → ---.

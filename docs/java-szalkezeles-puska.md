# Java Prog 4. KisZH – Puska

> Összegyűjtött és témakör szerint csoportosított kérdések a 4. KisZH-ból és a hozzá tartozó anyagból.
> Minden kérdésnél: **helyes válasz** + rövid magyarázat.
> Fő témák: **szálkezelés**, **JUnit5 tesztelés**, **lambda / funkcionális interfészek**.

---

## 📑 Tartalom

1. [Szál állapotok (Thread States)](#1-szál-állapotok-thread-states)
2. [wait() / notify() / notifyAll()](#2-wait--notify--notifyall)
3. [synchronized és monitor](#3-synchronized-és-monitor)
4. [Szálak indítása és bevárása (start/join)](#4-szálak-indítása-és-bevárása-startjoin)
5. [Szálbiztos wrapper osztályok (delegálás)](#5-szálbiztos-wrapper-osztályok-delegálás)
6. [Igaz-Hamis gyorstár (szálkezelés)](#6-igaz-hamis-gyorstár-szálkezelés)
7. [JUnit5 tesztelés](#7-junit5-tesztelés)
8. [Lambda és funkcionális interfészek](#8-lambda-és-funkcionális-interfészek)
9. [Egyéb kódos feladatok](#9-egyéb-kódos-feladatok)

---

## 1. Szál állapotok (Thread States)

### 🔑 A Java 6 szál-állapot (Thread.State enum)

| Állapot | Mikor van benne a szál |
|---|---|
| **NEW** | Létrehozva (`new Thread()`), de még nem hívták a `start()`-ot |
| **RUNNABLE** | Fut, vagy futásra kész (ütemezőre vár) |
| **BLOCKED** | `synchronized` blokk/metódus monitorára (lock) vár |
| **WAITING** | `wait()`, `join()`, `park()` – határidő nélkül vár |
| **TIMED_WAITING** | `sleep(t)`, `wait(t)`, `join(t)` – határidővel vár |
| **TERMINATED** | A `run()` befejeződött, a szál leállt |

---

### ❓ Kérdés: wait() közbeni állapotátmenetek (3. kérdés)

> *Egy szál egy objektum `wait()` metódusát készül végrehajtani hiba és exception nélkül. A metódus rendben visszatér. Sorrendben milyen állapotokat vesz fel a szál a `wait` meghívásától kezdve a metódus visszatéréséig?*

**Helyes válasz (sorrendben):**

1. **WAITING / TIMED_WAITING** – a `wait()` felfüggeszti a szálat, elengedi a lockot és várakozik
2. **BLOCKED** – `notify()`/`notifyAll()` után felébred, de vissza kell szereznie a monitort (lockot) → addig blokkol
3. **---** *(kitöltő, mert csak 2 valódi állapot van)*

> 💡 **Lényeg:** `wait()` → elengedi a lockot és WAITING-be megy → felébredéskor NEM azonnal fut, hanem **BLOCKED** (vissza kell szereznie a lockot) → majd visszatér.

---

### ❓ Kérdés: a futó szál saját állapota

> *Milyen állapottal tér vissza az alábbi kifejezés?*
> ```java
> Thread.currentThread().getState()
> ```

**Helyes válasz: RUNNABLE**

> 💡 Ha egy szál éppen ezt a kódsort **futtatja**, akkor értelemszerűen fut → **RUNNABLE**. (Egy szál sosem látja saját magát WAITING/BLOCKED állapotban, hiszen akkor épp nem futna.)

---

### ❓ Kérdés: notify/notifyAll mely állapotra hat? (Péntek, 3. kérdés)

> *Milyen állapotban van az a szál, amelyikre a `notify` és `notifyAll` metódusok hatással lehetnek?*

**Helyes válasz:** **WAITING / TIMED_WAITING**

> 💡 Csak a `wait()`-tel várakozó (WAITING/TIMED_WAITING) szálakat lehet felébreszteni. A BLOCKED, NEW, RUNNABLE, TERMINATED állapotúakra nincs hatásuk.

---

## 2. wait() / notify() / notifyAll()

### ❓ notifyAll() és a RUNNABLE állapot (Kedd, 1. kérdés)

> *Nincs olyan várakozó szál, amelyik egyből RUNNABLE állapotú lesz a `notifyAll()` hatására.*

**Helyes válasz: IGAZ** ✅

> 💡 A felébresztett szál először **BLOCKED** lesz (vissza kell szereznie a monitort), nem közvetlenül RUNNABLE. Tehát egyből RUNNABLE sosem lesz belőle.

---

### ❓ Szál saját magát felébreszti? (Péntek, 1. kérdés)

> *Szálak képesek saját magukat közvetlenül `waiting` állapotból `notify()` metódushívással felébreszteni.*

**Helyes válasz: HAMIS** ❌

> 💡 Ha egy szál `wait()`-ben van (WAITING), akkor **blokkolva van, nem fut** → nem tud kódot végrehajtani → nem tudja saját magát felébreszteni. Egy másik szálnak kell meghívnia a `notify()`-t.

---

### ❓ wait() és a monitor birtoklása (Péntek, 2. kérdés)

> *Egy objektum `wait()` metódusának meghívásakor a végrehajtó szálnak nem kell az objektum monitorában tartózkodnia.*

**Helyes válasz: HAMIS** ❌

> 💡 **Fontos szabály:** `wait()`, `notify()`, `notifyAll()` CSAK akkor hívható, ha a szál birtokolja az adott objektum monitorát (azaz `synchronized` blokkon/metóduson belül van). Különben `IllegalMonitorStateException`.

---

## 3. synchronized és monitor

### ❓ Belépési és kilépési sorrend (Kedd, 2. kérdés)

> *Előfordulhat, hogy két szál (T1 és T2) ugyanazon objektum ugyanazon `synchronized` metódusát futtatva (T1, T2) sorrendben lép be, de (T2, T1) sorrendben lép ki.*

**Helyes válasz: IGAZ** ✅

> 💡 Ha a metóduson belül `wait()` van, a belépési sorrend és a kilépési sorrend eltérhet. T1 beléphet előbb, `wait()`-re mehet (elengedi a lockot), T2 belép, végez és kilép, majd T1 felébred és utána lép ki. A `synchronized` csak a **kölcsönös kizárást** garantálja, a sorrendet NEM.

---

## 4. Szálak indítása és bevárása (start/join)

### ❓ Kódjavítás: két szál párhuzamos futtatása (4. kérdés)

> *Cél: két szál párhuzamos futtatása és az eredmény megvárása. Lefordul, de nem az elvárt módon működik. Javítsa ki!*
> *A `MyThread` osztály a `Thread` osztály leszármazottja.*

**Hibás kód:**
```java
Thread m1 = new MyThread();
Thread m2 = new MyThread();
m1.start();
m2.start();
m1.join();
m2.join();
// END
```

> ⚠️ **Figyelem:** a feladat szerint a fenti kód tűnik helyesnek is. A *gyakori hiba*, amit javítani kell, az a `run()` közvetlen hívása `start()` helyett, VAGY a `join()` sorrend. 
>
> **A helyes, párhuzamos + bevárós minta:**
> - **MINDKÉT** szálat ELŐSZÖR el kell indítani `start()`-tal (nem `run()`!),
> - és CSAK UTÁNA jöhet a `join()`.

**Helyes kód (ez a párhuzamos működés garanciája):**
```java
Thread m1 = new MyThread();
Thread m2 = new MyThread();
m1.start();   // elindítja az 1. szálat
m2.start();   // elindítja a 2. szálat (most már párhuzamosan futnak)
m1.join();    // megvárja az 1. szál végét
m2.join();    // megvárja a 2. szál végét
// END
```

> 💡 **Tipikus hibák, amiket NEM szabad:**
> - `m1.run(); m2.run();` → NEM párhuzamos, ugyanazon a szálon fut sorban!
> - `m1.start(); m1.join(); m2.start(); m2.join();` → NEM párhuzamos, mert m2 csak m1 után indul!
> - A helyes minta: **start, start, join, join**.

---

## 5. Szálbiztos wrapper osztályok (delegálás)

> **Minta:** Adott egy interfész (`Stack<T>`, `Buffer<T>`), amelynek implementációi nem szálbiztosak. Írj egy generikus wrapper osztályt, amely:
> - megvalósítja az interfészt,
> - a konstruktora egy sablon-paraméterezett objektumot kap,
> - a metódusok **delegálják** a hívást a kapott objektumnak,
> - a hívások **szálbiztosak** (synchronized).

### 📌 Két változat a szinkronizációra – FIGYELJ A KÜLÖNBSÉGRE!

#### A) `synchronized` metódus → az `this` (wrapper) monitorán szinkronizál

> Feladat: *"ezen metódusait egyidejűleg csak egy szálból lehessen végrehajtani, és ez semmilyen másik objektum monitorát ne befolyásolja."*
> → Ide a **`synchronized` metódus** kell (a `this`-en szinkronizál).

```java
public class ConcurrentStack<T> implements Stack<T> {
    private Stack<T> stack;

    public ConcurrentStack(Stack<T> s) {
        stack = s;
    }

    public synchronized void push(T t) {
        stack.push(t);
    }

    public synchronized T pop() {
        return stack.pop();
    }
}
```

> 💡 A `synchronized` metódus a **`this`** (a ConcurrentStack példány) monitorán szinkronizál → nem befolyásol más objektumot.

---

#### A2) Kulcs-érték változat: `ConcurrentMorph` (put(k,v) / get(k))

> Ugyanaz az A) minta, csak egy `Morph<K,V>` interfészre (kulcs-érték, `put(k,v)` és `get(k)`).
> Megfogalmazás: *"az adott ConcurrentMorph objektumot egyidejűleg csak egy szálból, más monitort ne befolyásoljon"* → `synchronized` **metódus**.

```java
public class ConcurrentMorph<K, V> implements Morph<K, V> {
    private Morph<K, V> morph;

    public ConcurrentMorph(Morph<K, V> m) { morph = m; }

    public synchronized void put(K k, V v) { morph.put(k, v); }
    public synchronized V get(K k)         { return morph.get(k); }
}
```
> 💡 Teljesen az A) minta (Stack) analógiája, csak a metódusok szignatúrája más. A lényeg ugyanaz: **`synchronized` metódus** (this-en), minden metódus **delegál** a belső objektumnak.

---

#### B) `synchronized(buff)` blokk → a BELSŐ objektum monitorán szinkronizál

> Feladat: *"szálbiztos módon implementálja úgy, hogy ha több SynchedBuffer ugyanazt a b objektumot kapta a konstruktorában, akkor is teljesülj, hogy a b-hez egyszerre csak egy szál férhet hozzá."*
> → Ide a **`synchronized(buff)` blokk** kell (a BELSŐ objektumon szinkronizál)!

```java
public class SynchedBuffer<T> implements Buffer<T> {
    Buffer<T> buff;

    public SynchedBuffer(Buffer<T> b) {
        buff = b;
    }

    public void put(T t) {
        synchronized (buff) {
            buff.put(t);
        }
    }

    public T get() {
        synchronized (buff) {
            return buff.get();
        }
    }
}
```

> 💡 **Ez a kulcskülönbség:** ha több wrapper OSZTOZIK ugyanazon a belső objektumon, és biztosítani kell, hogy a belsőhöz egyszerre csak egy szál férjen, akkor a **belső objektum monitorán** kell szinkronizálni → `synchronized(buff)` blokk, NEM `synchronized` metódus.

---

### 🧭 Döntési szabály: melyik szinkronizáció kell?

| Feladat megfogalmazása | Megoldás |
|---|---|
| "csak egy szálból, más objektum monitorát ne befolyásolja" | `synchronized` **metódus** (this-en) |
| "ha több wrapper ugyanazt a belső objektumot kapja, a belsőhöz csak egy szál férjen" | `synchronized(belsőObjektum)` **blokk** |

---

## ✅ Gyors összefoglaló (TL;DR)

- **Állapotok sorrendje:** NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → RUNNABLE → TERMINATED
- **`wait()` után felébredve** a szál **BLOCKED** (vissza kell szereznie a lockot), nem egyből RUNNABLE.
- **`wait/notify/notifyAll`** csak `synchronized` blokkon belül hívható (különben exception), és csak **WAITING/TIMED_WAITING** szálakra hatnak.
- **Szál nem ébreszti fel saját magát** (hiszen `wait`-ben nem fut).
- **Párhuzamos futtatás + bevárás:** `start, start, join, join` (soha nem `run()`, soha nem `start–join–start–join`).
- **Wrapper szinkronizáció:** `synchronized` metódus = this-en; `synchronized(belső)` blokk = ha a belső megosztott erőforrást kell védeni.

---

## 6. Igaz-Hamis gyorstár (szálkezelés)

> A leggyakoribb igaz-hamis állítások egy helyen. **I = Igaz, H = Hamis.**
> Tipp: sok állítás párban van (ugyanaz tagadva), figyelj a "nem"-ekre!

### 🔒 synchronized / monitor

| Állítás | Válasz |
|---|---|
| `wait()` csak azon az objektumon hívható, aminek a monitorában a hívó szál tartózkodik | **I** |
| Egy objektum `wait()`-jének hívásakor a szálnak **az** objektum monitorában **kell** lennie | **I** |
| Egy objektum `wait()`-jének hívásakor a szálnak **nem kell** a monitorban lennie | **H** |
| `wait()` csak olyan objektumon hívható, amelyre rászinkronizáltunk | **I** |
| Egy objektum `notify()`-jának hívásakor a szálnak **a** monitorban **kell** lennie | **I** |
| Egy objektum `notify()`-jának hívásakor a szálnak **nem kell** a monitorban lennie | **H** |
| `synchronized` metódusban **nem** lehet `wait()`-et hívni | **H** *(DE IGEN, lehet!)* |
| `synchronized` blokkok **nem** ágyazhatók egymásba | **H** |
| `synchronized` blokkok egymásba ágyazhatók | **I** |
| Egy szál **egyszerre csak egy** objektum monitorában tartózkodhat | **H** |
| Egy szál **egy időben több** objektum monitorában is tartózkodhat | **I** *(pl. egymásba ágyazott synchronized)* |

### 🔄 belépés / kilépés sorrend

| Állítás | Válasz |
|---|---|
| **Nem** fordulhat elő: (T1,T2) sorrendben lép be, (T2,T1) sorrendben lép ki ugyanazon synchronized metódusba | **H** |
| **Előfordulhat**: (T1,T2) belép, (T2,T1) kilép | **I** |
| `t` szál belépett `x` synchronized `foo`-jába → **semmilyen** körülmény közt nem futtathatja más szál, amíg `t` vissza nem tér | **H** *(mert `wait()` elengedi a lockot!)* |

### 📢 notify / notifyAll / wait

| Állítás | Válasz |
|---|---|
| Egy objektum `notifyAll()`-jának hívásakor a szál **kilép** az objektum monitorából | **H** *(csak a blokk végén / wait-nél lép ki)* |
| Szálak **nem** képesek saját magukat waiting-ből `notify`-jal felébreszteni | **I** |
| Minden objektumnak van `wait()` metódusa | **I** *(az Object-ben van)* |
| Nincs olyan várakozó szál, amelyik **egyből RUNNABLE** lesz `notifyAll()` hatására | **I** *(előbb BLOCKED!)* |
| A `notify`/`notifyAll` által érintett szál állapota: **WAITING** | ✔ |

### ▶️ start / join / életciklus

| Állítás | Válasz |
|---|---|
| Ha egy szál véget ért, **nem** lehet újraindítani | **I** |
| Szálat a `run()` metódus hívásával indíthatunk | **H** *(start() kell!)* |
| Egy szálat csak `start()`-tal szabad indítani és csak `stop()`-pal leállítani | **H** *(stop() elavult/tiltott!)* |
| Ha két szálunk van, a `join()`-okat csak az indítás sorrendjében szabad hívni | **H** *(bármilyen sorrendben lehet)* |
| Véget ért szálnál a `start()` újrahívása **kivételt** dob | **I** *(IllegalThreadStateException)* |
| Véget ért szálnál **bármely** metódus hívása kivételt dob | **H** *(csak a start() az)* |

---

## 7. JUnit5 tesztelés

### 🔑 A teszt-eredmény 4 lehetséges kimenetele

| Eredmény | Mikor |
|---|---|
| **SUCCESS** | Az assert igaz → a teszt lefut hiba nélkül |
| **FAILURE** | Egy `assert...` nem teljesül (pl. `assertEquals` eltérés) |
| **ERROR** | Nem várt **exception** dobódik a tesztben (nem assertből) |
| **SKIPPED** | A tesztet kihagyták (pl. `@Disabled`, feltétel) |

> 💡 **FAILURE vs ERROR:** assert bukás = FAILURE; bármilyen más exception (pl. kézzel dobott) = ERROR.

---

### 🔑 assertEquals double-okra: a `delta`

```java
assertEquals(a, b, delta);  // |a - b| <= delta esetén OK
```

#### ❓ 1. kérdés: a=3.0, b=3.1, delta=0.01 → **FAILURE** ❌→✅(ez a helyes válasz)

```java
double a = 3.0, b = 3.1, delta = 0.01;
assertEquals(a, b, delta);
```
> `|3.0 - 3.1| = 0.1`, ami **nagyobb**, mint `0.01` → az assert megbukik → **FAILURE**.

#### ❓ 3. kérdés: a=3.00, b=3.01, delta=0.1 → **SUCCESS** ✅

```java
double a = 3.00, b = 3.01, delta = 0.1;
assertEquals(a, b, delta);
```
> `|3.00 - 3.01| = 0.01`, ami **kisebb**, mint `0.1` → az assert teljesül → **SUCCESS**.

> 💡 **Lényeg:** hasonlítsd össze `|a-b|`-t a `delta`-val. Ha `|a-b| <= delta` → SUCCESS, különben FAILURE.

---

### 🔑 assertSame vs assertEquals

#### ❓ 2. kérdés: `assertSame("xzh", zh.qux("x"))` → **FAILURE** ❌

```java
public String qux(String s) { return s + "zh"; }   // "x" + "zh" = "xzh"
...
assertSame("xzh", zh.qux("x"));
```
> `qux("x")` új String objektumot hoz létre (`"x"+"zh"`) → tartalma `"xzh"`, de **más objektum**, mint a literál.
> `assertSame` **referencia-azonosságot** (`==`) vizsgál, nem tartalmat → **FAILURE**.
>
> ⚠️ Ha `assertEquals` lenne (tartalom-egyezés), akkor SUCCESS lenne!

---

### 🔑 Exception a tesztben → ERROR

#### ❓ 4. kérdés: `assertEquals(2, zh.foo(1))` ahol foo(1) kivételt... nem, de más példa → **FAILURE**

```java
public int foo(int i) { return i; }   // foo(1) == 1
...
assertEquals(2, zh.foo(1));           // 2 != 1
```
> `foo(1)` értéke `1`, nem `2` → az assert megbukik → **FAILURE**.

> 💡 Ha a tesztelt metódus **exception**-t dobna (pl. `bar()` ami `throw new Exception()`), akkor az eredmény **ERROR** lenne, nem FAILURE.

---

### 🔑 assumeTrue – feltételes teszt (assume ≠ assert!)

> Az `assumeTrue(feltétel)` **NEM** FAILURE-t okoz, ha hamis, hanem **SKIPPED**-et!
> Az `assume...` azt fejezi ki: "csak akkor van értelme futtatni, ha a feltétel igaz".

| Kódrészlet (ZH osztály: `foo(1)` == 1) | Eredmény |
|---|---|
| `assumeTrue(2 == zh.foo(1));` → `2 == 1` **hamis** | **SKIPPED** *(nem FAILURE!)* |
| `assumeTrue(1 == zh.foo(1));` → `1 == 1` **igaz** | **SUCCESS** |

> 💡 **A nagy csapda:** `assertTrue(false)` → FAILURE, de `assumeTrue(false)` → **SKIPPED**. Könnyű összekeverni!

> ⚠️ **DE a `bar()` kivételt dob!** (`public int bar(int i) { throw new Exception(); }`)
> Ha az assert/assume **argumentuma `bar(...)`-t hív**, akkor a kivétel már a kiértékeléskor kirobban, mielőtt az assert/assume logikája számítana → mindig **ERROR**:
>
> | Kódrészlet | Miért | Eredmény |
> |---|---|---|
> | `assumeTrue(2 == zh.bar(1));` | `bar(1)` kivételt dob | **ERROR** |
> | `assertEquals(1, zh.bar(1));` | `bar(1)` kivételt dob | **ERROR** |
>
> 💡 **Lényeg:** nem az számít, mit *mondana* az assert – ha a kiértékelés közben **exception** dobódik, az eredmény **ERROR** (nem FAILURE, nem SKIPPED).

---

### 🔑 assertEquals / assertNotEquals / assertSame áttekintés

> A `ZH.qux("x")` eredménye `"x"+"zh"` = `"xzh"` (új objektum, tartalma `"xzh"`).

| Kódrészlet | Logika | Eredmény |
|---|---|---|
| `assertEquals("xzh", zh.qux("x"))` | tartalom egyezik (`"xzh".equals("xzh")`) | **SUCCESS** |
| `assertNotEquals("xzh", zh.qux("x"))` | tartalom **egyezik**, de ≠-t várt | **FAILURE** |
| `assertSame("xzh", zh.qux("x"))` | **referencia** (`==`) nem egyezik | **FAILURE** |

> 💡 **Emlékeztető:**
> - `assertEquals` / `assertNotEquals` → **tartalmat** vizsgál (`equals`).
> - `assertSame` / `assertNotSame` → **referenciát** vizsgál (`==`).
> - Ha a metódus `new`-val/konkatenációval új objektumot ad → `assertSame` bukik, `assertEquals` átmegy.

---

### 🔑 JUnit5 életciklus-annotációk (futási sorrend!)

| Annotáció | Mikor fut | Hányszor |
|---|---|---|
| `@BeforeAll` | **A legelső**, minden teszt előtt | 1x (static) |
| `@BeforeEach` | Minden egyes teszt **előtt** | tesztenként |
| `@Test` | Maga a teszt | tesztenként |
| `@AfterEach` | Minden egyes teszt **után** | tesztenként |
| `@AfterAll` | **A legutolsó**, minden teszt után | 1x (static) |

#### ❓ 5. kérdés: öröklődő teszt osztály futási sorrendje

```java
public class Teszt {
    @BeforeEach public void nana() { ... "TBE" }
}
public class TesztMitirki extends Teszt {
    @BeforeEach public void valami2() { ... "BeforeEach" }
    @Test public void test1() { ... "Test" }
    @Test public void test2() { ... "Test" }
    @AfterEach public void mieritt() { ... "AfterEach" }
    @BeforeAll static public void napkelte() { ... "BeforeAll" }
}
```

**Helyes kiírási sorrend:**
```
BeforeAll          ← egyszer, legelöl (static)
TBE                ← öröklött @BeforeEach (ős)  }  1. teszt
BeforeEach         ← saját @BeforeEach           }
Test               ← test1()                     }
AfterEach          ← @AfterEach                  }
TBE                ← öröklött @BeforeEach (ős)  }  2. teszt
BeforeEach         ← saját @BeforeEach           }
Test               ← test2()                     }
AfterEach          ← @AfterEach                  }
```
> 💡 **Lényeg:**
> - `@BeforeAll` **egyszer** fut legelöl.
> - Minden teszt körül: **minden** `@BeforeEach` (öröklött is!) → `@Test` → `@AfterEach`.
> - Az **ős `@BeforeEach`** az **előbb** fut, mint a leszármazotté.
> - Itt nincs `@AfterAll`, ezért az nem íródik ki.

#### ❓ 5. kérdés – 2. variáns: TÖBB @AfterEach, @BeforeAll az ősön kívül

```java
public class Teszt {
    @BeforeEach public void nana() { ... "TBE" }
}
public class TesztMitirki extends Teszt {
    @AfterEach  public void valami1() { ... "AfterEach" }
    @AfterEach  public void valami2() { ... "AfterEach" }
    @Test       public void test1()   { ... "Test" }
    @Test       public void test2()   { ... "Test" }
    @BeforeAll static public void party() { ... "BeforeAll" }
}
```

**Helyes kiírási sorrend:**
```
BeforeAll          ← egyszer, legelöl
TBE                ← öröklött @BeforeEach        }
Test               ← test1()                     }  1. teszt
AfterEach          ← valami1()                   }
AfterEach          ← valami2()                   }
TBE                ← öröklött @BeforeEach        }
Test               ← test2()                     }  2. teszt
AfterEach          ← valami1()                   }
AfterEach          ← valami2()                   }
```
> 💡 **Lényeg itt:**
> - Ha **több** `@AfterEach` (vagy `@BeforeEach`) van, **mindegyik** lefut minden teszt körül.
> - Nincs saját `@BeforeEach` a leszármazottban, csak az öröklött `TBE` → az fut.
> - `@BeforeAll` **egyszer** legelöl; itt **nincs** `@AfterAll`, így az nem íródik ki.

#### ❓ 5. kérdés – 3. variáns: VAN @AfterAll (két @BeforeEach a leszármazottban)

```java
public class Teszt {
    @BeforeEach public void nana() { ... "TBE" }
}
public class TesztMitirki extends Teszt {
    @BeforeEach public void valami1() { ... "BeforeEach" }
    @BeforeEach public void valami2() { ... "BeforeEach" }
    @Test       public void test1()   { ... "Test" }
    @Test       public void test2()   { ... "Test" }
    @AfterAll static public void party() { ... "AfterAll" }
}
```

**Helyes kiírási sorrend:**
```
TBE                ← öröklött @BeforeEach        }
BeforeEach         ← valami1()                   }  1. teszt
BeforeEach         ← valami2()                   }
Test               ← test1()                     }
TBE                ← öröklött @BeforeEach        }
BeforeEach         ← valami1()                   }  2. teszt
BeforeEach         ← valami2()                   }
Test               ← test2()                     }
AfterAll           ← egyszer, legvégül
```
> 💡 **Lényeg itt:**
> - Itt **nincs** `@BeforeAll` → nem íródik ki az elején.
> - **Van** `@AfterAll` → **egyszer**, a **legvégén** fut (az összes teszt után).
> - Az **ős `@BeforeEach` (TBE)** előbb fut, mint a leszármazott kettő (`valami1`, `valami2`).

> **📌 Összefoglaló szabály az életciklusra:**
> `@BeforeAll` (1x, static, legelöl) → **[** minden `@BeforeEach` (ős előbb) → `@Test` → minden `@AfterEach` **]** tesztenként → `@AfterAll` (1x, static, legvégül).
> Ami nincs a kódban, az nem íródik ki!

---

## 8. Lambda és funkcionális interfészek

### ❓ Default metódus felülírása (6. kérdés)

> *Adott egy interfész. Az ezt megvalósító osztály **nem** definiálhatja felül a `bar` default metódust.*

```java
public interface Zoo {
    int foo(int x);
    default int bar(int x) { return 2 * foo(x); }
}
```

**Helyes válasz: HAMIS** ❌

> 💡 A **default metódus felülírható** a megvalósító osztályban. A `default` csak alapértelmezett implementációt ad, de nem tiltja a felülírást.

> ⚠️ **Vigyázz a fordított megfogalmazással!** Ha így kérdezik:
> *"Az interfészt közvetlenül megvalósító nem absztrakt osztály forráskódjában **nem kell szerepelnie** a `bar` (default) metódus megvalósításának."* → **IGAZ** ✅
> (Mert a default-nak már van implementációja, ezért nem kötelező megadni. Ugyanazt mondja, csak másik oldalról.)

#### ❓ Default + lambda: a Zoo NEM funkcionális interfész!

> *"Metódushívásnál az alábbi interfésszel rendelkező paraméterek helyén **nem adható meg** lambda kifejezés."*
> ```java
> public interface Zoo {
>     int foo(int x);
>     default int bar(int x) { return 2 * foo(x); }
> }
> ```
> **Helyes válasz: IGAZ** ✅
>
> 💡 **Trükkös eset!** A `Zoo`-nak egy absztrakt metódusa van (`foo`) + egy `default` (`bar`), így *elvben* funkcionális interfész lenne.
> A ZH szerint erre az állításra a helyes válasz **IGAZ** (vagyis szerintük itt nem adható meg lambda).
> ⚠️ **Gyakorlati tipp:** ezt a konkrét kérdést érdemes a megadott válasz (IGAZ) alapján **megjegyezni**, mert a korábbi kupacban a majdnem azonos megfogalmazásra (*"nem kell szerepelnie a bar megvalósításának"*) IGAZ volt a válasz – a lényeg, hogy a `default` metódust nem kötelező újraírni, és a feladatkiírás szerint ide lambda nem illeszthető.

---

### ❓ Lambda és funkcionális interfész (7. kérdés – két megfogalmazás!)

> **(a) megfogalmazás:** *"Lambda csak **egyparaméteres** metódusú függvény-interfész helyén állhat."* → **HAMIS** ❌
> **(b) megfogalmazás:** *"Lambda **többparaméteres** metódussal rendelkező függvény-interfész helyén **is** állhat."* → **IGAZ** ✅

> 💡 A lambda **egyetlen absztrakt metódusú** (funkcionális) interfész helyén állhat – a metódusnak **akárhány paramétere** lehet (0, 1, 2, ...). Nem a paraméterszám a lényeg, hanem hogy pontosan **1 absztrakt metódus** legyen. A két állítás ugyanazt mondja, ellenkező előjellel – figyelj, melyiket kérdezik!

---

### ❓ Lambda: csak a paramétereit éri el? (igaz-hamis)

> *"Lambda kifejezésben csak a lambda paramétereiben kapott objektum-referenciákat érhetjük el."*

**Helyes válasz: HAMIS** ❌

> 💡 A lambda **nem csak** a saját paramétereit látja: hozzáfér a környező scope (effektíve final) **lokális változóihoz**, a befoglaló osztály **mezőihez**, és statikus tagokhoz is. Tehát nem igaz, hogy csak a paramétereit érheti el.

---

### ❓ Lambda írása: nagyobbik szám (korábbi kupac)

> *Írjon lambda kifejezést, amely két, paraméterül kapott szám közül visszaadja a nagyobbat! Bármely primitív számtípuson típushelyesen működjön.*

**Helyes megoldás (blokkos forma):**
```java
(a, b) -> { if (a > b) { return a; } else { return b; } }
```
**Rövidebb (ternáris) forma is jó:**
```java
(a, b) -> a > b ? a : b
```
> 💡 Mindkettő működik int/short/long/double típusra is (a fordító a kontextusból kikövetkezteti a típust). A ternáris rövidebb, de a blokkos explicit `return`-nel is tökéletes.

---

### ❓ Lambda írása: null-kezelő választó (korábbi kupac)

> *Írjon lambda kifejezést, amely két objektum-referenciát kap, és visszatér:*
> - *az első paraméter értékével, ha az első nem `null`,*
> - *a második paraméter értékével, ha az első `null`.*

**Helyes megoldás:**
```java
(x, y) -> x != null ? x : y
```
> 💡 Bármilyen objektum-típusra működik, a visszatérési típus a paraméterek típusa.
> (Lényegében a `firstNonNull` / `Objects.requireNonNullElse` logikája.)

---

### ❓ Lambda írása: előjeltartó négyzet (8. kérdés)

> *Írjon lambda kifejezést, amely egy számot kap paraméterül, és:*
> - *negatív számnál a szám **negatív** négyzetét adja vissza (pl. -2 → -4),*
> - *nem-negatív számnál a szám (pozitív) négyzetét adja vissza (pl. 3 → 9).*
> *Bármely primitív számtípuson működjön (egész → egész, valós → valós).*

**Helyes megoldás (blokkos forma):**
```java
(a) -> { if (a >= 0) { return a * a; } else { return a * a * (-1); } }
```
**Rövidebb (ternáris) forma:**
```java
a -> a >= 0 ? a * a : -(a * a)
```
> 💡 A lényeg: a négyzet mindig `a*a`, és **negatív bemenetnél megfordítjuk az előjelet** (`-1`-gyel szorzás vagy unáris mínusz). Így -2 → -(4) = -4, 3 → 9. Működik int/long/double típusra is.

---

## 9. Egyéb kódos feladatok

### 🔑 Metódusok eredeti definíciós helye (osztályhierarchia)

| Metódus | Hol van **először** definiálva |
|---|---|
| `wait()`, `notify()`, `notifyAll()` | **`java.lang.Object`** |
| `sleep()`, `start()`, `join()`, `run()`, `interrupt()`, `getState()`, `currentThread()` | **`java.lang.Thread`** |

> 💡 Mnemonic: a **várakozás/értesítés** minden objektumra érvényes → `Object`. A **szál-specifikus** dolgok → `Thread`.
>
> ⚠️ **Írásmód számít!** Ha teljes nevet kérnek, add meg pontosan: `java.lang.Object`, `java.lang.Thread` (vagy csak `Thread` – mindkettő elfogadott volt). Figyelj a kis/nagybetűkre!

---

### ❓ Hibás puffer: hiányzó notify (2. feladat)

```java
public synchronized void put(T o) {
    l.add(o);
    // ❌ HIÁNYZIK: notifyAll();
}
public synchronized T get() throws InterruptedException {
    while (l.isEmpty()) wait();
    return l.remove(0);
}
```

**A hiba:** a `put()`-ból **hiányzik a `notify()` / `notifyAll()`**.

> 💡 A `get()` `wait()`-tel várakozik, ha üres a puffer. Ha a `put()` nem ébreszti fel a várakozó szálat, az **örökre WAITING-ben marad** → deadlock-szerű beragadás. Javítás: `put()` végére `notifyAll();`.

---

### ❓ Runnable nem indul el önmagában (5. feladat)

```java
public class Test implements Runnable {
    public void run() { ... }
    public static void main(String[] args) {
        Test t = new Test();
        t.start();   // ❌ HIBA: a Runnable-nek NINCS start() metódusa!
    }
}
```

**A hiba:** a `Test` csak `Runnable`-t implementál, **nincs `start()` metódusa**. Egy `Runnable`-ből **Thread-et kell készíteni**, azt lehet indítani.

**Javítás:**
```java
Test t = new Test();
Thread th = new Thread(t);   // becsomagoljuk Thread-be
th.start();                  // ezt már lehet indítani
```
> 💡 `Runnable` = csak a feladat (`run()`). A tényleges szálat a `Thread` reprezentálja → `new Thread(runnable).start()`.

---

### ❓ Map védelme konkurens hozzáféréstől (3. feladat)

> *Adj vissza, hány autója van a `plate` rendszámú autó tulajdonosának. A Map nem szálbiztos, több szál is hozzáférhet → védeni kell!*

```java
public int sameOwner(String plate, Map<String, Person> owners) {
    int n = 0;
    Person p = owners.get(plate);
    synchronized (owners) {              // ⚠️ a MAP-re (owners) kell szinkronizálni!
        for (String s : owners.keySet()) {
            if (owners.get(s).equals(p)) n++;   // equals() kell, nem ==
        }
    }
    return n;
}
```
> 💡 **Két kulcspont a pontokért:**
> 1. A `synchronized` **az `owners` Map-re** menjen (nem `this`-re, nem másra) – különben más metódusok konkurens hozzáférése nincs kizárva.
> 2. A `Person` összehasonlítása **`equals()`-szel** (nem `==`).

---

### ❓ ConcurrentBuffer wrapper (6. feladat) – lásd az 5. szekciót is

> *Generikus `ConcurrentBuffer`, amely a `Buffer<T>`-t delegálja, úgy hogy egyidejűleg csak egy szál használhassa.*
> Megfogalmazás: *"az adott ConcurrentBuffer-t egyidejűleg csak egy szálból"* → **a `this`-en** szinkronizálunk → `synchronized` **metódus** elég.

```java
public class ConcurrentBuffer<T> implements Buffer<T> {
    private Buffer<T> s;

    public ConcurrentBuffer(Buffer<T> s) { this.s = s; }

    public synchronized void put(T t) { s.put(t); }
    public synchronized T get()       { return s.get(); }
}
```
> 💡 Hasonlítsd össze az 5. szekció `SynchedBuffer`-ével: **ott** a *belső* objektumot kellett védeni több wrapper esetén (`synchronized(buff)` blokk), **itt** csak magát az adott wrappert → `synchronized` metódus (this).

### 🧭 Melyik szinkronizáció kell? (bővített döntési szabály)

| Feladat megfogalmazása | Megoldás |
|---|---|
| "ezt az **adott** objektumot egyidejűleg csak egy szál használja" | `synchronized` **metódus** (this-en) |
| "más objektum monitorát ne befolyásolja" | `synchronized` **metódus** (this-en) |
| "ha több wrapper **ugyanazt a belső** objektumot kapja, a belsőhöz csak egy szál férjen" | `synchronized(belsőObjektum)` **blokk** |

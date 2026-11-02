// ===================================================================
//  Java Prog 4. KisZH – kérdésadatbázis
//  Minden kérdés a cheatsheet alapján. Típusok:
//    - "truefalse"  : Igaz/Hamis   (answer: true|false)
//    - "single"     : feleletválasztós, 1 helyes (options[], answer: index)
//    - "text"       : kódot/választ kell írni (answer: minta-megoldás(ok))
//  Minden kérdéshez tartozik: topic, explain (magyarázat).
// ===================================================================

const QUESTIONS = [
  // ---------------------------------------------------------------
  //  SZÁLKEZELÉS – Igaz/Hamis
  // ---------------------------------------------------------------
  { topic: "Szálkezelés", type: "truefalse",
    q: "wait() hívásakor a szálnak az objektum monitorában kell lennie.",
    answer: true,
    explain: "Igaz. wait()/notify()/notifyAll() csak akkor hívható, ha a szál birtokolja az objektum monitorát (synchronized-en belül), különben IllegalMonitorStateException." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "wait() hívásakor a szálnak NEM kell az objektum monitorában lennie.",
    answer: false,
    explain: "Hamis. Pont ellenkezőleg: a monitort birtokolni KELL a wait() híváshoz." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "wait() csak azon az objektumon hívható, aminek a monitorában a hívó szál tartózkodik.",
    answer: true,
    explain: "Igaz. A wait() a birtokolt monitorhoz kötődik." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "wait() csak olyan objektumon hívható, amelyre rászinkronizáltunk.",
    answer: true,
    explain: "Igaz. A szálnak a synchronized blokkon/metóduson keresztül kell birtokolnia az objektum monitorát." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Minden objektumnak van wait() metódusa.",
    answer: true,
    explain: "Igaz. A wait() az Object osztályban van definiálva, így minden objektum örökli." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "notify() hívásakor a szálnak az objektum monitorában kell tartózkodnia.",
    answer: true,
    explain: "Igaz. A notify()/notifyAll() ugyanúgy monitorbirtoklást igényel, mint a wait()." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "notify() hívásakor a szálnak NEM kell az objektum monitorában tartózkodnia.",
    answer: false,
    explain: "Hamis. A monitort birtokolni KELL." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "notifyAll() meghívásakor a végrehajtó szál kilép az objektum monitorából.",
    answer: false,
    explain: "Hamis. A notifyAll() csak jelez; a monitort a szál a synchronized blokk végén (vagy wait()-nél) adja el, nem a notifyAll() hívásakor." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "synchronized módosítójú metódusban nem lehet wait() metódust hívni.",
    answer: false,
    explain: "Hamis. DE IGENIS lehet – sőt, pont ott kell (mert ott birtokoljuk a monitort)." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Szálak NEM képesek saját magukat közvetlenül waiting állapotból notify-jal felébreszteni.",
    answer: true,
    explain: "Igaz. Ha egy szál wait()-ben van, nem fut, így nem tud kódot (notify-t) végrehajtani. Másik szálnak kell felébresztenie." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Szálak képesek saját magukat közvetlenül waiting állapotból notify()-jal felébreszteni.",
    answer: false,
    explain: "Hamis. Waiting közben a szál nem fut, nem tud notify-t hívni." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Nincs olyan várakozó szál, amelyik egyből RUNNABLE állapotú lesz a notifyAll() hatására.",
    answer: true,
    explain: "Igaz. A felébresztett szál először BLOCKED lesz (vissza kell szereznie a monitort), nem közvetlenül RUNNABLE." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "synchronized blokkok egymásba ágyazhatók.",
    answer: true,
    explain: "Igaz. Egy szál egyszerre több monitort is birtokolhat egymásba ágyazott synchronized blokkokkal." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "synchronized blokkok NEM ágyazhatók egymásba.",
    answer: false,
    explain: "Hamis. Egymásba ágyazhatók." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Egy szál egy időben több objektum monitorában is tartózkodhat.",
    answer: true,
    explain: "Igaz. Pl. egymásba ágyazott synchronized blokkokkal." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Egy szál egyszerre csak egy objektum monitorában tartózkodhat.",
    answer: false,
    explain: "Hamis. Egyszerre többen is tartózkodhat (ágyazott synchronized)." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Előfordulhat, hogy két szál (T1 és T2) ugyanazon objektum ugyanazon synchronized metódusát futtatva (T1,T2) sorrendben lép be, de (T2,T1) sorrendben lép ki.",
    answer: true,
    explain: "Igaz. Ha a metóduson belül wait() van, a belépési és kilépési sorrend eltérhet. A synchronized csak a kölcsönös kizárást garantálja, a sorrendet nem." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Nem fordulhat elő, hogy két szál (T1,T2) sorrendben lép be, de (T2,T1) sorrendben lép ki ugyanazon synchronized metódusba.",
    answer: false,
    explain: "Hamis. Előfordulhat (pl. wait() miatt)." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "A t szál belépett x objektum szinkronizált foo metódusába. Az x foo metódusát semmilyen körülmények között nem hajthatja végre másik szál, amíg t vissza nem tért a metódusból.",
    answer: false,
    explain: "Hamis. Ha t a metóduson belül wait()-et hív, elengedi a lockot, így másik szál beléphet, még mielőtt t visszatérne." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Ha egy szál véget ért, nem lehet újraindítani.",
    answer: true,
    explain: "Igaz. Egy TERMINATED szál nem indítható újra." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Amikor egy szál véget ér, a szálat reprezentáló objektum start() metódusának meghívása kivételdobást eredményez.",
    answer: true,
    explain: "Igaz. IllegalThreadStateException dobódik." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Amikor egy szál véget ér, a szálat reprezentáló objektum BÁRMELY metódusának meghívása kivételdobást eredményez.",
    answer: false,
    explain: "Hamis. Csak a start() újrahívása dob kivételt, nem bármely metódus." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Szálat a run() metódus meghívásával indíthatunk.",
    answer: false,
    explain: "Hamis. A run() közvetlen hívása ugyanazon a szálon fut le; új szálat a start() indít." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Egy szálat csak a start() függvényével szabad elindítani, és csak a stop() függvényével szabad leállítani.",
    answer: false,
    explain: "Hamis. A stop() elavult és tiltott; nem így állítunk le szálat." },

  { topic: "Szálkezelés", type: "truefalse",
    q: "Ha van két szálunk, akkor a join metódusaikat csak az elindításuk sorrendjében szabad meghívni.",
    answer: false,
    explain: "Hamis. A join()-okat bármilyen sorrendben lehet hívni." },

  // ---------------------------------------------------------------
  //  SZÁLKEZELÉS – Állapotok / egyéb (single choice)
  // ---------------------------------------------------------------
  { topic: "Szálkezelés", type: "single",
    q: "Egy szál wait() metódust hív (hiba nélkül, rendben visszatér). Milyen állapotokat vesz fel sorrendben a hívástól a visszatérésig?",
    options: [
      "WAITING/TIMED_WAITING → BLOCKED → ---",
      "RUNNABLE → WAITING → RUNNABLE",
      "BLOCKED → WAITING → TERMINATED",
      "WAITING → RUNNABLE → BLOCKED"
    ],
    answer: 0,
    explain: "wait() → elengedi a lockot, WAITING/TIMED_WAITING; felébredéskor vissza kell szereznie a lockot → BLOCKED; a 3. mező kitöltő '---'." },

  { topic: "Szálkezelés", type: "single",
    q: "Milyen állapotban van az a szál, amelyikre a notify és notifyAll metódusok hatással lehetnek?",
    options: ["RUNNABLE", "BLOCKED", "WAITING / TIMED_WAITING", "TERMINATED"],
    answer: 2,
    explain: "Csak a wait()-tel várakozó (WAITING/TIMED_WAITING) szálakat lehet felébreszteni." },

  { topic: "Szálkezelés", type: "single",
    q: "Milyen állapottal tér vissza: Thread.currentThread().getState() ?",
    options: ["NEW", "RUNNABLE", "WAITING / TIMED_WAITING", "BLOCKED"],
    answer: 1,
    explain: "Ha a szál épp ezt a sort futtatja, akkor fut → RUNNABLE." },

  { topic: "Szálkezelés", type: "single",
    q: "A Java osztályhierarchiában melyik osztályban van ELŐSZÖR definiálva a notifyAll() metódus?",
    options: ["java.lang.Thread", "java.lang.Object", "java.lang.Runnable", "java.util.concurrent"],
    answer: 1,
    explain: "A wait/notify/notifyAll az Object osztályban van (minden objektum örökli)." },

  { topic: "Szálkezelés", type: "single",
    q: "A Java osztályhierarchiában melyik osztályban van ELŐSZÖR definiálva a sleep() metódus?",
    options: ["java.lang.Object", "java.lang.Thread", "java.lang.Runnable", "java.lang.System"],
    answer: 1,
    explain: "A sleep() (és start/join/run/interrupt) a Thread osztályban van." },

  { topic: "Szálkezelés", type: "single",
    q: "Mi a különbség a notify() és notifyAll() között?",
    options: [
      "A notify() mindet ébreszti, a notifyAll() csak egyet",
      "A notify() egy (nem meghatározott) várakozó szálat ébreszt, a notifyAll() az összeset",
      "Nincs különbség",
      "A notify() csak TIMED_WAITING-re hat, a notifyAll() csak WAITING-re"
    ],
    answer: 1,
    explain: "notify() = egyetlen (nem determinisztikus) várakozó szálat ébreszt; notifyAll() = minden várakozó szálat." },

  // ---------------------------------------------------------------
  //  SZÁLKEZELÉS – kódfeladatok (text)
  // ---------------------------------------------------------------
  { topic: "Szálkezelés", type: "text",
    q: "Javítsd ki! Cél: két szál (m1, m2, MyThread a Thread leszármazottja) PÁRHUZAMOS futtatása, majd az eredmény megvárása. Írd le a 4 sort helyes sorrendben.",
    answer: ["m1.start(); m2.start(); m1.join(); m2.join();"],
    explain: "ELŐBB mindkét szálat indítjuk (start, start), UTÁNA várjuk be őket (join, join). Tilos a run() hívás, és tilos a start–join–start–join (az nem párhuzamos)." },

  { topic: "Szálkezelés", type: "text",
    q: "Egy korlátlan, szálbiztos puffer (synchronized put/get, a get wait()-tel vár ha üres) hibásan működik. Mi a hiba?",
    answer: ["A put metódusból hiányzik a notify (notifyAll)."],
    explain: "A get() wait()-tel vár, ha üres. Ha a put() nem hív notify()/notifyAll()-t, a várakozó szál örökre WAITING-ben marad." },

  { topic: "Szálkezelés", type: "text",
    q: "Mi a hiba? 'class Test implements Runnable {...} ... Test t = new Test(); t.start();'",
    answer: ["A Runnable-nek nincs start() metódusa, Thread kell köré: new Thread(t).start();"],
    explain: "A Runnable csak a run()-t adja; a tényleges szálat a Thread reprezentálja → new Thread(runnable).start()." },

  // ---------------------------------------------------------------
  //  SZÁLBIZTOS WRAPPER (text)
  // ---------------------------------------------------------------
  { topic: "Wrapper", type: "text",
    q: "ConcurrentStack<T> implements Stack<T>: a konstruktor kap egy Stack<T> s-t, a push/pop delegál, és az adott objektum metódusait egyidejűleg csak 1 szál hívhassa (más monitort ne befolyásoljon). Hogyan szinkronizálsz?",
    answer: ["synchronized metódus (this-en): public synchronized void push(T t){ stack.push(t); } / public synchronized T pop(){ return stack.pop(); }"],
    explain: "'adott objektumot 1 szál / más monitort ne' → synchronized METÓDUS (this-en szinkronizál)." },

  { topic: "Wrapper", type: "text",
    q: "SynchedBuffer<T> implements Buffer<T>: ha több SynchedBuffer UGYANAZT a b objektumot kapja, akkor is csak 1 szál férhessen a b-hez. Hogyan szinkronizálsz?",
    answer: ["synchronized(buff) blokk a belső objektumon: public void put(T t){ synchronized(buff){ buff.put(t); } } / public T get(){ synchronized(buff){ return buff.get(); } }"],
    explain: "'több wrapper ugyanazt a belső objektumot kapja' → a BELSŐ objektum monitorán kell szinkronizálni: synchronized(buff) BLOKK." },

  { topic: "Wrapper", type: "single",
    q: "A feladat: 'több wrapper ugyanazt a belső objektumot kapja, és a belsőhöz egyszerre csak egy szál férjen'. Melyik szinkronizáció kell?",
    options: [
      "synchronized metódus (this-en)",
      "synchronized(belsőObjektum) blokk",
      "semmilyen, a belső már szálbiztos",
      "static synchronized"
    ],
    answer: 1,
    explain: "Megosztott belső objektum védelme → a belső objektum monitorán kell szinkronizálni (synchronized(belső) blokk)." },

  // ---------------------------------------------------------------
  //  JUNIT5 – teszteredmény (single)
  // ---------------------------------------------------------------
  { topic: "JUnit5", type: "single",
    q: "ZH: qux(s) = s+\"zh\". Mi lesz: assertEquals(\"xzh\", zh.qux(\"x\")) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "qux(\"x\")=\"xzh\"; assertEquals tartalmat (equals) néz → egyezik → SUCCESS." },

  { topic: "JUnit5", type: "single",
    q: "ZH: qux(s) = s+\"zh\". Mi lesz: assertNotEquals(\"xzh\", zh.qux(\"x\")) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "A tartalom EGYEZIK, de a teszt azt várta, hogy NE egyezzen → FAILURE." },

  { topic: "JUnit5", type: "single",
    q: "ZH: qux(s) = s+\"zh\". Mi lesz: assertSame(\"xzh\", zh.qux(\"x\")) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "assertSame referenciát (==) néz; a qux új String objektumot ad → más referencia → FAILURE." },

  { topic: "JUnit5", type: "single",
    q: "ZH: foo(i) = i. Mi lesz: assertEquals(2, zh.foo(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "foo(1)=1, ami ≠ 2 → az assert megbukik → FAILURE." },

  { topic: "JUnit5", type: "single",
    q: "ZH: foo(i) = i. Mi lesz: assertEquals(1, zh.foo(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "foo(1)=1, egyezik → SUCCESS." },

  { topic: "JUnit5", type: "single",
    q: "ZH: foo(i) = i. Mi lesz: assumeTrue(2 == zh.foo(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 3,
    explain: "assumeTrue hamis feltételnél NEM FAILURE, hanem SKIPPED (az 'assume' kihagyja a tesztet)." },

  { topic: "JUnit5", type: "single",
    q: "ZH: foo(i) = i. Mi lesz: assumeTrue(1 == zh.foo(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "A feltétel igaz (1==1), a teszt lefut hiba nélkül → SUCCESS." },

  { topic: "JUnit5", type: "single",
    q: "ZH: bar(i) { throw new Exception(); }. Mi lesz: assumeTrue(2 == zh.bar(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 2,
    explain: "A bar(1) kivételt dob a kiértékeléskor → ERROR (nem FAILURE, nem SKIPPED)." },

  { topic: "JUnit5", type: "single",
    q: "ZH: bar(i) { throw new Exception(); }. Mi lesz: assertEquals(1, zh.bar(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 2,
    explain: "A bar(1) kivételt dob → nem várt exception → ERROR." },

  { topic: "JUnit5", type: "single",
    q: "Mi lesz: double a=3.0, b=3.1, delta=0.01; assertEquals(a,b,delta) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "|3.0-3.1|=0.1 > 0.01 → az assert megbukik → FAILURE." },

  { topic: "JUnit5", type: "single",
    q: "Mi lesz: double a=3.00, b=3.01, delta=0.1; assertEquals(a,b,delta) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "|3.00-3.01|=0.01 ≤ 0.1 → teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single",
    q: "Melyik JUnit5 teszt-kimenetel akkor jön létre, ha NEM assertből, hanem váratlan kivételből adódik a hiba?",
    options: ["FAILURE", "ERROR", "SKIPPED", "SUCCESS"],
    answer: 1,
    explain: "assert bukás = FAILURE; bármilyen más (nem várt) exception = ERROR." },

  // ---------------------------------------------------------------
  //  JUNIT5 – életciklus (single)
  // ---------------------------------------------------------------
  { topic: "JUnit5", type: "single",
    q: "JUnit5 életciklus: melyik a helyes futási sorrend egy teszt körül (minden annotáció létezik)?",
    options: [
      "@BeforeEach → @BeforeAll → @Test → @AfterAll → @AfterEach",
      "@BeforeAll (1x) → [@BeforeEach → @Test → @AfterEach] tesztenként → @AfterAll (1x)",
      "@BeforeAll → @AfterAll → @BeforeEach → @Test → @AfterEach",
      "@Test → @BeforeEach → @AfterEach → @BeforeAll → @AfterAll"
    ],
    answer: 1,
    explain: "@BeforeAll egyszer legelöl → minden teszt körül (@BeforeEach → @Test → @AfterEach) → @AfterAll egyszer legvégül." },

  { topic: "JUnit5", type: "truefalse",
    q: "Öröklődésnél az ős @BeforeEach metódusa előbb fut le, mint a leszármazott @BeforeEach metódusa.",
    answer: true,
    explain: "Igaz. A @BeforeEach-eknél az ős fut előbb (a @AfterEach-eknél fordítva, a leszármazott után jönnek az ős utániak)." },

  { topic: "JUnit5", type: "truefalse",
    q: "Ha egy annotáció (pl. @AfterAll) nem szerepel a tesztosztályban, akkor a kimenet azon részhez tartozó sora sem jelenik meg.",
    answer: true,
    explain: "Igaz. Csak az fut le, ami a kódban szerepel." },

  // ---------------------------------------------------------------
  //  LAMBDA / funkcionális interfészek
  // ---------------------------------------------------------------
  { topic: "Lambda", type: "truefalse",
    q: "Egy interfészt megvalósító osztály NEM definiálhatja felül a default metódust.",
    answer: false,
    explain: "Hamis. A default metódus felülírható." },

  { topic: "Lambda", type: "truefalse",
    q: "Az interfészt közvetlenül megvalósító nem absztrakt osztály forráskódjában nem kell szerepelnie a default (bar) metódus megvalósításának.",
    answer: true,
    explain: "Igaz. A default metódusnak már van implementációja, ezért nem kötelező megadni." },

  { topic: "Lambda", type: "truefalse",
    q: "Lambda kifejezés CSAK egyparaméteres metódussal rendelkező függvény-interfész helyén állhat.",
    answer: false,
    explain: "Hamis. A lambda bármilyen funkcionális (1 absztrakt metódusú) interfész helyén állhat, akárhány paraméterrel." },

  { topic: "Lambda", type: "truefalse",
    q: "Lambda kifejezés többparaméteres metódussal rendelkező függvény-interfész helyén IS állhat.",
    answer: true,
    explain: "Igaz. A paraméterszám mindegy; a lényeg, hogy pontosan 1 absztrakt metódus legyen." },

  { topic: "Lambda", type: "truefalse",
    q: "Lambda kifejezésben CSAK a lambda paramétereiben kapott objektum-referenciákat érhetjük el.",
    answer: false,
    explain: "Hamis. A lambda eléri a környező scope effektíve final lokális változóit, a befoglaló osztály mezőit és a statikus tagokat is." },

  { topic: "Lambda", type: "truefalse",
    q: "Zoo { int foo(int x); default int bar(int x){ return 2*foo(x); } }. Metódushívásnál e paraméter helyén NEM adható meg lambda kifejezés.",
    answer: true,
    explain: "A megadott (ZH szerinti) válasz: IGAZ. Trükkös eset – érdemes a megadott válasz alapján megjegyezni." },

  { topic: "Lambda", type: "text",
    q: "Írj lambdát: két objektum-referencia; az elsőt add vissza ha nem null, különben a másodikat.",
    answer: ["(x, y) -> x != null ? x : y"],
    explain: "Null-választó: (x, y) -> x != null ? x : y" },

  { topic: "Lambda", type: "text",
    q: "Írj lambdát: két szám közül add vissza a nagyobbat (bármely primitív számtípuson).",
    answer: ["(a, b) -> a > b ? a : b", "(a,b) -> { if (a > b) { return a; } else { return b; } }"],
    explain: "(a, b) -> a > b ? a : b  (vagy blokkos if/else formában)." },

  { topic: "Lambda", type: "text",
    q: "Írj lambdát: egy szám; nem-negatívnál a négyzetét (a*a), negatívnál a NEGATÍV négyzetét (-a*a). Pl. -2 → -4, 3 → 9.",
    answer: ["a -> a >= 0 ? a*a : -(a*a)", "(a) -> { if (a >= 0) { return a*a; } else { return a*a*(-1); } }"],
    explain: "a -> a >= 0 ? a*a : -(a*a)  — negatív bemenetnél megfordítjuk a négyzet előjelét." },
];

// Elérhető témakörök (a szűrőhöz)
const TOPICS = ["Szálkezelés", "Wrapper", "JUnit5", "Lambda"];

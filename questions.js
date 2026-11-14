// ===================================================================
//  Java Prog 5. KisZH – kérdésadatbázis (SZÁLKEZELÉS)
//  Típusok:
//    - "truefalse"  : Igaz/Hamis   (answer: true|false)
//    - "single"     : feleletválasztós, 1 helyes (options[], answer: index)
//    - "text"       : kódot/választ kell írni (answer: minta-megoldás(ok))
//  Minden kérdéshez: topic, explain (magyarázat).
// ===================================================================

const QUESTIONS = [
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

  { topic: "Szálkezelés", type: "single",
    q: "Egy szál wait() metódust hív (hiba nélkül, rendben visszatér). Milyen állapotokat vesz fel sorrendben a hívástól a visszatérésig?",
    options: ["WAITING/TIMED_WAITING → BLOCKED → ---","RUNNABLE → WAITING → RUNNABLE","BLOCKED → WAITING → TERMINATED","WAITING → RUNNABLE → BLOCKED"],
    answer: 0,
    explain: "wait() → elengedi a lockot, WAITING/TIMED_WAITING; felébredéskor vissza kell szereznie a lockot → BLOCKED; a 3. mező kitöltő '---'." },

  { topic: "Szálkezelés", type: "single",
    q: "Milyen állapotban van az a szál, amelyikre a notify és notifyAll metódusok hatással lehetnek?",
    options: ["RUNNABLE","BLOCKED","WAITING / TIMED_WAITING","TERMINATED"],
    answer: 2,
    explain: "Csak a wait()-tel várakozó (WAITING/TIMED_WAITING) szálakat lehet felébreszteni." },

  { topic: "Szálkezelés", type: "single",
    q: "Milyen állapottal tér vissza: Thread.currentThread().getState() ?",
    options: ["NEW","RUNNABLE","WAITING / TIMED_WAITING","BLOCKED"],
    answer: 1,
    explain: "Ha a szál épp ezt a sort futtatja, akkor fut → RUNNABLE." },

  { topic: "Szálkezelés", type: "single",
    q: "A Java osztályhierarchiában melyik osztályban van ELŐSZÖR definiálva a notifyAll() metódus?",
    options: ["java.lang.Thread","java.lang.Object","java.lang.Runnable","java.util.concurrent"],
    answer: 1,
    explain: "A wait/notify/notifyAll az Object osztályban van (minden objektum örökli)." },

  { topic: "Szálkezelés", type: "single",
    q: "A Java osztályhierarchiában melyik osztályban van ELŐSZÖR definiálva a sleep() metódus?",
    options: ["java.lang.Object","java.lang.Thread","java.lang.Runnable","java.lang.System"],
    answer: 1,
    explain: "A sleep() (és start/join/run/interrupt) a Thread osztályban van." },

  { topic: "Szálkezelés", type: "single",
    q: "Mi a különbség a notify() és notifyAll() között?",
    options: ["A notify() mindet ébreszti, a notifyAll() csak egyet","A notify() egy (nem meghatározott) várakozó szálat ébreszt, a notifyAll() az összeset","Nincs különbség","A notify() csak TIMED_WAITING-re hat, a notifyAll() csak WAITING-re"],
    answer: 1,
    explain: "notify() = egyetlen (nem determinisztikus) várakozó szálat ébreszt; notifyAll() = minden várakozó szálat." },

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
    options: ["synchronized metódus (this-en)","synchronized(belsőObjektum) blokk","semmilyen, a belső már szálbiztos","static synchronized"],
    answer: 1,
    explain: "Megosztott belső objektum védelme → a belső objektum monitorán kell szinkronizálni (synchronized(belső) blokk)." },

  { topic: "Wrapper", type: "text",
    q: "ConcurrentMorph<K,V> implements Morph<K,V>: a konstruktor kap egy Morph<K,V> objektumot, a put(k,v)/get(k) delegál, és az adott ConcurrentMorph metódusait egyidejűleg csak 1 szál hívhassa (más monitort ne befolyásoljon). Hogyan implementálod?",
    answer: ["synchronized metódus (this-en): private Morph<K,V> morph; public ConcurrentMorph(Morph<K,V> m){ this.morph = m; } public synchronized void put(K k, V v){ morph.put(k,v); } public synchronized V get(K k){ return morph.get(k); }"],
    explain: "'az adott objektumot 1 szál / más monitort ne' → synchronized METÓDUS (this-en). Ugyanaz a minta mint a ConcurrentStack-nél, csak put(k,v)/get(k) szignatúrával, a belső morph-nak delegálva." },

  // ---------------------------------------------------------------
  //  SZEMAFOR (saját szinkronizációs osztály írása)
  // ---------------------------------------------------------------
  { topic: "Szemafor", type: "text",
    q: "Írj Semaphore osztályt! Konstruktor: max szabad hely (free=max). p(): ha van szabad hely, csökkenti a free-t és visszatér; ha nincs (free==0), várakozik amíg lesz. v(): növeli a free-t (de sosem több mint max). getFree(): visszaadja a free-t. A p/v/getFree-t több szál hívhatja → kölcsönös kizárás kell. A belső kivételeket (InterruptedException) nem kell elkapni. NEM használhatsz 'new' operátort (pl. nincs saját lock objektum).",
    answer: [
      "public class Semaphore {\n    private int max, free;\n    public Semaphore(int max) { this.max = max; this.free = max; }\n    public synchronized void p() throws InterruptedException {\n        while (free == 0) wait();\n        free--;\n    }\n    public synchronized void v() {\n        if (free < max) free++;\n        notifyAll();\n    }\n    public synchronized int getFree() { return free; }\n}"
    ],
    explain: "Minden metódus synchronized (a this monitorán → nincs 'new' lock objektum). p(): while(free==0) wait(); majd free--. v(): ha free<max akkor free++, és notifyAll() hogy a p()-ben várakozók felébredjenek. getFree(): synchronized getter. A várakozásnál while (nem if!) kell a spurious wakeup miatt." },

  { topic: "Szemafor", type: "text",
    q: "Írj bináris szemafor (Semaphore) osztályt, locked/unlocked állapottal! Konstruktor: paraméter nélkül, nyitott (unlocked) állapotban indul. lock(): ha nyitva van, lezárja és visszatér; ha zárva, várakozik amíg kinyitják. unlock(): kinyitja a szemafort. lock/unlock-ot több szál hívhatja → kölcsönös kizárás. InterruptedException-t nem kell elkapni, 'new' nem használható.",
    answer: [
      "public class Semaphore {\n    private boolean locked = false;\n    public Semaphore() { locked = false; }\n    public synchronized void lock() throws InterruptedException {\n        while (locked) wait();\n        locked = true;\n    }\n    public synchronized void unlock() {\n        locked = false;\n        notifyAll();\n    }\n}"
    ],
    explain: "boolean locked flag. lock(): while(locked) wait(); majd locked=true. unlock(): locked=false; notifyAll(). Minden metódus synchronized (this monitor, nincs 'new'). A while a spurious wakeup/több várakozó miatt kell." },

  { topic: "Szemafor", type: "truefalse",
    q: "A szemafor p() (vagy lock()) metódusában a várakozás feltételét if helyett while ciklussal érdemes vizsgálni (while(free==0) wait();).",
    answer: true,
    explain: "Igaz. A while kell: felébredés után (spurious wakeup, vagy több várakozó szál) újra ellenőrizni kell a feltételt, mielőtt továbbmegyünk. Az if hibás lehet." },

  { topic: "Szemafor", type: "single",
    q: "Miért synchronized a szemafor összes metódusa, és miért nem használunk külön 'new' lock objektumot?",
    options: [
      "Mert a feladat tiltja a new-t; a this monitorán szinkronizálunk (synchronized metódus)",
      "Mert a static mezőket kell védeni",
      "Mert a wait() csak static metódusból hívható",
      "Nincs rá szükség, a szemafor magától szálbiztos"
    ],
    answer: 0,
    explain: "A 'new' tiltott, ezért nem hozhatunk létre külön lock objektumot → a szemafor SAJÁT monitorán (this) szinkronizálunk a synchronized metódusokkal. A wait()/notifyAll() is a this monitorán hívódik." },

];

// Elérhető témakörök (a szűrőhöz)
const TOPICS = ["Szálkezelés", "Wrapper", "Szemafor"];

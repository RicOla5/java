// ===================================================================
//  Java Prog KisZH – kérdésadatbázis (JUnit5 + Lambda)
//  Típusok:
//    - "truefalse"  : Igaz/Hamis   (answer: true|false)
//    - "single"     : feleletválasztós, 1 helyes (options[], answer: index)
//    - "text"       : kódot/választ kell írni (answer: minta-megoldás(ok))
//  Minden kérdéshez: topic, explain (magyarázat).
//  A "generated:true" mezővel jelölt kérdések GYAKORLÓ (nem hivatalos
//  ZH) feladatok – az aktuális JUnit5 anyaghoz, a korábbi évek stílusában.
// ===================================================================

const QUESTIONS = [
  // ===============================================================
  //  JUNIT5 – a korábbi KisZH-kból (hivatalos feladatok)
  // ===============================================================

  // --- "Mi lesz a teszt eredménye?" ---
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
    explain: "2 == 1 hamis → assumeTrue(false). Az assume hamis feltételnél NEM buktatja a tesztet (nem FAILURE/ERROR), hanem kihagyja → SKIPPED." },

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

  // --- életciklus ---
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

  // ===============================================================
  //  JUNIT5 – GENERÁLT GYAKORLÓ feladatok (aktuális anyag)
  // ===============================================================

  // --- assertThrows / exception-kezelés ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "f(i) { throw new IllegalArgumentException(); }. Mi lesz: assertThrows(IllegalArgumentException.class, () -> f(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "A megadott kivétel (IllegalArgumentException) tényleg eldobódik → az assertThrows teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "f(i) { return i; } (nem dob kivételt). Mi lesz: assertThrows(Exception.class, () -> f(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "Az assertThrows kivételt várt, de semmi nem dobódott → az assert megbukik → FAILURE." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "f(i) { throw new NullPointerException(); }. Mi lesz: assertThrows(IllegalStateException.class, () -> f(1)) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "A várt típus (IllegalStateException) NEM egyezik a ténylegesen dobott NullPointerException-nel, és az NPE nem is altípusa → FAILURE (nem ERROR!). Az assertThrows a nem illeszkedő kivételt is FAILURE-ként jelzi." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "f(i) { throw new IllegalArgumentException(); }. Mi lesz: assertThrows(RuntimeException.class, () -> f(1)) ? (az IllegalArgumentException a RuntimeException leszármazottja)",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "Az assertThrows elfogadja a megadott típus ALTÍPUSAIT is. IllegalArgumentException ⊂ RuntimeException → SUCCESS." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Az assertThrows visszaadja az elkapott kivétel objektumot, így annak üzenetét (getMessage()) is lehet tovább assertálni.",
    answer: true,
    explain: "Igaz. Pl.: Exception e = assertThrows(...); assertEquals(\"hiba\", e.getMessage());" },

  // --- assertAll ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertAll( () -> assertEquals(1,1), () -> assertEquals(2,3), () -> assertEquals(4,5) ) ?",
    options: ["SUCCESS", "FAILURE (de mindhárom assert kiértékelődik)", "FAILURE (a 2. után megáll)", "ERROR"],
    answer: 1,
    explain: "Az assertAll MINDEN belső assertet kiértékel (nem áll meg az első bukásnál), majd ha legalább egy bukott → FAILURE. A hibák össze vannak gyűjtve." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertAll( () -> assertEquals(1,1), () -> assertTrue(true) ) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "Minden belső assert teljesül → SUCCESS." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Az assertAll előnye, hogy az összes csoportosított ellenőrzés lefut, és egyszerre jelzi az összes hibát (nem áll meg az első bukásnál).",
    answer: true,
    explain: "Igaz. Ez a fő előnye a külön assert-sorokkal szemben, ahol az első bukás megállítja a tesztet." },

  // --- assertArrayEquals ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertArrayEquals(new int[]{1,2,3}, new int[]{1,2,3}) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "Az assertArrayEquals ELEMENKÉNT hasonlít; azonos hosszú és azonos elemű tömbök → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertArrayEquals(new int[]{1,2,3}, new int[]{1,2}) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "Eltérő hossz → nem egyeznek → FAILURE." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "int[] a = {1,2,3}, b = {1,2,3}; Mi lesz: assertEquals(a, b) ? (NEM assertArrayEquals!)",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "assertEquals tömbökre a REFERENCIÁT hasonlítja (nem tartalmat); a két külön tömb különböző objektum → FAILURE. Tömb tartalmához assertArrayEquals kell!" },

  // --- assertNull / assertNotNull ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "String s = null; Mi lesz: assertNull(s) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "s valóban null → assertNull teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "String s = \"\"; (üres string, NEM null). Mi lesz: assertNull(s) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "Az üres string nem null → assertNull megbukik → FAILURE. (Vigyázz: \"\" != null.)" },

  { topic: "JUnit5", type: "single", generated: true,
    q: "List<Integer> l = new ArrayList<>(); Mi lesz: assertNotNull(l) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "Az l példányosítva van (nem null) → assertNotNull teljesül → SUCCESS. (Üres, de nem null.)" },

  // --- assertTrue / assertFalse ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertTrue(3 > 2) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "3 > 2 igaz → assertTrue teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertFalse(\"alma\".isEmpty()) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "\"alma\".isEmpty() false → assertFalse(false) teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz: assertTrue(\"\".isEmpty() && 2 > 5) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 1,
    explain: "true && false = false → assertTrue(false) megbukik → FAILURE." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "g() { throw new RuntimeException(); }. Mi lesz: assertTrue(g() > 0) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 2,
    explain: "A g() kivételt dob az argumentum kiértékelésekor, mielőtt az assertTrue logikája számítana → ERROR." },

  // --- életciklus (generált, korábbi évek stílusában) ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Egy osztályban van @BeforeAll, @BeforeEach, 2 db @Test, @AfterEach, @AfterAll. Hányszor fut le a @BeforeEach összesen?",
    options: ["1-szer", "2-szer", "4-szer", "0-szor"],
    answer: 1,
    explain: "A @BeforeEach minden teszt ELŐTT lefut → 2 teszt → 2-szer." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Egy osztályban van @BeforeAll, 3 db @Test, @AfterAll. Hányszor fut le a @BeforeAll összesen?",
    options: ["3-szor", "1-szer", "0-szor", "6-szor"],
    answer: 1,
    explain: "A @BeforeAll (static) az ÖSSZES teszt előtt EGYSZER fut, függetlenül a tesztek számától." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Osztály: @BeforeEach pre(){print(\"B\")}; @Test t1(){print(\"1\")}; @Test t2(){print(\"2\")}; @AfterEach post(){print(\"A\")}. Mit ír ki (t1, majd t2 sorrendben)?",
    options: ["B1A B2A", "B12A", "1B A2 BA", "B1B2AA"],
    answer: 0,
    explain: "Minden teszt körül: @BeforeEach → @Test → @AfterEach. Tehát t1: B,1,A; t2: B,2,A → 'B1A B2A'." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "A @BeforeAll és @AfterAll metódusoknak statikusnak kell lenniük (alapértelmezett, PER_METHOD életciklusnál).",
    answer: true,
    explain: "Igaz. Alapértelmezetten (PER_METHOD) a @BeforeAll/@AfterAll static kell legyen, mert nincs példány a futásukkor." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Alapértelmezetten (PER_METHOD életciklus) a JUnit5 minden @Test metódushoz ÚJ tesztosztály-példányt hoz létre.",
    answer: true,
    explain: "Igaz. Ezért nem 'szivárognak át' a példánymezők a tesztek között, és ezért static a @BeforeAll/@AfterAll." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Melyik annotációval jelölünk meg egy tesztet, hogy a JUnit KIHAGYJA (SKIPPED)?",
    options: ["@Skip", "@Ignore", "@Disabled", "@Hidden"],
    answer: 2,
    explain: "JUnit5-ben a @Disabled hagyja ki a tesztet (JUnit4-ben volt @Ignore)." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Melyik a helyes JUnit5 import a @Test annotációhoz?",
    options: [
      "org.junit.Test",
      "org.junit.jupiter.api.Test",
      "junit.framework.Test",
      "java.test.Test"
    ],
    answer: 1,
    explain: "JUnit5 (Jupiter): org.junit.jupiter.api.Test. (A org.junit.Test a régi JUnit4.)" },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Melyik osztályból származnak a statikus assert metódusok JUnit5-ben (pl. assertEquals)?",
    options: [
      "org.junit.Assert",
      "org.junit.jupiter.api.Assertions",
      "org.junit.Assertions",
      "java.util.Assert"
    ],
    answer: 1,
    explain: "JUnit5: org.junit.jupiter.api.Assertions.* (statikus importtal szokás használni)." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Az assertEquals(expected, actual) első paramétere a VÁRT, a második a TÉNYLEGES érték.",
    answer: true,
    explain: "Igaz. Sorrend: (expected, actual). Felcserélve a hibaüzenet lesz félrevezető (de a teszt eredménye ugyanaz)." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Két assertEquals egy teszten belül: assertEquals(1,1); assertEquals(2,3); assertEquals(4,4); — hány assert fut le ténylegesen, és mi az eredmény?",
    options: [
      "Mind a 3 lefut, FAILURE",
      "Csak az első 2 fut le (a 2.-nél megáll), FAILURE",
      "Mind a 3 lefut, SUCCESS",
      "Csak az 1. fut le, ERROR"
    ],
    answer: 1,
    explain: "A sima egymás utáni assertek az ELSŐ bukásnál megállnak (AssertionError). Tehát az 1. OK, a 2. bukik és megáll → a 3. nem fut → FAILURE. (Ha mindet akarod futtatni, assertAll kell.)" },

  // --- JUnit5 vs JUnit4 különbségek / finomságok (generált) ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi lesz a teszt eredménye assumeTrue(false) hatására?",
    options: ["FAILURE", "ERROR", "SKIPPED", "SUCCESS"],
    answer: 2,
    explain: "assumeTrue(false) esetén a feltevés nem teljesül → a teszt kimarad → SKIPPED (nem hiba és nem is siker)." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Melyik osztályban vannak a JUnit5 assume metódusok (pl. assumeTrue)?",
    options: [
      "org.junit.jupiter.api.Assertions",
      "org.junit.jupiter.api.Assumptions",
      "org.junit.Assume",
      "org.junit.jupiter.api.Test"
    ],
    answer: 1,
    explain: "JUnit5: az assume-ok a KÜLÖN org.junit.jupiter.api.Assumptions osztályban vannak (az assertek az Assertions-ben)." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "JUnit5: assertEquals(a, b, delta) harmadik paramétere mi? (double összehasonlítás)",
    options: [
      "A hibaüzenet (message)",
      "A tűréshatár (delta)",
      "A várt érték (expected)",
      "Egy Supplier<String>"
    ],
    answer: 1,
    explain: "A double-ös assertEquals(expected, actual, delta) harmadik paramétere a DELTA (tűréshatár), nem üzenet. Az üzenet JUnit5-ben a NEGYEDIK, utolsó paraméter lenne." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "JUnit5: assertEquals paraméter-sorrendje hogyan helyes, ha üzenetet is adunk?",
    options: [
      "assertEquals(message, expected, actual) — üzenet ELÖL",
      "assertEquals(expected, actual, message) — üzenet HÁTUL",
      "assertEquals(actual, expected) — fordítva",
      "assertEquals(message, actual)"
    ],
    answer: 1,
    explain: "JUnit5-ben az opcionális üzenet HÁTUL van: (expected, actual, message). JUnit4-ben volt elöl az üzenet." },

  // --- assertNotSame vs assertNotEquals (generált) ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "ZH: qux(s) = s + \"zh\" (s változó). Mi lesz: assertNotSame(\"xzh\", zh.qux(\"x\")) ?",
    options: ["SUCCESS", "FAILURE", "ERROR", "SKIPPED"],
    answer: 0,
    explain: "qux egy VÁLTOZÓ (s) összefűzésével futásidőben ÚJ String objektumot gyárt (nincs constant folding). assertNotSame referenciát (!=) néz → a literál \"xzh\" és a futásidejű \"xzh\" különböző objektum → teljesül → SUCCESS." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Mi a különbség az assertNotSame és az assertNotEquals között ugyanarra a \"xzh\" esetre (qux változó-összefűzést ad vissza)?",
    options: [
      "assertNotSame → SUCCESS (referencia ≠), assertNotEquals → FAILURE (érték =)",
      "Mindkettő SUCCESS",
      "Mindkettő FAILURE",
      "assertNotSame → FAILURE, assertNotEquals → SUCCESS"
    ],
    answer: 0,
    explain: "assertNotSame a REFERENCIÁT nézi (!=) → két külön objektum → SUCCESS. assertNotEquals az ÉRTÉKET nézi (equals) → \"xzh\".equals(\"xzh\") igaz → nem teljesül a 'nem egyenlő' → FAILURE." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Ha két String literált fűzünk össze fordítási időben (pl. \"x\" + \"zh\"), a fordító constant foldinggal EGY internált \"xzh\" literált csinál belőle.",
    answer: true,
    explain: "Igaz. Két konstans literál összefűzése fordítási időben történik → ugyanaz az internált objektum. Ezért két literál-összefűzésnél az assertSame IGAZ lenne. (Változó operandusnál viszont futásidejű új objektum.)" },

  // --- tesztmetódus-fejléc követelmények (generált) ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Melyik fejléc felel meg egy JUnit5 tesztmetódusnak?",
    options: [
      "@Test public void f1() { ... }",
      "@Test private void f1() { ... }",
      "@Test public void f1(int i) { ... }",
      "@Test public int f1() { ... }"
    ],
    answer: 0,
    explain: "A megfelelő forma: nem-private, void, paraméter nélküli. A private nem futtatható, a paraméter (sima @Test-nél) nem megengedett, a visszatérési típus pedig void kell legyen (nem int)." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "JUnit5-ben a @Test metódus lehet package-private (nem kötelező public), de private és static nem.",
    answer: true,
    explain: "Igaz. JUnit5: a tesztmetódus lehet package-private/protected/public, de NEM private és NEM static (JUnit4-ben kötelező volt a public)." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Egy sima @Test metódusnak void a visszatérési típusa; ha int-et ad vissza, az nem érvényes tesztmetódus.",
    answer: true,
    explain: "Igaz. A @Test metódus visszatérési típusa void kell legyen." },

  // --- több @BeforeAll / @BeforeEach kiírás (generált) ---
  { topic: "JUnit5", type: "single", generated: true,
    q: "Két @BeforeAll + @BeforeEach + 2 @Test + @AfterAll. Mit ír ki? (BeforeAll→'BeforeAll', BeforeEach→'BeforeEach', Test→'Test', AfterAll→'AfterAll')",
    options: [
      "BeforeAll, BeforeAll, BeforeEach, Test, BeforeEach, Test, AfterAll",
      "BeforeAll, BeforeEach, Test, BeforeEach, Test, AfterAll, AfterAll",
      "BeforeAll, BeforeEach, Test, Test, AfterAll",
      "BeforeEach, BeforeEach, Test, Test, AfterAll"
    ],
    answer: 0,
    explain: "Mindkét @BeforeAll egyszer fut legelöl (sorrendjük nem garantált). Majd tesztenként @BeforeEach→@Test (2×). Végül @AfterAll egyszer. → BeforeAll, BeforeAll, BeforeEach, Test, BeforeEach, Test, AfterAll." },

  { topic: "JUnit5", type: "single", generated: true,
    q: "Két @BeforeEach + 2 @Test + @AfterAll. Mit ír ki?",
    options: [
      "BeforeEach, BeforeEach, Test, BeforeEach, BeforeEach, Test, AfterAll",
      "BeforeEach, Test, Test, AfterAll",
      "BeforeEach, BeforeEach, Test, Test, AfterAll",
      "AfterAll, BeforeEach, BeforeEach, Test, Test"
    ],
    answer: 0,
    explain: "Minden teszt előtt MINDKÉT @BeforeEach lefut. 2 teszt → a (BeforeEach, BeforeEach, Test) blokk 2×. Végül @AfterAll egyszer." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Ha egy osztályban több @BeforeAll metódus is van, akkor mindegyik lefut (egyszer, az összes teszt előtt), de a köztük lévő sorrend nem garantált.",
    answer: true,
    explain: "Igaz. Több @BeforeAll/@BeforeEach mind lefut; az egymáshoz képesti sorrendjük nem garantált." },

  { topic: "JUnit5", type: "truefalse", generated: true,
    q: "Ha egy @BeforeAll metódus nem static (és nincs @TestInstance(PER_CLASS)), a JUnit5 initialization error-ral elutasítja.",
    answer: true,
    explain: "Igaz. Alapértelmezett (PER_METHOD) életciklusnál a @BeforeAll/@AfterAll static kell legyen, különben a teszt el sem indul. Kivétel: PER_CLASS életciklus." },

  // ===============================================================
  //  LAMBDA / funkcionális interfészek
  // ===============================================================
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

  { topic: "Lambda", type: "truefalse", generated: true,
    q: "Egy funkcionális interfésznek pontosan egy absztrakt metódusa van (a default és static metódusok nem számítanak bele).",
    answer: true,
    explain: "Igaz. A @FunctionalInterface pontosan 1 absztrakt metódust követel meg; default/static metódusok lehetnek mellette." },

  { topic: "Lambda", type: "truefalse", generated: true,
    q: "A @FunctionalInterface annotáció kötelező ahhoz, hogy egy interfész helyén lambdát használhassunk.",
    answer: false,
    explain: "Hamis. Az annotáció csak fordítási ellenőrzés (hogy tényleg 1 absztrakt metódus van). Lambda annotáció nélkül is használható, ha az interfész funkcionális." },

  { topic: "Lambda", type: "truefalse", generated: true,
    q: "Lambda kifejezést csak ott használhatunk paraméterként, ahol a paraméter formális típusa egyetlen absztrakt metódussal rendelkező interfész.",
    answer: true,
    explain: "Igaz. A lambda target type-ja mindig funkcionális interfész (pontosan 1 absztrakt metódus)." },

  { topic: "Lambda", type: "truefalse", generated: true,
    q: "Ha lambdát akarunk paraméterként átadni, a paraméter formális típusa BÁRMILYEN interfész lehet.",
    answer: false,
    explain: "Hamis. Nem bármilyen: funkcionális interfésznek (1 absztrakt metódus) kell lennie." },

  { topic: "Lambda", type: "single", generated: true,
    q: "Melyik a helyes lambda egy Runnable-höz (void run())?",
    options: ["() -> System.out.println(\"hi\")", "x -> System.out.println(x)", "(a,b) -> a+b", "() => print()"],
    answer: 0,
    explain: "A Runnable.run() paraméter nélküli, void → () -> ... . A '=>' nem Java szintaxis." },

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
const TOPICS = ["JUnit5", "Lambda"];

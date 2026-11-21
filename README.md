# Java XML kezelés labor

A BME "A programozás alapjai 3." Java XML kezelés labor megoldása. Az
OpenStreetMap BME körüli területét leíró `bme/bme.xml` fájlt dolgozza fel SAX
illetve JDOM segítségével.

## Fordítás

```bash
javac -cp jdom-2.0.6.jar -d out src/*.java
```

## Feladatok és futtatás

A JDOM-os feladatokhoz (4–6) a `jdom-2.0.6.jar`-t is a classpath-ra kell tenni.

### 1. Egyszerű beolvasás SAX-szal
Megszámolja az XML tag-eket tag-enként.
```bash
java -cp out SaxTask -i bme/bme.xml
```

### 2. Egyszerű adatfeldolgozás SAX-szal
Kiszűri a buszmegállókat, kiírja a nevüket (zárójelben a régi név) és a
kerekesszékes megközelíthetőséget.
```bash
java -cp out SaxTask2 -i bme/bme.xml
```

### 3. Összetett adatfeldolgozás SAX-szal
A buszmegállókat a megadott ponttól való távolságuk növekvő sorrendjében
írja ki, a légvonalbeli távolsággal együtt.
```bash
java -cp out SaxTask3 -i bme/bme.xml -lat 47.4786346 -lon 19.0555773
```

### 4. Egyszerű beolvasás JDOM-mal
A JDOM fán végigmenve számolja meg a tag-eket.
```bash
java -cp out:jdom-2.0.6.jar JDomTask -i bme/bme.xml
```

### 5. Egyszerű adatfeldolgozás JDOM-mal
Törli az összes nem buszmegálló node-ot, az eredményt a `-o` fájlba írja.
```bash
java -cp out:jdom-2.0.6.jar DomTask -i bme/bme.xml -o bme/bme_bus.xml
```

### 6. Összetett adatfeldolgozás JDOM-mal
Mint az 5., de a megmaradt buszmegállókhoz felvesz egy
`<tag k="distance" v="..."/>` elemet a megadott ponttól számított távolsággal.
```bash
java -cp out:jdom-2.0.6.jar DomTask2 -i bme/bme.xml -o bme/bme_bus_dist.xml -lat 47.4786346 -lon 19.0555773
```

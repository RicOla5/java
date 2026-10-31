package threadlab;

import java.util.LinkedList;

/**
 * Konkurens működésű FIFO puffer, amely Stringeket tárol, korlátozott
 * kapacitással.
 *
 * <p>A megvalósított követelmények:
 * <ul>
 *   <li>3. feladat: maximum 10 elem, szálbiztos {@code put}/{@code get},
 *       korlátlan várakozással ha tele/üres, az {@code InterruptedException}
 *       továbbadva a hívónak.</li>
 *   <li>8. feladat: a {@code put} és a {@code get} is kiírja a metódus nevét és
 *       a metódust futtató szál azonosítóját.</li>
 * </ul>
 */
public class Fifo {

    /** A puffer maximális elemszáma. */
    private static final int MAX_SIZE = 10;

    /** A tárolt stringek (legöregebb elöl). */
    private final LinkedList<String> list = new LinkedList<>();

    /**
     * Beilleszt egy stringet a FIFO-ba. Ha a puffer tele van, a hívó szál
     * korlátlan ideig várakozik, amíg hely nem szabadul fel.
     *
     * @param s a tárolandó string
     * @throws InterruptedException ha a várakozó szálat megszakítják
     */
    public synchronized void put(String s) throws InterruptedException {
        // 8. feladat: a metódus neve és a futtató szál azonosítója.
        System.out.println("put thread=" + Thread.currentThread().threadId());

        // Várakozás, amíg a puffer tele van. A ciklus véd a hamis
        // ébredések és a több várakozó termelő ellen.
        while (list.size() >= MAX_SIZE) {
            wait();
        }

        list.addLast(s);

        // A puffer tartalma megváltozott: felébresztjük a várakozó szálakat.
        notifyAll();
    }

    /**
     * Visszaadja és törli a legöregebb elemet. Ha a puffer üres, a hívó szál
     * korlátlan ideig várakozik, amíg elem nem kerül bele.
     *
     * @return a legöregebb tárolt string
     * @throws InterruptedException ha a várakozó szálat megszakítják
     */
    public synchronized String get() throws InterruptedException {
        // 8. feladat: a metódus neve és a futtató szál azonosítója.
        System.out.println("get thread=" + Thread.currentThread().threadId());

        // Várakozás, amíg a puffer üres. A ciklus véd a hamis
        // ébredések és a több várakozó fogyasztó ellen.
        while (list.isEmpty()) {
            wait();
        }

        String s = list.removeFirst();

        // A puffer tartalma megváltozott: felébresztjük a várakozó szálakat.
        notifyAll();
        return s;
    }
}

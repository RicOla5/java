package threadlab;

/**
 * Termelő (Producer), amely ismételten üzeneteket ír egy {@link Fifo} pufferbe.
 *
 * <p>A megvalósított követelmények:
 * <ul>
 *   <li>1. feladat: a {@code go()} végtelen ciklusban, adott időközönként egy
 *       üzenetet ad ki {@code <szoveg> <szam> <ido>} formátumban.</li>
 *   <li>2. feladat: önálló szálként futtatható.</li>
 *   <li>3. feladat: kap egy {@link Fifo} puffert; a {@code <szoveg> <szam>}
 *       üzenetet beteszi a pufferbe, majd kiírja:
 *       {@code produced <szoveg> <szam> <ido>}.</li>
 *   <li>5. feladat: a várakozási idő konstruktor paraméter.</li>
 *   <li>6. feladat: a {@link Thread} öröklése helyett a {@link Runnable}
 *       interfészt valósítja meg (szálkezelés delegálással).</li>
 * </ul>
 */
public class Producer implements Runnable {

    /** A konstruktorban átadott szöveg-előtag. */
    private final String text;

    /** A cél FIFO puffer. */
    private final Fifo fifo;

    /** Várakozási idő két termelés között, ezredmásodpercben (5. feladat). */
    private final long waitMillis;

    /**
     * @param text       az üzenet szöveg-előtagja
     * @param fifo       a cél FIFO puffer
     * @param waitMillis várakozási idő két termelés között, ezredmásodpercben
     */
    public Producer(String text, Fifo fifo, long waitMillis) {
        this.text = text;
        this.fifo = fifo;
        this.waitMillis = waitMillis;
    }

    /**
     * Végtelen termelő ciklus: összeállítja a {@code <szoveg> <szam>} üzenetet,
     * beteszi a FIFO-ba, majd a szabványos kimenetre jelzi a termelést.
     */
    public void go() {
        int number = 0;
        try {
            while (true) {
                long time = System.currentTimeMillis() % 100000L;
                String message = text + " " + number;

                // Átadjuk az üzenetet a FIFO-nak (ha tele van, blokkolhat).
                fifo.put(message);

                System.out.println("produced " + message + " " + time);

                number++;

                // Alvás a foglalt várakozás (busy-wait) helyett (1. feladat).
                Thread.sleep(waitMillis);
            }
        } catch (InterruptedException e) {
            // A megszakítást tiszteletben tartva lezárjuk a ciklust.
            Thread.currentThread().interrupt();
        }
    }

    /** A Runnable belépési pontja, amely a {@link #go()}-ra delegál (6. feladat). */
    @Override
    public void run() {
        go();
    }
}

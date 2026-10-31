package threadlab;

/**
 * Fogyasztó (Consumer), amely végtelen ciklusban olvas egy {@link Fifo}
 * pufferből.
 *
 * <p>A megvalósított követelmények (4. feladat):
 * <ul>
 *   <li>Önálló szálként fut.</li>
 *   <li>A konstruktor kap egy {@link Fifo} {@code f} puffert, egy {@code s}
 *       Stringet és egy {@code n} intet.</li>
 *   <li>Az {@code f.get()}-tel olvas, majd kiírja:
 *       {@code consumed <s> <olvasott string> <ido>}.</li>
 *   <li>Ezután {@code n} ezredmásodpercet alszik, majd újrakezdi a ciklust.</li>
 * </ul>
 */
public class Consumer implements Runnable {

    /** A forrás FIFO puffer. */
    private final Fifo f;

    /** A fogyasztó címkéje. */
    private final String s;

    /** Várakozási idő két olvasás között, ezredmásodpercben. */
    private final int n;

    /**
     * @param f a forrás FIFO puffer
     * @param s a fogyasztó címkéje
     * @param n várakozási idő két olvasás között, ezredmásodpercben
     */
    public Consumer(Fifo f, String s, int n) {
        this.f = f;
        this.s = s;
        this.n = n;
    }

    /** Végtelen fogyasztó ciklus. */
    @Override
    public void run() {
        try {
            while (true) {
                // A legöregebb elem kiolvasása (üres puffer esetén blokkolhat).
                String read = f.get();
                long time = System.currentTimeMillis() % 100000L;

                System.out.println("consumed " + s + " " + read + " " + time);

                // Szünet a következő olvasás előtt.
                Thread.sleep(n);
            }
        } catch (InterruptedException e) {
            // A megszakítást tiszteletben tartva lezárjuk a ciklust.
            Thread.currentThread().interrupt();
        }
    }
}

package threadlab;

/**
 * A szál labor belépési pontja.
 *
 * <p>A végső formájában (7. feladat) létrehoz egy közös {@link Fifo} puffert,
 * majd elindít 3 {@link Producer}-t (1000 ms várakozás) és 4 {@link Consumer}-t
 * (100 ms várakozás), mindegyiket saját szálon, közvetlenül egymás után.
 *
 * <p>Az 1., 2. és 4. feladathoz tartozó korábbi változatok külön demó
 * metódusokként szerepelnek, hogy a fejlődés követhető és futtatható maradjon.
 */
public class Application {

    public static void main(String[] args) {
        // 7. feladat: több termelő és fogyasztó egy közös FIFO-n.
        Fifo fifo = new Fifo();

        // 3 termelő, egyenként 1000 ms várakozással.
        for (int i = 1; i <= 3; i++) {
            Producer p = new Producer("producer" + i, fifo, 1000);
            new Thread(p).start();
        }

        // 4 fogyasztó, egyenként 100 ms várakozással.
        for (int i = 1; i <= 4; i++) {
            Consumer c = new Consumer(fifo, "consumer" + i, 100);
            new Thread(c).start();
        }
    }

    // ------------------------------------------------------------------
    // Korábbi feladatok demói (a main nem futtatja; referenciaként maradnak).
    // ------------------------------------------------------------------

    /** 1. feladat: egyetlen termelő szinkron (nem szálon) futtatva. */
    static void demoTask1() {
        new Producer("demo", new Fifo(), 1000).go();
    }

    /** 2. feladat: két termelő szál 0,5 s különbséggel indítva. */
    static void demoTask2() throws InterruptedException {
        Fifo fifo = new Fifo();
        new Thread(new Producer("elso", fifo, 1000)).start();
        Thread.sleep(500);
        new Thread(new Producer("masodik", fifo, 1000)).start();
    }

    /** 4. feladat: egy termelő és egy fogyasztó, külön-külön szálon. */
    static void demoTask4() {
        Fifo fifo = new Fifo();
        new Thread(new Producer("producer", fifo, 1000)).start();
        new Thread(new Consumer(fifo, "consumer", 500)).start();
    }
}

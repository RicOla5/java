package threadlab;

public class Application {

    public static void main(String[] args) {
        Fifo fifo = new Fifo();

        for (int i = 1; i <= 3; i++) {
            Producer p = new Producer("producer" + i, fifo, 1000);
            new Thread(p).start();
        }

        for (int i = 1; i <= 4; i++) {
            Consumer c = new Consumer(fifo, "consumer" + i, 100);
            new Thread(c).start();
        }
    }
}

package threadlab;

public class Producer implements Runnable {
    private String text;

    private Fifo fifo;

    private long waitMillis;

    public Producer(String text, Fifo fifo, long waitMillis) {
        this.text = text;
        this.fifo = fifo;
        this.waitMillis = waitMillis;
    }

    public void go() {
        int number = 0;
        try {
            while (true) {
                long time = System.currentTimeMillis() % 100000L;
                String message = text + " " + number;

                fifo.put(message);

                System.out.println("produced " + message + " " + time);

                number++;

                Thread.sleep(waitMillis);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void run() {
        go();
    }
}

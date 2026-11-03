package threadlab;

public class Consumer implements Runnable {

    private Fifo f;

    private String s;

    private int n;

    public Consumer(Fifo f, String s, int n) {
        this.f = f;
        this.s = s;
        this.n = n;
    }

    @Override
    public void run() {
        try {
            while (true) {
                String read = f.get();
                long time = System.currentTimeMillis() % 100000;

                System.out.println("consumed " + s + " " + read + " " + time);

                Thread.sleep(n);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

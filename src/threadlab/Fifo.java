package threadlab;

import java.util.LinkedList;

public class Fifo {
    private static int MAX_SIZE = 10;

    private LinkedList<String> list = new LinkedList<>();

    public synchronized void put(String s) throws InterruptedException {
        System.out.println("put thread=" + Thread.currentThread().threadId());

        while (list.size() >= MAX_SIZE) {
            wait();
        }

        list.addLast(s);

        notifyAll();
    }

    public synchronized String get() throws InterruptedException {
        System.out.println("get thread=" + Thread.currentThread().threadId());

        while (list.isEmpty()) {
            wait();
        }

        String s = list.removeFirst();

        notifyAll();
        return s;
    }
}

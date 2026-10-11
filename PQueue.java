import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;

public class PQueue<T extends Comparable<T>> implements java.lang.Iterable<T> {

    private final ArrayList<T> items;

    public PQueue() {
        items = new ArrayList<T>();
    }

    public void push(T t) {
        items.add(t);
    }

    public T top() throws EmptyQueueException {
        if (items.isEmpty()) {
            throw new EmptyQueueException("The queue is empty.");
        }
        return Collections.max(items);
    }

    public T pop() throws EmptyQueueException {
        if (items.isEmpty()) {
            throw new EmptyQueueException("The queue is empty.");
        }
        T max = Collections.max(items);
        items.remove(max);
        return max;
    }

    public int size() {
        return items.size();
    }

    public void clear() {
        items.clear();
    }

    public Iterator<T> iterator() {
        ArrayList<T> copy = new ArrayList<T>(items);
        Collections.sort(copy);
        Collections.reverse(copy);
        return copy.iterator();
    }
}

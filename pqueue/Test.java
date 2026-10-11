public class Test {

    public static void main(String[] args) {
        PQueue<String> q = new PQueue<String>();
        q.push("apple");
        q.push("cherry");
        q.push("banana");

        System.out.println("size after 3 pushes: " + q.size());

        try {
            System.out.println("top (largest, not removed): " + q.top());
            System.out.println("pop (largest, removed): " + q.pop());
            System.out.println("size after one pop: " + q.size());
            System.out.println("pop again: " + q.pop());
            System.out.println("pop again: " + q.pop());
            System.out.println("size now: " + q.size());
        } catch (EmptyQueueException e) {
            System.out.println("Unexpected empty queue: " + e.getMessage());
        }

        // Demonstrate EmptyQueueException thrown AND caught on an empty queue.
        try {
            q.pop();
        } catch (EmptyQueueException e) {
            System.out.println("Caught on pop: " + e.getMessage());
        }
        try {
            q.top();
        } catch (EmptyQueueException e) {
            System.out.println("Caught on top: " + e.getMessage());
        }

        // Refill, then clear.
        q.push("x");
        q.push("y");
        System.out.println("size before clear: " + q.size());
        q.clear();
        System.out.println("size after clear: " + q.size());

        // Exact required snippet: must print 4, 3, 2, 1 (largest-first).
        PQueue<Integer> s = new PQueue<Integer>();
        s.push(1); s.push(2); s.push(3); s.push(4);
        for (Integer i : s) { System.out.println(i); }
    }
}

public class EmptyQueueException extends Exception {

    private static final long serialVersionUID = 1L;

    public EmptyQueueException() {
        super();
    }

    public EmptyQueueException(String message) {
        super(message);
    }
}

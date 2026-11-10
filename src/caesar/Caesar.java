package caesar;

public class Caesar {
    public static int ALPHABET_SIZE = 26;

    private Caesar() {
    }

    public static String caesarCode(String input, char offset) {
        return shift(input, charToShift(offset));
    }

    public static String caesarDecode(String input, char offset) {
        return shift(input, ALPHABET_SIZE - charToShift(offset));
    }

    private static int charToShift(char offset) {
        char upper = Character.toUpperCase(offset);
        return Math.floorMod(upper - 'A', ALPHABET_SIZE);
    }

    private static String shift(String input, int shift) {
        if (input == null) {
            return "";
        }
        String upper = input.toUpperCase();
        StringBuilder sb = new StringBuilder(upper.length());
        for (int i = 0; i < upper.length(); i++) {
            char c = upper.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                int pos = c - 'A';
                int newPos = Math.floorMod(pos + shift, ALPHABET_SIZE);
                sb.append((char) ('A' + newPos));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}

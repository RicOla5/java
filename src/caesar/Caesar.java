package caesar;

/**
 * A Caesar-kódolás logikáját megvalósító segédosztály.
 *
 * A felelősségek szétválasztásának elve miatt a kódolás/dekódolás itt, a GUI-tól
 * elkülönítve található (7. feladat). A GUI nem tud a kódolás módjáról, csak
 * meghívja az itteni metódusokat.
 */
public final class Caesar {

    /** Az angol ábécé betűinek száma. */
    public static final int ALPHABET_SIZE = 26;

    private Caesar() {
        // segédosztály, nem példányosítható
    }

    /**
     * Caesar-kódolást valósít meg az angol ábécé nagybetűivel.
     * Amennyiben a bemenet nem nagybetűs, nagybetűssé alakítja.
     *
     * @param input  a kódolni kívánt szöveg
     * @param offset az eltolás mértéke karakterben megadva.
     *               Pl. 'K' esetén A-&gt;K kódolást csinál (eltolás = 'K' - 'A' = 10).
     * @return a kódolt szöveg
     */
    public static String caesarCode(String input, char offset) {
        return shift(input, charToShift(offset));
    }

    /**
     * Caesar-dekódolás: a kódolás ellentettje.
     *
     * @param input  a dekódolni kívánt szöveg
     * @param offset az eltolás mértéke karakterben megadva (ugyanaz, mint kódoláskor)
     * @return a dekódolt szöveg
     */
    public static String caesarDecode(String input, char offset) {
        // A dekódolás az ellentétes irányú eltolás.
        return shift(input, ALPHABET_SIZE - charToShift(offset));
    }

    /**
     * Az eltolás-karaktert ('A'..'Z') 0..25 közötti eltolás-értékké alakítja.
     * Pl. 'A' -> 0, 'K' -> 10, 'Z' -> 25.
     */
    private static int charToShift(char offset) {
        char upper = Character.toUpperCase(offset);
        return mod(upper - 'A', ALPHABET_SIZE);
    }

    /**
     * Elvégzi az eltolást: minden betűt eltol az angol ábécében, körbefordulva
     * 'Z' után 'A'-ra. A nem betű karaktereket változatlanul hagyja.
     *
     * @param input a szöveg
     * @param shift az eltolás mértéke (0..25)
     * @return az eltolt szöveg nagybetűkkel
     */
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
                int newPos = mod(pos + shift, ALPHABET_SIZE);
                sb.append((char) ('A' + newPos));
            } else {
                // Nem betű karaktert változatlanul továbbadunk (pl. szóköz, szám).
                sb.append(c);
            }
        }
        return sb.toString();
    }

    /** Mindig nemnegatív maradékot adó modulo művelet. */
    private static int mod(int a, int m) {
        return ((a % m) + m) % m;
    }
}

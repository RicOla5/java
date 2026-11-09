package caesar;

/**
 * Egyszerű, önálló teszt a Caesar-kódolás működésének ellenőrzéséhez (1. feladat).
 * Külső tesztkeretrendszer nélkül, egyszerű assert-jellegű ellenőrzésekkel fut.
 *
 * Futtatás:  java caesar.CaesarTest
 */
public class CaesarTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        // 'K' eltolás: A->K, azaz 10-es eltolás (a feladatleírás példája).
        check("caesarCode(\"ABC\", 'K')", "KLM", Caesar.caesarCode("ABC", 'K'));

        // 'A' eltolás: nincs változás (A->A, eltolás = 0).
        check("caesarCode(\"HELLO\", 'A')", "HELLO", Caesar.caesarCode("HELLO", 'A'));

        // Körbefordulás 'Z' után 'A'-ra: 'B' eltolással Z->A.
        check("caesarCode(\"XYZ\", 'B')", "YZA", Caesar.caesarCode("XYZ", 'B'));

        // Kisbetűs bemenet nagybetűssé alakul.
        check("caesarCode(\"abc\", 'B')", "BCD", Caesar.caesarCode("abc", 'B'));

        // Nem betű karakterek változatlanok maradnak.
        check("caesarCode(\"A B!C\", 'B')", "B C!D", Caesar.caesarCode("A B!C", 'B'));

        // A dekódolás a kódolás ellentettje: kódolás majd dekódolás -> eredeti.
        String original = "HELLOWORLD";
        char offset = 'K';
        String encoded = Caesar.caesarCode(original, offset);
        String decoded = Caesar.caesarDecode(encoded, offset);
        check("decode(encode(\"" + original + "\", 'K'), 'K')", original, decoded);

        // Konkrét dekódolási ellenőrzés: 'K'-val kódolt "KLM" vissza "ABC".
        check("caesarDecode(\"KLM\", 'K')", "ABC", Caesar.caesarDecode("KLM", 'K'));

        System.out.println();
        System.out.println("Eredmeny: " + passed + " sikeres, " + failed + " sikertelen.");
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static void check(String name, String expected, String actual) {
        boolean ok = expected.equals(actual);
        if (ok) {
            passed++;
            System.out.println("[OK]   " + name + " = \"" + actual + "\"");
        } else {
            failed++;
            System.out.println("[FAIL] " + name
                    + " varva: \"" + expected + "\", kapott: \"" + actual + "\"");
        }
    }
}

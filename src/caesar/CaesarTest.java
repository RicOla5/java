package caesar;

public class CaesarTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        //eltolás
        check("caesarCode(\"ABC\", 'K')", "KLM", Caesar.caesarCode("ABC", 'K'));

        //nincs eltolás
        check("caesarCode(\"HELLO\", 'A')", "HELLO", Caesar.caesarCode("HELLO", 'A'));

        //körbefordul
        check("caesarCode(\"XYZ\", 'B')", "YZA", Caesar.caesarCode("XYZ", 'B'));

        //kisbetű nagybetűvé
        check("caesarCode(\"abc\", 'B')", "BCD", Caesar.caesarCode("abc", 'B'));

        //nem betű változatlan marad
        check("caesarCode(\"A B!C\", 'B')", "B C!D", Caesar.caesarCode("A B!C", 'B'));

        //dekódolás ellenőrzés
        String original = "HELLOWORLD";
        char offset = 'K';
        String encoded = Caesar.caesarCode(original, offset);
        String decoded = Caesar.caesarDecode(encoded, offset);
        check("decode(encode(\"" + original + "\", 'K'), 'K')", original, decoded);

        //konkrét példa KLM ABCbe
        check("caesarDecode(\"KLM\", 'K')", "ABC", Caesar.caesarDecode("KLM", 'K'));

        System.out.println();
        System.out.println("Eredmeny: " + passed + " sikeres, " + failed + " sikertelen.");
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

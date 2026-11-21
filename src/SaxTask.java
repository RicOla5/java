import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 1. feladat: Egyszerű beolvasás SAX-szal.
 *
 * SAX parser segítségével megszámolja az XML fájlban az egyes tag-eket,
 * és tag-enként külön kiírja a darabszámukat.
 *
 * Használat: java SaxTask -i bme.xml
 */
public class SaxTask {

    /** A tag-eket számláló SAX handler. */
    static class TagCounter extends DefaultHandler {
        // LinkedHashMap, hogy a kiírás a tag-ek első előfordulásának sorrendjét kövesse.
        private final Map<String, Integer> counts = new LinkedHashMap<>();

        @Override
        public void startElement(String uri, String localName, String qName,
                                 Attributes attributes) throws SAXException {
            counts.merge(qName, 1, Integer::sum);
        }

        public void printCounts() {
            for (Map.Entry<String, Integer> e : counts.entrySet()) {
                System.out.println(e.getKey() + ": " + e.getValue());
            }
        }
    }

    public static void main(String[] args) {
        String filename = parseInput(args);
        if (filename == null) {
            System.err.println("Használat: java SaxTask -i <xml fájl>");
            return;
        }

        TagCounter h = new TagCounter();
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser p = factory.newSAXParser();
            p.parse(new File(filename), h);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
        h.printCounts();
    }

    /** Kikeresi az -i kapcsoló utáni fájlnevet a parancssori argumentumok közül. */
    static String parseInput(String[] args) {
        for (int i = 0; i < args.length - 1; i++) {
            if ("-i".equals(args[i])) {
                return args[i + 1];
            }
        }
        return null;
    }
}

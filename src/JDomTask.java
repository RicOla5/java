import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 4. feladat: Egyszerű beolvasás JDOM-mal.
 *
 * A JDOM könyvtár segítségével beolvassa az XML fájlt, majd a felépülő
 * fán végigmenve megszámolja az egyes XML tag-eket.
 *
 * Használat: java JDomTask -i bme.xml
 */
public class JDomTask {

    public static void main(String[] args) {
        String filename = SaxTask.parseInput(args);
        if (filename == null) {
            System.err.println("Használat: java JDomTask -i <xml fájl>");
            return;
        }

        SAXBuilder builder = new SAXBuilder();
        Document doc;
        try {
            doc = builder.build(new File(filename));
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        Map<String, Integer> counts = new LinkedHashMap<>();
        count(doc.getRootElement(), counts);

        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }

    /** Rekurzívan bejárja az elemet és leszármazottait, tag-enként számol. */
    static void count(Element element, Map<String, Integer> counts) {
        counts.merge(element.getName(), 1, Integer::sum);
        for (Element child : element.getChildren()) {
            count(child, counts);
        }
    }
}

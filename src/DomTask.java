import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * 5. feladat: Egyszerű adatfeldolgozás JDOM-mal.
 *
 * Az <osm> gyökérelem minden olyan gyerekét (és annak leszármazottait) törli,
 * amely nem buszmegállót tartalmazó <node>. (Egy node akkor buszmegálló, ha van
 * olyan <tag> gyereke, amelyben a "v" attribútum értéke "bus_stop".)
 * Az eredményt a -o kapcsolóval megadott fájlba írja.
 *
 * Használat: java DomTask -i bme.xml -o bme_bus.xml
 */
public class DomTask {

    public static void main(String[] args) {
        String input = SaxTask.parseInput(args);
        String output = parseOutput(args);
        if (input == null || output == null) {
            System.err.println("Használat: java DomTask -i <bemeneti xml> -o <kimeneti xml>");
            return;
        }

        SAXBuilder builder = new SAXBuilder();
        Document doc;
        try {
            doc = builder.build(new File(input));
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        Element root = doc.getRootElement();

        // Külön listába gyűjtjük a törlendő elemeket, majd azokat detach-eljük.
        // A detach közben nem iterálunk a gyereklistán, hogy elkerüljük a módosítási hibát.
        List<Element> toRemove = new ArrayList<>();
        for (Element child : root.getChildren()) {
            if (!isBusStopNode(child)) {
                toRemove.add(child);
            }
        }
        for (Element e : toRemove) {
            e.detach();
        }

        try (FileOutputStream out = new FileOutputStream(output)) {
            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            outputter.output(doc, out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /** Igaz, ha az elem buszmegállót tartalmazó <node>. */
    static boolean isBusStopNode(Element element) {
        if (!"node".equals(element.getName())) {
            return false;
        }
        for (Element tag : element.getChildren("tag")) {
            if ("bus_stop".equals(tag.getAttributeValue("v"))) {
                return true;
            }
        }
        return false;
    }

    /** Kikeresi az -o kapcsoló utáni fájlnevet a parancssori argumentumokból. */
    static String parseOutput(String[] args) {
        for (int i = 0; i < args.length - 1; i++) {
            if ("-o".equals(args[i])) {
                return args[i + 1];
            }
        }
        return null;
    }
}

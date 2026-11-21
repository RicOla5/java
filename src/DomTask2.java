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
 * 6. feladat: Összetett adatfeldolgozás JDOM-mal.
 *
 * Az 5. feladat szűrésén túl a buszmegállót tartalmazó <node>-ok <tag> gyerekei
 * közé felveszi a parancssorban megadott koordinátájú ponttól számított
 * távolságot, pl: <tag k="distance" v="324.123"/>.
 *
 * Használat: java DomTask2 -i bme.xml -o bme_bus.xml -lat 47.4786346 -lon 19.0555773
 */
public class DomTask2 {

    public static void main(String[] args) {
        String input = SaxTask.parseInput(args);
        String output = DomTask.parseOutput(args);
        Double lat = SaxTask3.parseDouble(args, "-lat");
        Double lon = SaxTask3.parseDouble(args, "-lon");
        if (input == null || output == null || lat == null || lon == null) {
            System.err.println("Használat: java DomTask2 -i <bemeneti xml> -o <kimeneti xml> "
                    + "-lat <szélesség> -lon <hosszúság>");
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

        // A nem buszmegálló node-ok törlése (mint az 5. feladatban).
        List<Element> toRemove = new ArrayList<>();
        for (Element child : root.getChildren()) {
            if (!DomTask.isBusStopNode(child)) {
                toRemove.add(child);
            }
        }
        for (Element e : toRemove) {
            e.detach();
        }

        // A megmaradt buszmegállókhoz távolság-tag hozzáadása.
        for (Element node : root.getChildren("node")) {
            double nodeLat = Double.parseDouble(node.getAttributeValue("lat"));
            double nodeLon = Double.parseDouble(node.getAttributeValue("lon"));
            double distance = SaxTask3.dist1(lat, lon, nodeLat, nodeLon);

            Element distTag = new Element("tag");
            distTag.setAttribute("k", "distance");
            distTag.setAttribute("v", String.valueOf(distance));
            node.addContent(distTag);
        }

        try (FileOutputStream out = new FileOutputStream(output)) {
            XMLOutputter outputter = new XMLOutputter(Format.getPrettyFormat());
            outputter.output(doc, out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

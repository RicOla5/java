import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.File;

/**
 * 2. feladat: Egyszerű adatfeldolgozás SAX-szal.
 *
 * Kiszűri a buszmegállókat (highway=bus_stop), és minden megállónál kiírja a
 * nevét (zárójelben a régi nevét) és azt, hogy alkalmas-e kerekesszékes
 * megközelítésre.
 *
 * Használat: java SaxTask2 -i bme.xml
 */
public class SaxTask2 {

    /** Egy buszmegálló adatait tároló osztály. */
    static class BusStop {
        boolean valid = false;
        String name;
        String oldName;
        String wheelchair;
    }

    /** A buszmegállókat kiszűrő SAX handler (egyszerű állapotgép). */
    static class BusStopHandler extends DefaultHandler {
        protected BusStop current;

        @Override
        public void startElement(String uri, String localName, String qName,
                                 Attributes attributes) throws SAXException {
            if ("node".equals(qName)) {
                current = new BusStop();
            } else if ("tag".equals(qName) && current != null) {
                String k = attributes.getValue("k");
                String v = attributes.getValue("v");
                if ("bus_stop".equals(v)) {
                    current.valid = true;
                }
                if (k != null) {
                    switch (k) {
                        case "name":
                            current.name = v;
                            break;
                        case "old_name":
                            current.oldName = v;
                            break;
                        case "wheelchair":
                            current.wheelchair = v;
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        @Override
        public void endElement(String uri, String localName, String qName)
                throws SAXException {
            if ("node".equals(qName)) {
                if (current != null && current.valid) {
                    handleBusStop(current);
                }
                current = null;
            }
        }

        /** Egy érvényes buszmegálló feldolgozása: alapesetben kiírja. */
        protected void handleBusStop(BusStop stop) {
            printBusStop(stop);
        }
    }

    /** Egy buszmegálló kiírása a megadott formátumban. */
    static void printBusStop(BusStop stop) {
        System.out.println("Megálló:");
        String name = stop.name == null ? "" : stop.name;
        if (stop.oldName != null) {
            System.out.println("\tNév: " + name + " (" + stop.oldName + ")");
        } else {
            System.out.println("\tNév: " + name);
        }
        System.out.println("\tKerekesszék: " + (stop.wheelchair == null ? "n/a" : stop.wheelchair));
    }

    public static void main(String[] args) {
        String filename = SaxTask.parseInput(args);
        if (filename == null) {
            System.err.println("Használat: java SaxTask2 -i <xml fájl>");
            return;
        }

        BusStopHandler h = new BusStopHandler();
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser p = factory.newSAXParser();
            p.parse(new File(filename), h);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

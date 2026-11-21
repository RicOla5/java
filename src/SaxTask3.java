import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * 3. feladat: Összetett adatfeldolgozás SAX-szal.
 *
 * A buszmegállókat a parancssorban megadott koordinátájú ponttól
 * (-lat ... -lon ...) való távolságuk növekvő sorrendjében írja ki,
 * minden megállónál feltüntetve a légvonalbeli távolságot is.
 *
 * Használat: java SaxTask3 -i bme.xml -lat 47.4786346 -lon 19.0555773
 */
public class SaxTask3 {

    /** Buszmegálló a 3. feladathoz: tárolja a távolságot és a koordinátákat is. */
    static class BusStop extends SaxTask2.BusStop {
        double distance;
    }

    /**
     * SAX handler: a node kezdetén kiszámítja a megálló távolságát a megadott
     * referenciaponttól, az érvényes megállókat listába gyűjti.
     */
    static class SortingBusStopHandler extends DefaultHandler {
        private final double refLat;
        private final double refLon;
        private final List<BusStop> stops = new ArrayList<>();
        private BusStop current;

        SortingBusStopHandler(double refLat, double refLon) {
            this.refLat = refLat;
            this.refLon = refLon;
        }

        @Override
        public void startElement(String uri, String localName, String qName,
                                 Attributes attributes) throws SAXException {
            if ("node".equals(qName)) {
                current = new BusStop();
                double lat = Double.parseDouble(attributes.getValue("lat"));
                double lon = Double.parseDouble(attributes.getValue("lon"));
                current.distance = dist1(refLat, refLon, lat, lon);
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
                    stops.add(current);
                }
                current = null;
            }
        }

        List<BusStop> getStops() {
            return stops;
        }
    }

    public static void main(String[] args) {
        String filename = SaxTask.parseInput(args);
        Double lat = parseDouble(args, "-lat");
        Double lon = parseDouble(args, "-lon");
        if (filename == null || lat == null || lon == null) {
            System.err.println("Használat: java SaxTask3 -i <xml fájl> -lat <szélesség> -lon <hosszúság>");
            return;
        }

        SortingBusStopHandler h = new SortingBusStopHandler(lat, lon);
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser p = factory.newSAXParser();
            p.parse(new File(filename), h);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        List<BusStop> stops = h.getStops();
        stops.sort((a, b) -> Double.compare(a.distance, b.distance));
        for (BusStop stop : stops) {
            System.out.println("Megálló:");
            String name = stop.name == null ? "" : stop.name;
            if (stop.oldName != null) {
                System.out.println("\tNév: " + name + " (" + stop.oldName + ")");
            } else {
                System.out.println("\tNév: " + name);
            }
            System.out.println("\tKerekesszék: " + (stop.wheelchair == null ? "n/a" : stop.wheelchair));
            System.out.printf("\tTávolság: %.3f m%n", stop.distance);
        }
    }

    /** Kikeresi egy adott kapcsoló utáni double értéket a parancssori argumentumokból. */
    static Double parseDouble(String[] args, String flag) {
        for (int i = 0; i < args.length - 1; i++) {
            if (flag.equals(args[i])) {
                try {
                    return Double.parseDouble(args[i + 1]);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }

    /** Két koordináta közti légvonalbeli távolság (haversine), méterben. */
    static double dist1(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000; // méter
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double dphi = phi2 - phi1;
        double dl = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dphi / 2) * Math.sin(dphi / 2)
                + Math.cos(phi1) * Math.cos(phi2)
                * Math.sin(dl / 2) * Math.sin(dl / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

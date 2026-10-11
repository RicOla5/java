public class NameComparator implements java.util.Comparator<Beer> {

    public int compare(Beer a, Beer b) {
        return a.getName().compareTo(b.getName());
    }
}

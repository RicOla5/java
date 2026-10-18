public class StyleComparator implements java.util.Comparator<Beer> {

    public int compare(Beer a, Beer b) {
        return a.getStyle().compareTo(b.getStyle());
    }
}

public class StrengthComparator implements java.util.Comparator<Beer> {

    public int compare(Beer a, Beer b) {
        return Double.compare(a.getStrength(), b.getStrength());
    }
}

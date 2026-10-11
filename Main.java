import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    protected static void add(ArrayList<Beer> beers, String[] beer) {
    beers.add(new Beer(beer[1], beer[2], Double.parseDouble(beer[3])));
    }
    protected static void list(ArrayList<Beer> beers) {
        for (Beer b : beers) {
            System.out.println(b);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayList<Beer> beers = new ArrayList<>();
        while (true) {
            System.out.print("Enter the command: ");
            String[] beer = scanner.nextLine().split(" ");
            if (beer[0].equals("exit")) {
                break;
            }
            else if (beer[0].equals("add")){
                add(beers, beer);
            }
            else if (beer[0].equals("list")) {
                list(beers);
            }
            
        }
        scanner.close();
    }
}

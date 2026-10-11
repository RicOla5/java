import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Enter the name, type and alcohol content of the first beer (space-separated): ");
            String beer[] = scanner.nextLine().split(" ");
            if (beer[0].equals("exit")) {
                break;
            }
            System.out.print(beer[0] + ": " + beer.length + "\n");
        }
        scanner.close();
    }
}

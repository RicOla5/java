import java.util.Scanner;

public class Ember extends Jatekos{
    private Scanner sc = new Scanner(System.in);

    @Override 
    public void lep(){
        System.out.println("A tét: " + asztal.getTet());
        System.out.println("Mennyivel emeljünk?");
        double emeles = sc.nextDouble();
        asztal.emel(emeles);
    }
}

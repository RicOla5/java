public class Main {
    public static void main(String[] args) {
        try {
            Asztal uresAsztal = new Asztal();
            uresAsztal.ujJatek();
            uresAsztal.kor();
        } catch (NincsJatekos e) {
            System.out.println("Elkapott kivétel: " + e.getMessage());
        }

        try {
            Asztal asztal = new Asztal();
            asztal.ujJatek();
            Kezdo jatekos1 = new Kezdo("Kala Pál");
            Kezdo jatekos2 = new Kezdo("Pofá Zoltán");
            Robot mikrobi = new Robot();
            Mester mester = new Mester(20);
            Nyuszi nyul = new Nyuszi("barna");
            //Ember ember = new Ember();

            asztal.addJatekos(jatekos1);
            asztal.addJatekos(jatekos2);
            asztal.addJatekos(mikrobi);
            asztal.addJatekos(mester);
            asztal.addJatekos(nyul);
            //asztal.addJatekos(ember);


            for (int i = 0; i < 10; i++) {
                asztal.kor();
            }
        } catch (NincsJatekos e) {
            System.out.println("Hiba: " + e.getMessage());
        }

        try {
            Asztal asztal = new Asztal();
            Jatekos ember = new Ember();
            asztal.addJatekos(ember);

            asztal = null;
            System.gc();
        } catch (Exception e) {
            // TODO: handle exception
        }
    }
}

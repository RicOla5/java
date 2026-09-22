public class Robot extends Jatekos {
    private static int szamlalo = 0;
    private int id;
    public Robot(){
        this.id = szamlalo++;
    }
    @Override
    public String toString() {
        return "Robot" + this.id;
    }
    @Override
    public void lep() {
        System.out.println(this.toString() + " kör: " + asztal.getKor());
    }
}

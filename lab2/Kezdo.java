public class Kezdo extends Jatekos {
    private String nev;
    public Kezdo(String nev){
        this.nev = nev;
    }
    @Override
    public String toString() {
        return this.nev;
    }
    @Override 
    public void lep(){
        System.out.println(this.toString() + " kör: " + asztal.getKor());
        if (asztal.getKor() % 2 == 0){
            asztal.emel(1);
        }
    }
}

public class Nyuszi extends Jatekos {
    private String szin;

    public Nyuszi(String szin){
        this.szin = szin;
    }
    @Override
    public String toString() {
        return this.szin;
    }
    @Override 
    public void lep(){
        System.out.println(this.toString() + " kör: " + asztal.getKor());
        if (asztal.getTet() < 50) asztal.emel(5);
        else{
            System.out.println(asztal.getTet() + " Húha!");
        }
    }
}

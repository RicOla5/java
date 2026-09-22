public class Mester extends Jatekos {
    private int fokozat;

    public Mester(int fokozat){
        this.fokozat = fokozat;
    }
    @Override 
    public String toString() {
        return "Mester" + this.fokozat;
    }
    @Override 
    public void lep(){
        System.out.println(this.toString() + " kör: " + asztal.getKor());
        asztal.emel(asztal.getTet() * (this.fokozat/100.0));
    }
}

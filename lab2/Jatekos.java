public abstract class Jatekos {
    protected Asztal asztal;

    public void setAsztal(Asztal a){
        this.asztal = a;
    }

    public abstract void lep();

    @Override 
    protected void finalize() throws Throwable{
        super.finalize();
        System.out.println("Finalize meghívva" + this.toString());
    }
}

import java.util.Random;

public class Asztal {
    private Jatekos[] jatekosok = new Jatekos[10];
    private double tet;
    private int kor;
    private double goal;

    public void ujJatek(){
        this.tet = 0;
        this.kor = 0;
        Random rnd = new Random();
        this.goal = rnd.nextDouble() * 100;
    }

    public void addJatekos(Jatekos j){
        for (int i = 0; i<jatekosok.length; i++){
            if (jatekosok[i] == null){
                jatekosok[i] = j;
                j.setAsztal(this);
                return;
            }
        }
        System.err.println("Az asztal megtelt!");
    }

    public int getKor(){
        return this.kor;
    }

    public void emel(double d){
        this.tet += d;
    }

    public void kor() throws NincsJatekos{
        boolean uresAsztal = true;
        for (int i = 0; i<jatekosok.length; i++){
            if (jatekosok[i] != null){
                uresAsztal = false;
                break;
            }
        }
        if (uresAsztal == true){
            throw new NincsJatekos("Nincs az asztalnál játékos");
        }
        this.kor += 1;
        for (Jatekos j : jatekosok){
            if (j!= null) j.lep();
        }
        System.out.println("Kör vége, jelenlegi tét: " + this.tet);
    }

    public double getTet(){
        return this.tet;
    }
}

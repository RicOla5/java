import java.util.Scanner;
import java.io.File;

public class Main {
    private static File wd = new File(System.getProperty("user.dir"));

    //függvények

    protected static void pwd(String[] cmd) {
        try{
            System.out.println(wd.getCanonicalPath());
        } catch (Exception e) {
            System.out.println(wd.getAbsolutePath());
        }
    }

    protected static void ls(String[] cmd) {
        File dir = new File(wd.getAbsolutePath());
        File[] files = dir.listFiles();
        if (cmd.length < 2) {
            for (File file : files) {
                System.out.println(file.getName());
            }
        } else if (cmd[1].equals("-l")){
            for (File file : files) {
                if (file.isFile()) {
                    System.out.println("f " + file.getName() + "\t" + file.length() + " bájt");
                } else if (file.isDirectory()) {
                    System.out.println("d " + file.getName());
                }
            }
        }
        
    }

    protected static void cd(String[] cmd) {
        if (cmd.length < 2) {
            System.out.println("Hiba: A 'cd' parancs után meg kell adni a könyvtár nevét.");
            return;
        }
        String newPath = cmd[1];
        if (newPath.equals("..")) {
            File parentDir = wd.getParentFile();
            if (parentDir != null && parentDir.exists()) {
                wd = parentDir;
                System.out.println("Váltás a következő könyvtárra: " + wd.getAbsolutePath());
            } else {
                System.out.println("Hiba: Nincs szülő könyvtár.");
            }
            return;
        }
        File newDir = new File(wd, newPath);
        if (newDir.exists() && newDir.isDirectory()) {
            wd = newDir;
            System.out.println("Váltás a következő könyvtárra: " + wd.getAbsolutePath());
        } else {
            System.out.println("Hiba: A megadott könyvtár nem létezik.");
        }
    }

    public static void main(String[] args) {
        while (true) {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Írj be egy parancsot: ");
            String input = scanner.nextLine();
            int spaceCount = input.length() - input.replace(" ", "").length();
            String[] cmd = new String[spaceCount + 1];
            cmd = input.split(" ");
            if (cmd[0].equals("exit")) {
                System.out.println("Kilépés.");
                System.exit(0);
                break;
            } else if (cmd[0].equals("pwd")) { 
                pwd(cmd);
            } else if (cmd[0].equals("ls")) {
                ls(cmd);
            } else if (cmd[0].equals("cd")){
                cd(cmd);
            }
        }
        
    }
}

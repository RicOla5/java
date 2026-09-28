import java.util.Scanner;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.BufferedReader;
import java.util.LinkedList;

public class Main {
    private static File wd = new File(System.getProperty("user.dir"));

    //függvények

    protected static void pwd() {
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
        } else {
            System.out.println("Hiba: Érvénytelen opció a 'ls' parancshoz.");
        }
        
    }

    protected static void cd(String[] cmd) {
        if (!(cmd.length == 2)) {
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

    protected static void rm(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'rm' parancs után meg kell adni a fájl nevét.");
            return;
        }
        File fileToDelete = new File(wd, cmd[1]);
        if (fileToDelete.exists() && fileToDelete.isFile()) {
            if (fileToDelete.delete()) {
                System.out.println("A fájl törölve lett: " + fileToDelete.getAbsolutePath());
            } else {
                System.out.println("Hiba: A fájl törlése sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    protected static void mkdir(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'mkdir' parancs után meg kell adni a könyvtár nevét.");
            return;
        }
        File newDir = new File(wd, cmd[1]);
        if (newDir.exists()) {
            System.out.println("Hiba: A megadott könyvtár már létezik.");
        } else {
            if (newDir.mkdir()) {
                System.out.println("A könyvtár létrehozva: " + newDir.getAbsolutePath());
            } else {
                System.out.println("Hiba: A könyvtár létrehozása sikertelen.");
            }
        }
    }

    protected static void mv(String[] cmd) {
        if (!(cmd.length == 3)) {
            System.out.println("Hiba: A 'mv' parancs után meg kell adni a forrás és cél fájl nevét.");
            return;
        }
        File sourceFile = new File(wd, cmd[1]);
        File targetFile = new File(wd, cmd[2]);
        if (sourceFile.exists() && sourceFile.isFile()) {
            if (sourceFile.renameTo(targetFile)) {
                System.out.println("A fájl átnevezve lett erre: " + targetFile.getAbsolutePath());
            } else {
                System.out.println("Hiba: A fájl átnevezése sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott forrás fájl nem létezik.");
        }
    }

    protected static void cp(String[] cmd) {
        if (!(cmd.length == 3)) {
            System.out.println("Hiba: A 'cp' parancs után meg kell adni a forrás és cél fájl nevét.");
            return;
        }
        File sourceFile = new File(wd, cmd[1]);
        File targetFile = new File(wd, cmd[2]);
        if (sourceFile.exists() && sourceFile.isFile()) {
            try {
                FileInputStream fis = new FileInputStream(sourceFile);
                FileOutputStream fos = new FileOutputStream(targetFile);
                int b;
                while ((b = fis.read()) != -1) {
                    fos.write(b);
                }
                fis.close();
                fos.close();
                System.out.println("A fájl másolva lett erre: " + targetFile.getAbsolutePath());
            } catch (Exception e) {
                System.out.println("Hiba: A fájl másolása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott forrás fájl nem létezik.");
        }
    }

    private static void cat(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'cat' parancs után meg kell adni a fájl nevét.");
            return;
        }
        File fileToRead = new File(wd, cmd[1]);
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                FileReader fr = new FileReader(fileToRead);
                BufferedReader br = new BufferedReader(fr);
                String line;
                while ((line = br.readLine()) != null) {
                    System.out.println(line);
                }
                br.close();
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    private static void cat2(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'cat' parancs után meg kell adni a fájl nevét.");
            return;
        }
        File fileToRead = new File(wd, cmd[1]);
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                Scanner scanner = new Scanner(fileToRead);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    System.out.println(line);
                }
                scanner.close();
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    protected static void length(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'length' parancs után meg kell adni a fájl nevét.");
            return;
        }
        File fileToRead = new File(wd, cmd[1]);
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                int length = 0;
                Scanner scanner = new Scanner(fileToRead);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    length += line.length();
                }
                scanner.close();
                System.out.println("A fájl hossza: " + length + " karakter");
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    public static void head(String[] cmd) {
        if (!(cmd.length == 2) && !(cmd.length == 4)) {
            System.out.println("Hiba: A 'head' parancs után meg kell adni a fájl nevét.");
            return;
        }
        int n = 10;
        File fileToRead = null;
        if (cmd.length == 4){
            if (!cmd[1].equals("-n")) {
                System.out.println("Hiba: Érvénytelen opció a 'head' parancshoz.");
                return;
            }
            try {
                n = Integer.parseInt(cmd[2]);
            } catch (NumberFormatException e) {
                System.out.println("Hiba: Érvénytelen szám a 'head' parancshoz.");
                return;
            }
            fileToRead = new File(wd, cmd[3]);
        } else if (cmd.length == 2) {
            fileToRead = new File(wd, cmd[1]);
        }
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                Scanner scanner = new Scanner(fileToRead);
                int count = 0;
                while (scanner.hasNextLine() && count < n) {
                    String line = scanner.nextLine();
                    System.out.println(line);
                    count++;
                }
                scanner.close();
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
                System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    public static void tail(String[] cmd) {
        if (!(cmd.length == 2) && !(cmd.length == 4)) {
            System.out.println("Hiba: A 'tail' parancs után meg kell adni a fájl nevét.");
            return;
        }
        int n = 10;
        File fileToRead = null;
        if (cmd.length == 4){
            if (!cmd[1].equals("-n")) {
                System.out.println("Hiba: Érvénytelen opció a 'tail' parancshoz.");
                return;
            }
            try {
                n = Integer.parseInt(cmd[2]);
            } catch (NumberFormatException e) {
                System.out.println("Hiba: Érvénytelen szám a 'tail' parancshoz.");
                return;
            }
            fileToRead = new File(wd, cmd[3]);
        } else if (cmd.length == 2) {
            fileToRead = new File(wd, cmd[1]);
        }
        LinkedList<String> lastLines = new LinkedList<>();
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                Scanner scanner = new Scanner(fileToRead);
                int count = 0;
                while (scanner.hasNextLine() && count < n) {
                    String line = scanner.nextLine();
                    lastLines.add(line);
                    count++;
                }
                while (scanner.hasNextLine() && count >= n) {
                    lastLines.removeFirst();
                    String line = scanner.nextLine();
                    lastLines.add(line);
                }
                scanner.close();
                for (String line : lastLines) {
                    System.out.println(line);
                }
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
                System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    public static void wc(String[] cmd) {
        if (!(cmd.length == 2)) {
            System.out.println("Hiba: A 'wc' parancs után meg kell adni a fájl nevét.");
            return;
        }
        File fileToRead = new File(wd, cmd[1]);
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                int lineCount = 0;
                int wordCount = 0;
                int charCount = 0;
                Scanner scanner = new Scanner(fileToRead);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    lineCount++;
                    String[] words = line.split("\\s+");
                    wordCount += words.length;
                    charCount += line.length();
                }
                scanner.close();
                System.out.println("Sorok száma: " + lineCount);
                System.out.println("Szavak száma: " + wordCount);
                System.out.println("Karakterek száma: " + charCount);
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    public static void grep(String[] cmd) {
        if (!(cmd.length == 3)) {
            System.out.println("Hiba: A 'grep' parancs után meg kell adni a keresendő szöveget és a fájl nevét.");
            return;
        }
        String searchTerm = cmd[1];
        File fileToRead = new File(wd, cmd[2]);
        if (fileToRead.exists() && fileToRead.isFile()) {
            try {
                Scanner scanner = new Scanner(fileToRead);
                while (scanner.hasNextLine()) {
                    String line = scanner.nextLine();
                    if (line.matches(".*" + searchTerm + ".*")) {
                        System.out.println(".* " + line + " .*");
                    }
                }
                scanner.close();
            } catch (Exception e) {
                System.out.println("Hiba: A fájl olvasása sikertelen.");
            }
        } else {
            System.out.println("Hiba: A megadott fájl nem létezik.");
        }
    }

    //main függvény
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
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
                pwd();
            } else if (cmd[0].equals("ls")) {
                ls(cmd);
            } else if (cmd[0].equals("cd")){
                cd(cmd);
            } else if (cmd[0].equals("rm")){
                rm(cmd);
            } else if (cmd[0].equals("mkdir")){
                mkdir(cmd);
            } else if (cmd[0].equals("mv")){
                mv(cmd);
            } else if (cmd[0].equals("cp")){
                cp(cmd);
            } else if (cmd[0].equals("cat")){
                cat(cmd);
            } else if (cmd[0].equals("cat2")){
                cat2(cmd);
            } else if (cmd[0].equals("length")){
                length(cmd);
            } else if (cmd[0].equals("head")){
                head(cmd);
            } else if (cmd[0].equals("tail")){
                tail(cmd);
            } else if (cmd[0].equals("wc")){
                wc(cmd);
            } else if (cmd[0].equals("grep")){
                grep(cmd);
            } else {
                System.out.println("Hiba: Érvénytelen parancs.");
            }
        }
        scanner.close();
    }
}
